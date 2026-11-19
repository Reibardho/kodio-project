/* Rrjeti i pikave që lëvizin në sfondin e hero-s (canvas #cv).
   Vizatohet vetëm kur hero duket në ekran, dhe me pak thirrje (pikat në një path, vijat në 6 nivele
   transparence), që faqja të mbetet e shpejtë edhe në telefona. */
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

  var LV = 6; // nivelet e transparencës për vijat

  function draw() {
    c.clearRect(0, 0, W, H);
    var a = col(),
      i,
      j,
      p;
    c.fillStyle = a;
    c.strokeStyle = a;
    c.lineWidth = 1.3;
    for (i = 0; i < P.length; i++) {
      p = P[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    }
    // vijat: një path për çdo nivel transparence
    var B = [];
    for (i = 0; i < LV; i++) B.push([]);
    for (i = 0; i < P.length; i++) {
      p = P[i];
      for (j = i + 1; j < P.length; j++) {
        var q = P[j],
          dx = p.x - q.x,
          dy = p.y - q.y,
          d2 = dx * dx + dy * dy;
        if (d2 < 22500) B[Math.min(LV - 1, Math.floor((Math.sqrt(d2) / 150) * LV))].push(p, q);
      }
    }
    for (i = 0; i < LV; i++) {
      if (!B[i].length) continue;
      c.globalAlpha = (1 - (i + 0.5) / LV) * 0.6;
      c.beginPath();
      for (j = 0; j < B[i].length; j += 2) {
        c.moveTo(B[i][j].x, B[i][j].y);
        c.lineTo(B[i][j + 1].x, B[i][j + 1].y);
      }
      c.stroke();
    }
    // pikat: një path
    c.globalAlpha = 0.9;
    c.beginPath();
    for (i = 0; i < P.length; i++) {
      c.moveTo(P[i].x + 2.6, P[i].y);
      c.arc(P[i].x, P[i].y, 2.6, 0, 6.3);
    }
    c.fill();
  }

  if (!K.reduce) K.loop(cv, draw);
})();
