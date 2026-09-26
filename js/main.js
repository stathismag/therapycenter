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

  // Contact form: validate, then open the visitor's email app with the message filled in.
  // (The site is static and has no server to send email; replace with a form service if one is set up.)
  var form = document.getElementById('contact-form');
  var note = document.getElementById('form-note');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstInvalid = null;
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name) return;
      var ok = el.checkValidity() && (!el.required || el.value.trim() !== '');
      el.setAttribute('aria-invalid', String(!ok));
      if (!ok && !firstInvalid) firstInvalid = el;
    });
    if (firstInvalid) {
      note.classList.add('error');
      note.textContent = 'Παρακαλούμε συμπληρώστε σωστά τα πεδία με αστερίσκο (*).';
      firstInvalid.focus();
      return;
    }
    var f = form.elements;
    var body = 'Ονοματεπώνυμο: ' + f.name.value.trim() +
      '\nΤηλέφωνο: ' + f.phone.value.trim() +
      (f.email.value.trim() ? '\nEmail: ' + f.email.value.trim() : '') +
      '\n\n' + f.message.value.trim();
    note.classList.remove('error');
    note.textContent = 'Ανοίγει η εφαρμογή email σας — πατήστε «Αποστολή» εκεί για να ολοκληρωθεί.';
    window.location.href = 'mailto:konnakandri@gmail.com?subject=' +
      encodeURIComponent('Αίτημα επικοινωνίας - ' + f.name.value.trim()) +
      '&body=' + encodeURIComponent(body);
  });
})();
