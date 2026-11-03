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
   CASE.layout = 'canvas' → slides edge to edge in one rounded frame, no text
   between them; the key facts then go to [data-case-facts] above it.
   Every slide but the first loads lazily (videos start once near the screen).
   CASE.decor = { src, type } → a decorative looping video in [data-case-decor]
   after the last block (hidden from assistive tech, skipped on narrow screens
   by CSS, never shown if the browser can't play the format).
   Next project, back link and <title> / meta: js/projects.js.
   Re-renders on 'langchange' (fired by js/i18n.js).
   ============================================ */

(function () {
  if (typeof CASE === 'undefined') return;

  const IMAGE_DIR = `../images/cases/${CASE.slug}/`;
  // pictures, videos and posters carry the same ?v= as the scripts and styles
  // (the one version in the page's <script src="…?v=">), so after a file is
  // replaced and the version bumped, browsers fetch the new copy
  const ASSET_VERSION = document.currentScript && new URL(document.currentScript.src).searchParams.get('v');
  const asset = (path) => IMAGE_DIR + path + (ASSET_VERSION ? `?v=${ASSET_VERSION}` : '');

  // non-breaking spaces from js/i18n.js (typograph), in the page language
  const typo = (text) => (typeof typograph === 'function' ? typograph(text, document.documentElement.lang) : text);

  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = typo(text);
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
       <textKey>.secNN.label  — section label above the heading ("01 · About");
                                without it the block number is shown, unless
                                CASE.numbered is false
       <textKey>.secNN.title  — section heading (no heading → just a caption)
       <textKey>.secNN.body   — paragraphs
       <textKey>.secNN.list   — bullet list
       <textKey>.secNN.facts  — "label: value" pairs
       <textKey>.secNN.qa     — interview: [{ stage, question, answer, quote, tags }]
       <textKey>.secNN.stats  — number cards: [{ value, label }]
       <textKey>.secNN.outro  — paragraphs after the cards
       <textKey>.secNN.columns — short blocks side by side, a line above each:
                                [{ num, title, text, lines }]; num ("01") is optional,
                                text is a paragraph or a list of paragraphs,
                                lines are short items, one per line, no markers
       <textKey>.secNN.note   — a short note in small type at the end */
  function sectionBlock(number, get) {
    const key = `${CASE.textKey}.sec${number}`;
    const title = get(`${key}.title`);
    const body = get(`${key}.body`) || [];
    const list = get(`${key}.list`) || [];
    const facts = get(`${key}.facts`) || [];
    const label = get(`${key}.label`);
    const qa = get(`${key}.qa`) || [];
    const stats = get(`${key}.stats`) || [];
    const outro = get(`${key}.outro`) || [];
    const note = get(`${key}.note`);
    const columns = get(`${key}.columns`) || [];
    if (!label && !title && !body.length && !list.length && !facts.length
      && !qa.length && !stats.length && !outro.length && !note && !columns.length) return null;

    const sec = el('div', title || label ? 'case-sec' : 'case-sec case-sec--caption');
    if (stats.length > 2 || columns.length || qa.length) sec.classList.add('case-sec--wide'); // grids need the full width
    if (label) sec.append(el('p', 'case-sec__num', label));
    else if (title && CASE.numbered !== false) sec.append(el('p', 'case-sec__num', number));
    if (title) sec.append(el('h3', 'case-sec__title', title));
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

    if (qa.length) {
      const ol = el('ol', 'case-qa');
      let stage = null;
      qa.forEach(({ stage: itemStage, question, answer, quote, tags }) => {
        if (itemStage && itemStage !== stage) {
          stage = itemStage;
          ol.append(el('li', 'case-qa__stage', stage));
        }
        const item = el('li', 'case-qa__item');
        item.append(el('p', 'case-qa__question', question));
        if (answer) item.append(el('p', 'case-qa__answer', answer));
        if (quote) item.append(el('blockquote', 'case-qa__quote', quote));
        if (tags) item.append(el('p', 'case-qa__tags', tags));
        ol.append(item);
      });
      text.append(ol);
    }

    if (stats.length) {
      const ul = el('ul', 'case-stats');
      stats.forEach(({ value, label: statLabel }) => {
        const card = el('li', 'case-stats__card');
        card.append(el('span', 'case-stats__value', value), el('span', 'case-stats__label', statLabel));
        ul.append(card);
      });
      text.append(ul);
    }

    if (columns.length) {
      const ul = el('ul', 'case-columns');
      ul.dataset.count = String(columns.length);
      columns.forEach(({ num, title: colTitle, text: colText, lines }) => {
        const col = el('li', 'case-columns__item');
        if (num) col.append(el('span', 'case-columns__num', num));
        if (colTitle) col.append(el('h4', 'case-columns__title', colTitle));
        [].concat(colText || []).forEach((p) => col.append(el('p', 'case-columns__text', p)));
        if (lines?.length) {
          const ul = el('ul', 'case-columns__lines');
          lines.forEach((line) => ul.append(el('li', null, line)));
          col.append(ul);
        }
        ul.append(col);
      });
      text.append(ul);
    }

    outro.forEach((p) => text.append(el('p', null, p)));
    if (note) text.append(el('p', 'case-sec__note', note));

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
        // a page can give the facts their own place above the slides
        const host = document.querySelector('[data-case-facts]');
        if (host) {
          host.replaceChildren(dl);
        } else {
          const item = el('li', 'case-facts-wrap');
          item.append(dl);
          list.append(item);
        }
      }
      document.querySelectorAll('[data-case-facts]').forEach((host) => { host.hidden = !facts.length; });
      list.classList.toggle('case-canvas', CASE.layout === 'canvas');

      slides.forEach((slide, index) => {
        const first = index === 0;
        const { type, label, id, ...file } = typeof slide === 'string' ? { src: slide } : slide;
        // src / width / height may differ per language: { ru: '…', en: '…' };
        // a language without its own file falls back to en
        const pick = (value) => (value && typeof value === 'object' ? value[lang] ?? value.en ?? value.ru : value);
        const fallback = (value) => (value && typeof value === 'object' ? value.en : null);
        const src = pick(file.src) || '';
        const width = pick(file.width);
        const height = pick(file.height);
        // text keys use the block id, or the number the file name starts with
        const number = id || src.match(/^\d+/)?.[0] || src.replace(/\.[a-z0-9]+$/i, '');
        const item = el('li', 'case-slide');
        const card = el('div', 'case-shot');

        // authored text above the card (videos have none)
        const section = type === 'video' ? null : sectionBlock(number, text);

        // a text block without a picture
        if (type === 'text') {
          if (!section) return;
          item.classList.add('case-slide--text');
          item.append(section);
          list.append(item);
          return;
        }
        if (section) item.append(section);

        if (type === 'video') {
          // same card as images; never opened in a lightbox
          const video = document.createElement('video');
          video.muted = true;
          video.setAttribute('muted', ''); // iOS Safari needs the attribute to autoplay
          video.loop = true;
          video.playsInline = true;
          if (width) video.width = width;
          if (height) video.height = height;
          const poster = pick(file.poster);
          if (poster) video.poster = asset(poster);
          if (reduceMotion) {
            video.controls = true; // shows the poster; the visitor starts it when they want
          }
          // the file is attached only when the slide comes near the screen,
          // then it plays while it is on screen and pauses when it leaves
          let loaded = false;
          const load = () => {
            if (loaded) return;
            loaded = true;
            video.preload = reduceMotion ? 'none' : 'metadata';
            video.src = asset(src);
          };
          if (first || !('IntersectionObserver' in window)) {
            load();
            if (!reduceMotion) { video.autoplay = true; video.play().catch(() => {}); }
          } else {
            new IntersectionObserver((entries) => {
              if (entries.some((e) => e.isIntersecting)) load();
            }, { rootMargin: '600px 0px' }).observe(video);
            if (!reduceMotion) {
              new IntersectionObserver((entries) => {
                entries.forEach((e) => {
                  if (e.isIntersecting) { load(); video.play().catch(() => {}); }
                  else video.pause();
                });
              }, { threshold: 0.25 }).observe(video);
            }
          }
          const aria = label ? text(label) : null;
          if (aria) video.setAttribute('aria-label', aria);
          card.classList.add('case-shot--video');
          card.append(video);
          item.append(card);
          list.append(item);
          return;
        }

        // an image card: the picture is a button that opens the lightbox
        const imageCard = (shot, imgSrc, imgWidth, imgHeight, imgNumber, fallbackSrc) => {
          const img = new Image();
          if (imgWidth && imgHeight) { img.width = imgWidth; img.height = imgHeight; } // reserves the space while loading
          img.src = asset(imgSrc);
          img.alt = text(`${CASE.textKey}.alt${imgNumber}`) || `${t.slideAlt} ${imgNumber}`;
          img.loading = first ? 'eager' : 'lazy';
          if (first) img.fetchPriority = 'high';
          img.decoding = 'async';
          // the image is a button, so it opens in the lightbox with mouse or keyboard
          const zoom = el('button', 'case-shot__zoom');
          zoom.type = 'button';
          zoom.setAttribute('aria-label', `${ui(lang, 'case.zoom')}: ${img.alt}`);
          zoom.addEventListener('click', () => lightbox.open(img, zoom, lang));
          zoom.append(img);
          // a missing language version → the en file; no file at all → a numbered
          // placeholder of the same size
          img.addEventListener('error', () => {
            if (fallbackSrc && fallbackSrc !== imgSrc && !img.dataset.fallback) {
              img.dataset.fallback = 'en';
              img.src = asset(fallbackSrc);
              return;
            }
            shot.classList.add('is-missing');
            shot.dataset.number = imgNumber;
            zoom.remove();
          });
          shot.append(zoom);
          return shot;
        };

        // two pictures side by side in the width of one (one column on phones);
        // images: [{ id, src, width, height }], alt keys use each image's id
        if (type === 'pair') {
          const pair = el('div', 'case-pair');
          (file.images || []).forEach((image) => {
            const imgSrc = pick(image.src) || '';
            pair.append(imageCard(el('div', 'case-shot'), imgSrc, pick(image.width), pick(image.height),
              image.id || imgSrc.match(/^\d+/)?.[0], fallback(image.src)));
          });
          item.append(pair);
          list.append(item);
          return;
        }

        item.append(imageCard(card, src, width, height, number, fallback(file.src)));
        list.append(item);
      });
    }
  };

  /* Language switch on an already rendered case: build the new slides aside,
     let the pictures now on screen load and decode, then swap them in at once,
     so a card never shows empty for a moment; the slide at the top of the screen
     keeps its place */
  let swapId = 0;
  function swapSlides(list, items, t, lang) {
    const id = ++swapId;
    const next = list.cloneNode(false);
    renderers.slides(next, items, t, lang);
    const oldImgs = [...list.querySelectorAll('.case-shot img')];
    const newImgs = [...next.querySelectorAll('.case-shot img')];
    const onScreen = newImgs.filter((img, i) => {
      const box = oldImgs[i]?.getBoundingClientRect();
      return box && box.bottom > 0 && box.top < innerHeight;
    });
    onScreen.forEach((img) => { img.loading = 'eager'; });
    const ready = onScreen.map((img) => img.decode().catch(() => {}));
    const timeout = new Promise((resolve) => setTimeout(resolve, 1500));
    Promise.race([Promise.all(ready), timeout]).then(() => {
      if (id !== swapId) return; // a newer switch is on its way
      // texts in the other language differ in length: keep the slide that was
      // at the top of the screen in the same place
      const slidesNow = [...list.children];
      const anchor = slidesNow.findIndex((slide) => slide.getBoundingClientRect().bottom > 0);
      const anchorTop = anchor >= 0 ? slidesNow[anchor].getBoundingClientRect().top : 0;
      list.replaceChildren(...next.childNodes);
      const same = list.children[anchor];
      if (same) window.scrollBy({ top: same.getBoundingClientRect().top - anchorTop, behavior: 'instant' });
    });
  }

  function render(lang) {
    const t = CASE[lang] || CASE.en;

    document.querySelectorAll('[data-case]').forEach((node) => {
      const value = t[node.dataset.case];
      if (value != null) node.textContent = typo(value);
      node.hidden = !value; // empty text → no empty block on the page
    });

    document.querySelectorAll('[data-case-list]').forEach((list) => {
      const key = list.dataset.caseList;
      const items = key === 'slides' ? CASE.slides || [] : t[key] || [];
      if (key === 'slides' && list.children.length) swapSlides(list, items, t, lang);
      else {
        list.replaceChildren();
        renderers[key]?.(list, items, t, lang);
      }
      document.querySelectorAll(`[data-case-section="${key}"]`)
        .forEach((section) => { section.hidden = items.length === 0; });
    });

    document.querySelectorAll('[data-case-cover]').forEach((cover) => {
      cover.dataset.gradient = CASE.gradient || 'violet';
    });
  }

  /* Decorative video at the end of the case (e.g. an animated logo with a
     transparent background). Muted, looped, inline; plays only while on screen,
     not at all with reduced motion; no block if the format isn't supported. */
  function renderDecor() {
    const host = document.querySelector('[data-case-decor]');
    if (!host) return;
    const decor = CASE.decor;
    const video = document.createElement('video');
    if (!decor || !video.canPlayType(decor.type || '')) {
      host.hidden = true;
      return;
    }
    video.muted = true;
    video.setAttribute('muted', '');
    video.loop = true;
    video.playsInline = true;
    video.preload = 'none';
    video.setAttribute('aria-hidden', 'true');
    video.tabIndex = -1;
    if (decor.width) video.width = decor.width;
    if (decor.height) video.height = decor.height;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let loaded = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      video.preload = reduceMotion ? 'auto' : 'metadata';
      video.src = asset(decor.src);
    };
    // reduced motion: no playback; show the last frame, where the logo is complete
    // (the first frame of such an animation is often empty)
    if (reduceMotion) {
      // a webm often reports its duration only after more of the file has loaded
      let parked = false;
      const park = () => {
        if (parked || !Number.isFinite(video.duration)) return;
        parked = true;
        video.currentTime = Math.max(0, video.duration - 0.05);
      };
      ['loadedmetadata', 'durationchange', 'canplaythrough'].forEach((type) => video.addEventListener(type, park));
    }
    host.replaceChildren(video);
    host.hidden = false;
    if (!('IntersectionObserver' in window)) { load(); return; }
    new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) { video.pause(); return; }
        load();
        if (!reduceMotion) video.play().catch(() => {});
      });
    }, { rootMargin: '200px 0px' }).observe(host);
  }

  document.addEventListener('DOMContentLoaded', renderDecor);
  document.addEventListener('langchange', (e) => render(e.detail.lang));
  // fallback if i18n didn't run
  document.addEventListener('DOMContentLoaded', () => render(document.documentElement.lang || 'en'));
})();
