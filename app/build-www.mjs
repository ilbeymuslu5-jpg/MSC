/**
 * Artifact kaynağını (tek dosya HTML gövdesi) alıp
 * bağımsız çalışan tam bir PWA belgesine dönüştürür.
 *
 * Kullanım: node build-www.mjs [kaynak.html]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const src = process.argv[2] ?? resolve(here, 'src/app.html');
const out = resolve(here, 'www/index.html');

const body = readFileSync(src, 'utf8');

// artifact gövdesindeki <title> etiketini ayıkla
const titleMatch = body.match(/<title>([^<]*)<\/title>/i);
const title = titleMatch ? titleMatch[1] : 'MSC Music';
const content = body.replace(/<title>[^<]*<\/title>\s*/i, '');

const doc = `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1, user-scalable=no">
<title>${title}</title>
<meta name="description" content="Sanatçılar, menajerler, mekanlar, distribütörler ve markalar için müzik ekosistemi.">
<meta name="theme-color" content="#4338CA" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0B0F19" media="(prefers-color-scheme: dark)">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="MSC Music">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/icon-192.png" sizes="192x192" type="image/png">
<link rel="apple-touch-icon" href="icons/icon-192.png">
<style>
  html,body{background:#F8FAFC;}
  @media (prefers-color-scheme: dark){ html,body{background:#0B0F19;} }
  /* Native kabuk veya yüklenmiş PWA: cihaz çerçevesi yok, her ekran boyutunda tam ekran.
     Tarayıcıda geniş ekranda çerçeveli önizleme görünmeye devam eder. */
  @media (display-mode: standalone), (display-mode: fullscreen), (display-mode: minimal-ui){
    body{display:block;margin:0;padding:0;}
    .device{width:100%;height:100dvh;border-radius:0;border:none;box-shadow:none;}
  }
</style>
</head>
<body>
${content}
<script>
  if('serviceWorker' in navigator){
    addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
</script>
</body>
</html>
`;

writeFileSync(out, doc);
console.log(`www/index.html yazıldı (${(doc.length/1024).toFixed(0)} KB)`);
