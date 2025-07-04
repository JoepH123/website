document.addEventListener('DOMContentLoaded', () => {

  // --- PRELOADER ---
  // Hides the preloader once the page content has fully loaded.
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      loader.style.display = 'none';
    });
  }

  // --- ANIMATE ON SCROLL (AOS) INITIALIZATION ---
  // Initializes the AOS library to animate elements as they enter the viewport.
  // 'once: true' ensures animations only happen once.
  AOS.init({ once: true });

  // --- NAVBAR STYLING ON SCROLL ---
  // Adds a 'scrolled' class to the header when the user scrolls down,
  // allowing for a change in background color or other styles.
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // --- MOBILE MENU TOGGLE ---
  // Toggles the visibility of the mobile navigation menu when the hamburger icon is clicked.
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('nav .nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // --- CONTACT FORM SUBMISSION WITH EMAILJS ---
  // Initializes EmailJS and handles the contact form submission.
  // Disables the button to prevent multiple submissions and shows a success message.
  emailjs.init('HlnYIoVp37HCcQnlM'); // Replace with your EmailJS User ID
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button');
      const successMsg = contactForm.querySelector('.success');
      
      submitBtn.disabled = true;
      submitBtn.innerText = 'Versturen...';

      emailjs.send('service_pgoz1u4', 'template_vm4iy36', { // Replace with your Service & Template ID
        name: this.from_name.value,
        email: this.reply_to.value,
        message: this.message.value
      }).then(() => {
        submitBtn.innerText = 'Verstuurd!';
        if(successMsg) successMsg.classList.add('show');
      }, (error) => {
        console.error('EmailJS error:', error);
        submitBtn.disabled = false;
        submitBtn.innerText = 'Verstuur Bericht';
        alert('Er is een fout opgetreden. Probeer het opnieuw.');
      });
    });
  }

  // --- BACK TO TOP BUTTON ---
  // Shows the "Back to Top" button when the user scrolls down
  // and smoothly scrolls the page to the top when clicked.
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      backToTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- PARTICLES.JS INITIALIZATION ---
  // Creates the animated particle background in the hero section.
  const particlesJsEl = document.getElementById('particles-js');
  if (particlesJsEl) {
    particlesJS('particles-js', {
      "particles": {
        "number": { "value": 80, "density": { "enable": true, "value_area": 800 }},
        "color": { "value": "#ffffff" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.5, "random": false },
        "size": { "value": 3, "random": true },
        "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 },
        "move": { "enable": true, "speed": 2, "direction": "none", "out_mode": "out" }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
        "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 }}, "push": { "particles_nb": 4 }}
      },
      "retina_detect": true
    });
  }

  // --- HORIZONTAL SCROLL LOGIC ---
  // Manages the horizontal scrolling effect in the "Waarom" section.
  // This logic centers the first panel, then scrolls it completely out of view 
  // while centering the second panel. This is achieved by dynamically inserting a gap.
  const horizontalSection = document.getElementById('waarom-horizontal');
  if (horizontalSection) {
    const horizontalContentWrapper = horizontalSection.querySelector('.horizontal-content-wrapper');
    const panels = horizontalSection.querySelectorAll('.horizontal-panel');
    const scrollableContentWindow = horizontalSection.querySelector('.scrollable-content-window');
      
    if (horizontalContentWrapper && panels.length > 1 && scrollableContentWindow) {
      let panelEffectiveWidth = 0;
      let initialTranslateX = 0;
      let gap = 0;

      const calculateScrollDistance = () => {
        if (window.innerWidth > 992) {
          const viewportWidth = scrollableContentWindow.offsetWidth;
          panelEffectiveWidth = panels[0].offsetWidth;
          
          // Calculate the required gap to satisfy both conditions:
          // 1. Panel 2 is centered at the end.
          // 2. Panel 1 is off-screen at the end.
          gap = (viewportWidth - panelEffectiveWidth) / 2;
          gap = Math.max(0, gap); // Ensure gap is not negative
          
          horizontalContentWrapper.style.gap = `${gap}px`;

          // Initial position: center the first panel
          initialTranslateX = (viewportWidth - panelEffectiveWidth) / 2;
          horizontalContentWrapper.style.transform = `translateX(${initialTranslateX}px)`;
          horizontalContentWrapper.style.justifyContent = 'flex-start';
        } else {
          // Reset styles for mobile view
          panelEffectiveWidth = 0;
          initialTranslateX = 0;
          gap = 0;
          horizontalContentWrapper.style.gap = '0px';
          horizontalContentWrapper.style.transform = 'none';
          horizontalContentWrapper.style.justifyContent = 'center';
        }
      };

      const handleScroll = () => {
        if (window.innerWidth <= 992 || panelEffectiveWidth === 0) return;

        const sectionTop = horizontalSection.offsetTop;
        const sectionHeight = horizontalSection.offsetHeight;
        const scrollY = window.scrollY;
        
        // Define the part of the section's height during which the scroll animation occurs
        const scrollAnimationHeight = sectionHeight / 2;
        const scrollStart = sectionTop;
        const scrollEnd = scrollStart + scrollAnimationHeight;

        if (scrollY >= scrollStart && scrollY <= scrollEnd) {
          const progress = (scrollY - scrollStart) / (scrollEnd - scrollStart);
          // The total distance to translate is the width of one panel plus the calculated gap.
          const totalScrollDistance = panelEffectiveWidth + gap;
          const translateX = initialTranslateX - (progress * totalScrollDistance);
          horizontalContentWrapper.style.transform = `translateX(${translateX}px)`;
        } else if (scrollY < scrollStart) {
          // Before the scroll area, snap to the initial position
          horizontalContentWrapper.style.transform = `translateX(${initialTranslateX}px)`;
        } else {
          // After the scroll area, snap to the final position
          const totalScrollDistance = panelEffectiveWidth + gap;
          horizontalContentWrapper.style.transform = `translateX(${initialTranslateX - totalScrollDistance}px)`;
        }
      };

      // Set initial state and add listeners for scroll and resize events
      calculateScrollDistance();
      window.addEventListener('resize', calculateScrollDistance);
      window.addEventListener('scroll', handleScroll);
    }
  }
});