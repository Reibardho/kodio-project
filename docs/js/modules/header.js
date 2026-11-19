/* Header: menuja me 9 pika, shiriti i progresit lart dhe lidhja aktive në menu gjatë scroll-it.
   Butoni i temës (hëna/dielli) punon nga js/core/theme.js. */
(function () {
  var K = window.Kodio,
    $ = K.$;

  var bg = $("bg"),
    dr = $("dr"),
    sc = $("sc");

  function tog(o) {
    dr.classList.toggle("on", o);
    sc.classList.toggle("on", o);
    bg.setAttribute("aria-expanded", o);
  }

  bg.onclick = function () {
    tog(!dr.classList.contains("on"));
  };

  sc.onclick = function () {
    tog(false);
  };

  dr.querySelectorAll("a").forEach(function (a) {
    a.onclick = function () {
      tog(false);
    };
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") tog(false);
  });

  var nls = document.querySelectorAll(".nl a");

  var sp = $("sp");

  // Lidhja aktive në menu + shiriti i progresit (një dëgjues i vetëm, K.onScroll)
  K.onScroll(function () {
    var y = scrollY + 130,
      cu = null;
    nls.forEach(function (a) {
      var s = document.querySelector(a.getAttribute("href"));
      if (
        s &&
        s.offsetTop <= y &&
        (!cu || s.offsetTop >= document.querySelector(cu.getAttribute("href")).offsetTop)
      )
        cu = a;
    });
    nls.forEach(function (a) {
      a.classList.toggle("on", a === cu);
    });
    var h = document.documentElement;
    sp.style.width = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100 + "%";
  });
})();
