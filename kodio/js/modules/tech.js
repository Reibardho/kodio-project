/* Teknologjitë: rrjeti anohet lehtë drejt maus-it. */
(function () {
  var box = document.getElementById("tkx"),
    g = document.getElementById("tkg");
  if (!box || !g || window.Kodio.touch) return;

  box.addEventListener("mousemove", function (e) {
    var r = box.getBoundingClientRect(),
      x = (e.clientX - r.left) / r.width - 0.5,
      y = (e.clientY - r.top) / r.height - 0.5;
    g.style.transform = "rotateY(" + x * 10 + "deg) rotateX(" + -y * 8 + "deg)";
  });
  box.addEventListener("mouseleave", function () {
    g.style.transform = "";
  });
})();
