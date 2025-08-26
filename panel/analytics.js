// ===== SISTEMA DE ANALYTICS PREMIUM - analytics.js =====
console.log('📊 Iniciando Sistema de Analytics Premium');

class AnalyticsSystem {
    constructor() {
        this.config = {
            storageKey: 'keivr_analytics',
            sessionTimeout: 30 * 60 * 1000, // 30 minutos
            maxVisitsPerDay: 1000,
            geoApiUrl: 'https://ipapi.co/json/'
        };
        
        this.state = {
            currentSession: null,
            isTracking: false,
            realTimeData: {
                activeUsers: 0,
                currentVisits: 0,
                liveFeed: []
            }
        };
        
        this.init();
    }

    async init() {
        console.log('🚀 Inicializando sistema de analytics...');
        
        // Cargar datos existentes
        this.loadAnalyticsData();
        
        // Iniciar sesión actual
        await this.startNewSession();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Iniciar monitoreo en tiempo real
        this.startRealTimeMonitoring();
        
        console.log('✅ Sistema de analytics inicializado');
    }

    // ===== GESTIÓN DE SESIONES =====
    async startNewSession() {
        const sessionData = {
            id: this.generateSessionId(),
            startTime: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            userAgent: navigator.userAgent,
            language: navigator.language,
            screen: {
                width: screen.width,
                height: screen.height,
                colorDepth: screen.colorDepth
            },
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            device: this.detectDevice(),
            location: await this.getApproximateLocation(),
            referrer: document.referrer || 'direct',
            utmParams: this.extractUTMParameters()
        };

        this.state.currentSession = sessionData;
        this.state.isTracking = true;

        // Registrar visita
        this.trackVisit('pageview');

        // Iniciar timer de sesión
        this.startSessionTimer();

        console.log('🆕 Nueva sesión iniciada:', sessionData.id);
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    detectDevice() {
        const ua = navigator.userAgent;
        return {
            isMobile: /iPhone|iPad|iPod|Android/i.test(ua),
            isTablet: /iPad|Android.*Tablet/i.test(ua),
            isDesktop: !/iPhone|iPad|iPod|Android/i.test(ua),
            browser: this.detectBrowser(),
            os: this.detectOS()
        };
    }

    detectBrowser() {
        const ua = navigator.userAgent;
        if (/edg/i.test(ua)) return 'Edge';
        if (/chrome|chromium|crios/i.test(ua)) return 'Chrome';
        if (/firefox|fxios/i.test(ua)) return 'Firefox';
        if (/safari/i.test(ua)) return 'Safari';
        if (/opr\//i.test(ua)) return 'Opera';
        return 'Unknown';
    }

    detectOS() {
        const ua = navigator.userAgent;
        if (/windows/i.test(ua)) return 'Windows';
        if (/macintosh|mac os x/i.test(ua)) return 'macOS';
        if (/linux/i.test(ua)) return 'Linux';
        if (/android/i.test(ua)) return 'Android';
        if (/ios|iphone|ipad|ipod/i.test(ua)) return 'iOS';
        return 'Unknown';
    }

    async getApproximateLocation() {
        try {
            const response = await fetch(this.config.geoApiUrl);
            const data = await response.json();
            
            return {
                country: data.country_name,
                countryCode: data.country_code,
                region: data.region,
                city: data.city,
                timezone: data.timezone,
                latitude: data.latitude,
                longitude: data.longitude
            };
        } catch (error) {
            console.log('📍 No se pudo obtener la ubicación:', error);
            return {
                country: 'Unknown',
                countryCode: 'XX',
                region: 'Unknown',
                city: 'Unknown'
            };
        }
    }

    extractUTMParameters() {
        const params = new URLSearchParams(window.location.search);
        const utmParams = {};
        
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
            if (params.has(param)) {
                utmParams[param] = params.get(param);
            }
        });
        
        return Object.keys(utmParams).length > 0 ? utmParams : null;
    }

    startSessionTimer() {
        setInterval(() => {
            if (this.state.currentSession) {
                this.state.currentSession.lastActivity = new Date().toISOString();
                
                // Verificar si la sesión expiró
                const lastActivity = new Date(this.state.currentSession.lastActivity);
                const now = new Date();
                const diff = now - lastActivity;
                
                if (diff > this.config.sessionTimeout) {
                    console.log('⏰ Sesión expirada');
                    this.endSession();
                    this.startNewSession();
                }
            }
        }, 60000); // Verificar cada minuto
    }

    endSession() {
        if (this.state.currentSession) {
            this.state.currentSession.endTime = new Date().toISOString();
            this.state.currentSession.duration = 
                new Date(this.state.currentSession.endTime) - 
                new Date(this.state.currentSession.startTime);
            
            this.saveSessionData();
            this.state.currentSession = null;
        }
    }

    // ===== SEGUIMIENTO DE EVENTOS =====
    trackVisit(eventType, data = {}) {
        if (!this.state.isTracking) return;

        const visitData = {
            id: 'visit_' + Date.now(),
            timestamp: new Date().toISOString(),
            sessionId: this.state.currentSession.id,
            eventType: eventType,
            page: window.location.pathname,
            pageTitle: document.title,
            ...data
        };

        // Actualizar analytics data
        this.updateAnalyticsData(visitData);

        // Actualizar tiempo real
        this.updateRealTimeData(visitData);

        console.log('📈 Visita registrada:', visitData.eventType);
    }

    trackConversion(conversionData) {
        const conversion = {
            id: 'conversion_' + Date.now(),
            timestamp: new Date().toISOString(),
            sessionId: this.state.currentSession.id,
            type: 'conversion',
            ...conversionData
        };

        this.trackVisit('conversion', conversion);
        this.showNotification('🎯 ¡Nueva conversión registrada!');
    }

    trackClick(element, category = 'general') {
        element.addEventListener('click', () => {
            this.trackVisit('click', {
                element: element.tagName,
                id: element.id,
                class: element.className,
                text: element.textContent.substring(0, 50),
                category: category
            });
        });
    }

    // ===== GESTIÓN DE DATOS =====
    updateAnalyticsData(visitData) {
        const today = new Date().toDateString();
        const hour = new Date().getHours();
        const page = visitData.page;

        // Inicializar datos del día si no existen
        if (!this.analyticsData.daily[today]) {
            this.analyticsData.daily[today] = {
                visits: 0,
                uniqueVisitors: new Set(),
                pages: {},
                referrals: {},
                devices: {},
                browsers: {},
                locations: {}
            };
        }

        const dailyData = this.analyticsData.daily[today];

        // Actualizar contadores
        this.analyticsData.total.visits++;
        dailyData.visits++;

        // Visitas por hora
        if (!dailyData.hours) dailyData.hours = {};
        dailyData.hours[hour] = (dailyData.hours[hour] || 0) + 1;

        // Visitantes únicos
        dailyData.uniqueVisitors.add(this.state.currentSession.id);
        this.analyticsData.total.uniqueVisitors = 
            Object.values(this.analyticsData.daily).reduce((total, day) => 
                total + day.uniqueVisitors.size, 0);

        // Páginas visitadas
        if (!dailyData.pages[page]) {
            dailyData.pages[page] = 0;
        }
        dailyData.pages[page]++;

        // Dispositivos
        const deviceType = this.state.currentSession.device.isMobile ? 'mobile' : 
                          this.state.currentSession.device.isTablet ? 'tablet' : 'desktop';
        
        if (!dailyData.devices[deviceType]) {
            dailyData.devices[deviceType] = 0;
        }
        dailyData.devices[deviceType]++;

        // Navegadores
        const browser = this.state.currentSession.device.browser;
        if (!dailyData.browsers[browser]) {
            dailyData.browsers[browser] = 0;
        }
        dailyData.browsers[browser]++;

        // Ubicaciones
        const country = this.state.currentSession.location.countryCode;
        if (!dailyData.locations[country]) {
            dailyData.locations[country] = 0;
        }
        dailyData.locations[country]++;

        // Guardar datos
        this.saveAnalyticsData();

        // Actualizar UI si está en el panel
        this.updateStatsUI();
    }

    updateRealTimeData(visitData) {
        // Agregar a feed en tiempo real
        this.state.realTimeData.liveFeed.unshift({
            ...visitData,
            timestamp: new Date().toLocaleTimeString()
        });

        // Mantener máximo 50 eventos en el feed
        if (this.state.realTimeData.liveFeed.length > 50) {
            this.state.realTimeData.liveFeed.pop();
        }

        // Actualizar usuarios activos
        this.state.realTimeData.activeUsers = 
            Object.values(this.analyticsData.daily)
                .flatMap(day => Array.from(day.uniqueVisitors))
                .filter((id, index, arr) => arr.indexOf(id) === index).length;

        this.state.realTimeData.currentVisits = 
            Object.values(this.analyticsData.daily).reduce((total, day) => total + day.visits, 0);

        // Actualizar UI en tiempo real si está visible
        if (document.getElementById('analytics-section')?.classList.contains('active')) {
            this.updateRealTimeUI();
        }
    }

    // ===== PERSISTENCIA DE DATOS =====
    loadAnalyticsData() {
        try {
            const saved = localStorage.getItem(this.config.storageKey);
            this.analyticsData = saved ? JSON.parse(saved) : this.getDefaultAnalyticsData();
            
            // Convertir Sets back from arrays
            Object.values(this.analyticsData.daily).forEach(day => {
                if (day.uniqueVisitors && Array.isArray(day.uniqueVisitors)) {
                    day.uniqueVisitors = new Set(day.uniqueVisitors);
                }
            });
            
        } catch (error) {
            console.error('❌ Error cargando analytics:', error);
            this.analyticsData = this.getDefaultAnalyticsData();
        }
    }

    getDefaultAnalyticsData() {
        return {
            total: {
                visits: 0,
                uniqueVisitors: 0,
                conversions: 0,
                bounceRate: 0
            },
            daily: {},
            settings: {
                installed: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            }
        };
    }

    saveAnalyticsData() {
        try {
            // Convertir Sets a arrays para serialización
            const dataToSave = JSON.parse(JSON.stringify(this.analyticsData, (key, value) => {
                if (value instanceof Set) {
                    return Array.from(value);
                }
                return value;
            }));

            dataToSave.settings.lastUpdated = new Date().toISOString();
            localStorage.setItem(this.config.storageKey, JSON.stringify(dataToSave));
            
        } catch (error) {
            console.error('❌ Error guardando analytics:', error);
        }
    }

    saveSessionData() {
        // Implementar si se necesita guardar datos de sesión completos
    }

    // ===== UI Y VISUALIZACIÓN =====
    updateStatsUI() {
        // Actualizar estadísticas en el dashboard
        const today = new Date().toDateString();
        const todayData = this.analyticsData.daily[today] || { visits: 0, uniqueVisitors: new Set() };

        // Elementos del DOM
        const elements = {
            todayVisits: document.getElementById('today-visits'),
            totalContacts: document.getElementById('total-contacts'),
            totalOffers: document.getElementById('total-offers'),
            activeUsers: document.getElementById('active-users'),
            bounceRate: document.getElementById('bounce-rate')
        };

        // Actualizar valores
        if (elements.todayVisits) {
            elements.todayVisits.textContent = todayData.visits.toLocaleString();
        }

        if (elements.activeUsers) {
            elements.activeUsers.textContent = todayData.uniqueVisitors.size.toLocaleString();
        }

        if (elements.totalContacts) {
            elements.totalContacts.textContent = this.analyticsData.total.conversions.toLocaleString();
        }
    }

    updateRealTimeUI() {
        const realTimeSection = document.getElementById('analytics-section');
        if (!realTimeSection || !realTimeSection.classList.contains('active')) return;

        // Actualizar contadores en tiempo real
        const realTimeElements = {
            activeUsers: document.getElementById('realtime-active-users'),
            currentVisits: document.getElementById('realtime-current-visits'),
            liveFeed: document.getElementById('realtime-feed')
        };

        if (realTimeElements.activeUsers) {
            realTimeElements.activeUsers.textContent = this.state.realTimeData.activeUsers;
        }

        if (realTimeElements.currentVisits) {
            realTimeElements.currentVisits.textContent = this.state.realTimeData.currentVisits;
        }

        if (realTimeElements.liveFeed) {
            realTimeElements.liveFeed.innerHTML = this.state.realTimeData.liveFeed
                .slice(0, 10)
                .map(event => `
                    <div class="live-event">
                        <span class="event-time">${event.timestamp}</span>
                        <span class="event-type">${event.eventType}</span>
                        <span class="event-page">${event.page}</span>
                    </div>
                `)
                .join('');
        }
    }

    renderCharts() {
        // Implementar gráficos con Chart.js si está disponible
        if (typeof Chart !== 'undefined') {
            this.renderVisitsChart();
            this.renderLocationsChart();
            this.renderDevicesChart();
        }
    }

    renderVisitsChart() {
        const ctx = document.getElementById('visits-chart');
        if (!ctx) return;

        const last7Days = this.getLastNDays(7);
        const data = last7Days.map(day => this.analyticsData.daily[day]?.visits || 0);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: last7Days.map(day => new Date(day).toLocaleDateString()),
                datasets: [{
                    label: 'Visitas últimos 7 días',
                    data: data,
                    borderColor: '#0A84FF',
                    backgroundColor: 'rgba(10, 132, 255, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // ===== UTILIDADES =====
    getLastNDays(n) {
        const days = [];
        for (let i = n - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toDateString());
        }
        return days;
    }

    setupEventListeners() {
        // Event listeners para tracking automático
        window.addEventListener('beforeunload', () => this.endSession());
        
        // Track clicks en elementos importantes
        document.querySelectorAll('a, button, .btn').forEach(element => {
            this.trackClick(element, 'engagement');
        });

        // Track form submissions
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', () => {
                this.trackVisit('form_submit', {
                    formId: form.id,
                    formAction: form.action
                });
            });
        });

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollDepth = (window.scrollY / document.body.scrollHeight) * 100;
            if (scrollDepth > maxScroll) {
                maxScroll = scrollDepth;
                this.trackVisit('scroll', { depth: Math.round(maxScroll) });
            }
        });
    }

    startRealTimeMonitoring() {
        // Simular datos en tiempo real para demo
        setInterval(() => {
            if (Math.random() > 0.7) {
                this.state.realTimeData.activeUsers += Math.random() > 0.5 ? 1 : -1;
                this.state.realTimeData.currentVisits += 1;
                
                this.state.realTimeData.liveFeed.unshift({
                    eventType: ['pageview', 'click', 'scroll'][Math.floor(Math.random() * 3)],
                    page: ['/', '/about', '/contact'][Math.floor(Math.random() * 3)],
                    timestamp: new Date().toLocaleTimeString()
                });

                if (this.state.realTimeData.liveFeed.length > 50) {
                    this.state.realTimeData.liveFeed.pop();
                }

                this.updateRealTimeUI();
            }
        }, 5000);
    }

    showNotification(message) {
        // Mostrar notificación en el panel
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `
            <i class="bi bi-bell"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // ===== API PÚBLICA =====
    trackEvent(eventName, data = {}) {
        this.trackVisit(eventName, data);
    }

    getStats() {
        return {
            totalVisits: this.analyticsData.total.visits,
            uniqueVisitors: this.analyticsData.total.uniqueVisitors,
            todayVisits: this.analyticsData.daily[new Date().toDateString()]?.visits || 0,
            activeUsers: this.state.realTimeData.activeUsers
        };
    }

    exportData(format = 'json') {
        switch (format) {
            case 'json':
                return JSON.stringify(this.analyticsData, null, 2);
            case 'csv':
                return this.convertToCSV();
            default:
                return this.analyticsData;
        }
    }

    convertToCSV() {
        // Implementar conversión a CSV
        return 'CSV export functionality';
    }
}

// ===== INTEGRACIÓN CON EL SISTEMA PRINCIPAL =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar sistema de analytics
    window.analyticsSystem = new AnalyticsSystem();
    
    // Integrar con el sistema de ofertas
    if (window.offersSystem) {
        // Track cuando se crean ofertas
        const originalSave = window.offersSystem.saveOffers;
        window.offersSystem.saveOffers = function() {
            analyticsSystem.trackConversion({
                type: 'offer_created',
                offerId: this.currentOffer?.id || 'new'
            });
            return originalSave.apply(this, arguments);
        };
    }
    
    // Configurar analytics para la página principal
    if (window.location.pathname === '/') {
        // Track visitas a la página principal
        analyticsSystem.trackVisit('pageview');
        
        // Track clicks en botones de contacto
        document.querySelectorAll('[href*="contact"], [onclick*="contact"]').forEach(element => {
            analyticsSystem.trackClick(element, 'contact');
        });
    }
});

// ===== POLYFILLS Y COMPATIBILIDAD =====
if (!Set.prototype.toJSON) {
    Set.prototype.toJSON = function() {
        return Array.from(this);
    };
}

// ===== FUNCIONES GLOBALES =====
function trackConversion(eventData) {
    if (window.analyticsSystem) {
        window.analyticsSystem.trackConversion(eventData);
    }
}

function getAnalyticsStats() {
    return window.analyticsSystem ? window.analyticsSystem.getStats() : null;
}

// ===== INTEGRACIÓN CON PARTICLES =====
function initParticlesAnalytics() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#0A84FF" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#0A84FF",
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "grab" },
                    onclick: { enable: true, mode "push" },
                    resize: true
                }
            },
            retina_detect: true
        });
    }
}

// Inicializar particles cuando esté disponible
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticlesAnalytics);
} else {
    initParticlesAnalytics();
}
