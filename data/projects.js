/* ============================================
   PROJECTS — список всех кейсов сайта.
   На сайте проекты идут от новых к старым (сортирует
   js/projects.js): по endYear, при равенстве по startYear,
   оба по убыванию, а при одинаковых годах — по orderInYear.
   Так же, по кругу, идёт «Следующий проект».

   Поля:
     slug     — имя страницы кейса: cases/<slug>.html
     title    — название { en, ru }
     summary  — короткое описание { en, ru }: карточка,
                meta description и og:description
     cover    — обложка (путь от корня сайта) и её размер
                в пикселях: coverWidth, coverHeight; всё это может
                быть { ru, en } — своя картинка для каждого языка
     coverAlt — alt обложки в карточке { en, ru }; без поля alt пустой:
                название проекта стоит сразу под картинкой
     coverPosition — какая часть обложки остаётся в кадре карточки
                (object-position), если по центру режется текст
     year     — год или период: подпись на карточке
     startYear, endYear — годы начала и конца, для сортировки
     orderInYear — порядок проектов с одинаковыми годами
                (меньше — выше); без поля проект идёт после них
     tags     — теги карточки: одинаковые в RU и EN, без перевода
                (индустрия, затем B2B, затем платформа: Fintech, Edtech, Travel, B2B, Mobile, Web)
     featured — показывать на главной (не больше 4)
     ready    — страница кейса готова. Проекты с
                ready: false на сайте не показываются.
   ============================================ */

const PROJECTS = [
  {
    slug: 'neg-app',
    title: { en: 'NEG App', ru: 'NEG App' },
    summary: {
      en: 'I designed an iOS app for a private business school, from audience research to stakeholder approval.',
      ru: 'Спроектировала мобильное приложение для частной бизнес-школы: от исследования аудитории до одобрения стейкхолдерами'
    },
    cover: 'images/cases/neg-app/01.webp',
    coverWidth: 2100,
    coverHeight: 3072,
    year: '2020–2021',
    startYear: 2020,
    endYear: 2021,
    tags: ['Edtech', 'Mobile'],
    featured: true,
    ready: true
  },
  {
    slug: 'guide-you',
    title: { en: 'Guide You', ru: 'Guide You' },
    summary: {
      en: 'An iOS app that brings together Moscow guides and tourists',
      ru: 'iOS-приложение, которое объединяет гидов и туристов Москвы'
    },
    // temporary: the first slide, in the page language
    cover: { ru: 'images/cases/guide-you/ru/01.webp', en: 'images/cases/guide-you/en/01.webp' },
    coverWidth: 2400,
    coverHeight: 1618,
    year: '2022',
    startYear: 2022,
    endYear: 2022,
    orderInYear: 2,
    tags: ['Travel', 'Mobile'],
    featured: true,
    ready: true
  },
  {
    slug: 'multibank',
    // short title for cards and links; the case page has the full one
    title: { en: 'Multibank: MVP', ru: 'Мультибанк: MVP' },
    summary: {
      en: 'A native in-app service in VTB Business that brings all external bank accounts into one mobile interface',
      ru: 'Сервис внутри приложения ВТБ Бизнес, который собирает счета в других банках в одном мобильном интерфейсе'
    },
    // temporary: the hero picture of the case
    cover: 'images/cases/multibank/01.webp',
    coverWidth: 2600,
    coverHeight: 1659,
    year: '2022',
    startYear: 2022,
    endYear: 2022,
    orderInYear: 1,
    tags: ['Fintech', 'B2B', 'Mobile'],
    featured: true,
    ready: true
  },
  {
    slug: 'multibank-main-screen',
    title: { en: 'Multibank: main screen redesign', ru: 'Мультибанк: редизайн главного экрана' },
    summary: {
      en: 'A redesign of the Multibank main screen after the MVP: each bank got its own color, and users find the right account 31.8% faster',
      ru: 'Редизайн главного экрана Мультибанка после MVP: у каждого банка свой цвет, и нужный счёт находят на 31,8% быстрее'
    },
    // temporary: the hero picture of the case
    cover: 'images/cases/multibank-main-screen/01.webp',
    coverWidth: 2600,
    coverHeight: 1746,
    year: '2023',
    startYear: 2023,
    endYear: 2023,
    tags: ['Fintech', 'B2B', 'Mobile'],
    featured: true,
    ready: true
  },
  {
    slug: 'perlem-ai-review',
    title: { en: 'Perlem: AI-assisted assignment review', ru: 'Perlem: ИИ-ассистент для проверки заданий' },
    summary: {
      en: 'A teacher-controlled AI pre-check for assignment review: by the time a teacher opens a submission, the verdict is already there',
      ru: 'ИИ-проверка заданий под контролем учителя: к моменту, когда он открывает работу, вердикт уже готов'
    },
    cover: { en: 'images/cases/perlem-ai-review/en/01.webp', ru: 'images/cases/perlem-ai-review/ru/01.webp' },
    coverWidth: 2600,
    coverHeight: 1463,
    coverPosition: 'left center',
    year: '2025',
    startYear: 2025,
    endYear: 2025,
    tags: ['Edtech', 'Web'],
    featured: true,
    ready: true
  },
  {
    slug: 'perlem-student-statuses',
    title: { en: 'Perlem: student task statuses redesign', ru: 'Perlem: редизайн статусов заданий ученика' },
    summary: {
      en: 'How to help students see urgent assignments and diagnostic tests at once: new deadline and status indication, a prototype built with AI and a hallway test.',
      ru: 'Как помочь ученику сразу увидеть срочные задания и диагностические работы: новая индикация сроков и статусов, прототип с ИИ и коридорное тестирование.'
    },
    cover: { en: 'images/cases/perlem-student-statuses/en/cover.webp', ru: 'images/cases/perlem-student-statuses/ru/cover.webp' },
    coverAlt: {
      en: 'Perlem on a tablet and a laptop, next to an illustrated teacher and the line “Redesigning Task Statuses on the Student Platform (Web)”',
      ru: 'Perlem на планшете и ноутбуке, рядом иллюстрация учительницы и подпись «Редизайн статусов заданий на веб-платформе ученика»'
    },
    coverWidth: 2600,
    coverHeight: 1314,
    coverPosition: 'left center',
    year: '2026',
    startYear: 2026,
    endYear: 2026,
    tags: ['Edtech', 'Web'],
    featured: true,
    ready: true
  }
];
