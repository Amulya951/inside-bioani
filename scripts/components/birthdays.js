/* =====================================================================
   BIRTHDAY CORNER — fully automatic.
   edition month → employees with a DOB in that month → sorted by day →
   today's birthday (or the next one) gets the spotlight → the rest
   become festive cards. Birth years are never displayed.
   Test any day with ?date=YYYY-MM-DD in the URL.
   ===================================================================== */
(function () {
  const IB = window.IB, esc = IB.esc;
  const SHORT = m => IB.MONTHS[m - 1].slice(0, 3);

  const BALLOONS = [
    ['#E6C766', 8, 58, 4.6, 0], ['#237A4E', 26, 70, 5.4, .6], ['#1A3A6B', 46, 62, 5, .3],
    ['#9FD3AE', 64, 54, 4.2, .9], ['#C9A13B', 80, 66, 5.8, .2]
  ];

  // Small cross-link when a birthday person was also promoted this edition.
  function alsoPromoted(p, ed) {
    return (ed && (ed.promotions || []).some(x => x.employeeId === p.id))
      ? '<a class="also" href="#promo-' + esc(p.id) + '"><span aria-hidden="true">\u2605</span> Also promoted this month</a>' : '';
  }

  function cardHTML(b, ed) {
    const p = b.person;
    const past = b.status === 'past';
    const status = b.status === 'today' ? 'Today' : past ? 'Celebrated' : '';
    return '<article class="bcard" id="bday-' + esc(p.id) + '" data-day="' + b.day + '">' +
      '<div class="bc-top">' + IB.ui.portrait(p) +
      '<div class="bc-date"><b>' + String(b.day).padStart(2, '0') + '</b><span>' + esc(IB.MONTHS[b.month - 1]) + '</span>' +
      (status ? '<em class="status">' + esc(status) + '</em>' : '') + '</div></div>' +
      '<h4>Happy birthday, ' + esc(p.name) + '!</h4>' +
      '<p class="from">From all of us at Team BioAni</p>' + alsoPromoted(p, ed) +
      '<button class="btn btn-wish" type="button" data-wish="' + esc(p.name) + '">\uD83C\uDF89 ' + (past ? 'Send belated wishes' : 'Send birthday wishes') + '<span class="sr-only"> to ' + esc(p.name) + '</span></button>' +
      IB.flagNotes(p) + '</article>';
  }

  function starHTML(b, label, ed) {
    const p = b.person;
    return '<article class="bstar on-dark" id="bday-' + esc(p.id) + '" data-day="' + b.day + '">' +
      IB.ui.portrait(p) +
      '<div><span class="tag">' + esc(label) + '</span>' +
      '<h3>Happy birthday, ' + esc(p.name) + '!</h3>' +
      '<p class="from">From all of us at Team BioAni</p>' +
      '<p class="when">' + esc(IB.formatDayMonth(b.day, b.month)) + '</p>' + alsoPromoted(p, ed) +
      '<button class="btn btn-gold" type="button" data-wish="' + esc(p.name) + '">\uD83C\uDF89 Send birthday wishes<span class="sr-only"> to ' + esc(p.name) + '</span></button>' +
      IB.flagNotes(p) + '</div></article>';
  }

  IB.components.BirthdayCorner = {
    render: function (ed) {
      const list = IB.birthdaysFor(ed);
      const mName = IB.MONTHS[ed.month - 1];
      const t = IB.today();
      const balloons = '<div class="balloons" aria-hidden="true">' + BALLOONS.map(b =>
        '<span class="b" style="left:' + b[1] + '%;--w:' + b[2] + 'px;--t:' + b[3] + 's;--d:' + b[4] + 's">' + IB.svg.balloon(b[0]) + '</span>').join('') + '</div>';

      const head = '<div class="bday-head"><div><div class="runhead">People: birthdays</div>' +
        '<h2 class="display h-xl" id="bday-h">Birthday corner<em>' +
        (list.length ? esc(IB.cap(IB.numWord(list.length))) + ' ' + IB.plural(list.length, 'birthday') + ' in ' + esc(mName) + '. Make some noise.' : esc(mName) + ' edition') +
        '</em></h2></div>' + balloons + '</div>';

      if (!list.length) {
        return '<section class="sec bday" id="birthdays" aria-labelledby="bday-h"><div class="wrap">' + head +
          '<div class="empty"><h3 class="display">No birthdays this month</h3><p>We\u2019ll have more celebrations coming up next month. Keep the confetti handy.</p></div></div></section>';
      }

      // Spotlight: everyone whose birthday is today; otherwise the next birthday date.
      let starred = list.filter(b => b.status === 'today');
      let label = 'Today\u2019s birthday';
      if (!starred.length) {
        const next = list.find(b => b.status === 'upcoming');
        if (next) {
          starred = list.filter(b => b.status === 'upcoming' && b.day === next.day);
          const sameMonth = t.year === ed.year && t.month === ed.month;
          const diff = sameMonth ? next.day - t.day : null;
          label = diff === 1 ? 'Coming up tomorrow' : 'Next birthday';
        }
      }
      const rest = list.filter(b => starred.indexOf(b) === -1);

      // Month calendar strip
      const days = IB.daysInMonth(ed.year, ed.month);
      const byDay = {};
      list.forEach(b => (byDay[b.day] = byDay[b.day] || []).push(b));
      const isToday = d => t.year === ed.year && t.month === ed.month && t.day === d;
      let cal = '';
      for (let d = 1; d <= days; d++) {
        const who = byDay[d];
        const cls = 'cal-d' + (who ? ' has' : '') + (isToday(d) ? ' today' : '');
        cal += who
          ? '<button type="button" class="' + cls + '" data-goto="bday-' + esc(who[0].person.id) + '" aria-label="' + d + ' ' + mName + ': ' + esc(who.map(w => w.person.name).join(' and ')) + (isToday(d) ? ', today' : '') + '">' + d + '</button>'
          : '<span class="' + cls + '"' + (isToday(d) ? ' aria-label="Today, ' + d + ' ' + mName + '"' : ' aria-hidden="true"') + '>' + d + '</span>';
      }

      return '<section class="sec bday" id="birthdays" aria-labelledby="bday-h"><div class="wrap">' + head +
        '<div class="cal"><div class="cal-top"><b>' + esc(ed.label) + '</b><span>Gold dates are birthdays. Tap one to jump to it.</span></div><div class="cal-grid">' + cal + '</div></div>' +
        starred.map(b => starHTML(b, label, ed)).join('') +
        (rest.length ? '<div class="bcards">' + rest.map(b => cardHTML(b, ed)).join('') + '</div>' : '') +
        '</div></section>';
    },
    mount: function () {
      const sec = document.getElementById('birthdays');
      if (!sec) return;
      sec.addEventListener('click', e => {
        const go = e.target.closest('[data-goto]');
        if (go) {
          const el = document.getElementById(go.dataset.goto);
          if (el) {
            el.scrollIntoView({ behavior: IB.reducedMotion() ? 'auto' : 'smooth', block: 'center' });
            el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
            const btn = el.querySelector('[data-wish]'); if (btn) setTimeout(() => btn.focus({ preventScroll: true }), 500);
          }
          return;
        }
        const wish = e.target.closest('[data-wish]');
        if (wish) IB.celebrate(wish.dataset.wish, wish);
      });
    }
  };

  /* ---------------- Celebration dialog ---------------- */
  // opts (optional): { emoji, title, text } for other celebrations (e.g. promotions).
  const WISH_TEXT = 'Team BioAni wishes you a very happy birthday! Here\u2019s to another year of growth, happiness and wonderful moments.';
  IB.celebrate = function (name, origin, opts) {
    opts = opts || {};
    const dlg = document.getElementById('wish');
    dlg.querySelector('.emoji').textContent = opts.emoji || '\uD83C\uDF89\uD83C\uDF88\u2728';
    dlg.querySelector('h2').textContent = opts.title || 'Happy birthday, ' + name + '!';
    dlg.querySelector('#wish-p').textContent = opts.text || WISH_TEXT;
    dlg.classList.add('open');
    dlg._return = origin;
    dlg.querySelector('button').focus();
    const r = origin ? origin.getBoundingClientRect() : null;
    IB.confetti.burst(r ? r.left + r.width / 2 : innerWidth / 2, r ? r.top + r.height / 2 : innerHeight / 2);
  };

  IB.components.WishDialog = {
    render: function () {
      return '<div class="wish" id="wish" role="dialog" aria-modal="true" aria-labelledby="wish-h" aria-describedby="wish-p"><div class="wish-card">' +
        '<div class="emoji" aria-hidden="true">\uD83C\uDF89\uD83C\uDF88\u2728</div>' +
        '<h2 id="wish-h">Happy birthday!</h2>' +
        '<p id="wish-p">Team BioAni wishes you a very happy birthday! Here\u2019s to another year of growth, happiness and wonderful moments.</p>' +
        '<button class="btn btn-navy" type="button">Keep celebrating</button></div></div>' +
        '<canvas id="confetti" aria-hidden="true"></canvas>';
    },
    mount: function () {
      const dlg = document.getElementById('wish');
      const close = () => { dlg.classList.remove('open'); if (dlg._return) dlg._return.focus({ preventScroll: true }); };
      dlg.querySelector('button').addEventListener('click', close);
      dlg.addEventListener('click', e => { if (e.target === dlg) close(); });
      dlg.addEventListener('keydown', e => { if (e.key === 'Escape' || e.key === 'Tab') { if (e.key === 'Escape') close(); else e.preventDefault(); } });
    }
  };

  /* ---------------- Confetti (no library) ---------------- */
  IB.confetti = (function () {
    const COLORS = ['#E6C766', '#C9A13B', '#237A4E', '#9FD3AE', '#1A3A6B', '#FFFBF0'];
    let cvs, ctx, parts = [], raf = null;
    function size() { const dpr = Math.min(devicePixelRatio || 1, 2); cvs.width = innerWidth * dpr; cvs.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    function tick() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts = parts.filter(p => p.life > 0 && p.y < innerHeight + 40);
      parts.forEach(p => {
        p.vy += .18; p.vx *= .99; p.vy *= .99; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life--;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = Math.min(1, p.life / 40);
        ctx.fillStyle = p.c;
        if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.s / 2, 0, 7); ctx.fill(); }
        else ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2 * Math.abs(Math.cos(p.rot * 2)) + 1);
        ctx.restore();
      });
      raf = parts.length ? requestAnimationFrame(tick) : (ctx.clearRect(0, 0, innerWidth, innerHeight), null);
    }
    return {
      burst: function (x, y) {
        if (IB.reducedMotion()) return;
        cvs = cvs || document.getElementById('confetti'); if (!cvs) return;
        ctx = ctx || cvs.getContext('2d'); size();
        const n = innerWidth < 600 ? 110 : 170;
        for (let i = 0; i < n; i++) {
          const a = Math.random() * Math.PI * 2, sp = 4 + Math.random() * 9;
          parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 6, s: 6 + Math.random() * 7, c: COLORS[i % COLORS.length], rot: Math.random() * 6, vr: (Math.random() - .5) * .3, life: 140 + Math.random() * 60, round: Math.random() < .3 });
        }
        for (let i = 0; i < n / 2; i++) parts.push({ x: Math.random() * innerWidth, y: -20 - Math.random() * 200, vx: (Math.random() - .5) * 2, vy: 2 + Math.random() * 3, s: 6 + Math.random() * 6, c: COLORS[i % COLORS.length], rot: Math.random() * 6, vr: (Math.random() - .5) * .2, life: 220, round: Math.random() < .3 });
        if (!raf) raf = requestAnimationFrame(tick);
      }
    };
  })();
})();
