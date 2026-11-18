/* Formulari i kontaktit: mbledh të dhënat dhe i dërgon në WhatsApp (K.openWA)
   ose me email (butoni "Dërgo me email" hap programin e email-it me mesazhin gati). */
(function () {
  var K = window.Kodio,
    $ = K.$,
    L = K.L;
  var openWA = K.openWA;

  var f = $("f");

  function msg() {
    return (
      L("Përshëndetje! Jam") +
      " " +
      $("n").value +
      ".\n" +
      ($("k").value ? L("Kompania") + ": " + $("k").value + "\n" : "") +
      "Email: " +
      $("e").value +
      "\n" +
      L("Telefoni") +
      ": " +
      $("tel").value +
      "\n\n" +
      $("m").value
    );
  }

  f.addEventListener("submit", function (ev) {
    ev.preventDefault();
    openWA(msg());
  });

  $("fmail").addEventListener("click", function () {
    if (!f.reportValidity()) return;
    location.href =
      "mailto:" +
      window.KODIO_CONFIG.email +
      "?subject=" +
      encodeURIComponent(L("Kërkesë për website") + " – " + $("n").value) +
      "&body=" +
      encodeURIComponent(msg());
  });
})();
