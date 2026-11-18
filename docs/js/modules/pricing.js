/* Çmimet: skedat (Dizajn dhe ndërtim / Mirëmbajtje / Shtesa / Kushtet).
   Paketat dhe mirëmbajtja shfaqen si karta të gjata me detaje; butoni "Zgjidh paketën"
   hap WhatsApp me emrin dhe çmimin e paketës. Të dhënat: js/data/pricing.js. */
(function () {
  var K = window.Kodio,
    $ = K.$,
    L = K.L;
  var PACKS = window.KODIO_PACKS,
    CARE = window.KODIO_CARE,
    EXTRAS = window.KODIO_EXTRAS,
    TERMS = window.KODIO_TERMS;

  var pt = $("pt"),
    grid = $("pr");

  function price(min, max) {
    if (!max) return "€" + min + "+";
    if (max === min) return "€" + min;
    return "€" + min + " – " + max;
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  // Karta e gjatë: p = {name, desc, feats, tag?, time?}, pr = teksti i çmimit, per = "/muaj" ose ""
  function card(p, i, pr, per) {
    var msg =
      L("Përshëndetje! Jam i interesuar për paketën") + ": " + L(p.name) + " (" + pr + per + ").";
    return (
      '<article class="pk' +
      (p.tag ? " hot" : "") +
      '" style="--i:' +
      i +
      '">' +
      (p.tag ? '<span class="pk-tag">' + esc(L(p.tag)) + "</span>" : "") +
      '<div class="pk-top"><span class="pk-ix">0' +
      (i + 1) +
      "</span>" +
      (p.time ? '<span class="pk-time">' + esc(L(p.time)) + "</span>" : "") +
      "</div>" +
      "<h3>" +
      esc(L(p.name)) +
      "</h3>" +
      '<p class="pk-d">' +
      esc(L(p.desc)) +
      "</p>" +
      '<div class="pk-p"><b>' +
      pr +
      "</b>" +
      (per ? "<small>" + per + "</small>" : "") +
      "</div>" +
      '<a class="btn pk-cta" target="_blank" rel="noopener" href="' +
      esc(K.waUrl(msg)) +
      '">' +
      esc(L("Zgjidh paketën")) +
      "</a>" +
      '<div class="pk-in">' +
      esc(L("Përfshin")) +
      "</div><ul>" +
      p.feats
        .map(function (f) {
          return "<li>" + esc(L(f)) + "</li>";
        })
        .join("") +
      "</ul></article>"
    );
  }

  // Kartë e vogël: emri + vlera (shtesat dhe kushtet)
  function row(a, b, i) {
    return (
      '<div class="prow" style="--i:' +
      i +
      '"><span>' +
      esc(L(a)) +
      "</span><b>" +
      esc(L(b)) +
      "</b></div>"
    );
  }

  function pshow(t) {
    var h = "";
    if (t === 0)
      h = PACKS.map(function (p, i) {
        return card(p, i, price(p.min, p.max), "");
      }).join("");
    else if (t === 1)
      h = CARE.map(function (c, i) {
        return card(c, i, "€" + c.price, "/" + L("muaj"));
      }).join("");
    else if (t === 2)
      h = EXTRAS.map(function (x, i) {
        return row(x[0], price(x[1], x[2]), i);
      }).join("");
    else
      h = TERMS.map(function (x, i) {
        return row(x[0], x[1], i);
      }).join("");
    grid.className = "pgrid" + (t > 1 ? " sm" : "");
    grid.innerHTML = h;
    pt.querySelectorAll("button").forEach(function (b, j) {
      b.classList.toggle("on", j === t);
      b.setAttribute("aria-selected", j === t);
    });
  }

  pt.onclick = function (e) {
    var b = e.target.closest("button");
    if (b) pshow(+b.dataset.t);
  };

  pshow(0);
  K.onLang(function () {
    pshow(+pt.querySelector(".on").dataset.t);
  });
})();
