// SNUG — optional photorealistic render, using Cloudflare Workers AI's free daily allowance (FLUX.2 klein).
// The app sends three small images: the room photo, the same photo with the designed furniture roughly placed,
// and a 3D view of that furniture. The model returns one photo where the new furniture replaces the old one.
//
// Vercel → Project → Settings → Environment Variables:
//   CF_ACCOUNT_ID     required — Cloudflare account id
//   CF_API_TOKEN      required — API token with the "Workers AI" permission
//   CF_IMAGE_MODEL    optional — defaults to @cf/black-forest-labs/flux-2-klein-4b

export const config = { runtime: 'edge' };

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const MAX_IMG = 400_000; // base64 characters per input image (inputs must stay under 512 × 512)

function b64ToBlob(b64) {
  const bin = atob(b64); const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return new Blob([u], { type: 'image/jpeg' });
}

function prompt(hint) {
  return [
    'Image 0 is a photo of a room. Image 1 is the same photo with a new piece of furniture roughly pasted in. Image 2 is a 3D view of that new furniture.',
    'Create a photorealistic photo of the room of image 0 in which the new furniture stands exactly where it is in image 1,',
    'with exactly the same design, proportions, colours, wood, compartments, drawers, doors and handles as image 2.',
    'Remove any older furniture that was in that place. Objects that stood on the old furniture (TV, record player, decorations) now stand on the new furniture.',
    'Correct perspective for the camera of image 0, soft contact shadows on the floor, lighting and colour grading matching the room.',
    'Keep the walls, floor, windows, TV, decorations and framing of image 0 unchanged. No text, no watermark.',
    hint ? 'The new furniture is ' + String(hint).slice(0, 200) + '.' : '',
  ].join(' ');
}

export default async function handler(req) {
  if (req.method !== 'POST') return json({ code: 'method_not_allowed' }, 405);
  const account = process.env.CF_ACCOUNT_ID, token = process.env.CF_API_TOKEN;
  let body; try { body = await req.json(); } catch { return json({ code: 'invalid_request' }, 400); }
  if (body.task === 'ping') return json({ ok: !!(account && token) });
  if (!account || !token) return json({ code: 'not_configured' }, 503);
  const imgs = Array.isArray(body.images) ? body.images.slice(0, 3) : [];
  if (imgs.length !== 3 || imgs.some((x) => typeof x !== 'string' || !x || x.length > MAX_IMG)) return json({ code: 'image_rejected' }, 413);
  const w = Math.round(Math.min(1920, Math.max(256, +body.width || 1024)) / 16) * 16;
  const h = Math.round(Math.min(1920, Math.max(256, +body.height || 768)) / 16) * 16;
  const model = process.env.CF_IMAGE_MODEL || '@cf/black-forest-labs/flux-2-klein-4b';

  // Answer at once and send the image when it is ready: Vercel only waits 25 s for the first byte.
  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(ctrl) {
      const beat = setInterval(() => ctrl.enqueue(enc.encode(' ')), 5000);
      let result;
      try {
        const fd = new FormData();
        fd.append('prompt', prompt(body.hint));
        imgs.forEach((b64, i) => fd.append('input_image_' + i, b64ToBlob(b64), `image${i}.jpg`));
        fd.append('width', String(w)); fd.append('height', String(h));
        const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(account)}/ai/run/${model}`, {
          method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
        const text = await res.text(); let d = null; try { d = JSON.parse(text); } catch {}
        const image = d && (d.result && (d.result.image || d.result.images?.[0]));
        if (res.ok && image) result = { ok: true, image };
        else {
          const msg = (d && (d.errors?.[0]?.message || d.error)) || text.slice(0, 200);
          result = { code: res.status === 429 || /neuron|quota|limit/i.test(String(msg)) ? 'rate_limited' : 'upstream_error', detail: `${res.status} ${String(msg).slice(0, 240)}` };
        }
      } catch (e) { result = { code: 'upstream_error', detail: String(e).slice(0, 200) }; }
      clearInterval(beat); ctrl.enqueue(enc.encode(JSON.stringify(result))); ctrl.close();
    },
  });
  return new Response(stream, { headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
}
