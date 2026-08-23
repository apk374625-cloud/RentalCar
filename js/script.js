(() => {
  const phone = '+917860617625';
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-menu');

  const setMenu = (open) => {
    menu.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  menuToggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 20), { passive: true });

  const statistics = document.querySelector('.trust-strip');
  const statNumbers = document.querySelectorAll('.stat-number');
  let statisticsAnimated = false;
  const animateStatistics = () => {
    if (statisticsAnimated) return;
    statisticsAnimated = true;
    const duration = 1800;
    const startTime = performance.now();
    const easeOut = (progress) => 1 - ((1 - progress) ** 3);
    const update = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = easeOut(progress);
      statNumbers.forEach((number) => {
        const target = Number(number.dataset.target);
        number.textContent = `${Math.round(target * easedProgress).toLocaleString('en-IN')}${number.dataset.suffix || ''}`;
      });
      if (progress < 1) window.requestAnimationFrame(update);
    };
    window.requestAnimationFrame(update);
  };
  if (statistics && statNumbers.length && 'IntersectionObserver' in window) {
    const statisticsObserver = new IntersectionObserver((entries, observer) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        animateStatistics();
        observer.disconnect();
      }
    }, { threshold: 0.25 });
    statisticsObserver.observe(statistics);
  } else if (statNumbers.length) animateStatistics();

  const form = document.querySelector('#quote-form');
  const status = document.querySelector('#quote-status');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const required = ['name', 'phone', 'pickup', 'destination'];
    const missing = required.filter((name) => !String(data.get(name)).trim());
    if (missing.length) {
      status.textContent = 'Please add your pickup location and destination.';
      form.querySelector(`[name="${missing[0]}"]`).focus();
      return;
    }
    status.textContent = '';
    const message = ['Customer request', `Name: ${data.get('name')}`, `Phone: ${data.get('phone')}`, `Pickup: ${data.get('pickup')}`, `Destination: ${data.get('destination')}`, `Date: ${data.get('date') || 'To be confirmed'}`, `Vehicle: ${data.get('vehicle')}`, `Message: ${data.get('message') || 'None'}`].join('\n');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  });

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); currentObserver.unobserve(entry.target); } });
    }, { threshold: 0.12 });
    reveals.forEach((element) => observer.observe(element));
  } else reveals.forEach((element) => element.classList.add('visible'));

  document.querySelectorAll('img').forEach((image) => {
    image.addEventListener('error', () => { image.classList.add('broken'); });
    if (image.complete && image.naturalWidth === 0) image.classList.add('broken');
  });

  const reviews = document.querySelector('#reviews-track');
  let reviewIndex = 0;
  const moveReviews = (direction) => {
    const cards = reviews.querySelectorAll('.review-card');
    if (window.innerWidth > 760) return;
    reviewIndex = (reviewIndex + direction + cards.length) % cards.length;
    reviews.style.transform = `translateX(-${reviewIndex * 100}%)`;
  };
  document.querySelector('#review-prev').addEventListener('click', () => moveReviews(-1));
  document.querySelector('#review-next').addEventListener('click', () => moveReviews(1));

  const galleryItems = [...document.querySelectorAll('.gallery-item')];
  const lightbox = document.querySelector('#lightbox');
  const lightboxImage = document.querySelector('#lightbox-image');
  const lightboxTitle = document.querySelector('#lightbox-title');
  let galleryIndex = 0;
  const showGallery = (index) => {
    galleryIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[galleryIndex];
    const image = item.querySelector('img');
    lightboxImage.src = image.classList.contains('broken') ? '' : item.dataset.src;
    lightboxImage.alt = image.alt;
    lightboxTitle.textContent = item.dataset.title;
  };
  const closeGallery = () => { lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
  galleryItems.forEach((item, index) => item.addEventListener('click', () => { showGallery(index); lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }));
  document.querySelector('#lightbox-close').addEventListener('click', closeGallery);
  document.querySelector('#lightbox-prev').addEventListener('click', () => showGallery(galleryIndex - 1));
  document.querySelector('#lightbox-next').addEventListener('click', () => showGallery(galleryIndex + 1));
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeGallery(); });
  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('open')) return;
    if (event.key === 'Escape') closeGallery();
    if (event.key === 'ArrowLeft') showGallery(galleryIndex - 1);
    if (event.key === 'ArrowRight') showGallery(galleryIndex + 1);
  });

  document.querySelector('#year').textContent = new Date().getFullYear();
})();