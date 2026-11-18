/* Rrjeti i pikave që lëvizin në sfondin e hero-s (canvas #cv). */
(function () {
  var K = window.Kodio,
    $ = K.$;
  var col = K.accent;

  var cv = $("cv"),
    c = cv.getContext("2d"),
    P = [],
    W,
    H;

  function rs() {
    W = cv.width = cv.offsetWidth;
    H = cv.height = cv.offsetHeight;
  }

  rs();

  addEventListener("resize", rs);

  for (var i = 0; i < 90; i++)
    P.push({
      x: Math.random() * 2000,
      y: Math.random() * 900,
      vx: (Math.random() - 0.5) * 0.9,
      vy: (Math.random() - 0.5) * 0.9,
    });

  function draw() {
    c.clearRect(0, 0, W, H);
    var a = col();
    c.fillStyle = a;
    c.strokeStyle = a;
    c.lineWidth = 1.3;
    P.forEach(function (p, i) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      c.globalAlpha = 0.9;
      c.beginPath();
      c.arc(p.x, p.y, 2.6, 0, 6.3);
      c.fill();
      for (var j = i + 1; j < P.length; j++) {
        var q = P[j],
          d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 150) {
          c.globalAlpha = (1 - d / 150) * 0.6;
          c.beginPath();
          c.moveTo(p.x, p.y);
          c.lineTo(q.x, q.y);
          c.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  }

  if (!K.reduce) draw();
})();
