/* ================================================================
   STARFIELD BACKGROUND
   Stars accelerate outward from center like a warp jump.
   Occasional streak lines. Subtle nebula glow in the center.
   Opacity is dimmed automatically on content pages so text
   stays fully readable.
================================================================ */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  let W, H, cx, cy;
  let stars = [];
  let warpLines = [];

  const NUM_STARS = 260;
  const NUM_WARP  = 8;
  const BASE_SPEED = 0.4;
  const WARP_SPEED = 6;

  let OPACITY_SCALE = 1.0;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cx = W / 2;
    cy = H / 2;
  }

  window.addEventListener('resize', () => { resize(); initStars(); });

  function randomStar(fromCenter) {
    const angle = Math.random() * Math.PI * 2;
    return {
      angle,
      dist: fromCenter ? Math.random() * Math.min(W, H) * 0.45 : Math.random() * 2,
      size: 0,
      speed: BASE_SPEED + Math.random() * 1.2,
      teal: Math.random() < 0.12,
      trail: [],
      maxTrail: 6 + Math.floor(Math.random() * 10),
    };
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < NUM_STARS; i++) stars.push(randomStar(true));

    warpLines = [];
    for (let i = 0; i < NUM_WARP; i++) warpLines.push(newWarpLine());
  }

  function newWarpLine() {
    const angle = Math.random() * Math.PI * 2;
    return {
      angle,
      dist: Math.random() * Math.min(W, H) * 0.1,
      length: 40 + Math.random() * 120,
      speed: WARP_SPEED + Math.random() * 6,
      alpha: 0,
      teal: Math.random() < 0.25,
    };
  }

  function polarToXY(angle, dist) {
    return { x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist };
  }

  function drawNebula() {
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.55);
    grad.addColorStop(0,   `rgba(0,255,204,${0.022 * OPACITY_SCALE})`);
    grad.addColorStop(0.5, `rgba(0,100,255,${0.012 * OPACITY_SCALE})`);
    grad.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  function updateAndDrawStars() {
    const margin = 20;
    stars.forEach((s, idx) => {
      s.dist += s.speed;
      s.size  = (s.dist / Math.min(W, H)) * 2.8;

      const pos = polarToXY(s.angle, s.dist);
      s.trail.push({ x: pos.x, y: pos.y });
      if (s.trail.length > s.maxTrail) s.trail.shift();

      if (pos.x < -margin || pos.x > W + margin || pos.y < -margin || pos.y > H + margin) {
        stars[idx] = randomStar(false);
        return;
      }

      const alpha = Math.min(1, s.dist / 80) * OPACITY_SCALE;
      const color = s.teal ? '0,255,204' : '255,255,255';

      if (s.trail.length > 1) {
        for (let t = 1; t < s.trail.length; t++) {
          const ta = (t / s.trail.length) * alpha * 0.45;
          ctx.beginPath();
          ctx.moveTo(s.trail[t - 1].x, s.trail[t - 1].y);
          ctx.lineTo(s.trail[t].x, s.trail[t].y);
          ctx.strokeStyle = `rgba(${color},${ta})`;
          ctx.lineWidth   = s.size * 0.5;
          ctx.stroke();
        }
      }

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, Math.max(0.4, s.size * 0.6), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},${alpha * 0.9})`;
      ctx.fill();
    });
  }

  function updateAndDrawWarpLines() {
    const margin = 30;
    warpLines.forEach((wl, idx) => {
      wl.dist  += wl.speed;
      wl.alpha  = Math.min(1, wl.dist / 60) * OPACITY_SCALE;

      const tail = polarToXY(wl.angle, wl.dist);
      const head = polarToXY(wl.angle, wl.dist + wl.length);
      const off  = (p) => p.x < -margin || p.x > W + margin || p.y < -margin || p.y > H + margin;

      if (off(tail) && off(head)) { warpLines[idx] = newWarpLine(); return; }

      const color = wl.teal ? '0,255,204' : '255,255,255';
      const grad  = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
      grad.addColorStop(0, `rgba(${color},0)`);
      grad.addColorStop(1, `rgba(${color},${wl.alpha * 0.5})`);

      ctx.beginPath();
      ctx.moveTo(tail.x, tail.y);
      ctx.lineTo(head.x, head.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth   = 1;
      ctx.stroke();
    });
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    drawNebula();
    updateAndDrawStars();
    updateAndDrawWarpLines();
    requestAnimationFrame(frame);
  }

  resize();
  initStars();
  frame();

  // Exposed so the nav system can dim the effect on content pages
  window.setStarfieldOpacity = function (v) { OPACITY_SCALE = v; };
})();


/* ================================================================
   TYPEWRITER EFFECT
================================================================ */
(function () {
  const el  = document.getElementById('typewriter');
  const btn = document.getElementById('enter-btn');
  const text = "MANJOT'S\nPORTFOLIO";
  let i = 0;

  function tick() {
    if (i <= text.length) {
      el.innerHTML = text.slice(0, i).replace('\n', '<br>');
      i++;
      const delay = text[i - 1] === '\n' ? 300 : 70 + Math.random() * 50;
      setTimeout(tick, delay);
    } else {
      btn.classList.add('visible');
    }
  }

  setTimeout(tick, 600);
})();


/* ================================================================
   PAGE NAVIGATION
================================================================ */
(function () {
  const wrapper      = document.getElementById('pages-wrapper');
  const navLeft      = document.getElementById('nav-left');
  const navRight     = document.getElementById('nav-right');
  const dotsContainer= document.getElementById('page-dots');
  const pageLabel    = document.getElementById('page-label');

  const pages      = Array.from(wrapper.querySelectorAll('.page'));
  const PAGE_NAMES = ['ENTER', 'ABOUT', 'SKILLS', 'EXPERIENCE', 'PROJECTS', 'EDUCATION', 'CONTACT'];
  const TOTAL      = pages.length;

  let current      = 0;
  let transitioning= false;

  // Build navigation dots (one per content page, skipping splash)
  const dots = [];
  for (let i = 1; i < TOTAL; i++) {
    const d = document.createElement('div');
    d.className = 'dot';
    d.setAttribute('role', 'button');
    d.setAttribute('aria-label', `Go to ${PAGE_NAMES[i]}`);
    d.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(d);
    dots.push(d);
  }

  /* ------------------------------------------------------------
     Overflow detection
     After each slide, check if the active page's content is
     taller than the viewport and add .needs-scroll if so.
     This catches edge cases not covered by media queries
     (e.g. wide-but-short desktop windows, unusual screen ratios).
  ------------------------------------------------------------ */
  function checkOverflow() {
    pages.forEach((page, idx) => {
      if (!page.classList.contains('scrollable')) return;
      const inner = page.querySelector('.page-inner');
      if (!inner) return;

      // Reset first so measurement is accurate
      page.classList.remove('needs-scroll');
      page.style.alignItems = '';

      // Give browser a frame to reflow, then measure
      requestAnimationFrame(() => {
        if (inner.scrollHeight > page.clientHeight) {
          page.classList.add('needs-scroll');
        }
      });
    });
  }

  window.addEventListener('resize', checkOverflow);

  function updateUI() {
    const inMain = current > 0;

    navLeft.classList.toggle('visible', inMain);
    navRight.classList.toggle('visible', inMain && current < TOTAL - 1);
    dotsContainer.classList.toggle('visible', inMain);
    pageLabel.classList.toggle('visible', inMain);
    pageLabel.textContent = PAGE_NAMES[current] || '';

    dots.forEach((d, i) => d.classList.toggle('active', i === current - 1));

    // Dim starfield on content pages for readability
    if (window.setStarfieldOpacity) {
      window.setStarfieldOpacity(inMain ? 0.45 : 1.0);
    }
  }

  function goTo(idx) {
    if (transitioning || idx === current || idx < 0 || idx >= TOTAL) return;
    transitioning = true;
    current = idx;
    wrapper.style.transform = `translateX(-${current * 100}vw)`;
    updateUI();
    // Scroll new page to top in case it was previously scrolled
    const arriving = pages[current];
    if (arriving) arriving.scrollTop = 0;
    setTimeout(() => {
      transitioning = false;
      checkOverflow();
    }, 800);
  }

  // Controls
  document.getElementById('enter-btn').addEventListener('click', () => goTo(1));
  navLeft.addEventListener('click',  () => goTo(current - 1));
  navRight.addEventListener('click', () => goTo(current + 1));

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(current + 1);
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goTo(current - 1);
  });

  // Touch / swipe — only fires on horizontal dominance so vertical
  // scrolling within a page still works normally
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      goTo(current + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });

  updateUI();
  checkOverflow();
})();
