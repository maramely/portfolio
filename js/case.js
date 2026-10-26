/* ============================================
   CASE — fills the case template from CASE
   (data/cases/<slug>.js) in the current language.

   Hooks in cases/*.html:
     data-case="key"          → text of CASE[lang][key]
     data-case-list="meta"    → <dl> with label / value pairs
     data-case-list="sections"→ story rows (label, title, text)
     data-case-list="results" → result cards (value, label)
     data-case-list="slides"  → figures from CASE.slides (images, videos)
     data-case-section="x"    → hidden when list x is empty
     data-case-cover          → gets the cover gradient

   Image slides open in a lightbox, video slides don't.
   Next project, back link and <title> / meta: js/projects.js.
   Re-renders on 'langchange' (fired by js/i18n.js).
   ============================================ */

(function () {
  if (typeof CASE === 'undefined') return;

  const IMAGE_DIR = `../images/cases/${CASE.slug}/`;

  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  };

  // interface strings shared by all cases (data/content.js)
  const ui = (lang, key) => (typeof CONTENT !== 'undefined' && CONTENT[lang]?.[key]) || key;

  /* ---------- Lightbox: images only (videos are never opened) ----------
     A native <dialog> shown as modal: it keeps focus inside, makes the page
     behind inert and closes on Esc. On top: a × button, click on the
     backdrop closes, page scroll is locked, focus goes back to the slide. */
  const lightbox = (() => {
    const dialog = el('dialog', 'lightbox');
    const scroller = el('div', 'lightbox__scroll');
    const image = el('img', 'lightbox__img');
    const close = el('button', 'lightbox__close icon-btn');
    close.type = 'button';
    close.innerHTML = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
    scroller.append(image);
    dialog.append(scroller, close);
    let trigger = null;

    // Clean-up runs right away instead of waiting for the dialog's own
    // 'close' event (it is async and can be skipped on a fast reopen).
    function cleanup() {
      document.documentElement.classList.remove('is-scroll-locked');
      image.removeAttribute('src');
      const back = trigger;
      trigger = null;
      back?.focus();
    }

    function hide() {
      if (dialog.open) dialog.close();
      cleanup();
    }

    close.addEventListener('click', hide);
    // a click anywhere except on the picture (or the × button) closes it
    dialog.addEventListener('click', (e) => {
      if (e.target !== image && !close.contains(e.target)) hide();
    });
    // Esc
    dialog.addEventListener('cancel', (e) => {
      e.preventDefault();
      hide();
    });
    // any other way the dialog gets closed
    dialog.addEventListener('close', () => {
      if (!dialog.open && trigger) cleanup();
    });

    document.addEventListener('DOMContentLoaded', () => document.body.append(dialog));

    return {
      open(img, button, lang) {
        trigger = button;
        image.src = img.currentSrc || img.src;
        image.alt = img.alt;
        dialog.setAttribute('aria-label', img.alt);
        close.setAttribute('aria-label', ui(lang, 'case.close'));
        document.documentElement.classList.add('is-scroll-locked');
        dialog.showModal();
        scroller.scrollTop = 0;
        close.focus();
      }
    };
  })();

  /* Text block above a slide (from data/content.js, in the current language):
       <textKey>.secNN.title  — section heading (no heading → just a caption)
       <textKey>.secNN.body   — paragraphs
       <textKey>.secNN.list   — bullet list
       <textKey>.secNN.facts  — "label: value" pairs
       <textKey>.secNN.groups — [{ title, items }] side by side (e.g. goals / fears) */
  function sectionBlock(number, get) {
    const key = `${CASE.textKey}.sec${number}`;
    const title = get(`${key}.title`);
    const body = get(`${key}.body`) || [];
    const list = get(`${key}.list`) || [];
    const facts = get(`${key}.facts`) || [];
    const groups = get(`${key}.groups`) || [];
    if (!title && !body.length && !list.length && !facts.length && !groups.length) return null;

    const sec = el('div', title ? 'case-sec' : 'case-sec case-sec--caption');
    if (title) {
      sec.append(el('p', 'case-sec__num', number), el('h3', 'case-sec__title', title));
    }
    const text = el('div', 'case-sec__body');
    body.forEach((p) => text.append(el('p', null, p)));

    if (list.length) {
      const ul = el('ul', 'case-sec__list');
      list.forEach((item) => ul.append(el('li', null, item)));
      text.append(ul);
    }

    if (facts.length) {
      const dl = el('dl', 'case-sec__facts');
      facts.forEach((fact) => {
        const i = fact.indexOf(': ');
        const row = el('div', 'case-sec__fact');
        row.append(el('dt', null, fact.slice(0, i)), el('dd', null, fact.slice(i + 2)));
        dl.append(row);
      });
      text.append(dl);
    }

    if (groups.length) {
      const wrap = el('div', 'case-sec__groups');
      groups.forEach(({ title: groupTitle, items }) => {
        const group = el('div', 'case-sec__group');
        const ul = el('ul', 'case-sec__list');
        items.forEach((item) => ul.append(el('li', null, item)));
        group.append(el('h4', 'case-sec__group-title', groupTitle), ul);
        wrap.append(group);
      });
      text.append(wrap);
    }

    sec.append(text);
    return sec;
  }

  const renderers = {
    meta(list, items) {
      items.forEach(({ label, value }) => {
        const row = el('div', 'case-meta__item');
        row.append(el('dt', 'case-meta__label', label), el('dd', 'case-meta__value', value));
        list.append(row);
      });
    },

    sections(list, items) {
      items.forEach(({ label, title, text }) => {
        const row = el('article', 'case-story__row');
        const head = el('div', 'case-story__head');
        head.append(el('p', 'label', label), el('h2', 'case-story__title', title));
        row.append(head, el('p', 'case-story__text', text));
        list.append(row);
      });
    },

    results(list, items) {
      items.forEach(({ value, label }) => {
        const card = el('li', 'case-result');
        card.append(el('span', 'case-result__value', value), el('span', 'case-result__label', label));
        list.append(card);
      });
    },

    slides(list, slides, t, lang) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const text = (key) => (typeof CONTENT !== 'undefined' ? CONTENT[lang]?.[key] : null);

      // key facts above the first slide (<textKey>.facts: [{ label, value }])
      const facts = text(`${CASE.textKey}.facts`) || [];
      if (facts.length) {
        const dl = el('dl', 'case-facts');
        facts.forEach(({ label: name, value }) => {
          const row = el('div', 'case-facts__item');
          row.append(el('dt', 'case-facts__label', name), el('dd', 'case-facts__value', value));
          dl.append(row);
        });
        const item = el('li', 'case-facts-wrap');
        item.append(dl);
        list.append(item);
      }

      slides.forEach((slide) => {
        const { src, type, width, height, label } = typeof slide === 'string' ? { src: slide } : slide;
        const number = src.replace(/\.[a-z0-9]+$/i, '');
        const item = el('li', 'case-slide');
        const card = el('div', 'case-shot');

        // authored text above the card (videos have none)
        const section = type === 'video' ? null : sectionBlock(number, text);
        if (section) item.append(section);

        if (type === 'video') {
          // same card as images; never opened in a lightbox
          const video = document.createElement('video');
          video.src = IMAGE_DIR + src;
          video.muted = true;
          video.setAttribute('muted', ''); // iOS Safari needs the attribute to autoplay
          video.loop = true;
          video.playsInline = true;
          video.preload = 'metadata';
          if (width) video.width = width;
          if (height) video.height = height;
          if (reduceMotion) {
            video.controls = true; // the visitor starts it when they want
          } else {
            video.autoplay = true;
          }
          const aria = label ? text(label) : null;
          if (aria) video.setAttribute('aria-label', aria);
          card.classList.add('case-shot--video');
          card.append(video);
          item.append(card);
          list.append(item);
          return;
        }

        const img = new Image();
        img.src = IMAGE_DIR + src;
        img.alt = text(`${CASE.textKey}.alt${number}`) || `${t.slideAlt} ${number}`;
        img.loading = 'lazy';
        img.decoding = 'async';
        // the image is a button, so it opens in the lightbox with mouse or keyboard
        const zoom = el('button', 'case-shot__zoom');
        zoom.type = 'button';
        zoom.setAttribute('aria-label', `${ui(lang, 'case.zoom')}: ${img.alt}`);
        zoom.addEventListener('click', () => lightbox.open(img, zoom, lang));
        zoom.append(img);
        // until the file is added, show a numbered placeholder of the same size
        img.addEventListener('error', () => {
          card.classList.add('is-missing');
          card.dataset.number = number;
          zoom.remove();
        });
        card.append(zoom);
        item.append(card);
        list.append(item);
      });
    }
  };

  function render(lang) {
    const t = CASE[lang] || CASE.en;

    document.querySelectorAll('[data-case]').forEach((node) => {
      const value = t[node.dataset.case];
      if (value != null) node.textContent = value;
      node.hidden = !value; // empty text → no empty block on the page
    });

    document.querySelectorAll('[data-case-list]').forEach((list) => {
      const key = list.dataset.caseList;
      const items = key === 'slides' ? CASE.slides || [] : t[key] || [];
      list.replaceChildren();
      renderers[key]?.(list, items, t, lang);
      document.querySelectorAll(`[data-case-section="${key}"]`)
        .forEach((section) => { section.hidden = items.length === 0; });
    });

    document.querySelectorAll('[data-case-cover]').forEach((cover) => {
      cover.dataset.gradient = CASE.gradient || 'violet';
    });
  }

  document.addEventListener('langchange', (e) => render(e.detail.lang));
  // fallback if i18n didn't run
  document.addEventListener('DOMContentLoaded', () => render(document.documentElement.lang || 'en'));
})();
