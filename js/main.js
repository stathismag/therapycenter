(function () {
  // Mobile menu
  var btn = document.getElementById('mobile-btn');
  var list = document.getElementById('nav-list');
  function closeMenu() { list.classList.remove('active'); btn.setAttribute('aria-expanded', 'false'); }
  btn.addEventListener('click', function () {
    var open = list.classList.toggle('active');
    btn.setAttribute('aria-expanded', String(open));
  });
  list.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  // Header shadow + active nav link
  var header = document.getElementById('header');
  var links = Array.prototype.slice.call(list.querySelectorAll('a[href^="#"]'));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 10);
    var y = window.scrollY + window.innerHeight / 3, current = 0;
    sections.forEach(function (s, i) { if (s && s.offsetTop <= y) current = i; });
    links.forEach(function (a, i) { a.classList.toggle('active', i === current); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Google review button (link set in js/config.js)
  var reviewUrl = (window.SITE_CONFIG || {}).googleReviewUrl;
  var reviewBtn = document.getElementById('review-write');
  if (reviewUrl && reviewBtn) { reviewBtn.href = reviewUrl; reviewBtn.hidden = false; }

  // Motto speech bubble: redraw the outline in pixel units for the current size,
  // so the stroke keeps an even width and the draw-on animation covers the whole outline.
  var bubble = document.querySelector('.motto-bubble');
  function drawBubble() {
    if (!bubble) return;
    var w = bubble.clientWidth, h = bubble.clientHeight;
    if (!w || !h) return;
    var r = Math.min(26, h * 0.28), tail = 16, b = h - tail, tx = Math.max(40, w * 0.14), m = 2;
    bubble.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    bubble.removeAttribute('preserveAspectRatio');
    bubble.querySelector('path').setAttribute('d',
      'M' + (m + r) + ' ' + m + ' H' + (w - m - r) + ' Q' + (w - m) + ' ' + m + ' ' + (w - m) + ' ' + (m + r) +
      ' V' + (b - r) + ' Q' + (w - m) + ' ' + b + ' ' + (w - m - r) + ' ' + b +
      ' H' + (tx + 26) + ' L' + (tx - 8) + ' ' + (h - m) + ' L' + tx + ' ' + b +
      ' H' + (m + r) + ' Q' + m + ' ' + b + ' ' + m + ' ' + (b - r) +
      ' V' + (m + r) + ' Q' + m + ' ' + m + ' ' + (m + r) + ' ' + m + ' Z');
  }
  drawBubble();
  window.addEventListener('resize', drawBubble);

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Gallery lightbox
  var dialog = document.getElementById('lightbox');
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  var img = dialog.querySelector('img'), index = 0;
  function show(i) {
    index = (i + items.length) % items.length;
    img.src = items[index].getAttribute('href');
    img.alt = items[index].querySelector('img').alt;
  }
  if (typeof dialog.showModal === 'function') {
    items.forEach(function (a, i) {
      a.addEventListener('click', function (e) { e.preventDefault(); show(i); dialog.showModal(); });
    });
    dialog.querySelector('.lightbox-close').addEventListener('click', function () { dialog.close(); });
    dialog.querySelector('.lightbox-prev').addEventListener('click', function () { show(index - 1); });
    dialog.querySelector('.lightbox-next').addEventListener('click', function () { show(index + 1); });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
  }

  // Contact form: validate, then submit to Netlify Forms without leaving the page.
  // Without JavaScript the form still posts normally and Netlify shows thank-you.html.
  var form = document.getElementById('contact-form');
  var note = document.getElementById('form-note');
  var submitBtn = form.querySelector('.submit-btn');
  var fields = ['name', 'phone', 'email', 'message'].map(function (n) { return form.elements[n]; });

  function setNote(html, cls) {
    note.className = 'form-note' + (cls ? ' ' + cls : '');
    note.innerHTML = html;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstInvalid = null;
    fields.forEach(function (el) {
      var ok = el.checkValidity() && (!el.required || el.value.trim() !== '');
      el.setAttribute('aria-invalid', String(!ok));
      if (!ok && !firstInvalid) firstInvalid = el;
    });
    if (firstInvalid) {
      setNote('Παρακαλούμε συμπληρώστε σωστά τα πεδία με αστερίσκο (*).', 'error');
      firstInvalid.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Αποστολή…';
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    }).then(function (res) {
      if (!res.ok) throw new Error(res.status);
      form.reset();
      fields.forEach(function (el) { el.removeAttribute('aria-invalid'); });
      setNote('✅ Ευχαριστούμε! Λάβαμε το μήνυμά σας και θα επικοινωνήσουμε μαζί σας σύντομα.', 'success');
    }).catch(function () {
      setNote('Δυστυχώς το μήνυμα δεν στάλθηκε. Καλέστε μας στο <a href="tel:+302621029798">26210 29798</a> ' +
        'ή στείλτε email στο <a href="mailto:konnakandri@gmail.com">konnakandri@gmail.com</a>.', 'error');
    }).then(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Αποστολή Μηνύματος';
    });
  });
})();
