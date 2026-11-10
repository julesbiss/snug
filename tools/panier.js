/* SNUG · bouton panier. Runs ON the shop's site (a bookmark), so it may fill that site's guest basket.
   The list arrives in the address: #snug=<base64 JSON [{q, n, url}]>. For each item: find the product page
   (given, or the first search result), load it in a hidden frame of the same site, set the quantity, press "Ajouter au panier". */
(async () => {
  const H = location.hostname;
  const SITES = [
    { re: /leroymerlin\.fr$/, search: (q) => '/search?q=' + encodeURIComponent(q), link: /href="(\/produits\/[^"#?]+\.html)"/, cart: '/checkout/cart' },
    { re: /castorama\.fr$/, search: (q) => '/search?term=' + encodeURIComponent(q), link: /href="([^"#?]+_CAFR\.prd)"/, cart: '/basket' },
    { re: /ikea\.com$/, search: (q) => '/fr/fr/search/?q=' + encodeURIComponent(q), link: /href="(https:\/\/www\.ikea\.com\/fr\/fr\/p\/[^"#?]+)"/, cart: '/fr/fr/shoppingcart/' },
    { re: /but\.fr$/, search: (q) => '/recherche?q=' + encodeURIComponent(q), link: /href="(\/produits\/\d+\/[^"#?]+\.html)"/, cart: '/panier' }];
  const site = SITES.find((s) => s.re.test(H.replace(/^www\./, '')));
  const box = document.createElement('div');
  box.style.cssText = 'position:fixed;z-index:2147483647;left:12px;right:12px;bottom:12px;max-height:60vh;overflow:auto;background:#0E0F11;color:#F2F1EE;font:14px/1.4 system-ui,sans-serif;border:1px solid #E9B26B;border-radius:16px;padding:14px;box-shadow:0 10px 40px rgba(0,0,0,.5)';
  document.body.appendChild(box);
  const say = (h) => { box.innerHTML = '<b style="color:#E9B26B">SNUG · panier</b><br>' + h; };
  let items = [];
  try { const m = location.hash.match(/snug=([^&]+)/); items = JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(m[1]))))); } catch (e) { items = []; }
  if (!site) { say('Ouvrez d’abord le site du magasin depuis SNUG, puis touchez ce favori.'); return; }
  if (!items.length) { say('Aucune liste trouvée. Dans SNUG, touchez « Remplir automatiquement » pour ce magasin, puis touchez ce favori sur la page qui s’ouvre.'); return; }
  const rows = items.map((it) => ({ it, st: '…' }));
  const draw = (end) => say(rows.map((r) => `${r.st === 'ok' ? '✅' : r.st === 'ko' ? '⚠️' : '⏳'} ${r.it.n} × ${String(r.it.q).replace(/[<>&]/g, '')}${r.st === 'ko' && r.url ? ` · <a style="color:#E9B26B" href="${r.url}" target="_blank">ouvrir</a>` : ''}`).join('<br>') + (end ? `<br><br><a style="display:inline-block;background:#E9B26B;color:#17130C;padding:10px 16px;border-radius:20px;font-weight:700;text-decoration:none" href="${site.cart}">Voir mon panier</a>` : ''));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const findUrl = async (it) => {
    if (it.url && new URL(it.url, location.href).hostname === H) return it.url;
    const r = await fetch(site.search(it.q), { credentials: 'include' }); const html = await r.text(); const m = site.link.exec(html);
    return m ? new URL(m[1], location.href).href : null;
  };
  const addIn = (url, n) => new Promise((res) => {
    const f = document.createElement('iframe'); f.style.cssText = 'position:fixed;left:-3000px;top:0;width:1280px;height:900px;opacity:0'; f.src = url;
    let done = false; const fin = (ok) => { if (done) return; done = true; setTimeout(() => f.remove(), 1500); res(ok); };
    f.onload = async () => {
      try {
        const d = f.contentDocument; if (!d) return fin(false);
        for (let k = 0; k < 20; k++) {
          const btn = [...d.querySelectorAll('button,a,[role=button]')].find((b) => /ajouter au panier|add to (bag|cart)/i.test(b.textContent || b.getAttribute('aria-label') || '') && !b.disabled);
          if (btn) {
            const q = d.querySelector('input[type=number],input[name*=quant i],input[aria-label*=quantit i]');
            if (q && n > 1) { const setter = Object.getOwnPropertyDescriptor(f.contentWindow.HTMLInputElement.prototype, 'value').set; setter.call(q, String(n)); q.dispatchEvent(new f.contentWindow.Event('input', { bubbles: true })); q.dispatchEvent(new f.contentWindow.Event('change', { bubbles: true })); await wait(400); }
            btn.click(); await wait(2500);
            if (n > 1 && !q) { for (let j = 1; j < n; j++) { btn.click(); await wait(1500); } }
            return fin(true);
          }
          await wait(500);
        }
        fin(false);
      } catch (e) { fin(false); }
    };
    setTimeout(() => fin(false), 25000);
  });
  draw(false);
  for (const r of rows) {
    try { r.url = await findUrl(r.it); r.st = r.url && await addIn(r.url, Math.max(1, r.it.n | 0)) ? 'ok' : 'ko'; } catch (e) { r.st = 'ko'; }
    draw(false);
  }
  draw(true);
})();
