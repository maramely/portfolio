/* ============================================
   CASE — Perlem · student task statuses redesign (2026)
   Тот же шаблон, что у perlem-ai-review. Тексты, факты, alt
   и подписи — в data/content.js (case.perlemStatuses.*),
   картинки — в images/cases/perlem-student-statuses/{en,ru}/.
   ============================================ */

const CASE = {
  slug: 'perlem-student-statuses',

  // the picture in the cover block
  cover: {
    src: { ru: 'ru/001.webp', en: 'en/001.webp' },
    width: 2600,
    height: 1314
  },

  // blocks carry their own label ("01"), one per section, so no automatic numbers
  numbered: false,

  // the working schemes 09–11 exist only in Russian: both languages show ru/
  textKey: 'case.perlemStatuses',
  slides: [
    { id: '01', type: 'text' },                                // product & context
    { id: '03', type: 'text' },                                // 01 problem
    { id: '04', src: 'ru/09.webp', width: 2600, height: 2317 },   // 02 why it happens: screen flow as is
    { id: '07', type: 'pair', tile: '1 / 1', images: [      // 03 what I proposed: user flow to be, concept
      { id: '05', src: 'ru/10.webp', width: 2563, height: 2600 },
      { id: '06', src: 'ru/11.webp', width: 2600, height: 2451 }
    ] },
    { id: '08', type: 'pair', tile: '4 / 3', images: [                        // 04 design: home card, before → after
      { id: '08', src: { ru: 'ru/01.webp', en: 'en/01.webp' }, width: 2304, height: 1668 },
      { id: '09', src: { ru: 'ru/03.webp', en: 'en/03.webp' }, width: 2388, height: 1668 }
    ] },
    { id: '10', type: 'pair', tile: '4 / 3', images: [                        // assignments, before → after
      { id: '10', src: { ru: 'ru/02.webp', en: 'en/02.webp' }, width: 2304, height: 1676 },
      { id: '11', src: { ru: 'ru/04.webp', en: 'en/04.webp' }, width: 2388, height: 1668 }
    ] },
    { id: '12', type: 'pair', tile: '4 / 3', images: [                        // filtered by subject and level, by status
      { id: '12', src: { ru: 'ru/05.webp', en: 'en/05.webp' }, width: 2388, height: 1668 },
      { id: '13', src: { ru: 'ru/06.webp', en: 'en/06.webp' }, width: 2388, height: 1752 }
    ] },
    { id: '14', type: 'pair', tile: '4 / 3', images: [                        // hint, diagnostic tests tab
      { id: '14', src: { ru: 'ru/07.webp', en: 'en/07.webp' }, width: 2388, height: 1664 },
      { id: '15', src: { ru: 'ru/08.webp', en: 'en/08.webp' }, width: 2388, height: 1668 }
    ] },
    { id: '16', src: { ru: 'ru/Prototype.webp', en: 'en/Prototype.webp' }, width: 1838, height: 1106 },   // 05 prototype with AI
    { id: '18', src: 'ru/12.webp', width: 2600, height: 2324 },   // 06 how I worked with the agent: rules, skills, principles, prompts, chat
    { id: '19', type: 'text' },
    { id: '20', type: 'text' },                                // 07 research
    // TODO: сводка исследования
    { id: '21', type: 'text' }                                 // result & next steps
  ],

  // Пустая строка или пустой список — блок на странице скрыт.
  en: {
    eyebrow: 'Perlem',
    title: 'Perlem: student task statuses redesign',
    lead: '',
    meta: [],
    sections: [],
    results: [],
    slideAlt: 'Perlem case, slide'
  },

  ru: {
    eyebrow: 'Perlem',
    title: 'Perlem: редизайн статусов заданий ученика',
    lead: '',
    meta: [],
    sections: [],
    results: [],
    slideAlt: 'Кейс Perlem, слайд'
  }
};
