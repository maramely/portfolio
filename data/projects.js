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
                в пикселях: coverWidth, coverHeight; может быть
                { ru, en } — своя картинка для каждого языка
     ogImage  — картинка для превью ссылок (JPG), если нужна
                не обложка; без поля берётся cover
     year     — год или период: подпись на карточке
     startYear, endYear — годы начала и конца, для сортировки
     orderInYear — порядок проектов с одинаковыми годами
                (меньше — выше); без поля проект идёт после них
     tags     — теги карточки
     featured — показывать на главной (не больше 4)
     ready    — страница кейса готова. Проекты с
                ready: false на сайте не показываются.
   ============================================ */

const PROJECTS = [
  {
    slug: 'neg-app',
    title: { en: 'NEG App', ru: 'NEG App' },
    summary: {
      en: 'I designed an iOS app for The Netherlands Education Group: find and choose a short-term course in Amsterdam, The Hague, Vienna or online, then apply and pay without leaving the app.',
      ru: 'Спроектировала мобильное приложение для частной бизнес-школы: от исследования аудитории до одобрения стейкхолдерами'
    },
    cover: 'images/cases/neg-app/01.webp',
    coverWidth: 2100,
    coverHeight: 3072,
    year: '2020–2021',
    startYear: 2020,
    endYear: 2021,
    tags: ['iOS', 'UX/UI'],
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
    tags: ['iOS', 'UX/UI'],
    featured: true,
    ready: true
  },
  {
    slug: 'multibank',
    // short title for cards and links; the case page has the full one
    title: { en: 'Multibank', ru: 'Multibank' },
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
    tags: [
      { ru: 'Финтех', en: 'Fintech' },
      { ru: 'B2B', en: 'B2B' },
      { ru: 'Мобильное приложение', en: 'Mobile app' }
    ],
    featured: true,
    ready: true
  },
  {
    slug: 'multibank-main-screen',
    title: { en: 'Multibank: main screen redesign', ru: 'Multibank: редизайн главного экрана' },
    summary: {
      en: 'A redesign of the Multibank main screen after the MVP: each bank got its own color, and users find the right account 31.8% faster',
      ru: 'Редизайн главного экрана Multibank после MVP: у каждого банка свой цвет, и нужный счёт находят на 31,8% быстрее'
    },
    // temporary: the hero picture of the case
    cover: 'images/cases/multibank-main-screen/01.webp',
    ogImage: 'images/cases/multibank-main-screen/01-og.jpg',
    coverWidth: 2600,
    coverHeight: 1746,
    year: '2023',
    startYear: 2023,
    endYear: 2023,
    tags: ['Fintech', 'B2B', 'Mobile'],
    featured: true,
    ready: true
  }
];
