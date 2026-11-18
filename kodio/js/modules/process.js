/* "Si punojmë": hapat lëvizin sipas drejtimit të scroll-it; vija mbushet dhe pika ndjek pozicionin.
   Kartat anohen sipas shpejtësisë së scroll-it dhe kthehen në vend kur ndalon. */
(function () {
  var K = window.Kodio;
  var flow = document.getElementById("flow"),
    prog = document.getElementById("fprog"),
    orb = document.getElementById("forb");
  if (!flow) return;
  var steps = [].slice.call(flow.querySelectorAll(".fs")),
    clamp = K.clamp,
    narrow = function () {
      return innerWidth <= 760;
    },
    vel = 0,
    raf = 0,
    mx = 0,
    my = 0;

  function frame() {
    raf = 0;
    var vh = innerHeight,
      fr = flow.getBoundingClientRect(),
      mid = vh * 0.55;
    // vija + pika
    var p = clamp(mid - fr.top, 0, fr.height);
    prog.style.height = p + "px";
    orb.style.setProperty("--oy", p + "px");
    orb.style.setProperty("--os", 1 + clamp(Math.abs(vel) / 60, 0, 0.6));

    steps.forEach(function (el, i) {
      var r = el.getBoundingClientRect(),
        c = r.top + r.height / 2,
        t = clamp((vh - c) / (vh * 0.55), 0, 1), // 0 = poshtë ekranit, 1 = arritur
        side = i % 2 ? 1 : -1;
      if (narrow()) side = 1;
      var e = 1 - Math.pow(1 - t, 3);
      el.style.setProperty("--o", e.toFixed(3));
      el.style.setProperty("--x", (1 - e) * 90 * side + "px");
      el.style.setProperty("--y", (1 - e) * 50 + "px");
      el.style.setProperty("--sk", clamp(vel * 0.06, -5, 5) * e + "deg");
      el.classList.toggle("on", c < mid + 20);
      el.style.setProperty("--ry", el.__ry || "0deg");
      el.style.setProperty("--rx", el.__rx || "0deg");
      // pika në vijën qendrore
      el.style.setProperty("--dx", side);
    });
    vel *= 0.86;
    if (Math.abs(vel) > 0.05) raf = requestAnimationFrame(frame);
  }
  function kick() {
    if (!raf) raf = requestAnimationFrame(frame);
  }

  K.onScroll(function (y, dy) {
    vel = K.reduce ? 0 : clamp(dy, -80, 80);
    kick();
  });
  addEventListener("resize", kick);

  // tilt drejt maus-it mbi kartë
  steps.forEach(function (el) {
    if (K.touch) return;
    el.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
      el.__ry = mx * 8 + "deg";
      el.__rx = -my * 8 + "deg";
      kick();
    });
    el.addEventListener("mouseleave", function () {
      el.__ry = el.__rx = "0deg";
      kick();
    });
  });
  kick();
})();
