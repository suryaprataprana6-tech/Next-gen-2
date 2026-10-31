/**
 * NEXTGEN DIGITAL SOLUTIONS — OFFICIAL SCRIPTS
 * High-Performance, GPU-friendly, Zero Heavy 3D Loops
 * Modern Digital Solutions & Business Growth Agency
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ===================================================
     1. NAVBAR SCROLL & MOBILE NAVIGATION
  =================================================== */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  // Sticky navbar on scroll
  const handleNavScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // Mobile menu toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active navigation link highlighting on scroll
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-links a.nav-link');

  const highlightNavOnScroll = () => {
    const scrollPos = window.scrollY + 180;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        desktopNavLinks.forEach(link => {
          link.classList.remove('active-link');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active-link');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  /* ===================================================
     2. HERO COMMAND CENTER TABS (Pure CSS / Lightweight JS)
  =================================================== */
  const tabButtons = document.querySelectorAll('.preview-tab');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(`pane-${targetTab}`);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  /* ===================================================
     3. SERVICE CARD ACTION (Pre-selects in Contact Form)
  =================================================== */
  const serviceActionLinks = document.querySelectorAll('[data-service]');
  const serviceSelect = document.getElementById('service');

  serviceActionLinks.forEach(link => {
    link.addEventListener('click', () => {
      const serviceVal = link.getAttribute('data-service');
      if (serviceSelect && serviceVal) {
        serviceSelect.value = serviceVal;
        // Clear error if any
        serviceSelect.closest('.form-group')?.classList.remove('error');
        const err = document.getElementById('serviceError');
        if (err) err.textContent = '';
      }
    });
  });

  /* ===================================================
     4. INTERSECTION OBSERVER — REVEAL ANIMATIONS
  =================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('visible'));
  }

  /* ===================================================
     5. FAQ ACCORDION
  =================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other accordions
        faqItems.forEach(other => {
          if (other !== item) other.classList.remove('active');
        });

        item.classList.toggle('active', !isActive);
      });
    }
  });

  /* ===================================================
     6. CONTACT FORM VALIDATION & WHATSAPP INTEGRATION
  =================================================== */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    const nameInput = document.getElementById('name');
    const bizInput = document.getElementById('business');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const serviceInput = document.getElementById('service');
    const messageInput = document.getElementById('message');

    const btnText = document.getElementById('btnText');
    const btnIcon = document.getElementById('btnIcon');
    const btnLoader = document.getElementById('btnLoader');
    const formSuccess = document.getElementById('formSuccess');
    const waDirectLink = document.getElementById('waDirectLink');
    const submitBtn = contactForm.querySelector('.btn-submit');

    function setError(inputEl, errorId, message) {
      const parent = inputEl.closest('.form-group');
      if (parent) parent.classList.add('error');
      const err = document.getElementById(errorId);
      if (err) err.textContent = message;
      return false;
    }

    function clearError(inputEl, errorId) {
      const parent = inputEl.closest('.form-group');
      if (parent) parent.classList.remove('error');
      const err = document.getElementById(errorId);
      if (err) err.textContent = '';
    }

    // Live validation on blur & input
    if (nameInput) {
      nameInput.addEventListener('input', () => {
        if (nameInput.value.trim().length >= 2) clearError(nameInput, 'nameError');
      });
    }
    if (bizInput) {
      bizInput.addEventListener('input', () => {
        if (bizInput.value.trim().length >= 2) clearError(bizInput, 'businessError');
      });
    }
    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
        const clean = phoneInput.value.replace(/[^0-9+\s\-()]/g, '');
        if (clean.length >= 8) clearError(phoneInput, 'phoneError');
      });
    }
    if (emailInput) {
      emailInput.addEventListener('input', () => {
        clearError(emailInput, 'emailError');
      });
    }
    if (serviceInput) {
      serviceInput.addEventListener('change', () => {
        if (serviceInput.value) clearError(serviceInput, 'serviceError');
      });
    }

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        setError(nameInput, 'nameError', 'Please enter your full name.');
        isValid = false;
      } else {
        clearError(nameInput, 'nameError');
      }

      // Validate Business
      if (!bizInput.value.trim() || bizInput.value.trim().length < 2) {
        setError(bizInput, 'businessError', 'Please provide your business or brand name.');
        isValid = false;
      } else {
        clearError(bizInput, 'businessError');
      }

      // Validate Phone
      const phoneVal = phoneInput.value.trim();
      const phoneRegex = /^[+]?[0-9\s\-()]{8,18}$/;
      if (!phoneVal) {
        setError(phoneInput, 'phoneError', 'Phone number is required for consultation confirmation.');
        isValid = false;
      } else if (!phoneRegex.test(phoneVal)) {
        setError(phoneInput, 'phoneError', 'Please enter a valid phone or WhatsApp number.');
        isValid = false;
      } else {
        clearError(phoneInput, 'phoneError');
      }

      // Validate Email (optional, but validate format if filled)
      const emailVal = emailInput.value.trim();
      if (emailVal) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailVal)) {
          setError(emailInput, 'emailError', 'Please enter a valid email address.');
          isValid = false;
        } else {
          clearError(emailInput, 'emailError');
        }
      }

      // Validate Service
      if (!serviceInput.value) {
        setError(serviceInput, 'serviceError', 'Please choose the primary service or objective.');
        isValid = false;
      } else {
        clearError(serviceInput, 'serviceError');
      }

      if (!isValid) return;

      // Submission UI State
      btnText.style.display = 'none';
      btnIcon.style.display = 'none';
      btnLoader.style.display = 'block';
      submitBtn.disabled = true;

      // Build structured, professional WhatsApp message
      const serviceName = serviceInput.options[serviceInput.selectedIndex]?.text || serviceInput.value;
      const messageText = messageInput.value.trim() || 'Ready to discuss scope and timelines.';

      const waMessage = 
`*CONSULTATION REQUEST — NextGen Digital Solutions*
---------------------------------------
👤 *Name:* ${nameInput.value.trim()}
🏢 *Business:* ${bizInput.value.trim()}
📞 *Phone:* ${phoneVal}
📧 *Email:* ${emailVal || 'Not provided'}
🎯 *Service:* ${serviceName}
💬 *Requirement:* ${messageText}
---------------------------------------
Sent via NextGen Digital Solutions Website`;

      // Simulating brief processing
      await new Promise(resolve => setTimeout(resolve, 800));

      // Show truthful success state
      btnLoader.style.display = 'none';
      submitBtn.style.display = 'none';
      if (formSuccess) {
        formSuccess.style.display = 'flex';
      }

      // Prepare direct URL and fallback link
      const waUrl = `https://wa.me/918340424989?text=${encodeURIComponent(waMessage)}`;
      if (waDirectLink) {
        waDirectLink.href = waUrl;
      }

      // Attempt to open WhatsApp directly
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 400);
    });
  }

  /* ===================================================
     7. SCROLL TO TOP BUTTON
  =================================================== */
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ===================================================
     8. SMOOTH SCROLLING FOR ALL INTERNAL LINKS
  =================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  console.log('%cNextGen Digital Solutions — High-Performing Websites, Ads & Digital Growth', 'color:#38bdf8;font-weight:bold;font-size:12px;');
});
