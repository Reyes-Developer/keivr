// --- Google Translate callback (igual que en tu HTML original) ---
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: 'en', includedLanguages: 'es,pt,en,fr,de,it' },
    'google_translate_element'
  );
}

// --- Resto del JS, ejecutado cuando todo está listo ---
window.addEventListener('load', () => {
  // Toggle del popup del traductor
  const fab = document.getElementById("openTranslate");
  const menu = document.getElementById("translateMenu");
  const langItems = document.querySelectorAll(".lang-list li");

  if (fab && menu) {
    fab.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });
  }

  // Cambiar idioma al hacer click en cada opción
  langItems.forEach(item => {
    item.addEventListener("click", () => {
      const lang = item.dataset.lang;
      const select = document.querySelector(".goog-te-combo");
      if (select && lang) {
        select.value = lang;
        select.dispatchEvent(new Event("change"));
      }
      if (menu) menu.classList.add("hidden");
    });
  });

  // Cerrar popup al hacer click fuera
  document.addEventListener('click', (e) => {
    if (menu && !menu.contains(e.target) && !fab.contains(e.target)) {
      menu.classList.add('hidden');
    }
  });

  // Partículas (idéntico a tu config)
  if (window.particlesJS) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 50, density: { enable: true, value_area: 800 } },
        color: { value: '#9fbbe8' },
        shape: { type: 'circle' },
        opacity: { value: 0.25 },
        size: { value: 3, random: true },
        line_linked: { enable: true, color: "#9fbbe8", opacity: 0.4, width: 1 },
        move: { enable:true, speed:1.2 }
      },
      interactivity: {
        events: { onhover:{ enable:true, mode:'repulse' }, onclick:{ enable:true, mode:'push' } },
        modes: { repulse:{ distance:90 }, push:{ particles_nb: 4 } }
      },
      retina_detect:true
    });
  }

  // Activar íconos Lucide
  if (window.lucide && lucide.createIcons) {
    lucide.createIcons();
  }
});

// === MICROINTERACCIONES ===

// Tilt 3D para cards
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 6; 
    const rotateY = ((x - centerX) / centerX) * -6;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0) rotateY(0) scale(1)";
  });
});

/* --- HERO DINÁMICO (Typing Effect) --- */
const typingText = document.getElementById("typing-text");
const phrases = ["⚡ Fast delivery", "✅ Trusted reseller", "🔒 Secure & reliable"];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentPhrase = phrases[phraseIndex];
  
  if (!isDeleting) {
    typingText.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentPhrase.length) {
      isDeleting = true;
      setTimeout(typeEffect, 1500); // Pausa al terminar
      return;
    }
  } else {
    typingText.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(typeEffect, isDeleting ? 50 : 100);
}

if (typingText) {
  typeEffect();
}

// === Scroll Reveal ===
const revealElements = document.querySelectorAll(".reveal");

const revealOnScroll = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("revealed");
      observer.unobserve(entry.target); // se revela solo una vez
    }
  });
};

const observer = new IntersectionObserver(revealOnScroll, {
  threshold: 0.15, // % de visibilidad para activar
});

revealElements.forEach(el => observer.observe(el));