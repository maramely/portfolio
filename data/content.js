/* ============================================
   CONTENT — RU / EN
   Правь текст здесь, а не в index.html.
   Ключи (например hero.title) соответствуют
   data-i18n="hero.title" в разметке.
   ============================================ */

const CONTENT = {
  ru: {
    "nav.about": "Обо мне",
    "nav.experience": "Опыт",
    "nav.projects": "Проекты",
    "nav.contact": "Контакты",

    "hero.label": "Senior Product Designer · B2B",
    "hero.title": "Проектирую доверие в сложных B2B-продуктах",
    "hero.sub": "Senior Product Designer с фокусом на сложные B2B-продукты — от банкинга до edtech. Онбординг, комплаенс-флоу, дизайн-системы. Полный цикл — от исследования до релиза.",
    "hero.meta.location": "Локация",
    "hero.meta.location.value": "Открыта к релокации в ЕС",
    "hero.meta.stack": "Инструменты",
    "hero.meta.stack.value": "Figma · Cursor · Claude",
    "hero.cta.projects": "Смотреть проекты",
    "hero.cta.contact": "Написать",

    "currently.label": "Сейчас",
    "currently.title": "Product Designer в Perlem (Edtech) — до этого 3 года вела B2B/SME банкинг в ВТБ",
    "currently.link1": "Обо мне →",
    "currently.link2": "Опыт →",

    "footer.note": "Marina Tkachenko · Portfolio 2026"
  },

  en: {
    "nav.about": "About",
    "nav.experience": "Experience",
    "nav.projects": "Projects",
    "nav.contact": "Contact",

    "hero.label": "Senior Product Designer · B2B",
    "hero.title": "Designing trust into complex B2B products",
    "hero.sub": "Senior Product Designer focused on complex B2B products — from banking to edtech. Onboarding, compliance flows, design systems. Full-cycle — from research to release.",
    "hero.meta.location": "Location",
    "hero.meta.location.value": "Open to EU relocation",
    "hero.meta.stack": "Tools",
    "hero.meta.stack.value": "Figma · Cursor · Claude",
    "hero.cta.projects": "View projects",
    "hero.cta.contact": "Get in touch",

    "currently.label": "Currently",
    "currently.title": "Product Designer at Perlem (Edtech) — previously spent 3 years on B2B/SME banking at VTB",
    "currently.link1": "About →",
    "currently.link2": "Experience →",

    "footer.note": "Marina Tkachenko · Portfolio 2026"
  }
};

/* Лента компаний — отдельно от текстовых ключей,
   потому что это список, а не фразы.
   Добавляй/убирай пункты здесь. */
const LEDGER_ITEMS = ["VTB", "Perlem", "B2B / SME", "Fintech", "Edtech", "Compliance"];
