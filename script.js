/* ============================================================
   HAMBURGER / SANDWICH NAVIGATION
   — Toggles .nav-open on <header> when the button is clicked
   — Closes the menu automatically when any nav link is tapped
   ============================================================ */

(function () {

  const header   = document.querySelector('.site-header');
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.querySelectorAll('.main-nav .nav-link');

  if (!toggle) return;  /* safety guard — no hamburger on this page */

  /* Open / close on button click */
  toggle.addEventListener('click', function () {
    const isOpen = header.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* Close when any nav link is tapped (good UX on mobile) */
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      header.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

})();


/* ============================================================
   CAROUSEL
   — Shows 3 cards (desktop), 2 (tablet ≤900px), 1 (mobile ≤580px)
   — Prev / next buttons slide the track; dots jump to any position
   ============================================================ */

(function () {

  /* --- DOM references --- */
  const track    = document.getElementById('carouselTrack');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('carouselDots');
  const cards    = Array.from(track.querySelectorAll('.product-card'));
  const total    = cards.length;  // 5 products

  let currentIndex = 0;

  /* --- How many cards are visible at the current screen width --- */
  function getCardsPerView() {
    const w = window.innerWidth;
    if (w <= 580) return 1;
    if (w <= 900) return 2;
    return 3;
  }

  /* --- Build dot buttons (one per slide position) --- */
  function buildDots() {
    dotsWrap.innerHTML = '';

    const perView  = getCardsPerView();
    const numDots  = total - perView + 1;   // sliding-window page count

    for (let i = 0; i < numDots; i++) {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  /* --- Highlight the active dot --- */
  function updateDots() {
    dotsWrap.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  /* --- Slide to a specific index --- */
  function goTo(index) {
    const perView  = getCardsPerView();
    const maxIndex = total - perView;

    /* Clamp so we never go out of bounds */
    currentIndex = Math.max(0, Math.min(index, maxIndex));

    /* Offset = number of cards skipped × (card width + gap).
       card width is read from the DOM so it works at every breakpoint. */
    const cardWidth = cards[0].offsetWidth;
    const gap       = 24;  /* must match the CSS `gap` value */
    const offset    = currentIndex * (cardWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;

    /* Disable arrow buttons at the edges */
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === maxIndex;

    updateDots();
  }

  /* --- Arrow button handlers --- */
  prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

  /* --- Rebuild on resize so responsive breakpoints work correctly --- */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      currentIndex = 0;   // reset to first slide on every resize
      buildDots();
      goTo(0);
    }, 200);
  });

  /* --- Initial setup --- */
  buildDots();
  goTo(0);

})();


/* ============================================================
   CONTACT FORM
   — Client-side validation with inline success / error feedback
   — No backend; shows confirmation message on valid submit
   ============================================================ */

(function () {

  const form     = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    /* Check all fields are filled */
    if (!name || !email || !message) {
      showFeedback('Please fill in all fields.', true);
      return;
    }

    /* Basic email format check */
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFeedback('Please enter a valid email address.', true);
      return;
    }

    /* Success — reset form and confirm to user */
    form.reset();
    showFeedback(`Thanks, ${name}! We'll be in touch soon. 🐠`, false);
  });

  /* Helper: display a feedback message with optional error styling */
  function showFeedback(message, isError) {
    feedback.textContent = message;
    feedback.className   = 'form-feedback' + (isError ? ' error' : '');
  }

})();


/* ============================================================
   LOGO ICON CYCLING
   — Rotates through a fish 🐠, bird 🦜, and reef 🪸 emoji
     every 2.5 seconds with a smooth fade transition
   ============================================================ */

(function () {

  const emojis  = ['🐠', '🦜', '🪸'];
  let   index   = 0;

  /* The logo icon element (present on every page) */
  const icon = document.querySelector('.logo-icon');
  if (!icon) return;  /* safety guard — exit if element not found */

  setInterval(function () {

    /* Step 1: fade out */
    icon.classList.add('fade-out');

    /* Step 2: swap emoji halfway through the fade, then fade back in */
    setTimeout(function () {
      index = (index + 1) % emojis.length;
      icon.textContent = emojis[index];
      icon.classList.remove('fade-out');
    }, 300);  /* 300 ms matches the CSS transition duration */

  }, 2500);   /* full cycle every 2.5 s */

})();


/* ============================================================
   "ADD TO CART" BUTTONS
   — Provides a brief visual confirmation when a card is clicked
   ============================================================ */

(function () {

  document.querySelectorAll('.btn-cart').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const originalText = this.textContent;

      /* Briefly change button to a green "Added ✓" state */
      this.textContent       = 'Added ✓';
      this.style.background  = '#27AE60';

      /* Restore original state after 1.5 s */
      setTimeout(() => {
        this.textContent      = originalText;
        this.style.background = '';
      }, 1500);
    });
  });

})();
