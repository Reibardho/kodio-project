/* Ekrani i hapjes me logon: shfaqet vetëm herën e parë në një vizitë (sessionStorage),
   zgjat rreth 1.5 sekonda dhe hiqet edhe me klikim. */
(function () {
  var K = window.Kodio,
    $ = K.$;

  var ito = $("intro");
  try {
    if (sessionStorage.getItem("kodio_intro")) ito = (ito.remove(), null);
    sessionStorage.setItem("kodio_intro", "1");
  } catch {
    /* pa sessionStorage: intro shfaqet si zakonisht */
  }
  if (!ito) return;

  function idone() {
    if (ito) {
      ito.remove();
      ito = null;
    }
  }

  ito.onclick = idone;

  setTimeout(idone, 1600);
})();
