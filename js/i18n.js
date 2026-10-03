/* ============================================
   i18n — переключение RU / EN
   Как это работает:
   1. Каждый элемент с текстом, который должен
      переводиться, помечен data-i18n="ключ"
   2. При переключении языка мы проходим по всем
      таким элементам и берём перевод из CONTENT
   3. Выбор языка запоминается в localStorage,
      чтобы не сбрасывался при переходе по страницам
   ============================================ */

function applyLanguage(lang) {
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const value = CONTENT[lang]?.[key];
    if (value) el.textContent = value;
  });

  document.querySelectorAll('.lang-toggle').forEach((btn) => {
    btn.textContent = lang === 'ru' ? 'EN' : 'RU';
    btn.setAttribute('aria-label', lang === 'ru' ? 'Switch to English' : 'Переключить на русский');
  });

  localStorage.setItem('site-lang', lang);
}

function initLanguage() {
  const saved = localStorage.getItem('site-lang');
  const browserLang = navigator.language.startsWith('ru') ? 'ru' : 'en';
  const lang = saved || browserLang;
  applyLanguage(lang);

  document.querySelectorAll('.lang-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.lang;
      applyLanguage(current === 'ru' ? 'en' : 'ru');
    });
  });
}

document.addEventListener('DOMContentLoaded', initLanguage);
