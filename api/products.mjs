// SNUG — finds the real product (photo, name, price, direct link) for each line of the shopping list.
// Private test version: it reads the shops' public search pages. IKEA answers with clean JSON;
// Leroy Merlin and Castorama often block automated reads, in which case the app keeps its search link.

export const config = { runtime: 'edge' };
const BUILD = 'v41';   // shown by the hand check, so a stale answer from a cache or an older deploy is obvious

const fixEnc = (t) => { try { return /[\u00C2-\u00C5][\u0080-\u00BF]/.test(t) ? decodeURIComponent(escape(t)) : t; } catch { return t; } };
const json = (body, status = 200, fresh = false) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': fresh ? 'no-store, max-age=0' : 'public, max-age=3600' } });
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const UA_DESK = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
// A shop's search page is often behind a bot wall that looks at the whole set of headers, not just the agent:
// a bare "user-agent + accept: text/html" is the easiest request in the world to refuse.
const pageHeaders = (ua) => ({
  'user-agent': ua,
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'accept-language': 'fr-FR,fr;q=0.9,en;q=0.8',
  'cache-control': 'no-cache',
  'sec-ch-ua': '"Chromium";v="131", "Not_A Brand";v="24"',
  'sec-ch-ua-mobile': ua === UA_DESK ? '?0' : '?1',
  'sec-ch-ua-platform': ua === UA_DESK ? '"macOS"' : '"iOS"',
  'sec-fetch-dest': 'document', 'sec-fetch-mode': 'navigate', 'sec-fetch-site': 'none', 'sec-fetch-user': '?1',
  'upgrade-insecure-requests': '1',
});
// Why a read failed, for the one-tap check at /api/products?shop=…&q=… — the app itself never shows this.
// Carried as an argument rather than kept in a module variable, so several shops can be probed at once
// without their reasons landing in each other's answer.
const noLog = () => {};

async function ikeaTry(q) {
  // two spellings of IKEA's search endpoint: the newer one with explicit parameters, then the bare one
  let d = null;
  for (const u of [`https://sik.search.blue.cdtapps.com/fr/fr/search-result-page?c=sr&v=20210322&types=PRODUCT&size=6&q=${encodeURIComponent(q)}`, `https://sik.search.blue.cdtapps.com/fr/fr/search-result-page?q=${encodeURIComponent(q)}&size=6`]) {
    try { const r = await withTimeout(fetch(u, { headers: { 'user-agent': UA, accept: 'application/json', 'accept-language': 'fr-FR,fr;q=0.9' } }), 6000); if (r.ok) { d = JSON.parse(new TextDecoder('utf-8').decode(await r.arrayBuffer())); if (d) break; } } catch { d = null; }
  }
  if (!d) return null;
  const items = (d && d.searchResultPage && d.searchResultPage.products && d.searchResultPage.products.main && d.searchResultPage.products.main.items) || [];
  const p = (items.find((it) => it && it.product) || {}).product;
  if (!p) return null;
  return { name: fixEnc([p.name, p.typeName, p.itemMeasureReferenceText].filter(Boolean).join(' · ')), price: p.salesPrice && p.salesPrice.numeral, image: p.mainImageUrl || p.contextualImageUrl || '', url: p.pipUrl || '', ref: p.itemNoGlobal || p.itemNo || p.id || '' };
}
// IKEA: the exact wording first, then looser ones (sizes with spaces, then the range name alone)
async function ikea(q) {
  const tries = [q, q.replace(/(\d)x(?=\d)/g, '$1 x '), q.split(/\s+/).filter((w) => !/\d/.test(w)).slice(0, 2).join(' ')].filter((v, i, a) => v && a.indexOf(v) === i);
  for (const t of tries) { const f = await ikeaTry(t); if (f && f.url) return f; }
  return null;
}

// Generic read of a product search page: first product link + image from the page's structured data or markup.
// Two attempts with different fingerprints, a desktop browser first, because that is what the wall expects.
async function genericShop(base, searchUrl, q, linkRe, log = noLog) {
  let r = null;
  for (const ua of [UA_DESK, UA]) {
    const tag = ua === UA_DESK ? 'desktop' : 'mobile';
    try { r = await withTimeout(fetch(searchUrl(q), { headers: pageHeaders(ua), redirect: 'follow' }), 7000); } catch (e) { log(`${tag}: ${String(e && e.message || e)}`); r = null; continue; }
    if (r.ok) break;
    log(`${tag}: HTTP ${r.status}`); r = null;
  }
  if (!r) return null;
  const html = await r.text();
  if (!/<script[^>]+application\/ld\+json/.test(html) && !linkRe.test(html)) log(`page lue (${html.length} o) mais aucun produit dedans`);
  const ld = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)].map((m) => { try { return JSON.parse(m[1]); } catch { return null; } }).filter(Boolean);
  const flat = ld.flatMap((x) => (Array.isArray(x) ? x : [x])).flatMap((x) => (x.itemListElement ? x.itemListElement.map((e) => e.item || e) : [x]));
  const prod = flat.find((x) => x && (x['@type'] === 'Product' || x.url) && (x.image || x.url));
  if (prod) return { name: prod.name || q, price: prod.offers && (prod.offers.price || prod.offers.lowPrice), image: Array.isArray(prod.image) ? prod.image[0] : prod.image || '', url: prod.url && prod.url.startsWith('http') ? prod.url : base + (prod.url || '') };
  const m = linkRe.exec(html);
  if (!m) return null;
  const url = m[1].startsWith('http') ? m[1] : base + m[1];
  const img = (html.slice(m.index, m.index + 4000).match(/<img[^>]+src="(https:[^"]+\.(?:jpe?g|png|webp)[^"]*)"/) || [])[1] || '';
  return { name: q, image: img, url };
}
const SHOPS = {
  ikea,
  'leroy merlin': (q, log) => genericShop('https://www.leroymerlin.fr', (s) => `https://www.leroymerlin.fr/search?q=${encodeURIComponent(s)}`, q, /href="(\/produits\/[^"#?]+\.html)"/, log),
  castorama: (q, log) => genericShop('https://www.castorama.fr', (s) => `https://www.castorama.fr/search?term=${encodeURIComponent(s)}`, q, /href="(\/[^"#?]+\/\d{8,}_CAFR\.prd)"/, log),
  // Candidates, only ever reached by the hand check below: the app never names these shops. Their search paths
  // are guesses, which is on purpose — a 404 means the door is open and the path is wrong (worth pursuing),
  // a 403 means the door is shut to a datacenter address whatever we send (not worth pursuing).
  'brico depot': (q, log) => genericShop('https://www.bricodepot.fr', (s) => `https://www.bricodepot.fr/recherche?q=${encodeURIComponent(s)}`, q, /href="(\/[^"#?]*(?:produit|\/p\/)[^"#?]*)"/, log),
  bricomarche: (q, log) => genericShop('https://www.bricomarche.com', (s) => `https://www.bricomarche.com/recherche?q=${encodeURIComponent(s)}`, q, /href="(\/p\/[^"#?]+)"/, log),
  manomano: (q, log) => genericShop('https://www.manomano.fr', (s) => `https://www.manomano.fr/recherche/${encodeURIComponent(s)}`, q, /href="(\/p\/[^"#?]+)"/, log),
};
const PROBE_Q = { ikea: 'besta', 'leroy merlin': 'panneau pin', castorama: 'panneau pin', 'brico depot': 'panneau pin', bricomarche: 'panneau pin', manomano: 'panneau pin' };

export default async function handler(req) {
  if (req.method === 'GET') { // quick check from a browser: /api/products?shop=ikea&q=besta
    const u = new URL(req.url), fn = SHOPS[String(u.searchParams.get('shop') || 'ikea').toLowerCase()], q = u.searchParams.get('q') || 'besta';
    // never cached: this route exists to say how things stand right now, and an hour-old answer is worse than none
    const probe = async (name) => {
      const w = []; const log = (m) => { if (w.length < 6) w.push(m); };
      let found = null; try { found = await SHOPS[name](PROBE_Q[name] || 'panneau pin', log); } catch (e) { log(String(e && e.message || e)); }
      return { boutique: name, photo: !!(found && found.image), pourquoi: found ? 'trouve' : (w.length ? w : 'aucune piste') };
    };
    if (String(u.searchParams.get('shop') || '').toLowerCase() === 'all') {   // one tap, every shop, side by side
      return json({ build: BUILD, boutiques: await Promise.all(Object.keys(SHOPS).map(probe)) }, 200, true);
    }
    const w = []; const log = (m) => { if (w.length < 6) w.push(m); };
    try { const found = fn ? await fn(q, log) : null; return json({ shop: u.searchParams.get('shop') || 'ikea', q, found, pourquoi: found ? 'trouve' : (w.length ? w : 'aucune piste'), build: BUILD }, 200, true); }
    catch (e) { return json({ error: String(e && e.message || e), pourquoi: w, build: BUILD }, 200, true); }
  }
  if (req.method !== 'POST') return json({ code: 'method_not_allowed' }, 405);
  let body; try { body = await req.json(); } catch { return json({ code: 'invalid_request' }, 400); }
  const items = (Array.isArray(body.items) ? body.items : []).slice(0, 40);
  const out = [];
  let i = 0;
  // A line can name several shops: all of them are asked, and the cheapest real price wins. That is the
  // whole point of the app — the same panel is not the same price in two shops.
  const worker = async () => {
    while (i < items.length) {
      const it = items[i++];
      const names = (Array.isArray(it.shops) ? it.shops : [it.shop]).map((x) => String(x || '').toLowerCase()).filter((x) => SHOPS[x]).slice(0, 4);
      const q = String(it.q || '').slice(0, 120);
      if (!names.length || !q) { out.push({ k: it.k, found: null }); continue; }
      const tries = await Promise.all(names.map(async (name) => {
        try { const f = await SHOPS[name](q); return f ? { ...f, shop: name } : null; } catch { return null; }
      }));
      const got = tries.filter(Boolean);
      const priced = got.filter((f) => +f.price > 0).sort((a, b) => +a.price - +b.price);
      const found = priced[0] || got.find((f) => f.image) || got[0] || null;
      out.push({ k: it.k, found, compare: got.map((f) => ({ shop: f.shop, price: +f.price || null })) });
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  return json({ results: out });
}
