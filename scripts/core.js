/* =====================================================================
   CORE — shared helpers, photo mapping and data logic.
   ===================================================================== */
(function () {
  const IB = window.IB;
  IB.components = IB.components || {};
  IB.ui = IB.ui || {};

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const MON3 = MONTHS.map(m => m.slice(0, 3).toLowerCase());
  IB.MONTHS = MONTHS;

  IB.esc = s => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const WORDS = ['no','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];
  IB.numWord = n => (n >= 0 && n < WORDS.length ? WORDS[n] : String(n));
  IB.cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  IB.plural = (n, one, many) => n === 1 ? one : (many || one + 's');

  /* ---------- Dates ---------- */
  // 'DD-Mon-YY' → { day, month (1–12), year (4-digit, logic only) }
  IB.parseDOB = function (str) {
    if (!str) return null;
    const m = /^(\d{1,2})-([A-Za-z]{3})-(\d{2})$/.exec(String(str).trim());
    if (!m) return null;
    const month = MON3.indexOf(m[2].toLowerCase()) + 1;
    if (!month) return null;
    const yy = +m[3];
    const nowYY = new Date().getFullYear() % 100;
    return { day: +m[1], month, year: yy <= nowYY ? 2000 + yy : 1900 + yy };
  };

  IB.parseISO = function (str) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str || '');
    return m ? { year: +m[1], month: +m[2], day: +m[3] } : null;
  };

  // "Today", overridable for testing with ?date=YYYY-MM-DD
  IB.today = function () {
    const q = new URLSearchParams(location.search).get('date');
    const p = IB.parseISO(q);
    if (p) return p;
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
  };

  IB.daysInMonth = (y, m) => new Date(y, m, 0).getDate();
  IB.formatDayMonth = (day, month) => day + ' ' + MONTHS[month - 1];
  IB.formatISO = function (str) {
    const p = IB.parseISO(str);
    return p ? p.day + ' ' + MONTHS[p.month - 1] + ' ' + p.year : '';
  };

  /* ---------- People ---------- */
  IB.getEmployee = id => (IB.employees || []).find(e => e.id === id) || null;
  IB.hasFlag = (p, f) => !!(p && p.flags && p.flags.indexOf(f) > -1);

  IB.initials = function (name) {
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '·';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  /* ---------- Photo mapping ----------
     "Gurpal Singh" → "Gurpal_Singh.jpg". person.photo overrides.        */
  IB.photoFile = function (person) {
    if (!person) return null;
    if (person.photo) return person.photo;
    if (!person.name) return null;
    return person.name.trim().replace(/\s+/g, '_').replace(/[^A-Za-z0-9_\-]/g, '') + IB.config.photoExt;
  };

  IB.photoSrc = function (file) {
    if (!file) return null;
    if (IB.embeddedPhotos) return IB.embeddedPhotos[file] || null; // single-file build
    if (IB.config.photoMode === 'files') return IB.config.photoBase + encodeURIComponent(file);
    return null;
  };

  // Placeholder that never looks broken: monogram on a cell-pattern field.
  IB.ui.placeholder = function (name, label, kind) {
    const aria = label || (name ? 'Photograph of ' + name + ' coming soon' : 'Photograph coming soon');
    if (kind === 'emblem') {
      return '<div class="ph ph-emblem" role="img" aria-label="' + IB.esc(aria) + '">' +
        '<span class="ph-em" aria-hidden="true">' + IB.svg.cell('rgba(230,199,102,.12)', '#E6C766') + '</span>' +
        '<span class="ph-cap" aria-hidden="true">Portrait to come</span></div>';
    }
    return '<div class="ph" role="img" aria-label="' + IB.esc(aria) + '">' +
      '<span class="ph-mono" aria-hidden="true">' + IB.esc(IB.initials(name)) + '</span></div>';
  };

  // Portrait with automatic fallback.
  IB.ui.portrait = function (person, opts) {
    opts = opts || {};
    const name = person && person.name;
    const file = opts.file || IB.photoFile(person);
    const src = IB.photoSrc(file);
    const cls = 'portrait ' + (opts.cls || '');
    const inner = src
      ? '<img src="' + IB.esc(src) + '" alt="' + IB.esc(opts.alt != null ? opts.alt : (name ? 'Portrait of ' + name : '')) + '" loading="lazy" decoding="async" data-ph-name="' + IB.esc(name || '') + '"' +
          (opts.phLabel ? ' data-ph-label="' + IB.esc(opts.phLabel) + '"' : '') + (opts.phKind ? ' data-ph-kind="' + IB.esc(opts.phKind) + '"' : '') + '>'
      : IB.ui.placeholder(name, opts.phLabel, opts.phKind);
    return '<figure class="' + cls + '">' + inner + '</figure>';
  };

  // Any image that fails to load is swapped for a placeholder.
  document.addEventListener('error', function (e) {
    const img = e.target;
    if (!img || img.tagName !== 'IMG' || img.dataset.phDone) return;
    img.dataset.phDone = '1';
    // Gallery photos (events) simply drop out when missing, rather than
    // leaving an empty frame that looks like a real entry.
    const drop = img.closest('[data-drop-if-missing]');
    if (drop) { drop.remove(); return; }
    const wrap = document.createElement('div');
    wrap.innerHTML = IB.ui.placeholder(img.dataset.phName || '', img.dataset.phLabel || null, img.dataset.phKind || null);
    img.replaceWith(wrap.firstChild);
  }, true);

  /* ---------- Birthdays (automatic) ---------- */
  IB.birthdaysFor = function (edition) {
    const t = IB.today();
    const sameMonth = t.year === edition.year && t.month === edition.month;
    return (IB.employees || [])
      .map(e => ({ e, d: IB.parseDOB(e.dob) }))
      .filter(x => x.d && x.d.month === edition.month)
      .sort((a, b) => a.d.day - b.d.day || a.e.name.localeCompare(b.e.name))
      .map(x => {
        let status = 'upcoming';
        if (sameMonth) status = x.d.day === t.day ? 'today' : (x.d.day < t.day ? 'past' : 'upcoming');
        else if (t.year > edition.year || (t.year === edition.year && t.month > edition.month)) status = 'past';
        return { person: x.e, day: x.d.day, month: x.d.month, status };
      });
  };

  /* ---------- Work anniversaries & milestones (automatic + manual) ---------- */
  IB.anniversariesFor = function (edition) {
    const out = [];
    (IB.employees || []).forEach(e => {
      const j = IB.parseISO(e.joiningDate);
      if (!j) return;
      const monthsIn = (edition.year - j.year) * 12 + (edition.month - j.month);
      if (monthsIn > 0 && monthsIn % 12 === 0) {
        const y = monthsIn / 12;
        out.push({ person: e, label: y + (y === 1 ? ' year' : ' years'), years: y, joined: e.joiningDate });
      } else if (monthsIn === 6) {
        out.push({ person: e, label: '6 months', years: 0.5, joined: e.joiningDate });
      }
    });
    (edition.milestones || []).forEach(m => {
      const p = IB.getEmployee(m.employeeId);
      if (p && !out.some(o => o.person.id === p.id)) out.push({ person: p, label: m.label, years: parseFloat(m.label) || 0 });
    });
    return out.sort((a, b) => b.years - a.years);
  };

  IB.mailto = function (email, subject, body) {
    let q = [];
    if (subject) q.push('subject=' + encodeURIComponent(subject));
    if (body) q.push('body=' + encodeURIComponent(body));
    return 'mailto:' + email + (q.length ? '?' + q.join('&') : '');
  };

  IB.reducedMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Shared decorative SVG ---------- */
  IB.svg = {
    // A microalga cell: membrane, chloroplast crescent, nucleus.
    cell: function (fill, stroke) {
      return '<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">' +
        '<circle cx="50" cy="50" r="46" fill="' + fill + '" stroke="' + stroke + '" stroke-width="2"/>' +
        '<circle cx="50" cy="50" r="35" fill="none" stroke="' + stroke + '" stroke-width="1.5" stroke-dasharray="2 6" opacity=".55"/>' +
        '<circle cx="57" cy="57" r="14" fill="' + stroke + '" opacity=".45"/>' +
        '<circle cx="31" cy="44" r="4.5" fill="' + stroke + '" opacity=".6"/>' +
        '<circle cx="40" cy="73" r="3" fill="' + stroke + '" opacity=".6"/>' +
        '<circle cx="66" cy="29" r="2.6" fill="' + stroke + '" opacity=".6"/></svg>';
    },
    // A balloon with a string, reading as a cell from afar.
    balloon: function (fill, shine) {
      return '<svg viewBox="0 0 60 110" aria-hidden="true" focusable="false">' +
        '<path d="M30 4C14 4 5 17 5 31c0 18 15 33 25 37c10-4 25-19 25-37C55 17 46 4 30 4z" fill="' + fill + '"/>' +
        '<ellipse cx="20" cy="22" rx="5" ry="9" fill="' + (shine || '#fff') + '" opacity=".35" transform="rotate(-20 20 22)"/>' +
        '<path d="M27 68l3 5l3-5z" fill="' + fill + '"/>' +
        '<path d="M30 73c-4 9 4 16 0 24s3 10 1 13" fill="none" stroke="#8a93a3" stroke-width="1.2"/></svg>';
    }
  };
})();
