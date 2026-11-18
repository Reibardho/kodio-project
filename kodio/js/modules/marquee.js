/* Shiriti lëvizës: rrëshqet vazhdimisht dhe ndërron drejtim/shpejtohet sipas scroll-it. */
(function () {
  var K = window.Kodio,
    t = document.getElementById("mqt");
  if (!t || K.reduce) return;
  var x = 0,
    dir = 1,
    boost = 0,
    w = 0,
    raf = 0,
    last = 0,
    vis = false;

  function measure() {
    w = t.firstElementChild.offsetWidth;
  }
  function step(now) {
    raf = 0;
    var dt = last ? Math.min(50, now - last) : 16;
    last = now;
    x -= (0.05 + boost) * dt * dir;
    boost *= 0.94;
    if (x <= -w) x += w;
    if (x > 0) x -= w;
    t.style.transform = "translate3d(" + x + "px,0,0)";
    if (vis) raf = requestAnimationFrame(step);
    else last = 0;
  }
  function go() {
    if (!raf && vis) raf = requestAnimationFrame(step);
  }

  new IntersectionObserver(function (e) {
    vis = e[0].isIntersecting;
    go();
  }).observe(t.parentNode);

  K.onScroll(function (y, d) {
    if (!d) return;
    dir = d > 0 ? 1 : -1;
    boost = Math.min(1.1, boost + Math.abs(d) * 0.006);
  });
  addEventListener("resize", measure);
  K.onLang(measure);
  measure();
})();
