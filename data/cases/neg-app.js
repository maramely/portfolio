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

   Пустые списки (meta, sections, results, slides)
   просто не показываются.

   Ключевые факты кейса — в data/content.js (case.negApp.facts).
   ============================================ */

const CASE = {
  slug: 'neg-app',

  // cover colour: violet | green | terracotta | blue (gradients from tokens.css)
  gradient: 'blue',

  // images/cases/<slug>/<file>, in this order.
  // A plain string is an image. A video is an object:
  //   { src, type: 'video', width, height, label: '<key in data/content.js>' }
  //
  // Per-slide texts live in data/content.js under textKey + number:
  //   <textKey>.alt01        — image alt (EN and RU)
  //   <textKey>.sec01.title  — RU text block above the slide: title, body,
  //   .body / .list / …        list, facts, groups (see js/case.js)
  textKey: 'case.negApp',
  slides: [
    '01.webp', '02.webp', '03.webp', '04.webp', '05.webp',
    '06.webp', '07.webp', '08.webp', '09.webp', '10.webp',
    { src: '11.mp4', type: 'video', width: 1408, height: 1080, label: 'case.negApp.video11' },
    '12.webp'
  ],

  // next case at the bottom of the page; without a real href the block is hidden
  next: { href: '', gradient: 'violet' },

  // Пустая строка или пустой список — блок на странице скрыт.
  en: {
    eyebrow: 'The Netherlands Education Group',
    title: 'NEG App',
    lead: '',
    coverTag: 'iOS app (concept)',

    meta: [],

    sections: [],

    results: [],

    slideAlt: 'NEG app case, slide',
    nextTitle: ''
  },

  ru: {
    eyebrow: 'The Netherlands Education Group',
    title: 'NEG App',
    lead: '',
    coverTag: 'iOS-приложение (концепция)',

    meta: [],

    sections: [],

    results: [],

    slideAlt: 'Кейс NEG app, слайд',
    nextTitle: ''
  }
};
