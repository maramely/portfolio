/* ============================================
   HERO — Mask Hover Reveal
   Блок 1 — живой текст <h1>. Блок 2 (светлая тема)
   или блок 3 (тёмная) — экспорт из Figma, лежит
   ровно в той же области. Курсор рисует мягкую
   «кисть» в маске; через неё виден цветной блок.

   Из экспорта берётся только форма букв (альфа),
   цвет — градиент --gradient-reveal из tokens.css.

   Мазок — это цепочка штампов. Каждый штамп живёт
   LIFE мс и постепенно гаснет, поэтому след плавно
   исчезает и после остановки курсора.

   Эффект включается только при мыши/стилусе и если
   не включено «уменьшение движения».
   ============================================ */

(function () {
  const IMAGES = {
    light: 'assets/hero/reveal-light.png', // Figma node 81:536
    dark: 'assets/hero/reveal-dark.png',   // Figma node 81:541
  };

  const LIFE = 1400;        // ms a stamp stays visible
  const BRUSH = 0.34;       // brush radius, in em of the title font size
  const SPACING = 0.16;     // distance between stamps, in brush radii
  const FOLLOW = 0.35;      // how fast the brush catches up with the cursor

  /* Turns "linear-gradient(135deg, #hex 0%, …)" into a canvas gradient
     spanning a w×h box the same way CSS would. */
  function cssGradient(ctx, value, w, h) {
    const angle = parseFloat((value.match(/(-?[\d.]+)deg/) || [0, 180])[1]) * Math.PI / 180;
    const stops = [...value.matchAll(/(#[0-9a-f]{3,8})\s+([\d.]+)%/gi)];
    const dx = Math.sin(angle);
    const dy = -Math.cos(angle);
    const half = (Math.abs(w * dx) + Math.abs(h * dy)) / 2;
    const g = ctx.createLinearGradient(w / 2 - dx * half, h / 2 - dy * half, w / 2 + dx * half, h / 2 + dy * half);
    for (const [, color, pos] of stops) g.addColorStop(parseFloat(pos) / 100, color);
    return g;
  }

  const canUseEffect = () =>
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

  /* ---------- Brush texture ----------
     A soft, slightly ragged blob: one blurred core plus
     a ring of smaller blobs, so the edge is never a clean circle. */
  function makeBrushTexture(seed) {
    const size = 256;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d');
    let s = seed;
    const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647);

    g.filter = 'blur(10px)';
    const blob = (x, y, r, a) => {
      const grad = g.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, `rgba(0,0,0,${a})`);
      grad.addColorStop(0.6, `rgba(0,0,0,${a * 0.7})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = grad;
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI * 2);
      g.fill();
    };

    blob(size / 2, size / 2, size * 0.34, 1);
    for (let i = 0; i < 16; i++) {
      const ang = rand() * Math.PI * 2;
      const dist = size * (0.12 + rand() * 0.18);
      blob(
        size / 2 + Math.cos(ang) * dist,
        size / 2 + Math.sin(ang) * dist,
        size * (0.08 + rand() * 0.12),
        0.5 + rand() * 0.5
      );
    }
    return c;
  }

  function init() {
    const hero = document.querySelector('.hero');
    const headline = document.querySelector('.hero__headline');
    if (!hero || !headline) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'hero__reveal';
    canvas.setAttribute('aria-hidden', 'true');
    headline.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const mask = document.createElement('canvas');
    const mctx = mask.getContext('2d');

    const textures = [1, 7, 42, 99].map(makeBrushTexture);
    const images = {};
    for (const [theme, src] of Object.entries(IMAGES)) {
      images[theme] = new Image();
      images[theme].src = src;
    }

    let width = 0, height = 0, dpr = 1, radius = 40;
    let stamps = [];
    let target = null;   // last pointer position
    let brush = null;    // smoothed brush position
    let running = false;
    let fill = { key: null, gradient: null };
    let enabled = false;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = mask.width = Math.round(width * dpr);
      canvas.height = mask.height = Math.round(height * dpr);
      radius = parseFloat(getComputedStyle(canvas).fontSize) * BRUSH;
      kick();
    }

    function addStampsTo(x, y, now) {
      const dx = x - brush.x;
      const dy = y - brush.y;
      const dist = Math.hypot(dx, dy);
      const step = radius * SPACING;
      // faster strokes stretch along the direction of travel
      const stretch = 1 + Math.min(dist / (radius * 1.2), 1.1);
      const angle = Math.atan2(dy, dx);
      const count = Math.max(1, Math.floor(dist / step));
      for (let i = 1; i <= count; i++) {
        const t = i / count;
        stamps.push({
          x: brush.x + dx * t,
          y: brush.y + dy * t,
          born: now,
          angle: angle + (Math.random() - 0.5) * 0.5,
          stretch,
          scale: 0.85 + Math.random() * 0.3,
          tex: textures[(Math.random() * textures.length) | 0],
        });
      }
      brush = { x, y };
    }

    function frame(now) {
      // brush eases towards the cursor, so the trail stays smooth
      if (target) {
        if (!brush) brush = { ...target };
        const nx = brush.x + (target.x - brush.x) * FOLLOW;
        const ny = brush.y + (target.y - brush.y) * FOLLOW;
        if (Math.hypot(nx - brush.x, ny - brush.y) > 0.5) addStampsTo(nx, ny, now);
      }

      stamps = stamps.filter((s) => now - s.born < LIFE);

      mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mctx.clearRect(0, 0, width, height);
      for (const s of stamps) {
        const life = 1 - (now - s.born) / LIFE;
        mctx.globalAlpha = life * life * 0.9;
        const r = radius * s.scale * (0.75 + 0.25 * life); // edges dry out as it fades
        mctx.save();
        mctx.translate(s.x, s.y);
        mctx.rotate(s.angle);
        mctx.scale(s.stretch, 1 / Math.sqrt(s.stretch));
        mctx.drawImage(s.tex, -r, -r, r * 2, r * 2);
        mctx.restore();
      }
      mctx.globalAlpha = 1;

      const theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
      const img = images[theme];
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (stamps.length && img.complete && img.naturalWidth) {
        ctx.drawImage(mask, 0, 0);
        ctx.globalCompositeOperation = 'source-in';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // keep the letter shape, swap the colour for the palette gradient
        const key = `${theme}|${canvas.width}x${canvas.height}`;
        if (fill.key !== key) {
          const value = getComputedStyle(document.documentElement).getPropertyValue('--gradient-reveal');
          fill = { key, gradient: cssGradient(ctx, value, canvas.width, canvas.height) };
        }
        ctx.fillStyle = fill.gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // stop the loop once everything has faded and the brush is idle
      const idle = !target || (brush && Math.hypot(target.x - brush.x, target.y - brush.y) < 0.5);
      if (stamps.length || !idle) {
        requestAnimationFrame(frame);
      } else {
        running = false;
      }
    }

    function kick() {
      if (!enabled || running) return;
      running = true;
      requestAnimationFrame(frame);
    }

    function onMove(e) {
      if (e.pointerType === 'touch') return;
      const rect = canvas.getBoundingClientRect();
      target = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      kick();
    }

    function onLeave() {
      target = null;
      brush = null;
    }

    function setEnabled(on) {
      enabled = on;
      canvas.hidden = !on;
      if (on) {
        hero.addEventListener('pointermove', onMove);
        hero.addEventListener('pointerleave', onLeave);
        resize();
      } else {
        hero.removeEventListener('pointermove', onMove);
        hero.removeEventListener('pointerleave', onLeave);
        stamps = [];
        onLeave();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    new ResizeObserver(() => enabled && resize()).observe(canvas);

    const update = () => setEnabled(canUseEffect());
    window.matchMedia('(hover: hover) and (pointer: fine)').addEventListener('change', update);
    window.matchMedia('(prefers-reduced-motion: no-preference)').addEventListener('change', update);
    update();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
