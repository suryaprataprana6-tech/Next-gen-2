/**
 * NEXTGEN DIGITAL AGENCY — script.js
 * Three.js 3D | Particles | Parallax | Scroll Animations
 * Carousel | Counter | 3D Tilt | Form Validation
 */

/* ===================================================
   1. CUSTOM CURSOR
=================================================== */
(function initCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
  });

  // Ring follows with lag
  function animateRing() {
    ringX += (mouseX - ringX - 18) * 0.15;
    ringY += (mouseY - ringY - 18) * 0.15;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  document.querySelectorAll('a, button, .service-card, .tilt-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
})();

/* ===================================================
   2. NAVBAR SCROLL BEHAVIOR
=================================================== */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // Smooth active link highlighting
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 160) current = s.id;
    });
    links.forEach(l => {
      l.classList.remove('active-link');
      if (l.getAttribute('href') === '#' + current) l.classList.add('active-link');
    });
  });
})();

/* ===================================================
   3. PARTICLE CANVAS BACKGROUND
=================================================== */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Particle class
  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = Math.random() * 1.8 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '96,165,250' : Math.random() > 0.5 ? '139,92,246' : '6,182,212';
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  // Create particles
  const count = Math.min(120, Math.floor((W * H) / 8000));
  for (let i = 0; i < count; i++) particles.push(new Particle());

  // Draw connecting lines
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(59,130,246,${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ===================================================
   4. THREE.JS 3D OBJECT + PARALLAX
=================================================== */
(function initThreeJS() {
  if (typeof THREE === 'undefined') return;
  const container = document.getElementById('threeContainer');
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // ---- Lights ----
  const ambientLight = new THREE.AmbientLight(0x1a1a2e, 2);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x3b82f6, 3, 20);
  pointLight1.position.set(3, 3, 3);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x8b5cf6, 3, 20);
  pointLight2.position.set(-3, -2, 2);
  scene.add(pointLight2);

  const pointLight3 = new THREE.PointLight(0x06b6d4, 2, 15);
  pointLight3.position.set(0, -3, 3);
  scene.add(pointLight3);

  // ---- Main Torus Knot ----
  const torusKnotGeo = new THREE.TorusKnotGeometry(1.4, 0.4, 150, 20, 2, 3);
  const torusKnotMat = new THREE.MeshPhongMaterial({
    color: 0x1a1a3e,
    emissive: 0x0a0a2e,
    specular: 0x3b82f6,
    shininess: 80,
    wireframe: false,
    transparent: true, opacity: 0.9
  });
  const torusKnot = new THREE.Mesh(torusKnotGeo, torusKnotMat);
  scene.add(torusKnot);

  // Wireframe overlay on knot
  const wireframeMat = new THREE.MeshBasicMaterial({
    color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.15
  });
  const wireframeKnot = new THREE.Mesh(torusKnotGeo, wireframeMat);
  scene.add(wireframeKnot);

  // ---- Outer Floating Rings ----
  function createRing(radius, tube, color, opacity) {
    const geo = new THREE.TorusGeometry(radius, tube, 8, 60);
    const mat = new THREE.MeshBasicMaterial({ color, wireframe: false, transparent: true, opacity });
    return new THREE.Mesh(geo, mat);
  }
  const ring1 = createRing(2.6, 0.015, 0x3b82f6, 0.6);
  const ring2 = createRing(3.2, 0.012, 0x8b5cf6, 0.4);
  const ring3 = createRing(3.8, 0.01, 0x06b6d4, 0.3);
  ring1.rotation.x = Math.PI / 4;
  ring2.rotation.x = Math.PI / 6; ring2.rotation.y = Math.PI / 3;
  ring3.rotation.x = Math.PI / 2.5; ring3.rotation.z = Math.PI / 4;
  scene.add(ring1, ring2, ring3);

  // ---- Floating Particles (3D) ----
  const particleCount = 200;
  const pGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const pColors = new Float32Array(particleCount * 3);
  const colorOptions = [
    new THREE.Color(0x3b82f6),
    new THREE.Color(0x8b5cf6),
    new THREE.Color(0x06b6d4)
  ];
  for (let i = 0; i < particleCount; i++) {
    const r = 4 + Math.random() * 4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    const c = colorOptions[Math.floor(Math.random() * 3)];
    pColors[i * 3] = c.r; pColors[i * 3 + 1] = c.g; pColors[i * 3 + 2] = c.b;
  }
  pGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeometry.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
  const pMaterial = new THREE.PointsMaterial({ size: 0.06, vertexColors: true, transparent: true, opacity: 0.7 });
  const points = new THREE.Points(pGeometry, pMaterial);
  scene.add(points);

  // ---- Mouse Parallax ----
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 0.6;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.6;
  });

  // ---- Resize ----
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ---- Animate ----
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Rotate main object
    torusKnot.rotation.x = t * 0.2;
    torusKnot.rotation.y = t * 0.3;
    wireframeKnot.rotation.x = t * 0.2;
    wireframeKnot.rotation.y = t * 0.3;

    // Rotate rings
    ring1.rotation.z = t * 0.4;
    ring2.rotation.z = -t * 0.3;
    ring3.rotation.z = t * 0.2;
    ring3.rotation.x = Math.PI / 2.5 + t * 0.1;

    // Rotate particles
    points.rotation.y = t * 0.05;
    points.rotation.x = t * 0.03;

    // Light animation
    pointLight1.position.x = Math.sin(t * 0.7) * 4;
    pointLight1.position.y = Math.cos(t * 0.5) * 4;
    pointLight2.position.x = Math.cos(t * 0.6) * 4;
    pointLight2.position.y = Math.sin(t * 0.8) * 3;

    // Camera parallax
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;
    camera.position.x = currentX;
    camera.position.y = -currentY;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();
})();

/* ===================================================
   5. INTERSECTION OBSERVER — REVEAL + COUNTERS
=================================================== */
(function initReveal() {
  // Reveal animations
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger sibling elements
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        let delay = 0;
        siblings.forEach((sib, idx) => { if (sib === entry.target) delay = idx * 80; });
        setTimeout(() => entry.target.classList.add('visible'), Math.min(delay, 400));
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // Animated counters
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const isDecimal = el.dataset.decimal === 'true';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const value = target * eased;
      el.textContent = (isDecimal ? value.toFixed(1) : Math.floor(value)) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // Stat progress bars
  const statFills = document.querySelectorAll('.stat-fill');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.width + '%';
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statFills.forEach(el => barObserver.observe(el));
})();

/* ===================================================
   6. 3D TILT EFFECT ON SERVICE CARDS
=================================================== */
(function initTilt() {
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotateX = -dy * 8;
      const rotateY = dx * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
      card.style.transition = 'transform 0.1s ease';

      // Move glow
      const glow = card.querySelector('.card-glow');
      if (glow) {
        const glowX = ((e.clientX - rect.left) / rect.width) * 100;
        const glowY = ((e.clientY - rect.top) / rect.height) * 100;
        glow.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(59,130,246,0.4) 0%, transparent 60%)`;
        glow.style.top = 0; glow.style.right = 0;
        glow.style.left = 0; glow.style.bottom = 0;
        glow.style.width = '100%'; glow.style.height = '100%';
        glow.style.borderRadius = 'inherit';
        glow.style.position = 'absolute';
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.6s cubic-bezier(0.4,0,0.2,1)';
    });
  });
})();

/* ===================================================
   7. TESTIMONIAL CAROUSEL
=================================================== */
(function initCarousel() {
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('carouselDots');
  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;
  let cardsVisible = 3;

  function getCardsVisible() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  function getMaxSlide() { return Math.max(0, cards.length - cardsVisible); }

  // Create dots
  function buildDots() {
    dotsContainer.innerHTML = '';
    cardsVisible = getCardsVisible();
    const count = getMaxSlide() + 1;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      dot.className = 'carousel-dot' + (i === current ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function getCardWidth() {
    if (!cards[0]) return 0;
    const style = getComputedStyle(track);
    const gap = parseInt(style.gap) || 24;
    const totalGap = gap * (cardsVisible - 1);
    return (track.parentElement.offsetWidth - totalGap) / cardsVisible + gap;
  }

  function goTo(index) {
    cardsVisible = getCardsVisible();
    const max = getMaxSlide();
    current = Math.max(0, Math.min(index, max));
    const offset = current * getCardWidth();
    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  window.addEventListener('resize', () => {
    cardsVisible = getCardsVisible();
    current = Math.min(current, getMaxSlide());
    buildDots();
    goTo(current);
  });

  buildDots();

  // Auto-play
  let autoPlay = setInterval(() => {
    if (current >= getMaxSlide()) goTo(0);
    else goTo(current + 1);
  }, 4500);

  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoPlay));
  track.parentElement.addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => {
      if (current >= getMaxSlide()) goTo(0);
      else goTo(current + 1);
    }, 4500);
  });

  // Touch swipe
  let startX = 0;
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goTo(current + 1) : goTo(current - 1);
  });
})();

/* ===================================================
   8. CONTACT FORM VALIDATION
=================================================== */
(function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  function setError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const err = document.getElementById(errorId);
    if (field) field.closest('.form-group').classList.add('error');
    if (err) err.textContent = message;
    return false;
  }

  function clearError(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const err = document.getElementById(errorId);
    if (field) field.closest('.form-group').classList.remove('error');
    if (err) err.textContent = '';
  }

  function validate() {
    let valid = true;
    clearError('name', 'nameError');
    clearError('business', 'businessError');
    clearError('phone', 'phoneError');
    clearError('email', 'emailError');
    clearError('service', 'serviceError');

    const name = document.getElementById('name').value.trim();
    const business = document.getElementById('business').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const service = document.getElementById('service').value;

    if (!name || name.length < 2) { setError('name', 'nameError', 'Please enter your full name.'); valid = false; }
    if (!business || business.length < 2) { setError('business', 'businessError', 'Please enter your business name.'); valid = false; }

    const phoneRegex = /^[+]?[0-9\s\-()]{8,15}$/;
    if (!phone) { setError('phone', 'phoneError', 'Phone number is required.'); valid = false; }
    else if (!phoneRegex.test(phone)) { setError('phone', 'phoneError', 'Please enter a valid phone number.'); valid = false; }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) { setError('email', 'emailError', 'Please enter a valid email address.'); valid = false; }
    }

    if (!service) { setError('service', 'serviceError', 'Please select a service.'); valid = false; }

    return valid;
  }

  // Live validation
  ['name', 'business', 'phone', 'email', 'service'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', validate);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const btnText = document.getElementById('btnText');
    const btnIcon = document.getElementById('btnIcon');
    const btnLoader = document.getElementById('btnLoader');
    const formSuccess = document.getElementById('formSuccess');
    const btn = form.querySelector('.btn-submit');

    // Loading state
    btnText.style.display = 'none';
    btnIcon.style.display = 'none';
    btnLoader.style.display = 'block';
    btn.disabled = true;

    // Simulate submission (replace with real endpoint)
    await new Promise(resolve => setTimeout(resolve, 1800));

    // Success state
    btnText.style.display = 'none';
    btnLoader.style.display = 'none';
    btnIcon.style.display = 'none';
    btn.style.display = 'none';
    formSuccess.style.display = 'flex';

    // Also open WhatsApp with info pre-filled
    const name = document.getElementById('name').value.trim();
    const biz = document.getElementById('business').value.trim();
    const svc = document.getElementById('service').value;
    const waMsg = `Hi! I'm ${name} from ${biz}. I'm interested in your ${svc} service. Please get in touch.`;
    const waUrl = `https://wa.me/918340424989?text=${encodeURIComponent(waMsg)}`;
    setTimeout(() => window.open(waUrl, '_blank'), 500);
  });
})();

/* ===================================================
   9. SCROLL TO TOP BUTTON
=================================================== */
(function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ===================================================
   10. HERO TEXT ANIMATION (Type-in effect)
=================================================== */
(function initHeroAnimation() {
  const badge = document.querySelector('.hero-badge');
  const title = document.querySelector('.hero-title');
  const sub = document.querySelector('.hero-sub');
  const btns = document.querySelector('.hero-btns');
  const metrics = document.querySelector('.hero-metrics');

  const els = [badge, title, sub, btns, metrics].filter(Boolean);
  els.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.4,0,0.2,1), transform 0.8s cubic-bezier(0.4,0,0.2,1)';
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 300 + i * 180);
  });
})();

/* ===================================================
   11. SMOOTH SCROLL FOR ANCHOR LINKS
=================================================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

/* ===================================================
   12. PARALLAX GLOW ORBS ON SCROLL
=================================================== */
(function initParallaxOrbs() {
  const orbs = document.querySelectorAll('.glow-orb');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = 0.05 + i * 0.02;
      orb.style.transform = `translateY(${sy * speed}px)`;
    });
  }, { passive: true });
})();

/* ===================================================
   13. DYNAMIC NAV ACTIVE STYLE (CSS injection)
=================================================== */
(function addActiveNavStyle() {
  const style = document.createElement('style');
  style.textContent = `.nav-link.active-link { color: var(--text-primary) !important; background: var(--clr-surface); }`;
  document.head.appendChild(style);
})();

console.log('%cNextGen Digital Agency — Built for Revenue 🚀', 'color:#3b82f6;font-family:monospace;font-size:14px;font-weight:bold;');
