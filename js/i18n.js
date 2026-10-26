/* ============================================
   i18n — переключение EN / RU
   Как это работает:
   1. Каждый элемент с текстом, который должен
      переводиться, помечен data-i18n="ключ"
      (для alt картинок — data-i18n-alt)
   2. При переключении языка мы проходим по всем
      таким элементам и берём перевод из CONTENT
   3. Язык живёт в адресе: …/en или …/ru
      (если страница открыта файлом — адрес не
      меняется, язык всё равно переключается).
      Переключатель меняет адрес без перезагрузки
      (history API). Если страницу открыли сразу
      по …/ru, GitHub Pages отдаёт 404.html — он
      перекидывает на index.html?lang=ru, а здесь
      адрес возвращается к …/ru.
   4. Выбор ещё и запоминается в localStorage —
      на случай захода на адрес без языка.
   ============================================ */

const LANGS = ['en', 'ru'];
const LANG_IN_PATH = /\/(en|ru)\/?$/;

// Site root, e.g. "/portfolio/" — the path without index.html or /en|/ru
function siteBase() {
  let path = location.pathname.replace(/index\.html$/, '').replace(LANG_IN_PATH, '/');
  if (!path.endsWith('/')) path += '/';
  return path;
}

// the home page lives at the site root, …/index.html or …/en|/ru
function isHomePage() {
  return /\/(index\.html|en\/?|ru\/?)?$/.test(location.pathname);
}

function langFromUrl() {
  const fromPath = location.pathname.match(LANG_IN_PATH)?.[1];
  const fromQuery = new URLSearchParams(location.search).get('lang');
  return [fromPath, fromQuery].find((l) => LANGS.includes(l)) || null;
}

/* Job duration under role/dates: data-start="2025-03" data-end="2025-10|present".
   Months are counted inclusively (Mar–Oct = 8), like on LinkedIn; under a
   year it shows months, otherwise years rounded to half a year. */
function formatDuration(start, end, lang) {
  const [sy, sm] = start.split('-').map(Number);
  const now = new Date();
  const [ey, em] = end === 'present' ? [now.getFullYear(), now.getMonth() + 1] : end.split('-').map(Number);
  const months = (ey - sy) * 12 + (em - sm) + 1;

  if (months < 12) {
    return lang === 'ru' ? `${months} мес.` : `${months} ${months === 1 ? 'mo' : 'mos'}`;
  }
  const years = Math.round(months / 6) / 2;
  if (lang === 'ru') {
    const n = String(years).replace('.', ',');
    if (!Number.isInteger(years)) return `${n} года`;
    const mod10 = years % 10, mod100 = years % 100;
    const word = mod10 === 1 && mod100 !== 11 ? 'год'
      : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? 'года' : 'лет';
    return `${n} ${word}`;
  }
  return `${years} ${years === 1 ? 'yr' : 'yrs'}`;
}

function applyLanguage(lang, { push = false } = {}) {
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const value = CONTENT[lang]?.[key];
    if (value) el.textContent = value;
  });

  document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
    const value = CONTENT[lang]?.[el.getAttribute('data-i18n-alt')];
    if (value) el.alt = value;
  });

  document.querySelectorAll('[data-start]').forEach((el) => {
    el.textContent = formatDuration(el.dataset.start, el.dataset.end, lang);
  });

  document.querySelectorAll('.lang-switch__opt').forEach((opt) => {
    const active = opt.dataset.lang === lang;
    if (active) opt.setAttribute('aria-current', 'true');
    else opt.removeAttribute('aria-current');
  });

  // keep the address in sync: …/en or …/ru (hash is preserved).
  // Only over http(s) — a page opened as a file may not change its path —
  // and only on the home page: other pages (cases/*.html) keep their address.
  if (location.protocol.startsWith('http') && isHomePage()) {
    const url = siteBase() + lang + location.hash;
    if (url !== location.pathname + location.search + location.hash) {
      try {
        history[push ? 'pushState' : 'replaceState']({ lang }, '', url);
      } catch (e) { /* keep the current address */ }
    }
  }

  try { localStorage.setItem('site-lang', lang); } catch (e) {}

  // let page scripts re-render language-dependent content (js/case.js)
  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

function initLanguage() {
  // handlers first: the switch keeps working even if something below fails
  document.querySelectorAll('.lang-switch__opt').forEach((opt) => {
    opt.addEventListener('click', (e) => {
      e.preventDefault();
      if (opt.dataset.lang !== document.documentElement.lang) {
        applyLanguage(opt.dataset.lang, { push: true });
      }
    });
  });

  // back / forward between /en and /ru
  window.addEventListener('popstate', () => {
    const lang = langFromUrl();
    if (lang) applyLanguage(lang);
  });

  let saved = null;
  try { saved = localStorage.getItem('site-lang'); } catch (e) {}
  const browserLang = navigator.language.startsWith('ru') ? 'ru' : 'en';
  applyLanguage(langFromUrl() || saved || browserLang);
}

document.addEventListener('DOMContentLoaded', initLanguage);
