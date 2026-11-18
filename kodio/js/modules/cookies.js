/* Cookies: banneri, cilësimet dhe ruajtja e zgjedhjes (localStorage + cookie `kodio_consent`).
   Zgjedhja lexohet kudo me Kodio.consent (p.sh. Kodio.consent.analytics) dhe njoftohet me eventin
   "kodio:consent" — këtu lidh më vonë Analytics/Pixel vetëm kur lejohen. */
(function () {
  var K = window.Kodio,
    $ = K.$,
    KEY = "kodio_consent";
  var bar = $("ck"),
    box = $("ckm"),
    cp = $("ckp"),
    ca = $("cka"),
    ck = $("ckk");

  function read() {
    try {
      return JSON.parse(localStorage.getItem(KEY));
    } catch {
      return null;
    }
  }
  function write(c) {
    try {
      localStorage.setItem(KEY, JSON.stringify(c));
    } catch {}
    try {
      document.cookie =
        KEY + "=" + encodeURIComponent(JSON.stringify(c)) + ";max-age=31536000;path=/;SameSite=Lax";
    } catch {}
  }
  function apply(c) {
    K.consent = c;
    window.dispatchEvent(new CustomEvent("kodio:consent", { detail: c }));
  }
  function save(p, a, m) {
    var c = { necessary: true, preferences: p, analytics: a, marketing: m, date: Date.now() };
    write(c);
    apply(c);
    bar.hidden = true;
    box.hidden = true;
  }
  function openSettings() {
    var c = K.consent || {};
    cp.checked = !!c.preferences;
    ca.checked = !!c.analytics;
    ck.checked = !!c.marketing;
    bar.hidden = true;
    box.hidden = false;
  }

  var saved = read();
  K.consent = saved || { necessary: true, preferences: false, analytics: false, marketing: false };
  if (saved) apply(saved);
  else
    setTimeout(function () {
      if (box.hidden && !read()) bar.hidden = false;
    }, 1800);

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-ck]");
    if (!b) return;
    var a = b.dataset.ck;
    if (a === "all") save(true, true, true);
    else if (a === "none") save(false, false, false);
    else if (a === "save") save(cp.checked, ca.checked, ck.checked);
    else if (a === "set") openSettings();
    else if (a === "close") {
      box.hidden = true;
      if (!read()) bar.hidden = false;
    }
  });
  $("ckopen").onclick = openSettings;
  box.addEventListener("click", function (e) {
    if (e.target === box) box.hidden = true;
  });
  addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !box.hidden) box.hidden = true;
  });
  if (location.hash === "#cookies") setTimeout(openSettings, 1800);
})();
