/* =====================================================================
   OUR BUSINESS, PRODUCT SPOTLIGHT, INNOVATION, QUICK GAME CORNER
   ===================================================================== */
(function () {
  const IB = window.IB, esc = IB.esc;

  const MOTIFS = {
    leaf: '<svg class="motif" viewBox="0 0 120 120" aria-hidden="true"><path d="M20 100C20 50 55 18 104 16c0 50-32 86-84 84z" fill="#DCE9E1" stroke="#1B4D43" stroke-width="2.5"/><path d="M24 96C48 70 70 50 96 26" stroke="#1B4D43" stroke-width="2.5" fill="none"/><path d="M44 74l-2-20M58 60l-1-22M72 48l2-18M50 70l20 2M64 56l20 0" stroke="#1B4D43" stroke-width="1.6"/><circle cx="96" cy="92" r="12" fill="#9BC92E"/></svg>',
    capsule: '<svg class="motif" viewBox="0 0 120 120" aria-hidden="true"><g transform="rotate(-35 60 60)"><rect x="18" y="42" width="84" height="36" rx="18" fill="#fff" stroke="#1B4D43" stroke-width="2.5"/><path d="M60 42h24a18 18 0 0 1 0 36H60z" fill="#2B6254"/></g><circle cx="26" cy="26" r="7" fill="#9BC92E"/><circle cx="98" cy="96" r="5" fill="#5E9A78"/><circle cx="96" cy="24" r="3" fill="#2B6254"/></svg>',
    paw: '<svg class="motif" viewBox="0 0 120 120" aria-hidden="true"><ellipse cx="60" cy="76" rx="24" ry="20" fill="#1B4D43"/><ellipse cx="32" cy="50" rx="9" ry="12" fill="#1B4D43"/><ellipse cx="50" cy="34" rx="9" ry="12" fill="#1B4D43"/><ellipse cx="72" cy="34" rx="9" ry="12" fill="#1B4D43"/><ellipse cx="89" cy="50" rx="9" ry="12" fill="#1B4D43"/><path d="M60 64l3 7 7 .5-5.5 4.5 2 7-6.5-4-6.5 4 2-7-5.5-4.5 7-.5z" fill="#9BC92E"/></svg>',
    cell: '<span class="motif">' + IB.svg.cell('rgba(220,233,225,.18)', '#9BC92E') + '</span>'
  };

  /* ---------------- Our business ---------------- */
  IB.components.Business = {
    render: function () {
      const B = IB.businesses || [];
      const unverified = B.some(b => !b.verified);
      return '<section class="sec biz on-dark" id="business" aria-labelledby="biz-h"><div class="wrap">' +
        '<div class="sec-head split"><div><div class="runhead">Our business</div><h2 class="display h-l" id="biz-h">Four businesses, one living science</h2></div>' +
        '<p class="lede">Whatever your team, your work feeds one of these. Here is the family of businesses we build together, from human wellness to healthier soil.</p></div>' +
        '<div class="biz-grid">' + B.map(b =>
          '<article class="biz-tile" id="biz-' + esc(b.id) + '">' + (MOTIFS[b.motif] || '') +
          '<span class="kind">' + esc(b.kind) + '</span><h3>' + esc(b.name) + '</h3><p class="line">' + esc(b.line) + '</p><p>' + esc(b.text) + '</p></article>').join('') +
        '</div>' +
        '<p class="biz-foot">Looking for the full company story? It lives on <a href="' + esc(IB.config.officialSite) + '" target="_blank" rel="noopener">bioani.in</a>.</p>' +
        (unverified ? '<p class="editor-note">Editor: business descriptions are paraphrased from public text on bioani.in. The animal-nutrition text is placed under Zenivet by assumption. Verify with each business, then set verified: true in data/company.js.</p>' : '') +
        '</div></section>';
    }
  };

  /* ---------------- Product spotlight ---------------- */
  const tick = '<svg viewBox="0 0 18 18" aria-hidden="true"><circle cx="9" cy="9" r="8" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M5 9.5l2.6 2.4L13 6.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  IB.components.ProductSpotlight = {
    render: function (ed) {
      const pr = ed.productSpotlight;
      let stage, body;
      if (pr && pr.name) {
        const imgs = (pr.images || (pr.image ? [pr.image] : [])).map(f => IB.photoSrc(f)).filter(Boolean);
        const title = (pr.brand ? pr.brand + ' ' : '') + pr.name;
        const shop = pr.amazonUrl ? ' href="' + esc(pr.amazonUrl) + '" target="_blank" rel="noopener"' : '';
        const tagName = pr.amazonUrl ? 'a' : 'div';
        const turns = imgs.length !== 1; // photo turntable (2+) or the cube (no photos)
        const hint = pr.amazonUrl ? (turns ? 'Drag to turn \u00B7 tap to open on Amazon' : 'Tap to open on Amazon') : (turns ? 'Drag to turn' : '');
        let inner;
        if (imgs.length) {
          // Photo mode: each photo is one angle; dragging steps through them like a turntable.
          inner = '<div class="spin" data-frames="' + imgs.length + '">' + imgs.map((src, i) =>
            '<img src="' + esc(src) + '" alt="' + (i === 0 ? esc(title) + ' product photograph' : '') + '"' + (i ? ' aria-hidden="true"' : '') + ' class="' + (i === 0 ? 'on' : '') + '" draggable="false" data-ph-name="' + esc(pr.name) + '">').join('') + '</div>';
        } else {
          // No photos yet: a turning typographic cube built only from listing facts.
          const d = pr.details || [];
          const face = (cls, html) => '<div class="face ' + cls + '">' + html + '</div>';
          inner = '<div class="cube-scene" aria-hidden="true"><div class="cube">' +
            face('f', '<span class="b">' + esc(pr.brand || '') + '</span><span class="n">' + esc(pr.name) + '</span><span class="c">' + esc(pr.category || '') + '</span><span class="dots"><i></i><i></i><i></i><i></i><i></i></span>') +
            face('r', '<span class="k">Inside</span><span class="t">' + esc(d[0] || '') + '</span>') +
            face('bk', '<span class="k">Taste</span><span class="t">' + esc(d[1] || '') + '</span>') +
            face('l', '<span class="k">Every day</span><span class="t">' + esc(d[3] || d[2] || '') + '</span>') +
            face('tp', '') + '</div></div>';
        }
        stage = '<div class="stage-wrap"><' + tagName + ' class="stage stage-3d' + (imgs.length ? ' has-photos' : '') + '"' + shop +
          ' aria-label="' + esc(title) + (pr.amazonUrl ? ', open on Amazon (new tab)' : '') + '">' +
          '<span class="orbit" aria-hidden="true"></span>' + inner + '<span class="plinth" aria-hidden="true"></span>' +
          (pr.amazonUrl ? '<span class="shop-pill" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Amazon</span>' : '') +
          '</' + tagName + '>' + (hint ? '<p class="stage-hint"><span class="ico" aria-hidden="true">\u21BB</span>' + esc(hint) + '</p>' : '') +
          (!imgs.length ? '<p class="editor-note">Editor: add product photos (front, angles, back) to productSpotlight.images; two or more become a drag-to-turn 360\u00B0 view.</p>' : '') + '</div>';
        body = '<span class="tag">Product of the month</span>' +
          (pr.brand ? '<p class="brand">' + esc(pr.brand) + '</p>' : '') + '<h3>' + esc(pr.name) + '</h3>' +
          (pr.category ? '<p class="cat">' + esc(pr.category) + '</p>' : '') +
          (pr.description ? '<p class="desc">' + esc(pr.description) + '</p>' : '') +
          ((pr.details || []).length ? '<ul>' + pr.details.map(d => '<li>' + tick + '<span>' + esc(d) + '</span></li>').join('') + '</ul>' : '') +
          (pr.detailsNote ? '<p class="src">' + esc(pr.detailsNote) + '</p>' : '') +
          (pr.whyFeatured ? '<p class="why">' + esc(pr.whyFeatured) + '</p>' : '') +
          (pr.amazonUrl ? '<a class="btn btn-navy" href="' + esc(pr.amazonUrl) + '" target="_blank" rel="noopener">View on Amazon <span aria-hidden="true">\u2197</span><span class="sr-only"> (opens in a new tab)</span></a>' : '') +
          (pr.fullName ? '<p class="full">' + esc(pr.fullName) + '</p>' : '');
      } else {
        stage = '<div class="stage"><div class="stage-empty">' + IB.svg.cell('#fff', '#1B4D43') + '<span>Product photograph coming soon</span></div></div>';
        body = '<span class="tag">Product of the month</span><h3>This month\u2019s spotlight</h3>' +
          '<p class="lede">Each edition, one product from across our businesses takes centre stage: what it is, what goes into it, and the people behind it.</p>' +
          '<p class="editor-note">Editor: set productSpotlight in data/editions/' + esc(ed.id) + '.js.</p>';
      }
      return '<section class="sec product" id="product" aria-labelledby="prod-h"><div class="wrap">' +
        '<div class="runhead" id="prod-h">Our business: product spotlight</div>' +
        '<div class="prod-grid">' + stage + '<div class="prod-b">' + body + '</div></div></div></section>';
    },
    mount: function () {
      const st = document.querySelector('#product .stage-3d');
      if (!st) return;
      const spin = st.querySelector('.spin'), cube = st.querySelector('.cube');
      const frames = spin ? [...spin.querySelectorAll('img')] : [];
      let angle = -24, idx = 0, down = false, lastX = 0, moved = 0, acc = 0, idle = true, raf = null, resume = null;
      const still = IB.reducedMotion();
      const show = i => { idx = (i + frames.length) % frames.length; frames.forEach((f, k) => f.classList.toggle('on', k === idx)); };
      const paint = () => { if (cube) cube.style.transform = 'rotateX(-9deg) rotateY(' + angle + 'deg)'; };
      paint();
      let t0 = 0;
      const loop = t => {
        if (idle && !still) {
          if (cube) { angle -= .22; paint(); }
          else if (frames.length > 1 && t - t0 > 900) { t0 = t; show(idx + 1); }
        }
        raf = requestAnimationFrame(loop);
      };
      // Only animate while the stage is on screen.
      new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting && !raf) raf = requestAnimationFrame(loop);
        else if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = null; }
      })).observe(st);
      // Single photo: a gentle 3D tilt that follows the pointer.
      if (spin && frames.length === 1 && !still) {
        st.addEventListener('pointermove', e => {
          if (e.pointerType !== 'mouse') return;
          const r = st.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
          spin.style.transform = 'perspective(900px) rotateY(' + (x * 14).toFixed(2) + 'deg) rotateX(' + (-y * 10).toFixed(2) + 'deg)';
        });
        st.addEventListener('pointerleave', () => { spin.style.transform = ''; });
      }
      st.addEventListener('pointerdown', e => { down = true; moved = 0; acc = 0; lastX = e.clientX; idle = false; clearTimeout(resume); });
      st.addEventListener('pointermove', e => {
        if (!down) return;
        const dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx);
        if (cube) { angle += dx * .45; paint(); }
        else if (frames.length > 1) { acc += dx; if (Math.abs(acc) > 28) { show(idx + (acc > 0 ? -1 : 1)); acc = 0; } }
      });
      const up = () => { if (!down) return; down = false; resume = setTimeout(() => { idle = true; }, 2600); };
      st.addEventListener('pointerup', up); st.addEventListener('pointercancel', up); st.addEventListener('pointerleave', up);
      // A drag turns the product; only a clean tap follows the Amazon link.
      st.addEventListener('click', e => { if (moved > 8) e.preventDefault(); });
      st.addEventListener('keydown', e => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        e.preventDefault(); idle = false; clearTimeout(resume); resume = setTimeout(() => { idle = true; }, 4000);
        const dir = e.key === 'ArrowLeft' ? -1 : 1;
        if (cube) { angle += dir * 30; paint(); } else show(idx + dir);
      });
    }
  };

  /* ---------------- Innovation ---------------- */
  IB.components.Innovation = {
    render: function (ed) {
      const steps = IB.microalgaeSteps || [];
      const stories = ed.innovationStories || [];
      return '<section class="sec innov" id="innovation" aria-labelledby="innov-h"><div class="wrap">' +
        '<div class="sec-head split"><div><div class="runhead">Innovation</div><h2 class="display h-l" id="innov-h" style="color:var(--navy)">How BioAni grows microalgae</h2></div>' +
        '<p class="lede">Microalgae are tiny, sun-powered cells. BioAni calls them its core biological engine. This is the journey from a single strain to an ingredient, explained for every team.</p></div>' +
        '<ol class="steps">' + steps.map((s, i) => '<li><span class="dot" aria-hidden="true">' + (i + 1) + '</span><h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p></li>').join('') + '</ol>' +
        '<p class="steps-src">Based on how BioAni describes its microalgae platform on bioani.in.</p>' +
        (stories.length
          ? '<div class="stories">' + stories.map(s => '<article class="story">' + (s.image ? IB.ui.portrait({ name: s.title }, { file: s.image, alt: s.title }) : '') +
              '<div class="story-b"><h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p></div></article>').join('') + '</div>'
          : '<div class="empty stories-empty"><h3 class="display">Innovation stories</h3><p>R&amp;D updates, new processes and the experiments behind our products will be shared here as our teams publish them.</p>' +
            '<p class="editor-note">Editor: add innovationStories in data/editions/' + esc(ed.id) + '.js.</p></div>') +
        '</div></section>';
    }
  };

  /* ---------------- Quick game corner: Grow the culture ---------------- */
  const FLASK_TOP = 70, FLASK_BOTTOM = 250; // liquid travel in SVG units
  function flaskSVG() {
    return '<svg class="flask" viewBox="0 0 200 270" role="img" aria-labelledby="flask-t"><title id="flask-t">A flask that fills with green microalgae as you answer correctly</title>' +
      '<defs><clipPath id="fclip"><path d="M78 20h44v70l58 140a20 20 0 0 1-18 28H38a20 20 0 0 1-18-28L78 90z"/></clipPath>' +
      '<linearGradient id="alg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5E9A78"/><stop offset="1" stop-color="#1B4D43"/></linearGradient></defs>' +
      '<g clip-path="url(#fclip)"><rect width="200" height="270" fill="#EEF3EF"/>' +
      '<g class="liquid" style="transform:translateY(' + (FLASK_BOTTOM - FLASK_TOP + 20) + 'px)"><path d="M0 70 q25 -10 50 0 t50 0 t50 0 t50 0 V300 H0z" fill="url(#alg)"/>' +
      [[60, 200, 0], [100, 230, .8], [130, 190, 1.6], [85, 170, 2.2], [150, 225, 1.1]].map(b => '<circle class="bub" cx="' + b[0] + '" cy="' + b[1] + '" r="5" fill="#DCE9E1" style="animation-delay:' + b[2] + 's"/>').join('') +
      '</g></g>' +
      '<path d="M78 20h44v70l58 140a20 20 0 0 1-18 28H38a20 20 0 0 1-18-28L78 90z" fill="none" stroke="#1B4D43" stroke-width="4" stroke-linejoin="round"/>' +
      '<rect x="68" y="8" width="64" height="14" rx="5" fill="#9BC92E"/>' +
      '<path d="M140 150h14M146 180h14M152 210h14" stroke="#1B4D43" stroke-width="2" opacity=".4"/></svg>';
  }

  IB.components.QuickGame = {
    render: function () {
      const Q = IB.quiz;
      return '<section class="sec game" id="game" aria-labelledby="game-h"><div class="wrap">' +
        '<div class="sec-head split"><div><div class="runhead">Innovation: quick game corner</div><h2 class="display h-l" id="game-h" style="color:var(--navy)">' + esc(Q.title) + '</h2></div>' +
        '<p class="lede">' + esc(Q.intro) + '</p></div>' +
        '<div class="game-box"><div class="flask-wrap">' + flaskSVG() + '<div class="flask-meter" aria-live="polite">Flask 0% full</div></div>' +
        '<div class="q-area" aria-live="polite"></div></div></div></section>';
    },
    mount: function () {
      const root = document.getElementById('game');
      if (!root) return;
      const Q = IB.quiz.questions, area = root.querySelector('.q-area'), liquid = root.querySelector('.liquid'), meter = root.querySelector('.flask-meter');
      let i = 0, score = 0, results = [];
      const fill = () => {
        const pct = score / Q.length;
        const y = (FLASK_BOTTOM - FLASK_TOP + 20) * (1 - pct) + (pct === 1 ? -6 : 0);
        liquid.style.transform = 'translateY(' + y + 'px)';
        meter.textContent = 'Flask ' + Math.round(pct * 100) + '% full';
      };
      const prog = () => '<div class="q-prog" aria-hidden="true">' + Q.map((_, k) => '<i class="' + (k < results.length ? (results[k] ? 'done' : 'miss') : k === i ? 'now' : '') + '"></i>').join('') + '</div>';
      const L = 'ABCD';
      function show() {
        const q = Q[i];
        area.innerHTML = prog() + '<span class="q-count">Question ' + (i + 1) + ' of ' + Q.length + '</span>' +
          '<h3 class="q-text">' + esc(q.q) + '</h3><div class="q-opts" role="group" aria-label="Answers">' +
          q.options.map((o, k) => '<button type="button" class="q-opt" data-k="' + k + '"><span class="k" aria-hidden="true">' + L[k] + '</span>' + esc(o) + '</button>').join('') +
          '</div><div class="q-feedback"></div><div class="q-actions"></div>';
      }
      function end() {
        const msg = score === Q.length ? 'A perfect culture. Full to the brim.' : score >= Q.length - 2 ? 'A thriving culture. Nearly full.' : 'A good start. Every culture grows.';
        area.innerHTML = prog() + '<div class="q-end"><h3>' + esc(msg) + '</h3><p class="lede">You got ' + score + ' of ' + Q.length + ' right. Challenge the colleague sitting next to you.</p>' +
          '<div class="q-actions"><button type="button" class="btn btn-green" data-restart>Play again</button></div></div>';
        area.querySelector('[data-restart]').focus();
      }
      area.addEventListener('click', e => {
        const opt = e.target.closest('.q-opt');
        if (opt && !opt.disabled) {
          const q = Q[i], k = +opt.dataset.k, ok = k === q.answer;
          area.querySelectorAll('.q-opt').forEach(b => { b.disabled = true; if (+b.dataset.k === q.answer) b.classList.add('right'); });
          if (!ok) opt.classList.add('wrong');
          results.push(ok); if (ok) score++; fill();
          area.querySelector('.q-feedback').innerHTML = '<b>' + (ok ? 'Correct.' : 'Not quite. The answer is ' + esc(q.options[q.answer]) + '.') + '</b> ' + esc(q.why);
          const last = i === Q.length - 1;
          area.querySelector('.q-actions').innerHTML = '<button type="button" class="btn btn-navy" data-next>' + (last ? 'See your result' : 'Next question') + '</button>';
          area.querySelector('[data-next]').focus();
          return;
        }
        if (e.target.closest('[data-next]')) { i++; if (i < Q.length) { show(); area.querySelector('.q-opt').focus(); } else end(); return; }
        if (e.target.closest('[data-restart]')) { i = 0; score = 0; results = []; fill(); show(); area.querySelector('.q-opt').focus(); }
      });
      show();
    }
  };
})();
