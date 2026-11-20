/* "kodio" në fund të faqes, prej kubesh të vegjël 3D (canvas brenda .fmark).
   Kur zbret drejt fundit, kubet vijnë nga lart e anash dhe bashkohen (nga e majta në të djathtë);
   në fund të faqes shkrimi është i plotë. Kthehet drejt shigjetës së maus-it (në telefon: sipas scroll-it).
   Ngjyrat: css/footer.css (--f3-face-a/b = balli, --f3-near/far = anët e kuqe). */
(function () {
  var K = window.Kodio,
    m = document.querySelector(".fmark");
  if (!m) return;
  var cv = document.createElement("canvas"),
    c = cv.getContext && cv.getContext("2d");
  if (!c) return;

  var word = m.textContent.trim(),
    D = 1100, // distanca e kamerës (perspektiva)
    VOX = [], // kubet
    W = 0, // gjerësia e canvas-it (px CSS)
    H = 0,
    OX = 0, // qendra e fjalës brenda canvas-it
    OY = 0,
    TW = 0, // gjerësia/lartësia e fjalës
    TH = 0,
    half = 4, // gjysma e brinjës së kubit
    p = K.reduce ? 1 : 0, // sa e bashkuar (0..1), sipas scroll-it
    pp = p, // vlera e zbutur
    rx = 8,
    ry = -14,
    tx = 8,
    ty = -14,
    mx = null,
    my = 0,
    vis = false,
    raf = 0,
    COL = null;

  m.classList.add("vox");
  // mbrojtje: nëse CSS-i i ri nuk është ngarkuar ende (cache), lëre tekstin siç është
  if (getComputedStyle(m).getPropertyValue("--f3-near").trim() === "") {
    m.classList.remove("vox");
    return;
  }
  m.appendChild(cv);

  // ---- ngjyrat (nga CSS) ----
  var probe = document.createElement("canvas").getContext("2d");
  function rgb(s) {
    probe.fillStyle = "#000";
    probe.fillStyle = s;
    var h = probe.fillStyle;
    if (h[0] === "#")
      return [
        parseInt(h.slice(1, 3), 16),
        parseInt(h.slice(3, 5), 16),
        parseInt(h.slice(5, 7), 16),
      ];
    var n = h.match(/[\d.]+/g) || [0, 0, 0];
    return [+n[0], +n[1], +n[2]];
  }
  function ramp(a, b) {
    // 16 nivele drite: nga a (në hije) te b (në dritë)
    var out = [];
    for (var i = 0; i < 16; i++) {
      var k = i / 15;
      out.push(
        "rgb(" +
          Math.round(a[0] + (b[0] - a[0]) * k) +
          "," +
          Math.round(a[1] + (b[1] - a[1]) * k) +
          "," +
          Math.round(a[2] + (b[2] - a[2]) * k) +
          ")",
      );
    }
    return out;
  }
  function colors() {
    var s = getComputedStyle(m);
    var fa = rgb(s.getPropertyValue("--f3-face-a").trim() || "#2a2a2a"),
      fb = rgb(s.getPropertyValue("--f3-face-b").trim() || "#000"),
      rn = rgb(s.getPropertyValue("--f3-near").trim() || "#d7202b"),
      rf = rgb(s.getPropertyValue("--f3-far").trim() || "#5c0a10");
    COL = { face: ramp(fb, fa), side: ramp(rf, rn) };
  }

  // ---- ndërtimi i kubeve nga forma e fjalës ----
  function build() {
    var cs = getComputedStyle(m),
      fs = parseFloat(cs.fontSize) || 200,
      font = "800 " + fs + "px " + (cs.fontFamily || "Inter, sans-serif"),
      cell = Math.max(4, fs / 22),
      dpr = Math.min(devicePixelRatio || 1, 2);

    // vizato fjalën jashtë ekranit (me hapësirë -0.05em mes shkronjave, si në CSS)
    var oc = document.createElement("canvas"),
      o = oc.getContext("2d");
    o.font = font;
    var adv = [],
      tw = 0;
    for (var i = 0; i < word.length; i++) {
      adv.push(o.measureText(word[i]).width);
      tw += adv[i] - (i < word.length - 1 ? 0.05 * fs : 0);
    }
    var mt = o.measureText(word),
      asc = mt.actualBoundingBoxAscent || fs * 0.75,
      des = mt.actualBoundingBoxDescent || 0;
    oc.width = Math.ceil(tw) + 4;
    oc.height = Math.ceil(asc + des) + 4;
    o.font = font;
    o.fillStyle = "#000";
    o.textBaseline = "alphabetic";
    var x = 2;
    for (i = 0; i < word.length; i++) {
      o.fillText(word[i], x, 2 + asc);
      x += adv[i] - 0.05 * fs;
    }
    var data = o.getImageData(0, 0, oc.width, oc.height).data,
      cols = Math.floor(oc.width / cell),
      rows = Math.floor(oc.height / cell);
    TW = cols * cell;
    TH = rows * cell;
    half = cell * 0.42;

    VOX = [];
    var seed = 7;
    function rnd() {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    }
    for (var gy = 0; gy < rows; gy++) {
      for (var gx = 0; gx < cols; gx++) {
        var px = Math.floor((gx + 0.5) * cell),
          py = Math.floor((gy + 0.5) * cell);
        if (data[(py * oc.width + px) * 4 + 3] < 128) continue;
        var hx = (gx + 0.5) * cell - TW / 2,
          hy = (gy + 0.5) * cell - TH / 2,
          ax = rnd() - 0.5,
          ay = rnd() - 0.5,
          az = rnd() - 0.5,
          al = Math.hypot(ax, ay, az) || 1;
        VOX.push({
          hx: hx,
          hy: hy,
          sx: hx + (rnd() - 0.5) * TW * 0.7,
          sy: hy - TH * (0.1 + rnd() * 0.7),
          sz: -520 + rnd() * 820,
          ax: ax / al,
          ay: ay / al,
          az: az / al,
          ang: (rnd() * 2 - 1) * Math.PI * 2.2,
          d: 0.45 * (gx / cols) + 0.1 * rnd(), // vonesa: nga e majta në të djathtë
        });
      }
    }

    // canvas: sa .fmark, plus hapësirë sipër për kubet që fluturojnë
    var mw = m.clientWidth,
      mh = m.clientHeight,
      top = Math.round(mh * 0.9);
    W = mw;
    H = top + mh + Math.round(mh * 0.2);
    OX = W / 2;
    OY = top + mh / 2;
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    cv.style.width = W + "px";
    cv.style.height = H + "px";
    cv.style.top = -top + "px";
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    colors();
    draw();
  }

  // ---- vizatimi ----
  var V8 = [],
    P8 = [],
    FACES = [
      [1, 3, 7, 5, 0, 0, 1], // ballë (+z)
      [0, 4, 6, 2, 0, 0, -1],
      [4, 5, 7, 6, 1, 0, 0],
      [0, 2, 3, 1, -1, 0, 0],
      [2, 6, 7, 3, 0, 1, 0],
      [0, 1, 5, 4, 0, -1, 0],
    ],
    LX = -0.35,
    LY = -0.55,
    LZ = 0.76;
  for (var q = 0; q < 8; q++) {
    V8.push([q & 4 ? 1 : -1, q & 2 ? 1 : -1, q & 1 ? 1 : -1]);
    P8.push([0, 0, 0]);
  }
  var ease = function (t) {
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    return 1 - Math.pow(1 - t, 3);
  };

  function draw() {
    c.clearRect(0, 0, W, H);
    if (!VOX.length || !COL) return;
    var cy = Math.cos((ry * Math.PI) / 180),
      sy = Math.sin((ry * Math.PI) / 180),
      cx = Math.cos((rx * Math.PI) / 180),
      sx = Math.sin((rx * Math.PI) / 180);
    // G = Rx · Ry
    var g00 = cy,
      g01 = 0,
      g02 = sy,
      g10 = sx * sy,
      g11 = cx,
      g12 = -sx * cy,
      g20 = -cx * sy,
      g21 = sx,
      g22 = cx * cy;
    var list = [],
      i,
      v;
    for (i = 0; i < VOX.length; i++) {
      v = VOX[i];
      var t = ease((pp - v.d) / 0.45);
      var x = v.sx + (v.hx - v.sx) * t,
        y = v.sy + (v.hy - v.sy) * t,
        z = v.sz * (1 - t);
      v.t = t;
      v.gx = g00 * x + g01 * y + g02 * z;
      v.gy = g10 * x + g11 * y + g12 * z;
      v.gz = g20 * x + g21 * y + g22 * z;
      list.push(v);
    }
    list.sort(function (a, b) {
      return a.gz - b.gz;
    });

    for (i = 0; i < list.length; i++) {
      v = list[i];
      // rrotullimi i kubit (zero kur është në vend)
      var a = v.ang * (1 - v.t),
        ca = Math.cos(a),
        sa = Math.sin(a),
        ka = 1 - ca,
        X = v.ax,
        Y = v.ay,
        Z = v.az;
      var r00 = ca + X * X * ka,
        r01 = X * Y * ka - Z * sa,
        r02 = X * Z * ka + Y * sa,
        r10 = Y * X * ka + Z * sa,
        r11 = ca + Y * Y * ka,
        r12 = Y * Z * ka - X * sa,
        r20 = Z * X * ka - Y * sa,
        r21 = Z * Y * ka + X * sa,
        r22 = ca + Z * Z * ka;
      // M = G · R
      var m00 = g00 * r00 + g01 * r10 + g02 * r20,
        m01 = g00 * r01 + g01 * r11 + g02 * r21,
        m02 = g00 * r02 + g01 * r12 + g02 * r22,
        m10 = g10 * r00 + g11 * r10 + g12 * r20,
        m11 = g10 * r01 + g11 * r11 + g12 * r21,
        m12 = g10 * r02 + g11 * r12 + g12 * r22,
        m20 = g20 * r00 + g21 * r10 + g22 * r20,
        m21 = g20 * r01 + g21 * r11 + g22 * r21,
        m22 = g20 * r02 + g21 * r12 + g22 * r22;
      var hs = half * (0.55 + 0.45 * v.t); // copat janë më të vogla kur janë larg vendit të tyre
      for (var k = 0; k < 8; k++) {
        var lx = V8[k][0] * hs,
          ly = V8[k][1] * hs,
          lz = V8[k][2] * hs,
          wx = v.gx + m00 * lx + m01 * ly + m02 * lz,
          wy = v.gy + m10 * lx + m11 * ly + m12 * lz,
          wz = v.gz + m20 * lx + m21 * ly + m22 * lz,
          s = D / (D - wz);
        P8[k][0] = OX + wx * s;
        P8[k][1] = OY + wy * s;
        P8[k][2] = wz;
      }
      c.globalAlpha = 0.3 + 0.7 * v.t;
      for (var f = 0; f < 6; f++) {
        var F = FACES[f],
          nx = m00 * F[4] + m01 * F[5] + m02 * F[6],
          ny = m10 * F[4] + m11 * F[5] + m12 * F[6],
          nz = m20 * F[4] + m21 * F[5] + m22 * F[6],
          fx = v.gx + nx * hs,
          fy = v.gy + ny * hs,
          fz = v.gz + nz * hs;
        if (nx * -fx + ny * -fy + nz * (D - fz) <= 0) continue; // nuk shihet
        var b = 0.35 + 0.65 * Math.max(0, nx * LX + ny * LY + nz * LZ);
        c.fillStyle = (f === 0 ? COL.face : COL.side)[Math.min(15, Math.round(b * 15))];
        c.beginPath();
        c.moveTo(P8[F[0]][0], P8[F[0]][1]);
        c.lineTo(P8[F[1]][0], P8[F[1]][1]);
        c.lineTo(P8[F[2]][0], P8[F[2]][1]);
        c.lineTo(P8[F[3]][0], P8[F[3]][1]);
        c.closePath();
        c.fill();
      }
    }
    c.globalAlpha = 1;
  }

  // ---- scroll, maus, animimi ----
  function progress() {
    if (K.reduce) return 1;
    var r = m.getBoundingClientRect(),
      start = r.top + scrollY - innerHeight, // fjala sapo hyn në ekran
      end = document.documentElement.scrollHeight - innerHeight; // fundi i faqes
    if (end - start < 60) start = end - 60;
    return K.clamp((scrollY - start) / (end - start), 0, 1);
  }

  function targets() {
    p = progress();
    if (mx !== null && !K.touch) {
      var r = m.getBoundingClientRect();
      tx = K.clamp((r.top + r.height / 2 - my) / (innerHeight * 0.6), -1, 1) * 16;
      ty = K.clamp((mx - (r.left + r.width / 2)) / (r.width * 0.6), -1, 1) * 26;
    } else {
      tx = 8;
      ty = -14 + 8 * p;
    }
  }

  function tick() {
    raf = 0;
    targets();
    var k = K.reduce ? 1 : 0.14;
    pp += (p - pp) * k;
    rx += (tx - rx) * k;
    ry += (ty - ry) * k;
    if (Math.abs(p - pp) < 0.001) pp = p;
    draw();
    if (vis && (pp !== p || Math.abs(tx - rx) + Math.abs(ty - ry) > 0.05))
      raf = requestAnimationFrame(tick);
  }
  function kick() {
    if (vis && !raf) raf = requestAnimationFrame(tick);
  }

  new IntersectionObserver(
    function (e) {
      vis = e[e.length - 1].isIntersecting;
      kick();
    },
    { rootMargin: "300px 0px" },
  ).observe(m);
  K.onScroll(kick);
  addEventListener(
    "pointermove",
    function (e) {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX;
      my = e.clientY;
      kick();
    },
    { passive: true },
  );
  addEventListener("kodio:theme", function () {
    colors();
    draw();
  });
  var rt;
  addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(build, 150);
  });

  // prit fontin (Inter) që forma e kubeve të jetë e saktë
  var cs = getComputedStyle(m);
  (document.fonts && document.fonts.load
    ? document.fonts.load("800 " + cs.fontSize + " " + cs.fontFamily).catch(function () {})
    : Promise.resolve()
  ).then(function () {
    build();
    targets();
    pp = p;
    rx = tx;
    ry = ty;
    draw();
  });
})();
