// Google Analytics μόνο με συγκατάθεση: τίποτα δεν φορτώνεται πριν ο επισκέπτης πατήσει «Αποδοχή».
(function () {
  var cfg = window.SITE_CONFIG || {};
  var KEY = 'cookie-consent';
  var banner = document.getElementById('cookie-banner');
  var settingsBtn = document.getElementById('cookie-settings');

  if (!cfg.gaId) {
    if (settingsBtn) settingsBtn.hidden = true;
    return;
  }

  function getChoice() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setChoice(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var loaded = false;
  function loadAnalytics() {
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', cfg.gaId, { anonymize_ip: true });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.gaId);
    document.head.appendChild(s);
  }

  function deleteGaCookies() {
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (/^_ga/.test(name)) {
        var host = location.hostname.replace(/^www\./, '');
        ['', '; domain=' + host, '; domain=.' + host].forEach(function (d) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
        });
      }
    });
  }

  function showBanner() { banner.hidden = false; }
  function hideBanner() { banner.hidden = true; }

  banner.querySelector('[data-consent="accept"]').addEventListener('click', function () {
    setChoice('accepted'); hideBanner(); loadAnalytics();
  });
  banner.querySelector('[data-consent="reject"]').addEventListener('click', function () {
    var wasLoaded = loaded;
    setChoice('rejected'); hideBanner(); deleteGaCookies();
    if (wasLoaded) location.reload(); // σταματά το Analytics που είχε ήδη φορτωθεί
  });
  if (settingsBtn) settingsBtn.addEventListener('click', showBanner);

  var choice = getChoice();
  if (choice === 'accepted') loadAnalytics();
  else if (choice !== 'rejected') showBanner();
})();
