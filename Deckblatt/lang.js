/* =====================================================
   lang.js  –  Deckblatt Designer Translations
   Languages: Deutsch (de) · English (en) · عربي (ar)
   ===================================================== */

const TRANSLATIONS = {

  /* ── DEUTSCH ──────────────────────────────────── */
  de: {
    dir: 'ltr',
    pageTitle: 'Deckblatt Designer',

    /* Top bar */
    toolTitle: 'DECKBLATT',
    toolTitleSpan: 'DESIGNER',
    toolSub: 'Professionelles Bewerbungsdeckblatt',
    btnPdf:       '⬇ Als PDF speichern',
    btnPng:       '🖼 Als PNG speichern',
    btnPrint:     '🖨 Drucken',
    lZoom:        'Zoom',
    zoomReset:    '↺',
    lFilename:    'Dateiname (ohne Endung)',
    pFilename:    'Bewerbung_Muster',
    toastPdf:     '⏳ PDF wird erstellt…',
    toastPng:     '⏳ PNG wird erstellt…',
    toastDone:    '✅ Gespeichert!',

    /* Section headings */
    secTemplate:  'Design-Vorlage',
    secPersonal:  'Persönliche Daten',
    secJob:       'Bewerbung',
    secPhoto:     'Bewerbungsfoto',
    secPhotoOpts: 'Foto-Einstellungen',
    secFrame:     'Rahmen-Stil',
    secQr:        'QR-Code',

    /* Field labels */
    lAnrede:  'Anrede',
    anredeNone:  '—',
    anredeHerr:  'Herr',
    anredeFrau:  'Frau',
    anredeDivers:'Divers',
    lTitel:   'Titel (optional)',
    pTitel:   'Dr., Prof., M.Sc.',
    lName:    'Vollständiger Name',
    lStreet:  'Straße & Hausnummer',
    lCity:    'PLZ & Ort',
    lPhone:   'Telefon',
    lEmail:   'E-Mail',
    lLinkedin:'LinkedIn-URL (optional)',
    pLinkedin:'linkedin.com/in/...',
    lDob:     'Geburtsdatum (optional)',
    lJob:     'Ich bewerbe mich als',
    lCompany: 'Bei Unternehmen (optional)',
    lKennziffer:'Stellenkennziffer (optional)',
    pKennziffer:'z.B. REF-2025-042',
    cvKennziffer:'Kennziffer:',
    cvLinkedin: 'LinkedIn:',
    lAppDate: 'Bewerbungsdatum',
    lPos:     'Foto-Position',
    lShape:   'Foto-Form',
    lSize:    'Foto-Größe',
    lQrShow:  'QR-Code anzeigen',
    lQrUrl:   'URL / LinkedIn / Portfolio',
    lNote:    'Alle Daten bleiben lokal. Kein Server, kein Upload.',

    /* Placeholders */
    pName:    'Vor- und Nachname',
    pStreet:  'Musterstraße 12',
    pCity:    '12345 Musterstadt',
    pPhone:   '0157 ...',
    pEmail:   'name@email.de',
    pDob:     'TT.MM.JJJJ',
    pJob:     'z.B. Fachinformatiker',
    pCompany: 'z.B. Siemens AG',
    pAppDate: 'TT.MM.JJJJ',
    pQr:      'https://linkedin.com/in/...',

    /* Photo button */
    btnUpload: '📷 Foto hochladen (JPG, PNG, WEBP)',
    btnRemove: '🗑 Entfernen',

    /* Theme names */
    tClassic: 'Classic',
    tBand:    'Header-Band',
    tSidebar: 'Sidebar',
    tMinimal: 'Minimal',
    tElegant: 'Elegant',
    tModern:  'Modern',
    tBold:    'Bold',
    tClean:   'Clean',

    /* Position options */
    posCorner: 'Ecke oben rechts',
    posCenter: 'Mittig zentriert',
    posNone:   'Kein Foto anzeigen',

    /* Shape options */
    shRect:   'Rechteckig',
    shRound:  'Abgerundet',
    shCircle: 'Rund (Kreis)',

    /* Frame chips */
    frNone:   'Kein',
    frThinW:  'Dünn Weiß',
    frThickW: 'Dick Weiß',
    frSage:   'Salbei',
    frDark:   'Dunkel',
    frShadow: 'Schatten',

    /* Cover content (printed on the page) */
    cvBewerbung: 'BEWERBUNG',
    cvAls:       'als',
    cvBei:       'bei',
    cvTelLabel:  'Telefon:',
    cvFoto:      'Bewerbungsfoto',
    cvTel:       'Telefon',
    cvEmail:     'E-Mail',
    cvDob:       'Geburtsdatum:',
    cvAppDate:   'Datum:',

  },

  /* ── ENGLISH ──────────────────────────────────── */
  en: {
    dir: 'ltr',
    pageTitle: 'Cover Page Designer',

    toolTitle:    'COVER PAGE',
    toolTitleSpan:'DESIGNER',
    toolSub:      'Professional Application Cover Page',
    btnPdf:       '⬇ Save as PDF',
    btnPng:       '🖼 Save as PNG',
    btnPrint:     '🖨 Print',
    lZoom:        'Zoom',
    zoomReset:    '↺',
    lFilename:    'File name (no extension)',
    pFilename:    'Application_Sample',
    toastPdf:     '⏳ Creating PDF…',
    toastPng:     '⏳ Creating PNG…',
    toastDone:    '✅ Saved!',

    secTemplate:  'Design Template',
    secPersonal:  'Personal Information',
    secJob:       'Application',
    secPhoto:     'Profile Photo',
    secPhotoOpts: 'Photo Settings',
    secFrame:     'Frame Style',
    secQr:        'QR Code',

    lAnrede:  'Salutation',
    anredeNone:  '—',
    anredeHerr:  'Mr.',
    anredeFrau:  'Ms.',
    anredeDivers:'Mx.',
    lTitel:   'Title (optional)',
    pTitel:   'Dr., Prof., M.Sc.',
    lName:    'Full Name',
    lStreet:  'Street & House Number',
    lCity:    'ZIP Code & City',
    lPhone:   'Phone',
    lEmail:   'E-Mail',
    lLinkedin:'LinkedIn URL (optional)',
    pLinkedin:'linkedin.com/in/...',
    lDob:     'Date of Birth (optional)',
    lJob:     'I am applying for',
    lCompany: 'At company (optional)',
    lKennziffer:'Job Reference No. (optional)',
    pKennziffer:'e.g. REF-2025-042',
    cvKennziffer:'Ref.:',
    cvLinkedin: 'LinkedIn:',
    lAppDate: 'Application Date',
    lPos:     'Photo Position',
    lShape:   'Photo Shape',
    lSize:    'Photo Size',
    lQrShow:  'Show QR Code',
    lQrUrl:   'URL / LinkedIn / Portfolio',
    lNote:    'All data stays local. No server, no upload.',

    pName:    'First and Last Name',
    pStreet:  'Main Street 12',
    pCity:    '12345 Your City',
    pPhone:   '+49 157 ...',
    pEmail:   'name@email.com',
    pDob:     'DD.MM.YYYY',
    pJob:     'e.g. IT Specialist',
    pCompany: 'e.g. Company Inc.',
    pAppDate: 'DD.MM.YYYY',
    pQr:      'https://linkedin.com/in/...',

    btnUpload: '📷 Upload Photo (JPG, PNG, WEBP)',
    btnRemove: '🗑 Remove',

    tClassic: 'Classic',
    tBand:    'Header Band',
    tSidebar: 'Sidebar',
    tMinimal: 'Minimal',
    tElegant: 'Elegant',
    tModern:  'Modern',
    tBold:    'Bold',
    tClean:   'Clean',

    posCorner: 'Top right corner',
    posCenter: 'Centered',
    posNone:   'No photo',

    shRect:   'Rectangle',
    shRound:  'Rounded',
    shCircle: 'Circle',

    frNone:   'None',
    frThinW:  'Thin White',
    frThickW: 'Thick White',
    frSage:   'Sage',
    frDark:   'Dark',
    frShadow: 'Shadow',

    cvBewerbung: 'APPLICATION',
    cvAls:       'for',
    cvBei:       'at',
    cvTelLabel:  'Phone:',
    cvFoto:      'Profile Photo',
    cvTel:       'Phone',
    cvEmail:     'E-Mail',
    cvDob:       'Date of Birth:',
    cvAppDate:   'Date:',

  },

  /* ── ARABIC / عربي ────────────────────────────── */
  ar: {
    dir: 'rtl',
    pageTitle: 'مصمم صفحة الغلاف',

    toolTitle:    'مصمم',
    toolTitleSpan:'صفحة الغلاف',
    toolSub:      'صفحة غلاف احترافية لطلب التوظيف',
    btnPdf:       '⬇ حفظ كـ PDF',
    btnPng:       '🖼 حفظ كـ PNG',
    btnPrint:     '🖨 طباعة',
    lZoom:        'تكبير',
    zoomReset:    '↺',
    lFilename:    'اسم الملف (بدون امتداد)',
    pFilename:    'طلب_توظيف',
    toastPdf:     '⏳ جارٍ إنشاء PDF…',
    toastPng:     '⏳ جارٍ إنشاء PNG…',
    toastDone:    '✅ تم الحفظ!',

    secTemplate:  'قالب التصميم',
    secPersonal:  'البيانات الشخصية',
    secJob:       'طلب التوظيف',
    secPhoto:     'الصورة الشخصية',
    secPhotoOpts: 'إعدادات الصورة',
    secFrame:     'نمط الإطار',
    secQr:        'رمز QR',

    lAnrede:  'اللقب',
    anredeNone:  '—',
    anredeHerr:  'السيد',
    anredeFrau:  'السيدة',
    anredeDivers:'أخرى',
    lTitel:   'اللقب الأكاديمي (اختياري)',
    pTitel:   'د., أ., ماجستير',
    lName:    'الاسم الكامل',
    lStreet:  'الشارع ورقم المنزل',
    lCity:    'الرمز البريدي والمدينة',
    lPhone:   'رقم الهاتف',
    lEmail:   'البريد الإلكتروني',
    lLinkedin:'رابط LinkedIn (اختياري)',
    pLinkedin:'linkedin.com/in/...',
    lDob:     'تاريخ الميلاد (اختياري)',
    lJob:     'أتقدم لوظيفة',
    lCompany: 'في شركة (اختياري)',
    lKennziffer:'رقم المرجع (اختياري)',
    pKennziffer:'مثال: REF-2025-042',
    cvKennziffer:'المرجع:',
    cvLinkedin: 'LinkedIn:',
    lAppDate: 'تاريخ الطلب',
    lPos:     'موضع الصورة',
    lShape:   'شكل الصورة',
    lSize:    'حجم الصورة',
    lQrShow:  'عرض رمز QR',
    lQrUrl:   'الرابط / LinkedIn / المحفظة',
    lNote:    'جميع البيانات تبقى محلية. لا خادم، لا رفع.',

    pName:    'الاسم الأول والأخير',
    pStreet:  'اسم الشارع 12',
    pCity:    'الرمز البريدي والمدينة',
    pPhone:   '+49 157 ...',
    pEmail:   'name@email.com',
    pDob:     'يوم/شهر/سنة',
    pJob:     'مثال: مختص تقنية المعلومات',
    pCompany: 'مثال: شركة سيمنز',
    pAppDate: 'يوم/شهر/سنة',
    pQr:      'https://linkedin.com/in/...',

    btnUpload: '📷 رفع صورة (JPG, PNG, WEBP)',
    btnRemove: '🗑 إزالة',

    tClassic: 'كلاسيك',
    tBand:    'شريط علوي',
    tSidebar: 'شريط جانبي',
    tMinimal: 'بسيط',
    tElegant: 'أنيق',
    tModern:  'عصري',
    tBold:    'جريء',
    tClean:   'نظيف',

    posCorner: 'الزاوية العلوية اليمنى',
    posCenter: 'في المنتصف',
    posNone:   'بدون صورة',

    shRect:   'مستطيل',
    shRound:  'حواف منحنية',
    shCircle: 'دائري',

    frNone:   'بلا إطار',
    frThinW:  'أبيض رفيع',
    frThickW: 'أبيض سميك',
    frSage:   'أخضر',
    frDark:   'داكن',
    frShadow: 'ظل',

    cvBewerbung: 'طلب توظيف',
    cvAls:       'لوظيفة',
    cvBei:       'في',
    cvTelLabel:  'هاتف:',
    cvFoto:      'الصورة الشخصية',
    cvTel:       'هاتف',
    cvEmail:     'بريد إلكتروني',
    cvDob:       'تاريخ الميلاد:',
    cvAppDate:   'التاريخ:',
    btnReset:    '🗑 إعادة تعيين الكل',
    secAccent:   'لون التمييز',
    lCustomColor:'مخصص:',
    secFilter:   'فلتر الصورة',
    fiNone:      'عادي',
    fiBw:        'أبيض وأسود',
    fiSepia:     'سيبيا',
    secFont:     'الخط',
    fnPlayfair:  'Playfair',
    fnSource:    'Source Sans',
    fnCormorant: 'Cormorant',
    lAnrede:     'اللقب',
    anredeNone:  '—',
    anredeHerr:  'السيد',
    anredeFrau:  'السيدة',
    anredeDivers:'أخرى',
    lTitel:      'اللقب الأكاديمي (اختياري)',
    pTitel:      'د., أ., ماجستير',
    lLinkedin:   'رابط LinkedIn (اختياري)',
    pLinkedin:   'linkedin.com/in/...',
    lKennziffer: 'رقم المرجع (اختياري)',
    pKennziffer: 'مثال: REF-2025-042',
    cvKennziffer:'المرجع:',
    cvLinkedin:  'LinkedIn:',
    lDob:        'تاريخ الميلاد (اختياري)',
    pDob:        'يوم/شهر/سنة',
    lAppDate:    'تاريخ الطلب',
    pAppDate:    'يوم/شهر/سنة',
    btnPrint:    '🖨 طباعة',
    lZoom:       'تكبير',
    zoomReset:   '↺',
    lFilename:   'اسم الملف (بدون امتداد)',
    pFilename:   'طلب_توظيف',
    toastPdf:    '⏳ جارٍ إنشاء PDF…',
    toastPng:    '⏳ جارٍ إنشاء PNG…',
    toastDone:   '✅ تم الحفظ!',
  },
};

/* ── Active language ───────────────────────────── */
let currentLang = 'de';

function T(key) {
  const lx = TRANSLATIONS[currentLang];
  return (lx && lx[key] !== undefined) ? lx[key] : (TRANSLATIONS.de[key] || key);
}

/* ── Apply language to DOM ─────────────────────── */
function applyLang(code) {
  if (!TRANSLATIONS[code]) return;
  currentLang = code;

  const tx = TRANSLATIONS[code];

  /* direction + lang attribute */
  document.documentElement.lang = code;
  document.documentElement.dir  = tx.dir;

  /* page title */
  document.title = tx.pageTitle;

  /* all [data-i18n] text nodes */
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (tx[key] !== undefined) el.textContent = tx[key];
  });

  /* all [data-ph] placeholder attributes */
  document.querySelectorAll('[data-ph]').forEach(el => {
    const key = el.dataset.ph;
    if (tx[key] !== undefined) el.placeholder = tx[key];
  });

  /* select options that carry data-i18n */
  document.querySelectorAll('option[data-i18n]').forEach(opt => {
    const key = opt.dataset.i18n;
    if (tx[key] !== undefined) opt.textContent = tx[key];
  });

  /* language switcher active state */
  document.querySelectorAll('.lang-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.lang === code)
  );

  /* re-render preview so cover text updates */
  if (typeof renderCover === 'function') renderCover();
}
