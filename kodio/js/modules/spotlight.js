/* Drita e butë e kuqe që ndjek maus-in mbi kartat (klasa .spot te css/buttons.css). */
(function () {
  if (window.Kodio.touch) return;
  var sel = ".card, .bc:not(.bc-wa), .fs, .prow, .pk:not(.hot), .tkx, .faq-l .qa";
  document.addEventListener(
    "pointermove",
    function (e) {
      var el = e.target.closest && e.target.closest(sel);
      if (!el) return;
      if (!el.classList.contains("spot")) el.classList.add("spot");
      var r = el.getBoundingClientRect();
      el.style.setProperty("--mx", e.clientX - r.left + "px");
      el.style.setProperty("--my", e.clientY - r.top + "px");
    },
    { passive: true },
  );
  document.addEventListener(
    "pointerout",
    function (e) {
      var el = e.target.closest && e.target.closest(".spot");
      if (el && !el.contains(e.relatedTarget)) {
        el.style.setProperty("--mx", "-999px");
        el.style.setProperty("--my", "-999px");
      }
    },
    { passive: true },
  );
})();
