// «Νέα από το Κέντρο»: οι αναρτήσεις Facebook φορτώνονται μόνο αφού ο επισκέπτης πατήσει
// «Εμφάνιση αναρτήσεων». Η επιλογή αποθηκεύεται στον browser και ανακαλείται με «Απόκρυψη».
(function () {
  var box = document.querySelector('[data-fb-page]');
  if (!box) return;
  var KEY = 'fb-embed';
  var placeholder = box.innerHTML;

  function remember(v) { try { v ? localStorage.setItem(KEY, '1') : localStorage.removeItem(KEY); } catch (e) {} }
  function remembered() { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } }

  function load() {
    var width = Math.max(280, Math.min(500, Math.floor(box.clientWidth)));
    var height = 640;
    var src = 'https://www.facebook.com/plugins/page.php?' + [
      'href=' + encodeURIComponent(box.getAttribute('data-fb-page')),
      'tabs=timeline', 'width=' + width, 'height=' + height,
      'small_header=false', 'adapt_container_width=true', 'hide_cover=false',
      'show_facepile=false', 'locale=el_GR'
    ].join('&');
    box.innerHTML = '';
    var frame = document.createElement('iframe');
    frame.src = src;
    frame.width = width;
    frame.height = height;
    frame.title = 'Αναρτήσεις του Κέντρου στο Facebook';
    frame.loading = 'lazy';
    frame.setAttribute('scrolling', 'no');
    frame.setAttribute('frameborder', '0');
    frame.setAttribute('allow', 'encrypted-media');
    frame.className = 'fb-frame';
    box.appendChild(frame);
    var hide = document.createElement('button');
    hide.type = 'button';
    hide.className = 'link-btn fb-hide';
    hide.textContent = 'Απόκρυψη αναρτήσεων Facebook';
    hide.addEventListener('click', function () {
      remember(false);
      box.innerHTML = placeholder;
      bind();
      box.querySelector('.fb-load').focus();
    });
    box.appendChild(hide);
    box.classList.add('is-loaded');
  }

  function bind() {
    box.classList.remove('is-loaded');
    var btn = box.querySelector('.fb-load');
    if (btn) btn.addEventListener('click', function () { remember(true); load(); });
  }

  bind();
  if (remembered()) load();
})();
