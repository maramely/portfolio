/* ============================================
   CONTENT — RU / EN
   Правь текст здесь, а не в index.html.
   Ключи (например hero.name) соответствуют
   data-i18n="hero.name" в разметке.
   Заголовок "Product Designer" намеренно не
   переводится — это графический элемент.
   ============================================ */

const CONTENT = {
  ru: {
    "nav.name": "Марина Ткаченко",
    "nav.home": "Главная",
    "nav.work": "Работы",
    "nav.about": "Обо мне",
    "nav.contact": "Контакты",
    "nav.resume": "Резюме",

    "hero.name": "Марина Ткаченко",

    "about.title": "Обо мне",
    "about.sub": "Проектирую быстрые, масштабируемые и приятные продуктовые интерфейсы",
    "about.photoAlt": "Марина Ткаченко со спины поднимает руку навстречу виду с холма на небольшой город под облачным небом",
    "about.label": "Кто я",
    "about.lead": "Senior Product Designer с опытом 6+ лет в финтехе, edtech и разработке ПО — в корпорациях и стартапах.",
    "about.text": "Работаю вместе с продакт-оунерами, разработчиками и стейкхолдерами: превращаю сложные процессы в понятные интерфейсы, где потребности пользователей совпадают с целями бизнеса.",

    "skills.1": "Продуктовое мышление и решение задач",
    "skills.2": "UX-дизайн",
    "skills.3": "Исследования и валидация",
    "skills.4": "Информационная архитектура",
    "skills.5": "Вайрфреймы и прототипы",
    "skills.6": "Кросс-функциональная работа",

    "stats.1": "Лет создаю цифровые продукты",
    "stats.2": "Продуктовых инициатив запущено",
    "stats.3": "Кейса в портфолио",
    "stats.4": "Индустрии: финтех, edtech и разработка ПО",

    "exp.label": "Опыт",
    "exp.title.1": "Создаю продукты с измеримым эффектом в ",
    "exp.title.2": "EdTech, финтехе",
    "exp.title.3": " и ",
    "exp.title.4": "разработке ПО",
    "exp.intro": "Путь через роли, которые сформировали мой подход к исследованиям, дизайну и запуску пользовательских продуктов в масштабе.",
    "exp.1.role": "Senior Product Designer • март 2025 — сейчас",
    "exp.1.text": "Проектирую сложные веб- и мобильные решения для разных ролей пользователей на EdTech-платформе для частных школ. Развиваю дизайн-систему. С нуля спроектировала MVP платформы для детских садов — сейчас она в продакшене. Запустила проверку заданий с помощью ИИ, которая сократила среднее время проверки на 37,8%.",
    "exp.2.company": "ВТБ",
    "exp.2.role": "Product Designer • октябрь 2022 — март 2025",
    "exp.2.text": "Проектировала сервисы мобильного банка одного из трёх крупнейших банков России — B2B-приложения для малого и среднего бизнеса. Вела сервис «Мультибанк» с этапа MVP, развивала дизайн-систему и дизайн-процессы в компании. Внесла вклад в рост клиентской базы приложения на 2,8%.",
    "exp.3.role": "UX/UI Designer • декабрь 2021 — сентябрь 2022",
    "exp.3.text": "Работала над веб- и мобильным дизайном в кросс-функциональной команде пресейл-проектов. Проводила исследования — глубинные интервью и юзабилити-тесты, — делала вайрфреймы и интерактивные прототипы для питчей. Успешно презентовала проект Guide You.",
    "exp.4.role": "Designer • июнь 2020 — декабрь 2021",
    "exp.4.text": "Единственный дизайнер в компании: отвечала за весь цифровой опыт — UX/UI, визуальный стиль, контент и разработку сайта. По своей инициативе провела исследование и на его основе сделала концепцию мобильного приложения — от исследования до презентации стейкхолдерам и одобрения дальнейшей разработки. MAU вырос почти в 10 раз, конверсия — с 1,3% до 4,5%; 89% опрошенных пользователей полностью довольны новым сайтом.",

    "footer.note": "Marina Tkachenko · Portfolio 2026"
  },

  en: {
    "nav.name": "Marina Tkachenko",
    "nav.home": "Home",
    "nav.work": "Work",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.resume": "Resume",

    "hero.name": "Marina Tkachenko",

    "about.title": "About me",
    "about.sub": "Designing fast, scalable and delightful product experiences",
    "about.photoAlt": "Marina Tkachenko seen from behind, raising her arm towards a hilltop view of a small town under a cloudy sky",
    "about.label": "Who I am",
    "about.lead": "I'm a Senior Product Designer with 6+ years of experience in Fintech, EdTech and Software Development — in both corporate and startup environments.",
    "about.text": "I work closely with product owners, engineers and stakeholders to turn complex workflows into intuitive experiences that align user needs with business goals.",

    "skills.1": "Product Thinking & Problem Solving",
    "skills.2": "User Experience (UX) Design",
    "skills.3": "User Research & Validation",
    "skills.4": "Information Architecture",
    "skills.5": "Wireframing & Prototyping",
    "skills.6": "Cross-Functional Collaboration",

    "stats.1": "Years Building Digital Products",
    "stats.2": "Product Initiatives Delivered",
    "stats.3": "Featured Case Studies",
    "stats.4": "Industries: Fintech, EdTech and Software Development",

    "exp.label": "Experience",
    "exp.title.1": "Building impactful products across ",
    "exp.title.2": "EdTech, Fintech",
    "exp.title.3": " and ",
    "exp.title.4": "Software Development",
    "exp.intro": "A journey through roles that shaped how I research, design and ship user-centered experiences at scale.",
    "exp.1.role": "Senior Product Designer • Mar 2025 — Present",
    "exp.1.text": "Design complex web & mobile solutions for different user roles on an EdTech platform for private schools. Actively develop and contribute to the design system. Designed the MVP of a kindergarten platform from scratch, now in prod. Introduced an AI-powered assignment checking feature that reduced average checking time by 37.8%",
    "exp.2.company": "VTB",
    "exp.2.role": "Product Designer • Oct 2022 — Mar 2025",
    "exp.2.text": "Designed mobile banking services for one of Russia’s top 3 banks, focusing on its B2B mobile banking app for SMEs. Led the Multibank service from MVP and contributed to the design system and design processes in company. Contributed to a 2.8% growth in the app’s overall client base",
    "exp.3.role": "UX UI Designer • Dec 2021 — Sep 2022",
    "exp.3.text": "Collaborated on web & mobile design in a cross-functional team working on pre-sales projects. Conducted user research, including in-depth interviews and usability testing, and created wireframes and interactive prototypes for product pitches. Successfully presented the Guide You project.",
    "exp.4.role": "Designer • Jun 2020 — Dec 2021",
    "exp.4.text": "As the sole designer, I owned the company’s entire digital experience, from UX/UI and visual identity to content and website development. Proactively initiated user research and developed a mobile app concept based on the findings, taking it from initial research to a stakeholder presentation and approval for further development. Increased MAU nearly 10x and conversion from 1.3% to 4.5%; 89% of surveyed users were fully satisfied with the new website.",

    "footer.note": "Marina Tkachenko · Portfolio 2026"
  }
};
