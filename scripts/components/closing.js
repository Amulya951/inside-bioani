/* =====================================================================
   CLOSING — Opportunities, Archive, HR corner, Footer.
   ===================================================================== */
(function () {
  const IB = window.IB, esc = IB.esc;

  /* ---------------- Opportunities ---------------- */
  IB.components.Opportunities = {
    render: function (ed) {
      const O = ed.opportunities || [];
      const head = '<div class="sec-head split"><div><div class="runhead">Opportunities</div><h2 class="display h-l" id="opp-h" style="color:var(--navy)">Your next step, posted here</h2></div>' +
        '<p class="lede">Internal roles, special projects, workshops and ways to volunteer. If it helps you grow, it belongs on this board.</p></div>';
      const body = O.length
        ? '<ul class="opp-list">' + O.map(o => {
            const href = o.ctaUrl || (o.ctaEmail ? IB.mailto(o.ctaEmail, 'Interested: ' + o.title) : IB.mailto(IB.config.hrEmail, 'Interested: ' + o.title));
            const ext = /^https?:/.test(href);
            return '<li class="opp"><div><h3>' + esc(o.title) + '</h3>' + (o.deadline ? '<span class="dl">Apply by ' + esc(IB.formatISO(o.deadline)) + '</span>' : '') + '</div>' +
              '<p>' + esc(o.description || '') + '</p><a class="btn btn-green btn-sm" href="' + esc(href) + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + esc(o.ctaLabel || 'Express interest') +
              '<span class="sr-only"> in ' + esc(o.title) + '</span></a></li>';
          }).join('') + '</ul>'
        : '<div class="empty"><h3 class="display">No openings posted this month</h3><p>New roles, projects and learning programmes will be listed here as they open. Curious about something already? Ask HR.</p>' +
          '<a class="btn btn-green btn-sm" href="' + esc(IB.mailto(IB.config.hrEmail, 'Question about opportunities at BioAni')) + '">Ask HR about opportunities</a></div>';
      return '<section class="sec opps" id="opportunities" aria-labelledby="opp-h"><div class="wrap">' + head + body + '</div></section>';
    }
  };

  /* ---------------- Archive: a shelf of editions ---------------- */
  IB.components.Archive = {
    render: function (ed) {
      // Only editions whose data file is loaded can be opened; newest first.
      const idx = (IB.editionIndex || []).filter(e => IB.editions[e.id]).slice().sort((a, b) => b.id.localeCompare(a.id));
      const dots = '<svg class="dots" viewBox="0 0 90 90" aria-hidden="true"><circle cx="45" cy="30" r="22" fill="rgba(94,154,120,.6)" stroke="#A9CDB8" stroke-width="1.5"/><circle cx="24" cy="70" r="10" fill="rgba(155,201,46,.35)" stroke="#9BC92E" stroke-width="1.5"/><circle cx="72" cy="66" r="6" fill="rgba(220,233,225,.3)"/></svg>';
      const covers = idx.map(e => {
        const parts = e.label.split(' ');
        const isCur = e.id === ed.id;
        return '<a class="issue' + (isCur ? ' current' : '') + '" href="?edition=' + encodeURIComponent(e.id) + '#cover"' + (isCur ? ' aria-current="page"' : '') + '>' +
          '<div class="issue-cover" aria-hidden="true">' + dots + '<span class="mi">INSIDE</span><span><span class="mb">BIOANI</span><br><span class="mm">' + esc(parts[0]) + '</span></span></div>' +
          '<div class="issue-lab"><b>' + esc(e.label) + '</b><span>' + (isCur ? 'Reading now' : 'Open this edition') + '</span></div></a>';
      }).join('');
      // A ghost for the next month, so the shelf reads as a growing collection.
      const latest = idx[0] ? IB.editions[idx[0].id] : ed;
      const nm = latest.month === 12 ? 1 : latest.month + 1, ny = latest.month === 12 ? latest.year + 1 : latest.year;
      const next = '<div class="issue next" aria-hidden="true"><div class="issue-cover"><span>' + esc(IB.MONTHS[nm - 1]) + ' ' + ny + '<br>in the making</span></div><div class="issue-lab"><b>Next edition</b><span>Coming soon</span></div></div>';
      return '<section class="sec archive on-dark" id="archive" aria-labelledby="arc-h"><div class="wrap">' +
        '<div class="sec-head split"><div><div class="runhead">Archive</div><h2 class="display h-l" id="arc-h">Every edition, on the shelf</h2></div>' +
        '<p class="lede">Each month joins the collection. Pick up any issue to relive its people and moments.</p></div>' +
        '<div class="shelf">' + covers + next + '</div></div></section>';
    }
  };

  /* ---------------- HR corner ---------------- */
  IB.components.HRCorner = {
    render: function () {
      const e = IB.config.hrEmail;
      return '<section class="sec hr" id="hr" aria-labelledby="hr-h"><div class="wrap hr-grid">' +
        '<div><div class="runhead">HR corner</div><h2 class="display h-xl" id="hr-h">Have a question?</h2>' +
        '<p class="lede" style="margin-top:18px">Leave, policies, payroll, onboarding, or a story for the next edition. HR is one email away.</p>' +
        '<a class="mail" href="mailto:' + esc(e) + '">' + esc(e) + '</a></div>' +
        '<div class="hr-card on-dark"><p>Write to us any time. Include your name and team so we can help faster.</p>' +
        '<a class="btn btn-gold" href="' + esc(IB.mailto(e, 'Question for HR')) + '">Talk to HR</a></div>' +
        '</div></section>';
    }
  };

  /* ---------------- Footer ---------------- */
  IB.components.Footer = {
    render: function (ed) {
      return '<footer class="foot on-dark"><div class="wrap foot-in"><a class="brand" href="#cover"><i>Inside</i><b>BioAni</b></a>' +
        '<p style="margin:0">' + esc(ed.label) + ' edition. The internal monthly newsletter of ' + esc(IB.config.company) + '. Company information lives on <a href="' + esc(IB.config.officialSite) + '" target="_blank" rel="noopener">bioani.in</a>.</p></div></footer>' +
        '<div class="editor-bar" aria-hidden="true">Editor view: data flags visible</div>';
    }
  };
})();
