(() => {
  'use strict';

  /*
   * M.S. TOUR & TRAVELS
   * Main website JavaScript
   *
   * Features:
   * - Mobile navigation
   * - Header scroll effect
   * - Animated statistics
   * - Quote form -> WhatsApp
   * - Mobile review carousel
   * - Review swipe support
   * - Gallery/lightbox
   * - FAQ accessibility
   * - WhatsApp floating button
   * - Mobile CTA support
   * - Image error handling
   * - Reduced-motion support
   * - Safe element checks to prevent JS crashes
   */

  // ============================================================
  // CONFIGURATION
  // ============================================================

  const PHONE = '+917860617625';
  const WHATSAPP_NUMBER = '917860617625';

  const GOOGLE_MAPS_URL =
    'https://www.google.com/maps/place/M.S+Tour+%26+Travels+-+Car+Rental+Chandigarh/@30.7616173,76.7658303,18z/data=!4m16!1m9!3m8!1s0x390fedd75046cb1b:0x2bdab2a7b899237b!2sM.S+Tour+%26+Travels+-+Car+Rental+Chandigarh!8m2!3d30.7616374!4d76.7658357!9m1!1b1!16s%2Fg%2F11zgvt0nf8!3m5!1s0x390fedd75046cb1b:0x2bdab2a7b899237b!8m2!3d30.7616374!4d76.7658357!16s%2Fg%2F11zgvt0nf8';

  const DEFAULT_WHATSAPP_MESSAGE =
    'Hello M.S. Tour & Travels, I would like to enquire about your car rental services.';

  // ============================================================
  // HELPERS
  // ============================================================

  const $ = (selector, scope = document) =>
    scope.querySelector(selector);

  const $$ = (selector, scope = document) =>
    Array.from(scope.querySelectorAll(selector));

  const prefersReducedMotion =
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  const isMobile = () => window.innerWidth <= 760;

  // ============================================================
  // MOBILE NAVIGATION
  // ============================================================

  const header = $('.site-header');
  const menuToggle = $('.menu-toggle');
  const menu = $('.nav-menu');

  const setMenu = (open) => {
    if (!menu || !menuToggle) return;

    menu.classList.toggle('open', open);

    menuToggle.setAttribute(
      'aria-expanded',
      String(open)
    );

    menuToggle.setAttribute(
      'aria-label',
      open ? 'Close menu' : 'Open menu'
    );

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

      if (
        menu.contains(event.target) ||
        menuToggle.contains(event.target)
      ) {
        return;
      }

      setMenu(false);
    });

    window.addEventListener('resize', () => {
      if (!isMobile()) {
        setMenu(false);
      }
    });
  }

  // ============================================================
  // HEADER SCROLL EFFECT
  // ============================================================

  if (header) {
    const updateHeader = () => {
      header.classList.toggle(
        'scrolled',
        window.scrollY > 20
      );
    };

    updateHeader();

    window.addEventListener(
      'scroll',
      updateHeader,
      { passive: true }
    );
  }

  // ============================================================
  // HERO VIDEO FALLBACK
  // ============================================================

  const heroVideo = $('.hero-video');

  if (heroVideo) {
    heroVideo.addEventListener('error', () => {
      heroVideo.classList.add('video-unavailable');
    });

    if (heroVideo.readyState === 0) {
      try {
        heroVideo.load();
      } catch (error) {
        console.warn('Hero video could not be loaded.');
      }
    }
  }

  // ============================================================
  // STATISTICS / COUNTERS
  // ============================================================

  const statistics = $('.trust-strip');
  const statNumbers = $$('.stat-number');

  let statisticsAnimated = false;

  const setStatisticsFinal = () => {
    statNumbers.forEach((number) => {
      const target = Number(
        number.dataset.target || 0
      );

      const suffix =
        number.dataset.suffix || '';

      number.textContent =
        `${target.toLocaleString('en-IN')}${suffix}`;
    });
  };

  const animateStatistics = () => {
    if (
      statisticsAnimated ||
      !statNumbers.length
    ) {
      return;
    }

    statisticsAnimated = true;

    if (prefersReducedMotion) {
      setStatisticsFinal();
      return;
    }

    const duration = 1800;
    const startTime = performance.now();

    const easeOut = (progress) =>
      1 - ((1 - progress) ** 3);

    const update = (now) => {
      const progress = Math.min(
        (now - startTime) / duration,
        1
      );

      const easedProgress =
        easeOut(progress);

      statNumbers.forEach((number) => {
        const target = Number(
          number.dataset.target || 0
        );

        const suffix =
          number.dataset.suffix || '';

        number.textContent =
          `${Math.round(
            target * easedProgress
          ).toLocaleString('en-IN')}${suffix}`;
      });

      if (progress < 1) {
        window.requestAnimationFrame(update);
      }
    };

    window.requestAnimationFrame(update);
  };

  if (
    statistics &&
    statNumbers.length &&
    'IntersectionObserver' in window
  ) {
    const statisticsObserver =
      new IntersectionObserver(
        (entries, observer) => {
          if (
            entries.some(
              (entry) => entry.isIntersecting
            )
          ) {
            animateStatistics();
            observer.disconnect();
          }
        },
        {
          threshold: 0.25
        }
      );

    statisticsObserver.observe(statistics);
  } else if (statNumbers.length) {
    animateStatistics();
  }

  // ============================================================
  // QUOTE FORM -> WHATSAPP
  // ============================================================

  const form = $('#quote-form');
  const status = $('#quote-status');

  const getValue = (
    formData,
    name,
    fallback = ''
  ) => {
    const value = formData.get(name);

    if (
      value === null ||
      String(value).trim() === ''
    ) {
      return fallback;
    }

    return String(value).trim();
  };

  if (form) {
    form.addEventListener(
      'submit',
      (event) => {
        event.preventDefault();

        const data = new FormData(form);

        const requiredFields = [
          [
            'name',
            'Please enter your name.'
          ],
          [
            'phone',
            'Please enter your phone number.'
          ],
          [
            'pickup',
            'Please enter your pickup location.'
          ],
          [
            'destination',
            'Please enter your destination.'
          ]
        ];

        const missing =
          requiredFields.find(
            ([name]) =>
              !getValue(data, name)
          );

        if (missing) {
          if (status) {
            status.textContent =
              missing[1];
          }

          form
            .querySelector(
              `[name="${missing[0]}"]`
            )
            ?.focus();

          return;
        }

        const phone =
          getValue(data, 'phone');

        const phoneDigits =
          phone.replace(/\D/g, '');

        if (phoneDigits.length < 10) {
          if (status) {
            status.textContent =
              'Please enter a valid phone number.';
          }

          form
            .querySelector('[name="phone"]')
            ?.focus();

          return;
        }

        if (status) {
          status.textContent = '';
        }

        const message = [
          '🚗 NEW CAR RENTAL ENQUIRY',
          '',
          `Name: ${getValue(data, 'name')}`,
          `Phone: ${phone}`,
          '',
          `Pickup: ${getValue(
            data,
            'pickup'
          )}`,
          `Destination: ${getValue(
            data,
            'destination'
          )}`,
          '',
          `Travel Date: ${getValue(
            data,
            'date',
            'To be confirmed'
          )}`,
          `Travel Time: ${getValue(
            data,
            'time',
            'To be confirmed'
          )}`,
          `Trip Type: ${getValue(
            data,
            'trip',
            'To be confirmed'
          )}`,
          `Passengers: ${getValue(
            data,
            'passengers',
            'To be confirmed'
          )}`,
          `Vehicle: ${getValue(
            data,
            'vehicle',
            'Any suitable vehicle'
          )}`,
          '',
          `Message: ${getValue(
            data,
            'message',
            'None'
          )}`
        ].join('\n');

        const whatsappURL =
          `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
            message
          )}`;

        const popup =
          window.open(
            whatsappURL,
            '_blank',
            'noopener,noreferrer'
          );

        if (!popup) {
          window.location.href =
            whatsappURL;
        }
      }
    );
  }

  // ============================================================
  // REVEAL ANIMATIONS
  // ============================================================

  const reveals = $$('.reveal');

  if (prefersReducedMotion) {
    reveals.forEach((element) => {
      element.classList.add('visible');
    });
  } else if (
    'IntersectionObserver' in window &&
    reveals.length
  ) {
    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add(
              'visible'
            );

            observer.unobserve(
              entry.target
            );
          });
        },
        {
          threshold: 0.12
        }
      );

    reveals.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    reveals.forEach((element) => {
      element.classList.add('visible');
    });
  }

  // ============================================================
  // IMAGE ERROR HANDLING
  // ============================================================

  $$('img').forEach((image) => {
    const markBroken = () => {
      image.classList.add('broken');
    };

    image.addEventListener(
      'error',
      markBroken
    );

    if (
      image.complete &&
      image.naturalWidth === 0
    ) {
      markBroken();
    }
  });

  // ============================================================
  // GOOGLE REVIEWS CAROUSEL
  // ============================================================

  const reviewsTrack =
    $('#reviews-track');

  const reviewPrev =
    $('#review-prev');

  const reviewNext =
    $('#review-next');

  let reviewIndex = 0;

  let reviewTouchStartX = null;
  let reviewTouchStartY = null;

  const reviewCards = () => {
    if (!reviewsTrack) return [];

    return $$('.review-card', reviewsTrack);
  };

  const updateReviews = (
    index = reviewIndex
  ) => {
    if (!reviewsTrack) return;

    const cards = reviewCards();

    if (
      !cards.length ||
      !isMobile()
    ) {
      reviewsTrack.style.transform = '';
      reviewIndex = 0;
      return;
    }

    reviewIndex =
      (index + cards.length) %
      cards.length;

    reviewsTrack.style.transform =
      `translate3d(-${reviewIndex * 100}%, 0, 0)`;
  };

  const moveReviews = (
    direction
  ) => {
    if (
      !reviewsTrack ||
      !isMobile()
    ) {
      return;
    }

    const cards = reviewCards();

    if (cards.length < 2) {
      return;
    }

    updateReviews(
      reviewIndex + direction
    );
  };

  reviewPrev?.addEventListener(
    'click',
    () => moveReviews(-1)
  );

  reviewNext?.addEventListener(
    'click',
    () => moveReviews(1)
  );

  // Swipe reviews on mobile

  reviewsTrack?.addEventListener(
    'touchstart',
    (event) => {
      const touch =
        event.changedTouches[0];

      reviewTouchStartX =
        touch.clientX;

      reviewTouchStartY =
        touch.clientY;
    },
    {
      passive: true
    }
  );

  reviewsTrack?.addEventListener(
    'touchend',
    (event) => {
      if (
        reviewTouchStartX === null ||
        reviewTouchStartY === null
      ) {
        return;
      }

      const touch =
        event.changedTouches[0];

      const deltaX =
        touch.clientX -
        reviewTouchStartX;

      const deltaY =
        touch.clientY -
        reviewTouchStartY;

      reviewTouchStartX = null;
      reviewTouchStartY = null;

      if (
        Math.abs(deltaX) < 45 ||
        Math.abs(deltaX) <
          Math.abs(deltaY)
      ) {
        return;
      }

      moveReviews(
        deltaX < 0 ? 1 : -1
      );
    },
    {
      passive: true
    }
  );

  window.addEventListener(
    'resize',
    () => updateReviews(reviewIndex)
  );

  // ============================================================
  // GALLERY / LIGHTBOX
  // ============================================================

  const galleryItems =
    $$('.gallery-item');

  const lightbox =
    $('#lightbox');

  const lightboxImage =
    $('#lightbox-image');

  const lightboxTitle =
    $('#lightbox-title');

  const lightboxClose =
    $('#lightbox-close');

  const lightboxPrev =
    $('#lightbox-prev');

  const lightboxNext =
    $('#lightbox-next');

  let galleryIndex = 0;
  let previousFocusedElement = null;

  const showGallery = (
    index
  ) => {
    if (
      !galleryItems.length ||
      !lightboxImage ||
      !lightboxTitle
    ) {
      return;
    }

    galleryIndex =
      (index + galleryItems.length) %
      galleryItems.length;

    const item =
      galleryItems[galleryIndex];

    const image =
      $('img', item);

    if (!image) return;

    const imageSource =
      item.dataset.src ||
      image.currentSrc ||
      image.src;

    lightboxImage.src =
      image.classList.contains('broken')
        ? ''
        : imageSource;

    lightboxImage.alt =
      image.alt || '';

    lightboxTitle.textContent =
      item.dataset.title || '';
  };

  const openGallery = (
    index
  ) => {
    if (!lightbox) return;

    previousFocusedElement =
      document.activeElement;

    showGallery(index);

    lightbox.classList.add(
      'open'
    );

    lightbox.setAttribute(
      'aria-hidden',
      'false'
    );

    document.body.style.overflow =
      'hidden';

    lightboxClose?.focus();
  };

  const closeGallery = () => {
    if (!lightbox) return;

    lightbox.classList.remove(
      'open'
    );

    lightbox.setAttribute(
      'aria-hidden',
      'true'
    );

    document.body.style.overflow =
      '';

    previousFocusedElement?.focus?.();

    previousFocusedElement = null;
  };

  galleryItems.forEach(
    (item, index) => {
      item.addEventListener(
        'click',
        () => openGallery(index)
      );
    }
  );

  lightboxClose?.addEventListener(
    'click',
    closeGallery
  );

  lightboxPrev?.addEventListener(
    'click',
    () =>
      showGallery(
        galleryIndex - 1
      )
  );

  lightboxNext?.addEventListener(
    'click',
    () =>
      showGallery(
        galleryIndex + 1
      )
  );

  lightbox?.addEventListener(
    'click',
    (event) => {
      if (
        event.target === lightbox
      ) {
        closeGallery();
      }
    }
  );

  document.addEventListener(
    'keydown',
    (event) => {
      if (
        !lightbox?.classList.contains(
          'open'
        )
      ) {
        return;
      }

      if (
        event.key === 'Escape'
      ) {
        closeGallery();
      }

      if (
        event.key === 'ArrowLeft'
      ) {
        showGallery(
          galleryIndex - 1
        );
      }

      if (
        event.key === 'ArrowRight'
      ) {
        showGallery(
          galleryIndex + 1
        );
      }
    }
  );

  // ============================================================
  // FAQ
  // ============================================================

  const faqDetails =
    $$('.faq-list details');

  faqDetails.forEach((detail) => {
    const summary =
      $('summary', detail);

    if (!summary) return;

    summary.setAttribute(
      'role',
      'button'
    );

    summary.setAttribute(
      'aria-expanded',
      String(detail.open)
    );

    detail.addEventListener(
      'toggle',
      () => {
        summary.setAttribute(
          'aria-expanded',
          String(detail.open)
        );
      }
    );
  });

  // ============================================================
  // GOOGLE MAP / DIRECTIONS LINKS
  // ============================================================

  const mapLinks = $$(
    'a[data-google-maps], .get-directions, .map-directions'
  );

  mapLinks.forEach((link) => {
    link.href = GOOGLE_MAPS_URL;
    link.target = '_blank';
    link.rel =
      'noopener noreferrer';
  });

  // ============================================================
  // WHATSAPP LINKS
  // ============================================================

  $$(
    'a[href^="https://wa.me/"]'
  ).forEach((link) => {
    const hasCustomMessage =
      link.href.includes('text=');

    if (!hasCustomMessage) {
      link.href =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
          DEFAULT_WHATSAPP_MESSAGE
        )}`;
    }

    link.target = '_blank';

    link.rel =
      'noopener noreferrer';
  });

  // ============================================================
  // PHONE LINKS
  // ============================================================

  $$(
    'a[href^="tel:"]'
  ).forEach((link) => {
    link.href =
      `tel:${PHONE}`;
  });

  // ============================================================
  // MOBILE CTA BAR
  // ============================================================

  const mobileCTA =
    $('.mobile-cta');

  if (mobileCTA) {
    const callButton =
      $('[data-action="call"]', mobileCTA);

    const whatsappButton =
      $('[data-action="whatsapp"]', mobileCTA);

    const quoteButton =
      $('[data-action="quote"]', mobileCTA);

    callButton?.addEventListener(
      'click',
      () => {
        window.location.href =
          `tel:${PHONE}`;
      }
    );

    whatsappButton?.addEventListener(
      'click',
      () => {
        const url =
          `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
            DEFAULT_WHATSAPP_MESSAGE
          )}`;

        window.open(
          url,
          '_blank',
          'noopener,noreferrer'
        );
      }
    );

    quoteButton?.addEventListener(
      'click',
      () => {
        const quoteSection =
          $('#quote') ||
          $('#quote-form') ||
          $('.quote-section');

        if (quoteSection) {
          quoteSection.scrollIntoView({
            behavior: prefersReducedMotion
              ? 'auto'
              : 'smooth',
            block: 'start'
          });

          window.setTimeout(
            () => {
              $('#name')?.focus();
            },
            500
          );
        }
      }
    );
  }

  // ============================================================
  // GENERIC "GET QUOTE" BUTTONS
  // ============================================================

  $$(
    '[data-scroll-to-quote], .get-quote-button'
  ).forEach((button) => {
    button.addEventListener(
      'click',
      () => {
        const target =
          document.querySelector(
            '#quote'
          ) ||
          document.querySelector(
            '#quote-form'
          ) ||
          document.querySelector(
            '.quote-section'
          );

        if (!target) return;

        target.scrollIntoView({
          behavior:
            prefersReducedMotion
              ? 'auto'
              : 'smooth',
          block: 'start'
        });
      }
    );
  });

  // ============================================================
  // RATE LIST MOBILE SUPPORT
  // ============================================================

  /*
   * The CSS converts the pricing table into cards on mobile.
   * This JS only adds a useful accessibility label to pricing
   * buttons and does not alter the actual prices.
   */

  $$('.pricing-section button, .pricing-section a').forEach(
    (element) => {
      const text =
        element.textContent.trim();

      if (
        text.toLowerCase().includes(
          'quote'
        )
      ) {
        element.setAttribute(
          'aria-label',
          'Get a quote'
        );
      }
    }
  );

  // ============================================================
  // SMOOTH INTERNAL LINKS
  // ============================================================

  $$('a[href^="#"]').forEach(
    (link) => {
      const href =
        link.getAttribute('href');

      if (
        !href ||
        href === '#'
      ) {
        return;
      }

      const target =
        document.querySelector(href);

      if (!target) return;

      link.addEventListener(
        'click',
        (event) => {
          event.preventDefault();

          setMenu(false);

          target.scrollIntoView({
            behavior:
              prefersReducedMotion
                ? 'auto'
                : 'smooth',
            block: 'start'
          });

          if (
            window.history &&
            window.history.replaceState
          ) {
            window.history.replaceState(
              null,
              '',
              href
            );
          }
        }
      );
    }
  );

  // ============================================================
  // PREVENT ACCIDENTAL DRAGGING OF BUTTON ICONS
  // ============================================================

  $$(
    '.float-button svg, .mobile-cta svg, button svg'
  ).forEach((svg) => {
    svg.setAttribute(
      'aria-hidden',
      'true'
    );

    svg.setAttribute(
      'focusable',
      'false'
    );
  });

  // ============================================================
  // FOOTER YEAR
  // ============================================================

  const year =
    $('#year');

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }

  // ============================================================
  // INITIAL REVIEW STATE
  // ============================================================

  if (reviewsTrack) {
    updateReviews(0);
  }

  // ============================================================
  // FINAL SAFETY CHECK
  // ============================================================

  /*
   * Keep the page from getting stuck with the mobile menu open
   * when the browser is resized back to desktop.
   */

  window.addEventListener(
    'resize',
    () => {
      if (!isMobile()) {
        document.body.classList.remove(
          'menu-open'
        );
      }
    }
  );

})();