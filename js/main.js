// ---------- Animated starfield ----------
(function () {
  const canvas = document.getElementById('stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let w, h;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(160, Math.floor((w * h) / 9000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.2,
      tw: Math.random() * Math.PI * 2,       // twinkle phase
      sp: Math.random() * 0.015 + 0.004      // twinkle speed
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.tw += s.sp;
      const alpha = 0.4 + Math.sin(s.tw) * 0.4;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    }
    if (!reduced) requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

// ---------- "Open all four" best-option portals ----------
(function () {
  const btn = document.getElementById('openAll');
  if (!btn) return;
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-best]').forEach((a, i) => {
      // slight stagger so popup blockers are friendlier
      setTimeout(() => window.open(a.href, '_blank', 'noopener'), i * 120);
    });
  });
})();

// ---------- Source tabs ----------
(function () {
  const btns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');
  if (!btns.length) return;
  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      btns.forEach((b) => b.classList.toggle('active', b === btn));
      panels.forEach((p) => p.classList.toggle('active', p.getAttribute('data-panel') === tab));
      // reveal any lazy cards now visible
      document.querySelectorAll('.tab-panel.active .reveal').forEach((el) => el.classList.add('in'));
    });
  });
})();

// ---------- Reveal-on-scroll ----------
(function () {
  const items = document.querySelectorAll('.section-head, .card, .chip, .note');
  items.forEach((el) => el.classList.add('reveal'));

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  items.forEach((el) => io.observe(el));
})();
