/* =====================================================================
   PEOPLE — Leadership, New joiners, Achievements & promotions,
   Work anniversaries & milestones. (Birthdays live in birthdays.js.)
   ===================================================================== */
(function () {
  const IB = window.IB, esc = IB.esc;

  // "Regional Business Manager-Uttar Pradesh" → "Regional Business Manager – Uttar Pradesh"
  IB.fmtDesignation = d => String(d || '').replace(/\s*-\s*/g, ' \u2013 ');

  function flagNotes(p) {
    const notes = [];
    if (IB.hasFlag(p, 'designation-unconfirmed')) notes.push('Designation formatting was ambiguous in the source table. Confirm before publishing.');
    if (IB.hasFlag(p, 'dob-missing')) notes.push('No date of birth on file, so no birthday will be shown.');
    if (IB.hasFlag(p, 'dob-year-check')) notes.push('Birth year in the source list (' + p.dob + ') looks unusual. Only day and month are used, but please verify.');
    return notes.map(n => '<p class="editor-note">' + esc(n) + '</p>').join('');
  }
  IB.flagNotes = flagNotes;

  function tbc(p) {
    return IB.hasFlag(p, 'designation-unconfirmed') ? '<span class="tbc">Designation to be confirmed</span>' : '';
  }

  /* ---------- Joiner grouping (derived from designation) ---------- */
  const GROUPS = [
    { key: 'rbm', re: /regional business manager/i, title: 'Leading our regions', unit: ['regional business manager', 'regional business managers'] },
    { key: 'tm', re: /territory manager/i, title: 'Territory managers', unit: ['territory manager', 'territory managers'] },
    { key: 'bd', re: /business development/i, title: 'Business development', unit: ['colleague in business development', 'colleagues in business development'] },
    { key: 'other', re: /.*/, title: 'Also joining us', unit: ['new colleague', 'new colleagues'] }
  ];
  IB.joinerGroups = function (people) {
    return GROUPS.map(g => ({ g, people: people.filter(p => GROUPS.find(x => x.re.test(p.designation || '')) === g) }))
      .filter(x => x.people.length);
  };
  IB.joinerSummary = function (people) {
    const parts = IB.joinerGroups(people).map(x => IB.numWord(x.people.length) + ' ' + x.g.unit[x.people.length === 1 ? 0 : 1]);
    if (!parts.length) return '';
    const s = parts.length === 1 ? parts[0] : parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1];
    return IB.cap(s) + '.';
  };

  /* ---------------- Leadership ---------------- */
  IB.components.Leadership = {
    render: function () {
      const L = IB.leadership || [];
      const head = '<div class="sec-head split"><div><div class="runhead">People</div><h2 class="display h-l" id="lead-h" style="color:var(--navy)">Leadership</h2></div>' +
        '<p class="lede">The people who set the course, and who are cheering the loudest when our teams hit their marks.</p></div>';
      let body;
      if (L.length) {
        const f = IB.founder || {};
        const chair = f.name
          ? '<a class="chair" href="#founder"><span class="ring">' + IB.ui.portrait({ name: f.name, photo: f.avatar || f.photo }, { alt: 'Portrait of ' + f.name + ', ' + (f.designation || 'Founder') }) + '</span>' +
            '<span class="chair-b"><span class="role">' + esc(f.designation || 'Founder') + '</span><b>' + esc(f.name) + '</b><span class="go">Read the founder\u2019s message <span aria-hidden="true">\u2191</span></span></span></a>'
          : '';
        body = chair + '<h3 class="leaders-h">Core leadership team</h3>' +
          '<div class="leaders">' + L.map(l => '<article class="leader"><span class="ring">' + IB.ui.portrait(l, { alt: 'Portrait of ' + l.name }) + '</span>' +
          '<h4>' + esc(l.name) + '</h4><p class="role">' + esc(l.designation || '') + '</p>' + ((l.area || l.department) ? '<p class="area">' + esc(l.area || l.department) + '</p>' : '') + '</article>').join('') + '</div>';
      } else {
        const cell = IB.svg.cell('#DDEEDF', '#1B5E3C');
        body = '<div class="lead-empty"><div class="ghosts" aria-hidden="true">' + [1, 2, 3].map(() => '<div class="ghost">' + cell + '</div>').join('') + '</div>' +
          '<div class="empty"><h3 class="display">Leadership portraits are on their way</h3><p>Photographs, names and roles of BioAni\u2019s leadership team will be introduced here.</p>' +
          '<p class="editor-note">Editor: add entries to IB.leadership in data/company.js.</p></div></div>';
      }
      return '<section class="sec leadership" id="leadership" aria-labelledby="lead-h"><div class="wrap">' + head + body + '</div></section>';
    }
  };

  /* ---------------- New joiners ---------------- */
  IB.components.NewJoiners = {
    render: function (ed) {
      const people = (ed.newJoiners || []).map(id => {
        const p = IB.getEmployee(id);
        if (!p) console.warn('[Inside BioAni] New joiner id not found in employees.js:', id);
        return p;
      }).filter(Boolean);
      if (!people.length) return '';
      const groups = IB.joinerGroups(people);
      const card = p => '<article class="jcard">' + IB.ui.portrait(p) +
        '<div class="jcard-b"><h4>' + esc(p.name) + '</h4><p>' + esc(IB.fmtDesignation(p.designation)) + '</p>' + tbc(p) + flagNotes(p) + '</div></article>';
      const feat = p => '<article class="jfeat">' + IB.ui.portrait(p) +
        '<div class="jfeat-b"><span class="welcome">Welcome aboard</span><h4>' + esc(p.name) + '</h4><p>' + esc(IB.fmtDesignation(p.designation)) + '</p>' + tbc(p) + flagNotes(p) + '</div></article>';
      const renderGroup = x => '<div class="jgroup"><div class="jgroup-h"><h3>' + esc(x.g.title) + '</h3><span>' + x.people.length + '</span></div>' +
        (x.g.key === 'rbm' ? '<div class="jfeature">' + x.people.map(feat).join('') + '</div>'
                           : '<div class="jcards" style="--cols:' + (x.people.length <= 6 ? Math.max(x.people.length, 3) : 4) + '">' + x.people.map(card).join('') + '</div>') + '</div>';

      /* Brand groupings: nest existing joiner groups under a Zenivet / Zeniqua
         banner. Group titles and layout are untouched — this only adds the
         wrapping banner around them. */
      const BRANDS = [
        { title: 'Zenivet', groupKeys: ['rbm', 'tm'] },
        { title: 'Zeniqua', groupKeys: ['bd'] }
      ];
      const byKey = {};
      groups.forEach(x => { byKey[x.g.key] = x; });
      const used = new Set();
      let sections = '';
      BRANDS.forEach(b => {
        const bGroups = b.groupKeys.map(k => byKey[k]).filter(Boolean);
        if (!bGroups.length) return;
        bGroups.forEach(x => used.add(x.g.key));
        sections += '<div class="jbrand"><div class="jbrand-h"><span class="jbrand-name">' + esc(b.title) + '</span></div>' + bGroups.map(renderGroup).join('') + '</div>';
      });
      groups.forEach(x => { if (!used.has(x.g.key)) sections += renderGroup(x); });

      return '<section class="sec joiners on-dark" id="new-joiners" aria-labelledby="join-h"><div class="wrap">' +
        '<div class="sec-head split"><div><div class="runhead">People: welcome to BioAni</div>' +
        '<h2 class="display h-xl" id="join-h">New faces.<br><em class="italic">New energy.</em></h2></div>' +
        '<p class="lede">' + esc(IB.cap(IB.numWord(people.length))) + ' colleagues join us this edition. ' + esc(IB.joinerSummary(people)) +
        ' Say hello when you see them, and help them find their feet.</p></div>' +
        sections +
        '</div></section>';
    }
  };

  /* ---------------- Achievements & promotions ---------------- */
  const laurel = '<svg class="laurel" viewBox="0 0 120 70" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">' +
    '<path d="M60 64C40 62 22 50 16 28"/><path d="M60 64c20-2 38-14 44-36"/></g><g fill="currentColor">' +
    [[20, 40, -40], [26, 50, -25], [35, 57, -10], [16, 30, -55], [15, 20, -70], [100, 40, 40], [94, 50, 25], [85, 57, 10], [104, 30, 55], [105, 20, 70]]
      .map(l => '<ellipse cx="' + l[0] + '" cy="' + l[1] + '" rx="4" ry="9" transform="rotate(' + l[2] + ' ' + l[0] + ' ' + l[1] + ')"/>').join('') +
    '<path d="M60 6l3.5 7.5 8 .9-6 5.4 1.7 8-7.2-4.2-7.2 4.2 1.7-8-6-5.4 8-.9z"/></g></svg>';
  const arrow = '<svg class="arrow" viewBox="0 0 28 38" aria-hidden="true"><path d="M14 2v30M4 22l10 12 10-12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  IB.components.PromotionSpotlight = {
    render: function (ed) {
      const promos = (ed.promotions || []).map(pr => ({ pr, p: IB.getEmployee(pr.employeeId) })).filter(x => x.p);
      const achieves = ed.achievements || [];
      const head = '<div class="sec-head"><div class="runhead">People: achievements & promotions</div>' +
        '<h2 class="display h-xl" id="promo-h">A new chapter</h2><div><span class="ribbon">Congratulations from Team BioAni</span></div></div>';
      // Real, attributable quotation: Steve Jobs, Stanford commencement address, 12 June 2005.
      const quote = '<aside class="quote-card on-dark"><blockquote>The only way to do great work is to love what you do.</blockquote><cite>Steve Jobs, Stanford commencement address, 2005</cite></aside>';
      let body = '';
      const cheer = x => '<button class="btn btn-gold btn-sm" type="button" data-cheer="' + esc(x.p.name) + '" data-role="' + esc(x.pr.to) + '">\uD83C\uDF89 Congratulate<span class="sr-only"> ' + esc(x.p.name) + '</span></button>';
      if (promos.length > 1) {
        body = '<div class="pcards">' + promos.map(x => '<article class="pcard" id="promo-' + esc(x.p.id) + '"><div class="promo-photo"><span class="badge">Promoted</span>' + IB.ui.portrait(x.p) + '</div>' +
          '<div class="pcard-b"><h3>' + esc(x.p.name) + '</h3><div class="promo-path"><span class="lbl">Previously</span><span class="from">' + esc(x.pr.from) + '</span>' + arrow +
          '<span class="lbl">Now</span><span class="to">' + esc(x.pr.to) + '</span></div>' +
          (x.pr.note ? '<p>' + esc(x.pr.note) + '</p>' : '') + cheer(x) + '</div></article>').join('') + '</div>' +
          '<div class="promo-quote">' + quote + '</div>';
      } else if (promos.length) {
        body = promos.map(x => '<article class="promo" id="promo-' + esc(x.p.id) + '"><div class="promo-photo"><span class="badge">Promoted</span>' + IB.ui.portrait(x.p) + '</div>' +
          '<div class="promo-b"><h3>' + esc(x.p.name) + '</h3><div class="promo-path"><span class="lbl">Previously</span><span class="from">' + esc(x.pr.from) + '</span>' + arrow +
          '<span class="lbl">Now</span><span class="to">' + esc(x.pr.to) + '</span></div>' +
          (x.pr.note ? '<p>' + esc(x.pr.note) + '</p>' : '') + '<p class="congrats">Congratulations from Team BioAni.</p>' + cheer(x) + '</div></article>').join('') +
          '<div style="margin-top:64px">' + quote + '</div>';
      } else {
        body = '<div class="plaque"><div class="plaque-card">' + laurel + '<h3 class="display">Promotions & achievements</h3>' +
          '<p>This month\u2019s promotions and professional milestones will be celebrated here, with a proper spotlight for each person.</p>' +
          '<p class="editor-note">Editor: add to promotions / achievements in data/editions/' + esc(ed.id) + '.js.</p></div>' + quote + '</div>';
      }
      if (achieves.length) {
        body += '<div class="achieves">' + achieves.map(a => {
          const p = a.employeeId ? IB.getEmployee(a.employeeId) : null;
          return '<article class="achieve">' + (p ? IB.ui.portrait(p) : IB.ui.placeholder(a.team || '')) +
            '<div><h4>' + esc(a.title) + '</h4><p>' + esc((p ? p.name : a.team || '') + (a.text ? '. ' + a.text : '')) + '</p></div></article>';
        }).join('') + '</div>';
      }
      return '<section class="sec promos" id="promotions" aria-labelledby="promo-h"><div class="wrap">' + head + body + '</div></section>';
    },
    mount: function () {
      const sec = document.getElementById('promotions');
      if (!sec) return;
      sec.addEventListener('click', e => {
        const b = e.target.closest('[data-cheer]');
        if (b) IB.celebrate(b.dataset.cheer, b, {
          emoji: '\uD83C\uDF89\uD83C\uDFC6\u2728',
          title: 'Congratulations, ' + b.dataset.cheer + '!',
          text: 'Team BioAni congratulates you on your new role as ' + b.dataset.role + '. Here\u2019s to the next chapter!'
        });
      });
    }
  };

  /* ---------------- Work anniversaries & milestones ---------------- */
  IB.components.Anniversaries = {
    render: function (ed) {
      const list = IB.anniversariesFor(ed);
      const head = '<div class="sec-head split"><div><div class="runhead">People: milestones</div><h2 class="display h-l" id="anni-h" style="color:var(--navy)">Celebrating the journey</h2></div>' +
        '<p class="lede">Six months, one year, five years. Every milestone at BioAni is a story of showing up, learning and building something together.</p></div>';
      const body = list.length
        ? '<div class="journey">' + list.map(a => '<article class="jmile"><div class="medal">' + IB.ui.portrait(a.person) + '</div><div><span class="lab">' + esc(a.label) + ' at BioAni</span><h4>' + esc(a.person.name) + '</h4>' +
            (a.person.designation ? '<p>' + esc(IB.fmtDesignation(a.person.designation)) + '</p>' : '') + '</div></article>').join('') + '</div>'
        : '<div class="journey-empty"><div class="path-dots" aria-hidden="true"><span>6m</span><i></i><span>1y</span><i></i><span>2y</span><i></i><span>5y</span></div>' +
          '<div class="empty" style="flex:1;min-width:260px"><h3 class="display">Milestones for ' + esc(IB.MONTHS[ed.month - 1]) + '</h3><p>Work anniversaries and milestones will be celebrated here as they come up.</p>' +
          '<p class="editor-note">Editor: anniversaries are calculated automatically once joiningDate (YYYY-MM-DD) is added to employees in data/employees.js. None are on file yet.</p></div></div>';
      return '<section class="sec annis" id="anniversaries" aria-labelledby="anni-h"><div class="wrap">' + head + body + '</div></section>';
    }
  };
})();
