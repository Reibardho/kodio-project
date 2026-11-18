/* GJUHËT E FAQES
   - KODIO_LANGS: lista e gjuhëve në menunë 🌐. Për të shtuar një gjuhë: shto një rresht këtu
     dhe krijo skedarin js/data/lang/<kodi>.js (kopjo en.js dhe përkthe vlerat).
   - Shqipja është gjuha bazë: tekstet shqip janë direkt te index.html dhe te js/data/*.js.
   - Çdo skedar gjuhe ngarkohet vetëm kur vizitori e zgjedh atë gjuhë (faqja mbetet e lehtë).
   - Në skedarët e gjuhëve çelësi është teksti shqip. Nëse ndryshon një tekst shqip te index.html,
     ndrysho të njëjtin çelës në çdo skedar gjuhe, përndryshe ai tekst mbetet shqip. */
window.KODIO_LANGS = [
  { code: "sq", name: "Shqip", short: "AL" },
  { code: "en", name: "English", short: "EN" },
  { code: "de", name: "Deutsch", short: "DE" },
  { code: "es", name: "Español", short: "ES" },
  { code: "fr", name: "Français", short: "FR" },
  { code: "it", name: "Italiano", short: "IT" },
  { code: "pt", name: "Português", short: "PT" },
  { code: "ru", name: "Русский", short: "RU" },
  { code: "zh", name: "中文", short: "ZH" },
  { code: "hi", name: "हिन्दी", short: "HI" },
  { code: "ar", name: "العربية", short: "AR", dir: "rtl" },
];

// Tekstet shqip të titullit, menusë dhe butonave të hero-s (elementet me data-i te index.html)
window.KODIO_SQ = {
  title: "Kodio – Web & Software Engineering",
  tr: {
    n1: "Shërbimet",
    n3: "Punët",
    n4: "Çmimet",
    n5: "Procesi",
    n6: "Kontakt",
    h1: "Ndërto <span>Website-in tënd sot</span>",
    sub: "Dizajn, ndërtim dhe mbështetje pas publikimit.",
    b1: "Na kontaktoni",
    b2: "Shiko punët",
  },
};

// Këtu regjistrohen skedarët e gjuhëve kur ngarkohen (js/data/lang/*.js)
window.KODIO_LANG = window.KODIO_LANG || {};
