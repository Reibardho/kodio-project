/* Çmimet — NJË burim i vetëm. Seksioni "Çmimet" dhe vlerësuesi i kostos lexojnë që këtu,
   kështu që një çmim e ndryshon vetëm në një vend.

   KODIO_PACKS  = paketat e ndërtimit (kartat e gjata me detaje).
                  k = emri i shkurtër te vlerësuesi, min/max = çmimi (max 0 = "€min+"),
                  pages = 1 nëse çmimi rritet me numrin e faqeve, time = koha e dorëzimit,
                  tag = etiketa sipër kartës (opsionale), feats = çfarë përfshin.
   KODIO_CARE   = mirëmbajtja mujore.
   KODIO_EXTRAS = shtesat: [emri, min, max].
   KODIO_TERMS  = kushtet e pagesës: [titulli, teksti].
   Tekstet e reja shqip → shto përkthimin anglisht te js/data/i18n.js. */

window.KODIO_PACKS = [
  {
    k: "Landing page",
    name: "Faqe e vetme (landing page)",
    min: 100,
    max: 150,
    pages: 0,
    time: "5–7 ditë",
    desc: "Një faqe e vetme për të prezantuar biznesin, një produkt ose një ofertë.",
    feats: [
      "Dizajn i personalizuar për markën tënde",
      "E përshtatur për telefon, tablet dhe kompjuter",
      "Butona për WhatsApp, telefon dhe email",
      "Formular kontakti",
      "SEO bazë: tituj, përshkrime, shpejtësi",
      "Lidhje me rrjetet sociale",
    ],
  },
  {
    k: "Website me shumë faqe",
    name: "Website me shumë faqe",
    min: 150,
    max: 0,
    pages: 1,
    time: "10–14 ditë",
    tag: "E rekomanduar",
    desc: "Website i plotë për biznesin, me faqe të veçanta për çdo pjesë.",
    feats: [
      "Gjithçka te landing page",
      "Faqe si Rreth nesh, Shërbimet, Galeria, Kontakt",
      "Menu e qartë dhe navigim i thjeshtë",
      "Harta Google dhe orari i punës",
      "SEO për çdo faqe",
      "Çmimi rritet sipas numrit të faqeve",
    ],
  },
  {
    k: "Dyqan online",
    name: "Dyqan online (e-commerce)",
    min: 500,
    max: 0,
    pages: 0,
    time: "3–5 javë",
    desc: "Dyqan për të shitur online, me produkte, shportë dhe porosi.",
    feats: [
      "Katalog produktesh me kategori",
      "Shporta dhe procesi i porosisë",
      "Pagesë në dorëzim ose online",
      "Panel për produktet dhe porositë",
      "Njoftim për çdo porosi të re",
      "SEO për produktet",
    ],
  },
  {
    k: "Web app",
    name: "Web app i personalizuar",
    min: 700,
    max: 0,
    pages: 0,
    time: "4–8 javë",
    desc: "Aplikacion web sipas nevojës: rezervime, menaxhim klientësh, panele.",
    feats: [
      "Analizë e nevojave dhe plan i punës",
      "Llogari përdoruesish dhe hyrje e sigurt",
      "Bazë të dhënash",
      "Panel administrimi",
      "Funksione sipas biznesit tënd",
      "Testim dhe publikim",
    ],
  },
  {
    k: "Ridizajnim",
    name: "Ridizajnim i website-it ekzistues",
    min: 150,
    max: 0,
    pages: 0,
    time: "7–14 ditë",
    desc: "Rifreskim i website-it që ke: pamje moderne dhe më i shpejtë.",
    feats: [
      "Analizë e website-it aktual",
      "Dizajn i ri modern",
      "Më i shpejtë dhe i përshtatur për telefon",
      "Ruajtja e përmbajtjes dhe e pozicionit në Google",
    ],
  },
];

window.KODIO_CARE = [
  {
    name: "Mirëmbajtje Bazike",
    price: 50,
    desc: "Website-i mbetet i sigurt dhe online.",
    feats: [
      "Përditësime sigurie",
      "Backup i rregullt",
      "Monitorim që faqja të jetë online (uptime)",
    ],
  },
  {
    name: "Mirëmbajtje Standard",
    price: 40,
    desc: "Bazike, plus ndryshime të vogla në përmbajtje.",
    feats: ["Gjithçka te Bazike", "Ndryshime të vogla përmbajtjeje (tekste, foto)"],
  },
];

window.KODIO_EXTRAS = [
  ["Gjuhë shtesë", 40, 60],
  ["Sistem rezervimi / formular kontakti", 40, 60],
  ["Konfigurim Analytics / SEO", 20, 50],
  ["Konfigurim domain dhe DNS", 30, 30],
];

window.KODIO_TERMS = [
  ["Paradhënia", "50% paraprakisht, 50% në dorëzim"],
  ["Mirëmbajtja", "Paguhet paraprakisht, mujore"],
];

/* --- Për vlerësuesin: krijohen nga sa më sipër (mos i ndrysho këtu) ---
   KODIO_ET = llojet e projekteve {k, a = min, b = max, pg, d = koha}
   KODIO_EX = shtesat [emri, min, max, 1 = mujore] */
window.KODIO_ET = window.KODIO_PACKS.map(function (p) {
  return { k: p.k, a: p.min, b: p.max, pg: p.pages, d: p.time };
});
window.KODIO_EX = window.KODIO_EXTRAS.concat([
  ["Mirëmbajtje mujore (Bazike)", window.KODIO_CARE[0].price, window.KODIO_CARE[0].price, 1],
]);
