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
