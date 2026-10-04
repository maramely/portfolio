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

/* ============================================
   HERO GLASS — одноразовая сборка стеклянной
   композиции. Фрагменты стартуют разбросанными,
   размытыми, прозрачными и повёрнутыми, затем по
   слоям (пятна → карточка → её содержимое →
   парящие элементы) долетают на место за ~1.7 с
   и остаются статичными. Финальное состояние —
   обычный вид разметки, поэтому без JS и при
   «уменьшении движения» он виден сразу.
   ============================================ */

function assembleHeroGlass() {
  const scene = document.querySelector('.hero-glass');
  if (!scene || getComputedStyle(scene).display === 'none') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const pieces = [...scene.querySelectorAll('.hg__p')];
  const rand = (min, max) => min + Math.random() * (max - min);
  const STAGE_DELAY = [0, 150, 420, 650]; // ms, by data stage (--s)

  // 1. scatter
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
      pieces.forEach((el) => {
        const stage = Number(getComputedStyle(el).getPropertyValue('--s')) || 0;
        const delay = STAGE_DELAY[stage] + (stage >= 2 ? Math.round(rand(0, 200)) : 0);
        const ease = stage === 3 ? 'cubic-bezier(0.34, 1.4, 0.64, 1)' : 'var(--ease)';
        el.style.transition = ['translate', 'rotate', 'scale', 'filter', 'opacity']
          .map((prop) => `${prop} 0.9s ${ease} ${delay}ms`)
          .join(', ');
        ['opacity', 'scale', 'translate', 'rotate', 'filter'].forEach((prop) => { el.style[prop] = ''; });
      });

      // 3. done — drop the transitions, nothing animates after this
      setTimeout(() => pieces.forEach((el) => { el.style.transition = ''; }), 1900);
    });
  });
}

document.addEventListener('DOMContentLoaded', assembleHeroGlass);
