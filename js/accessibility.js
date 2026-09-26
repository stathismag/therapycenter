(function () {
  var toggle = document.getElementById('a11y-toggle');
  var panel = document.getElementById('a11y-panel');
  var modes = ['gray-mode', 'high-contrast', 'invert-mode', 'underline-links', 'legible-mode'];
  var fontSize = 100;
  var state;
  try { state = JSON.parse(localStorage.getItem('a11y') || '{}'); } catch (e) { state = {}; }

  function save() {
    try { localStorage.setItem('a11y', JSON.stringify({ font: fontSize, modes: modes.filter(function (m) { return document.body.classList.contains(m); }) })); } catch (e) {}
  }
  function applyFont() { document.documentElement.style.fontSize = fontSize === 100 ? '' : fontSize + '%'; }

  if (state.font) { fontSize = state.font; applyFont(); }
  (state.modes || []).forEach(function (m) { if (modes.indexOf(m) > -1) document.body.classList.add(m); });

  toggle.addEventListener('click', function () {
    var open = panel.hidden;
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  });

  panel.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-a11y]');
    if (!b) return;
    var action = b.getAttribute('data-a11y');
    if (action === 'font-up') fontSize = Math.min(fontSize + 10, 160);
    else if (action === 'font-down') fontSize = Math.max(fontSize - 10, 80);
    else if (action === 'reset') { fontSize = 100; modes.forEach(function (m) { document.body.classList.remove(m); }); }
    else document.body.classList.toggle(action);
    applyFont();
    save();
  });
})();
