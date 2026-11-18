/* Shfaqja e seksioneve gjatë scroll-it (.rv). */
(function () {
  var io = new IntersectionObserver(
    function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  document.querySelectorAll(".rv").forEach(function (el) {
    io.observe(el);
  });
})();
