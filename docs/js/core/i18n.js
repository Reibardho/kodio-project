/* Gjuha e faqes.
   K.L("tekst shqip") kthen përkthimin në gjuhën aktive. K.setLang("es") ndërron gjuhën e gjithë faqes.
   Lista e gjuhëve: js/data/languages.js. Përkthimet: js/data/lang/<kodi>.js (ngarkohen kur zgjidhen).
   Modulet që ndërtojnë tekst dinamik regjistrohen me K.onLang(funksion). */
(function () {
  var K = window.Kodio,
    LANGS = window.KODIO_LANGS,
    SQ = window.KODIO_SQ,
    PACK = window.KODIO_LANG,
    KEY = "kodio_lang",
    LG = "sq",
    D = {},
    started = false;
  // Zonat që rindërtohen nga JS ose nuk përkthehen (lista e gjuhëve, logot në svg)
  var SKIP = "[data-i],#cs,#pr,#etype,#eext,#rc,#vc,#vcap,#ct,#ctt,#cdd,#ctk,#murl,#lgm,svg";

  // Hapësirat dhe rreshtat e rinj bëhen një hapësirë, që paragrafët e ndarë në disa rreshta
  // te index.html të gjejnë përkthimin.
  function norm(s) {
    return String(s).replace(/\s+/g, " ").trim();
  }
  function info(l) {
    return LANGS.filter(function (x) {
      return x.code === l;
    })[0];
  }

  K.L = function (s) {
    return (LG !== "sq" && D[norm(s)]) || s;
  };
  K.lang = function () {
    return LG;
  };

  // Ngarkon js/data/lang/<l>.js një herë (punon edhe kur faqja hapet me dy klikime, file://)
  function load(l, cb) {
    if (l === "sq" || PACK[l]) return cb(true);
    var sc = document.createElement("script");
    sc.src = "js/data/lang/" + l + ".js";
    sc.onload = function () {
      cb(!!PACK[l]);
    };
    sc.onerror = function () {
      cb(false);
    };
    document.head.appendChild(sc);
  }

  function translateDom() {
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT),
      n,
      list = [];
    while ((n = w.nextNode())) list.push(n);
    list.forEach(function (n) {
      var p = n.parentNode;
      if (!p || /^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName) || p.closest(SKIP)) return;
      if (n.__o === undefined) n.__o = n.nodeValue;
      var k = n.__o.trim(),
        t = k && LG !== "sq" && D[norm(k)];
      n.nodeValue = t ? n.__o.replace(k, t) : n.__o;
    });
  }

  function apply(l) {
    var p = l === "sq" ? SQ : PACK[l],
      root = document.documentElement;
    LG = l;
    D = {};
    if (l !== "sq")
      Object.keys(p.d).forEach(function (k) {
        D[norm(k)] = p.d[k];
      });
    document.querySelectorAll("[data-i]").forEach(function (el) {
      el.innerHTML = p.tr[el.dataset.i] || SQ.tr[el.dataset.i];
    });
    root.lang = l;
    root.dir = info(l).dir || "ltr";
    document.title = p.title || SQ.title;
    var c = document.getElementById("lgc");
    if (c) c.textContent = info(l).short;
    document.querySelectorAll(".lg").forEach(function (b) {
      b.classList.toggle("on", b.dataset.l === l);
    });
    // Politika e privatësisë hapet në anglisht për çdo gjuhë tjetër përveç shqipes
    document.querySelectorAll('a[href^="privacy.html"]').forEach(function (a) {
      a.href = "privacy.html" + (l === "sq" ? "" : "?l=" + l);
    });
    if (!K.ready) return;
    translateDom();
    document.querySelectorAll("[placeholder]").forEach(function (el) {
      if (!el.dataset.ph) el.dataset.ph = el.getAttribute("placeholder");
      el.setAttribute("placeholder", K.L(el.dataset.ph));
    });
    K.langHooks.forEach(function (fn) {
      fn(l);
    });
  }

  // Për vizitat e ardhshme (localStorage): vetëm nëse vizitori ka lejuar cookies "Preferenca"
  function persist(l) {
    try {
      if (K.consent && K.consent.preferences) localStorage.setItem(KEY, l);
      else localStorage.removeItem(KEY);
    } catch {
      /* pa localStorage */
    }
  }

  // Zgjedhja e vizitorit: mbahet gjithmonë për skedën e hapur (që të mos humbasë me refresh)
  function remember(l) {
    try {
      sessionStorage.setItem(KEY, l);
    } catch {
      /* pa sessionStorage */
    }
    persist(l);
  }

  K.setLang = function (l, keep) {
    if (!info(l)) l = "sq";
    load(l, function (ok) {
      apply(ok ? l : "sq");
    });
    if (!keep) remember(l);
  };

  // Gjuha në hapje: zgjedhja e kësaj skede, pastaj ajo e ruajtur, pastaj gjuha e shfletuesit (nëse e kemi), pastaj shqip
  K.startLang = function () {
    started = true;
    var saved = null;
    try {
      saved = sessionStorage.getItem(KEY) || localStorage.getItem(KEY);
    } catch {
      /* pa storage */
    }
    if (saved && info(saved)) return saved;
    var nav =
      navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language || "sq"];
    for (var i = 0; i < nav.length; i++) {
      var c = String(nav[i]).slice(0, 2).toLowerCase();
      if (info(c)) return c;
    }
    return "sq";
  };

  // Kur ndryshon pëlqimi për cookies: ruaj ose fshi gjuhën (në hapje të faqes vetëm fshin, nëse s'ka leje)
  window.addEventListener("kodio:consent", function (e) {
    if (started || !(e.detail && e.detail.preferences)) persist(LG);
  });

  // --- Menuja 🌐
  var btn = document.getElementById("lgb"),
    menu = document.getElementById("lgm");
  if (btn && menu) {
    menu.innerHTML = LANGS.map(function (x) {
      return (
        '<button class="lg" type="button" data-l="' +
        x.code +
        '" lang="' +
        x.code +
        '"' +
        (x.dir ? ' dir="' + x.dir + '"' : "") +
        "><b>" +
        x.short +
        "</b>" +
        x.name +
        "</button>"
      );
    }).join("");
    var open = function (v) {
      menu.hidden = !v;
      btn.setAttribute("aria-expanded", v);
    };
    btn.onclick = function (e) {
      e.stopPropagation();
      open(menu.hidden);
    };
    menu.onclick = function (e) {
      var b = e.target.closest(".lg");
      if (!b) return;
      K.setLang(b.dataset.l);
      open(false);
    };
    document.addEventListener("click", function (e) {
      if (!menu.hidden && !e.target.closest(".lgw")) open(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) {
        open(false);
        btn.focus();
      }
    });
  }

  apply("sq");
})();
