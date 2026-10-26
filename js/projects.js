/* ============================================
   PROJECTS — cards, links between pages and page
   meta, all from PROJECTS (data/projects.js).
   Only projects with ready: true are shown.

   Every page says where the site root is and what
   it is: <html data-root="../" data-page="case">
     data-page: home | projects | case

   Hooks:
     data-projects="featured" → home cards (featured, max 4)
     data-projects="all"      → every ready project
     data-project-next        → next case card (cyclic)
     data-project-next-section→ hidden while there is
                                no other ready project
     data-project-back        → "← All projects" link

   Way back: a card click on the home page or on
   projects.html remembers that page and its scroll
   (sessionStorage). The case's back link then leads
   there, and that page restores the scroll.
   Re-renders on 'langchange' (fired by js/i18n.js).
   ============================================ */

(function () {
  if (typeof PROJECTS === 'undefined') return;

  const ROOT = document.documentElement.dataset.root || '';
  const PAGE = document.documentElement.dataset.page || '';
  const FEATURED_MAX = 4;
  const RETURN_KEY = 'projects-return';   // { page, y } — set by a card click
  const RESTORE_KEY = 'projects-restore'; // { page, y } — set by the back link

  const ready = PROJECTS.filter((p) => p.ready);
  const caseHref = (p) => `${ROOT}cases/${p.slug}.html`;
  const text = (lang, key) => (typeof CONTENT !== 'undefined' && CONTENT[lang]?.[key]) || '';
  const pick = (value, lang) => (value && typeof value === 'object' ? value[lang] ?? value.en : value) || '';

  const storage = {
    get(key) {
      try { return JSON.parse(sessionStorage.getItem(key)); } catch (e) { return null; }
    },
    set(key, value) {
      try { sessionStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
    },
    remove(key) {
      try { sessionStorage.removeItem(key); } catch (e) {}
    }
  };

  const el = (tag, cls, content) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (content != null) node.textContent = content;
    return node;
  };

  const ARROW = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';

  function card(project, lang, headingTag) {
    const item = el('li', 'project-item');
    const link = el('a', 'project-card');
    link.href = caseHref(project);

    const media = el('div', 'project-card__media');
    const img = new Image(project.coverWidth, project.coverHeight);
    img.src = ROOT + project.cover;
    img.alt = ''; // the title right below names the project
    img.loading = 'lazy';
    img.decoding = 'async';
    media.append(img);

    const body = el('div', 'project-card__body');
    const head = el('div', 'project-card__head');
    const titles = el('div');
    if (project.year) titles.append(el('p', 'project-card__year', project.year));
    titles.append(el(headingTag, 'project-card__title', pick(project.title, lang)));
    head.append(titles);
    head.insertAdjacentHTML('beforeend', ARROW);
    body.append(head);

    const summary = pick(project.summary, lang);
    if (summary) body.append(el('p', 'project-card__summary', summary));

    if (project.tags?.length) {
      const tags = el('ul', 'project-card__tags');
      tags.setAttribute('aria-label', text(lang, 'projects.tags') || 'Tags');
      project.tags.forEach((tag) => tags.append(el('li', 'tag', pick(tag, lang))));
      body.append(tags);
    }

    link.append(media, body);
    item.append(link);
    return item;
  }

  function fillList(list, projects, lang, headingTag) {
    list.replaceChildren(...projects.map((p) => card(p, lang, headingTag)));
    list.dataset.count = String(projects.length);
  }

  // "Next project": the one after the current case, the first after the last
  function nextProject() {
    const slug = typeof CASE !== 'undefined' ? CASE.slug : null;
    const index = ready.findIndex((p) => p.slug === slug);
    if (index === -1 || ready.length < 2) return null;
    return ready[(index + 1) % ready.length];
  }

  function currentProject() {
    const slug = typeof CASE !== 'undefined' ? CASE.slug : null;
    return PROJECTS.find((p) => p.slug === slug) || null;
  }

  function setMeta(selector, value) {
    const node = document.querySelector(selector);
    if (node && value) node.setAttribute('content', value);
  }

  // <title>, description and Open Graph follow the language
  function updateMeta(lang) {
    const name = text(lang, 'nav.name');
    let title = '';
    let description = '';
    let image = '';

    if (PAGE === 'case') {
      const project = currentProject();
      if (!project) return;
      title = pick(project.title, lang);
      description = pick(project.summary, lang);
      image = project.cover;
    } else if (PAGE === 'projects') {
      title = text(lang, 'projects.title');
      description = text(lang, 'work.title.1') + text(lang, 'work.title.2');
      image = ready[0]?.cover;
    } else {
      return;
    }

    const fullTitle = name ? `${title} — ${name}` : title;
    document.title = fullTitle;
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', fullTitle);
    setMeta('meta[property="og:description"]', description);
    if (image) setMeta('meta[property="og:image"]', ROOT + image);
    setMeta('meta[property="og:locale"]', lang === 'ru' ? 'ru_RU' : 'en_US');
  }

  function render(lang) {
    document.querySelectorAll('[data-projects]').forEach((list) => {
      const projects = list.dataset.projects === 'featured'
        ? ready.filter((p) => p.featured).slice(0, FEATURED_MAX)
        : ready;
      fillList(list, projects, lang, list.dataset.heading || 'h3');
    });

    const next = nextProject();
    document.querySelectorAll('[data-project-next]').forEach((list) => {
      fillList(list, next ? [next] : [], lang, 'h3');
    });
    document.querySelectorAll('[data-project-next-section]').forEach((section) => {
      section.hidden = !next;
    });

    updateMeta(lang);
  }

  /* ---------- the way back ---------- */

  // home / projects.html: a card click remembers this page and its scroll
  function rememberOrigin() {
    if (PAGE !== 'home' && PAGE !== 'projects') return;
    document.addEventListener('click', (e) => {
      if (!e.target.closest('[data-projects] .project-card')) return;
      storage.set(RETURN_KEY, { page: PAGE, y: Math.round(window.scrollY) });
    });
  }

  // case: "← All projects" goes back to where the visitor came from
  function setupBackLink() {
    const origin = storage.get(RETURN_KEY);
    document.querySelectorAll('[data-project-back]').forEach((link) => {
      if (origin?.page === 'home') link.href = `${ROOT}index.html#projects`;
      else link.href = `${ROOT}projects.html`;
      link.addEventListener('click', () => {
        if (origin) storage.set(RESTORE_KEY, origin);
      });
    });
  }

  // home / projects.html: put the scroll back where it was
  function restoreScroll() {
    const saved = storage.get(RESTORE_KEY);
    if (!saved || saved.page !== PAGE) return;
    const apply = () => window.scrollTo({ top: saved.y, behavior: 'instant' });
    // now, and once more after load: the browser's own jump to #projects
    // and late fonts can move the page after the first call
    requestAnimationFrame(apply);
    window.addEventListener('load', () => {
      apply();
      storage.remove(RESTORE_KEY);
    }, { once: true });
  }

  if ('scrollRestoration' in history && storage.get(RESTORE_KEY)?.page === PAGE) {
    history.scrollRestoration = 'manual';
  }

  let rendered = false;
  document.addEventListener('langchange', (e) => {
    render(e.detail.lang);
    if (!rendered) restoreScroll();
    rendered = true;
  });
  document.addEventListener('DOMContentLoaded', () => {
    rememberOrigin();
    setupBackLink();
    // fallback if i18n didn't run (it loads later, so give it its turn first)
    setTimeout(() => {
      if (rendered) return;
      render(document.documentElement.lang || 'en');
      restoreScroll();
      rendered = true;
    });
  });
})();
