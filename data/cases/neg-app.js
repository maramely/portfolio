/* ============================================
   CASE — The Netherlands Education Group · mobile app
   Это единственный файл, который меняется от кейса
   к кейсу. Вёрстка (cases/*.html) у всех одинаковая.

   Как сделать новый кейс:
   1. Скопировать этот файл → data/cases/<slug>.js
   2. Скопировать cases/neg-app.html → cases/<slug>.html
      и поменять в нём одну строку: путь к data-файлу
   3. Положить картинки в images/cases/<slug>/
      и перечислить их в slides (в нужном порядке)
   4. Добавить проект в data/projects.js (ready: true) —
      тогда он появится в списках и в «Следующем проекте»

   Пустые списки (meta, sections, results, slides)
   просто не показываются.

   Ключевые факты кейса — в data/content.js (case.negApp.facts).
   ============================================ */

const CASE = {
  slug: 'neg-app',

  // cover colour: violet | green | terracotta | blue (gradients from tokens.css)
  gradient: 'blue',

  // images/cases/<slug>/<file>, in this order:
  //   { src, width, height }                     — image (size in px, reserves the space)
  //   { src, type: 'video', width, height, label: '<key in data/content.js>' }
  //   { id: '05', type: 'text' }                 — text block without a picture
  // Text keys use `id` or the number the file name starts with.
  //
  // Per-slide texts live in data/content.js under textKey + number:
  //   <textKey>.alt01        — image alt (EN and RU)
  //   <textKey>.sec01.title  — RU text block above the slide: title, body,
  //   .body / .list / …        list, facts, groups (see js/case.js)
  textKey: 'case.negApp',
  slides: [
    { src: '01.webp', width: 2100, height: 3072 },
    { src: '02.webp', width: 2800, height: 2048 },
    { src: '03.webp', width: 2800, height: 2048 },
    { src: '04.webp', width: 2800, height: 2048 },
    { src: '05.webp', width: 2800, height: 2048 },
    { src: '06.webp', width: 2800, height: 5218 },
    { src: '07.webp', width: 2800, height: 2048 },
    { src: '08.webp', width: 2800, height: 6610 },
    { src: '09.webp', width: 1536, height: 3072 },
    { src: '10.webp', width: 2800, height: 9080 },
    { src: '11.mp4', type: 'video', width: 1408, height: 1080, label: 'case.negApp.video11' },
    { src: '12.webp', width: 2800, height: 904 }
  ],

  // Пустая строка или пустой список — блок на странице скрыт.
  en: {
    eyebrow: 'The Netherlands Education Group',
    title: 'NEG App',
    lead: '',
    coverTag: 'iOS app (concept)',

    meta: [],

    sections: [],

    results: [],

    slideAlt: 'NEG app case, slide'
  },

  ru: {
    eyebrow: 'The Netherlands Education Group',
    title: 'NEG App',
    lead: '',
    coverTag: 'iOS-приложение (концепция)',

    meta: [],

    sections: [],

    results: [],

    slideAlt: 'Кейс NEG app, слайд'
  }
};
