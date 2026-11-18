/* WhatsApp: K.waUrl(mesazh) ndërton lidhjen wa.me, K.openWA(mesazh) e hap. Numri vjen nga js/config.js. */
(function () {
  var K = window.Kodio,
    WA = window.KODIO_CONFIG.whatsapp;

  K.waUrl = function (t) {
    return "https://wa.me/" + WA + "?text=" + encodeURIComponent(t);
  };

  K.openWA = function (t) {
    var a = document.createElement("a");
    a.href = K.waUrl(t);
    a.target = "_blank";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // Mesazhi përshëndetës (përkthehet sipas gjuhës). Përdoret nga [data-wa] dhe nga roboti.
  K.waHello = function () {
    return K.waUrl(K.L("Përshëndetje! Dua të bëj një website."));
  };

  // Çdo element me atributin data-wa hap WhatsApp me mesazhin përshëndetës
  function links() {
    document.querySelectorAll("[data-wa]").forEach(function (a) {
      a.href = K.waHello();
    });
  }
  links();
  K.onLang(links);
})();
