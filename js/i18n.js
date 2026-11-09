/* ============================================
   i18n — переключение EN / RU
   Как это работает:
   1. Каждый элемент с текстом, который должен
      переводиться, помечен data-i18n="ключ"
      (для alt картинок — data-i18n-alt, для aria-label — data-i18n-aria, для href — data-i18n-href)
   2. При переключении языка мы проходим по всем
      таким элементам и берём перевод из CONTENT
   3. Язык живёт в адресе: …/en или …/ru
      (если страница открыта файлом — адрес не
      меняется, язык всё равно переключается).
      Переключатель меняет адрес без перезагрузки
      (history API). Если страницу открыли сразу
      по …/ru, открывается ru/index.html — он
      перекидывает на /?lang=ru, а здесь
      адрес возвращается к …/ru.
   4. Выбор ещё и запоминается в localStorage —
      на случай захода на адрес без языка.
   ============================================ */

const LANGS = ['en', 'ru'];
const LANG_IN_PATH = /\/(en|ru)\/?$/;

// Site root, e.g. "/" — the path without index.html or /en|/ru
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
   Months are counted inclusively, the first and the last one too (Mar–Oct = 8),
   like on LinkedIn; "present" is the current month. Shown as years and months, not rounded. */
function formatDuration(start, end, lang) {
  const [sy, sm] = start.split('-').map(Number);
  const now = new Date();
  const [ey, em] = end === 'present' ? [now.getFullYear(), now.getMonth() + 1] : end.split('-').map(Number);
  const total = (ey - sy) * 12 + (em - sm) + 1;
  const years = Math.floor(total / 12), months = total % 12;
  const parts = [];
  if (lang === 'ru') {
    const mod10 = years % 10, mod100 = years % 100;
    const word = mod10 === 1 && mod100 !== 11 ? 'год'
      : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? 'года' : 'лет';
    if (years) parts.push(`${years}\u00a0${word}`);
    if (months) parts.push(`${months}\u00a0мес.`);
  } else {
    if (years) parts.push(`${years}\u00a0${years === 1 ? 'yr' : 'yrs'}`);
    if (months) parts.push(`${months}\u00a0${months === 1 ? 'mo' : 'mos'}`);
  }
  return parts.join(' ');
}

/* ============================================
   TYPOGRAPH — non-breaking spaces, so lines don't end on a preposition,
   a dash doesn't start a line, a number stays with its unit and a short
   abbreviation isn't left alone on the last line.
   typograph(text, lang) works on a plain string; typographTree(root, lang)
   runs it over the text nodes of a subtree and leaves markup, attributes,
   <script>, <style>, <code> and SVG alone.
   ============================================ */
const NBSP = ' ';
const TYPO_SHORT = {
  ru: new Set(('в к с у о и а но на по за из от до во ко со об не ни же бы ли да ' +
    'как что для при про над под без или').split(' ')),
  en: new Set(['a', 'i', 'of', 'to', 'in', 'on'])
};
const IS_DASH = /^[—–]$/;
const IS_NUMBER = /^\d+(?:[.,]\d+)?(?:[–-]\d+)?[+%]?$/; // 10, 1,5, 6+, 40%, 21–30
const IS_ABBR = /^(?:[A-ZА-ЯЁ]{2,4}|[A-ZА-ЯЁ]{1,3}\/[A-ZА-ЯЁ]{1,3})$/; // ПО, ЕС, СНГ, UX/UI
const HAS_WORD = /[\p{L}\d]/u;
const OPENING = /^[«„“"'(\[]+/;
const CLOSING = /[»“”"')\].,:;!?…]+$/;

// How many real words a token holds (it may already be glued with NBSP).
// One- and two-letter prepositions don't count: "и в EdTech" stays one short
// piece, so neither "и" nor "в" is left at the end of a line.
const isTiny = (part) => part.replace(OPENING, '').length <= 2 && !/\d/.test(part);
const wordsIn = (token) => token.split(NBSP).filter((part) => HAS_WORD.test(part) && !isTiny(part)).length;

function isShortWord(token, lang) {
  const word = token.split(NBSP).pop().replace(OPENING, '');
  if (lang === 'en') return word === 'I' || (word !== 'I' && TYPO_SHORT.en.has(word.toLowerCase()));
  return TYPO_SHORT.ru.has(word.toLowerCase());
}

function typograph(text, lang) {
  if (!text) return text;
  // number ranges stay on one line: "3–4", "2020–2021" (a word joiner after the dash)
  text = text.replace(/(\d)([–—])(?=\d)/g, '$1$2\u2060');
  if (!/\s/.test(text)) return text;
  // ["", " ", "word", " ", "word", …]: even = tokens, odd = whitespace runs
  const parts = text.split(/([ \t\n\r]+)/);
  const tokens = parts.filter((_, i) => i % 2 === 0);
  const n = tokens.length;
  if (n < 2) return text;

  // candidate joins between token i and i + 1, by priority
  const candidates = [];
  for (let i = 0; i < n - 1; i++) {
    const left = tokens[i], right = tokens[i + 1];
    if (!left || !right) continue; // leading / trailing whitespace
    const lastLeft = left.split(NBSP).pop();
    if (IS_DASH.test(right.split(NBSP)[0])) candidates.push([1, i]);        // word —
    else if (isShortWord(left, lang)) candidates.push([1, i]);              // в работе
    else if (IS_NUMBER.test(lastLeft.replace(OPENING, '')) && HAS_WORD.test(right)) candidates.push([2, i]); // 10 лет
    else if (lang === 'ru' && IS_ABBR.test(right.split(NBSP)[0].replace(CLOSING, ''))) candidates.push([3, i]); // разработке ПО
  }
  // higher priority first; inside one priority from the right, so in "и в EdTech"
  // the preposition sticks to the word it belongs to
  candidates.sort((a, b) => a[0] - b[0] || b[1] - a[1]);

  const glued = new Array(n - 1).fill(false);
  const groupSize = (i) => { // words in the group around token i
    let size = wordsIn(tokens[i]);
    for (let j = i - 1; j >= 0 && glued[j]; j--) size += wordsIn(tokens[j]);
    for (let j = i; j < n - 1 && glued[j]; j++) size += wordsIn(tokens[j + 1]);
    return size;
  };
  candidates.forEach(([, i]) => {
    // never more than two words in one unbreakable piece
    if (groupSize(i) + groupSize(i + 1) <= 2) glued[i] = true;
  });

  return parts.map((part, k) => (k % 2 === 1 && glued[(k - 1) / 2] ? NBSP : part)).join('');
}

const TYPO_SKIP = 'script, style, code, pre, textarea, svg, [data-no-typograph]';

function typographTree(root, lang) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => (node.parentElement?.closest(TYPO_SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT)
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach((node, i) => {
    let text = typograph(node.data, lang);
    // joins across inline elements: "эффектом в <span>EdTech</span>",
    // "<span>UX/UI-дизайнер</span> <span>— Нетология</span>"
    const next = nodes[i + 1]?.data.trimStart() || '';
    const block = (el) => el?.closest('p, li, dd, dt, h1, h2, h3, h4, h5, h6, figcaption, a, button');
    if (/[ \t\n\r]+$/.test(text) && block(node.parentElement) === block(nodes[i + 1]?.parentElement)) {
      const lastWord = text.trimEnd().split(/[ \t\n\r]+/).pop();
      if ((lastWord && isShortWord(lastWord, lang)) || IS_DASH.test(next[0] || '')) {
        text = text.replace(/[ \t\n\r]+$/, NBSP);
      }
    }
    // the last two words of a paragraph go together, so its last line is
    // never a single word (only when they are short enough to fit any screen)
    const own = block(node.parentElement);
    if (own?.matches(LAST_LINE_BLOCKS) && own !== block(nodes[i + 1]?.parentElement)) {
      text = glueLastWords(text, own);
    }
    if (text !== node.data) node.data = text;
  });
}

const LAST_LINE_BLOCKS = 'p, dd, .case-sec__list li';
const LAST_PAIR_MAX = 280; // px: the glued pair still fits the narrowest phone (320px minus side padding)
let measureCtx = null;

// width of a string in the element's font (canvas, no layout)
function textWidth(str, el) {
  measureCtx ||= document.createElement('canvas').getContext('2d');
  const style = getComputedStyle(el);
  measureCtx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  return measureCtx.measureText(str).width;
}

function glueLastWords(text, el) {
  const match = text.match(/^([\s\S]*?)([^ \t\n\r]+)[ \t\n\r]+([^ \t\n\r]+)([ \t\n\r]*)$/);
  if (!match) return text;
  const [, head, before, last, tail] = match;
  if (IS_DASH.test(before.split(NBSP).pop())) return text;         // "— Нетология": space after a dash stays
  if (wordsIn(before) + wordsIn(last) > 2) return text;             // never more than two words in one piece
  if (textWidth(`${before} ${last}`, el) > LAST_PAIR_MAX) return text;
  return head + before + NBSP + last + tail;
}

function applyLanguage(lang, { push = false } = {}) {
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const value = CONTENT[lang]?.[key];
    if (typeof value === 'string') el.textContent = typograph(value, lang);
  });

  document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
    const value = CONTENT[lang]?.[el.getAttribute('data-i18n-alt')];
    if (value) el.alt = value;
  });

  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const value = CONTENT[lang]?.[el.getAttribute('data-i18n-aria')];
    if (value) el.setAttribute('aria-label', value);
  });

  // a link to a file per language; the path is from the site root
  document.querySelectorAll('[data-i18n-href]').forEach((el) => {
    const value = CONTENT[lang]?.[el.getAttribute('data-i18n-href')];
    if (value) el.setAttribute('href', (document.documentElement.dataset.root || '') + value);
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

  // static text that doesn't go through data-i18n, and joins across inline tags
  if (document.body) typographTree(document.body, lang);
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
