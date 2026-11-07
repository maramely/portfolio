/* ============================================
   CASE — VTB · Multibank: main screen redesign (2023, after the MVP)
   Тот же шаблон, что у кейса Multibank: текстовые блоки над картинками.
   Тексты, факты и alt — в data/content.js (case.multibankMain.*),
   картинки и видео — в images/cases/multibank-main-screen/.
   ============================================ */

const CASE = {
  slug: 'multibank-main-screen',

  // cover colour: violet | green | terracotta | blue (gradients from tokens.css)
  gradient: 'blue',

  // blocks carry their own label ("01 · Проблема и контекст"), so no automatic numbers
  numbered: false,

  // images/cases/<slug>/<file>, in this order:
  //   { id, src, width, height }      — text block <id> (if any) above the picture;
  //                                     src: { ru, en } for a picture with text in it
  //                                     (ru/<file>); a language without its own file gets the en one.
  //                                     Russian versions not drawn yet are left commented out
  //                                     (/* ru: … */), so the page doesn't request missing files:
  //                                     once the file is in ru/, uncomment it
  //   { id, type: 'text' }            — text block without a picture
  //   { id, src, type: 'video', … }   — video with a poster frame
  textKey: 'case.multibankMain',
  slides: [
    { id: '01', src: '01.webp', width: 2600, height: 1746 },   // about · hero
    { id: '02', src: { ru: 'ru/02.svg', en: '02.svg' }, width: 8204, height: 3972 },   // 01 problem
    { id: '03', type: 'text' },                                // 02 hypotheses · usability testing
    { id: '04', type: 'text' },                                // 02 test findings
    { id: '05', type: 'text' },                                // 03 goals & metrics
    { id: '06', src: '03.webp', width: 2600, height: 1733 },   // 04 competitive benchmarking
    { id: '07', type: 'pair', images: [                        // 05 final design: before and after
      { id: '07', src: { ru: 'ru/04_1.webp', en: '04_1.webp' }, width: { ru: 2064, en: 1600 }, height: { ru: 2492, en: 1932 } },
      { id: '08', src: { ru: 'ru/04_2.webp', en: '04_2.webp' }, width: 2064, height: 2492 }
    ] },
    { id: '09', src: '07.mp4', type: 'video', width: 1440, height: 810, poster: '07-poster.webp', label: 'case.multibankMain.video09' },
    { id: '10', src: { en: '05.webp' /* ru: 'ru/05.webp' */ }, width: 2600, height: 1445 },   // 06 constraints · VTB design system
    // icons of the VTB design system: the same file and poster as video 16 in the Multibank case
    { id: '11', src: '../multibank/12.mp4', type: 'video', width: 2436, height: 1404, poster: '../multibank/12-poster.webp', label: 'case.multibankMain.video11' },
    { id: '12', type: 'text' }                                 // 07 results
  ],

  // decorative animated VTB logo after the last block — the same file as in the Multibank case
  decor: { src: '../multibank/16.webm', type: 'video/webm', width: 600, height: 600 },

  // Пустая строка или пустой список — блок на странице скрыт.
  en: {
    eyebrow: 'VTB',
    title: 'Multibank in-app service: main screen redesign',
    lead: '',
    coverTag: 'Mobile · 2023',
    meta: [],
    sections: [],
    results: [],
    slideAlt: 'Multibank main screen case, slide'
  },

  ru: {
    eyebrow: 'ВТБ',
    title: 'Multibank: редизайн главного экрана',
    lead: '',
    coverTag: 'Mobile · 2023',
    meta: [],
    sections: [],
    results: [],
    slideAlt: 'Кейс о главном экране Multibank, слайд'
  }
};
