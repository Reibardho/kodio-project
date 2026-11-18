/* Gjurma e maus-it në sfond: re e butë gri, e gjerë dhe e lehtë si puplë.
   Çdo pikë është një "puff" që zgjerohet, venitet dhe ngrihet pak teksa shpërndahet. */
(function () {
  var cv = document.getElementById("trail");
  if (!cv || window.Kodio.touch || window.Kodio.reduce) return;
  var ctx = cv.getContext("2d"),
    puffs = [],
    LIFE = 1700, // ms sa rri e dukshme
    R0 = 46, // rrezja fillestare
    R1 = 150, // rrezja kur shpërndahet
    ALPHA = 0.2,
    SPACING = 16, // largësia mes puff-eve
    last = null,
    raf = 0,
    sprite = null,
    spriteDark = null;

  function size() {
    var dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = innerWidth * dpr;
    cv.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size();
  addEventListener("resize", size);

  function makeSprite(rgb) {
    var c = document.createElement("canvas"),
      n = 160,
      x;
    c.width = c.height = n;
    x = c.getContext("2d");
    var g = x.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
    g.addColorStop(0, "rgba(" + rgb + ",1)");
    g.addColorStop(0.45, "rgba(" + rgb + ",.45)");
    g.addColorStop(1, "rgba(" + rgb + ",0)");
    x.fillStyle = g;
    x.fillRect(0, 0, n, n);
    return c;
  }
  sprite = makeSprite("120,120,120");
  spriteDark = makeSprite("215,215,215");

  function add(x, y) {
    puffs.push({
      x: x,
      y: y,
      t: performance.now(),
      dx: (Math.random() - 0.5) * 40,
      dy: -20 - Math.random() * 30,
      s: 0.85 + Math.random() * 0.4,
    });
    if (puffs.length > 140) puffs.shift();
  }

  addEventListener("mousemove", function (e) {
    var x = e.clientX,
      y = e.clientY;
    if (last) {
      var dx = x - last.x,
        dy = y - last.y,
        d = Math.sqrt(dx * dx + dy * dy),
        n = Math.floor(d / SPACING);
      for (var i = 1; i <= n; i++) add(last.x + (dx * i) / (n + 1), last.y + (dy * i) / (n + 1));
      if (n) last = { x: x, y: y };
      else if (d < SPACING) return start();
    } else add(x, y);
    last = { x: x, y: y };
    start();
  });
  addEventListener("mouseleave", function () {
    last = null;
  });
  function start() {
    if (!raf) raf = requestAnimationFrame(draw);
  }

  function draw(now) {
    raf = 0;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    while (puffs.length && now - puffs[0].t > LIFE) puffs.shift();
    if (!puffs.length) return;
    var img = document.documentElement.dataset.theme === "dark" ? spriteDark : sprite;
    for (var i = 0; i < puffs.length; i++) {
      var p = puffs[i],
        a = (now - p.t) / LIFE,
        e = 1 - Math.pow(1 - a, 2), // zgjerim i shpejtë, pastaj i ngadaltë
        r = (R0 + (R1 - R0) * e) * p.s,
        al = ALPHA * Math.pow(1 - a, 1.6);
      ctx.globalAlpha = al;
      ctx.drawImage(img, p.x + p.dx * e - r, p.y + p.dy * e - r, r * 2, r * 2);
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(draw);
  }
})();
