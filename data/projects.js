/* ============================================
   PROJECTS — список всех кейсов сайта.
   Порядок здесь = порядок на главной, на странице
   projects.html и в блоке «Следующий проект».

   Поля:
     slug     — имя страницы кейса: cases/<slug>.html
     title    — название { en, ru }
     summary  — короткое описание { en, ru }: карточка,
                meta description и og:description
     cover    — обложка (путь от корня сайта) и её размер
                в пикселях: coverWidth, coverHeight
     year     — год или период
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
      en: 'On my own initiative, I designed a concept for an iOS app for The Netherlands Education Group: find and choose a short-term course in Amsterdam, The Hague, Vienna or online, then apply and pay without leaving the app.',
      ru: 'По собственной инициативе придумала концепцию iOS-приложения для The Netherlands Education Group: в нём можно найти и выбрать краткосрочный курс в Амстердаме, Гааге, Вене или онлайн, подать заявку и оплатить его, не выходя из приложения.'
    },
    cover: 'images/cases/neg-app/01.webp',
    coverWidth: 2100,
    coverHeight: 3072,
    year: '2020–2021',
    tags: ['iOS', 'UX/UI'],
    featured: true,
    ready: true
  }
];
