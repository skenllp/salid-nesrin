/* =========================================================
   M & N — Together Forever | Wedding Microsite Scripts
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- PRELOADER / SPLASH ---------- */
  const preloader = document.getElementById('preloader');
  const enterBtn  = document.getElementById('enterBtn');

  // fromGesture = true means called from a real user tap/click — safe to play audio
  const dismissSplash = (fromGesture = false) => {
    preloader.classList.add('loaded');
    // Only start music when triggered by a real user gesture (Android/iOS autoplay policy)
    if (fromGesture) {
      const music = document.getElementById('bgMusic');
      if (music) {
        music.volume = 0.5;
        music.play().catch(() => {});
        const btn = document.getElementById('musicToggle');
        if (btn) btn.classList.add('playing');
      }
    }
    if (window.AOS) AOS.refresh();
  };

  // Dismiss only on tap/click (real user gesture — music will start)
  if (enterBtn) {
    enterBtn.addEventListener('click', () => dismissSplash(true));
    enterBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') dismissSplash(true);
    });
  }

  // Safety fallback — auto-dismiss after 12s without music (no user gesture)
  setTimeout(() => preloader && preloader.classList.add('loaded'), 12000);

  /* ---------- LENIS SMOOTH SCROLL ---------- */
  let lenis;
  if (window.Lenis && !prefersReducedMotion) {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ---------- AOS INIT ---------- */
  if (window.AOS) {
    AOS.init({
      duration: 900,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60
    });
  }

  /* ---------- GSAP HERO INTRO ---------- */
  if (window.gsap) {
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('#navbar', { y: -80, opacity: 0, duration: 0.9 })
      .from('.hero-bg', { opacity: 0, scale: 1.15, duration: 1.4 }, '-=0.5')
      .from('.scroll-indicator', { opacity: 0, y: 20, duration: 0.8 }, '-=0.4')
      .from('.deco-ball', { opacity: 0, y: -40, rotate: -90, duration: 0.9 }, '-=0.6');
  }

  /* ---------- HERO MOUSE PARALLAX ---------- */
  const heroSection = document.querySelector('.hero-section');
  const heroImg = document.getElementById('hero-img');
  const decoBall = document.querySelector('.deco-ball');
  if (heroSection && window.gsap && !prefersReducedMotion && window.matchMedia('(hover:hover)').matches) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(heroImg, { x: px * 18, y: py * 12, duration: 0.8, ease: 'power2.out' });
      if (decoBall) gsap.to(decoBall, { x: px * -32, y: py * -24, duration: 0.9, ease: 'power2.out' });
    });
    heroSection.addEventListener('mouseleave', () => {
      gsap.to(heroImg, { x: 0, y: 0, duration: 1 });
      if (decoBall) gsap.to(decoBall, { x: 0, y: 0, duration: 1 });
    });
  }

  /* ---------- GSAP SCROLLTRIGGER SECTION REVEALS ---------- */
  if (window.gsap && window.ScrollTrigger) {
    // Our Story — fade + soft scale in
    gsap.utils.toArray('.our-story-frame').forEach((el) => {
      gsap.fromTo(el, { opacity: 0, y: 50, scale: 0.97 }, {
        opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });
    // Childhood memories — fade reveal
    gsap.utils.toArray('.childhood-float').forEach((el) => {
      gsap.fromTo(el, { opacity: 0, y: 60 }, {
        opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });
    // Invitation banner + card
    gsap.utils.toArray('.invitation-frame, .invitation-banner-img').forEach((el) => {
      gsap.fromTo(el, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });
    // Event cards stagger
    gsap.utils.toArray('.event-card').forEach((el, i) => {
      gsap.fromTo(el, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.9, delay: i * 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });
    // Hero parallax on scroll
    gsap.utils.toArray('.hero-bg').forEach(el => {
      gsap.to(el, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true }
      });
    });
  }

  /* ---------- NAVBAR SCROLL STATE ---------- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- MOBILE MENU TOGGLE ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('flex');
    mobileMenu.classList.toggle('hidden');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    menuToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
    if (lenis) { isOpen ? lenis.stop() : lenis.start(); }
  });

  document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('flex');
      menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      menuToggle.setAttribute('aria-expanded', 'false');
      if (lenis) lenis.start();
    });
  });

  /* ---------- ACTIVE NAV LINK ON SCROLL ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('[data-nav]');
  const setActive = (id) => {
    navLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
    });
  };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(sec => observer.observe(sec));
  }

  /* ---------- COUNTDOWN TIMER (with flip animation) ---------- */
  const weddingDate = new Date('2026-08-23T18:00:00+05:30').getTime();
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');
  const pad = (n) => String(n).padStart(2, '0');

  const setDigit = (el, value) => {
    if (!el) return;
    const next = pad(value);
    if (el.textContent === next) return;
    el.textContent = next;
    if (!prefersReducedMotion) {
      el.classList.remove('flip');
      // eslint-disable-next-line no-unused-expressions
      void el.offsetWidth; // restart animation
      el.classList.add('flip');
    }
  };

  const updateCountdown = () => {
    const now = Date.now();
    let diff = weddingDate - now;
    if (diff < 0) diff = 0;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    setDigit(cdDays, days);
    setDigit(cdHours, hours);
    setDigit(cdMinutes, minutes);
    setDigit(cdSeconds, seconds);
  };
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------- WISHES FORM ---------- */
  const wishesForm = document.getElementById('wishesForm');
  const wishThanks = document.getElementById('wishThanks');
  if (wishesForm) {
    wishesForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameField = document.getElementById('wishName');
      const messageField = document.getElementById('wishMessage');
      let valid = true;
      [nameField, messageField].forEach((field) => {
        if (!field.value.trim()) {
          field.setAttribute('aria-invalid', 'true');
          valid = false;
        } else {
          field.removeAttribute('aria-invalid');
        }
      });
      if (!valid) return;
      const name = nameField.value.trim();
      wishThanks.textContent = `Thank you, ${name}! Your wishes mean the world to us. \u2764`;
      wishesForm.reset();
      if (window.gsap) {
        gsap.fromTo(wishThanks, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6 });
      }
      setTimeout(() => { wishThanks.textContent = ''; }, 6000);
    });
  }

  /* ---------- CHILDHOOD SCRATCH REVEAL (canvas) ---------- */
  const scratchWrap = document.querySelector('.ls-scratch');
  const scratchCanvas = document.querySelector('.ls-scratch-canvas');
  const scratchLabel = document.querySelector('.ls-scratch-label');

  if (scratchWrap && scratchCanvas) {
    const ctx = scratchCanvas.getContext('2d');
    let isScratching = false;
    let scratchedPixels = 0;
    const BRUSH = 44;
    const REVEAL_THRESHOLD = 0.45; // 45% scratched = fully reveal

    const initCanvas = () => {
      const w = scratchWrap.offsetWidth;
      const h = scratchWrap.offsetHeight;
      scratchCanvas.width  = w;
      scratchCanvas.height = h;
      // Fill with the navy gradient
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#1a3a7a');
      grad.addColorStop(1, '#0f2d5e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      // Diagonal lines texture
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 2;
      for (let i = -h; i < w + h; i += 12) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + h, h);
        ctx.stroke();
      }
      scratchedPixels = 0;
    };

    const scratch = (x, y) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, BRUSH, 0, Math.PI * 2);
      ctx.fill();

      // Check reveal percentage every few moves
      scratchedPixels += Math.PI * BRUSH * BRUSH;
      const total = scratchCanvas.width * scratchCanvas.height;
      if (scratchedPixels / total > REVEAL_THRESHOLD) {
        scratchWrap.classList.add('revealed');
      }
    };

    const getPos = (e) => {
      const rect = scratchCanvas.getBoundingClientRect();
      const src  = e.touches ? e.touches[0] : e;
      return {
        x: (src.clientX - rect.left) * (scratchCanvas.width  / rect.width),
        y: (src.clientY - rect.top)  * (scratchCanvas.height / rect.height)
      };
    };

    // Hide label once user starts scratching
    const hideLabel = () => {
      if (scratchLabel) scratchLabel.style.opacity = '0';
    };

    scratchCanvas.addEventListener('mousedown',  (e) => { isScratching = true; hideLabel(); scratch(...Object.values(getPos(e))); });
    scratchCanvas.addEventListener('mousemove',  (e) => { if (isScratching) scratch(...Object.values(getPos(e))); });
    scratchCanvas.addEventListener('mouseup',    () => { isScratching = false; });
    scratchCanvas.addEventListener('mouseleave', () => { isScratching = false; });
    scratchCanvas.addEventListener('touchstart', (e) => { e.preventDefault(); isScratching = true; hideLabel(); scratch(...Object.values(getPos(e))); }, { passive: false });
    scratchCanvas.addEventListener('touchmove',  (e) => { e.preventDefault(); if (isScratching) scratch(...Object.values(getPos(e))); }, { passive: false });
    scratchCanvas.addEventListener('touchend',   () => { isScratching = false; });

    // Init after image loads so size is correct
    const parentImg = scratchWrap.closest('.ls-photo-frame')?.querySelector('img');
    if (parentImg && parentImg.complete) {
      initCanvas();
    } else if (parentImg) {
      parentImg.addEventListener('load', initCanvas);
    } else {
      initCanvas();
    }
    window.addEventListener('resize', initCanvas);
  }

  /* ---------- MUSIC TOGGLE ---------- */
  const bgMusic     = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  if (bgMusic && musicToggle) {
    musicToggle.addEventListener('click', () => {
      if (bgMusic.paused) {
        bgMusic.play().catch(() => {});
        musicToggle.classList.add('playing');
        musicToggle.setAttribute('aria-label', 'Pause music');
      } else {
        bgMusic.pause();
        musicToggle.classList.remove('playing');
        musicToggle.setAttribute('aria-label', 'Play music');
      }
    });
  }

  /* ---------- BACK TO TOP CLICK SMOOTH ---------- */
  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    if (lenis) { lenis.scrollTo(0); } else { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  });

  /* ---------- SMOOTH SCROLL FOR ALL ANCHORS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        if (lenis) { lenis.scrollTo(target, { offset: -70 }); }
        else { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      }
    });
  });

  /* ---------- CONFETTI CANVAS ---------- */
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  let confetti = [];
  const colors = ['#6EC1FF', '#FFD66B', '#FFFFFF'];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  function createConfetti() {
    const count = window.innerWidth < 768 ? 30 : 55;
    confetti = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      size: Math.random() * 5 + 3,
      speed: Math.random() * 1 + 0.4,
      drift: Math.random() * 1 - 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 2 - 1
    }));
  }
  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach(p => {
      p.y += p.speed;
      p.x += p.drift;
      p.rotation += p.rotSpeed;
      if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5);
      ctx.restore();
    });
    requestAnimationFrame(animateConfetti);
  }
  resizeCanvas();
  createConfetti();
  // Respect reduced motion preference
  if (!prefersReducedMotion) {
    requestAnimationFrame(animateConfetti);
  }
  window.addEventListener('resize', () => { resizeCanvas(); createConfetti(); });

  /* ---------- MAGNETIC BUTTONS ---------- */
  document.querySelectorAll('.event-btn, .wish-submit, .back-to-top').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      if (window.gsap) {
        gsap.to(btn, { x: x * 0.15, y: y * 0.25, duration: 0.3, ease: 'power2.out' });
      }
    });
    btn.addEventListener('mouseleave', () => {
      if (window.gsap) gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: 'power3.out' });
    });
  });


});
