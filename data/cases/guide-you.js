/* ============================================
   CASE — Antipoff IT · Guide You (iOS app)
   Слайды 01–10 одним непрерывным полотном: без текста
   между ними, встык. RU-версия берёт слайды из
   images/cases/guide-you/ru/, EN — из en/; видео 09
   общее для обоих языков. Факты и alt — в data/content.js
   (case.guideYou.*).
   ============================================ */

const CASE = {
  slug: 'guide-you',

  // slides edge to edge in one frame (see css/case.css, .case-canvas)
  layout: 'canvas',

  textKey: 'case.guideYou',
  slides: [
    { id: '01', src: { ru: 'ru/01.webp', en: 'en/01.webp' }, width: 2400, height: 1618 },
    { id: '02', src: { ru: 'ru/02.webp', en: 'en/02.webp' }, width: 2400, height: 2595 },
    { id: '03', src: { ru: 'ru/03.webp', en: 'en/03.webp' }, width: 2400, height: 5434 },
    { id: '04', src: { ru: 'ru/04.webp', en: 'en/04.webp' }, width: { ru: 1920, en: 2400 }, height: { ru: 7840, en: 9800 } },
    { id: '05', src: { ru: 'ru/05.webp', en: 'en/05.webp' }, width: 2400, height: 6169 },
    { id: '06', src: { ru: 'ru/06.webp', en: 'en/06.webp' }, width: 2400, height: 11812 },
    { id: '07', src: { ru: 'ru/07.webp', en: 'en/07.webp' }, width: 2400, height: 8290 },
    { id: '08', src: { ru: 'ru/08.webp', en: 'en/08.webp' }, width: 2400, height: 3080 },
    { src: '09.mp4', type: 'video', width: 2798, height: 1344, label: 'case.guideYou.video09' },
    { id: '10', src: { ru: 'ru/10.webp', en: 'en/10.webp' }, width: 2400, height: 3578 }
  ],

  en: {
    eyebrow: '',
    title: 'Guide You',
    lead: '',
    meta: [],
    sections: [],
    results: [],
    slideAlt: 'Guide You case, slide'
  },

  ru: {
    eyebrow: '',
    title: 'Guide You',
    lead: '',
    meta: [],
    sections: [],
    results: [],
    slideAlt: 'Кейс Guide You, слайд'
  }
};
