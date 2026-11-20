/* Fillimi: ngarkohet i fundit. Pasi janë ngarkuar të gjitha modulet, hapet faqja në gjuhën e vizitorit
   (zgjedhja e ruajtur ose gjuha e shfletuesit) dhe ndërrimi i gjuhës rindërton edhe tekstet dinamike.
   Pastaj, pas refresh ose "Back", faqja kthehet te vendi ku ishte vizitori. */
window.Kodio.ready = true;
(function () {
  var K = window.Kodio,
    KEY = "kodio_y",
    root = document.documentElement,
    y0 = scrollY;

  // Ruaj vendin ku ndodhet vizitori kur largohet nga faqja (refresh, link, mbyllje)
  addEventListener("pagehide", function () {
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ p: location.pathname, y: Math.round(scrollY) }));
    } catch {
      /* pa sessionStorage */
    }
  });

  // Kthehu te vendi i mëparshëm vetëm tani, kur seksionet që ndërtohen nga JS (punët, çmimet,
  // kalkulatori) kanë lartësinë e tyre përfundimtare dhe janë vizatuar një herë. Nëse kthehet më herët,
  // faqja "kërcen" (Cloudflare e sheh si CLS = 1 te #kontakt dhe footer).
  function restore() {
    var nav, saved;
    try {
      nav = performance.getEntriesByType("navigation")[0];
      saved = JSON.parse(sessionStorage.getItem(KEY));
    } catch {
      return;
    }
    if (!nav || (nav.type !== "reload" && nav.type !== "back_forward")) return;
    if (!saved || saved.p !== location.pathname || !(saved.y > 0)) return;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (Math.abs(scrollY - y0) > 2) return; // vizitori ka lëvizur vetë ndërkohë
        var sb = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto"; // kërcim i menjëhershëm, jo scroll i butë
        scrollTo(0, saved.y);
        root.style.scrollBehavior = sb;
      });
    });
  }

  function ready() {
    root.classList.remove("lg-wait"); // tekstet janë në gjuhën e duhur: shfaqi (shih <head>)
    restore();
  }

  var l = K.startLang();
  if (l !== "sq") K.setLang(l, true, ready);
  else ready();
})();
