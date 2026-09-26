// Σενάριο για τις σελίδες υπηρεσιών: μενού κινητού και χρονιά στο footer.
(function () {
  var btn = document.getElementById('mobile-btn');
  var list = document.getElementById('nav-list');
  btn.addEventListener('click', function () {
    var open = list.classList.toggle('active');
    btn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { list.classList.remove('active'); btn.setAttribute('aria-expanded', 'false'); }
  });
  document.getElementById('year').textContent = new Date().getFullYear();
})();
