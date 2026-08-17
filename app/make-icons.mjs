import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
import { writeFileSync, mkdirSync } from 'node:fs';

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage();

/** MSC logosu: indigo zemin üzerine ekolayzır çubukları */
const draw = (size, {bleed = 0, bg = true} = {}) => `
  const c = document.createElement('canvas');
  c.width = c.height = ${size};
  const x = c.getContext('2d');
  const S = ${size};
  ${bg ? `
  const g = x.createLinearGradient(0,0,S,S);
  g.addColorStop(0,'#6366F1'); g.addColorStop(.55,'#4338CA'); g.addColorStop(1,'#312E81');
  x.fillStyle = g; x.fillRect(0,0,S,S);
  // hafif ışık
  const r = x.createRadialGradient(S*0.3,S*0.25,0,S*0.3,S*0.25,S*0.8);
  r.addColorStop(0,'rgba(255,255,255,.18)'); r.addColorStop(1,'rgba(255,255,255,0)');
  x.fillStyle = r; x.fillRect(0,0,S,S);` : ''}
  // ekolayzır çubukları
  const inset = ${bleed ? 0.30 : 0.22};
  const w = S*(1-inset*2), h = w, ox = S*inset, oy = (S-h)/2;
  const bars = [0.42, 0.72, 1.0, 0.62, 0.34];
  const bw = w/9;
  x.lineCap = 'round';
  x.strokeStyle = '#fff';
  x.lineWidth = bw;
  bars.forEach((v,i) => {
    const bx = ox + bw*0.9 + i*(bw*1.8);
    const bh = h*v;
    x.beginPath();
    x.moveTo(bx, oy + h/2 - bh/2 + bw/2);
    x.lineTo(bx, oy + h/2 + bh/2 - bw/2);
    x.stroke();
  });
  return c.toDataURL('image/png');
`;

const shot = async (size, opts) => {
  const data = await page.evaluate(new Function(draw(size, opts)));
  return Buffer.from(data.split(',')[1], 'base64');
};

mkdirSync('www/icons', { recursive: true });
mkdirSync('resources', { recursive: true });

writeFileSync('www/icons/icon-192.png', await shot(192));
writeFileSync('www/icons/icon-512.png', await shot(512));
// maskable: güvenli alan için içerik daha içeride
writeFileSync('www/icons/icon-maskable-192.png', await shot(192, {bleed:1}));
writeFileSync('www/icons/icon-maskable-512.png', await shot(512, {bleed:1}));
// Capacitor kaynakları
writeFileSync('resources/icon.png', await shot(1024));
writeFileSync('resources/icon-foreground.png', await shot(1024, {bleed:1, bg:false}));
// Play Store 512 ikon
writeFileSync('resources/play-icon-512.png', await shot(512));

await browser.close();
console.log('ikonlar üretildi');
