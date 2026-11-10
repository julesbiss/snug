// SNUG — finds the real product (photo, name, price, direct link) for each line of the shopping list.
// Private test version: it reads the shops' public search pages. IKEA answers with clean JSON;
// Leroy Merlin and Castorama often block automated reads, in which case the app keeps its search link.

export const config = { runtime: 'edge' };

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=3600' } });
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);

async function ikeaTry(q) {
  const r = await withTimeout(fetch(`https://sik.search.blue.cdtapps.com/fr/fr/search-result-page?c=sr&v=20210322&types=PRODUCT&size=6&q=${encodeURIComponent(q)}`, { headers: { 'user-agent': UA, accept: 'application/json' } }), 6000);
  if (!r.ok) return null;
  const d = await r.json();
  const items = (d && d.searchResultPage && d.searchResultPage.products && d.searchResultPage.products.main && d.searchResultPage.products.main.items) || [];
  const p = (items.find((it) => it && it.product) || {}).product;
  if (!p) return null;
  return { name: [p.name, p.typeName, p.itemMeasureReferenceText].filter(Boolean).join(' · '), price: p.salesPrice && p.salesPrice.numeral, image: p.mainImageUrl || p.contextualImageUrl || '', url: p.pipUrl || '', ref: p.itemNoGlobal || p.itemNo || p.id || '' };
}
// IKEA: the exact wording first, then looser ones (sizes with spaces, then the range name alone)
async function ikea(q) {
  const tries = [q, q.replace(/(\d)x(?=\d)/g, '$1 x '), q.split(/\s+/).filter((w) => !/\d/.test(w)).slice(0, 2).join(' ')].filter((v, i, a) => v && a.indexOf(v) === i);
  for (const t of tries) { const f = await ikeaTry(t); if (f && f.url) return f; }
  return null;
}

// Generic read of a product search page: first product link + image from the page's structured data or markup.
async function genericShop(base, searchUrl, q, linkRe) {
  const r = await withTimeout(fetch(searchUrl(q), { headers: { 'user-agent': UA, accept: 'text/html', 'accept-language': 'fr-FR,fr;q=0.9' } }), 6000);
  if (!r.ok) return null;
  const html = await r.text();
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
  'leroy merlin': (q) => genericShop('https://www.leroymerlin.fr', (s) => `https://www.leroymerlin.fr/search?q=${encodeURIComponent(s)}`, q, /href="(\/produits\/[^"#?]+\.html)"/),
  castorama: (q) => genericShop('https://www.castorama.fr', (s) => `https://www.castorama.fr/search?term=${encodeURIComponent(s)}`, q, /href="(\/[^"#?]+\/\d{8,}_CAFR\.prd)"/),
};

export default async function handler(req) {
  if (req.method === 'GET') { // quick check from a browser: /api/products?shop=ikea&q=besta
    const u = new URL(req.url), fn = SHOPS[String(u.searchParams.get('shop') || 'ikea').toLowerCase()], q = u.searchParams.get('q') || 'besta';
    try { return json({ shop: u.searchParams.get('shop') || 'ikea', q, found: fn ? await fn(q) : null }); } catch (e) { return json({ error: String(e && e.message || e) }); }
  }
  if (req.method !== 'POST') return json({ code: 'method_not_allowed' }, 405);
  let body; try { body = await req.json(); } catch { return json({ code: 'invalid_request' }, 400); }
  const items = (Array.isArray(body.items) ? body.items : []).slice(0, 40);
  const out = [];
  let i = 0;
  const worker = async () => {
    while (i < items.length) {
      const it = items[i++]; const fn = SHOPS[String(it.shop || '').toLowerCase()];
      let found = null;
      if (fn && it.q) { try { found = await fn(String(it.q).slice(0, 120)); } catch { found = null; } }
      out.push({ k: it.k, found });
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  return json({ results: out });
}
