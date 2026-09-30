/* =====================================================================
   MASTHEAD — navigation (desktop + mobile) and the magazine cover.
   ===================================================================== */
(function () {
  const IB = window.IB, esc = IB.esc;

  IB.navItems = [
    { label: 'Home', href: '#cover' },
    { label: 'This month', href: '#this-month' },
    { label: 'People', href: '#leadership', kids: [
      ['Leadership', '#leadership'], ['New joiners', '#new-joiners'],
      ['Achievements & promotions', '#promotions'], ['Birthdays', '#birthdays'],
      ['Work anniversaries & milestones', '#anniversaries']] },
    { label: 'Our business', href: '#business', kids: [
      ['Zeniqua', '#biz-zeniqua'], ['ZQ Pharmaceutical', '#biz-zq-pharmaceutical'],
      ['Zenivet', '#biz-zenivet'], ['Sustainable AgriTech', '#biz-agritech'],
      ['Product spotlight', '#product']] },
    { label: 'Innovation', href: '#innovation', kids: [
      ['Innovation stories', '#innovation'], ['Quick game corner', '#game']] },
    { label: 'Culture', href: '#events', kids: [
      ['Events & celebrations', '#events'], ['Recognition', '#recognition'],
      ['Employee voice', '#voice'], ['Beyond BioAni', '#beyond']] },
    { label: 'Opportunities', href: '#opportunities' },
    { label: 'Archive', href: '#archive' },
    { label: 'HR corner', href: '#hr' }
  ];

  const chev = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
  const logo = (IB.brandLogos && IB.brandLogos.bioani) ? '<img class="brand-logo" src="' + IB.brandLogos.bioani + '" alt="" width="120" height="34">' : '';
  const brand = logo + '<i>Inside</i><b>BioAni</b>';

  IB.components.Nav = {
    render: function () {
      const items = IB.navItems.map((it, i) => {
        if (!it.kids) return '<li><a class="nav-link" href="' + it.href + '" data-spy="' + it.href.slice(1) + '">' + esc(it.label) + '</a></li>';
        return '<li><button class="nav-link" type="button" aria-expanded="false" aria-controls="sub-' + i + '" data-group="' + esc([it.href.slice(1)].concat(it.kids.map(k => k[1].slice(1))).join(' ')) + '">' +
          esc(it.label) + chev + '</button><ul class="sub" id="sub-' + i + '">' +
          it.kids.map(k => '<li><a href="' + k[1] + '">' + esc(k[0]) + '</a></li>').join('') + '</ul></li>';
      }).join('');
      const mitems = IB.navItems.map(it =>
        '<li><a class="top-a" href="' + it.href + '">' + esc(it.label) + '</a>' +
        (it.kids ? '<div class="kids">' + it.kids.map(k => '<a href="' + k[1] + '">' + esc(k[0]) + '</a>').join('') + '</div>' : '') + '</li>').join('');
      return '<a class="skip" href="#main">Skip to the edition</a>' +
        '<header class="nav on-dark"><div class="wrap nav-in">' +
        '<a class="brand" href="#cover" aria-label="Inside BioAni, back to the cover">' + brand + '</a>' +
        '<nav aria-label="Sections"><ul class="nav-links">' + items + '</ul></nav>' +
        '<button class="menu-btn" type="button" aria-expanded="false" aria-controls="mnav"><span class="bars"><i></i></span>Menu</button>' +
        '</div></header>' +
        '<div class="mnav" id="mnav" role="dialog" aria-modal="true" aria-label="Sections">' +
        '<div class="mnav-top"><a class="brand" href="#cover">' + brand + '</a><button class="mnav-close" type="button">Close</button></div>' +
        '<ul>' + mitems + '</ul></div>';
    },
    mount: function () {
      const subsBtns = [...document.querySelectorAll('.nav-links button.nav-link')];
      const closeAll = except => subsBtns.forEach(b => { if (b !== except) { b.setAttribute('aria-expanded', 'false'); b.nextElementSibling.classList.remove('open'); } });
      subsBtns.forEach(btn => {
        const sub = btn.nextElementSibling, li = btn.parentElement;
        btn.addEventListener('click', () => {
          const open = btn.getAttribute('aria-expanded') !== 'true';
          closeAll(btn); btn.setAttribute('aria-expanded', String(open)); sub.classList.toggle('open', open);
          if (open && btn.matches(':focus-visible')) sub.querySelector('a').focus();
        });
        li.addEventListener('mouseenter', () => { if (matchMedia('(hover: hover)').matches) { closeAll(btn); btn.setAttribute('aria-expanded', 'true'); sub.classList.add('open'); } });
        li.addEventListener('mouseleave', () => { if (matchMedia('(hover: hover)').matches) { btn.setAttribute('aria-expanded', 'false'); sub.classList.remove('open'); } });
        sub.addEventListener('click', e => { if (e.target.closest('a')) closeAll(); });
      });
      document.addEventListener('click', e => { if (!e.target.closest('.nav-links')) closeAll(); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') { const open = subsBtns.find(b => b.getAttribute('aria-expanded') === 'true'); closeAll(); if (open) open.focus(); } });

      // Mobile menu
      const mbtn = document.querySelector('.menu-btn'), mnav = document.getElementById('mnav'), close = mnav.querySelector('.mnav-close');
      const setM = open => {
        mnav.classList.toggle('open', open); mbtn.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
        if (open) close.focus(); else mbtn.focus({ preventScroll: true });
      };
      mbtn.addEventListener('click', () => setM(true));
      close.addEventListener('click', () => setM(false));
      mnav.addEventListener('click', e => { if (e.target.closest('a')) { mnav.classList.remove('open'); mbtn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; } });
      mnav.addEventListener('keydown', e => {
        if (e.key === 'Escape') setM(false);
        if (e.key === 'Tab') { // keep focus inside the open menu
          const f = [...mnav.querySelectorAll('a, button')]; const first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });

      // Highlight the department you're reading
      const links = [...document.querySelectorAll('.nav-link')];
      const spy = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (!en.isIntersecting) return;
          const id = en.target.id;
          links.forEach(l => {
            const hit = l.dataset.spy === id || (!!l.dataset.group && l.dataset.group.split(' ').indexOf(id) > -1);
            l.classList.toggle('is-active', hit);
          });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));
    }
  };

  /* ---------------- Cover ---------------- */
  // Cells that read as balloons: [left%, top%, size px, delay s, opacity, variant]
  const CELLS = [
    [83, 13, 120, .2, .9, 'g'], [93, 42, 64, .5, .85, 'y'], [70, 16, 36, .8, .8, 'y'],
    [2, 60, 90, .4, .55, 'g'], [56, 12, 26, 1.0, .7, 'l'], [96, 20, 34, .9, .7, 'l'],
    [40, 84, 30, 1.2, .6, 'y'], [8, 22, 40, 1.1, .6, 'l'], [95, 70, 44, .7, .65, 'g']
  ];
  const variants = {
    g: ['rgba(94,154,120,.55)', '#A9CDB8'],
    y: ['rgba(155,201,46,.35)', '#9BC92E'],
    l: ['rgba(220,233,225,.18)', '#DCE9E1']
  };

  IB.components.Cover = {
    render: function (ed) {
      const joiners = (ed.newJoiners || []).length;
      const bdays = IB.birthdaysFor(ed).length;
      const promos = (ed.promotions || []).length;
      const lines = [];
      if (joiners) lines.push(['#new-joiners', joiners, 'New faces, new energy', IB.cap(IB.numWord(joiners)) + ' colleagues join BioAni']);
      if (bdays) lines.push(['#birthdays', bdays, 'Birthday corner', IB.cap(IB.numWord(bdays)) + ' ' + IB.MONTHS[ed.month - 1] + ' ' + IB.plural(bdays, 'birthday') + ' to celebrate']);
      if (promos) lines.push(['#promotions', promos, 'A new chapter', IB.cap(IB.numWord(promos)) + ' ' + IB.plural(promos, 'promotion')]);
      lines.push(['#founder', null, 'From the founder\u2019s desk', ed.founderMessage && ed.founderMessage.status === 'published' ? (IB.founder && IB.founder.name ? 'A message from ' + IB.founder.name : 'A letter for ' + IB.MONTHS[ed.month - 1]) : 'The month opens with a word from our founder']);
      lines.push(['#game', null, 'Quick game corner', 'Six questions. One flask to fill.']);
      lines.splice(4);

      const star = IB.svg.cell('rgba(155,201,46,.2)', '#9BC92E');
      const cells = CELLS.map(c => {
        const v = variants[c[5]];
        return '<span class="c" style="left:' + c[0] + '%;top:' + c[1] + '%;--s:' + c[2] + 'px;--d:' + c[3] + 's;--o:' + c[4] +
          ';--t:' + (10 + c[2] % 7) + 's;--dx:' + (c[2] % 2 ? 14 : -12) + 'px;--r:' + (c[2] % 3 ? 6 : -8) + 'deg">' + IB.svg.cell(v[0], v[1]) + '</span>';
      }).join('');
      const sparks = [[62, 20], [70, 58], [94, 52], [54, 64], [8, 30], [40, 14], [88, 88]]
        .map(s => '<i class="sparkle" style="left:' + s[0] + '%;top:' + s[1] + '%"></i>').join('');

      const confetti = [[60, 9, '#9BC92E', 20], [74, 46, '#A9CDB8', -30], [51, 54, '#9BC92E', 60], [12, 40, '#A9CDB8', 15], [88, 30, '#F8F6F1', -50], [30, 88, '#9BC92E', 35], [66, 86, '#A9CDB8', -15], [97, 58, '#9BC92E', 70]]
        .map(c => '<i class="confetto" style="left:' + c[0] + '%;top:' + c[1] + '%;background:' + c[2] + ';transform:rotate(' + c[3] + 'deg)"></i>').join('');
      return '<section class="cover on-dark" id="cover" aria-labelledby="mast">' +
        '<div class="cells" aria-hidden="true">' + cells + sparks + confetti + '</div>' +
        '<div class="wrap">' +
          '<div class="cover-meta"><span>' + esc(IB.config.company) + ' <strong>internal monthly</strong></span><span>' + esc(ed.label) + ' edition</span></div>' +
          '<h1 class="mast" id="mast"><span class="m-inside">INSIDE</span><span class="m-bioani">BI<span class="m-o"><span class="m-ring">O</span>' +
            (IB.brandLogos && IB.brandLogos.leaf ? '<img class="m-leaf" src="' + IB.brandLogos.leaf + '" alt="">' : '') + '</span>ANI</span></h1>' +
          '<div class="cover-grid">' +
            '<div>' +
              '<div class="edition-line"><span class="month">' + esc(IB.MONTHS[ed.month - 1]) + '</span><span class="year">' + ed.year + '</span></div>' +
              '<p class="cover-tag">' + esc(ed.tagline) + '</p>' +
              '<div class="cover-cta"><a class="btn btn-gold" href="#founder">Open the ' + esc(IB.MONTHS[ed.month - 1]) + ' edition</a></div>' +
            '</div>' +
            '<nav aria-label="In this edition"><ul class="coverlines">' + lines.map(l =>
              '<li><a href="' + l[0] + '">' + (l[1] != null ? '<span class="n">' + l[1] + '</span>' : '<span class="star">' + star + '</span>') +
              '<span class="t"><b>' + esc(l[2]) + '</b><span>' + esc(l[3]) + '</span></span></a></li>').join('') + '</ul></nav>' +
          '</div>' +
        '</div>' +
        '<div class="cover-edge" aria-hidden="true"><svg viewBox="0 0 1440 130" preserveAspectRatio="none"><path d="M0 70 C 180 20, 330 120, 520 84 S 860 10, 1040 60 S 1320 110, 1440 50 L1440 130 L0 130 Z" fill="#F8F6F1"/><path d="M0 70 C 180 20, 330 120, 520 84 S 860 10, 1040 60 S 1320 110, 1440 50" fill="none" stroke="#9BC92E" stroke-width="2"/></svg></div>' +
      '</section>';
    }
  };
})();
