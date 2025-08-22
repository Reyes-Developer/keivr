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