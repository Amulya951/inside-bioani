/* =====================================================================
   APP — picks the edition, renders the magazine in running order,
   then mounts interactions. Change the running order in ORDER below.
   ===================================================================== */
(function () {
  const IB = window.IB;

  const ORDER = [
    'Cover', 'FounderMessage', 'MonthlyHero',
    'Leadership', 'NewJoiners', 'PromotionSpotlight', 'BirthdayCorner', 'Anniversaries',
    'Business', 'ProductSpotlight',
    'Innovation', 'QuickGame',
    'EventGallery', 'Recognition', 'EmployeeVoice', 'Beyond',
    'Opportunities', 'Archive', 'HRCorner'
  ];

  function pickEdition() {
    const q = new URLSearchParams(location.search).get('edition');
    if (q && IB.editions[q]) return IB.editions[q];
    if (q) console.warn('[Inside BioAni] Edition "' + q + '" not found. Showing the current edition.');
    return IB.editions[IB.config.currentEdition] || IB.editions[Object.keys(IB.editions).sort().pop()];
  }

  function start() {
    const ed = pickEdition();
    const app = document.getElementById('app');
    if (!ed) { app.innerHTML = '<p style="padding:40px">No edition data found. Check data/editions/.</p>'; return; }
    IB.state = { edition: ed };
    if (new URLSearchParams(location.search).get('editor') === '1') document.body.classList.add('editor');
    document.title = 'Inside BioAni | ' + ed.label;

    const C = IB.components;
    const sections = ORDER.map(name => {
      try { return C[name] ? C[name].render(ed) : ''; }
      catch (err) { console.error('[Inside BioAni] ' + name + ' failed to render:', err); return ''; }
    }).join('');
    app.innerHTML = C.Nav.render(ed) + '<main id="main" tabindex="-1">' + sections + '</main>' + C.Footer.render(ed) + C.WishDialog.render();

    Object.keys(C).forEach(name => {
      if (typeof C[name].mount === 'function') {
        try { C[name].mount(ed); } catch (err) { console.error('[Inside BioAni] ' + name + ' failed to mount:', err); }
      }
    });

    if (location.hash) { const t = document.getElementById(location.hash.slice(1)); if (t) setTimeout(() => t.scrollIntoView(), 50); }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
