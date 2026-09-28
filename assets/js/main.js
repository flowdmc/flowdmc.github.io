/* flow Onepager V0.1 · kleines Vanilla-JavaScript
   Die Seite ist ohne JavaScript vollständig lesbar. Hier kommen nur dazu:
   Tag/Nacht-Schalter, Protokollzeile, Menü mobil, Anfrage-Leiste, Formular. */
(function () {
  'use strict';
  var d = document.documentElement;

  /* ---------- Tag / Nacht ---------- */
  var schalter = document.getElementById('schalter');
  function schalterBeschriften() {
    var nacht = d.getAttribute('data-modus') === 'nacht';
    schalter.setAttribute('aria-label', nacht ? 'Zum Tagmodus wechseln' : 'Zum Nachtmodus wechseln');
    schalter.querySelector('.schalter-text').textContent = nacht ? 'Tag' : 'Nacht';
  }
  if (schalter) {
    schalterBeschriften();
    schalter.addEventListener('click', function () {
      var neu = d.getAttribute('data-modus') === 'nacht' ? 'tag' : 'nacht';
      d.setAttribute('data-modus', neu);
      try { localStorage.setItem('flow-modus', neu); } catch (e) {}
      schalterBeschriften();
    });
  }

  /* ---------- Protokollzeile: Gruß nach Tageszeit und Uhrzeit ---------- */
  var protokoll = document.getElementById('protokoll');
  function zweistellig(n) { return (n < 10 ? '0' : '') + n; }
  function protokollSetzen() {
    var j = new Date(), h = j.getHours();
    var gruss = (h >= 5 && h < 10) ? 'Guten Morgen' : ((h >= 10 && h < 18) ? 'Guten Tag' : 'Guten Abend');
    protokoll.textContent = gruss + ' / ' + zweistellig(h) + ':' + zweistellig(j.getMinutes()) + ' Uhr';
  }
  if (protokoll) { protokollSetzen(); setInterval(protokollSetzen, 30000); }

  /* ---------- Menü mobil ---------- */
  var menue = document.getElementById('menue');
  var menueKnopf = document.getElementById('menue-knopf');
  function menueSetzen(offen) {
    menue.classList.toggle('offen', offen);
    menueKnopf.setAttribute('aria-expanded', offen ? 'true' : 'false');
    menueKnopf.textContent = offen ? 'Schließen' : 'Menü';
  }
  if (menue && menueKnopf) {
    menueKnopf.addEventListener('click', function () {
      menueSetzen(menueKnopf.getAttribute('aria-expanded') !== 'true');
    });
    menue.addEventListener('click', function (e) {
      if (e.target.closest('a')) menueSetzen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menueKnopf.getAttribute('aria-expanded') === 'true') {
        menueSetzen(false);
        menueKnopf.focus();
      }
    });
  }

  /* ---------- Anfrage-Leiste mobil: aus, sobald der Kontaktbereich sichtbar ist ---------- */
  var leiste = document.getElementById('anfrage-leiste');
  var kontakt = document.getElementById('kontakt');
  var fuss = document.querySelector('.fuss');
  if (leiste && kontakt && 'IntersectionObserver' in window) {
    var sichtbar = new Set();
    var beobachter = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        if (e.isIntersecting) sichtbar.add(e.target); else sichtbar.delete(e.target);
      });
      leiste.classList.toggle('weg', sichtbar.size > 0);
    });
    beobachter.observe(kontakt);
    if (fuss) beobachter.observe(fuss);
  }

  /* ---------- Formular ---------- */
  var form = document.getElementById('anfrage');
  if (!form) return;
  form.setAttribute('novalidate', '');
  var felder = {
    name: document.getElementById('f-name'),
    projekt: document.getElementById('f-projekt'),
    kontakt: document.getElementById('f-kontakt')
  };
  var fehler = {
    name: document.getElementById('fehler-name'),
    kontakt: document.getElementById('fehler-kontakt'),
    senden: document.getElementById('fehler-senden')
  };
  var knopf = document.getElementById('absenden');
  var nochNicht = document.getElementById('noch-nicht');
  var angekommen = document.getElementById('angekommen');
  var knopfText = knopf.textContent;
  var mindest = { name: 6, projekt: 22, kontakt: 18 };

  /* Lücken wachsen beim Tippen mit (in ch, Obergrenze 100 % per CSS) */
  function breiteSetzen(k) {
    var f = felder[k];
    var n = Math.max(f.value.length, mindest[k]) + 1;
    f.style.width = n + 'ch';
  }
  Object.keys(felder).forEach(function (k) {
    breiteSetzen(k);
    felder[k].addEventListener('input', function () {
      breiteSetzen(k);
      if (fehler[k] && felder[k].value.trim()) {
        fehler[k].hidden = true;
        felder[k].removeAttribute('aria-invalid');
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    fehler.senden.hidden = true;

    var fehltName = !felder.name.value.trim();
    var fehltKontakt = !felder.kontakt.value.trim();
    fehler.name.hidden = !fehltName;
    fehler.kontakt.hidden = !fehltKontakt;
    felder.name.toggleAttribute('aria-invalid', fehltName);
    felder.kontakt.toggleAttribute('aria-invalid', fehltKontakt);
    if (fehltName) felder.name.setAttribute('aria-invalid', 'true');
    if (fehltKontakt) felder.kontakt.setAttribute('aria-invalid', 'true');
    if (fehltName || fehltKontakt) {
      (fehltName ? felder.name : felder.kontakt).focus();
      return;
    }

    /* Noch keine Form.taxi-ID: freundlicher Hinweis statt Versand */
    var id = (form.getAttribute('data-form-id') || '').trim();
    if (!id) {
      nochNicht.hidden = false;
      return;
    }

    knopf.disabled = true;
    knopf.textContent = "Schick's ab...";
    fetch('https://form.taxi/s/' + encodeURIComponent(id), {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok || !j.success) throw new Error('Versand fehlgeschlagen');
      });
    }).then(function () {
      form.hidden = true;
      angekommen.hidden = false;
      angekommen.focus();
    }).catch(function () {
      fehler.senden.hidden = false;
      knopf.disabled = false;
      knopf.textContent = knopfText;
    });
  });
})();
