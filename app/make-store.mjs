import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join } from 'node:path';

const ROOT = new URL('./www/', import.meta.url).pathname;
const TYPES = {'.html':'text/html; charset=utf-8','.js':'text/javascript','.png':'image/png','.webmanifest':'application/manifest+json'};
const srv = createServer((q,r)=>{
  const f = join(ROOT, q.url === '/' ? 'index.html' : decodeURIComponent(q.url.split('?')[0]));
  if(!existsSync(f)){ r.writeHead(404); return r.end(); }
  r.writeHead(200,{'Content-Type':TYPES[extname(f)]||'application/octet-stream'});
  r.end(readFileSync(f));
}).listen(8092);

const browser = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium' });

/* --- 1) Öne çıkan görsel (1024x500) --- */
const fg = await browser.newPage({ viewport:{width:1024, height:500} });
await fg.setContent(`<style>
 *{margin:0;box-sizing:border-box;font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;}
 body{width:1024px;height:500px;display:flex;align-items:center;gap:52px;padding:0 70px;
   background:linear-gradient(120deg,#6366F1 0%,#4338CA 45%,#312E81 100%);color:#fff;overflow:hidden;position:relative;}
 .glow{position:absolute;width:620px;height:620px;border-radius:50%;right:-160px;top:-220px;
   background:radial-gradient(circle,rgba(255,255,255,.22),transparent 65%);}
 .mark{width:96px;height:96px;flex:none;display:flex;align-items:center;justify-content:center;
   background:rgba(255,255,255,.14);border-radius:26px;border:1px solid rgba(255,255,255,.28);}
 .bars{display:flex;align-items:center;gap:7px;height:48px;}
 .bars i{display:block;width:8px;background:#fff;border-radius:99px;}
 h1{font-size:60px;font-weight:800;letter-spacing:-.03em;line-height:1.02;}
 p{font-size:23px;opacity:.92;margin-top:14px;line-height:1.45;max-width:19ch;}
 .tags{display:flex;gap:10px;margin-top:24px;flex-wrap:wrap;}
 .tags span{background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.28);
   padding:8px 16px;border-radius:99px;font-size:16px;font-weight:700;}
</style>
<div class="glow"></div>
<div class="mark"><div class="bars">
 <i style="height:42%"></i><i style="height:72%"></i><i style="height:100%"></i><i style="height:62%"></i><i style="height:34%"></i>
</div></div>
<div>
 <h1>MSC Music</h1>
 <p>Müzik sektörünün buluşma noktası</p>
 <div class="tags"><span>Sanatçı</span><span>Menajer</span><span>Mekan</span><span>DJ</span><span>Prodüktör</span></div>
</div>`);
await fg.waitForTimeout(300);
writeFileSync('store/feature-graphic-1024x500.png', await fg.screenshot());

/* --- 2) Telefon ekran görüntüleri (1080x1920) --- */
const shots = [
  { file:'01-akis.png', go: async p => {} },
  { file:'02-kesfet.png', go: async p => { await p.click('.tab[data-view="discovery"]'); } },
  { file:'03-ilanlar.png', go: async p => { await p.click('.tab[data-view="ads"]'); } },
  { file:'04-profil.png', go: async p => { await p.click('.tab[data-view="profile"]'); } },
  { file:'05-mesajlar.png', go: async p => { await p.click('.tab[data-view="messages"]'); } },
  { file:'06-kamera.png', go: async p => {
      await p.click('.tab[data-view="feed"]'); await p.waitForTimeout(400);
      await p.click('#camBtn');
    } },
];

const ctx = await browser.newContext({ viewport:{width:360, height:640}, deviceScaleFactor:3 });
const page = await ctx.newPage();
await page.goto('http://localhost:8092/', {waitUntil:'networkidle'});
await page.addStyleTag({content:'.device{width:100%!important;height:100dvh!important;border-radius:0!important;border:none!important;box-shadow:none!important;} body{display:block!important;}'});
await page.click('.auth-tab[data-tab="signup"]');
await page.click('.role-chip[data-role="artist"]');
await page.fill('#authEmail','sanatci@msc.cc'); await page.fill('#authPassword','sifre1234');
await page.click('#authSubmit');
await page.waitForTimeout(2500);

for(const s of shots){
  await s.go(page);
  await page.waitForTimeout(900);
  writeFileSync('store/screenshots/' + s.file, await page.screenshot());
}
await browser.close(); srv.close();
console.log('mağaza görselleri üretildi');
