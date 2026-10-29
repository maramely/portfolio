/* ============================================
   PROJECTS — список всех кейсов сайта.
   На сайте проекты идут от новых к старым (сортирует
   js/projects.js): по endYear, при равенстве по startYear,
   оба по убыванию. Так же, по кругу, идёт «Следующий проект».

   Поля:
     slug     — имя страницы кейса: cases/<slug>.html
     title    — название { en, ru }
     summary  — короткое описание { en, ru }: карточка,
                meta description и og:description
     cover    — обложка (путь от корня сайта) и её размер
                в пикселях: coverWidth, coverHeight; может быть
                { ru, en } — своя картинка для каждого языка
     year     — год или период: подпись на карточке
     startYear, endYear — годы начала и конца, для сортировки
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
    tags: ['iOS', 'UX/UI'],
    featured: true,
    ready: true
  }
];
