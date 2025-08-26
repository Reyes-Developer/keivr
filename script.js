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
      
      // Cerrar menú móvil si está abierto
      const navLinksContainer = document.getElementById('navLinks');
      const menuToggle = document.getElementById('menuToggle');
      if (navLinksContainer.classList.contains('active')) {
        menuToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
      }
      
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

  // Formulario de contacto con Formspree - MEJORADO
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  // Activar validación cuando el usuario escribe
  const inputs = contactForm.querySelectorAll('.form-input, .form-textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      this.classList.add('validation-check');
    });
    
    input.addEventListener('input', function() {
      if (this.classList.contains('validation-check')) {
        // Re-validar en cada tecla después de la primera validación
        this.classList.add('validation-check');
      }
    });
  });
  
  contactForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    
    // Forzar validación visual de todos los campos
    inputs.forEach(input => {
      input.classList.add('validation-check');
    });
    
    // Verificar si hay campos inválidos
    const invalidInputs = contactForm.querySelectorAll('.form-input.validation-check:invalid, .form-textarea.validation-check:invalid');
    if (invalidInputs.length > 0) {
      invalidInputs[0].focus(); // Enfocar el primer campo inválido
      return; // Detener el envío
    }
    
    // Mostrar loader
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i><span>Sending...</span>';
    submitBtn.disabled = true;
    
    try {
      const formData = new FormData(this);
      
      const response = await fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        // Mensaje de éxito
        showNotification('✅ Message sent successfully! I will contact you soon.', 'success');
        contactForm.reset();
        // Remover validación visual después de enviar
        inputs.forEach(input => {
          input.classList.remove('validation-check');
        });
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      // Mensaje de error
      showNotification('❌ Error sending message. Try again.', 'error');
    } finally {
      // Restaurar botón
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

// Función para mostrar notificación
function showNotification(message, type) {
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="bi ${type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  // Estilos para la notificación
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? 'rgba(39, 174, 96, 0.9)' : 'rgba(235, 87, 87, 0.9)'};
    color: white;
    padding: 15px 20px;
    border-radius: 12px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    z-index: 10000;
    animation: slideIn 0.3s ease;
    max-width: 300px;
  `;
  
  document.body.appendChild(notification);
  
  // Remover después de 4 segundos
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// Añadir estilos para la animación de spin y notificación
const style = document.createElement('style');
style.textContent = `
  .spin {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  .notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;
document.head.appendChild(style);

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

  // Menú hamburguesa para móviles
  const menuToggle = document.getElementById('menuToggle');
  const navLinksContainer = document.getElementById('navLinks');
  
  if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinksContainer.classList.toggle('active');
    });
    
    // Cerrar menú al hacer clic en un enlace
    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
      });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (navLinksContainer.classList.contains('active') && 
          !navLinksContainer.contains(e.target) && 
          !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
      }
    });
  }
});

// ===== SISTEMA DE OFERTAS - AGREGAR ESTO =====
function cargarOfertasDesdePanel() {
    console.log('🔄 Cargando ofertas desde el panel...');
    
    try {
        const ofertasGuardadas = localStorage.getItem('keivr_offers');
        const ofertas = ofertasGuardadas ? JSON.parse(ofertasGuardadas) : [];
        
        console.log(`📊 ${ofertas.length} ofertas encontradas`);
        
        if (ofertas.length === 0) {
            mostrarOfertasPorDefecto();
            return;
        }
        
        mostrarOfertas(ofertas);
        
    } catch (error) {
        console.error('❌ Error al cargar ofertas:', error);
        mostrarOfertasPorDefecto();
    }
}

function mostrarOfertas(ofertas) {
    const contenedorOfertas = document.getElementById('ofertas-container');
    if (!contenedorOfertas) return;
    
    contenedorOfertas.innerHTML = '';
    
    ofertas.forEach((oferta, index) => {
        const ofertaHTML = crearHTMLOferta(oferta, index);
        contenedorOfertas.innerHTML += ofertaHTML;
    });
}

function crearHTMLOferta(oferta, index) {
    const iconos = { new: '🆕', offer: '💰', update: '🔄' };
    const clases = { new: 'badge-new', offer: 'badge-offer', update: 'badge-update' };
    const textos = { new: 'Nuevo', offer: 'Oferta', update: 'Actualización' };
    
    return `
        <div class="offer-card">
            <div class="offer-image">
                <img src="${oferta.image}" alt="${oferta.title}" loading="lazy">
                <span class="offer-badge ${clases[oferta.type]}">${iconos[oferta.type]} ${textos[oferta.type]}</span>
            </div>
            <div class="offer-content">
                <h3>${oferta.title}</h3>
                <p>${oferta.description}</p>
                <div class="offer-footer">
                    <span class="offer-date">${formatearFecha(oferta.date)}</span>
                    <button class="btn-ver-mas" onclick="window.location.href='#contact'">Ver más</button>
                </div>
            </div>
        </div>
    `;
}

function mostrarOfertasPorDefecto() {
    const ofertasPorDefecto = [
        {
            title: "Servicios Profesionales",
            description: "Ofrezco servicios de dealer, reseller e intermediación con los más altos estándares de seguridad.",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            type: "new",
            date: new Date().toISOString().split('T')[0]
        },
        {
            title: "Descuento Especial",
            description: "Aprovecha tarifas preferenciales en todos mis servicios durante este mes.",
            image: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            type: "offer",
            date: new Date().toISOString().split('T')[0]
        }
    ];
    
    mostrarOfertas(ofertasPorDefecto);
}

function formatearFecha(fechaString) {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fechaString).toLocaleDateString('es-ES', opciones);
}

// Cargar cuando la página esté lista
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(cargarOfertasDesdePanel, 500);
});

// Recargar si se vuelve a la página
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        cargarOfertasDesdePanel();
    }
});