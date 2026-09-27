// Κινητό: τα στρογγυλά κουμπιά (♿ και ☎️) κρύβονται όσο ο επισκέπτης κάνει scroll προς τα κάτω
// για να διαβάσει, και ξαναεμφανίζονται όταν σταματήσει ή γυρίσει προς τα πάνω.
(function () {
  var mq = window.matchMedia('(max-width: 1080px)');
  var panel = document.getElementById('a11y-panel');
  var lastY = window.scrollY, timer = null, body = document.body;
  function show() { body.classList.remove('fab-hidden'); }
  window.addEventListener('scroll', function () {
    var y = window.scrollY, dy = y - lastY;
    lastY = y;
    if (!mq.matches || (panel && !panel.hidden)) { show(); return; }
    if (dy > 6 && y > 200) body.classList.add('fab-hidden');
    else if (dy < -6) show();
    clearTimeout(timer);
    timer = setTimeout(show, 900);
  }, { passive: true });
})();
