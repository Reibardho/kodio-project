/* Punimet: karuseli me laptop, tablet dhe telefon (#cs) dhe dritarja "Website live". Projektet: js/data/sites.js. */
(function () {
  var K = window.Kodio,
    $ = K.$,
    L = K.L;
  var SITES = window.KODIO_SITES;

  function pgHTML(s) {
    return (
      `<div style='background:${s.c1};padding:12px 14px;display:flex;justify-content:space-between;color:#fff;font-weight:800;font-size:12px'><span>${s.n}</span><span>☰</span></div><div style='background:linear-gradient(135deg,${s.c1},${s.c2});color:#fff;padding:26px 16px 30px'><div style='font-size:22px;font-weight:800;line-height:1.15'>${L(s.t)}</div><div style='font-size:11px;opacity:.92;margin:8px 0 14px'>${L(s.s)}</div><span style='background:#fff;color:${s.c1};padding:8px 14px;border-radius:99px;font-size:11px;font-weight:700'>${L(s.b)}</span></div><div style='padding:14px;display:grid;gap:10px'>` +
      s.i
        .map(function (e) {
          return `<div style='display:flex;gap:10px;align-items:center;border:1px solid #e5e7ef;border-radius:12px;padding:10px'><div style='width:40px;height:40px;border-radius:10px;background:${s.c2}33;display:grid;place-content:center;font-size:18px'>${e[0]}</div><div><div style='font-weight:700;font-size:12px'>${L(e[1])}</div><div style='font-size:10px;color:#666'>${L(e[2])}</div></div></div>`;
        })
        .join("") +
      `</div><div style='padding:16px;background:#f3f4f8;font-size:10px;color:#555;text-align:center'>© 2026 ${s.n}</div>`
    );
  }

  var cs = $("cs"),
    cp = [],
    ci = 0,
    playing = true,
    ctm,
    dots = $("cd2");

  SITES.forEach(function (s, i) {
    var d = document.createElement("div");
    d.className = "cp";
    d.innerHTML = devs(s);
    d.onclick = function () {
      if (d.classList.contains("p0")) openSite(i);
      else {
        cgo(i);
        cplay();
      }
    };
    cs.appendChild(d);
    cp.push(d);
  });

  dots.innerHTML = SITES.map(function () {
    return "<i></i>";
  }).join("");

  function cgo(i) {
    var n = SITES.length;
    ci = (i + n) % n;
    cp.forEach(function (d, j) {
      var o = (j - ci + n) % n;
      d.className = "cp " + (o === 0 ? "p0" : o === 1 ? "pr" : o === n - 1 ? "pl" : "phd");
    });
    var s = SITES[ci];
    var lk = $("cvl");
    lk.href = s.link || "#";
    if (s.link) {
      lk.target = "_blank";
      lk.rel = "noopener";
    } else lk.removeAttribute("target");
    $("ct").textContent = L(s.ty);
    $("ctt").textContent = s.n;
    $("cdd").textContent = L(s.d);
    $("ctk").textContent = s.k.map(L).join(" · ");
    dots.querySelectorAll("i").forEach(function (x, j) {
      x.classList.toggle("on", j === ci);
    });
  }

  function cplay() {
    clearInterval(ctm);
    if (playing)
      ctm = setInterval(function () {
        cgo(ci + 1);
      }, 5000);
    $("cpp").textContent = playing ? "❚❚" : "▶";
  }

  $("cpv").onclick = function () {
    cgo(ci - 1);
    cplay();
  };

  $("cnx").onclick = function () {
    cgo(ci + 1);
    cplay();
  };

  $("cpp").onclick = function () {
    playing = !playing;
    cplay();
  };

  cgo(0);

  cplay();

  fitDev();

  addEventListener("resize", fitDev);

  var vm = $("vm"),
    vc = $("vc");

  function vclose() {
    vm.hidden = true;
    vc.innerHTML = "";
  }

  function vmOpen(i) {
    var s = SITES[i];
    if (s.v) {
      vc.innerHTML = "<video src='" + s.v + "' autoplay muted loop playsinline controls></video>";
    } else {
      vc.innerHTML = devs(s);
    }
    $("vcap").textContent =
      s.n +
      " · " +
      s.u +
      (s.v ? "" : " · " + L(s.img ? "pamje nga projekti" : "pamje live e animuar"));
    vm.hidden = false;
    clearInterval(ctm);
    fitDev();
  }

  function openSite(i) {
    var s = SITES[i];
    if (s.link) window.open(s.link, "_blank", "noopener");
    else vmOpen(i);
  }

  $("cvl").onclick = function (e) {
    if (SITES[ci].link) return;
    e.preventDefault();
    vmOpen(ci);
  };

  function pgWide(s) {
    var it = s.i,
      nav = "";
    for (var k = 0; k < 4; k++) nav += "<span>" + L(it[k][1]) + "</span>";
    var cards = "";
    for (var j = 0; j < 3; j++)
      cards += `<div style='border:1px solid #e5e7ef;border-radius:12px;padding:14px'><div style='width:34px;height:34px;border-radius:10px;background:${s.c2}33;display:grid;place-content:center;font-size:17px;margin-bottom:10px'>${it[j][0]}</div><div style='font-weight:700;font-size:12px'>${L(it[j][1])}</div><div style='font-size:10px;color:#666;margin-top:3px'>${L(it[j][2])}</div></div>`;
    return `<div style='display:flex;align-items:center;justify-content:space-between;background:#fff;padding:14px 28px;border-bottom:1px solid #eee'><b style='font-size:14px;color:${s.c1}'>${s.n}</b><div style='display:flex;gap:20px;font-size:10.5px;color:#555'>${nav}</div></div><div style='display:grid;grid-template-columns:1.1fr 1fr;gap:24px;align-items:center;padding:34px 32px;background:linear-gradient(135deg,${s.c1},${s.c2});color:#fff'><div><div style='font-size:32px;font-weight:800;line-height:1.1'>${L(s.t)}</div><div style='font-size:12px;opacity:.92;margin:12px 0 20px'>${L(s.s)}</div><span style='background:#fff;color:${s.c1};padding:10px 22px;border-radius:99px;font-size:12px;font-weight:700'>${L(s.b)}</span></div><div style='height:170px;border-radius:16px;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.4);display:grid;place-content:center;font-size:70px'>${it[0][0]}</div></div><div style='display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:26px 32px;background:#fff'>${cards}</div><div style='padding:18px;background:#f3f4f8;font-size:10px;color:#555;text-align:center'>© 2026 ${s.n}</div>`;
  }

  // Përmbajtja e ekranit të secilës pajisje: foto e vërtetë (s.img) ose faqja demo e vizatuar
  function scr(s, dev, html) {
    if (s.img)
      return (
        "<img src='" +
        s.img[dev] +
        "' alt='" +
        s.n +
        "' loading='lazy' style='display:block;width:100%'>"
      );
    return html;
  }
  function sc(s, dev, def) {
    return (s.sc && s.sc[dev]) || def;
  }

  function devs(s) {
    return (
      "<div class='dm'><div class='dv tb'><div class='dscr'><div class='dsc' style='width:300px' data-w='300'><div class='dpg' style='--sc:" +
      sc(s, "tb", -190) +
      "px'>" +
      scr(s, "tb", s.img ? "" : pgHTML(s)) +
      "</div></div></div></div><div class='dv lp'><div class='dscr'><div class='dsc' style='width:640px' data-w='640'><div class='dpg' style='--sc:" +
      sc(s, "lp", -130) +
      "px'>" +
      scr(s, "lp", s.img ? "" : pgWide(s)) +
      "</div></div></div><div class='lbase'></div></div><div class='dv ph'><div class='dscr'><i class='dnotch'></i><div class='dsc' style='width:212px' data-w='212'><div class='dpg' style='--sc:" +
      sc(s, "ph", -200) +
      "px'>" +
      scr(s, "ph", s.img ? "" : pgHTML(s)) +
      "</div></div></div></div></div>"
    );
  }

  function fitDev() {
    document.querySelectorAll(".dsc").forEach(function (el) {
      var w = +el.dataset.w,
        p = el.parentNode.clientWidth;
      if (p) el.style.transform = "scale(" + p / w + ")";
    });
  }

  vm.onclick = function (e) {
    if (e.target === vm || e.target.id === "vx") vclose();
  };

  addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !vm.hidden) {
      vclose();
      cplay();
    }
  });
  K.onLang(function () {
    cp.forEach(function (d, i) {
      d.innerHTML = devs(SITES[i]);
    });
    fitDev();
    cgo(ci);
  });
})();
