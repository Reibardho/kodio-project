/* "kodio" 3D në fund të faqes (.fmark): kopje të njëjta të tekstit njëra pas tjetrës japin thellësinë,
   dhe i gjithë teksti kthehet drejt shigjetës së maus-it. Në telefon lëkundet lehtë vetë (CSS).
   Stili: css/footer.css (.fmark.is3d, .f3, .fl). */
(function () {
  var K = window.Kodio,
    m = document.querySelector(".fmark");
  if (!m) return;

  var word = m.textContent.trim(),
    N = innerWidth < 700 ? 12 : 26, // sa shtresa (thellësia)
    html = "";
  for (var i = N; i >= 0; i--) {
    html +=
      '<span class="fl' +
      (i ? "" : " ff") +
      '" style="--k:' +
      (i / N).toFixed(3) +
      ";--z:" +
      i +
      '">' +
      word +
      "</span>";
  }
  m.innerHTML = '<span class="f3">' + html + "</span>";
  m.classList.add("is3d");
  var f3 = m.firstChild;
  // mbrojtje: nëse CSS-i 3D nuk është ngarkuar ende, mos shfaq shtresat njëra pas tjetrës
  if (getComputedStyle(f3.firstChild).position !== "absolute") {
    m.classList.remove("is3d");
    m.textContent = word;
    return;
  }
  var vis = false;

  new IntersectionObserver(function (e) {
    vis = e[e.length - 1].isIntersecting;
    m.classList.toggle("run", vis);
  }).observe(m);

  if (K.touch || K.reduce) return;

  var rx = 10,
    ry = -16,
    px = null,
    py = 0,
    raf = 0;

  function step() {
    raf = 0;
    if (px === null || !vis) return;
    var r = m.getBoundingClientRect(),
      tx = K.clamp((r.top + r.height / 2 - py) / (innerHeight * 0.6), -1, 1) * 18,
      ty = K.clamp((px - (r.left + r.width / 2)) / (r.width * 0.6), -1, 1) * 30;
    rx += (tx - rx) * 0.12;
    ry += (ty - ry) * 0.12;
    f3.style.transform = "rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
    if (Math.abs(tx - rx) + Math.abs(ty - ry) > 0.05) raf = requestAnimationFrame(step);
  }

  addEventListener(
    "pointermove",
    function (e) {
      px = e.clientX;
      py = e.clientY;
      if (vis && !raf) raf = requestAnimationFrame(step);
    },
    { passive: true },
  );
  K.onScroll(function () {
    if (vis && !raf) raf = requestAnimationFrame(step);
  });
})();
