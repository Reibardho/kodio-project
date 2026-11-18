/* Vlerësuesi i kostos dhe fatura. Çmimet: js/data/pricing.js (ET dhe EX). */
(function () {
  var K = window.Kodio,
    $ = K.$,
    L = K.L;
  var ET = window.KODIO_ET,
    EX = window.KODIO_EX;

  var et = 1,
    ex = {},
    rcd = {};

  function rng(a, b) {
    return b && b !== a ? "€" + a + "–" + b : "€" + a;
  }

  function xpr(x) {
    return rng(x[1], x[2]) + (x[3] ? "/" + L("muaj") : "");
  }

  function ebuild() {
    var s = "";
    ET.forEach(function (t, i) {
      s +=
        "<button class='eo" +
        (i === et ? " on" : "") +
        "' data-i='" +
        i +
        "'>" +
        L(t.k) +
        "<small>" +
        L("nga") +
        " €" +
        t.a +
        "</small></button>";
    });
    $("etype").innerHTML = s;
    s = "";
    EX.forEach(function (x, i) {
      s +=
        "<button class='ex" +
        (ex[i] ? " on" : "") +
        "' data-i='" +
        i +
        "'>" +
        L(x[0]) +
        "<small>+" +
        xpr(x) +
        "</small></button>";
    });
    $("eext").innerHTML = s;
    $("epg").disabled = !ET[et].pg;
    $("epn").textContent = $("epg").value;
    erc();
  }

  function erc() {
    var T = ET[et],
      n = +$("epg").value,
      pe = T.pg ? (n <= 3 ? 0 : n <= 6 ? 45 : 90) : 0,
      lo = T.a + pe,
      hi = T.b ? T.b + pe : 0,
      mo = 0,
      ls =
        "<div class='rl'><span>" +
        L(T.k) +
        "</span><i></i><b>" +
        (T.b ? rng(T.a, T.b) : "€" + T.a + "+") +
        "</b></div>";
    if (pe)
      ls +=
        "<div class='rl'><span>" +
        L(n <= 6 ? "Faqe shtesë (4–6)" : "Faqe shtesë (7+)") +
        "</span><i></i><b>€" +
        pe +
        "</b></div>";
    EX.forEach(function (x, i) {
      if (!ex[i]) return;
      ls += "<div class='rl'><span>" + L(x[0]) + "</span><i></i><b>" + xpr(x) + "</b></div>";
      if (x[3]) mo += x[1];
      else {
        lo += x[1];
        if (hi) hi += x[2];
      }
    });
    rcd = { T: T, lo: lo, hi: hi, n: n, mo: mo };
    $("rc").innerHTML =
      "<div class='rh'>" +
      L("OFERTA") +
      "</div>" +
      ls +
      "<div class='rt'><span>" +
      L("TOTALI") +
      "</span><i></i><b>" +
      (hi ? "€" + lo + " – €" + hi : "€" + lo + "+") +
      "</b></div>" +
      (mo ? "<div class='rd'>" + L("Totali nuk përfshin mirëmbajtjen mujore") + "</div>" : "") +
      "<div class='rd'>⏱ " +
      L("Koha e dorëzimit") +
      ": " +
      L(T.d) +
      "</div><p class='rn'>" +
      L(
        "Vlerësim orientues, jo çmim final. Numrin e saktë ta konfirmojmë pasi të flasim për nevojat e tua.",
      ) +
      "</p><button class='btn' id='eoff'>" +
      L("Merr ofertën time të saktë") +
      "</button>";
  }

  $("etype").onclick = function (e) {
    var b = e.target.closest("button");
    if (b) {
      et = +b.dataset.i;
      ebuild();
    }
  };

  $("eext").onclick = function (e) {
    var b = e.target.closest("button");
    if (b) {
      var i = +b.dataset.i;
      ex[i] = !ex[i];
      b.classList.toggle("on", !!ex[i]);
      erc();
    }
  };

  $("epg").oninput = function () {
    $("epn").textContent = this.value;
    erc();
  };

  $("rc").onclick = function (e) {
    if (e.target.id === "eoff") {
      var T = rcd.T;
      $("m").value =
        L("Vlerësim kostoje") +
        ": " +
        L(T.k) +
        (T.pg ? " (≈" + rcd.n + " " + L("faqe") + ")" : "") +
        EX.filter(function (x, i) {
          return ex[i];
        })
          .map(function (x) {
            return ", " + L(x[0]);
          })
          .join("") +
        " — €" +
        rcd.lo +
        (rcd.hi ? "–€" + rcd.hi : "+") +
        (rcd.mo ? " (+ €" + rcd.mo + "/" + L("muaj") + ")" : "");
      $("kontakt").scrollIntoView({ behavior: "smooth" });
    }
  };

  ebuild();
  K.onLang(ebuild);
})();
