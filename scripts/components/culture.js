/* =====================================================================
   CULTURE — Events & celebrations, Recognition, Employee voice,
   Beyond BioAni. Only real, supplied content is ever rendered.
   ===================================================================== */
(function () {
  const IB = window.IB, esc = IB.esc;
  const mail = (subject, body) => IB.mailto(IB.config.submissionsEmail, subject, body);

  /* ---------------- Events & celebrations: scrapbook ---------------- */
  IB.components.EventGallery = {
    render: function (ed) {
      const E = ed.events || [];
      const head = '<div class="sec-head split"><div><div class="runhead">Culture: events & celebrations</div><h2 class="display h-l" id="ev-h" style="color:var(--navy)">The scrapbook</h2></div>' +
        '<p class="lede">Festivals, team days, wins worth a photo. The moments we\u2019ll look back on, pinned up for everyone.</p></div>';
      let body;
      if (E.length) {
        body = E.map(ev => '<article class="event"><div class="event-h"><h3>' + esc(ev.title) + '</h3>' + (ev.date ? '<time datetime="' + esc(ev.date) + '">' + esc(IB.formatISO(ev.date)) + '</time>' : '') +
          (ev.text ? '<p>' + esc(ev.text) + '</p>' : '') + '</div>' +
          '<div class="scrap">' + (ev.photos || []).map((ph, k) => {
            const cap = (ev.captions && ev.captions[k]) || '';
            return '<figure class="polaroid" data-drop-if-missing>' + IB.ui.portrait({ name: ev.title }, { file: ph, alt: cap || ev.title + ', photo ' + (k + 1), phLabel: 'Event photograph coming soon' }).replace(/^<figure/, '<div').replace(/<\/figure>$/, '</div>') +
              (cap ? '<figcaption>' + esc(cap) + '</figcaption>' : '') + '</figure>';
          }).join('') + '</div></article>').join('');
      } else {
        const frame = '<figure class="polaroid"><div class="portrait"><div class="ph" role="img" aria-label="Empty photo frame"><span class="ph-mono">Your photo here</span></div></div></figure>';
        body = '<div class="scrap scrap-empty">' + frame + frame + frame + '</div>' +
          '<div class="scrap-cta"><a class="btn btn-navy" href="' + esc(mail('Inside BioAni: event photos for ' + ed.label, 'Event name:\nDate:\nWho is in the photos:\n\n(Please attach your photos.)')) + '">Share event photos</a>' +
          '<p>Photos from this month\u2019s celebrations will be pinned here. Send yours with the event name and date.</p></div>';
      }
      return '<section class="sec events" id="events" aria-labelledby="ev-h"><div class="wrap">' + head + body + '</div></section>';
    }
  };

  /* ---------------- Recognition ---------------- */
  const star = '<svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M10 1.5l2.6 5.6 6 .6-4.5 4 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.5-4 6-.6z" fill="currentColor"/></svg>';
  IB.components.Recognition = {
    render: function (ed) {
      const R = ed.recognitions || [];
      const head = '<div class="sec-head split"><div><div class="runhead">Culture: recognition</div><h2 class="display h-l" id="rec-h" style="color:var(--navy)">Applause</h2></div>' +
        '<p class="lede">Employee of the month, a colleague who went the extra mile, a team that pulled it off. This is where we say thank you, out loud.</p></div>';
      const body = R.length
        ? '<div class="applause">' + R.map(r => {
            const p = r.employeeId ? IB.getEmployee(r.employeeId) : null;
            return '<article class="clap"><span class="award">' + star + esc(r.award) + '</span><div class="clap-p">' +
              (p ? IB.ui.portrait(p) : '') + '<h4>' + esc(p ? p.name : r.team || '') + '</h4></div>' + (r.text ? '<p>' + esc(r.text) + '</p>' : '') + '</article>';
          }).join('') + '</div>'
        : '<div class="empty"><h3 class="display">Know someone who deserves a round of applause?</h3><p>Recognitions for this month will appear here. Nominate a colleague or a team and tell us what they did.</p>' +
          '<a class="btn btn-green btn-sm" href="' + esc(mail('Inside BioAni: recognition nomination', 'I would like to recognise:\nTheir team:\nWhat they did:\n')) + '">Nominate a colleague</a></div>';
      return '<section class="sec recog" id="recognition" aria-labelledby="rec-h"><div class="wrap">' + head + body + '</div></section>';
    }
  };

  /* ---------------- Employee voice ---------------- */
  const PROMPTS = [
    'What I love about working at BioAni\u2026',
    'My favourite moment this month\u2026',
    'Something I learned\u2026',
    'What I\u2019m excited about\u2026'
  ];
  IB.components.EmployeeVoice = {
    render: function (ed) {
      const V = ed.employeeVoice || [];
      const prompts = '<div class="prompts">' + PROMPTS.map(p =>
        '<a class="prompt" href="' + esc(mail('Inside BioAni: ' + p.replace('\u2026', ''), p + '\n\n\nName:\nTeam:')) + '">' + esc(p) + '<small>Write yours</small></a>').join('') + '</div>';
      const voices = V.length
        ? '<div class="voices">' + V.map(v => {
            const p = IB.getEmployee(v.employeeId);
            return '<figure class="vq"><blockquote>' + esc(v.text) + '</blockquote><figcaption class="who">' + (p ? IB.ui.portrait(p) : '') +
              '<span><b>' + esc(p ? p.name : '') + '</b>' + (v.prompt ? '<span>' + esc(v.prompt) + '</span>' : '') + '</span></figcaption></figure>';
          }).join('') + '</div>'
        : '<div class="empty"><h3 class="display">Your words, in the next edition</h3><p>Pick a prompt and write a line or two. Real submissions from colleagues will be published here, with your name and photo.</p></div>';
      return '<section class="sec voice" id="voice" aria-labelledby="voice-h"><div class="wrap">' +
        '<div class="sec-head"><div class="runhead">Culture: employee voice</div><h2 class="display h-l" id="voice-h" style="color:var(--navy)">In your words</h2></div>' +
        '<div class="voice-grid">' + prompts + voices + '</div></div></section>';
    }
  };

  /* ---------------- Beyond BioAni ---------------- */
  IB.components.Beyond = {
    render: function (ed) {
      const S = ed.beyond || [];
      const body = S.length
        ? '<div class="beyond-grid">' + S.map(s => {
            const p = IB.getEmployee(s.employeeId);
            return '<article class="bstory">' + IB.ui.portrait(p || { name: s.title }, { file: s.photo || null, alt: s.title }) +
              '<div><span class="by">' + esc(p ? p.name : '') + '</span><h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p></div></article>';
          }).join('') + '</div>'
        : '<div class="hobbies" aria-label="Things we would love to hear about">' +
            ['\uD83C\uDFCF Sport', '\uD83C\uDFB5 Music', '\uD83C\uDFA8 Art', '\uD83C\uDF93 Certifications', '\uD83C\uDFC6 Competitions', '\uD83E\uDD1D Volunteering', '\u270D\uFE0F Writing', '\uD83C\uDFC3 Running']
            .map(h => '<span>' + h + '</span>').join('') + '</div>' +
          '<div class="empty"><h3 class="display">Tell us what you do beyond BioAni</h3><p>A marathon finished, a course completed, a painting, a medal, a cause you give your weekends to. Send it in and we\u2019ll tell your story here.</p>' +
          '<a class="btn btn-navy btn-sm" href="' + esc(mail('Inside BioAni: beyond BioAni story', 'Tell us what you did or love doing outside work:\n\n\nName:\nTeam:\n(Attach a photo if you like.)')) + '">Share your story</a></div>';
      return '<section class="sec beyond" id="beyond" aria-labelledby="beyond-h"><div class="wrap">' +
        '<div class="runhead">Culture: beyond BioAni</div>' +
        '<h2 class="beyond-statement" id="beyond-h">We are more than<em class="italic">our job titles.</em></h2>' + body + '</div></section>';
    }
  };
})();
