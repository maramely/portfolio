/* ============================================
   CASE — Perlem · AI-assisted assignment review (2025)
   Тот же шаблон, что у кейсов Multibank: текстовые блоки над картинками.
   Тексты, факты и alt — в data/content.js (case.perlemReview.*),
   картинки и видео — в images/cases/perlem-ai-review/{en,ru}/.
   ============================================ */

const CASE = {
  slug: 'perlem-ai-review',

  // the picture in the cover block; it is the hero of the case, so no slide repeats it
  cover: {
    src: { ru: 'ru/01.webp', en: 'en/01.webp' },
    width: 2600,
    height: 1463
  },

  // blocks carry their own label ("01"), one per section, so no automatic numbers
  numbered: false,

  // images/cases/<slug>/<file>, in this order:
  //   { id, src, width, height }      — text block <id> (if any) above the picture;
  //                                     src: { ru, en }: every picture has its own file per language
  //   { id, type: 'text' }            — text block without a picture
  //   { id, src, type: 'video', … }   — video with a poster frame
  //   type: { ru: 'image', en: 'video' } — a picture in Russian, a video in English
  textKey: 'case.perlemReview',
  slides: [
    { id: '01', type: 'text' },                                // product & context
    { id: '02', src: { ru: 'ru/02.webp', en: 'en/02.webp' }, width: { ru: 2880, en: 2600 }, height: { ru: 1620, en: 1462 } },   // 01 problem
    { id: '03', type: 'text' },                                // 02 research insight
    { id: '04', src: { ru: 'ru/03.webp', en: 'en/03.webp' }, width: { ru: 2880, en: 2600 }, height: { ru: 1620, en: 1462 } },   // 03 building the foundation
    { id: '05', src: { ru: 'ru/04.webp', en: 'en/04.webp' }, width: { ru: 2880, en: 2600 }, height: { ru: 1620, en: 1462 } },
    { id: '06', type: 'pair', images: [                        // 04 why AI
      { id: '06', src: { ru: 'ru/05_1.webp', en: 'en/05_01.webp' }, width: 1929, height: 1074 },
      { id: '07', src: { ru: 'ru/05_2.webp', en: 'en/05_2.webp' }, width: 1930, height: 1074 }
    ] },
    { id: '08', src: { ru: 'ru/06.svg', en: 'en/06.svg' }, width: 8204, height: 3972 },   // 05 AI assignment review: principles
    { id: '09', src: { ru: 'ru/07.webp', en: 'en/07.webp' }, width: { ru: 2880, en: 2600 }, height: { ru: 1620, en: 1462 } },   // how it works
    { id: '10', type: { ru: 'image', en: 'video' }, src: { ru: 'ru/08.webp', en: 'en/08.mp4' }, width: { ru: 2880, en: 1440 }, height: { ru: 1620, en: 810 }, poster: { en: 'en/08-poster.webp' }, label: 'case.perlemReview.video10' },
    { id: '11', src: { ru: 'ru/09.webp', en: 'en/09.webp' }, width: 2880, height: 1620 },
    { id: '12', src: { ru: 'ru/10.webp', en: 'en/10.webp' }, width: { ru: 2880, en: 2600 }, height: { ru: 1620, en: 1462 } },   // teacher's control
    { id: '13', src: { ru: 'ru/11.webp', en: 'en/11.webp' }, width: { ru: 2880, en: 2600 }, height: { ru: 1620, en: 1462 } },
    { id: '14', type: 'text' },                                // teacher's reaction
    { id: '15', type: 'text' },                                // 06 results & next steps
    { id: '16', type: 'text' }
  ],

  // Пустая строка или пустой список — блок на странице скрыт.
  en: {
    eyebrow: 'Perlem',
    title: 'Perlem: AI-assisted assignment review',
    lead: '',
    meta: [],
    sections: [],
    results: [],
    slideAlt: 'Perlem case, slide'
  },

  ru: {
    eyebrow: 'Perlem',
    title: 'Perlem: ИИ-ассистент для проверки заданий',
    lead: '',
    meta: [],
    sections: [],
    results: [],
    slideAlt: 'Кейс Perlem, слайд'
  }
};
