/* Butonat "magnetikë": butoni ndjek pak maus-in kur kalon sipër tij dhe kthehet butë kur largohesh. */
(function () {
  var K = window.Kodio;
  if (K.touch || K.reduce) return;

  document.querySelectorAll("main .btn").forEach(function (b) {
    b.classList.add("mag");
    b.addEventListener("mousemove", function (e) {
      var r = b.getBoundingClientRect(),
        x = e.clientX - r.left - r.width / 2,
        y = e.clientY - r.top - r.height / 2;
      b.style.transform = "translate(" + x * 0.22 + "px," + y * 0.32 + "px)";
    });
    b.addEventListener("mouseleave", function () {
      b.style.transform = "";
    });
  });
})();
