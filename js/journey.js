// «Πώς ξεκινάμε»: ζωγραφίζει τη διαδρομή όταν η ενότητα εμφανιστεί στην οθόνη.
// Χωρίς JavaScript ή με «μειωμένη κίνηση» όλα φαίνονται κανονικά, χωρίς κίνηση.
(function () {
  var lists = document.querySelectorAll('[data-journey]');
  if (!lists.length || !('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });
  Array.prototype.forEach.call(lists, function (el) {
    var r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return; // ήδη ορατό: χωρίς κίνηση
    el.classList.add('journey--animate');
    io.observe(el);
  });
})();
