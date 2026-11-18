/* Globi i kuq me shtetet e ndara (canvas #gl). Kufijtë e shteteve: js/data/world.js. */
(function () {
  var K = window.Kodio,
    $ = K.$;
  var col = K.accent;
  var WLD = window.KODIO_WORLD;

  var gc = $("gl"),
    g = gc.getContext("2d"),
    GW,
    R,
    rot = 0,
    T = 0.38,
    rad = Math.PI / 180;

  var MK = [
    [41.3, 19.8],
    [51.5, -0.1],
    [40.7, -74],
    [52.5, 13.4],
    [25.2, 55.3],
    [42.6, 21.2],
  ];

  function gs() {
    var d = devicePixelRatio || 1;
    GW = gc.offsetWidth;
    gc.width = GW * d;
    gc.height = GW * d;
    g.setTransform(d, 0, 0, d, 0, 0);
    R = GW * 0.42;
  }

  gs();

  addEventListener("resize", gs);

  function pj(la, lo) {
    var x = Math.cos(la) * Math.sin(lo + rot),
      y = Math.sin(la),
      z = Math.cos(la) * Math.cos(lo + rot),
      y2 = y * Math.cos(T) - z * Math.sin(T),
      z2 = y * Math.sin(T) + z * Math.cos(T);
    return [GW / 2 + x * R, GW / 2 - y2 * R, z2];
  }

  var gt = 0;

  function gd() {
    gt++;
    var a = col();
    g.clearRect(0, 0, GW, GW);
    var gr = g.createRadialGradient(GW * 0.4, GW * 0.38, R * 0.1, GW / 2, GW / 2, R);
    gr.addColorStop(0, "rgba(0,0,0,.06)");
    gr.addColorStop(1, "rgba(0,0,0,.02)");
    g.fillStyle = gr;
    g.beginPath();
    g.arc(GW / 2, GW / 2, R, 0, 6.3);
    g.fill();
    g.strokeStyle = a;
    g.globalAlpha = 0.35;
    g.lineWidth = 1;
    g.stroke();
    var HL = {
        Albania: 1,
        Kosovo: 1,
        Germany: 1,
        "United Kingdom": 1,
        "United States of America": 1,
        "United Arab Emirates": 1,
      },
      cx0 = GW / 2,
      bgc = K.cssVar("--bg") || "#fff";
    WLD.forEach(function (c) {
      var hl = HL[c.n];
      c.p.forEach(function (r) {
        var any = false,
          pts = [];
        for (var i = 0; i < r.length; i += 2) {
          var q = pj((r[i + 1] / 2) * rad, (r[i] / 2) * rad),
            sx = q[0],
            sy = q[1];
          if (q[2] >= 0) any = true;
          else {
            var dx = sx - cx0,
              dy = sy - cx0,
              dd = Math.hypot(dx, dy) || 1;
            sx = cx0 + (dx / dd) * R;
            sy = cx0 + (dy / dd) * R;
          }
          pts.push(sx, sy);
        }
        if (!any) return;
        g.beginPath();
        g.moveTo(pts[0], pts[1]);
        for (var j = 2; j < pts.length; j += 2) g.lineTo(pts[j], pts[j + 1]);
        g.closePath();
        g.globalAlpha = 1;
        g.fillStyle = hl ? "#e11d2e" : "#a8382c";
        g.fill();
        g.strokeStyle = bgc;
        g.lineWidth = 1.3;
        g.stroke();
      });
    });
    var sh = g.createRadialGradient(cx0, cx0, R * 0.55, cx0, cx0, R);
    sh.addColorStop(0, "rgba(30,5,0,0)");
    sh.addColorStop(1, "rgba(30,5,0,.4)");
    g.globalAlpha = 1;
    g.fillStyle = sh;
    g.beginPath();
    g.arc(cx0, cx0, R, 0, 6.3);
    g.fill();
    g.lineWidth = 1;
    var T0 = pj(MK[0][0] * rad, MK[0][1] * rad);
    MK.forEach(function (m, i) {
      var p = pj(m[0] * rad, m[1] * rad);
      if (p[2] <= 0) return;
      if (i > 0 && T0[2] > 0) {
        g.globalAlpha = 0.8;
        g.strokeStyle = "#fff";
        g.beginPath();
        g.moveTo(T0[0], T0[1]);
        g.quadraticCurveTo(
          (T0[0] + p[0]) / 2 + (GW / 2 - (T0[0] + p[0]) / 2) * -0.25,
          (T0[1] + p[1]) / 2 - GW * 0.1,
          p[0],
          p[1],
        );
        g.stroke();
      }
      var pu = (gt / 40 + i) % 3;
      g.globalAlpha = Math.max(0, 0.6 - pu * 0.2);
      g.strokeStyle = "#fff";
      g.beginPath();
      g.arc(p[0], p[1], 4 + pu * 6, 0, 6.3);
      g.stroke();
      g.globalAlpha = 1;
      g.fillStyle = i ? "#fff" : "#ffd166";
      g.beginPath();
      g.arc(p[0], p[1], i ? 3.5 : 5, 0, 6.3);
      g.fill();
    });
    g.globalAlpha = 1;
    rot += 0.004;
    requestAnimationFrame(gd);
  }

  if (!K.reduce) gd();
  else {
    rot = 0.3;
    gd = null;
  }
})();
