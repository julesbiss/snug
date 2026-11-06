// SNUG — optional AI helper, using Google Gemini's free tier.
// Two fixed tasks only: read a room photo, or turn a free-text request into objects to store.
// The design itself (sizes, prices, notice) always stays with the rules engine in the app.
//
// Vercel → Project → Settings → Environment Variables:
//   GEMINI_API_KEY  required — free key from aistudio.google.com (no billing needed)
//   GEMINI_MODEL    optional — defaults to gemini-3.8-flash

export const config = { runtime: 'edge' };

const MAX_IMAGE = 2_500_000; // base64 characters
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const clip = (s, n) => String(s || '').slice(0, n);

function catalogueText(cat) {
  // cat: { project: [ {id, nom, hint, kind, max, options} ] }
  return Object.entries(cat || {}).slice(0, 8).map(([p, items]) =>
    `- ${clip(p, 20)} : ` + (Array.isArray(items) ? items.slice(0, 20) : []).map((i) =>
      `${clip(i.id, 20)} (${clip(i.nom, 50)}${i.kind === 'flag' ? ', oui/non' : i.kind === 'choice' ? ', choix : ' + (i.options || []).map((o) => clip(o, 20)).join('|') : i.kind === 'number' ? ', nombre en mm' : `, max ${+i.max || 1}`})`).join(', ')).join('\n');
}

function photoPrompt(body) {
  return `Tu aides une application française de meubles sur mesure. Voici la photo de l'espace où l'utilisateur veut un meuble.
Types de projets et objets possibles (identifiants entre parenthèses) :
${catalogueText(body.catalogue)}

Analyse la photo et réponds UNIQUEMENT avec ce JSON :
{"projet":"<un identifiant de projet>","confiance":0.0,
 "objets":{"<identifiant d'objet du projet choisi>":<quantité visible ou probable>},
 "zone":{"x":0.0,"y":0.0,"w":0.0,"h":0.0},
 "estimation_mm":{"A":0,"B":0,"C":0},
 "remarques":["obstacle ou contrainte visible, en une phrase courte"]}
- "zone" : le rectangle où le meuble ira, en fractions de la largeur et de la hauteur de l'image (0 = gauche/haut, 1 = droite/bas). Il touche le sol si le meuble est posé au sol.
- "estimation_mm" : largeur A, hauteur B, profondeur C possibles, estimées d'après les objets de taille connue (porte ≈ 2040 mm, prise ≈ 300 mm du sol, TV…). Mets 0 si tu ne peux pas estimer.
- "remarques" : prises, plinthes, radiateurs, fenêtres, interrupteurs, pente d'escalier, objets à garder. 4 au maximum.
- N'invente rien : seulement ce qui est visible ou très probable.`;
}

function textPrompt(body) {
  return `Tu aides une application française de meubles sur mesure. Projet : ${clip(body.project, 20)}.
Objets possibles pour ce projet (identifiants entre parenthèses) :
${catalogueText({ [clip(body.project, 20)]: body.items })}
Sélection actuelle : ${clip(JSON.stringify(body.current || {}), 600)}

L'utilisateur décrit son besoin : « ${clip(body.text, 1200)} »

Traduis sa demande en objets à ranger. Réponds UNIQUEMENT avec ce JSON :
{"items":{"<identifiant>":<quantité, 0 pour retirer, 1/0 pour oui/non, texte pour un choix>},
 "resume":"ce que tu as compris, en une phrase, en commençant par un verbe (ex. « Ajouté… »)",
 "non_compris":"ce que l'application ne peut pas prendre en compte, ou une chaîne vide"}
- Ne mets que les identifiants listés, et seulement ceux que la demande change.
- Une demande vague (« beaucoup de livres ») devient une quantité raisonnable dans les limites (max).`;
}

const API = 'https://generativelanguage.googleapis.com/v1beta';
const FALLBACKS = ['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-2.5-flash'];

// Open /api/assist?diag=1 in a browser to see whether the key works and which models it can use (the key is never shown).
async function diag(key) {
  if (!key) return json({ key: false });
  try {
    const r = await fetch(`${API}/models?pageSize=200`, { headers: { 'x-goog-api-key': key } });
    const t = await r.text(); let d = null; try { d = JSON.parse(t); } catch {}
    const models = (d && d.models || []).filter((m) => (m.supportedGenerationMethods || []).includes('generateContent')).map((m) => m.name.replace('models/', ''));
    return json({ key: true, keyFormat: key.slice(0, 3) + '…', status: r.status, error: d && d.error ? d.error.message : undefined, models, chosen: process.env.GEMINI_MODEL || null });
  } catch (e) { return json({ key: true, error: String(e) }); }
}

export default async function handler(req) {
  const key = process.env.GEMINI_API_KEY;
  if (req.method === 'GET' && new URL(req.url).searchParams.has('diag')) return diag(key);
  if (req.method !== 'POST') return json({ code: 'method_not_allowed' }, 405);
  let body; try { body = await req.json(); } catch { return json({ code: 'invalid_request' }, 400); }
  if (body.task === 'ping') return json({ ok: !!key });
  if (!key) return json({ code: 'not_configured' }, 503);

  const parts = [];
  if (body.task === 'photo') {
    const img = typeof body.image === 'string' ? body.image : '';
    if (!img || img.length > MAX_IMAGE) return json({ code: 'image_rejected' }, 413);
    parts.push({ text: photoPrompt(body) }, { inline_data: { mime_type: 'image/jpeg', data: img } });
  } else if (body.task === 'text') {
    if (!body.text || !Array.isArray(body.items)) return json({ code: 'invalid_request' }, 400);
    parts.push({ text: textPrompt(body) });
  } else return json({ code: 'invalid_request' }, 400);

  const models = [...new Set([process.env.GEMINI_MODEL, ...FALLBACKS].filter(Boolean))];
  let res = null, detail = '';
  for (const model of models) {
    try {
      res = await fetch(`${API}/models/${encodeURIComponent(model)}:generateContent`, {
        method: 'POST', signal: req.signal,
        headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({ contents: [{ role: 'user', parts }], generationConfig: { responseMimeType: 'application/json', temperature: 0.2 } }),
      });
    } catch { return json({ code: 'upstream_error', detail: 'network' }, 502); }
    if (res.ok) break;
    let msg = ''; try { const e = await res.json(); msg = (e.error && e.error.message) || ''; } catch {}
    detail = `${model}: ${res.status} ${msg}`.slice(0, 300);
    if (res.status === 429) return json({ code: 'rate_limited', detail }, 429);
    if (res.status !== 404 && res.status !== 400) return json({ code: 'upstream_error', detail }, 502); // bad key etc.: trying other models won't help
  }
  if (!res || !res.ok) return json({ code: 'upstream_error', detail }, 502);
  let data; try { data = await res.json(); } catch { return json({ code: 'upstream_error' }, 502); }
  const text = (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('');
  try {
    const a = text.indexOf('{'), b = text.lastIndexOf('}');
    return json({ ok: true, result: JSON.parse(text.slice(a, b + 1)) });
  } catch { return json({ code: 'invalid_json' }, 502); }
}
