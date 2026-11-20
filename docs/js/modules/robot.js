/* Roboti në hero: lëviz majtas-djathtas kur afron maus-in; klikimi nxjerr zemrat dhe butonat (WhatsApp, çmimet, kontakti). */
(function () {
  var K = window.Kodio,
    $ = K.$,
    L = K.L;

  var fb = $("fbot"),
    fi = fb.querySelector(".fi"),
    bots = fb.parentNode,
    fpx = 0,
    fpv = 0,
    fph = 0,
    fact = false,
    funtil = 0,
    ffz = false,
    fto,
    fhi,
    flt = performance.now(),
    lastTr = "",
    lastRo = "";

  var SV2 = [
    ["📲 WhatsApp", "wa"],
    ["🌐 Landing page", "#cmimet"],
    ["🛒 Dyqan online", "#cmimet"],
    ["⚙️ Web app", "#vleresuesi"],
    ["🚀 SEO & shpejtësi", "#cmimet"],
    ["💬 Kontakt", "#kontakt"],
  ];

  bots.addEventListener("pointermove", function (e) {
    if (fact || ffz) return;
    var r = fb.getBoundingClientRect();
    if (
      e.clientX > r.left - 50 &&
      e.clientX < r.right + 50 &&
      e.clientY > r.top - 30 &&
      e.clientY < r.bottom + 30
    ) {
      fact = true;
      wake();
    }
  });

  bots.addEventListener("pointerleave", function () {
    fact = false;
  });

  // Animacioni punon vetëm kur roboti duket dhe po lëviz; kur qëndron në vend, ndalet (kursen baterinë)
  var raf = 0,
    vis = true;
  function wake() {
    if (raf || !vis) return;
    flt = performance.now();
    raf = requestAnimationFrame(ftick);
  }
  new IntersectionObserver(function (en) {
    vis = en[en.length - 1].isIntersecting;
    wake();
  }).observe(fb);

  function ftick(t) {
    raf = 0;
    var dt = Math.min(0.05, (t - flt) / 1000) || 0.016;
    flt = t;
    var on = !ffz && (fact || t < funtil),
      A = Math.min(innerWidth * 0.24, 230);
    if (on) fph += dt * 0.7;
    var tg = ffz ? fpx : on ? A * Math.sin(fph) : 0,
      nx = fpx + (tg - fpx) * Math.min(1, dt * 3);
    fpv = (nx - fpx) / Math.max(dt, 0.001);
    fpx = nx;
    if (!on && !ffz && Math.abs(fpx) < 1) fph = 0;
    if (!on && !ffz && Math.abs(fpx) < 0.3 && Math.abs(fpv) < 3) fpx = fpv = 0; // ka mbërritur në qendër
    // shkruaj stilet vetëm kur ndryshojnë (përndryshe shfletuesi rillogarit faqen në çdo frame)
    var tr = "translateX(" + fpx.toFixed(1) + "px)",
      ro = K.clamp(fpv * 0.035, -6, 6).toFixed(2) + "deg";
    if (tr !== lastTr) fb.style.transform = lastTr = tr;
    if (ro !== lastRo) fi.style.rotate = lastRo = ro;
    if (Math.abs(fpv) > 20) fi.classList.toggle("flip", fpv < 0);
    fb.classList.toggle("mv", on);
    var still = !on && Math.abs(fpv) < 0.5 && (ffz || fpx === 0); // në qendër ose i ngrirë (zemrat)
    if (vis && !still) raf = requestAnimationFrame(ftick);
  }

  function funlove() {
    clearTimeout(fto);
    clearInterval(fhi);
    ffz = false;
    fb.classList.remove("love");
    var s = fb.querySelector(".svc2");
    if (s) s.remove();
    fb.querySelectorAll(".fh").forEach(function (x) {
      x.remove();
    });
    wake();
  }

  function flove() {
    if (fb.classList.contains("love")) {
      funlove();
      return;
    }
    ffz = true;
    fb.classList.add("love");
    var r = fb.getBoundingClientRect(),
      c = document.createElement("div");
    c.className = "svc2 " + (r.left + r.width / 2 < innerWidth / 2 ? "r" : "l");
    SV2.forEach(function (s, i) {
      var a = document.createElement("a");
      if (s[1] === "wa") {
        a.href = K.waHello();
        a.target = "_blank";
        a.rel = "noopener";
        a.className = "wa";
      } else a.href = s[1];
      a.textContent = L(s[0]);
      a.style.setProperty("--i", i);
      a.addEventListener("click", funlove);
      c.appendChild(a);
    });
    fb.appendChild(c);
    fhi = setInterval(function () {
      var s = document.createElement("span");
      s.className = "fh";
      s.textContent = "❤️";
      s.style.setProperty("--hx", Math.random() * 70 - 35 + "px");
      s.style.left = 25 + Math.random() * 50 + "%";
      fb.appendChild(s);
      setTimeout(function () {
        s.remove();
      }, 1800);
    }, 240);
    fto = setTimeout(funlove, 7000);
  }

  // Njoftimi "Më shtyp" sipër robotit: zhduket pasi vizitori e prek (dhe nuk del më gjatë kësaj vizite)
  try {
    if (sessionStorage.getItem("kodio_bot")) fb.classList.add("tapped");
  } catch {
    /* pa sessionStorage */
  }
  function tapped() {
    fb.classList.add("tapped");
    try {
      sessionStorage.setItem("kodio_bot", "1");
    } catch {
      /* pa sessionStorage */
    }
  }

  fb.addEventListener("click", function () {
    funtil = performance.now() + 4500;
    tapped();
    flove();
    wake();
  });

  fb.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      tapped();
      flove();
    }
  });
})();
