/* Dritarja e shfletuesit në hero:
   1) ekranet e vërteta të projektit (#wshots) që ndërrohen dhe adresa që shkruhet vetë;
   2) anim 3D pas maus-it: vendos --mx/--my (-1…1) te .ba (website i vjetër + i ri),
      CSS-i anon të dyja dritaret dhe lëviz kartat. */
(function () {
  var K = window.Kodio,
    $ = K.$;

  // Ekranet e projektit: secila foto ka data-url; ndërrohen çdo 7.4s dhe adresa shkruhet vetë.
  var box = $("wshots"),
    shots = box ? [].slice.call(box.querySelectorAll("img")) : [],
    cur = 0,
    mt;

  function mtype(s) {
    var i = 0,
      el = $("murl");
    clearInterval(mt);
    el.textContent = "";
    mt = setInterval(function () {
      el.textContent = s.slice(0, ++i);
      if (i >= s.length) clearInterval(mt);
    }, 60);
  }

  function show(n) {
    var prev = shots[cur],
      next = shots[n];
    if (prev !== next) {
      prev.classList.remove("on");
      prev.classList.add("out");
      setTimeout(function () {
        prev.classList.remove("out");
      }, 800);
    }
    next.classList.remove("on");
    void next.offsetWidth; // rinis lëvizjen e scroll-it
    next.classList.add("on");
    cur = n;
    mtype(next.dataset.url);
  }

  if (shots.length) {
    show(0);
    setInterval(function () {
      show((cur + 1) % shots.length);
    }, 7400);
  }

  // --- Lëvizja pas maus-it
  var mk = document.querySelector(".ba") || document.querySelector(".mk");
  if (!mk || K.touch || K.reduce) return;
  var tx = 0,
    ty = 0,
    x = 0,
    y = 0,
    raf = 0,
    ZONE = 160; // sa px jashtë dritares fillon të reagojë

  document.addEventListener(
    "pointermove",
    function (e) {
      var r = mk.getBoundingClientRect();
      var inside =
        e.clientX > r.left - ZONE &&
        e.clientX < r.right + ZONE &&
        e.clientY > r.top - ZONE &&
        e.clientY < r.bottom + ZONE;
      tx = inside ? K.clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2), -1, 1) : 0;
      ty = inside ? K.clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2), -1, 1) : 0;
      if (!raf) raf = requestAnimationFrame(frame);
    },
    { passive: true },
  );

  function frame() {
    raf = 0;
    x += (tx - x) * 0.1;
    y += (ty - y) * 0.1;
    mk.style.setProperty("--mx", x.toFixed(4));
    mk.style.setProperty("--my", y.toFixed(4));
    if (Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001) raf = requestAnimationFrame(frame);
  }
})();
