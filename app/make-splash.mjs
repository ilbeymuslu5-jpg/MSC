import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
import { writeFileSync } from 'node:fs';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage();
const make = async (S, dark) => {
  const data = await page.evaluate(({S, dark}) => {
    const c = document.createElement('canvas'); c.width = c.height = S;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0,0,S,S);
    if(dark){ g.addColorStop(0,'#312E81'); g.addColorStop(1,'#0B0F19'); }
    else { g.addColorStop(0,'#6366F1'); g.addColorStop(.55,'#4338CA'); g.addColorStop(1,'#312E81'); }
    x.fillStyle = g; x.fillRect(0,0,S,S);
    // ortada ekolayzır işareti
    const w = S*0.22, h = w, ox = (S-w)/2, oy = (S-h)/2;
    const bars = [0.42,0.72,1.0,0.62,0.34], bw = w/9;
    x.lineCap='round'; x.strokeStyle='#fff'; x.lineWidth=bw;
    bars.forEach((v,i)=>{
      const bx = ox + bw*0.9 + i*(bw*1.8), bh = h*v;
      x.beginPath(); x.moveTo(bx, oy+h/2-bh/2+bw/2); x.lineTo(bx, oy+h/2+bh/2-bw/2); x.stroke();
    });
    return c.toDataURL('image/png');
  }, {S, dark});
  return Buffer.from(data.split(',')[1],'base64');
};
writeFileSync('resources/splash.png', await make(2732, false));
writeFileSync('resources/splash-dark.png', await make(2732, true));
await browser.close();
console.log('splash üretildi');
