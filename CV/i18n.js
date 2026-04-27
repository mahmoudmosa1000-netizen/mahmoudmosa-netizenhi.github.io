// ═══════════════════════════════════════════════
//  CV BUILDER — script.js
// ═══════════════════════════════════════════════

// ── STATE ──
let state = {
  color:    '#3b4f3a',
  font:     'Playfair Display',
  photoData: '',
  page2Entries: [],
  exp: [], edu: [], skills: [], langs: [],
  savedExp: [], savedEdu: [], savedSkills: [], savedLangs: []
};

let zoom = 1;
let expCount = 0, eduCount = 0, p2Count = 0;

const COLORS = [
  { val: '#2d3d2c' }, { val: '#1a3a5c' }, { val: '#5c2d2d' },
  { val: '#2d2d4a' }, { val: '#3d3020' }, { val: '#1a4040' },
  { val: '#4a3a1a' }, { val: '#2a2a2a' }, { val: '#8F9790' },
];

const FONTS = [
  { val: 'Playfair Display', label: 'Playfair',    subKey: 'fontClassic'     },
  { val: 'Georgia',           label: 'Georgia',     subKey: 'fontTraditional' },
  { val: '"Source Sans 3"',  label: 'Source Sans', subKey: 'fontModern'      },
  { val: 'Verdana',           label: 'Verdana',     subKey: 'fontClear'       },
];

// ─────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────
function init() {
  const isAr = currentLang === 'ar';
  document.documentElement.setAttribute('dir',  isAr ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', currentLang);
  buildColorPicker();
  buildFontPicker();
  loadSaved();
  buildDynamicLists();
  applyTranslations();
  render();
}

function buildColorPicker() {
  const wrap = document.getElementById('color-picker');
  COLORS.forEach(c => {
    const el = document.createElement('div');
    el.className = 'color-opt' + (state.color === c.val ? ' selected' : '');
    el.style.backgroundColor = c.val;
    el.onclick = () => {
      state.color = c.val;
      document.querySelectorAll('.color-opt').forEach(x => x.classList.remove('selected'));
      el.classList.add('selected');
      render();
    };
    wrap.appendChild(el);
  });
}

function buildFontPicker() {
  const wrap = document.getElementById('font-picker');
  wrap.innerHTML = '';
  FONTS.forEach(f => {
    const el = document.createElement('div');
    el.className = 'font-opt' + (state.font === f.val ? ' selected' : '');
    el.innerHTML = `<div class="font-opt-name" style="font-family:${f.val}">${f.label}</div>
                    <div class="font-opt-label">${t(f.subKey)}</div>`;
    el.onclick = () => {
      state.font = f.val;
      document.querySelectorAll('.font-opt').forEach(x => x.classList.remove('selected'));
      el.classList.add('selected');
      render();
    };
    wrap.appendChild(el);
  });
}

// ─────────────────────────────────────────────
//  TABS
// ─────────────────────────────────────────────
function switchTab(id, btn) {
  document.querySelectorAll('.etab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.epanel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('panel-' + id).classList.add('active');
}

// ─────────────────────────────────────────────
//  DYNAMIC ENTRY BUILDERS
// ─────────────────────────────────────────────
function addEntry(type, data = {}) {
  const id   = Date.now() + '_' + Math.random().toString(36).slice(2);
  const list = document.getElementById(type + '-list');
  const num  = type === 'exp' ? ++expCount : ++eduCount;
  const card = document.createElement('div');
  card.className = 'entry-card';
  card.id = type + '-' + id;

  if (type === 'exp') {
    card.innerHTML = `
      <div class="entry-card-header">
        <span class="entry-card-label">${t('entryExperience')} #${num}</span>
        <button class="btn-del" onclick="removeEntry('exp','${id}')">×</button>
      </div>
      <div class="form-group"><label>${t('labelJobTitle')}</label>
        <input type="text" id="exp-title-${id}" value="${esc(data.title||'')}" placeholder="${t('placeholderJobTitle')}" oninput="render()">
      </div>
      <div class="form-group"><label>${t('labelCompany')}</label>
        <input type="text" id="exp-company-${id}" value="${esc(data.company||'')}" placeholder="${t('placeholderCompany')}" oninput="render()">
      </div>
      <div class="form-row">
        <div class="form-group"><label>${t('labelFrom')}</label>
          <input type="text" id="exp-from-${id}" value="${esc(data.from||'')}" placeholder="${t('placeholderFrom')}" oninput="render()">
        </div>
        <div class="form-group"><label>${t('labelTo')}</label>
          <input type="text" id="exp-to-${id}" value="${esc(data.to||'')}" placeholder="${t('placeholderTo')}" oninput="render()">
        </div>
      </div>
      <div class="form-group"><label>${t('labelDesc')}</label>
        <textarea id="exp-desc-${id}" placeholder="${t('placeholderDesc')}" oninput="render()">${esc(data.desc||'')}</textarea>
      </div>`;
    state.exp.push(id);
  } else {
    card.innerHTML = `
      <div class="entry-card-header">
        <span class="entry-card-label">${t('entryEducation')} #${num}</span>
        <button class="btn-del" onclick="removeEntry('edu','${id}')">×</button>
      </div>
      <div class="form-group"><label>${t('labelDegree')}</label>
        <input type="text" id="edu-degree-${id}" value="${esc(data.degree||'')}" placeholder="${t('placeholderDegree')}" oninput="render()">
      </div>
      <div class="form-group"><label>${t('labelSchool')}</label>
        <input type="text" id="edu-school-${id}" value="${esc(data.school||'')}" placeholder="${t('placeholderSchool')}" oninput="render()">
      </div>
      <div class="form-row">
        <div class="form-group"><label>${t('labelFrom')}</label>
          <input type="text" id="edu-from-${id}" value="${esc(data.from||'')}" placeholder="${t('placeholderFrom')}" oninput="render()">
        </div>
        <div class="form-group"><label>${t('labelTo')}</label>
          <input type="text" id="edu-to-${id}" value="${esc(data.to||'')}" placeholder="${t('placeholderTo')}" oninput="render()">
        </div>
      </div>`;
    state.edu.push(id);
  }
  list.appendChild(card);
  render();
}

function removeEntry(type, id) {
  const el = document.getElementById(type + '-' + id);
  if (el) el.remove();
  state[type] = state[type].filter(x => x !== id);
  render();
}

function addSkill(data = {}) {
  const id   = Date.now() + '_' + Math.random().toString(36).slice(2);
  const card = document.createElement('div');
  card.className = 'entry-card';
  card.id = 'skill-' + id;
  card.innerHTML = `
    <div class="entry-card-header">
      <span class="entry-card-label">Skill</span>
      <button class="btn-del" onclick="removeSkill('${id}')">×</button>
    </div>
    <div class="form-row">
      <div class="form-group"><label>${t('labelSkillName')}</label>
        <input type="text" id="sk-name-${id}" value="${esc(data.name||'')}" placeholder="${t('placeholderSkill')}" oninput="render()">
      </div>
      <div class="form-group"><label>${t('labelSkillLevel')}</label>
        <input type="text" id="sk-pct-${id}" value="${data.pct||'50'}" placeholder="50" oninput="render()">
      </div>
    </div>`;
  document.getElementById('skill-list').appendChild(card);
  state.skills.push(id);
  render();
}

function removeSkill(id) {
  const el = document.getElementById('skill-' + id);
  if (el) el.remove();
  state.skills = state.skills.filter(x => x !== id);
  render();
}

function addLang(data = {}) {
  const id   = Date.now() + '_' + Math.random().toString(36).slice(2);
  const card = document.createElement('div');
  card.className = 'entry-card';
  card.id = 'lang-' + id;
  card.innerHTML = `
    <div class="entry-card-header">
      <span class="entry-card-label">${t('labelLangName')}</span>
      <button class="btn-del" onclick="removeLang('${id}')">×</button>
    </div>
    <div class="form-row">
      <div class="form-group"><label>${t('labelLangName')}</label>
        <input type="text" id="ln-name-${id}" value="${esc(data.name||'')}" placeholder="${t('placeholderLang')}" oninput="render()">
      </div>
      <div class="form-group"><label>${t('labelLangLevel')}</label>
        <select id="ln-lvl-${id}" onchange="render()">
          <option value="Muttersprache"   ${data.lvl==='Muttersprache'  ?'selected':''}>${t('optNative')}</option>
          <option value="Fortgeschritten" ${data.lvl==='Fortgeschritten'?'selected':''}>${t('optAdvanced')}</option>
          <option value="Mittelstufe"     ${data.lvl==='Mittelstufe'    ?'selected':''}>${t('optIntermediate')}</option>
          <option value="Grundkenntnisse" ${data.lvl==='Grundkenntnisse'?'selected':''}>${t('optBasic')}</option>
        </select>
      </div>
    </div>`;
  document.getElementById('lang-list').appendChild(card);
  state.langs.push(id);
  render();
}

function removeLang(id) {
  const el = document.getElementById('lang-' + id);
  if (el) el.remove();
  state.langs = state.langs.filter(x => x !== id);
  render();
}

function addPage2Entry(data = {}) {
  const id   = Date.now() + '_' + Math.random().toString(36).slice(2);
  const num  = ++p2Count;
  const card = document.createElement('div');
  card.className = 'entry-card';
  card.id = 'p2e-' + id;
  card.innerHTML = `
    <div class="entry-card-header">
      <span class="entry-card-label">${t('entryP2')} #${num}</span>
      <button class="btn-del" onclick="removePage2Entry('${id}')">×</button>
    </div>
    <div class="form-group"><label>${t('labelP2EntryTitle')}</label>
      <input type="text" id="p2e-title-${id}" value="${esc(data.title||'')}" placeholder="${t('placeholderP2Title2')}" oninput="render()">
    </div>
    <div class="form-group"><label>${t('labelP2Sub')}</label>
      <input type="text" id="p2e-sub-${id}" value="${esc(data.sub||'')}" placeholder="${t('placeholderP2Sub')}" oninput="render()">
    </div>
    <div class="form-group"><label>${t('labelP2Desc')}</label>
      <textarea id="p2e-desc-${id}" placeholder="${t('placeholderP2Desc')}" oninput="render()">${esc(data.desc||'')}</textarea>
    </div>`;
  document.getElementById('p2-entries-list').appendChild(card);
  state.page2Entries.push(id);
  render();
}

function removePage2Entry(id) {
  const el = document.getElementById('p2e-' + id);
  if (el) el.remove();
  state.page2Entries = state.page2Entries.filter(x => x !== id);
  render();
}

// ─────────────────────────────────────────────
//  RENDER CV
// ─────────────────────────────────────────────
function render() {
  const col      = state.color;
  const font     = state.font;
  const colLight = lighten(col, 0.55);
  const colDark2 = colLight2(col);

  const name     = val('f-name')     || (currentLang==='ar'?'اسمك':currentLang==='en'?'Your Name':'Dein Name');
  const role     = val('f-role')     || (currentLang==='ar'?'المسمى الوظيفي':currentLang==='en'?'Job Title':'Berufsbezeichnung');
  const email    = val('f-email');
  const phone    = val('f-phone');
  const address  = val('f-address');
  const birth    = val('f-birth');
  const web      = val('f-web');
  const webLabel = val('f-web-label') || 'Website';
  const summary  = val('f-summary');
  const goal     = val('f-goal');
  const komps    = val('f-komps');

  const photoSrc    = state.photoData || '';
  const photoShape  = (document.getElementById('f-photo-shape') ||{}).value || 'circle';
  const borderRadius = photoShape==='square' ? '10px' : '50%';
  const photoSize   = (document.getElementById('f-photo-size')  ||{}).value || '120';
  const borderSize  = (document.getElementById('f-border-size') ||{}).value || '4';
  const borderColor = (document.getElementById('f-border-color')||{}).value || 'rgba(255,255,255,0.9)';
  const px          = photoSize + 'px';
  const initials    = name.split(' ').map(w=>w[0]||'').slice(0,2).join('').toUpperCase();

  const avatarHTML = photoSrc
    ? `<img src="${photoSrc}"
        style="width:${px};height:${px};
               border-radius:${borderRadius};
               object-fit:cover;
               object-position:center top;
               border:${borderSize}px solid ${borderColor};
               display:block;
               box-shadow:0 4px 18px rgba(0,0,0,0.30);
               image-rendering:-webkit-optimize-contrast;
               image-rendering:crisp-edges;">`
    : `<div class="cv-avatar"
        style="width:${px};height:${px};
               background:linear-gradient(145deg,${colLight} 0%,${col} 100%);
               font-family:${font};
               border-radius:${borderRadius};
               border:${borderSize}px solid ${borderColor};
               font-size:${Math.round(parseInt(photoSize)*0.28)}px;
               box-shadow:0 4px 18px rgba(0,0,0,0.20);
               letter-spacing:1px;">
        ${initials||'CV'}
      </div>`;

  // ── LEFT ──
  let leftHTML = `
    <div class="cv-avatar-wrap">${avatarHTML}</div>
    <div class="cv-l-name" style="font-family:${font};">${h(name)}</div>
    <div class="cv-l-role">${h(role)}</div>
    <div class="cv-l-section">
      <div class="cv-l-section-title">${t('cvContact')}</div>
      ${email   ? `<div class="cv-contact-item"><span class="cv-contact-label">${t('cvEmail')}</span><span class="cv-contact-val">${h(email)}</span></div>` : ''}
      ${phone   ? `<div class="cv-contact-item"><span class="cv-contact-label">${t('cvPhone')}</span><span class="cv-contact-val">${h(phone)}</span></div>` : ''}
      ${address ? `<div class="cv-contact-item"><span class="cv-contact-label">${t('cvAddress')}</span><span class="cv-contact-val">${h(address)}</span></div>` : ''}
      ${birth   ? `<div class="cv-contact-item"><span class="cv-contact-label">${t('cvBirth')}</span><span class="cv-contact-val">${h(birth)}</span></div>` : ''}
      ${web ? (()=>{ const href=web.startsWith('http')?web:'https://'+web; return `<div class="cv-contact-item"><span class="cv-contact-label">${t('cvWeb')}</span><span class="cv-contact-val"><a href="${href}" target="_blank" style="color:inherit;text-decoration:underline;font-weight:700;">${h(webLabel)}</a></span></div>`; })() : ''}
    </div>`;

  const activeSkills = state.skills.filter(id => val('sk-name-'+id));
  if (activeSkills.length) {
    leftHTML += `<div class="cv-l-section"><div class="cv-l-section-title">${t('cvSkills')}</div>`;
    activeSkills.forEach(id => {
      const n = val('sk-name-'+id), p = Math.min(100,Math.max(0,parseInt(val('sk-pct-'+id))||50));
      leftHTML += `<div class="cv-skill-bar"><div class="cv-skill-name">${h(n)}</div><div class="cv-skill-track"><div class="cv-skill-fill" style="width:${p}%"></div></div></div>`;
    });
    leftHTML += `</div>`;
  }

  const activeLangs = state.langs.filter(id => val('ln-name-'+id));
  if (activeLangs.length) {
    leftHTML += `<div class="cv-l-section"><div class="cv-l-section-title">${t('cvLanguages')}</div>`;
    activeLangs.forEach(id => {
      const n = val('ln-name-'+id), lv = val('ln-lvl-'+id);
      const dots = {Muttersprache:5,Fortgeschritten:4,Mittelstufe:3,Grundkenntnisse:2}[lv]||3;
      const lvLabel = lv==='Muttersprache'?t('optNative'):lv==='Fortgeschritten'?t('optAdvanced'):lv==='Mittelstufe'?t('optIntermediate'):t('optBasic');
      let dotHtml=''; for(let i=0;i<5;i++) dotHtml+=`<div class="cv-lang-dot${i<dots?' on':''}"></div>`;
      leftHTML += `<div class="cv-lang-item"><div class="cv-lang-name">${h(n)}</div><div class="cv-lang-sub">${lvLabel}</div><div class="cv-lang-dots">${dotHtml}</div></div>`;
    });
    leftHTML += `</div>`;
  }

  // ── HOBBYS & FÜHRERSCHEIN → beide auf die rechte Seite ──
  const hobbies     = val('f-hobbies');
  const hobbiesSize = (document.getElementById('f-hobbies-size')||{}).value || '10';
  const LIC_CLASSES = ['AM','A1','A2','A','B','BE','C1','C1E','C','CE','D1','D','T','L'];
  const activeLic   = LIC_CLASSES.filter(c => { const el = document.getElementById('lic-'+c); return el && el.checked; });
  const licNote     = val('f-license-note');

  // ── RIGHT ──
  const webHref  = web ? (web.startsWith('http')?web:'https://'+web) : '#';
  const webLink  = web ? `<a href="${webHref}" target="_blank" style="color:${col};text-decoration:underline;font-weight:700;">${h(webLabel)}</a>` : h(webLabel);
  const renderTxt = txt => h(txt).replace(/%%WEBSITE%%/g, webLink);

  let rightHTML = `
    <div class="cv-r-name" style="font-family:${font};">${h(name)}</div>
    <div class="cv-r-role" style="color:${colDark2};">${h(role)}</div>
    <div class="cv-divider" style="background:linear-gradient(90deg,${col} 0%,${colLight} 60%,transparent 100%);"></div>`;

  if (summary||goal) {
    rightHTML += `<div class="cv-section-head" style="color:${col};">${t('cvProfile')}</div>`;
    if (summary) rightHTML += `<div class="cv-summary">${renderTxt(summary)}</div>`;
    if (goal)    rightHTML += `<div class="cv-summary" style="margin-top:6px;font-style:italic;color:#666;">${renderTxt(goal)}</div>`;
  }

  const expEntries = state.exp.map(id=>({title:val('exp-title-'+id),company:val('exp-company-'+id),from:val('exp-from-'+id),to:val('exp-to-'+id),desc:val('exp-desc-'+id)})).filter(e=>e.title||e.company);
  if (expEntries.length) {
    rightHTML += `<div class="cv-section-head" style="color:${col};">${t('cvExperience')}</div>`;
    expEntries.forEach(e => {
      rightHTML += `<div class="cv-entry" style="border-left-color:${colLight};">
        <div class="cv-entry-head"><span class="cv-entry-title">${h(e.title)}</span><span class="cv-entry-date" style="color:${colDark2};">${h(e.from)}${e.to?' – '+h(e.to):''}</span></div>
        ${e.company?`<div class="cv-entry-sub" style="color:${colDark2};">${h(e.company)}</div>`:''}
        ${e.desc?`<div class="cv-entry-desc">${h(e.desc).replace(/\n/g,'<br>')}</div>`:''}
      </div>`;
    });
  }

  const eduEntries = state.edu.map(id=>({degree:val('edu-degree-'+id),school:val('edu-school-'+id),from:val('edu-from-'+id),to:val('edu-to-'+id)})).filter(e=>e.degree||e.school);
  if (eduEntries.length) {
    rightHTML += `<div class="cv-section-head" style="color:${col};">${t('cvEducation')}</div>`;
    eduEntries.forEach(e => {
      rightHTML += `<div class="cv-entry" style="border-left-color:${colLight};">
        <div class="cv-entry-head"><span class="cv-entry-title">${h(e.degree)}</span><span class="cv-entry-date" style="color:${colDark2};">${h(e.from)}${e.to?' – '+h(e.to):''}</span></div>
        ${e.school?`<div class="cv-entry-sub" style="color:${colDark2};">${h(e.school)}</div>`:''}
      </div>`;
    });
  }

  // ── POSITIONS (links / rechts) ──
  const kompsPos   = (document.getElementById('f-komps-pos')  ||{}).value || 'right';
  const hobbiesPos = (document.getElementById('f-hobbies-pos')||{}).value || 'right';
  const licensePos = (document.getElementById('f-license-pos')||{}).value || 'right';

  // ── KOMPETENZEN ──
  if (komps.trim()) {
    if (kompsPos === 'right') {
      rightHTML += `<div class="cv-section-head" style="color:${col};">${t('cvKomps')}</div><div class="cv-komps">`;
      komps.split('\n').forEach(k => { if(k.trim()) rightHTML += `<div class="cv-komp" style="border-left-color:${colLight};">${h(k.trim())}</div>`; });
      rightHTML += `</div>`;
    } else {
      leftHTML += `<div class="cv-l-section"><div class="cv-l-section-title">${t('cvKomps')}</div>`;
      komps.split('\n').forEach(k => { if(k.trim()) leftHTML += `<span class="cv-tag">${h(k.trim())}</span>`; });
      leftHTML += `</div>`;
    }
  }

  // ── HOBBYS & INTERESSEN ──
  if (hobbies) {
    if (hobbiesPos === 'right') {
      rightHTML += `<div class="cv-section-head" style="color:${col};">${t('cvInterests')}</div>`;
      rightHTML += `<div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:4px;">`;
      hobbies.split(',').forEach(tag => {
        if (tag.trim()) rightHTML += `<span style="background:${colLight}22;border:1px solid ${colLight};border-radius:5px;padding:3px 10px;font-size:${hobbiesSize}px;color:#444;font-weight:500;">${h(tag.trim())}</span>`;
      });
      rightHTML += `</div>`;
    } else {
      leftHTML += `<div class="cv-l-section"><div class="cv-l-section-title">${t('cvInterests')}</div>`;
      hobbies.split(',').forEach(tag => {
        if (tag.trim()) leftHTML += `<span class="cv-tag" style="font-size:${hobbiesSize}px;">${h(tag.trim())}</span>`;
      });
      leftHTML += `</div>`;
    }
  }

  // ── ZUSÄTZLICHE QUALIFIKATIONEN — FÜHRERSCHEIN ──
  if (activeLic.length) {
    if (licensePos === 'right') {
      rightHTML += `<div class="cv-section-head" style="color:${col};">${t('cvExtraQual') || 'Zusätzliche Qualifikationen'}</div>`;
      rightHTML += `<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:4px;">
        <span style="font-size:11px;font-weight:600;color:#444;white-space:nowrap;">${t('cvLicense') || 'Führerschein'}:</span>
        <div style="display:flex;flex-wrap:wrap;gap:5px;">
          ${activeLic.map(c => `<span style="background:${col};color:#fff;border-radius:5px;padding:2px 9px;font-size:10.5px;font-weight:700;letter-spacing:0.04em;">${c}</span>`).join('')}
        </div>
      </div>`;
      if (licNote) rightHTML += `<div style="font-size:11px;color:#666;margin-top:3px;font-style:italic;">${h(licNote)}</div>`;
    } else {
      leftHTML += `<div class="cv-l-section"><div class="cv-l-section-title">${t('cvExtraQual')}</div>`;
      leftHTML += `<div style="display:flex;flex-wrap:wrap;gap:4px;">`;
      activeLic.forEach(c => {
        leftHTML += `<span style="background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.3);border-radius:4px;padding:2px 8px;font-size:10px;font-weight:700;color:#fff;">${c}</span>`;
      });
      leftHTML += `</div>`;
      if (licNote) leftHTML += `<div style="font-size:10px;opacity:0.65;margin-top:5px;">${h(licNote)}</div>`;
      leftHTML += `</div>`;
    }
  }

  const cvLeft = document.getElementById('cv-left');
  cvLeft.style.backgroundColor = col;
  cvLeft.style.color = '#fff';
  cvLeft.innerHTML = leftHTML;
  document.getElementById('cv-right').innerHTML = rightHTML;
  document.getElementById('cv-paper').style.fontFamily = '"Source Sans 3", sans-serif';

  // ── PAGE 2 ──
  const p2Title   = val('p2-title');
  const p2Free    = val('p2-freetext');
  const p2Entries = state.page2Entries.map(id=>({title:val('p2e-title-'+id),sub:val('p2e-sub-'+id),desc:val('p2e-desc-'+id)})).filter(e=>e.title||e.desc);
  const hasPage2  = p2Title||p2Free||p2Entries.length>0;
  const paper2    = document.getElementById('cv-paper-2');
  paper2.style.display = hasPage2 ? 'table' : 'none';

  if (hasPage2) {
    let left2 = `
      <div style="display:flex;justify-content:center;margin-bottom:1.5rem;">
        <div style="width:48px;height:48px;border-radius:50%;background-color:${colLight};display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:#fff;border:3px solid rgba(255,255,255,0.3);">${t('page2Circle')}</div>
      </div>
      <div style="text-align:center;font-weight:700;font-size:14px;margin-bottom:4px;">${h(name)}</div>
      <div style="text-align:center;font-size:9px;opacity:0.6;margin-bottom:2rem;">${h(role)}</div>
      <div style="font-size:8.5px;font-weight:700;opacity:0.55;border-bottom:1px solid rgba(255,255,255,0.12);padding-bottom:5px;margin-bottom:12px;">${t('cvContact')}</div>
      ${email?`<div style="margin-bottom:8px;"><span style="font-size:8.5px;font-weight:700;opacity:0.5;display:block;">${t('cvEmail')}</span><span style="font-size:11px;opacity:.85;">${h(email)}</span></div>`:''}
      ${phone?`<div style="margin-bottom:8px;"><span style="font-size:8.5px;font-weight:700;opacity:0.5;display:block;">${t('cvPhone')}</span><span style="font-size:11px;opacity:.85;">${h(phone)}</span></div>`:''}
      ${web?(()=>{const wh=web.startsWith('http')?web:'https://'+web;return `<div style="margin-bottom:8px;"><span style="font-size:8.5px;font-weight:700;opacity:0.5;display:block;">${t('cvWeb')}</span><a href="${wh}" target="_blank" style="font-size:11px;color:inherit;text-decoration:underline;font-weight:700;">${h(webLabel)}</a></div>`;})():''}`;

    let right2 = `
      <div style="font-size:22px;font-weight:700;color:#1e2e1d;margin-bottom:4px;font-family:${font};">${h(name)}</div>
      <div style="font-size:11px;color:${colDark2};margin-bottom:12px;font-weight:500;">${h(role)}</div>
      <div style="height:2px;margin-bottom:1.25rem;border-radius:1px;background:linear-gradient(90deg,${col} 0%,${colLight} 60%,transparent 100%);"></div>`;
    if (p2Title) right2 += `<div class="cv-section-head" style="color:${col};">${h(p2Title)}</div>`;
    p2Entries.forEach(e => {
      right2 += `<div class="cv-entry" style="border-left-color:${colLight};margin-bottom:12px;">
        <div class="cv-entry-head"><span class="cv-entry-title">${h(e.title)}</span></div>
        ${e.sub?`<div class="cv-entry-sub" style="color:${colDark2};">${h(e.sub)}</div>`:''}
        ${e.desc?`<div class="cv-entry-desc">${h(e.desc).replace(/\n/g,'<br>')}</div>`:''}
      </div>`;
    });
    if (p2Free) right2 += `<div style="font-size:11px;color:#555;line-height:1.75;margin-top:1rem;">${h(p2Free).replace(/\n/g,'<br>')}</div>`;

    const l2 = document.getElementById('cv-left-2');
    l2.style.backgroundColor = col; l2.style.color = '#fff'; l2.innerHTML = left2;
    document.getElementById('cv-right-2').innerHTML = right2;
    paper2.style.fontFamily = '"Source Sans 3", sans-serif';
  }
}

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────
function val(id)       { const el=document.getElementById(id); return el?el.value:''; }
function h(s)          { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function esc(s)        { return String(s||'').replace(/"/g,'&quot;'); }
function setVal(id, v) { const el=document.getElementById(id); if(el) el.value=v||''; }

function lighten(hex, amount) {
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return `rgb(${Math.round(r+(255-r)*amount)},${Math.round(g+(255-g)*amount)},${Math.round(b+(255-b)*amount)})`;
}
function colLight2(col) {
  const r=parseInt(col.slice(1,3),16),g=parseInt(col.slice(3,5),16),b=parseInt(col.slice(5,7),16);
  return `rgb(${Math.min(255,Math.round(r*1.8))},${Math.min(255,Math.round(g*1.8))},${Math.min(255,Math.round(b*1.8))})`;
}

// ─────────────────────────────────────────────
//  ZOOM
// ─────────────────────────────────────────────
function changeZoom(delta) {
  zoom = Math.min(1.4, Math.max(0.5, zoom+delta));
  document.getElementById('cv-paper').style.transform = `scale(${zoom})`;
  const p2=document.getElementById('cv-paper-2'); if(p2) p2.style.transform=`scale(${zoom})`;
  document.getElementById('zoom-label').textContent = Math.round(zoom*100)+'%';
  document.getElementById('preview-area').style.paddingBottom = zoom>1?`${(zoom-1)*1000+80}px`:'2rem';
}

// ─────────────────────────────────────────────
//  SAVE / LOAD
// ─────────────────────────────────────────────
function saveData() {
  const data = {
    name:val('f-name'),role:val('f-role'),email:val('f-email'),phone:val('f-phone'),
    address:val('f-address'),birth:val('f-birth'),web:val('f-web'),webLabel:val('f-web-label'),
    summary:val('f-summary'),goal:val('f-goal'),komps:val('f-komps'),hobbies:val('f-hobbies'),
    kompsPos:val('f-komps-pos')||'right', hobbiesPos:val('f-hobbies-pos')||'right', licensePos:val('f-license-pos')||'right',
    color:state.color,font:state.font,photoData:state.photoData,
    license: ['AM','A1','A2','A','B','BE','C1','C1E','C','CE','D1','D','T','L'].filter(c=>{ const el=document.getElementById('lic-'+c); return el&&el.checked; }),
    licenseNote: val('f-license-note'),
    exp:   state.exp.map(id=>({id,title:val('exp-title-'+id),company:val('exp-company-'+id),from:val('exp-from-'+id),to:val('exp-to-'+id),desc:val('exp-desc-'+id)})),
    edu:   state.edu.map(id=>({id,degree:val('edu-degree-'+id),school:val('edu-school-'+id),from:val('edu-from-'+id),to:val('edu-to-'+id)})),
    skills:state.skills.map(id=>({id,name:val('sk-name-'+id),pct:val('sk-pct-'+id)})),
    langs: state.langs.map(id=>({id,name:val('ln-name-'+id),lvl:val('ln-lvl-'+id)})),
  };
  localStorage.setItem('cvbuilder_data', JSON.stringify(data));
  showToast(t('toastSaved'));
}

function loadSaved() {
  const raw = localStorage.getItem('cvbuilder_data');
  if (!raw) return loadDefaults();
  try {
    const d = JSON.parse(raw);
    setVal('f-name',d.name); setVal('f-role',d.role); setVal('f-email',d.email); setVal('f-phone',d.phone);
    setVal('f-address',d.address); setVal('f-birth',d.birth); setVal('f-web',d.web); setVal('f-web-label',d.webLabel||'Website');
    setVal('f-summary',d.summary); setVal('f-goal',d.goal); setVal('f-komps',d.komps); setVal('f-hobbies',d.hobbies);
    if (d.color) state.color=d.color;
    if (d.font)  state.font=d.font;
    if (d.license && Array.isArray(d.license)) {
      d.license.forEach(c => { const el=document.getElementById('lic-'+c); if(el) el.checked=true; });
    }
    if (d.licenseNote) setVal('f-license-note', d.licenseNote);
    if (d.kompsPos)   setVal('f-komps-pos',   d.kompsPos);
    if (d.hobbiesPos) setVal('f-hobbies-pos', d.hobbiesPos);
    if (d.licensePos) setVal('f-license-pos', d.licensePos);
    if (d.photoData) {
      state.photoData=d.photoData;
      document.getElementById('photo-preview-img').src=d.photoData;
      document.getElementById('photo-preview-name').textContent=t('photoShown');
      document.getElementById('photo-drop-zone').style.display='none';
      document.getElementById('photo-preview-section').style.display='block';
    }
    state.savedExp=d.exp||[]; state.savedEdu=d.edu||[]; state.savedSkills=d.skills||[]; state.savedLangs=d.langs||[];
  } catch(e) { loadDefaults(); }
}

function buildDynamicLists() {
  (state.savedExp||[]).forEach(e=>addEntry('exp',e));
  (state.savedEdu||[]).forEach(e=>addEntry('edu',e));
  (state.savedSkills||[{name:'HTML & CSS',pct:'40'},{name:'Python',pct:'30'},{name:'Problemlösung',pct:'80'}]).forEach(s=>addSkill(s));
  (state.savedLangs ||[{name:'العربية / Arabisch / Arabic',lvl:'Muttersprache'},{name:'Deutsch / German',lvl:'Fortgeschritten'},{name:'Englisch / English',lvl:'Fortgeschritten'}]).forEach(l=>addLang(l));
}

function loadDefaults() {
  ['f-name','f-role','f-email','f-phone','f-address','f-birth','f-summary','f-goal','f-komps','f-hobbies','f-web'].forEach(id=>setVal(id,''));
  setVal('f-web-label','Website');
}

function resetAll() {
  if (!confirm(t('toastResetConfirm'))) return;
  localStorage.removeItem('cvbuilder_data');
  location.reload();
}

// ─────────────────────────────────────────────
//  PDF EXPORT
// ─────────────────────────────────────────────
function exportPDF() { window.print(); }

function downloadPDF() {
  const name     = val('f-name') || 'CV';
  const filename = name.replace(/\s+/g,'_') + '_CV.pdf';
  showToast(t('toastPDFBuilding'));

  const pages = [{
    paperId:'cv-paper',   leftId:'cv-left',
    paper:document.getElementById('cv-paper'),
    left: document.getElementById('cv-left'),
    right:document.getElementById('cv-right'),
  }];
  const p2el = document.getElementById('cv-paper-2');
  if (p2el && p2el.style.display!=='none') pages.push({
    paperId:'cv-paper-2', leftId:'cv-left-2',
    paper:p2el,
    left: document.getElementById('cv-left-2'),
    right:document.getElementById('cv-right-2'),
  });

  // Reset zoom to scale(1) for accurate pixel measurements
  const savedT = pages.map(p => {
    const saved = p.paper.style.transform;
    p.paper.style.transform = 'scale(1)';
    p.paper.style.transformOrigin = 'top center';
    return saved;
  });

  // Helper: get element offset relative to an ancestor (scroll-safe)
  function offsetRelativeTo(el, ancestor) {
    let x = 0, y = 0, cur = el;
    while (cur && cur !== ancestor) { x += cur.offsetLeft; y += cur.offsetTop; cur = cur.offsetParent; }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight };
  }

  // Two frames so browser fully repaints at scale(1) before we measure
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const heights = pages.map(p =>
      Math.max(p.paper.offsetHeight, p.left.scrollHeight, p.right.scrollHeight, 1050)
    );
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
    const pW = 210, pH = 297;

    const next = i => {
      if (i >= pages.length) {
        pages.forEach((p,idx) => { p.paper.style.transform = savedT[idx]; });
        pdf.save(filename);
        showToast(t('toastPDFDone'));
        return;
      }
      const pg = pages[i], fullH = heights[i], col = state.color;
      const paperPxW = pg.paper.offsetWidth || 720;

      // Collect links BEFORE capture (at scale 1, scroll-independent)
      const rawLinks = [];
      pg.paper.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        const pos = offsetRelativeTo(link, pg.paper);
        rawLinks.push({ url:href, xPx:pos.x, yPx:pos.y,
          wPx:Math.max(pos.w, 60), hPx:Math.max(pos.h, 14) });
      });

      html2canvas(pg.paper, {
        scale: 4,            // ← 4× for crystal-clear PDF output
        useCORS: true, allowTaint: true,
        backgroundColor: '#ffffff', logging: false,
        onclone: doc => {
          const cP = doc.getElementById(pg.paperId);
          const cL = doc.getElementById(pg.leftId);
          if (cP) { cP.style.display='table'; cP.style.minHeight=fullH+'px'; cP.style.height=fullH+'px'; }
          if (cL) { cL.style.display='table-cell'; cL.style.height=fullH+'px'; cL.style.minHeight=fullH+'px'; cL.style.backgroundColor=col; cL.style.background=col; }
        },
      }).then(canvas => {
        if (i > 0) pdf.addPage();
        const firstPage = pdf.getNumberOfPages();
        const imgH = (canvas.height * pW) / canvas.width;

        // Insert image across as many PDF pages as needed
        let posY = 0, rem = imgH, isFirst = true;
        while (rem > 0) {
          if (!isFirst) pdf.addPage();
          pdf.addImage(canvas.toDataURL('image/jpeg', 0.98), 'JPEG', 0, -posY, pW, imgH);
          posY += pH; rem -= pH; isFirst = false;
        }

        // Overlay invisible clickable link annotations
        const mmPerPxX = pW   / paperPxW;
        const mmPerPxY = imgH / fullH;
        rawLinks.forEach(({ url, xPx, yPx, wPx, hPx }) => {
          const xMM = xPx * mmPerPxX;
          const yMM = yPx * mmPerPxY;
          const wMM = wPx * mmPerPxX;
          const hMM = hPx * mmPerPxY;
          const pageIdx   = Math.floor(yMM / pH);
          const yOnPage   = yMM - pageIdx * pH;
          const targetPg  = firstPage + pageIdx;
          if (targetPg <= pdf.getNumberOfPages()) {
            pdf.setPage(targetPg);
            pdf.link(xMM, yOnPage, wMM, hMM, { url });
          }
        });
        pdf.setPage(pdf.getNumberOfPages());
        next(i + 1);
      }).catch(err => {
        console.error(err);
        showToast(t('toastPDFError'));
        pages.forEach((p,idx) => { p.paper.style.transform = savedT[idx]; });
      });
    };
    next(0);
  }));
}

// ─────────────────────────────────────────────
//  TOAST
// ─────────────────────────────────────────────
function showToast(msg) {
  let el=document.getElementById('toast');
  if (!el) { el=document.createElement('div'); el.id='toast'; Object.assign(el.style,{position:'fixed',bottom:'1.5rem',right:'1.5rem',background:'#2d3d2c',color:'#fff',padding:'10px 20px',borderRadius:'8px',fontSize:'13px',fontWeight:'600',zIndex:'9999',transition:'opacity 0.3s'}); document.body.appendChild(el); }
  el.textContent=msg; el.style.opacity='1';
  clearTimeout(el._to); el._to=setTimeout(()=>el.style.opacity='0',2400);
}

// ─────────────────────────────────────────────
//  PHOTO
// ─────────────────────────────────────────────
function handlePhotoUpload(e) { const f=e.target.files[0]; if(f) readPhoto(f); }
function handleDrop(e) {
  e.preventDefault(); document.getElementById('photo-drop-zone').style.borderColor='';
  const f=e.dataTransfer.files[0]; if(f&&f.type.startsWith('image/')) readPhoto(f);
}
function readPhoto(file) {
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      // ── Process at high resolution for maximum sharpness ──
      // We store a 600×600 pre-cropped version so the CV photo
      // always looks crisp regardless of the original file size.
      const SIZE = 600;
      const canvas = document.createElement('canvas');
      canvas.width  = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext('2d');

      // Enable best-quality downsampling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Smart crop: fit the largest square centred horizontally,
      // biased toward the top third of the image (where faces usually are).
      const scale = Math.max(SIZE / img.width, SIZE / img.height);
      const cropW = SIZE / scale;
      const cropH = SIZE / scale;
      const cropX = (img.width  - cropW) / 2;             // centre X
      const cropY = Math.max(0, (img.height - cropH) * 0.25); // bias to top

      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, SIZE, SIZE);

      // Save as high-quality JPEG (0.95 = very sharp, reasonable file size)
      state.photoData = canvas.toDataURL('image/jpeg', 0.95);

      document.getElementById('photo-preview-img').src          = state.photoData;
      document.getElementById('photo-preview-name').textContent  = file.name;
      document.getElementById('photo-drop-zone').style.display    = 'none';
      document.getElementById('photo-preview-section').style.display = 'block';
      render();
      showToast(t('toastPhotoUploaded'));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}
function removePhoto() {
  state.photoData=''; document.getElementById('photo-input').value=''; document.getElementById('photo-preview-img').src='';
  document.getElementById('photo-drop-zone').style.display='block'; document.getElementById('photo-preview-section').style.display='none';
  render();
}

// ─────────────────────────────────────────────
//  START
// ─────────────────────────────────────────────
init();
