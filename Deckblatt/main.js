/* =====================================================
   main.js  –  Deckblatt Designer Logic
   Requires: lang.js  (T, currentLang, applyLang)
   ===================================================== */

/* ── State ─────────────────────────────────────── */
let theme     = 'classic';  // active theme key
let photoData = null;        // base64 uploaded photo
let frame     = 'none';      // active frame key

/* ── DOM helpers ───────────────────────────────── */
const g   = id => document.getElementById(id);
const v   = id => (g(id) ? g(id).value.trim() : '');
const esc = s  => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

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
function handleDrop(ev) {
  ev.preventDefault();
  g('photo-drop').style.borderColor = '';
  const file = ev.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    // simulate file-input change
    const dt = new DataTransfer();
    dt.items.add(file);
    g('photo-input').files = dt.files;
    loadPhoto({ target: { files: dt.files } });
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

  const inner = photoData
    ? `<img src="${photoData}" style="width:100%;height:100%;object-fit:cover;display:block;">`
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
    <div class="ftr">${telEl}${emlEl}${qrEl}</div>
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
    <div class="ftr">${telEl}${emlEl}${qrEl}</div>
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

  return `<div class="sd">
      ${pos === 'corner' ? `<div style="margin-bottom:14px;">${sideBox}</div>` : ''}
      <div class="sd-nm">${nameVal}</div>
      <div class="sd-adr">${esc(v('f-street'))}<br>${esc(v('f-city'))}</div>
      <div class="sd-div"></div>
      ${telEl}${emlEl}${qrEl}
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
    <div class="ftr">${telEl}${emlEl}${qrEl}</div>
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
};
const THEME_CLASS = {
  classic: 't-classic',
  band:    't-band',
  sidebar: 't-sidebar',
  minimal: 't-minimal',
};

function renderCover() {
  const cover = g('cover-page');
  cover.className = THEME_CLASS[theme] || 't-classic';
  cover.innerHTML = (RENDERERS[theme] || renderClassic)();
  setTimeout(buildQR, 50);
}

/* ═══════════════════════════════════════════════
   QR CODE
═══════════════════════════════════════════════ */
function buildQR() {
  if (!g('qr-on').checked) return;
  const url = v('f-qr');
  if (!url) return;
  const target = g('qr-target');
  if (!target) return;

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

/* ═══════════════════════════════════════════════
   PDF EXPORT
═══════════════════════════════════════════════ */
async function downloadPDF() {
  const cover = g('cover-page');

  /* Sidebar needs explicit grid for capture */
  if (theme === 'sidebar') {
    cover.style.display = 'grid';
    cover.style.gridTemplateColumns = '185px 1fr';
  }

  try {
    const canvas = await html2canvas(cover, {
      scale:           2.5,
      useCORS:         true,
      allowTaint:      true,
      backgroundColor: '#ffffff',
      logging:         false,
      width:  595,
      height: 842,
    });

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.97), 'JPEG', 0, 0, 210, 297);

    const filename = (v('f-name') || 'Deckblatt').replace(/\s+/g, '_') + '_Bewerbung.pdf';
    pdf.save(filename);
  } catch (err) {
    alert('PDF Error: ' + err.message);
  }

  /* Restore */
  if (theme === 'sidebar') {
    cover.style.display = '';
    cover.style.gridTemplateColumns = '';
  }
}

/* ═══════════════════════════════════════════════
   BOOTSTRAP
═══════════════════════════════════════════════ */
renderCover();
