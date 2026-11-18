/* Hapësira e përbashkët "Kodio". Ngarkohet e para; modulet e tjera marrin nga këtu ndihmëset. */
window.Kodio = {
  ready: false, // bëhet true nga js/main.js pasi janë ngarkuar të gjitha modulet
  langHooks: [], // funksione që thirren kur ndërrohet gjuha (shih K.onLang)
  $: function (id) {
    return document.getElementById(id);
  },
  cssVar: function (name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  },
  accent: function () {
    return window.Kodio.cssVar("--accent") || "#6366f1";
  },
  onLang: function (fn) {
    window.Kodio.langHooks.push(fn);
  },
  // Ndihmëse të përbashkëta, që modulet të mos i përsërisin vetë
  touch: matchMedia("(pointer: coarse)").matches, // pajisje me prekje (pa maus)
  reduce: matchMedia("(prefers-reduced-motion: reduce)").matches, // përdoruesi do pak lëvizje
  clamp: function (v, a, b) {
    return Math.max(a, Math.min(b, v));
  },
  // Një dëgjues i vetëm scroll-i për gjithë faqen: K.onScroll(function (y, dy) {...})
  scrollHooks: [],
  onScroll: function (fn) {
    window.Kodio.scrollHooks.push(fn);
  },
};

(function () {
  var K = window.Kodio,
    last = scrollY,
    raf = 0;
  addEventListener(
    "scroll",
    function () {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        var y = scrollY,
          dy = y - last;
        last = y;
        K.scrollHooks.forEach(function (fn) {
          fn(y, dy);
        });
      });
    },
    { passive: true },
  );
})();
