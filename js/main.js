/* ============================================
   MAIN
   Переключатель темы. Начальная тема ставится
   ещё в <head> (см. index.html), здесь только
   обработка клика и запоминание выбора.
   ============================================ */

function initThemeToggle() {
  const root = document.documentElement;

  document.querySelectorAll('.theme-toggle').forEach((btn) => {
    const sync = () => {
      const isDark = root.dataset.theme === 'dark';
      btn.setAttribute('aria-pressed', String(isDark));
      btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    };
    sync();

    btn.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('site-theme', root.dataset.theme); } catch (e) {}
      sync();
    });
  });
}

document.addEventListener('DOMContentLoaded', initThemeToggle);

/* Sticky header: glass bar once the page is scrolled. Two thresholds
   (on past 24px, off above 8px) so small scroll jitter can't flip it,
   checked once per frame, and the class only changes when the state does. */
let syncStickyNav = () => {};

function initStickyNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const ON = 24;
  const OFF = 8;
  let scrolled = window.scrollY > ON;
  let ticking = false;
  nav.classList.toggle('is-scrolled', scrolled);

  // state for the current position at once (after the page is put at an anchor)
  syncStickyNav = () => {
    scrolled = window.scrollY > ON;
    nav.classList.toggle('is-scrolled', scrolled);
  };

  const update = () => {
    ticking = false;
    const y = window.scrollY;
    const next = scrolled ? y >= OFF : y > ON;
    if (next === scrolled) return;
    scrolled = next;
    nav.classList.toggle('is-scrolled', scrolled);
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', initStickyNav);

/* Menu highlight follows the section in view (scroll-spy). A click
   highlights its item right away and the spy waits until the smooth
   scroll is over, so the pill doesn't flicker through the sections
   in between. */
let syncScrollSpy = () => {};

function initScrollSpy() {
  const links = [...document.querySelectorAll('.nav__links a[href^="#"]')];
  const items = links
    .map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) }))
    .filter((item) => item.section);
  if (!items.length) return;
  const pill = document.querySelector('.nav__links');
  let lockedUntil = 0;

  const indicator = pill.querySelector('.nav__indicator');

  // slide the dark pill under the active link
  function placeIndicator() {
    const link = pill.querySelector('a[aria-current]');
    if (!indicator || !link) return;
    // position of the <li> inside the pill (the link itself sits at 0 in its <li>)
    indicator.style.setProperty('--ind-x', `${link.parentElement.offsetLeft}px`);
    indicator.style.setProperty('--ind-w', `${link.offsetWidth}px`);
    pill.classList.add('has-indicator');
  }

  function setActive(link) {
    if (link.hasAttribute('aria-current')) return;
    links.forEach((l) => l.removeAttribute('aria-current'));
    link.setAttribute('aria-current', 'location');
    placeIndicator();
    // on phones the pill scrolls sideways: keep the active item visible
    if (pill.scrollWidth > pill.clientWidth) {
      pill.scrollTo({ left: link.parentElement.offsetLeft - pill.clientWidth / 2 + link.offsetWidth / 2, behavior: 'smooth' });
    }
  }

  function update() {
    if (Date.now() < lockedUntil) return;
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) return setActive(items[items.length - 1].link);
    const line = window.innerHeight * 0.35; // a section is "current" once its top passes this line
    let current = items[0];
    for (const item of items) {
      if (item.section.getBoundingClientRect().top <= line) current = item;
    }
    setActive(current.link);
  }

  links.forEach((link) => link.addEventListener('click', () => {
    setActive(link);
    lockedUntil = Date.now() + 900;
    setTimeout(update, 950);
  }));

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; update(); });
  }, { passive: true });
  update();
  syncScrollSpy = update; // after the page is put at an anchor, before it is shown

  // first placement without animation, then switch transitions on
  placeIndicator();
  requestAnimationFrame(() => requestAnimationFrame(() => pill.classList.add('is-ready')));

  // link widths change with the language, fonts and screen size
  new ResizeObserver(placeIndicator).observe(pill);
  links.forEach((l) => new ResizeObserver(placeIndicator).observe(l));
}

document.addEventListener('DOMContentLoaded', initScrollSpy);

/* Opening a page with an anchor (index.html#projects): js/i18n.js rewrites
   the address to …/en#projects before the browser jumps to the anchor,
   and that cancels the jump. Make it ourselves, without animation. Fonts
   and pictures that arrive later may move the target: put it back once,
   unless the visitor has started scrolling. */
function placeAtAnchor() {
  const root = document.documentElement;
  if (!root.classList.contains('is-anchoring')) return;
  root.classList.remove('is-anchoring');
  let target = null;
  try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (e) {}
  if (!target) return;
  const place = () => target.scrollIntoView({ behavior: 'instant', block: 'start' });
  place();

  const top = target.getBoundingClientRect().top;
  let touched = false;
  const stop = () => { touched = true; };
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((type) => window.addEventListener(type, stop, { once: true, passive: true }));
  const loaded = new Promise((resolve) => (document.readyState === 'complete' ? resolve() : window.addEventListener('load', resolve, { once: true })));
  Promise.all([loaded, document.fonts ? document.fonts.ready : null]).then(() => {
    if (!touched && Math.abs(target.getBoundingClientRect().top - top) > 1) place();
  });
}

/* Show the page (html.is-booting, set in <head>) once it is finished: in the
   frame after all DOMContentLoaded handlers (language, cards, slides), before
   it is painted. Put it at an anchor first, give the header the state for
   that position while its transitions are still off, then show and tell
   js/reveal.js ('pageready'). Back / forward: the browser puts the scroll
   back by itself, a little after the page has loaded; stay hidden until it
   has (the position this page had when it was left, saved on pagehide), and
   put it there ourselves if the browser hasn't within 0.8 s. */
const SCROLL_KEY = `scroll:${location.pathname}${location.search}`;
window.addEventListener('pagehide', () => {
  try { sessionStorage.setItem(SCROLL_KEY, String(Math.round(window.scrollY))); } catch (e) {}
});

function finishBoot() {
  const show = () => requestAnimationFrame(() => {
    placeAtAnchor();
    syncStickyNav();
    syncScrollSpy();
    void document.querySelector('.nav')?.offsetHeight; // apply the header state before transitions return
    document.documentElement.classList.remove('is-booting');
    document.dispatchEvent(new Event('pageready'));
  });
  const nav = performance.getEntriesByType?.('navigation')[0];
  let saved = 0;
  try { saved = Number(sessionStorage.getItem(SCROLL_KEY)) || 0; } catch (e) {}
  if (nav?.type !== 'back_forward' || history.scrollRestoration !== 'auto' || !saved) {
    show();
    return;
  }
  const start = performance.now();
  const wait = () => {
    const target = Math.min(saved, document.documentElement.scrollHeight - window.innerHeight);
    if (Math.abs(window.scrollY - target) < 2) return show();
    if (performance.now() - start > 800) {
      window.scrollTo({ top: target, behavior: 'instant' });
      return show();
    }
    requestAnimationFrame(wait);
  };
  requestAnimationFrame(wait);
}

document.addEventListener('DOMContentLoaded', finishBoot);

/* ============================================
   HERO GLASS — одноразовая сборка стеклянной
   композиции. Фрагменты стартуют разбросанными,
   размытыми, прозрачными и повёрнутыми, затем по
   слоям (пятна → карточка → её содержимое →
   парящие элементы) долетают на место за ~1.7 с.
   Переключатель включается в последние полсекунды
   и встаёт на место вместе с последним элементом —
   после этого всё статично. Финальное состояние —
   обычный вид разметки, поэтому без JS и при
   «уменьшении движения» он виден сразу.
   ============================================ */

function assembleHeroGlass() {
  const scene = document.querySelector('.hero-glass');
  if (!scene || getComputedStyle(scene).display === 'none') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const pieces = [...scene.querySelectorAll('.hg__p')];
  const toggle = scene.querySelector('.hg__toggle');
  const rand = (min, max) => min + Math.random() * (max - min);
  const STAGE_DELAY = [0, 150, 420, 650]; // ms, by data stage (--s)

  // 1. scatter (the toggle also starts "off")
  toggle?.classList.add('is-off');
  pieces.forEach((el) => {
    const isOrb = el.classList.contains('hg__orb');
    el.style.transition = 'none';
    el.style.opacity = '0';
    el.style.scale = isOrb ? '0.4' : String(rand(0.5, 0.8));
    if (!isOrb) {
      el.style.translate = `${rand(-40, 40)}cqw ${rand(-30, 30)}cqw`;
      el.style.rotate = `${rand(-25, 25)}deg`;
      el.style.filter = 'blur(10px)';
    }
  });

  // 2. next frame: everything flies home, layer by layer
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const FLY = 900;    // ms each piece takes to land
      const SWITCH = 550; // ms the toggle knob takes (see .hg__toggle::after)
      let end = 0;        // when the last piece lands

      pieces.forEach((el) => {
        const stage = Number(getComputedStyle(el).getPropertyValue('--s')) || 0;
        const delay = STAGE_DELAY[stage] + (stage >= 2 ? Math.round(rand(0, 200)) : 0);
        const ease = stage === 3 ? 'cubic-bezier(0.34, 1.4, 0.64, 1)' : 'var(--ease)';
        el.style.transition = ['translate', 'rotate', 'scale', 'filter', 'opacity']
          .map((prop) => `${prop} ${FLY}ms ${ease} ${delay}ms`)
          .join(', ');
        ['opacity', 'scale', 'translate', 'rotate', 'filter'].forEach((prop) => { el.style[prop] = ''; });
        end = Math.max(end, delay + FLY);
      });

      // 3. the toggle switches on during the last beat, so its knob
      //    settles at the same moment as the last piece
      setTimeout(() => toggle?.classList.remove('is-off'), end - SWITCH);

      // 4. done — drop the transitions; nothing animates after this
      setTimeout(() => pieces.forEach((el) => { el.style.transition = ''; }), end + 50);
    });
  });
}

document.addEventListener('DOMContentLoaded', assembleHeroGlass);

/* Toolkit: a chip widens on hover, and that must not push a chip to the next
   row (the page below would jump). Rows are worked out with room for one open
   chip (css/style.css), then pinned with explicit line breaks. The last row
   never holds a single chip if the row before it can give one away. */
function pinToolRows() {
  document.querySelectorAll('.tools__chips').forEach((list) => {
    list.querySelectorAll('.tools__break').forEach((el) => el.remove());
    list.classList.remove('is-set');
    const chips = [...list.querySelectorAll('.tool')];
    const starts = chips.filter((chip, i) => i && chip.offsetTop > chips[i - 1].offsetTop);
    const lastChip = chips.length - 1;
    if (starts.at(-1) === chips[lastChip] && !starts.includes(chips[lastChip - 1])) starts[starts.length - 1] = chips[lastChip - 1];
    starts.forEach((chip) => {
      const br = document.createElement('li');
      br.className = 'tools__break';
      br.setAttribute('aria-hidden', 'true');
      chip.before(br);
    });
    list.classList.add('is-set');
  });
}

if (document.querySelector('.tools__chips')) {
  let lastWidth = window.innerWidth;
  pinToolRows();
  document.fonts?.ready.then(pinToolRows);
  window.addEventListener('resize', () => {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    pinToolRows();
  });
}
