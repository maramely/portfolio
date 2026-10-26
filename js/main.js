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

/* Sticky header: glass background once the page is scrolled */
function initStickyNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const update = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

document.addEventListener('DOMContentLoaded', initStickyNav);

/* Menu highlight follows the section in view (scroll-spy). A click
   highlights its item right away and the spy waits until the smooth
   scroll is over, so the pill doesn't flicker through the sections
   in between. */
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

  // first placement without animation, then switch transitions on
  placeIndicator();
  requestAnimationFrame(() => requestAnimationFrame(() => pill.classList.add('is-ready')));

  // link widths change with the language, fonts and screen size
  new ResizeObserver(placeIndicator).observe(pill);
  links.forEach((l) => new ResizeObserver(placeIndicator).observe(l));
}

document.addEventListener('DOMContentLoaded', initScrollSpy);

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
