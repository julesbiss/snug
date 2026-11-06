// SNUG — server function that asks Claude to design one furniture proposal.
// Runs on Vercel (Edge runtime). The Anthropic API key stays on the server, never in the app.
//
// Environment variables (Vercel → Project → Settings → Environment Variables):
//   ANTHROPIC_API_KEY  required — your key from console.anthropic.com
//   ANTHROPIC_MODEL    optional — defaults to claude-sonnet-5-5
//   ACCESS_CODE        optional — if set, testers must type this code in the app

export const config = { runtime: 'edge' };

const MAX_PROMPT = 60000;          // characters
const MAX_IMAGE = 4 * 1024 * 1024; // base64 characters (~3 MB image)

const json = (body, status) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

export default async function handler(req) {
  if (req.method !== 'POST') return json({ code: 'method_not_allowed' }, 405);

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return json({ code: 'not_configured' }, 503);

  const access = process.env.ACCESS_CODE;
  if (access && req.headers.get('x-snug-code') !== access) return json({ code: 'bad_code' }, 401);

  let body;
  try { body = await req.json(); } catch { return json({ code: 'invalid_request' }, 400); }
  const prompt = typeof body.prompt === 'string' ? body.prompt : '';
  const image = typeof body.image === 'string' ? body.image : '';
  if (!prompt || prompt.length > MAX_PROMPT) return json({ code: 'invalid_request' }, 400);
  if (image.length > MAX_IMAGE) return json({ code: 'image_rejected' }, 413);

  const content = [];
  if (image) content.push({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: image } });
  content.push({ type: 'text', text: prompt });

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    signal: req.signal,
    headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5',
      max_tokens: 8000,
      stream: true,
      system: 'Tu es concepteur de meubles sur mesure. Tu réponds uniquement avec un objet JSON valide, sans aucun texte autour.',
      messages: [{ role: 'user', content }],
    }),
  });

  if (!upstream.ok) {
    const code = upstream.status === 429 || upstream.status === 529 ? 'rate_limited' : 'upstream_error';
    return json({ code, status: upstream.status }, code === 'rate_limited' ? 429 : 502);
  }

  // Turn Anthropic's server-sent events into a plain stream of text, so the app can show progress.
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const stream = new ReadableStream({
    async start(ctrl) {
      const reader = upstream.body.getReader();
      let buf = '';
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          let i;
          while ((i = buf.indexOf('\n\n')) >= 0) {
            const event = buf.slice(0, i);
            buf = buf.slice(i + 2);
            const line = event.split('\n').find((l) => l.startsWith('data: '));
            if (!line) continue;
            try {
              const d = JSON.parse(line.slice(6));
              if (d.type === 'content_block_delta' && d.delta && d.delta.type === 'text_delta') ctrl.enqueue(enc.encode(d.delta.text));
            } catch { /* ignore keep-alive and malformed lines */ }
          }
        }
      } catch { /* client went away */ }
      ctrl.close();
    },
  });
  return new Response(stream, { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } });
}
