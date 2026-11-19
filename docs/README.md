# Kodio Web Studio

Faqe statike (HTML + CSS + JavaScript), pa framework dhe pa build. Founder: Rei Bardho.

## Si ta hapësh
1. Zhbllokoje zip-in.
2. VS Code → **File → Open Folder** → zgjidh `kodio`.
3. Instalo extension-in e rekomanduar **Live Server** → klik i djathtë te `index.html` → *Open with Live Server*.
   (Mund ta hapësh edhe me dy klikime mbi `index.html`. Fontet duan internet.)

## Struktura
```
kodio/
├── index.html            ← i gjithë përmbajtja (tekstet, seksionet)
├── privacy.html          ← politika e privatësisë dhe e cookies (faqe e veçantë)
├── 404.html              ← faqja për linket e gabuara
├── CNAME                 ← domain-i për GitHub Pages (kodiowebstudio.com)
├── robots.txt, sitemap.xml ← për Google
├── css/                  ← një skedar për çdo seksion
│   ├── base.css          ← ngjyrat (:root), reset, tipografia
│   ├── components.css    ← butona, kartela, elemente të përbashkëta
│   ├── header.css  intro.css  hero.css  robot.css  mockup.css  before-after.css
│   ├── features.css  globe.css  tech.css  projects.css
│   ├── pricing.css  estimator.css  founder.css
│   ├── contact.css  footer.css  process.css  trail.css  cookies.css  legal.css
│   ├── marquee.css  faq.css  buttons.css ← stili i të gjithë butonave
│   └── theme-toggle.css  ← butoni hëna/dielli (edhe te privacy.html)
├── js/
│   ├── config.js         ← numri i WhatsApp
│   ├── data/             ← vetëm të dhëna
│   │   ├── pricing.js    ← çmimet: NJË burim për kartat e paketave dhe për vlerësuesin
│   │   ├── sites.js      ← projektet në karusel
│   │   ├── languages.js  ← lista e gjuhëve në menunë 🌐 dhe tekstet shqip të hero-s
│   │   ├── lang/         ← një skedar për çdo gjuhë: en, de, es, fr, it, pt, ru, zh, hi, ar
│   │   └── world.js      ← hartat e globit
│   ├── core/             ← kernel i përbashkët (namespace `Kodio`)
│   │   ├── kodio.js  i18n.js  whatsapp.js
│   │   └── theme.js      ← tema e çelët/e errët (ngarkohet në <head>, edhe te privacy.html)
│   ├── modules/          ← një modul për çdo funksion
│   │   └── header, intro, reveal, network, mockup, globe, robot,
│   │       projects, pricing, estimator, contact, footer,
│   │       tech, process (scroll), trail (gjurma e maus-it), cookies,
│   │       marquee (shiriti lëvizës), magnetic (butonat), spotlight (drita mbi kartat)
│   └── main.js
└── assets/
    ├── images/projects/  ← ekranet e projekteve (Rei Mobile Store) në hero
    ├── images/           ← robot-head, robot-body, founder (.webp)
    └── video/            ← vendos këtu videot
```

## Ku ndryshoj çfarë
| Dua të ndryshoj… | Skedari |
|---|---|
| Numrin e WhatsApp (për mesazhe) | `js/config.js` → `whatsapp: "355698277335"` |
| Email-in | `js/config.js` → `email` (për butonin "Dërgo me email") dhe teksti i dukshëm te `index.html` (`#kontakt`, footer) e `privacy.html` |
| Telefonin e dukshëm | `index.html` (seksioni `#kontakt` dhe footer) |
| Emrin / foton e founder-it | `index.html` → `#founder`, dhe `assets/images/founder.webp` |
| Çmimet, paketat, çfarë përfshin secila, koha | `js/data/pricing.js` (`KODIO_PACKS`, `KODIO_CARE`, `KODIO_EXTRAS`, `KODIO_TERMS`) — vlerësuesi përditësohet vetë |
| Projektet te "Punimet" | `js/data/sites.js` — çdo projekt ka foto për laptop/tablet/telefon (`img`) dhe `sc`. Rei Mobile Store e WebWatch janë "projekt real"; Te Ura, Elira, Dental Smile, FitZone janë "koncept" (biznese të shpikura, foto nga Unsplash). Kur të kesh klient real, zëvendëso një koncept. `link` = adresa që hapet me klik |
| Website-in e vjetër / rulin e bojës në hero (koha, ngjyrat) | `index.html` → `.ba` dhe `css/before-after.css` (animacioni 9s, `@keyframes broll` / `bpaint`) |
| Ekranet e projektit në dritaren e hero-it | foto (gjerësi 960px, e gjatë) te `assets/images/projects/` + një `<img data-url="adresa">` te `#wshots` në `index.html`; ndërrohen vetë çdo 7.4s |
| Pamjen e butonave (ngjyra, forma, shigjeta) | `css/buttons.css` |
| Rrjetet sociale (Instagram, TikTok, LinkedIn) | `js/config.js` → `social` — vendos linkun; ikona në footer përditësohet vetë |
| Pyetjet e shpeshta (FAQ) | `index.html` → `#pyetje` (+ përkthimi te çdo skedar në `js/data/lang/`) |
| Fjalët në shiritin lëvizës | `index.html` → `.mq` (dy grupet duhet të jenë identike) |
| Foton kur ndahet linku (Facebook, WhatsApp) | `assets/images/og-cover.jpg` dhe meta `og:` në `<head>` — kur të kesh domain, vendos URL të plotë |
| Politikën e privatësisë (tekst, email, data) | `privacy.html` |
| Cookies (kategoritë, banneri) | `index.html` (`#ck`, `#ckm`) dhe `js/modules/cookies.js` |
| Ngjyrat (e kuqja `#d7202b`) | `css/base.css` → `:root` (tema e çelët) dhe `:root[data-theme="dark"]` (e errëta) |
| Temën e errët / të çelët (butoni hëna ↔ dielli) | logjika `js/core/theme.js`, pamja `css/theme-toggle.css`. Zgjedhja mbetet pas refresh-it; për vizitat e ardhshme mbahet vetëm me leje për cookies "Preferenca" |
| Butonat e robotit | `SV2` në `js/modules/robot.js` |
| Përkthimet (11 gjuhë) | `js/data/lang/<kodi>.js` — çelësi = teksti shqip, vlera = përkthimi. Gjuhë e re: një rresht te `js/data/languages.js` + kopjo `en.js` dhe përkthe |
| Statistikat e vizitorëve (Cloudflare Web Analytics, pa cookies) | kodi `cloudflareinsights` para `</body>` te `index.html`, `privacy.html`, `404.html`; statistikat i sheh te dash.cloudflare.com → Web Analytics |
| Email-in / WhatsApp-in | `js/config.js` (`email`, `whatsapp`); butoni lundrues poshtë djathtas: `.waf` te `index.html`, stili `css/whatsapp-float.css` |

## Gjuhët
- Faqja hapet në gjuhën e shfletuesit të vizitorit (nëse e kemi), përndryshe në shqip. Menuja 🌐 lart ndërron gjuhën.
- Gjuha dhe tema e zgjedhur mbeten pas refresh-it (për skedën e hapur). Për vizitat e ardhshme mbahen mend vetëm nëse vizitori ka lejuar cookies "Preferenca".
- Arabishtja hapet nga e djathta (RTL). Politika e privatësisë është në shqip dhe anglisht (për gjuhët e tjera hapet anglisht).

## Rregullat
- **Një vend për çdo gjë.** Mos e përsërit të njëjtin rregull: çmimet vetëm te `pricing.js`, stili i butonave vetëm te `css/buttons.css`, mesazhi i WhatsApp vetëm te `js/core/whatsapp.js` (`K.waHello()`).
- Ndihmëset e përbashkëta janë te `js/core/kodio.js`: `K.touch` (telefon/tablet), `K.reduce` (pak lëvizje), `K.clamp()`, `K.cssVar()`, `K.onScroll(fn)` (një dëgjues i vetëm scroll-i), `K.onLang(fn)`, `K.loop(el, fn)` (animacion që punon vetëm kur elementi duket në ekran) dhe `K.themeVar("--bg")` (ngjyrë nga CSS e ruajtur, për animacionet). Përdori këto në vend që t'i shkruash sërish në modul.
- **Shpejtësia:** mos e lexo `getComputedStyle` / `K.cssVar` brenda animacioneve dhe mos lër `requestAnimationFrame` të punojë kur elementi s'duket. Përdor `K.themeVar` dhe `K.loop`.
- `index.html` mban përmbajtjen; çdo CSS stilon një seksion; çdo modul JS zotëron një funksion.
- Skriptet janë klasike (jo ES modules) që të punojë edhe me file://. **Rendi i `<script>` ka rëndësi**: config → data → core → modules → main.
- Moduli i ri komunikon përmes `window.Kodio` (`K.$`, `K.onLang`, `K.openWA`, …). Ndërrimi i gjuhës: regjistro rindërtimin me `K.onLang(fn)`.

## Shto një seksion të ri
1. Shto `<section id="emri">` në `index.html`.
2. Krijo `css/emri.css` dhe shto `<link>` në rendin e duhur.
3. Krijo `js/modules/emri.js` (IIFE) dhe shto `<script>` para `main.js`.
4. Tekstet e reja shqip → shto përkthimin në çdo skedar te `js/data/lang/` (përndryshe teksti mbetet shqip në atë gjuhë).

## Publikimi: GitHub Pages + domain-i kodiowebstudio.com (GoDaddy)

Website-i publikohet falas me **GitHub Pages**. Pasi ta lidhësh një herë, çdo ndryshim që bën në
VS Code del online me një **Commit + Push**, rreth 1 minutë më vonë.

### 1. Një herë: vendose projektin në GitHub nga VS Code
1. Krijo llogari falas te github.com (nëse nuk ke).
2. Instalo **Git** (git-scm.com) dhe rinis VS Code.
3. VS Code → hap folderin `kodio` → paneli **Source Control** (`Ctrl+Shift+G`) → **Publish to GitHub**.
   Hyr me llogarinë GitHub dhe zgjidh **public repository** (GitHub Pages falas kërkon repo publik).
   Emri p.sh. `kodio`.

### 2. Një herë: aktivizo GitHub Pages
1. Te github.com hap repo-n → **Settings → Pages**.
2. **Source:** Deploy from a branch → **Branch:** `main`, folder **`/docs`** → **Save**.
   (Website-i ndodhet te folderi `docs` brenda repo-s `kodio-project`.)
3. **Custom domain:** shkruaj `kodiowebstudio.com` → **Save** (skedari `CNAME` është gati në projekt).

### 3. Një herë: lidh domain-in te GoDaddy
GoDaddy → **My Products → kodiowebstudio.com → DNS → Manage DNS**:
- Fshi rekordin ekzistues **A** me emrin `@` (zakonisht "Parked") dhe çdo **CNAME** `www` të vjetër.
- Shto 4 rekorde **A**, emri `@`:
  `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- Shto 1 rekord **CNAME**, emri `www`, vlera `EMRI-YT-NE-GITHUB.github.io`
- Pas disa orësh (deri në 24) te **Settings → Pages** ndiz **Enforce HTTPS**.

### 4. Çdo herë që ndryshon diçka
1. Hap në VS Code folderin `kodio-project`, ndrysho skedarët brenda `docs` dhe kontrolloji me Live Server.
2. **Source Control** → shkruaj një mesazh (p.sh. "Ndryshova çmimet") → **Commit** → **Sync Changes / Push**.
3. Pas ~1 minute ndryshimi është te https://kodiowebstudio.com (rifresko me `Ctrl+Shift+R`).

### Pas publikimit (një herë)
- **Google Search Console:** shto `kodiowebstudio.com`, dhe dërgo `https://kodiowebstudio.com/sitemap.xml`.
- **Google Business Profile:** që të dalësh në kërkimet lokale.
- Nëse ndryshon domain-i: ndryshoje te `CNAME`, `robots.txt`, `sitemap.xml` dhe te `<head>` i `index.html` (canonical, og:url, og:image).

