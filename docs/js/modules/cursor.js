/* Pika e kuqe që ndjek shigjetën e maus-it (vetëm në kompjuter; shigjeta e zakonshme mbetet).
   Mbi linke dhe butona pika bëhet unazë. Stili: css/cursor.css */
(function () {
  var K = window.Kodio;
  if (K.touch || !matchMedia("(hover: hover)").matches) return;

  var d = document.createElement("div"),
    x = 0,
    y = 0,
    tx = 0,
    ty = 0,
    raf = 0,
    ease = K.reduce ? 1 : 0.4,
    HOT = "a, button, summary, label, select, [role=button], .lg";
  d.className = "cdot";
  d.setAttribute("aria-hidden", "true");
  document.body.appendChild(d);

  function step() {
    x += (tx - x) * ease;
    y += (ty - y) * ease;
    if (Math.abs(tx - x) < 0.1 && Math.abs(ty - y) < 0.1) {
      x = tx;
      y = ty;
      raf = 0;
    } else raf = requestAnimationFrame(step);
    d.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0)";
  }

  addEventListener(
    "pointermove",
    function (e) {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      if (!d.classList.contains("on")) {
        x = tx;
        y = ty;
        d.classList.add("on");
      }
      d.classList.toggle("big", !!(e.target.closest && e.target.closest(HOT)));
      if (!raf) raf = requestAnimationFrame(step);
    },
    { passive: true },
  );
  // maus-i del nga dritarja: fshihe pikën
  document.addEventListener("mouseout", function (e) {
    if (!e.relatedTarget) d.classList.remove("on");
  });
  addEventListener("pointerdown", function () {
    d.classList.add("down");
  });
  addEventListener("pointerup", function () {
    d.classList.remove("down");
  });
})();
