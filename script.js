// --- Google Translate callback ---
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: 'en', includedLanguages: 'es,pt,en,fr,de,it' },
    'google_translate_element'
  );
}

// --- Ejecutado cuando todo está listo ---
document.addEventListener('DOMContentLoaded', () => {
  // Configuración de partículas
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

  // Efecto de escritura
  const typingText = document.getElementById("typing-text");
  const phrases = ["⚡ Fast delivery", "✅ Trusted reseller", "🔒 Secure & reliable"];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    if (!typingText) return;
    
    const currentPhrase = phrases[phraseIndex];
    
    if (!isDeleting) {
      typingText.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(typeEffect, 1500);
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

  // Navegación y scroll
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  function checkScroll() {
    let current = "";
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (pageYOffset >= sectionTop - 100) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href").substring(1) === current) {
        link.classList.add("active");
      }
    });

    // Revelar elementos al hacer scroll
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.scrollY > sectionTop - window.innerHeight + 100) {
        section.classList.add("visible");
      }
    });
  }

  window.addEventListener("scroll", checkScroll);
  window.addEventListener("load", checkScroll);

// Navegación suave MEJORADA
navLinks.forEach(link => {
  link.addEventListener("click", function(e) {
    e.preventDefault();
    const targetId = this.getAttribute("href").substring(1);
    const targetSection = document.getElementById(targetId);
    
    // Remover activo de todos los links
    navLinks.forEach(l => l.classList.remove("active"));
    
    // Agregar activo al link clickeado
    this.classList.add("active");
    
    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop - 80,
        behavior: "smooth"
      });
    }
  });
});

// Efecto de desvanecimiento al hacer scroll
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 100) {
    navbar.style.background = 'rgba(11, 15, 20, 0.95)';
    navbar.style.backdropFilter = 'blur(20px) saturate(180%)';
  } else {
    navbar.style.background = 'rgba(11, 15, 20, 0.7)';
    navbar.style.backdropFilter = 'blur(15px) saturate(180%)';
  }
});

  // Traductor
  const fab = document.getElementById("openTranslate");
  const menu = document.getElementById("translateMenu");
  const langItems = document.querySelectorAll(".lang-list li");

  if (fab && menu) {
    fab.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });
  }

  // Cerrar popup al hacer click fuera
  document.addEventListener('click', (e) => {
    if (menu && fab && !menu.contains(e.target) && !fab.contains(e.target)) {
      menu.classList.add('hidden');
    }
  });

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

  // Formulario de contacto
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
      e.preventDefault();
      alert("¡Gracias por tu mensaje! Te responderé pronto.");
      contactForm.reset();
    });
  }

  // Tilt 3D para cards
  document.querySelectorAll(".service-card, .project-card").forEach(card => {
    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * 3; 
      const rotateY = ((x - centerX) / centerX) * -3;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
    });
  });

  // Glow pulsante en el avatar
  const avatar = document.querySelector(".avatar-glow");
  if (avatar) {
    setInterval(() => {
      avatar.style.boxShadow = avatar.style.boxShadow.includes('0 0 40px') 
        ? '0 0 20px rgba(255, 255, 255, 0.35)' 
        : '0 0 40px rgba(255, 255, 255, 0.6)';
    }, 1500);
  }
});