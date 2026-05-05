/* =====================================================
   main.js  –  Deckblatt Designer Logic
   Requires: lang.js  (T, currentLang, applyLang)
   ===================================================== */

/* ── State ─────────────────────────────────────── */
let theme       = 'classic';
let photoData   = null;
let frame       = 'none';
let accentColor = '#5a7358';  /* FEATURE #7  */
let photoFilter = 'none';     /* FEATURE #11 */
let coverFont   = 'playfair'; /* FEATURE #12 */

/* =================================================
   FEATURE #12: Schriftart-Auswahl
================================================= */
const FONT_MAP = {
  playfair:  "'Playfair Display', serif",
  source:    "'Source Sans 3', sans-serif",
  cormorant: "'Cormorant Garamond', serif",
};

function setFont(key, btn) {
  coverFont = key;
  const cover = g('cover-page');
  if (cover) cover.style.setProperty('--cv-font', FONT_MAP[key]);
  document.querySelectorAll('[data-fn]').forEach(c =>
    c.classList.toggle('on', c.dataset.fn === key)
  );
  saveState();
}

/* =================================================
   FEATURE #11: Foto-Filter (S/W, Sepia, Normal)
   Wird als CSS filter auf das <img> im Cover gesetzt
================================================= */
const FILTER_CSS = {
  none:  '',
  bw:    'grayscale(100%)',
  sepia: 'sepia(80%)',
};

function setFilter(key, btn) {
  photoFilter = key;
  document.querySelectorAll('[data-fi]').forEach(c =>
    c.classList.toggle('on', c.dataset.fi === key)
  );
  renderCover();
}

/* =================================================
   FEATURE #7: Akzentfarbe setzen
   Berechnet automatisch eine dunklere Variante
   fuer --cv-dark (Ueberschriften / Jobtitel).
================================================= */
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return [r, g, b];
}
function darken(hex, factor = 0.62) {
  const [r,g,b] = hexToRgb(hex);
  const d = v => Math.round(v * factor).toString(16).padStart(2,'0');
  return `#${d(r)}${d(g)}${d(b)}`;
}

function setAccent(color, swatchEl) {
  accentColor = color;

  /* CSS-Variablen direkt auf cover-page setzen */
  const cover = g('cover-page');
  if (cover) {
    cover.style.setProperty('--cv-accent', color);
    cover.style.setProperty('--cv-dark',   darken(color));
  }

  /* Freien Farbwähler synchronisieren */
  const picker = g('f-accent');
  if (picker) picker.value = color;

  /* Swatch active-Klasse */
  document.querySelectorAll('.color-swatch').forEach(s =>
    s.classList.toggle('active', s.dataset.color === color)
  );

  /* In localStorage mitspeichern */
  saveState();
}

/* ── DOM helpers ───────────────────────────────── */
const g   = id => document.getElementById(id);
const v   = id => (g(id) ? g(id).value.trim() : '');
const esc = s  => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

/* =================================================
   FEATURE #9: Hilfsfunktionen fuer neue Felder
================================================= */
/* Geburtsdatum-Zeile (nur wenn ausgefuellt) */
function dobLine() {
  const dob = v('f-dob');
  return dob
    ? `<div class="ci"><span class="dot"></span>${esc(T('cvDob'))} ${esc(dob)}</div>`
    : '';
}
/* Geburtsdatum fuer Sidebar (eigener Stil) */
function dobLineSd() {
  const dob = v('f-dob');
  return dob
    ? `<div class="sd-ci"><span class="sd-cl">${esc(T('cvDob'))}</span><span class="sd-cv">${esc(dob)}</span></div>`
    : '';
}
/* Bewerbungsdatum im Footer (nur wenn ausgefuellt) */
function appDateEl() {
  const d = v('f-appdate');
  return d
    ? `<div class="ci" style="margin-left:auto;"><span class="dot"></span>${esc(T('cvAppDate'))} ${esc(d)}</div>`
    : '';
}

/* ── FIX #4: E-Mail-Validierung (visuelles Feedback) ── */
function validateEmail() {
  const input = g('f-email');
  if (!input) return;
  const val = input.value.trim();
  const valid = val === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  /* rote Umrandung bei ungueltigem Format */
  input.style.borderColor = valid ? '' : '#c0392b';
  input.style.background  = valid ? '' : '#fff5f5';

  /* Hinweistext unter dem Feld */
  let hint = document.getElementById('email-hint');
  if (!valid) {
    if (!hint) {
      hint = document.createElement('small');
      hint.id = 'email-hint';
      hint.style.cssText = 'color:#c0392b;font-size:11px;margin-top:2px;display:block;';
      input.parentNode.appendChild(hint);
    }
    hint.textContent = currentLang === 'ar'
      ? 'صيغة البريد الإلكتروني غير صحيحة'
      : currentLang === 'en'
        ? 'Invalid e-mail format'
        : 'Ungültige E-Mail-Adresse';
  } else if (hint) {
    hint.remove();
  }
}

/* =================================================
   FEATURE #6: localStorage  –  Zustand speichern
   & wiederherstellen (Foto wird NICHT gespeichert)
================================================= */

/* Alle Felder die gespeichert werden */
const SAVE_FIELDS = [
  'f-name','f-street','f-city','f-phone',
  'f-email','f-dob','f-job','f-company','f-appdate',
  'f-pos','f-shape','f-sz','f-qr',
];
const LS_KEY = 'deckblatt_v1';

function saveState() {
  try {
    const data = { theme, frame, lang: currentLang, accent: accentColor, filter: photoFilter, font: coverFont };

    /* Texteingaben & Selects */
    SAVE_FIELDS.forEach(id => {
      const el = g(id);
      if (el) data[id] = el.value;
    });

    /* Checkbox */
    const qrOn = g('qr-on');
    if (qrOn) data['qr-on'] = qrOn.checked;

    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch (e) {
    /* localStorage nicht verfuegbar (z.B. privater Modus) – kein Fehler */
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);

    /* Texteingaben & Selects */
    SAVE_FIELDS.forEach(id => {
      const el = g(id);
      if (el && data[id] !== undefined) el.value = data[id];
    });

    /* Checkbox */
    const qrOn = g('qr-on');
    if (qrOn && data['qr-on'] !== undefined) qrOn.checked = data['qr-on'];

    /* Theme wiederherstellen */
    if (data.theme) {
      theme = data.theme;
      document.querySelectorAll('.tbtn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.t === theme);
      });
    }

    /* Frame wiederherstellen */
    if (data.frame) {
      frame = data.frame;
      document.querySelectorAll('.chip').forEach(chip => {
        chip.classList.toggle('on', chip.dataset.f === frame);
      });
    }

    /* Akzentfarbe wiederherstellen (FEATURE #7) */
    if (data.accent) {
      setAccent(data.accent, null);
    }

    /* Foto-Filter wiederherstellen (FEATURE #11) */
    if (data.filter && FILTER_CSS[data.filter] !== undefined) {
      photoFilter = data.filter;
      document.querySelectorAll('[data-fi]').forEach(c =>
        c.classList.toggle('on', c.dataset.fi === photoFilter)
      );
    }

    /* Schriftart wiederherstellen (FEATURE #12) */
    if (data.font && FONT_MAP[data.font]) {
      setFont(data.font, null);
    }

    /* Sprache wiederherstellen */
    if (data.lang && typeof applyLang === 'function') {
      applyLang(data.lang);   /* loest auch renderCover() aus */
      return true;            /* Bootstrap soll kein zweites renderCover machen */
    }

  } catch (e) {
    /* Korrupter localStorage-Eintrag – einfach ignorieren */
    try { localStorage.removeItem(LS_KEY); } catch (_) {}
  }
  return false;
}

/* ═══════════════════════════════════════════════
   PHOTO HANDLING
═══════════════════════════════════════════════ */
function loadPhoto(ev) {
  const file = ev.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    photoData = e.target.result;
    g('thumb').src       = photoData;
    g('thumb-name').textContent = file.name;
    g('thumb-row').style.display = 'flex';
    renderCover();
  };
  reader.readAsDataURL(file);
}

function removePhoto() {
  photoData = null;
  g('photo-input').value = '';
  g('thumb-row').style.display = 'none';
  renderCover();
}

/* drag-over highlight handled inline in HTML */
/* FIX #3: DataTransfer-Fallback fuer aeltere Browser (Safari, Firefox) */
function handleDrop(ev) {
  ev.preventDefault();
  g('photo-drop').style.borderColor = '';
  const file = ev.dataTransfer.files[0];
  if (!file || !file.type.startsWith('image/')) return;

  /* Versuch 1: DataTransfer API (moderne Browser) */
  try {
    const dt = new DataTransfer();
    dt.items.add(file);
    g('photo-input').files = dt.files;
    loadPhoto({ target: { files: dt.files } });
  } catch (e) {
    /* Fallback: direkt per FileReader einlesen (aeltere Browser) */
    const reader = new FileReader();
    reader.onload = ev2 => {
      photoData = ev2.target.result;
      g('thumb').src = photoData;
      g('thumb-name').textContent = file.name;
      g('thumb-row').style.display = 'flex';
      renderCover();
    };
    reader.readAsDataURL(file);
  }
}

/* ═══════════════════════════════════════════════
   THEME & FRAME SELECTION
═══════════════════════════════════════════════ */
function setTheme(key, btn) {
  theme = key;
  document.querySelectorAll('.tbtn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderCover();
}

function setFrame(key, btn) {
  frame = key;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('on'));
  btn.classList.add('on');
  renderCover();
}

/* ── Frame CSS string ───────────────────────── */
function frameCss() {
  const map = {
    'none':   '',
    'tw':     'border: 2px solid rgba(255,255,255,0.92);',
    'TW':     'border: 5px solid rgba(255,255,255,0.96);',
    'sage':   'border: 3px solid #5a7a6e;',
    'dark':   'border: 3px solid #3d5c52;',
    'shadow': 'box-shadow: 0 4px 20px rgba(0,0,0,0.28);',
  };
  return map[frame] || '';
}

/* ═══════════════════════════════════════════════
   PHOTO ELEMENT BUILDER
   w/h → fixed px size; bg → background colour
   center → pass true to apply 1.7× size boost
═══════════════════════════════════════════════ */
function photoEl(opts = {}) {
  const pos = v('f-pos');
  if (pos === 'none') return '';

  const sz  = parseInt(v('f-sz') || '120');
  /* Centre photo is significantly larger for visual impact */
  const scale = opts.center ? 1.72 : 1;
  const pw  = opts.w || Math.round(sz * scale);
  const ph  = opts.h || Math.round(sz * 1.28 * scale);
  const br  = v('f-shape') || '0';
  const bg  = opts.bg || '#c5d5c2';
  const fc  = frameCss();
  const strokeCol = opts.darkStroke ? 'rgba(255,255,255,0.42)' : '#5a7358';
  const textCol   = opts.darkStroke ? 'rgba(255,255,255,0.42)' : '#5a7358';

  /* FEATURE #11: Filter-String fuer das Foto-img */
  const filterStyle = FILTER_CSS[photoFilter] ? `filter:${FILTER_CSS[photoFilter]};` : '';

  const inner = photoData
    ? `<img src="${photoData}" style="width:100%;height:100%;object-fit:cover;display:block;${filterStyle}">`
    : `<div class="ph">
         <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
              stroke="${strokeCol}" stroke-width="1.5">
           <circle cx="12" cy="8" r="4"/>
           <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
         </svg>
         <span style="color:${textCol};">${esc(T('cvFoto'))}</span>
       </div>`;

  return `<div class="ps" style="width:${pw}px;height:${ph}px;border-radius:${br};background:${bg};${fc}overflow:hidden;">${inner}</div>`;
}

/* ═══════════════════════════════════════════════
   THEME RENDERERS
═══════════════════════════════════════════════ */

/* ── Classic ────────────────────────────────── */
function renderClassic() {
  const pos     = v('f-pos');
  const nameVal = esc(v('f-name'))  || esc(T('pName'));
  const adr     = `${esc(v('f-street'))}<br>${esc(v('f-city'))}`;
  const jobVal  = esc(v('f-job'))   || esc(T('pJob'));
  const coVal   = v('f-company') ? `<div class="co">${esc(T('cvBei'))} ${esc(v('f-company'))}</div>` : '';

  const cornerBox = pos === 'corner' ? photoEl() : '';
  const centerBox = pos === 'center' ? `<div style="margin-bottom:26px;">${photoEl({ center: true })}</div>` : '';

  const qrEl  = g('qr-on').checked ? `<div class="qr-box" id="qr-target" style="margin-left:auto;flex-shrink:0;"></div>` : '';
  const telEl = v('f-phone') ? `<div class="ci"><span class="dot"></span>${esc(T('cvTelLabel'))} ${esc(v('f-phone'))}</div>` : '';
  const emlEl = v('f-email') ? `<div class="ci"><span class="dot"></span>${esc(v('f-email'))}</div>` : '';

  return `<div class="cf">
    <div class="hdr">
      <div>
        <div class="nm">${nameVal}</div>
        <div class="adr">${adr}</div>
        ${dobLine()}
      </div>
      ${cornerBox}
    </div>
    <div class="body">
      ${centerBox}
      <div class="lbl">${esc(T('cvBewerbung'))}</div>
      <div class="als">${esc(T('cvAls'))}</div>
      <div class="job">${jobVal}</div>
      ${coVal}
    </div>
    <div class="ftr">${telEl}${emlEl}${appDateEl()}${qrEl}</div>
  </div>`;
}

/* ── Header-Band ────────────────────────────── */
function renderBand() {
  const pos     = v('f-pos');
  const nameVal = esc(v('f-name')) || esc(T('pName'));
  const adr     = `${esc(v('f-street'))} · ${esc(v('f-city'))}`;
  const jobVal  = esc(v('f-job'))  || esc(T('pJob'));
  const coVal   = v('f-company') ? `<div class="co">${esc(T('cvBei'))} ${esc(v('f-company'))}</div>` : '';

  const sz   = parseInt(v('f-sz') || '120');
  const ph   = Math.round(sz * 1.25);
  const box  = photoEl({ w: sz, h: ph });

  const cornerBox = pos === 'corner'
    ? `<div style="position:absolute;top:28px;right:50px;">${box}</div>` : '';
  const centerBox = pos === 'center'
    ? `<div style="margin-bottom:22px;">${photoEl({ w: Math.round(sz * 1.72), h: Math.round(sz * 1.25 * 1.72), center: true })}</div>` : '';

  const qrEl  = g('qr-on').checked ? `<div class="qr-box" id="qr-target" style="margin-left:auto;flex-shrink:0;"></div>` : '';
  const telEl = v('f-phone') ? `<div class="ci"><span class="dot"></span>${esc(v('f-phone'))}</div>` : '';
  const emlEl = v('f-email') ? `<div class="ci"><span class="dot"></span>${esc(v('f-email'))}</div>` : '';

  return `<div class="cf">
    <div class="top-bar"></div>
    <div class="hdr" style="position:relative;">
      <div>
        <div class="nm">${nameVal}</div>
        <div class="adr">${adr}</div>
        ${dobLine()}
      </div>
      ${cornerBox}
    </div>
    <div class="body">
      ${centerBox}
      <div class="lbl">${esc(T('cvBewerbung'))}</div>
      <div class="rule"></div>
      <div class="als">${esc(T('cvAls'))}</div>
      <div class="job">${jobVal}</div>
      ${coVal}
    </div>
    <div class="ftr">${telEl}${emlEl}${appDateEl()}${qrEl}</div>
  </div>`;
}

/* ── Sidebar ────────────────────────────────── */
function renderSidebar() {
  const pos     = v('f-pos');
  const nameVal = esc(v('f-name')) || esc(T('pName'));
  const sz      = parseInt(v('f-sz') || '120');
  const br      = v('f-shape') || '50%';
  const ph2     = Math.round(sz * (br === '50%' ? 1 : 1.25));

  const sideBox = pos !== 'none'
    ? photoEl({ w: sz, h: ph2, bg: '#4a6b5f', darkStroke: true })
    : '';
  const mainBox = pos === 'center'
    ? `<div style="display:flex;justify-content:center;margin-bottom:18px;">${photoEl({ w: Math.round(sz * 1.72), h: Math.round(ph2 * 1.72), center: true })}</div>`
    : '';

  const telEl  = v('f-phone') ? `<div class="sd-ci"><span class="sd-cl">${esc(T('cvTel'))}</span><span class="sd-cv">${esc(v('f-phone'))}</span></div>` : '';
  const emlEl  = v('f-email') ? `<div class="sd-ci"><span class="sd-cl">${esc(T('cvEmail'))}</span><span class="sd-cv">${esc(v('f-email'))}</span></div>` : '';
  const qrEl   = g('qr-on').checked ? `<div class="qr-box" id="qr-target" style="margin-top:18px;"></div>` : '';
  const jobVal = esc(v('f-job')) || esc(T('pJob'));
  const coVal  = v('f-company') ? `<div class="co">${esc(T('cvBei'))} ${esc(v('f-company'))}</div>` : '';
  const adEl   = v('f-appdate') ? `<div class="sd-ci" style="margin-top:10px;"><span class="sd-cl">${esc(T('cvAppDate'))}</span><span class="sd-cv">${esc(v('f-appdate'))}</span></div>` : '';

  return `<div class="sd">
      ${pos === 'corner' ? `<div style="margin-bottom:14px;">${sideBox}</div>` : ''}
      <div class="sd-nm">${nameVal}</div>
      <div class="sd-adr">${esc(v('f-street'))}<br>${esc(v('f-city'))}</div>
      <div class="sd-div"></div>
      ${telEl}${emlEl}${dobLineSd()}${adEl}${qrEl}
    </div>
    <div class="mn">
      ${mainBox}
      <div class="lbl">${esc(T('cvBewerbung'))}</div>
      <div class="als">${esc(T('cvAls'))}</div>
      <div class="job">${jobVal}</div>
      ${coVal}
    </div>`;
}

/* ── Minimal ────────────────────────────────── */
function renderMinimal() {
  const pos     = v('f-pos');
  const nameVal = esc(v('f-name')) || esc(T('pName'));
  const sz      = parseInt(v('f-sz') || '120');
  const ph2     = Math.round(sz * 1.28);
  const box     = photoEl({ w: sz, h: ph2, bg: '#e8ece8' });

  const cornerBox = pos === 'corner'
    ? `<div style="position:absolute;top:0;right:0;">${box}</div>` : '';
  const centerBox = pos === 'center'
    ? `<div style="margin-bottom:22px;">${photoEl({ w: Math.round(sz * 1.72), h: Math.round(ph2 * 1.72), bg: '#e8ede8', center: true })}</div>` : '';

  const qrEl  = g('qr-on').checked ? `<div class="qr-box" id="qr-target" style="margin-left:auto;"></div>` : '';
  const telEl = v('f-phone') ? `<div class="ci"><span class="dot"></span>${esc(v('f-phone'))}</div>` : '';
  const emlEl = v('f-email') ? `<div class="ci"><span class="dot"></span>${esc(v('f-email'))}</div>` : '';
  const jobVal = esc(v('f-job')) || esc(T('pJob'));
  const coVal  = v('f-company') ? `<div class="co">${esc(T('cvBei'))} ${esc(v('f-company'))}</div>` : '';

  return `<div class="cf">
    <div class="acc-bar"></div>
    <div class="hdr" style="position:relative;">
      <div class="nm">${nameVal}</div>
      <div class="adr">${esc(v('f-street'))}<br>${esc(v('f-city'))}</div>
      ${dobLine()}
      ${cornerBox}
    </div>
    <div class="body">
      ${centerBox}
      <div class="rule"></div>
      <div class="lbl">${esc(T('cvBewerbung'))}</div>
      <div class="als">${esc(T('cvAls'))}</div>
      <div class="job">${jobVal}</div>
      ${coVal}
    </div>
    <div class="ftr">${telEl}${emlEl}${appDateEl()}${qrEl}</div>
  </div>`;
}

/* ═══════════════════════════════════════════════
   SCHRITT 13 — NEUE THEMES
═══════════════════════════════════════════════ */

/* ── A: Elegant ─────────────────────────────── */
function renderElegant() {
  const pos     = v('f-pos');
  const nameVal = esc(v('f-name'))    || esc(T('pName'));
  const jobVal  = esc(v('f-job'))     || esc(T('pJob'));
  const coVal   = v('f-company')
    ? `<div class="eg-co">${esc(T('cvBei'))} ${esc(v('f-company'))}</div>` : '';
  const telEl   = v('f-phone')
    ? `<div class="eg-ci"><span class="eg-dot"></span>${esc(v('f-phone'))}</div>` : '';
  const emlEl   = v('f-email')
    ? `<div class="eg-ci"><span class="eg-dot"></span>${esc(v('f-email'))}</div>` : '';
  const adrEl   = (v('f-street') || v('f-city'))
    ? `<div class="eg-ci"><span class="eg-dot"></span>${esc(v('f-street'))}${v('f-street') && v('f-city') ? ', ' : ''}${esc(v('f-city'))}</div>` : '';
  const dobEl   = v('f-dob')
    ? `<div class="eg-ci"><span class="eg-dot"></span>${esc(T('cvDob'))} ${esc(v('f-dob'))}</div>` : '';
  const adEl    = v('f-appdate')
    ? `<div class="eg-ci" style="margin-left:auto;"><span class="eg-dot"></span>${esc(T('cvAppDate'))} ${esc(v('f-appdate'))}</div>` : '';
  const qrEl    = g('qr-on').checked
    ? `<div class="qr-box" id="qr-target" style="margin-left:auto;flex-shrink:0;"></div>` : '';

  const sz  = parseInt(v('f-sz') || '120');
  const ph2 = Math.round(sz * 1.28);
  const centerBox = pos === 'center'
    ? `<div style="margin-bottom:28px;">${photoEl({ w: Math.round(sz*1.6), h: Math.round(ph2*1.6), bg:'#2a2a3e', darkStroke:true, center:true })}</div>` : '';
  const cornerBox = pos === 'corner'
    ? `<div style="position:absolute;top:30px;right:40px;">${photoEl({ w:sz, h:ph2, bg:'#2a2a3e', darkStroke:true })}</div>` : '';

  return `<div class="eg-wrap">
    <div class="eg-hdr" style="position:relative;">
      <div class="eg-rule-top"></div>
      <div class="eg-name">${nameVal}</div>
      <div class="eg-divider">✦</div>
      <div class="eg-lbl">${esc(T('cvBewerbung'))}</div>
      ${cornerBox}
    </div>
    <div class="eg-body">
      ${centerBox}
      <div class="eg-als">${esc(T('cvAls'))}</div>
      <div class="eg-job">${jobVal}</div>
      ${coVal}
    </div>
    <div class="eg-ftr">
      ${adrEl}${dobEl}${telEl}${emlEl}${adEl}${qrEl}
    </div>
  </div>`;
}

/* ── B: Modern ──────────────────────────────── */
function renderModern() {
  const pos     = v('f-pos');
  const nameVal = esc(v('f-name'))  || esc(T('pName'));
  const jobVal  = esc(v('f-job'))   || esc(T('pJob'));
  const coVal   = v('f-company')
    ? `<div class="mo-co">${esc(T('cvBei'))} ${esc(v('f-company'))}</div>` : '';

  const sz   = parseInt(v('f-sz') || '120');
  const ph2  = Math.round(sz * 1.28);
  const sidePhoto = pos !== 'none'
    ? photoEl({ w: sz, h: ph2, bg: '#1e40af', darkStroke: true }) : '';
  const mainPhoto = pos === 'center'
    ? `<div style="margin-bottom:20px;">${photoEl({ w:Math.round(sz*1.6), h:Math.round(ph2*1.6), bg:'#1e40af', darkStroke:true, center:true })}</div>` : '';

  const telEl = v('f-phone')
    ? `<div class="mo-ci"><span class="mo-dot"></span>${esc(v('f-phone'))}</div>` : '';
  const emlEl = v('f-email')
    ? `<div class="mo-ci"><span class="eg-dot"></span>${esc(v('f-email'))}</div>` : '';
  const dobEl = v('f-dob')
    ? `<div class="mo-ci"><span class="mo-dot"></span>${esc(T('cvDob'))} ${esc(v('f-dob'))}</div>` : '';
  const adEl  = v('f-appdate')
    ? `<div class="mo-ci" style="margin-top:auto;"><span class="mo-dot"></span>${esc(T('cvAppDate'))} ${esc(v('f-appdate'))}</div>` : '';
  const qrEl  = g('qr-on').checked
    ? `<div class="qr-box" id="qr-target" style="margin-top:16px;"></div>` : '';

  return `<div class="mo-wrap">
    <div class="mo-stripe">
      <div class="mo-stripe-top"></div>
      ${pos === 'corner' ? `<div style="margin:0 auto 16px;">${sidePhoto}</div>` : ''}
      <div class="mo-sname">${nameVal}</div>
      <div class="mo-sadr">${esc(v('f-street'))}<br>${esc(v('f-city'))}</div>
      <div class="mo-sdiv"></div>
      ${telEl}${emlEl}${dobEl}${adEl}${qrEl}
    </div>
    <div class="mo-main">
      ${mainPhoto}
      <div class="mo-lbl">${esc(T('cvBewerbung'))}</div>
      <div class="mo-als">${esc(T('cvAls'))}</div>
      <div class="mo-job">${jobVal}</div>
      ${coVal}
    </div>
  </div>`;
}

/* ── C: Bold ────────────────────────────────── */
function renderBold() {
  const pos     = v('f-pos');
  const nameVal = esc(v('f-name'))  || esc(T('pName'));
  const jobVal  = esc(v('f-job'))   || esc(T('pJob'));
  const coVal   = v('f-company')
    ? `<div class="bo-co">${esc(T('cvBei'))} ${esc(v('f-company'))}</div>` : '';

  const sz  = parseInt(v('f-sz') || '120');
  const ph2 = Math.round(sz * 1.28);
  const cornerBox = pos === 'corner'
    ? `<div style="position:absolute;top:24px;right:36px;">${photoEl({ w:sz, h:ph2, bg:'#333', darkStroke:true })}</div>` : '';
  const centerBox = pos === 'center'
    ? `<div style="display:flex;justify-content:center;margin-bottom:24px;">${photoEl({ w:Math.round(sz*1.6), h:Math.round(ph2*1.6), bg:'#222', darkStroke:true, center:true })}</div>` : '';

  const telEl = v('f-phone')
    ? `<div class="bo-ci"><span class="bo-dot"></span>${esc(v('f-phone'))}</div>` : '';
  const emlEl = v('f-email')
    ? `<div class="bo-ci"><span class="bo-dot"></span>${esc(v('f-email'))}</div>` : '';
  const dobEl = v('f-dob')
    ? `<div class="bo-ci"><span class="bo-dot"></span>${esc(T('cvDob'))} ${esc(v('f-dob'))}</div>` : '';
  const adEl  = v('f-appdate')
    ? `<div class="bo-ci" style="margin-left:auto;"><span class="bo-dot"></span>${esc(v('f-appdate'))}</div>` : '';
  const qrEl  = g('qr-on').checked
    ? `<div class="qr-box" id="qr-target" style="margin-left:auto;flex-shrink:0;"></div>` : '';

  return `<div class="bo-wrap">
    <div class="bo-hdr" style="position:relative;">
      <div class="bo-name">${nameVal}</div>
      <div class="bo-adr">${esc(v('f-street'))}${v('f-street')&&v('f-city') ? ' · ' : ''}${esc(v('f-city'))}</div>
      ${dobEl}
      ${cornerBox}
    </div>
    <div class="bo-body">
      ${centerBox}
      <div class="bo-lbl">${esc(T('cvBewerbung'))}</div>
      <div class="bo-line"></div>
      <div class="bo-als">${esc(T('cvAls'))}</div>
      <div class="bo-job">${jobVal}</div>
      ${coVal}
    </div>
    <div class="bo-ftr">${telEl}${emlEl}${adEl}${qrEl}</div>
  </div>`;
}

/* ── D: Clean (professionell / akademisch) ──── */
function renderClean() {
  const pos     = v('f-pos');
  const nameVal = esc(v('f-name'))  || esc(T('pName'));
  const jobVal  = esc(v('f-job'))   || esc(T('pJob'));
  const coVal   = v('f-company')
    ? `<div class="cl-co">${esc(T('cvBei'))} ${esc(v('f-company'))}</div>` : '';

  const sz  = parseInt(v('f-sz') || '120');
  const ph2 = Math.round(sz * 1.28);
  const cornerBox = pos === 'corner'
    ? `<div style="position:absolute;top:32px;right:44px;">${photoEl({ w:sz, h:ph2, bg:'#e8eaed' })}</div>` : '';
  const centerBox = pos === 'center'
    ? `<div style="display:flex;justify-content:center;margin-bottom:26px;">${photoEl({ w:Math.round(sz*1.6), h:Math.round(ph2*1.6), bg:'#e8eaed', center:true })}</div>` : '';

  const telEl = v('f-phone')
    ? `<div class="cl-ci"><span class="cl-dot"></span>${esc(v('f-phone'))}</div>` : '';
  const emlEl = v('f-email')
    ? `<div class="cl-ci"><span class="cl-dot"></span>${esc(v('f-email'))}</div>` : '';
  const dobEl = v('f-dob')
    ? `<div class="cl-ci"><span class="cl-dot"></span>${esc(T('cvDob'))} ${esc(v('f-dob'))}</div>` : '';
  const adEl  = v('f-appdate')
    ? `<div class="cl-ci" style="margin-left:auto;"><span class="cl-dot"></span>${esc(v('f-appdate'))}</div>` : '';
  const qrEl  = g('qr-on').checked
    ? `<div class="qr-box" id="qr-target" style="margin-left:auto;flex-shrink:0;"></div>` : '';

  return `<div class="cl-wrap">
    <div class="cl-accent-bar"></div>
    <div class="cl-hdr" style="position:relative;">
      <div>
        <div class="cl-name">${nameVal}</div>
        <div class="cl-adr">${esc(v('f-street'))}${v('f-street')&&v('f-city') ? ' · ' : ''}${esc(v('f-city'))}</div>
        ${dobEl}
      </div>
      ${cornerBox}
    </div>
    <div class="cl-divider"></div>
    <div class="cl-body">
      ${centerBox}
      <div class="cl-lbl">${esc(T('cvBewerbung'))}</div>
      <div class="cl-als">${esc(T('cvAls'))}</div>
      <div class="cl-job">${jobVal}</div>
      ${coVal}
    </div>
    <div class="cl-ftr">${telEl}${emlEl}${adEl}${qrEl}</div>
  </div>`;
}

/* ═══════════════════════════════════════════════
   MAIN RENDER  (called by lang.js too)
═══════════════════════════════════════════════ */
const RENDERERS = {
  classic: renderClassic,
  band:    renderBand,
  sidebar: renderSidebar,
  minimal: renderMinimal,
  elegant: renderElegant,
  modern:  renderModern,
  bold:    renderBold,
  clean:   renderClean,
};
const THEME_CLASS = {
  classic: 't-classic',
  band:    't-band',
  sidebar: 't-sidebar',
  minimal: 't-minimal',
  elegant: 't-elegant',
  modern:  't-modern',
  bold:    't-bold',
  clean:   't-clean',
};

function renderCover() {
  validateEmail();                                    /* FIX #4    */
  saveState();                                        /* FEATURE #6 */
  const cover = g('cover-page');
  cover.className = THEME_CLASS[theme] || 't-classic';
  cover.innerHTML = (RENDERERS[theme] || renderClassic)();

  /* FEATURE #7+12: CSS-Vars nach innerHTML-Reset neu setzen */
  cover.style.setProperty('--cv-accent', accentColor);
  cover.style.setProperty('--cv-dark',   darken(accentColor));
  if (FONT_MAP[coverFont]) cover.style.setProperty('--cv-font', FONT_MAP[coverFont]);

  setTimeout(buildQR,       50);
  setTimeout(scalePreview,  60);                      /* FEATURE #10 */
}

/* ═══════════════════════════════════════════════
   QR CODE
   FIX #1: target.innerHTML = '' vor jedem Neuzeichnen,
   damit QR-Codes sich nicht stapeln.
═══════════════════════════════════════════════ */
function buildQR() {
  if (!g('qr-on').checked) return;
  const url = v('f-qr');
  if (!url) return;
  const target = g('qr-target');
  if (!target) return;

  /* ── FIX: alten QR-Code entfernen ── */
  target.innerHTML = '';

  const colorMap = {
    classic: { dark: '#3d5c52', light: '#dde9e5' },
    band:    { dark: '#5a7a6e', light: '#f0f5f3' },
    sidebar: { dark: '#3d5c52', light: '#dde9e5' },
    minimal: { dark: '#5a7a6e', light: '#fafaf8' },
  };
  const c = colorMap[theme] || colorMap.classic;

  try {
    new QRCode(target, {
      text:         url,
      width:        58,
      height:       58,
      colorDark:    c.dark,
      colorLight:   c.light,
      correctLevel: QRCode.CorrectLevel.M,
    });
  } catch (e) { target.textContent = 'QR'; }
}

/* =================================================
   PDF EXPORT
   FIX #2 : try/finally garantiert Sidebar-Reset auch
            bei Fehler. Button-Lock verhindert Doppelklick.
   FEATURE #8: nutzt jetzt buildCoverCanvas() Hilfsfunktion
================================================= */
async function downloadPDF() {
  const cover  = g('cover-page');
  const pdfBtn = document.querySelector('.btn-pdf');

  /* Button sperren (Doppelklick-Schutz) */
  if (pdfBtn) { pdfBtn.disabled = true; pdfBtn.style.opacity = '0.6'; }

  try {
    const canvas = await buildCoverCanvas(cover);

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.97), 'JPEG', 0, 0, 210, 297);

    const filename = (v('f-name') || 'Deckblatt').replace(/\s+/g, '_') + '_Bewerbung.pdf';
    pdf.save(filename);

  } catch (err) {
    alert('PDF-Fehler: ' + err.message);

  } finally {
    if (pdfBtn) { pdfBtn.disabled = false; pdfBtn.style.opacity = ''; }
  }
}

/* =================================================
   FEATURE #10: Mobile Vorschau-Zoom
   Skaliert #cover-page so dass es immer in den
   verfuegbaren Bereich der .preview-area passt.
================================================= */
function scalePreview() {
  const cover   = g('cover-page');
  const preview = document.querySelector('.preview-area');
  if (!cover || !preview) return;

  const padding    = 48;                          /* 2rem × 2 */
  const available  = preview.clientWidth - padding;
  const coverWidth = 595;                         /* A4-Breite in px */

  const scale = available < coverWidth
    ? Math.max(0.3, available / coverWidth)       /* verkleinern */
    : 1;                                          /* nie vergroessern */

  cover.style.transform = scale < 1 ? `scale(${scale.toFixed(3)})` : '';

  /* preview-area Hoehe anpassen damit kein leerer Platz entsteht */
  if (scale < 1) {
    cover.style.marginBottom = `${Math.round(842 * (scale - 1))}px`;
  } else {
    cover.style.marginBottom = '';
  }
}

/* Bei Fenstergroessen-Aenderung neu berechnen */
window.addEventListener('resize', scalePreview);
async function buildCoverCanvas(cover) {
  /* Sidebar + Modern brauchen explizites Grid fuer html2canvas */
  const isSidebar = theme === 'sidebar';
  const isModern  = theme === 'modern';
  if (isSidebar) {
    cover.style.display = 'grid';
    cover.style.gridTemplateColumns = '185px 1fr';
  }
  if (isModern) {
    cover.style.display = 'grid';
    cover.style.gridTemplateColumns = '190px 1fr';
  }
  try {
    return await html2canvas(cover, {
      scale:           2.5,
      useCORS:         true,
      allowTaint:      true,
      backgroundColor: '#ffffff',
      logging:         false,
      width:  595,
      height: 842,
    });
  } finally {
    if (isSidebar || isModern) {
      cover.style.display = '';
      cover.style.gridTemplateColumns = '';
    }
  }
}

async function downloadPNG() {
  const cover  = g('cover-page');
  const pngBtn = document.querySelector('.btn-png');

  /* Button sperren (Doppelklick-Schutz) */
  if (pngBtn) { pngBtn.disabled = true; pngBtn.style.opacity = '0.6'; }

  try {
    const canvas   = await buildCoverCanvas(cover);
    const filename = (v('f-name') || 'Deckblatt').replace(/\s+/g, '_') + '_Bewerbung.png';

    /* Download via unsichtbaren Link */
    const link    = document.createElement('a');
    link.download = filename;
    link.href     = canvas.toDataURL('image/png');
    link.click();

  } catch (err) {
    alert('PNG-Fehler: ' + err.message);

  } finally {
    if (pngBtn) { pngBtn.disabled = false; pngBtn.style.opacity = ''; }
  }
}

/* =================================================
   BOOTSTRAP
   FIX #5  : Guard prueft ob lang.js geladen ist
   FEATURE #6: loadState stellt gespeicherte Daten
               wieder her bevor renderCover laeuft
================================================= */
(function bootstrap() {
  if (typeof T !== 'function' || typeof applyLang !== 'function') {
    console.error(
      '[Deckblatt Designer] lang.js wurde nicht geladen. ' +
      'Bitte sicherstellen, dass lang.js vor main.js eingebunden ist.'
    );
    const cover = document.getElementById('cover-page');
    if (cover) {
      cover.innerHTML =
        '<div style="padding:40px;color:#c0392b;font-family:sans-serif;">' +
        '⚠ Fehler: lang.js konnte nicht geladen werden.' +
        '</div>';
    }
    return;
  }

  /* loadState gibt true zurueck wenn applyLang renderCover schon aufrief */
  const alreadyRendered = loadState();

  /* FEATURE #9: Bewerbungsdatum auf heute setzen, wenn noch leer */
  const appdateEl = document.getElementById('f-appdate');
  if (appdateEl && !appdateEl.value) {
    const now = new Date();
    const dd  = String(now.getDate()).padStart(2,'0');
    const mm  = String(now.getMonth() + 1).padStart(2,'0');
    const yyyy = now.getFullYear();
    appdateEl.value = `${dd}.${mm}.${yyyy}`;
  }

  if (!alreadyRendered) renderCover();
})();

/* =================================================
   FEATURE #6 (extra): Alles zuruecksetzen
   Wird von index.html aufgerufen (Reset-Button)
================================================= */
function resetAll() {
  const msg = currentLang === 'ar'
    ? 'هل تريد حذف جميع البيانات؟'
    : currentLang === 'en'
      ? 'Reset all data? This cannot be undone.'
      : 'Alle Daten zurücksetzen? Das kann nicht rückgängig gemacht werden.';

  if (!confirm(msg)) return;

  try { localStorage.removeItem(LS_KEY); } catch (_) {}

  /* Felder leeren */
  SAVE_FIELDS.forEach(id => { const el = g(id); if (el) el.value = ''; });
  const qrOn = g('qr-on');
  if (qrOn) qrOn.checked = false;

  /* Foto entfernen */
  removePhoto();

  /* Theme und Frame auf Standard */
  theme = 'classic';
  frame = 'none';
  document.querySelectorAll('.tbtn').forEach(b =>
    b.classList.toggle('active', b.dataset.t === 'classic')
  );
  document.querySelectorAll('.chip').forEach(c =>
    c.classList.toggle('on', c.dataset.f === 'none')
  );

  /* Akzentfarbe zuruecksetzen (FEATURE #7) */
  setAccent('#5a7358', null);

  /* Foto-Filter zuruecksetzen (FEATURE #11) */
  photoFilter = 'none';
  document.querySelectorAll('[data-fi]').forEach(c =>
    c.classList.toggle('on', c.dataset.fi === 'none')
  );

  /* Schriftart zuruecksetzen (FEATURE #12) */
  setFont('playfair', null);

  renderCover();
}
