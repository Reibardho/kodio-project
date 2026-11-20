/* "kodio" në fund të faqes, prej kubesh të vegjël 3D (canvas brenda .fmark).
   - Bashkimi ndjek scroll-in: sa më poshtë zbret, aq më shumë bashkohen yjet; në fund të faqes fjala
     është e plotë. Kur ngjitesh lart, shpërndahen sërish.
   - Maus-i sipër: kubet qëndrojnë në vend (vetëm fjala kthehet lehtë drejt shigjetës).
   - Klikim (ose prekje në telefon): një valë i shtyn kubet mbrapa e para (vetëm në thellësi), pastaj ndalen.
   Ngjyrat: css/footer.css (--f3-face-a/b = balli, --f3-near/far = anët e kuqe). */
(function () {
  var K = window.Kodio,
    m = document.querySelector(".fmark");
  if (!m) return;
  var cv = document.createElement("canvas"),
    c = cv.getContext && cv.getContext("2d");
  if (!c) return;
  cv.width = cv.height = 0; // pa madhësi derisa të ndërtohen kubet (që faqja të mos "kërcejë")

  // ---- rregullime ----
  var STAGGER = 0.4, // sa e ndarë është radha e copave gjatë scroll-it (0 = të gjitha njëherësh)
    FOLLOW = 0.1, // sa butë ndjek scroll-in (më pak = më avash)
    SPRING = 55, // sa fort kthehen kubet në vend pas klikimit
    DAMP = 4.2, // frenimi (më pak = më shumë lëvizje para-mbrapa)
    D = 1100; // distanca e kamerës (perspektiva)

  var word = m.textContent.trim(),
    VOX = [],
    W = 0,
    H = 0,
    OX = 0,
    OY = 0,
    half = 4,
    R_CLICK = 300, // rrezja e valës së klikimit (px)
    p = K.reduce ? 1 : 0, // sa e bashkuar duhet të jetë (sipas scroll-it), 0..1
    pp = p, // sa e bashkuar është tani (ndjek p butë)
    last = 0,
    rx = 6,
    ry = -8,
    tx = 6,
    ty = -8,
    mx = null,
    my = 0,
    vis = false,
    raf = 0,
    COL = null,
    rect = null;

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
    COL = {
      face: ramp(
        rgb(s.getPropertyValue("--f3-face-b").trim()),
        rgb(s.getPropertyValue("--f3-face-a").trim()),
      ),
      side: ramp(
        rgb(s.getPropertyValue("--f3-far").trim()),
        rgb(s.getPropertyValue("--f3-near").trim()),
      ),
    };
  }

  // ---- ndërtimi i kubeve nga forma e fjalës ----
  function build() {
    var cs = getComputedStyle(m),
      fs = parseFloat(cs.fontSize) || 200,
      font = "800 " + fs + "px " + (cs.fontFamily || "Inter, sans-serif"),
      cell = Math.max(4, fs / 22),
      dpr = Math.min(devicePixelRatio || 1, 2);

    var oc = document.createElement("canvas"),
      o = oc.getContext("2d");
    o.font = font;
    var adv = [],
      tw = 0,
      i;
    for (i = 0; i < word.length; i++) {
      adv.push(o.measureText(word[i]).width);
      tw += adv[i] - (i < word.length - 1 ? 0.05 * fs : 0);
    }
    var mt = o.measureText(word),
      asc = mt.actualBoundingBoxAscent || fs * 0.75,
      des = mt.actualBoundingBoxDescent || 0;
    oc.width = Math.ceil(tw) + 4;
    oc.height = Math.ceil(asc + des) + 4;
    o.font = font;
    o.textBaseline = "alphabetic";
    var x = 2;
    for (i = 0; i < word.length; i++) {
      o.fillText(word[i], x, 2 + asc);
      x += adv[i] - 0.05 * fs;
    }
    var data = o.getImageData(0, 0, oc.width, oc.height).data,
      cols = Math.floor(oc.width / cell),
      rows = Math.floor(oc.height / cell),
      TW = cols * cell,
      TH = rows * cell;
    half = cell * 0.42;
    R_CLICK = cell * 22;

    // canvas: sa .fmark, plus hapësirë sipër për yjet/copat
    var mw = m.clientWidth,
      mh = m.clientHeight,
      top = Math.round(mh * 1.1);
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

    VOX = [];
    var seed = 7;
    function rnd() {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    }
    for (var gy = 0; gy < rows; gy++) {
      for (var gx = 0; gx < cols; gx++) {
        if (
          data[(Math.floor((gy + 0.5) * cell) * oc.width + Math.floor((gx + 0.5) * cell)) * 4 + 3] <
          128
        )
          continue;
        var ax = rnd() - 0.5,
          ay = rnd() - 0.5,
          az = rnd() - 0.5,
          al = Math.hypot(ax, ay, az) || 1;
        VOX.push({
          hx: (gx + 0.5) * cell - TW / 2, // vendi në fjalë
          hy: (gy + 0.5) * cell - TH / 2,
          sx: (rnd() - 0.5) * W * 0.98, // vendi si "yll" i shpërndarë
          sy: rnd() * H - OY,
          sz: -650 + rnd() * 900,
          ax: ax / al,
          ay: ay / al,
          az: az / al,
          ang: (rnd() * 2 - 1) * Math.PI * 2.5,
          sw: (rnd() - 0.5) * 0.9, // sa kthehet në hark gjatë rrugës
          d: STAGGER * (0.65 * rnd() + 0.35 * (gx / cols)), // radha: disa vijnë më herët, disa më vonë
          e: 0,
          bx: 0,
          by: 0,
          bz: 0,
          oz: 0, // zhvendosja në thellësi nga klikimi
          vz: 0,
          pz: 0, // shtytja që po vjen me valën
          pt: 0, // kur arrin vala
        });
      }
    }
    colors();
    draw(performance.now());
  }

  // ---- rruga e çdo cope: nga ylli te vendi në fjalë ----
  function ease(t) {
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  function place(v) {
    var e = ease((pp - v.d) / (1 - STAGGER));
    var dx = v.hx - v.sx,
      dy = v.hy - v.sy,
      arc = Math.sin(Math.PI * e) * v.sw; // hark pingul me rrugën
    v.e = e;
    v.bx = v.sx + dx * e - dy * arc;
    v.by = v.sy + dy * e + dx * arc;
    v.bz = v.sz * (1 - e);
    return e;
  }

  // ---- fizika: kubet lëvizin vetëm para-mbrapa (thellësia), susta i kthen në vend ----
  function physics(dt, now) {
    var moving = false;
    for (var i = 0; i < VOX.length; i++) {
      var v = VOX[i];
      if (v.pt) {
        if (now >= v.pt) {
          v.vz += v.pz; // vala arriti te ky kub
          v.pt = 0;
        }
        moving = true;
      }
      v.vz += (-SPRING * v.oz - DAMP * v.vz) * dt;
      v.oz += v.vz * dt;
      if (Math.abs(v.vz) > 2 || Math.abs(v.oz) > 0.15) moving = true;
      else v.oz = v.vz = 0;
    }
    return moving;
  }

  // klikim: vala përhapet nga pika e klikimit dhe i shtyn kubet mbrapa; susta i nxjerr para e i kthen
  function shock(cx, cy) {
    if (!rect) return;
    var wx = cx - rect.left - OX,
      wy = cy - rect.top - OY,
      now = performance.now();
    for (var i = 0; i < VOX.length; i++) {
      var v = VOX[i],
        d = Math.hypot(v.bx - wx, v.by - wy);
      if (d > R_CLICK) continue;
      var s = 1 - d / R_CLICK;
      v.pz = -(240 + 950 * s * s); // sa fort (mbrapa, në thellësi)
      v.pt = now + d * 1.6; // vonesa: vala arrin më vonë te kubet më larg
    }
    kick();
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
    P8.push([0, 0]);
  }

  function draw(now) {
    c.clearRect(0, 0, W, H);
    if (!VOX.length || !COL) return 1;
    var cy = Math.cos((ry * Math.PI) / 180),
      sy = Math.sin((ry * Math.PI) / 180),
      cx = Math.cos((rx * Math.PI) / 180),
      sx = Math.sin((rx * Math.PI) / 180),
      g00 = cy,
      g02 = sy,
      g10 = sx * sy,
      g11 = cx,
      g12 = -sx * cy,
      g20 = -cx * sy,
      g21 = sx,
      g22 = cx * cy,
      minE = 1,
      i,
      v;
    for (i = 0; i < VOX.length; i++) {
      v = VOX[i];
      minE = Math.min(minE, place(v));
      var x = v.bx,
        y = v.by,
        z = v.bz + v.oz;
      v.gx = g00 * x + g02 * z;
      v.gy = g10 * x + g11 * y + g12 * z;
      v.gz = g20 * x + g21 * y + g22 * z;
    }
    var list = VOX.slice().sort(function (a, b) {
      return a.gz - b.gz;
    });

    for (i = 0; i < list.length; i++) {
      v = list[i];
      var e = v.e,
        a = v.ang * (1 - e),
        ca = Math.cos(a),
        sa = Math.sin(a),
        ka = 1 - ca,
        X = v.ax,
        Y = v.ay,
        Z = v.az,
        r00 = ca + X * X * ka,
        r01 = X * Y * ka - Z * sa,
        r02 = X * Z * ka + Y * sa,
        r10 = Y * X * ka + Z * sa,
        r11 = ca + Y * Y * ka,
        r12 = Y * Z * ka - X * sa,
        r20 = Z * X * ka - Y * sa,
        r21 = Z * Y * ka + X * sa,
        r22 = ca + Z * Z * ka,
        m00 = g00 * r00 + g02 * r20,
        m01 = g00 * r01 + g02 * r21,
        m02 = g00 * r02 + g02 * r22,
        m10 = g10 * r00 + g11 * r10 + g12 * r20,
        m11 = g10 * r01 + g11 * r11 + g12 * r21,
        m12 = g10 * r02 + g11 * r12 + g12 * r22,
        m20 = g20 * r00 + g21 * r10 + g22 * r20,
        m21 = g20 * r01 + g21 * r11 + g22 * r21,
        m22 = g20 * r02 + g21 * r12 + g22 * r22,
        hs = half * (0.3 + 0.7 * e); // si yje janë të vegjël, në fjalë marrin madhësinë e plotë
      for (var k = 0; k < 8; k++) {
        var lx = V8[k][0] * hs,
          ly = V8[k][1] * hs,
          lz = V8[k][2] * hs,
          wz = v.gz + m20 * lx + m21 * ly + m22 * lz,
          s = D / (D - wz);
        P8[k][0] = OX + (v.gx + m00 * lx + m01 * ly + m02 * lz) * s;
        P8[k][1] = OY + (v.gy + m10 * lx + m11 * ly + m12 * lz) * s;
      }
      c.globalAlpha = 0.5 + 0.5 * e;
      for (var f = 0; f < 6; f++) {
        var F = FACES[f],
          nx = m00 * F[4] + m01 * F[5] + m02 * F[6],
          ny = m10 * F[4] + m11 * F[5] + m12 * F[6],
          nz = m20 * F[4] + m21 * F[5] + m22 * F[6];
        if (-nx * (v.gx + nx * hs) - ny * (v.gy + ny * hs) + nz * (D - v.gz - nz * hs) <= 0)
          continue;
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
    return minE;
  }

  // ---- cikli i animimit (punon vetëm kur duhet) ----
  // sa e bashkuar: 0 kur zona e yjeve sapo del në ekran, 1 kur arrin në fund të faqes
  function progress() {
    if (K.reduce) return 1;
    var r = cv.getBoundingClientRect(),
      start = r.top + scrollY - innerHeight * 0.9,
      end = document.documentElement.scrollHeight - innerHeight;
    if (end - start < 80) start = end - 80;
    return K.clamp((scrollY - start) / (end - start), 0, 1);
  }

  function tick(now) {
    raf = 0;
    p = progress();
    pp += (p - pp) * FOLLOW;
    if (Math.abs(p - pp) < 0.002) pp = p;
    var dt = Math.min(0.033, (now - (last || now)) / 1000) || 0.016;
    last = now;
    rect = cv.getBoundingClientRect();
    if (mx !== null && !K.touch) {
      var r = m.getBoundingClientRect();
      tx = K.clamp((r.top + r.height / 2 - my) / (innerHeight * 0.6), -1, 1) * 7;
      ty = K.clamp((mx - (r.left + r.width / 2)) / (r.width * 0.6), -1, 1) * 12;
    }
    rx += (tx - rx) * 0.08;
    ry += (ty - ry) * 0.08;
    var busy = !K.reduce && pp > 0.98 && physics(dt, now);
    draw(now);
    if (vis && (pp !== p || busy || Math.abs(tx - rx) + Math.abs(ty - ry) > 0.05)) {
      raf = requestAnimationFrame(tick);
    } else last = 0;
  }
  function kick() {
    if (vis && !raf) raf = requestAnimationFrame(tick);
  }

  // del në ekran → bashkohen; largohesh krejt → shpërndahen sërish (për herën tjetër)
  new IntersectionObserver(
    function (en) {
      var e = en[en.length - 1];
      vis = e.isIntersecting;
      kick();
    },
    { rootMargin: "200px 0px" },
  ).observe(cv);

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
  // klikim / prekje mbi fjalë: vala
  addEventListener(
    "pointerdown",
    function (e) {
      if (!vis || K.reduce || pp < 0.98) return; // vala vetëm kur fjala është e plotë
      var r = cv.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
        return;
      rect = r;
      shock(e.clientX, e.clientY);
    },
    { passive: true },
  );
  K.onScroll(kick);
  addEventListener("kodio:theme", function () {
    colors();
    draw(performance.now());
  });
  // rindërto vetëm kur ndryshon gjerësia (në iPhone shiriti i Safari-t ndryshon vetëm lartësinë gjatë scroll-it)
  var rt,
    lastW = innerWidth;
  var built = false;
  addEventListener("resize", function () {
    if (innerWidth === lastW) return;
    lastW = innerWidth;
    clearTimeout(rt);
    if (built) rt = setTimeout(build, 150);
  });

  // Kubet ndërtohen vetëm kur footer-i afrohet (hapja e faqes mbetet e lehtë).
  // Prit fontin (Inter) që forma e kubeve të jetë e saktë.
  new IntersectionObserver(
    function (en, io) {
      if (built || !en[en.length - 1].isIntersecting) return;
      built = true;
      io.disconnect();
      var cs = getComputedStyle(m);
      (document.fonts && document.fonts.load
        ? document.fonts.load("800 " + cs.fontSize + " " + cs.fontFamily).catch(function () {})
        : Promise.resolve()
      ).then(function () {
        build();
        p = pp = progress(); // nëse faqja hapet direkt në fund, fjala del menjëherë e plotë
        draw(performance.now());
      });
    },
    { rootMargin: "1500px 0px" },
  ).observe(m);
})();
