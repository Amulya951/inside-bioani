/* =====================================================================
   OPENING — Founder's speech and "The month in BioAni" contents spread.
   ===================================================================== */
(function () {
  const IB = window.IB, esc = IB.esc;

  /* ---------------- Founder's speech ----------------
     The founder's words are rendered exactly as supplied in the edition
     data. Nothing is generated. While awaiting, the section says so.   */
  IB.components.FounderMessage = {
    render: function (ed) {
      const f = IB.founder || {};
      const msg = ed.founderMessage || {};
      const published = msg.status === 'published' && msg.paragraphs && msg.paragraphs.length;
      const who = { name: f.name || 'Founder', photo: f.photo };
      const signName = f.name ? esc(f.name) : '';
      const signRole = esc((f.designation || 'Founder') + ', ' + IB.config.company);
      const seal = IB.svg.cell('#F6E9C2', '#C9A13B');

      let body;
      if (published) {
        const last = msg.paragraphs.length - 1;
        // A short final line is set as the letter's closing flourish.
        const paras = msg.paragraphs.map((p, i) => '<p' + (i === last && i > 0 && p.length < 90 ? ' class="closing"' : '') + '>' + esc(p) + '</p>');
        if (msg.pullQuote && paras.length > 2) paras.splice(2, 0, '<blockquote class="pull">' + esc(msg.pullQuote) + '</blockquote>');
        body = '<div class="letter-body">' + paras.join('') + '</div>';
      } else {
        body = '<p class="await">Our founder\u2019s message for ' + esc(ed.label) + ' will appear here, in the founder\u2019s own words.</p>' +
          '<p class="editor-note">Editor: add the exact text to founderMessage.paragraphs in data/editions/' + esc(ed.id) + '.js and set status to \u2018published\u2019. Founder name is not set in data/company.js.</p>';
      }

      return '<section class="sec founder" id="founder" aria-labelledby="founder-h"><div class="wrap founder-grid">' +
        '<div><div class="f-frame">' + IB.ui.portrait(who, { alt: f.name ? 'Portrait of ' + f.name + ', ' + (f.designation || 'Founder') : 'Portrait of the founder', phLabel: 'Founder\u2019s photograph coming soon', phKind: 'emblem' }) + '</div>' +
        '<div class="f-caption">' + (signName ? '<b>' + signName + '</b>' : '') + '<span>' + signRole + '</span></div></div>' +
        '<article class="letter">' +
          '<div class="runhead">The opening letter</div>' +
          '<span class="qmark" aria-hidden="true">\u201C</span>' +
          '<h2 class="display h-l" id="founder-h">' + (published && msg.title ? esc(msg.title) : 'From the founder\u2019s desk') + '</h2>' +
          body +
          (published ? '<div class="signoff"><span class="seal">' + seal + '</span><div>' + (signName ? '<b>' + signName + '</b>' : '') + '<span>' + signRole + '</span></div></div>' : '') +
        '</article></div></section>';
    }
  };

  /* ---------------- The month in BioAni ---------------- */
  const glyph = IB.svg.cell('#DDEEDF', '#1B5E3C');
  IB.components.MonthlyHero = {
    render: function (ed) {
      const joinerIds = ed.newJoiners || [];
      const joiners = joinerIds.map(IB.getEmployee).filter(Boolean);
      const bdays = IB.birthdaysFor(ed);
      const promos = (ed.promotions || []).length;
      const annis = IB.anniversariesFor(ed).length;
      const mName = IB.MONTHS[ed.month - 1];
      const rows = [];

      rows.push(['#founder', 'From the founder\u2019s desk', ed.founderMessage && ed.founderMessage.status === 'published' ? 'This month\u2019s opening letter.' : 'The opening letter for ' + mName + '.', 'Opening']);
      if ((IB.leadership || []).length) rows.push(['#leadership', 'Leadership', 'Meet our Founder & Chairman and the core leadership team.', 'People']);
      if (bdays.length) rows.push(['#birthdays', 'Birthday corner', IB.cap(IB.numWord(bdays.length)) + ' ' + IB.plural(bdays.length, 'colleague') + ' celebrating in ' + mName + '. Send your wishes.', 'People']);
      rows.push(['#promotions', 'A new chapter', promos ? IB.cap(IB.numWord(promos)) + ' ' + IB.plural(promos, 'promotion') + ' to celebrate.' : 'Promotions and achievements for the month.', 'People']);
      if (annis) rows.push(['#anniversaries', 'Celebrating the journey', IB.cap(IB.numWord(annis)) + ' work ' + IB.plural(annis, 'milestone') + ' this month.', 'People']);
      rows.push(['#business', 'Our business', 'Zeniqua, ZQ Pharmaceutical, Zenivet and Sustainable AgriTech.', 'Business']);
      if (ed.productSpotlight && ed.productSpotlight.name) rows.push(['#product', 'Product of the month', [ed.productSpotlight.brand, ed.productSpotlight.name].filter(Boolean).join(' ') + (ed.productSpotlight.category ? ': ' + ed.productSpotlight.category.toLowerCase() + '.' : '.'), 'Business']);
      rows.push(['#innovation', 'How BioAni grows microalgae', 'From strain to stable ingredient in four steps.', 'Innovation']);
      rows.push(['#game', 'Quick game corner', 'Six questions, one flask to fill. About two minutes.', 'Innovation']);
      rows.push(['#voice', 'Employee voice', 'Tell us what you love, learned or look forward to.', 'Culture']);

      const feature = joiners.length
        ? '<a class="feature-card on-dark" href="#new-joiners"><div class="big">' + joiners.length + '</div>' +
          '<h3>' + IB.cap(IB.numWord(joiners.length)) + ' new colleagues join BioAni this month</h3>' +
          '<p>' + esc(IB.joinerSummary(joiners)) + ' Meet them all.</p>' +
          '<div class="mosaic" aria-hidden="true">' + (joiners.length > 8 ? joiners.slice(0, 7) : joiners).map(p => IB.ui.portrait(p, { alt: '' })).join('') +
          (joiners.length > 8 ? '<span class="more">+' + (joiners.length - 7) + '</span>' : '') + '</div></a>'
        : '<a class="feature-card on-dark" href="#birthdays"><div class="big">' + bdays.length + '</div><h3>' + IB.cap(IB.plural(bdays.length, 'birthday')) + ' this month</h3><p>Visit the birthday corner.</p></a>';

      const hl = (ed.highlights || []).length ? '<div class="highlights">' + ed.highlights.map(h =>
        '<article class="highlight"><h3>' + esc(h.title) + '</h3><p>' + esc(h.text) + '</p>' +
        (h.section ? '<a href="#' + esc(h.section) + '">Read more</a>' : '') + '</article>').join('') + '</div>' : '';

      return '<section class="sec monthsec" id="this-month" aria-labelledby="month-h"><div class="wrap">' +
        '<div class="sec-head split"><div><div class="runhead">This month</div>' +
        '<h2 class="display h-xl month-title" id="month-h">The month in BioAni<em>' + esc(ed.label) + '</em></h2></div>' +
        '<p class="lede">New colleagues, birthdays, the business we build together and a game for your tea break. Here is everything inside this edition.</p></div>' +
        '<div class="month-grid">' + feature +
        '<ul class="contents">' + rows.map(r =>
          '<li><a href="' + r[0] + '"><span class="glyph" aria-hidden="true">' + glyph + '</span><span><b>' + esc(r[1]) + '</b><span class="d">' + esc(r[2]) + '</span></span><span class="dept">' + esc(r[3]) + '</span></a></li>').join('') +
        '</ul></div>' + hl + '</div></section>';
    }
  };
})();
