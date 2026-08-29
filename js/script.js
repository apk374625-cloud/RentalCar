(() => {
  'use strict';

  /*
   * M.S. TOUR & TRAVELS
   * Main website JavaScript
   */

  // CONFIGURATION
  const PHONE = '+917860617625';
  const WHATSAPP_NUMBER = '917860617625';

  // HELPERS
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const isMobile = () => window.innerWidth <= 760;

  // MOBILE NAVIGATION
  const header = $('.site-header');
  const menuToggle = $('.menu-toggle');
  const menu = $('.nav-menu');

  const setMenu = (open) => {
    if (!menu || !menuToggle) return;
    menu.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
  };

  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menu.classList.contains('open');
      setMenu(!isOpen);
    });

    $$('a', menu).forEach((link) => {
      link.addEventListener('click', () => {
        setMenu(false);
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setMenu(false);
      }
    });

    document.addEventListener('click', (event) => {
      if (!menu.classList.contains('open')) return;
      if (menu.contains(event.target) || menuToggle.contains(event.target)) return;
      setMenu(false);
    });
  }

  // HEADER SCROLL EFFECT
  const handleScroll = () => {
    if (!header) return;
    const scrolled = window.scrollY > 20;
    header.classList.toggle('scrolled', scrolled);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // STATISTICS COUNTERS
  const statistics = $('.trust-strip');
  const statNumbers = $$('.stat-number');
  let statisticsAnimated = false;

  const setStatisticsFinal = () => {
    statNumbers.forEach((number) => {
      const target = Number(number.dataset.target || 0);
      const suffix = number.dataset.suffix || '';
      number.textContent = `${target.toLocaleString('en-IN')}${suffix}`;
    });
  };

  const animateStatistics = () => {
    if (statisticsAnimated || !statNumbers.length) return;
    statisticsAnimated = true;

    if (prefersReducedMotion) {
      setStatisticsFinal();
      return;
    }

    const duration = 1800;
    const startTime = performance.now();
    const easeOut = (progress) => 1 - ((1 - progress) ** 3);

    const update = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = easeOut(progress);

      statNumbers.forEach((number) => {
        const target = Number(number.dataset.target || 0);
        const suffix = number.dataset.suffix || '';
        number.textContent = `${Math.round(target * easedProgress).toLocaleString('en-IN')}${suffix}`;
      });

      if (progress < 1) {
        window.requestAnimationFrame(update);
      }
    };

    window.requestAnimationFrame(update);
  };

  if (statistics && statNumbers.length && 'IntersectionObserver' in window) {
    const statisticsObserver = new IntersectionObserver(
      (entries, observer) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          animateStatistics();
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    statisticsObserver.observe(statistics);
  } else if (statNumbers.length) {
    animateStatistics();
  }

  // QUOTE FORM -> WHATSAPP
  const form = $('#quote-form');
  const status = $('#quote-status');
  const travelDateInput = $('#travel-date') || (form ? $('[name="date"]', form) : null);
  const returnDateInput = $('#return-date') || (form ? $('[name="return_date"]', form) : null);
  const returnDateWrap = $('#return-date-wrap') || (form ? $('.return-date-group', form) : null) || returnDateInput?.parentElement;
  const tripTypeSelect = $('#trip-type') || (form ? $('[name="trip"]', form) : null);

  // Set min date to today
  if (travelDateInput) {
    const today = new Date().toISOString().split('T')[0];
    travelDateInput.min = today;
    if (returnDateInput) returnDateInput.min = today;

    travelDateInput.addEventListener('change', () => {
      if (returnDateInput) {
        returnDateInput.min = travelDateInput.value || today;
        if (returnDateInput.value && returnDateInput.value < travelDateInput.value) {
          returnDateInput.value = travelDateInput.value;
        }
      }
    });
  }

  // Toggle return date based on trip type
  if (tripTypeSelect && returnDateWrap) {
    const updateReturnVisibility = () => {
      const val = tripTypeSelect.value;
      if (val === 'Round trip' || val === 'Wedding / event') {
        returnDateWrap.style.display = 'block';
      } else {
        returnDateWrap.style.display = 'none';
        if (returnDateInput) returnDateInput.value = '';
      }
    };
    tripTypeSelect.addEventListener('change', updateReturnVisibility);
    updateReturnVisibility();
  }

  const getValue = (formData, name, fallback = '') => {
    const value = formData.get(name);
    if (value === null || String(value).trim() === '') return fallback;
    return String(value).trim();
  };

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);

      const requiredFields = [
        ['name', 'Please enter your name.'],
        ['phone', 'Please enter your phone number.'],
        ['pickup', 'Please enter your pickup location.'],
        ['destination', 'Please enter your destination.']
      ];

      const missing = requiredFields.find(([name]) => !getValue(data, name));
      if (missing) {
        if (status) status.textContent = missing[1];
        form.querySelector(`[name="${missing[0]}"]`)?.focus();
        return;
      }

      const phone = getValue(data, 'phone');
      const phoneDigits = phone.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        if (status) status.textContent = 'Please enter a valid phone number.';
        form.querySelector('[name="phone"]')?.focus();
        return;
      }

      if (status) status.textContent = '';

      const returnDateVal = getValue(data, 'return_date');
      const messageLines = [
        '🚗 NEW CAR RENTAL ENQUIRY',
        '',
        `Name: ${getValue(data, 'name')}`,
        `Phone: ${phone}`,
        '',
        `Pickup: ${getValue(data, 'pickup')}`,
        `Destination: ${getValue(data, 'destination')}`,
        `Trip Type: ${getValue(data, 'trip', 'To be confirmed')}`,
        '',
        `Travel Date: ${getValue(data, 'date', 'To be confirmed')}`
      ];

      if (returnDateVal) {
        messageLines.push(`Return Date: ${returnDateVal}`);
      }

      messageLines.push(
        `Travel Time: ${getValue(data, 'time', 'To be confirmed')}`,
        `Passengers: ${getValue(data, 'passengers', 'To be confirmed')}`,
        `Vehicle: ${getValue(data, 'vehicle', 'Any suitable vehicle')}`,
        '',
        `Message / Notes: ${getValue(data, 'message', 'None')}`
      );

      const message = messageLines.join('\n');
      const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      const popup = window.open(whatsappURL, '_blank', 'noopener,noreferrer');
      if (!popup) {
        window.location.href = whatsappURL;
      }
    });
  }

  // REVEAL ANIMATIONS
  const reveals = $$('.reveal');
  if (prefersReducedMotion) {
    reveals.forEach((element) => element.classList.add('visible'));
  } else if ('IntersectionObserver' in window && reveals.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );
    reveals.forEach((element) => revealObserver.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add('visible'));
  }

  // REVIEWS SLIDER
  const reviewsTrack = $('#reviews-track');
  const reviewCards = $$('.review-card', reviewsTrack || document);
  const prevButton = $('#review-prev');
  const nextButton = $('#review-next');
  let currentReviewIndex = 0;

  const updateReviews = () => {
    if (!reviewsTrack || !reviewCards.length) return;
    if (!isMobile()) {
      reviewsTrack.style.transform = '';
      return;
    }
    const safeIndex = Math.max(0, Math.min(currentReviewIndex, reviewCards.length - 1));
    reviewsTrack.style.transform = `translateX(-${safeIndex * 100}%)`;
  };

  if (prevButton && nextButton && reviewCards.length) {
    prevButton.addEventListener('click', () => {
      currentReviewIndex = (currentReviewIndex - 1 + reviewCards.length) % reviewCards.length;
      updateReviews();
    });

    nextButton.addEventListener('click', () => {
      currentReviewIndex = (currentReviewIndex + 1) % reviewCards.length;
      updateReviews();
    });

    window.addEventListener('resize', updateReviews, { passive: true });
    updateReviews();
  }

  // LIGHTBOX
  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightbox-image');
  const lightboxTitle = $('#lightbox-title');
  const lightboxClose = $('#lightbox-close');
  const lightboxPrev = $('#lightbox-prev');
  const lightboxNext = $('#lightbox-next');
  const galleryItems = $$('.gallery-item');
  let currentGalleryIndex = 0;

  const openLightbox = (index) => {
    if (!lightbox || !lightboxImage || !galleryItems[index]) return;
    currentGalleryIndex = index;
    const item = galleryItems[index];
    const src = item.dataset.src || item.querySelector('img')?.src;
    const title = item.dataset.title || item.querySelector('img')?.alt || '';

    lightboxImage.src = src;
    lightboxImage.alt = title;
    if (lightboxTitle) lightboxTitle.textContent = title;

    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (lightbox && galleryItems.length) {
    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
    });

    lightboxClose?.addEventListener('click', closeLightbox);
    lightboxPrev?.addEventListener('click', () => {
      openLightbox((currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length);
    });
    lightboxNext?.addEventListener('click', () => {
      openLightbox((currentGalleryIndex + 1) % galleryItems.length);
    });

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (event) => {
      if (!lightbox.classList.contains('open')) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') lightboxPrev?.click();
      if (event.key === 'ArrowRight') lightboxNext?.click();
    });
  }

  // COPYRIGHT YEAR
  const yearElement = $('#year');
  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }
})();