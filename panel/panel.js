// ===== SISTEMA DE ADMINISTRACIÓN PREMIUM - panel.js =====
console.log('🚀 Iniciando Panel de Administración Premium');

// Configuración del sistema
const CONFIG = {
    credentials: {
        username: 'admin',
        password: 'keivr2024!' // CAMBIA ESTA CONTRASEÑA
    },
    storageKey: 'keivr_offers',
    analyticsKey: 'keivr_analytics',
    version: '1.0.0'
};

// Estado global de la aplicación
const APP_STATE = {
    isAuthenticated: false,
    currentSection: 'dashboard',
    offers: [],
    analytics: null,
    currentOffer: null,
    isEditing: false
};

// Elementos del DOM
const DOM = {
    loginContainer: document.getElementById('login-container'),
    adminContainer: document.getElementById('admin-container'),
    loginForm: document.getElementById('login-form'),
    loginError: document.getElementById('login-error'),
    logoutBtn: document.getElementById('logout-btn'),
    menuToggle: document.getElementById('menu-toggle'),
    sectionTitle: document.getElementById('section-title'),
    todayVisits: document.getElementById('today-visits'),
    totalContacts: document.getElementById('total-contacts'),
    totalOffers: document.getElementById('total-offers'),
    offersList: document.getElementById('offers-list'),
    addOfferBtn: document.getElementById('add-offer-btn'),
    offerModal: document.getElementById('offer-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalClose: document.getElementById('modal-close'),
    modalCancel: document.getElementById('modal-cancel'),
    offerForm: document.getElementById('offer-form')
};

// ===== SISTEMA DE AUTENTICACIÓN =====
class AuthSystem {
    constructor() {
        this.init();
    }

    init() {
        this.checkExistingSession();
        this.setupEventListeners();
    }

    checkExistingSession() {
        const session = localStorage.getItem('keivr_session');
        if (session && JSON.parse(session).isAuthenticated) {
            this.handleSuccessfulLogin();
        }
    }

    setupEventListeners() {
        DOM.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        DOM.logoutBtn.addEventListener('click', () => this.handleLogout());
    }

    handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === CONFIG.credentials.username && 
            password === CONFIG.credentials.password) {
            this.handleSuccessfulLogin();
        } else {
            this.handleLoginError();
        }
    }

    handleSuccessfulLogin() {
        DOM.loginError.style.display = 'none';
        DOM.loginContainer.classList.add('hidden');
        DOM.adminContainer.classList.remove('hidden');
        
        // Guardar sesión
        localStorage.setItem('keivr_session', JSON.stringify({
            isAuthenticated: true,
            lastLogin: new Date().toISOString()
        }));

        APP_STATE.isAuthenticated = true;
        
        // Inicializar sistemas
        this.loadOffers();
        this.updateStats();
        
        console.log('✅ Login exitoso');
        this.showNotification('Bienvenido al Panel de Administración', 'success');
    }

    handleLoginError() {
        DOM.loginError.style.display = 'flex';
        console.log('❌ Error de autenticación');
        
        // Efecto de shake en el formulario
        DOM.loginForm.style.animation = 'shake 0.5s ease';
        setTimeout(() => DOM.loginForm.style.animation = '', 500);
    }

    handleLogout() {
        localStorage.removeItem('keivr_session');
        DOM.adminContainer.classList.add('hidden');
        DOM.loginContainer.classList.remove('hidden');
        DOM.loginForm.reset();
        
        APP_STATE.isAuthenticated = false;
        console.log('🔒 Sesión cerrada');
        
        this.showNotification('Sesión cerrada correctamente', 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="bi bi-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
}

// ===== SISTEMA DE GESTIÓN DE OFERTAS =====
class OffersSystem {
    constructor() {
        this.init();
    }

    init() {
        this.loadOffers();
        this.setupEventListeners();
    }

    loadOffers() {
        const saved = localStorage.getItem(CONFIG.storageKey);
        APP_STATE.offers = saved ? JSON.parse(saved) : [];
        this.renderOffers();
    }

    saveOffers() {
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(APP_STATE.offers));
        this.updateStats();
        console.log('💾 Ofertas guardadas');
    }

    setupEventListeners() {
        DOM.addOfferBtn.addEventListener('click', () => this.openOfferModal());
        DOM.modalClose.addEventListener('click', () => this.closeModal());
        DOM.modalCancel.addEventListener('click', () => this.closeModal());
        DOM.offerForm.addEventListener('submit', (e) => this.handleOfferSubmit(e));
        
        // Cerrar modal al hacer clic fuera
        DOM.offerModal.addEventListener('click', (e) => {
            if (e.target === DOM.offerModal) this.closeModal();
        });
    }

    openOfferModal(offer = null) {
        APP_STATE.isEditing = !!offer;
        APP_STATE.currentOffer = offer;
        
        DOM.modalTitle.innerHTML = `
            <i class="bi bi-${APP_STATE.isEditing ? 'pencil' : 'plus-circle'}"></i>
            ${APP_STATE.isEditing ? 'Editar' : 'Nueva'} Oferta
        `;
        
        if (APP_STATE.isEditing) {
            document.getElementById('offer-title').value = offer.title;
            document.getElementById('offer-type').value = offer.type;
            document.getElementById('offer-description').value = offer.description;
            document.getElementById('offer-image').value = offer.image;
            document.getElementById('offer-date').value = offer.date;
        } else {
            DOM.offerForm.reset();
            document.getElementById('offer-date').value = new Date().toISOString().split('T')[0];
        }
        
        DOM.offerModal.classList.remove('hidden');
    }

    closeModal() {
        DOM.offerModal.classList.add('hidden');
        APP_STATE.currentOffer = null;
        APP_STATE.isEditing = false;
    }

    handleOfferSubmit(e) {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('offer-title').value,
            type: document.getElementById('offer-type').value,
            description: document.getElementById('offer-description').value,
            image: document.getElementById('offer-image').value,
            date: document.getElementById('offer-date').value,
            createdAt: new Date().toISOString(),
            id: Date.now().toString()
        };

        if (APP_STATE.isEditing) {
            const index = APP_STATE.offers.findIndex(o => o.id === APP_STATE.currentOffer.id);
            if (index !== -1) {
                APP_STATE.offers[index] = { ...APP_STATE.offers[index], ...formData };
            }
        } else {
            APP_STATE.offers.unshift(formData);
        }

        this.saveOffers();
        this.renderOffers();
        this.closeModal();
        
        this.showNotification(
            APP_STATE.isEditing ? 'Oferta actualizada correctamente' : 'Oferta creada con éxito',
            'success'
        );
    }

    deleteOffer(index) {
        if (confirm('¿Estás seguro de que quieres eliminar esta oferta?')) {
            APP_STATE.offers.splice(index, 1);
            this.saveOffers();
            this.renderOffers();
            this.showNotification('Oferta eliminada correctamente', 'success');
        }
    }

    renderOffers() {
        if (!DOM.offersList) return;
        
        if (APP_STATE.offers.length === 0) {
            DOM.offersList.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 40px; color: var(--muted);">
                    <i class="bi bi-inbox" style="font-size: 3rem; margin-bottom: 15px;"></i>
                    <h3>No hay ofertas aún</h3>
                    <p>Crea tu primera oferta para comenzar</p>
                    <button class="btn btn-primary" onclick="offersSystem.openOfferModal()" style="margin-top: 15px;">
                        <i class="bi bi-plus-circle"></i> Crear Primera Oferta
                    </button>
                </div>
            `;
            return;
        }
        
        DOM.offersList.innerHTML = APP_STATE.offers.map((offer, index) => {
            const icon = offer.type === 'new' ? 'star' : 
                        offer.type === 'offer' ? 'currency-dollar' : 'arrow-repeat';
            const typeClass = `type-${offer.type}`;
            const typeText = offer.type === 'new' ? 'Nuevo' : 
                           offer.type === 'offer' ? 'Oferta' : 'Actualización';
            
            return `
                <div class="offer-item">
                    <div class="offer-content">
                        <div class="offer-title">
                            ${offer.title}
                            <span class="offer-type ${typeClass}">
                                <i class="bi bi-${icon}"></i> ${typeText}
                            </span>
                        </div>
                        <p class="offer-description">${offer.description}</p>
                        <div class="offer-date">
                            <i class="bi bi-calendar"></i> 
                            ${this.formatDate(offer.date)}
                        </div>
                    </div>
                    <div class="offer-actions">
                        <button class="btn btn-outline" onclick="offersSystem.openOfferModal(${JSON.stringify(offer).replace(/"/g, '&quot;')})">
                            <i class="bi bi-pencil"></i> Editar
                        </button>
                        <button class="btn btn-danger" onclick="offersSystem.deleteOffer(${index})">
                            <i class="bi bi-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    updateStats() {
        if (DOM.totalOffers) {
            DOM.totalOffers.textContent = APP_STATE.offers.length;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="bi bi-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
}

// ===== SISTEMA DE NAVEGACIÓN =====
class NavigationSystem {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showSection('dashboard');
    }

    setupEventListeners() {
        // Navegación del sidebar
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                this.showSection(section);
            });
        });

        // Botones de acción rápida
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.getAttribute('data-section');
                if (section) this.showSection(section);
            });
        });

        // Menu toggle para móviles
        if (DOM.menuToggle) {
            DOM.menuToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Cerrar sidebar al hacer clic fuera en móviles
        document.addEventListener('click', (e) => {
            const sidebar = document.querySelector('.sidebar');
            if (window.innerWidth < 1024 && 
                sidebar.classList.contains('active') &&
                !sidebar.contains(e.target) &&
                !DOM.menuToggle.contains(e.target)) {
                this.toggleSidebar();
            }
        });
    }

    showSection(section) {
        // Ocultar todas las secciones
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });

        // Mostrar sección seleccionada
        const targetSection = document.getElementById(`${section}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            APP_STATE.currentSection = section;
            
            // Actualizar título
            const title = targetSection.querySelector('h3')?.textContent || 'Dashboard';
            DOM.sectionTitle.innerHTML = `
                <i class="bi bi-${this.getSectionIcon(section)}"></i>
                ${title}
            `;
        }

        // Actualizar navegación
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === section) {
                item.classList.add('active');
            }
        });

        // Cerrar sidebar en móviles
        if (window.innerWidth < 1024) {
            this.toggleSidebar(false);
        }

        // Cargar contenido específico
        if (section === 'offers') {
            offersSystem.renderOffers();
        } else if (section === 'analytics') {
            // analyticsSystem.loadAnalyticsData();
        }
    }

    getSectionIcon(section) {
        const icons = {
            dashboard: 'speedometer2',
            offers: 'tags',
            analytics: 'graph-up',
            settings: 'gear'
        };
        return icons[section] || 'house';
    }

    toggleSidebar(force) {
        const sidebar = document.querySelector('.sidebar');
        if (force !== undefined) {
            sidebar.classList.toggle('active', force);
        } else {
            sidebar.classList.toggle('active');
        }
    }
}

// ===== SISTEMA DE ESTADÍSTICAS =====
class StatsSystem {
    constructor() {
        this.init();
    }

    init() {
        this.loadAnalytics();
        this.startLiveUpdates();
    }

    loadAnalytics() {
        const saved = localStorage.getItem(CONFIG.analyticsKey);
        APP_STATE.analytics = saved ? JSON.parse(saved) : this.getDefaultAnalytics();
        this.updateStats();
    }

    getDefaultAnalytics() {
        return {
            totalVisits: 0,
            todayVisits: 0,
            totalContacts: 0,
            monthlyContacts: 0,
            visitHistory: {},
            contactHistory: {},
            createdAt: new Date().toISOString()
        };
    }

    updateStats() {
        if (DOM.todayVisits) {
            DOM.todayVisits.textContent = APP_STATE.analytics.todayVisits;
        }
        if (DOM.totalContacts) {
            DOM.totalContacts.textContent = APP_STATE.analytics.totalContacts;
        }
        if (DOM.totalOffers) {
            DOM.totalOffers.textContent = APP_STATE.offers.length;
        }
    }

    startLiveUpdates() {
        // Simular actualizaciones en tiempo real
        setInterval(() => {
            this.simulateLiveData();
            this.updateStats();
        }, 30000); // Cada 30 segundos
    }

    simulateLiveData() {
        // Pequeñas variaciones para simular datos en tiempo real
        const variation = Math.random() > 0.5 ? 1 : 0;
        APP_STATE.analytics.todayVisits += variation;
        
        if (Math.random() > 0.8) {
            APP_STATE.analytics.totalContacts += 1;
        }
        
        this.saveAnalytics();
    }

    saveAnalytics() {
        localStorage.setItem(CONFIG.analyticsKey, JSON.stringify(APP_STATE.analytics));
    }

    trackVisit() {
        const today = new Date().toDateString();
        APP_STATE.analytics.totalVisits++;
        
        if (APP_STATE.analytics.visitHistory[today]) {
            APP_STATE.analytics.visitHistory[today]++;
        } else {
            APP_STATE.analytics.visitHistory[today] = 1;
        }
        
        APP_STATE.analytics.todayVisits = APP_STATE.analytics.visitHistory[today] || 0;
        this.saveAnalytics();
        this.updateStats();
    }

    trackContact() {
        const today = new Date().toDateString();
        const month = new Date().toMonthYear();
        
        APP_STATE.analytics.totalContacts++;
        
        if (APP_STATE.analytics.contactHistory[today]) {
            APP_STATE.analytics.contactHistory[today]++;
        } else {
            APP_STATE.analytics.contactHistory[today] = 1;
        }
        
        this.saveAnalytics();
        this.updateStats();
    }
}

// Extender Date para formato mes-año
Date.prototype.toMonthYear = function() {
    return this.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
};

// ===== INICIALIZACIÓN DE LA APLICACIÓN =====
class App {
    constructor() {
        this.init();
    }

    init() {
        console.log('🎯 Inicializando aplicación...');
        
        // Inicializar sistemas
        this.authSystem = new AuthSystem();
        this.offersSystem = new OffersSystem();
        this.navigationSystem = new NavigationSystem();
        this.statsSystem = new StatsSystem();
        
        // Configurar event listeners globales
        this.setupGlobalListeners();
        
        // Verificar autenticación
        if (APP_STATE.isAuthenticated) {
            this.onAuthenticated();
        }
        
        console.log('✅ Aplicación inicializada');
    }

    setupGlobalListeners() {
        // Tecla Escape para cerrar modales
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !DOM.offerModal.classList.contains('hidden')) {
                offersSystem.closeModal();
            }
        });

        // Prevenir envío de formularios no deseados
        document.addEventListener('submit', (e) => {
            if (e.target.tagName === 'FORM' && !e.target.id) {
                e.preventDefault();
            }
        });
    }

    onAuthenticated() {
        // Cargar datos iniciales
        this.offersSystem.loadOffers();
        this.statsSystem.loadAnalytics();
        
        // Iniciar actualizaciones en tiempo real
        this.statsSystem.startLiveUpdates();
    }
}

// ===== INICIALIZAR APLICACIÓN =====
let offersSystem;
let statsSystem;

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar aplicación
    const app = new App();
    
    // Hacer sistemas globales para onclick
    window.offersSystem = offersSystem = new OffersSystem();
    window.statsSystem = statsSystem = new StatsSystem();
    
    // Añadir estilos de animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        .offer-item {
            animation: slideIn 0.4s ease;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
});

// ===== FUNCIONES GLOBALES PARA HTML =====
function openOfferModal(offer = null) {
    if (offersSystem) {
        offersSystem.openOfferModal(offer);
    }
}

function deleteOffer(index) {
    if (offersSystem) {
        offersSystem.deleteOffer(index);
    }
}
