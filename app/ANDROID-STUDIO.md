# Android Studio ile derleme ve Play Store'a yükleme

Bu rehber, MSC Music'i Android Studio kullanarak derleyip Google Play'e
yüklemek için gereken her adımı içerir. **Node.js kurmanıza gerek yok** —
uygulamanın web varlıkları depoya dahil edildi.

- **Paket adı:** `cc.msc.music`
- **Sürüm:** 1.0.0 (versionCode 1)
- **minSdk 24** (Android 7.0) · **targetSdk 36** (Android 16)
- Gradle 8.14.3 · Android Gradle Plugin 8.13.0 · Capacitor 8.5

---

## 1. Projeyi açın

1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/ilbeymuslu5-jpg/MSC.git
   cd MSC
   git checkout music-ecosystem-architecture
   ```
2. Android Studio → **Open**
3. **`MSC/app/android`** klasörünü seçin
   > ⚠️ `MSC` veya `MSC/app` değil — mutlaka **`app/android`** klasörü.
4. Gradle senkronizasyonunu bekleyin. İlk açılışta Android Studio
   eksik SDK bileşenlerini indirmeyi teklif eder, kabul edin.

**Gereken SDK:** Android 16 (API 36). Yoksa:
`Tools › SDK Manager › SDK Platforms › Android 16 (API 36)` işaretleyip yükleyin.

**Java:** Android Studio'nun kendi JDK'sı (JBR 21) yeterlidir.
Sorun çıkarsa: `Settings › Build Tools › Gradle › Gradle JDK` → **jbr-21**.

---

## 2. Telefonda deneyin

1. Telefonunuzda **Geliştirici seçenekleri › USB hata ayıklama**yı açın, kabloyla bağlayın
   (veya `Device Manager`'dan bir emülatör başlatın).
2. Üstteki cihaz listesinden cihazınızı seçin → **Run ▶**

İlk açılışta uygulama kamera izni ister; reddetseniz bile galeriden fotoğraf
seçme çalışmaya devam eder.

---

## 3. İmzalama anahtarı oluşturun

> Bu anahtarı **kaybetmeyin ve yedekleyin**. Kaybederseniz aynı uygulamaya bir daha
> güncelleme yükleyemezsiniz.

Android Studio'da: **Build › Generate Signed App Bundle / APK…**

1. **Android App Bundle**'ı seçin → Next
2. **Create new…** düğmesine basın
3. Formu doldurun:
   - *Key store path:* güvenli bir yer, örn. `~/keys/msc-release.jks`
   - *Password* ve *Confirm:* güçlü bir şifre (not alın)
   - *Alias:* `msc-music`
   - *Validity:* `25` yıl
   - *First and Last Name / Organization:* kendi bilgileriniz
4. OK → şifreleri girin → **Remember passwords** işaretleyebilirsiniz → Next

---

## 4. Play Store paketini (.aab) üretin

Aynı sihirbazda devam:

1. **Build Variants:** `release`
2. **Finish**

Derleme bitince sağ altta çıkan bildirimdeki **locate** bağlantısına tıklayın.
Dosya şuradadır:

```
app/android/app/build/outputs/bundle/release/app-release.aab
```

> Alternatif (terminalden):
> ```bash
> cd app/android
> ./gradlew bundleRelease      # Windows: gradlew.bat bundleRelease
> ```
> Bu yöntem için `app/android/keystore.properties` dosyası oluşturun:
> ```properties
> storeFile=/home/kullanici/keys/msc-release.jks
> storePassword=ŞİFRE
> keyAlias=msc-music
> keyPassword=ŞİFRE
> ```
> Bu dosya `.gitignore`'da, depoya girmez.

---

## 5. Play Console'a yükleyin

1. [play.google.com/console](https://play.google.com/console) → geliştirici hesabı
   (tek seferlik 25 USD kayıt ücreti) → **Uygulama oluştur**
2. Ad: `MSC Music — Müzik Ekosistemi`, dil: Türkçe, tür: Uygulama, ücretsiz
3. **Mağaza kaydı** — metinleri `store/listing-tr.md` dosyasından kopyalayın
4. **Görseller:**
   | Alan | Dosya |
   |---|---|
   | Uygulama simgesi (512×512) | `resources/play-icon-512.png` |
   | Öne çıkan görsel (1024×500) | `store/feature-graphic-1024x500.png` |
   | Telefon ekran görüntüleri | `store/screenshots/` (6 adet hazır, en az 2 gerekli) |
5. **Gizlilik politikası:** `store/privacy-policy.html` dosyasındaki e-posta alanını
   doldurup herkese açık bir adreste yayınlayın (GitHub Pages ücretsiz yeter),
   adresi Play Console'a girin.
6. **Veri güvenliği** formu: `store/listing-tr.md` sonundaki tabloya göre doldurun
   (veri toplanmıyor, paylaşılmıyor).
7. **İçerik derecelendirmesi** anketini doldurun.
8. **Sürümler › Üretim › Yeni sürüm oluştur** → `.aab` dosyasını yükleyin.
   - **Play App Signing**'i kabul edin (önerilir).
9. İncelemeye gönderin. İlk inceleme genelde birkaç gün sürer.

---

## 6. Uygulamayı güncellemek

Uygulamanın içeriğini değiştirmek isterseniz kaynak dosya:
**`app/src/app.html`**

Değişiklikten sonra (Node gerektirir):

```bash
cd app
npm install        # ilk seferde
npm run sync       # src/app.html → www → android varlıkları
```

Node kurmak istemiyorsanız `app/android/app/src/main/assets/public/index.html`
dosyasını doğrudan da düzenleyebilirsiniz.

Her yeni Play yüklemesinde `app/android/app/build.gradle` içindeki iki değeri artırın:

```gradle
versionCode 2          // her yüklemede mutlaka artmalı
versionName "1.0.1"
```

---

## Sık karşılaşılan sorunlar

| Sorun | Çözüm |
|---|---|
| `SDK location not found` | Android Studio projeyi açtığında `local.properties`'i kendi oluşturur; projeyi `app/android` olarak açtığınızdan emin olun |
| `Failed to find Build Tools` / API 36 yok | SDK Manager'dan Android 16 (API 36) ve güncel Build Tools'u yükleyin |
| Gradle sync JDK hatası | `Settings › Build Tools › Gradle › Gradle JDK` → **jbr-21** |
| Uygulama açılıyor ama ekran boş | `app/android/app/src/main/assets/public/index.html` var mı bakın; yoksa `npm run sync` çalıştırın |
| Kamera açılmıyor | Cihazda uygulama ayarlarından kamera iznini verin; izin olmadan galeri yolu çalışır |
| Play "targetSdk çok düşük" diyor | Bu proje API 36 hedefliyor; uyarı alırsanız `variables.gradle` içindeki `targetSdkVersion` değerini kontrol edin |
