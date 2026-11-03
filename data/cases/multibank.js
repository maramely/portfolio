/* ============================================
   CASE — VTB · Multibank in-app service (VTB Business)
   Текстовые блоки над картинками, как в NEG App.
   Порядок блоков — как на странице кейса в Webflow.
   Тексты, факты и alt — в data/content.js (case.multibank.*),
   картинки и видео — в images/cases/multibank/.
   ============================================ */

const CASE = {
  slug: 'multibank',

  // cover colour: violet | green | terracotta | blue (gradients from tokens.css)
  gradient: 'blue',

  // blocks carry their own label ("01 · Проблема и контекст"), so no automatic numbers
  numbered: false,

  // images/cases/<slug>/<file>, in this order:
  //   { id, src, width, height }      — text block <id> (if any) above the picture;
  //                                     src: { ru, en } for a picture with Russian text
  //                                     (ru/<file>), width/height of the ru file
  //   { id, type: 'text' }            — text block without a picture
  //   { id, src, type: 'video', … }   — video with a poster frame
  textKey: 'case.multibank',
  slides: [
    { id: '01', src: '01.webp', width: 2600, height: 1659 },   // about · hero
    { id: '02', src: { ru: 'ru/02.svg', en: '02.svg' }, width: 8204, height: 3972 },   // 01 problem
    { id: '03', src: { ru: 'ru/03.svg', en: '03.svg' }, width: 14026, height: 6791 },   // 02 goals · design thinking
    { id: '04', type: 'text' },                                // 03 hypotheses
    { id: '05', type: 'text' },                                // 03 interview
    { id: '06', type: 'text' },                                // 03 insights
    { id: '07', src: '04.webp', width: 2242, height: 1246 },   // 03 competitor benchmarking
    { id: '08', src: { ru: 'ru/05.webp', en: '05.webp' }, width: 5512, height: 5664 },   // 03 summary · prioritization matrix
    { id: '09', src: { ru: 'ru/06.webp', en: '06.webp' }, width: 5120, height: 4304 },   // 03 user flow
    { id: '10', src: '07.webp', width: 2600, height: 1746 },   // 04 wireframes
    { id: '11', type: 'text' },                                // 04 prototype & usability testing
    { id: '12', type: 'pair', images: [                        // 04 final design: 08 and 09 side by side
      { id: '12', src: { ru: 'ru/08.webp', en: '08.webp' }, width: 2064, height: 2492 },
      { id: '13', src: { ru: 'ru/09.webp', en: '09.webp' }, width: 2064, height: 2492 }
    ] },
    { id: '14', src: { ru: 'ru/10.webp', en: '10.webp' }, width: 3363, height: 1869 },
    { id: '15', src: '11.webp', width: 2242, height: 1246 },   // 04 VTB design system
    { id: '16', src: '12.mp4', type: 'video', width: 2436, height: 1404, poster: '12-poster.webp', label: 'case.multibank.video16' },
    { id: '17', src: '13.mp4', type: 'video', width: 2436, height: 1576, poster: '13-poster.webp', label: 'case.multibank.video17' },
    { id: '18', src: '14.webp', width: 2600, height: 1746 },   // 05 design decisions
    { id: '19', src: '15.webp', width: 3200, height: 2134 },   // 06 results
    { id: '21', type: 'text' }                                 // 07 next steps
  ],

  // decorative animated VTB logo after the last block (webm with a transparent background)
  decor: { src: '16.webm', type: 'video/webm', width: 600, height: 600 },

  // Пустая строка или пустой список — блок на странице скрыт.
  en: {
    eyebrow: 'VTB',
    title: 'Multibank in-app service in VTB Business',
    lead: '',
    coverTag: 'Mobile app · 2022',
    meta: [],
    sections: [],
    results: [],
    slideAlt: 'Multibank case, slide'
  },

  ru: {
    eyebrow: 'ВТБ',
    title: 'Multibank: сервис внутри приложения ВТБ Бизнес',
    lead: '',
    coverTag: 'Мобильное приложение · 2022',
    meta: [],
    sections: [],
    results: [],
    slideAlt: 'Кейс Multibank, слайд'
  }
};
