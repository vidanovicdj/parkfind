# ParkFind

Mobilna aplikacija za pronalaženje parking mesta, izrađena u React Native-u (Expo) kao **edukativni primer za nastavu na FON-u**. Cilj projekta je da na jednom, realističnom primeru pokaže osnovne **nativne funkcije** koje se koriste pri razvoju mobilnih aplikacija: lokaciju, kameru, senzore, notifikacije, biometriju i rad sa mapom.

> 🎓 Projekat je namenjen izvođenju nastave na Fakultetu organizacionih nauka (FON). Nije predviđen za produkcionu upotrebu.

## Šta aplikacija demonstrira

| Nativna funkcija | Primena u aplikaciji | Biblioteka |
|---|---|---|---|
| GPS lokacija | prikaz i praćenje trenutne pozicije korisnika | `expo-location` |
| Mape | prikaz parkinga kroz markere i prilagođene popupe | `@rnmapbox/maps` (Mapbox) |
| Skeniranje QR koda | očitavanje koda na parking mestu | `[expo-camera]` |
| Biometrijska autentifikacija | prijava otiskom prsta / licem | `expo-local-authentication` |
| Zvuk | zvučni signal pri detekciji | `[expo-audio]`|
| Vibracija (haptika) | vibracioni odgovor pri detekciji | `[expo-haptics]` |
| Push notifikacije | obaveštenja i notification channels na Androidu | `expo-notifications` |
| Backend i autentifikacija | skladištenje podataka i prijava korisnika | Supabase |

## Ciljevi učenja

Nakon prolaska kroz projekat, student treba da razume:
- kako se traže i obrađuju **dozvole** (permissions) za nativne funkcije
- razliku između **Expo Go** i **development build-a** i zašto neke biblioteke rade samo u drugom
- kako se rade **konfiguracija i izgradnja** aplikacije pomoću EAS Build-a
- kako se bezbedno upravlja **tokenima i tajnim ključevima**
- kako izgleda **file-based routing** (Expo Router)

## Tehnologije

- React Native + Expo (Expo Router)
- TypeScript
- Mapbox (`@rnmapbox/maps`)
- Supabase
- EAS Build, `expo-dev-client`

## Struktura projekta

```
.
├── app/          # ekrani i rutiranje (Expo Router)
├── components/   # višekratno upotrebljive komponente
├── constants/    # konstante (boje, konfiguracija)
├── hooks/        # prilagođeni React hook-ovi
├── lib/          # integracije (npr. Supabase klijent)
├── scripts/      # pomoćne skripte
└── assets/       # slike i resursi
```

## Pokretanje projekta

### Preduslovi
- Node.js i npm
- Android Studio (emulator) ili Android uređaj
- Nalog na [Expo](https://expo.dev), [Mapbox](https://mapbox.com) i [Supabase](https://supabase.com)

### 1. Instalacija
```bash
git clone https://github.com/vidanovicdj/parkfind.git
cd parkfind
npm install
```

### 2. Promenljive okruženja

Napravi `.env` fajl na osnovu `.env.example`:

```bash
cp .env.example .env
```

| Promenljiva | Opis |
|---|---|
| `EXPO_PUBLIC_MAPBOX_TOKEN` | javni Mapbox token (počinje sa `pk.`) |
| `RNMAPBOX_MAPS_DOWNLOAD_TOKEN` | tajni Mapbox token za preuzimanje SDK-a (počinje sa `sk.`, scope `DOWNLOADS:READ`) |
| `EXPO_PUBLIC_SUPABASE_URL` `[proveri]` | URL Supabase projekta |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` `[proveri]` | javni (anon) ključ |

> ⚠️ Tajni token (`sk.`) se **nikada ne upisuje u kod** niti commit-uje. `.env` je u `.gitignore`.

Za EAS Build se ove vrednosti dodaju kao **EAS environment variables** (`eas env:create` ili preko Expo dashboard-a).

### 3. Pokretanje na Androidu

Aplikacija koristi nativne module (Mapbox i dr.), pa **ne radi u Expo Go-u**. Potreban je development build:

```bash
npx expo run:android
```

Ili kroz EAS:
```bash
eas build --profile development --platform android
```

Zatim pokreni razvojni server:
```bash
npx expo start --dev-client
```

## Dozvole

Aplikacija traži sledeće dozvole (prilikom prvog korišćenja funkcije):

| Dozvola | Zašto |
|---|---|
| Lokacija | prikaz pozicije na mapi |
| Kamera | skeniranje QR koda |
| Bluetooth | detekcija beacon-a |
| Notifikacije | slanje obaveštenja |
| Biometrija | prijava otiskom prsta / licem |

## Poznata ograničenja
- Udaljene push notifikacije ne rade u Expo Go-u (od SDK 53), potreban je development build
- Za rad mape potrebni su Mapbox tokeni
