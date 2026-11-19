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
  // Si cssVar, por e ruan vlerën: përdore brenda animacioneve (getComputedStyle në çdo frame e
  // ngadalëson faqen). Rifreskohet vetë kur ndërrohet tema (ngjarja "kodio:theme" nga theme.js).
  themeVar: function (name) {
    var c = window.Kodio._vars;
    if (!(name in c)) c[name] = window.Kodio.cssVar(name);
    return c[name];
  },
  _vars: {},
  accent: function () {
    return window.Kodio.themeVar("--accent") || "#6366f1";
  },
  // Animacion që punon vetëm kur elementi duket në ekran: K.loop(el, function (t) {...})
  // (kursen CPU dhe bateri; klikimet përgjigjen më shpejt)
  loop: function (el, fn) {
    var on = false,
      raf = 0;
    function tick(t) {
      raf = 0;
      if (!on) return;
      fn(t);
      raf = requestAnimationFrame(tick);
    }
    new IntersectionObserver(
      function (e) {
        on = e[e.length - 1].isIntersecting;
        if (on && !raf) raf = requestAnimationFrame(tick);
      },
      { rootMargin: "120px" },
    ).observe(el);
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

addEventListener("kodio:theme", function () {
  window.Kodio._vars = {};
});

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
