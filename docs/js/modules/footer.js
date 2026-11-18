/* Footer: butoni ↑ që të çon lart dhe linket e rrjeteve sociale (nga js/config.js). */
(function () {
  var K = window.Kodio,
    $ = K.$;

  $("up").onclick = function () {
    scrollTo({ top: 0, behavior: "smooth" });
  };

  // Linket e rrjeteve sociale vijnë nga js/config.js (KODIO_CONFIG.social)
  var SOC = (window.KODIO_CONFIG && window.KODIO_CONFIG.social) || {};
  document.querySelectorAll("[data-social]").forEach(function (a) {
    var url = SOC[a.dataset.social];
    if (!url) return; // pa profil ende: mbetet lidhja te #kontakt
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
  });
})();
