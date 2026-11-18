/* Projektet që shfaqen te "Punimet" (karuseli me laptop, tablet, telefon).
   n = emri, u = adresa që duket, ty = lloji i projektit, link = adresa e vërtetë (hapet kur klikohet;
   lëre "" nëse nuk ka), d = përshkrimi, k = teknologjitë, v = video opsionale ("assets/video/projekti.mp4").

   PROJEKT ME FOTO TË VËRTETA (si Rei Mobile Store): img = { lp, tb, ph } — një foto e gjatë për
   laptop (gjerësi 960px), tablet (600px) dhe telefon (424px), te assets/images/projects/.
   sc = sa px lëviz faqja në secilën pajisje (numër negativ; sa më e gjatë foto, aq më i madh).

   PROJEKT DEMO (pa foto): t/s/b/i = tekstet e faqes së vizatuar, c1/c2 = ngjyrat.
   ty me "· koncept" = dizajn për biznes të shpikur (jo klient real); "· projekt real" = punë e vërtetë. */

window.KODIO_SITES = [
  {
    link: "",
    n: "Rei Mobile Store",
    u: "reimobile.al",
    ty: "Dyqan online · projekt real",
    img: {
      lp: "assets/images/projects/rei-lp.webp",
      tb: "assets/images/projects/rei-tb.webp",
      ph: "assets/images/projects/rei-ph.webp",
    },
    sc: { lp: -700, tb: -538, ph: -966 },
    d: "Dyqan online për telefona dhe aksesorë: katalog me filtra, shportë, porosi, llogari përdoruesish dhe panel administrimi.",
    k: ["Python", "SQLite", "JavaScript", "JWT"],
  },
  {
    link: "",
    n: "WebWatch",
    u: "Django",
    ty: "Landing page produkti · projekt real",
    img: {
      lp: "assets/images/projects/webwatch-lp.webp",
      tb: "assets/images/projects/webwatch-tb.webp",
      ph: "assets/images/projects/webwatch-ph.webp",
    },
    sc: { lp: -800, tb: -850, ph: -966 },
    d: "Faqe prezantimi për orë Apple Watch me Django: produktet vijnë nga databaza, formulari i kontaktit ruan mesazhet dhe gjithçka menaxhohet nga paneli admin. Dizajni bazë: shablloni WATCH i HTML Codex.",
    k: ["Python", "Django", "SQLite", "Bootstrap"],
  },
  {
    link: "",
    n: "Te Ura",
    u: "teura.al",
    ty: "Website restoranti · koncept",
    img: {
      lp: "assets/images/projects/teura-lp.webp",
      tb: "assets/images/projects/teura-tb.webp",
      ph: "assets/images/projects/teura-ph.webp",
    },
    sc: { lp: -800, tb: -850, ph: -966 },
    d: "Website për një restorant tradicional: menu me çmime, specialitetet e shefit, rezervim tavoline dhe galeri e ambientit.",
    k: ["HTML", "CSS", "Responsive", "SEO lokal"],
  },
  {
    link: "",
    n: "Elira",
    u: "elira.al",
    ty: "Dyqan online mode · koncept",
    img: {
      lp: "assets/images/projects/elira-lp.webp",
      tb: "assets/images/projects/elira-tb.webp",
      ph: "assets/images/projects/elira-ph.webp",
    },
    sc: { lp: -800, tb: -850, ph: -966 },
    d: "Dyqan online për veshje femrash: kategori, produkte me ngjyra dhe zbritje, oferta javore dhe newsletter.",
    k: ["HTML", "CSS", "Responsive", "E-commerce UI"],
  },
  {
    link: "",
    n: "Dental Smile",
    u: "dentalsmile.al",
    ty: "Website klinike dentare · koncept",
    img: {
      lp: "assets/images/projects/dental-lp.webp",
      tb: "assets/images/projects/dental-tb.webp",
      ph: "assets/images/projects/dental-ph.webp",
    },
    sc: { lp: -800, tb: -850, ph: -966 },
    d: "Website për klinikë dentare: shërbimet, rezervim online me ditë dhe orë, ekipi i mjekëve dhe çmime të qarta.",
    k: ["HTML", "CSS", "Responsive", "SEO lokal"],
  },
  {
    link: "",
    n: "FitZone",
    u: "fitzone.al",
    ty: "Website palestre · koncept",
    img: {
      lp: "assets/images/projects/fitzone-lp.webp",
      tb: "assets/images/projects/fitzone-tb.webp",
      ph: "assets/images/projects/fitzone-ph.webp",
    },
    sc: { lp: -800, tb: -850, ph: -966 },
    d: "Website për palestër: klasat, orari i ditës me rezervim, planet e anëtarësimit dhe paneli i progresit për anëtarët.",
    k: ["HTML", "CSS", "Responsive", "Dashboard UI"],
  },
];
