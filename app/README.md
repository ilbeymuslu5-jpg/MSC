# MSC Music — Android uygulaması

MSC Music web uygulamasının [Capacitor](https://capacitorjs.com) ile paketlenmiş
Android sürümü. Uygulama tek bir HTML dosyasıdır; internet bağlantısı olmadan çalışır
ve tüm veriyi cihazda tutar.

- **Paket adı:** `cc.msc.music`
- **Sürüm:** 1.0.0 (versionCode 1)
- **Hedef:** Android 6.0+ (minSdk 23), targetSdk Capacitor 6 varsayılanı (34)

## Dizin yapısı

```
app/
├─ src/app.html            ← uygulamanın kaynağı (tek dosya)
├─ build-www.mjs           ← src/app.html → www/index.html (PWA kabuğu ekler)
├─ make-icons.mjs          ← uygulama ikonlarını üretir
├─ make-splash.mjs         ← açılış ekranı görsellerini üretir
├─ make-store.mjs          ← mağaza görsellerini ve ekran görüntülerini üretir
├─ www/                    ← Capacitor'ın paketlediği web varlıkları
│  ├─ index.html
│  ├─ manifest.webmanifest ← PWA manifesti
│  ├─ sw.js                ← çevrimdışı önbellek
│  └─ icons/
├─ android/                ← Capacitor'ın ürettiği Android projesi
├─ resources/              ← ikon/splash kaynak görselleri
└─ store/                  ← Play Store kaydı için hazır malzemeler
   ├─ listing-tr.md              ← başlık, açıklamalar, veri güvenliği cevapları
   ├─ privacy-policy.html        ← yayınlanması gereken gizlilik politikası
   ├─ feature-graphic-1024x500.png
   └─ screenshots/               ← 6 telefon ekran görüntüsü (1080×1920)
```

## Geliştirme

```bash
npm install
npm run build:www        # src/app.html → www/index.html
npx cap sync android     # www/ → android projesine kopyalar
```

Uygulamayı tarayıcıda denemek için `www/` klasörünü herhangi bir statik sunucuyla açın
(service worker `file://` üzerinde çalışmaz):

```bash
npx serve www
```

## Derleme

> **Not:** Bu depoda derleme yapmak için Android SDK gerekir. Kurulu değilse
> aşağıdaki **CI ile derleme** yöntemini kullanın — hiçbir yerel kurulum gerektirmez.

```bash
npm run assemble:debug    # test için APK
npm run bundle:release    # Play Store için .aab
npm run apk:release       # doğrudan kurulum için imzalı APK
```

Çıktılar:
- `android/app/build/outputs/bundle/release/app-release.aab`
- `android/app/build/outputs/apk/release/app-release.apk`

## CI ile derleme (yerel kurulum gerekmez)

Depodaki `.github/workflows/android.yml` iş akışı, GitHub'ın Android SDK'sı kurulu
runner'larında `.aab` ve `.apk` üretir.

1. GitHub'da **Actions › Android build › Run workflow** deyin.
2. İş bitince **Artifacts › msc-music-android** altından dosyaları indirin.

## Yayın imzası

Play Store'a yüklenecek `.aab` imzalanmış olmalıdır.

### 1. Anahtar üretin (bir kez, ve **kaybetmeyin**)

```bash
keytool -genkeypair -v \
  -keystore release.keystore \
  -alias msc-music \
  -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Yerelde imzalamak için

`android/keystore.properties` dosyası oluşturun (bu dosya git'e girmez):

```properties
storeFile=/tam/yol/release.keystore
storePassword=ŞİFRE
keyAlias=msc-music
keyPassword=ŞİFRE
```

### 3. CI'da imzalamak için

Depo ayarlarında şu **Secrets** değerlerini tanımlayın:

| Secret | Değer |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | `base64 -w0 release.keystore` çıktısı |
| `ANDROID_KEYSTORE_PASSWORD` | keystore şifresi |
| `ANDROID_KEY_ALIAS` | `msc-music` |
| `ANDROID_KEY_PASSWORD` | anahtar şifresi |

Secret tanımlı değilse iş akışı yine çalışır, sadece imzasız paket üretir.

## Play Console'da yayınlama adımları

1. **Gizlilik politikasını yayınlayın.** `store/privacy-policy.html` dosyasındaki
   e-posta alanını doldurup herkese açık bir adreste yayınlayın (GitHub Pages yeterlidir).
2. Play Console'da uygulama oluşturun; ad ve açıklamaları `store/listing-tr.md`
   dosyasından kopyalayın.
3. Görselleri yükleyin:
   - Uygulama simgesi: `resources/play-icon-512.png` (512×512)
   - Öne çıkan görsel: `store/feature-graphic-1024x500.png`
   - Telefon ekran görüntüleri: `store/screenshots/` (en az 2 tane gerekir, 6 tane hazır)
4. **Veri güvenliği** formunu `store/listing-tr.md` içindeki tabloya göre doldurun
   (veri toplanmıyor / paylaşılmıyor).
5. **İçerik derecelendirmesi** anketini doldurun (kullanıcı içeriği: evet, hassas içerik: hayır).
6. `.aab` dosyasını **Üretim** veya önce **Kapalı test** kanalına yükleyin.
7. Play App Signing'i kabul edin (önerilir); yükleme anahtarınız yukarıda ürettiğinizdir.

## Sürüm yükseltme

`android/app/build.gradle` içinde:

```gradle
versionCode 2          // her yüklemede artmalı
versionName "1.0.1"
```

veya iş akışını elle tetiklerken `versionName` / `versionCode` girdilerini doldurun.

## Uygulamanın izinleri

| İzin | Neden |
|---|---|
| `CAMERA` | Uygulama içinden story/gönderi fotoğrafı çekmek |
| `READ_MEDIA_IMAGES` | Galeriden fotoğraf seçmek (Android 13+) |
| `READ_EXTERNAL_STORAGE` | Aynısı, Android 12 ve öncesi |
| `INTERNET` | WebView bileşeni için gereklidir; uygulama dışarı veri göndermez |

Kamera bulunmayan cihazlar da uygulamayı yükleyebilir (`android:required="false"`);
o cihazlarda galeriden seçim çalışmaya devam eder.
