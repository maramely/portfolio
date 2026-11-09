/* ============================================
   REVEAL — blocks fade and rise into place as
   they scroll into view (once per block).

   Which blocks: the selectors in TARGETS below,
   per page; any element with data-reveal in the
   markup is added too, data-reveal="off" opts a
   block out. Timing, distance and easing — tokens
   --reveal-* in css/tokens.css.

   Safe by default: blocks are hidden only under
   html.js-reveal, which this script sets; only
   blocks below the screen at load are hidden, so
   the first screen never blinks. No animation with
   "reduce motion", in print, on the Guide You
   canvas, or for the block an anchor link leads to.

   Lists that page scripts redraw (case slides on
   load and on a language switch, project cards on
   a language switch) keep each block's state: a
   block that already appeared stays visible, one
   still waiting keeps waiting.
   ============================================ */

(function () {
  const root = document.documentElement;
  if (!('IntersectionObserver' in window) || !('MutationObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Guide You: slides are one seamless canvas, nothing moves there
  if (typeof CASE !== 'undefined' && CASE.layout === 'canvas') return;

  const PAGE = root.dataset.page || (document.querySelector('.hero') ? 'home' : '');
  const TARGETS = {
    home: [
      '.about__intro', '.about__photo', '.about__body',
      '.experience > .label', '.experience > .section-title', '.timeline > li',
      '.tools > .section-title', '.tools__chips',
      '.work__head', '.work .projects-grid > li',
      '.contact__title', '.contact__links > li'
    ],
    projects: ['.projects-grid > li'],
    case: [
      '.case-story__row', '.case-gallery__list > .case-facts-wrap',
      '.case-sec > .case-sec__num', '.case-sec > .case-sec__title',
      '.case-sec__body > :not(.case-columns, .case-stats, .case-hyp, .case-qa, .case-flow)',
      '.case-columns > li', '.case-stats > li', '.case-hyp > li', '.case-qa > li', '.case-flow > li',
      '.case-slide > .case-shot', '.case-pair > .case-shot',
      '.case-results', '.case-next'
    ]
  };
  // lists that get redrawn: their direct children are swapped for new ones
  const REDRAWN = '.case-gallery__list, [data-projects]';

  const selector = [...(TARGETS[PAGE] || []), '[data-reveal]'].join(', ');
  const token = (name, fallback) => parseFloat(getComputedStyle(root).getPropertyValue(name)) || fallback;
  const MAX_STEP = token('--reveal-max-steps', 4);

  const PENDING = 'pending';
  const candidates = (scope) => [...scope.querySelectorAll(selector)].filter((el) => el.dataset.reveal !== 'off');
  const isPending = (el) => el.dataset.reveal === PENDING && !el.classList.contains('is-revealed');

  // done: back to the plain element, nothing left over from the animation
  function finish(el) {
    el.classList.remove('is-revealed', 'is-instant');
    el.style.removeProperty('--reveal-step');
    if (el.dataset.reveal === PENDING) el.removeAttribute('data-reveal');
  }

  function show(el, step, instant) {
    io.unobserve(el);
    if (instant) {
      el.classList.add('is-instant', 'is-revealed');
      requestAnimationFrame(() => finish(el));
      return;
    }
    el.style.setProperty('--reveal-step', String(step));
    el.classList.add('is-revealed');
    const done = (e) => {
      if (e && (e.target !== el || e.propertyName !== 'opacity')) return;
      el.removeEventListener('transitionend', done);
      clearTimeout(timer);
      finish(el);
    };
    el.addEventListener('transitionend', done);
    // in case transitionend never comes (tab in background, element removed)
    const timer = setTimeout(done, token('--reveal-duration', 560) + MAX_STEP * token('--reveal-stagger', 70) + 200);
  }

  // blocks entering together appear top to bottom, a few steps at most
  const io = new IntersectionObserver((entries) => {
    entries
      .filter((e) => e.isIntersecting)
      .map((e) => e.target)
      .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
      .forEach((el, i) => show(el, Math.min(i, MAX_STEP)));
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });

  function hide(el) {
    el.dataset.reveal = PENDING;
    io.observe(el);
  }

  // an anchor's target (and what's in it) is shown at once
  function revealTarget(hash) {
    let target = null;
    try { target = hash && hash.length > 1 ? document.querySelector(decodeURIComponent(hash)) : null; } catch (e) { return; }
    if (!target) return;
    [target, ...candidates(target)].filter(isPending).forEach((el) => show(el, 0, true));
  }

  // a redrawn list: the n-th block of the new item takes the state of the
  // n-th block of the item it replaced (same layout in both languages)
  function carryOver(records) {
    records.forEach((record) => {
      const removed = [...record.removedNodes].filter((n) => n.nodeType === 1);
      const added = [...record.addedNodes].filter((n) => n.nodeType === 1);
      added.forEach((node, i) => {
        const before = removed[i] ? [removed[i], ...candidates(removed[i])].filter((el) => el.matches(selector)) : [];
        const after = [node, ...candidates(node)].filter((el) => el.matches(selector) && el.dataset.reveal !== 'off');
        after.forEach((el, j) => {
          if (before[j] && isPending(before[j])) hide(el);
          else if (el.dataset.reveal) el.removeAttribute('data-reveal');
        });
      });
      removed.forEach((node) => [node, ...candidates(node)].forEach((el) => io.unobserve(el)));
    });
  }

  function init() {
    try {
      root.classList.add('js-reveal');
      const fold = window.innerHeight;
      candidates(document).forEach((el) => {
        // on screen or above it at load: leave as it is (no blink)
        if (el.getBoundingClientRect().top < fold) {
          if (el.dataset.reveal) el.removeAttribute('data-reveal');
          return;
        }
        hide(el);
      });
      revealTarget(location.hash);

      const mo = new MutationObserver(carryOver);
      document.querySelectorAll(REDRAWN).forEach((list) => mo.observe(list, { childList: true }));

      window.addEventListener('hashchange', () => revealTarget(location.hash));
      document.addEventListener('click', (e) => {
        const link = e.target.closest && e.target.closest('a[href*="#"]');
        if (link && link.pathname === location.pathname) revealTarget(link.hash);
      });
      // print: everything visible
      window.addEventListener('beforeprint', () => candidates(document).filter(isPending).forEach((el) => show(el, 0, true)));
    } catch (e) {
      // never leave content hidden because of an error here
      root.classList.remove('js-reveal');
    }
  }

  // once the page is finished and in place (anchor, back / forward) and about
  // to be shown (js/main.js), so blocks already on screen are never hidden
  document.addEventListener('pageready', init, { once: true });
})();
