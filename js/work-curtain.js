/* ============================================
   WORK CURTAIN — home page, Selected work, desktop only.

   When the last row of cases has come well into view, the right card
   (cover, divider, year, title, text, tags, arrow: one piece) draws aside
   to the left and gives up a column of its own, on the right, to the way
   into the catalogue:
     +2 кейса               (how many cases the home page doesn't show)
     Посмотреть
     все ———————→           (a thin arrow in the accent, drawn after the words)
   Scrolling back up past the row closes it again.

   Two layouts, not a scrub: the scroll only decides open or closed (with
   a margin between the two thresholds, so it never flickers at a border);
   the move then plays to its end by itself, about a second:
     1. the card's words dim (so their lines can re-break unseen),
     2. the whole card narrows to its new width, the cover keeping its
        proportions,
     3. the words come back in the new layout,
     4. the count, the title and the arrow come in one after another; the
        arrow lies on the card's divider (the line under its cover).
   Closing plays it back. Each step is a Web Animation on a property of
   its own (width, opacity, translate, clip-path), so the hovers of the
   card and of the link (transform) are never touched. Turning midway
   starts from wherever the card is.

   Only from the full header up (min-width: 1101px) and without "reduce
   motion": then the script builds it. Narrower, or with "reduce motion",
   nothing is built and the section is exactly as before (its "View all"
   link and, on phones, the "All projects" button). Crossing the
   breakpoint tears it all down: no classes, styles or extra markup left.
   ============================================ */

(function () {
  if (typeof PROJECTS === 'undefined') return;
  const list = document.querySelector('.work [data-projects="featured"]');
  if (!list || !('animate' in Element.prototype)) return;

  const desktop = window.matchMedia('(min-width: 1101px)');
  const still = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ROOT = document.documentElement.dataset.root || '';
  const ARROW = '<svg viewBox="0 0 72 14" aria-hidden="true" focusable="false"><path d="M0 7h70M63.5 1 70 7l-6.5 6"/></svg>';

  // open once the top of the row is 55% down the screen; close again only
  // when it is back below 80%: between the two nothing changes
  const OPEN_AT = 0.55;
  const CLOSE_AT = 0.8;
  const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'; // --ease in css/tokens.css
  const EASE_OUT = 'cubic-bezier(0.33, 0, 0.2, 1)';

  let item = null;   // the last card's <li>
  let card = null;   // its link, the whole card
  let cta = null;    // the way to the catalogue
  let open = false;
  let active = false;
  let ticking = false;

  const text = (key) => {
    const lang = document.documentElement.lang;
    return (typeof CONTENT !== 'undefined' && CONTENT[lang]?.[key]) || '';
  };
  const typo = (value) => (typeof typograph === 'function' ? typograph(value, document.documentElement.lang) : value);

  function countLine() {
    const more = PROJECTS.filter((p) => p.ready).length - list.children.length;
    if (more <= 0) return '';
    const forms = text('work.moreCount') || {};
    const form = forms[new Intl.PluralRules(document.documentElement.lang).select(more)] || forms.other || '';
    return form.replace('{n}', more);
  }

  function build() {
    item = list.lastElementChild;
    card = item?.querySelector(':scope > .project-card');
    if (!card || list.children.length < 2) return false;

    // the title's lines are set per language (work.curtainLines), so each
    // breaks where it reads best; the plain title (work.more) if none
    const given = text('work.curtainLines');
    const lines = (Array.isArray(given) && given.length ? given : [text('work.more')]).map(typo);
    const count = countLine();

    cta = document.createElement('a');
    cta.className = 'curtain__cta';
    cta.href = `${ROOT}projects.html`;
    cta.setAttribute('aria-label', count ? `${text('projects.title')} (${count})` : text('projects.title'));
    cta.innerHTML = '<span class="curtain__inner">'
      + (count ? '<span class="curtain__count"></span>' : '')
      + `<span class="curtain__title">${'<span class="curtain__line"></span>'.repeat(lines.length)}</span>`
      + `<span class="curtain__arrow">${ARROW}</span></span>`;
    if (count) cta.querySelector('.curtain__count').textContent = typo(count);
    cta.querySelectorAll('.curtain__line').forEach((line, i) => { line.textContent = lines[i]; });

    item.classList.add('curtain');
    item.append(cta);
    measure();
    return true;
  }

  // the link's column plus the grid's own gap between it and the card (left
  // empty, it belongs to neither); and where the link stands (below)
  function measure() {
    if (!item) return;
    const moving = card.getAnimations();
    if (moving.length) { Promise.all(moving.map((m) => m.finished.catch(() => {}))).then(measure); return; }
    const inner = cta.querySelector('.curtain__inner');
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
    // the column's width is set in css/style.css (--curtain-col, from the
    // screen's width, the same in every language); only words too long for
    // it would widen it
    item.style.removeProperty('--curtain-cta-w');
    const width = Math.ceil(Math.max(cta.offsetWidth, inner.scrollWidth));
    item.style.setProperty('--curtain-cta-w', `${width}px`);
    item.style.setProperty('--curtain-shift', `${width + gap}px`);
    // the open layout's divider (the line between the card's cover and its
    // words) and the arrow's axis inside the link: the link is placed so
    // that its arrow lies on that line
    const wasOpen = item.classList.contains('is-open');
    item.classList.add('is-open');
    const body = card.querySelector('.project-card__body');
    const arrow = cta.querySelector('.curtain__arrow');
    const line = parseFloat(getComputedStyle(body).borderTopWidth) || 0;
    item.style.setProperty('--curtain-axis', `${(card.offsetTop + body.offsetTop + line / 2).toFixed(2)}px`);
    item.style.setProperty('--curtain-arrow-y', `${(arrow.offsetTop + arrow.offsetHeight / 2).toFixed(2)}px`);
    item.classList.toggle('is-open', wasOpen);
  }

  const parts = () => [...cta.querySelectorAll('.curtain__count, .curtain__line')];

  function stopAll() {
    [card, card.querySelector('.project-card__body'), cta, ...parts(), cta.querySelector('.curtain__arrow')]
      .forEach((el) => el && el.getAnimations().forEach((a) => a.cancel()));
  }

  // from one layout to the other; animate: false puts it there at once
  function setOpen(next, animate = true) {
    if (!item || (next === open && animate)) return;
    open = next;
    const from = card.getBoundingClientRect().width;
    stopAll();
    item.classList.toggle('is-open', next);
    if (!animate) return;
    const to = card.getBoundingClientRect().width;
    const body = card.querySelector('.project-card__body');
    const arrow = cta.querySelector('.curtain__arrow');

    // 1–3: the words dim, the card narrows (or widens), the words come back
    card.animate({ width: [`${from}px`, `${to}px`] }, { duration: 720, delay: next ? 90 : 160, easing: EASE, fill: 'backwards' });
    if (body) {
      body.animate([
        { opacity: 1, translate: '0 0' },
        { opacity: 0, translate: '0 0', offset: 0.15, easing: 'linear' },
        { opacity: 0, translate: '0 6px', offset: 0.46, easing: EASE },
        { opacity: 1, translate: '0 0' }
      ], { duration: 900 });
    }

    if (next) {
      // 4: the count, the two lines, then the arrow drawn from the left
      parts().forEach((el, i) => el.animate(
        { opacity: [0, 1], translate: ['16px 0', '0 0'] },
        { duration: 560, delay: 400 + i * 90, easing: EASE, fill: 'backwards' }
      ));
      arrow.animate(
        { clipPath: ['inset(-2px 100% -2px 0)', 'inset(-2px 0 -2px 0)'] },
        { duration: 620, delay: 400 + parts().length * 90 + 60, easing: EASE_OUT, fill: 'backwards' }
      );
    } else {
      // closing: the link steps back first, all at once, then the card returns
      cta.animate({ opacity: [1, 0], visibility: ['visible', 'visible'] }, { duration: 220, easing: EASE_OUT });
    }
  }

  function check() {
    ticking = false;
    if (!item) return;
    const top = item.getBoundingClientRect().top;
    const vh = window.innerHeight;
    if (!open && top <= vh * OPEN_AT) setOpen(true);
    else if (open && top > vh * CLOSE_AT) setOpen(false);
  }

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(check);
  };

  const onResize = () => {
    if (!item) return;
    stopAll();
    measure();
  };

  // a keyboard reaching the link opens the way to it
  const onFocus = (e) => { if (cta && e.target === cta) setOpen(true); };

  function teardown() {
    if (item) {
      stopAll();
      cta.remove();
      item.classList.remove('curtain', 'is-open');
      ['--curtain-shift', '--curtain-cta-w', '--curtain-axis', '--curtain-arrow-y'].forEach((name) => item.style.removeProperty(name));
    }
    item = card = cta = null;
    open = false;
  }

  // after a (re)draw of the cards: in the state the scroll calls for, at once
  function setup() {
    teardown();
    if (!active || !build()) return;
    const top = item.getBoundingClientRect().top;
    setOpen(top <= window.innerHeight * OPEN_AT, false);
  }

  function enable() {
    if (active) return;
    active = true;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('focusin', onFocus);
    setup();
  }

  function disable() {
    if (!active) return;
    active = false;
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('focusin', onFocus);
    teardown();
  }

  const sync = () => (desktop.matches && !still.matches ? enable() : disable());

  desktop.addEventListener('change', sync);
  still.addEventListener('change', sync);
  // the cards are drawn again on a language switch (js/projects.js):
  // build it on the new last card, in the new language
  document.addEventListener('langchange', () => { if (active) requestAnimationFrame(setup); });
  if (document.fonts) document.fonts.ready.then(() => { if (item) measure(); });
  window.addEventListener('load', () => { if (item) measure(); });
  sync();
})();
