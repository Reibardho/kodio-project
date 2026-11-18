/* Fillimi: ngarkohet i fundit. Pasi janë ngarkuar të gjitha modulet, hapet faqja në gjuhën e vizitorit
   (zgjedhja e ruajtur ose gjuha e shfletuesit) dhe ndërrimi i gjuhës rindërton edhe tekstet dinamike. */
window.Kodio.ready = true;
(function () {
  var l = window.Kodio.startLang();
  if (l !== "sq") window.Kodio.setLang(l, true);
})();
