/* Tema e çelët / e errët (përdoret nga index.html dhe privacy.html).
   Ngarkohet në <head>, para CSS-it, që faqja të hapet direkt me temën e zgjedhur (pa "flash" të bardhë).
   - Mbahet gjithmonë për skedën e hapur (sessionStorage): nuk humbet me refresh.
   - Mbahet edhe për vizitat e ardhshme (localStorage) vetëm nëse vizitori ka lejuar cookies "Preferenca".
   Butoni: çdo element me atributin data-theme-toggle (hëna në temën e çelët, dielli në të errëtën). */
(function () {
  var KEY = "kodio_theme",
    root = document.documentElement,
    BAR = { light: "#ffffff", dark: "#0a0a0a" }; // ngjyra e shiritit të shfletuesit në telefon

  function valid(t) {
    return t === "dark" || t === "light" ? t : null;
  }

  function read(store) {
    try {
      return valid(window[store].getItem(KEY));
    } catch {
      return null;
    }
  }

  function prefsAllowed() {
    try {
      var c = JSON.parse(localStorage.getItem("kodio_consent"));
      return !!(c && c.preferences);
    } catch {
      return false;
    }
  }

  // Për vizitat e ardhshme: vetëm me leje për "Preferenca"
  function persist(t, allowed) {
    try {
      if (allowed) localStorage.setItem(KEY, t);
      else localStorage.removeItem(KEY);
    } catch {
      /* pa localStorage */
    }
  }

  function paint(t) {
    root.setAttribute("data-theme", t);
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
      m.setAttribute("content", BAR[t]);
    });
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.setAttribute("aria-pressed", t === "dark" ? "true" : "false");
    });
    window.dispatchEvent(new CustomEvent("kodio:theme", { detail: t }));
  }

  function current() {
    return valid(root.getAttribute("data-theme")) || "light";
  }

  // Ndërro temën (ose vendos një temë të caktuar: "dark" / "light")
  window.kodioTheme = function (t) {
    t = valid(t) || (current() === "dark" ? "light" : "dark");
    paint(t);
    try {
      sessionStorage.setItem(KEY, t);
    } catch {
      /* pa sessionStorage */
    }
    persist(t, prefsAllowed());
  };

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-theme-toggle]");
    if (b) window.kodioTheme();
  });

  // Kur vizitori ndryshon pëlqimin për cookies: ruaj ose fshi temën për vizitat e ardhshme
  window.addEventListener("kodio:consent", function (e) {
    persist(current(), !!(e.detail && e.detail.preferences));
  });

  // Në hapje: zgjedhja e kësaj skede, përndryshe ajo e ruajtur, përndryshe tema e çelët
  paint(read("sessionStorage") || read("localStorage") || "light");
  document.addEventListener("DOMContentLoaded", function () {
    paint(current());
  });
})();
