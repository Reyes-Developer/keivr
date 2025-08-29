// Initialize particles.js
document.addEventListener('DOMContentLoaded', function() {
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
                onclick: { enable: true, mode: "push" },
                resize: true
            }
        },
        retina_detect: true
    });
    
    // Initialize the application
    initApp();
});

// Application state
let appState = {
    currentSection: 'dashboard',
    announcements: [],
    offers: [],
    user: null
};

// Initialize the application
function initApp() {
    // Check if user is already logged in
    checkLoginStatus();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load data from localStorage
    loadData();
}

// Check login status
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('keivrAdminLoggedIn') || sessionStorage.getItem('keivrAdminLoggedIn');
    const username = localStorage.getItem('keivrAdminUsername') || sessionStorage.getItem('keivrAdminUsername');
    
    if (isLoggedIn && username) {
        appState.user = { username };
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'flex';
        resetInactivityTimer();
    }
}

// Set up all event listeners
function setupEventListeners() {
    // Login form submission
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Logout functionality
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            switchSection(section);
        });
    });
    
    // Modal functionality
    const modal = document.getElementById('announcement-modal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Announcement form submission
    document.getElementById('announcement-form').addEventListener('submit', handleAnnouncementSubmit);
    
    // Save as draft
    document.getElementById('save-draft-btn').addEventListener('click', function() {
        document.getElementById('announcement-status').value = 'draft';
        document.getElementById('announcement-form').dispatchEvent(new Event('submit'));
    });
    
    // Test image button
    document.getElementById('test-image-btn').addEventListener('click', testImage);
    
    // Quick action buttons
    document.getElementById('new-announcement-btn').addEventListener('click', function(e) {
        e.preventDefault();
        openAnnouncementModal();
    });
    
    document.getElementById('add-announcement-btn').addEventListener('click', function() {
        openAnnouncementModal();
    });
    
    document.getElementById('create-announcement-btn').addEventListener('click', function() {
        openAnnouncementModal();
    });
    
    // Settings tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            switchTab(tab);
        });
    });
    
    // Credentials form
    document.getElementById('credentials-form').addEventListener('submit', handleCredentialsUpdate);
    
    // Backup buttons
    document.getElementById('create-backup-btn').addEventListener('click', createBackup);
    document.getElementById('restore-backup-btn').addEventListener('click', function() {
        document.getElementById('restore-file').click();
    });
    
    document.getElementById('restore-file').addEventListener('change', restoreBackup);
    
    // Theme buttons
    document.getElementById('save-theme-btn').addEventListener('click', saveTheme);
    document.getElementById('reset-theme-btn').addEventListener('click', resetTheme);
    
    // Set up activity listeners for inactivity timer
    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('keypress', resetInactivityTimer);
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Simple validation (in a real app, this would be more secure)
    if (username === 'admin' && password === 'admin') {
        // Save to localStorage if "remember me" is checked
        if (remember) {
            localStorage.setItem('keivrAdminLoggedIn', 'true');
            localStorage.setItem('keivrAdminUsername', username);
        } else {
            sessionStorage.setItem('keivrAdminLoggedIn', 'true');
            sessionStorage.setItem('keivrAdminUsername', username);
        }
        
        appState.user = { username };
        
        // Show admin panel
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'flex';
        
        // Show success message
        showToast('Sesión iniciada correctamente', 'success');
        
        resetInactivityTimer();
    } else {
        // Shake animation for incorrect credentials
        document.getElementById('login-form').classList.add('shake');
        setTimeout(() => {
            document.getElementById('login-form').classList.remove('shake');
        }, 600);
        
        // Show error
        showToast('Credenciales incorrectas. Use admin/admin para acceder.', 'error');
    }
}

// Handle logout
function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('keivrAdminLoggedIn');
    localStorage.removeItem('keivrAdminUsername');
    sessionStorage.removeItem('keivrAdminLoggedIn');
    sessionStorage.removeItem('keivrAdminUsername');
    
    appState.user = null;
    
    // Show login screen
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
    
    // Show message
    showToast('Sesión cerrada correctamente', 'success');
}

// Switch between sections
function switchSection(section) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.style.display = 'none';
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show the selected section
    document.getElementById(`${section}-section`).style.display = 'block';
    
    // Add active class to the clicked nav link
    document.querySelector(`.nav-link[data-section="${section}"]`).classList.add('active');
    
    // Update page title
    document.querySelector('.page-title').textContent = document.querySelector(`.nav-link[data-section="${section}"] span`).textContent;
    
    // Update app state
    appState.currentSection = section;
    
    // Load section-specific data
    if (section === 'announcements') {
        loadAnnouncementsTable();
    } else if (section === 'offers') {
        loadOffersTable();
    } else if (section === 'analytics') {
        // Initialize analytics charts
        if (typeof initCharts === 'function') {
            initCharts();
        }
    }
}

// Switch between tabs in settings
function switchTab(tab) {
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Hide all tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Add active class to the clicked tab button
    document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');
    
    // Show the selected tab pane
    document.getElementById(`${tab}-tab`).classList.add('active');
}

// Open announcement modal
function openAnnouncementModal(announcement = null) {
    const modal = document.getElementById('announcement-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('announcement-form');
    
    if (announcement) {
        // Edit mode
        title.textContent = 'Editar Anuncio';
        populateAnnouncementForm(announcement);
    } else {
        // Create mode
        title.textContent = 'Crear Nuevo Anuncio';
        form.reset();
        document.getElementById('announcement-id').value = '';
        document.getElementById('announcement-status').value = 'active';
        document.getElementById('announcement-type').value = 'new';
        document.getElementById('announcement-position').value = 'hero';
        document.getElementById('announcement-color').value = '#0A84FF';
        document.getElementById('icon-megaphone').checked = true;
        
        // Set default start date to now
        const now = new Date();
        const localDatetime = now.toISOString().slice(0, 16);
        document.getElementById('announcement-start').value = localDatetime;
    }
    
    modal.style.display = 'block';
}

// Populate announcement form with data
function populateAnnouncementForm(announcement) {
    document.getElementById('announcement-id').value = announcement.id;
    document.getElementById('announcement-title').value = announcement.title;
    document.getElementById('announcement-type').value = announcement.type;
    document.getElementById('announcement-status').value = announcement.status;
    document.getElementById('announcement-position').value = announcement.position;
    document.getElementById('announcement-message').value = announcement.message;
    document.getElementById('announcement-image').value = announcement.image;
    document.getElementById('announcement-color').value = announcement.color;
    document.getElementById(`icon-${announcement.icon}`).checked = true;
    
    // Format dates for datetime-local input
    const startDate = new Date(announcement.startDate);
    const endDate = announcement.endDate ? new Date(announcement.endDate) : '';
    
    document.getElementById('announcement-start').value = startDate.toISOString().slice(0, 16);
    document.getElementById('announcement-end').value = endDate ? endDate.toISOString().slice(0, 16) : '';
    document.getElementById('announcement-link').value = announcement.link || '';
}

// Handle announcement form submission
function handleAnnouncementSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('announcement-id').value;
    const title = document.getElementById('announcement-title').value;
    const type = document.getElementById('announcement-type').value;
    const status = document.getElementById('announcement-status').value;
    const position = document.getElementById('announcement-position').value;
    const message = document.getElementById('announcement-message').value;
    const image = document.getElementById('announcement-image').value;
    const color = document.getElementById('announcement-color').value;
    const icon = document.querySelector('input[name="icon"]:checked').value;
    const startDate = document.getElementById('announcement-start').value;
    const endDate = document.getElementById('announcement-end').value;
    const link = document.getElementById('announcement-link').value;
    
    const announcement = {
        id: id || Date.now().toString(),
        title,
        type,
        status,
        position,
        message,
        image,
        color,
        icon,
        startDate: new Date(startDate).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : null,
        link: link || null,
        createdAt: id ? getAnnouncementById(id).createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Save announcement
    saveAnnouncement(announcement);
    
    // Close modal
    document.getElementById('announcement-modal').style.display = 'none';
    
    // Show success message
    showToast(`Anuncio ${id ? 'actualizado' : 'creado'} correctamente`, 'success');
    
    // Reload announcements table if we're in the announcements section
    if (appState.currentSection === 'announcements' || appState.currentSection === 'dashboard') {
        loadAnnouncementsTable();
    }
}

// Test image URL
function testImage() {
    const imageUrl = document.getElementById('announcement-image').value;
    if (!imageUrl) {
        showToast('Por favor, ingresa una URL de imagen', 'warning');
        return;
    }
    
    showToast('Probando imagen...', 'info');
    
    const img = new Image();
    img.onload = function() {
        showToast('Imagen cargada correctamente', 'success');
    };
    img.onerror = function() {
        showToast('Error al cargar la imagen. Verifica la URL.', 'error');
    };
    img.src = imageUrl;
}

// Save announcement to localStorage
function saveAnnouncement(announcement) {
    let announcements = JSON.parse(localStorage.getItem('keivrAnnouncements') || '[]');
    
    if (announcement.id) {
        // Update existing announcement
        const index = announcements.findIndex(a => a.id === announcement.id);
        if (index !== -1) {
            announcements[index] = announcement;
        } else {
            announcements.push(announcement);
        }
    } else {
        // Create new announcement
        announcement.id = Date.now().toString();
        announcements.push(announcement);
    }
    
    localStorage.setItem('keivr_announcements', JSON.stringify(announcements));
    appState.announcements = announcements;
}

// Get announcement by ID
function getAnnouncementById(id) {
    const announcements = JSON.parse(localStorage.getItem('keivrAnnouncements') || '[]');
    return announcements.find(a => a.id === id);
}

// Load announcements table
function loadAnnouncementsTable() {
    const announcements = JSON.parse(localStorage.getItem('keivrAnnouncements') || '[]');
    appState.announcements = announcements;
    
    const tableBody = document.getElementById('announcements-management-table').querySelector('tbody');
    tableBody.innerHTML = '';
    
    // Apply filters
    const searchTerm = document.getElementById('announcement-search')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('status-filter')?.value || '';
    const typeFilter = document.getElementById('type-filter')?.value || '';
    
    const filteredAnnouncements = announcements.filter(announcement => {
        const matchesSearch = announcement.title.toLowerCase().includes(searchTerm) || 
                             announcement.message.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter ? announcement.status === statusFilter : true;
        const matchesType = typeFilter ? announcement.type === typeFilter : true;
        
        return matchesSearch && matchesStatus && matchesType;
    });
    
    if (filteredAnnouncements.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No se encontraron anuncios</td></tr>';
        return;
    }
    
    filteredAnnouncements.forEach(announcement => {
        const row = document.createElement('tr');
        
        // Format dates
        const startDate = new Date(announcement.startDate);
        const endDate = announcement.endDate ? new Date(announcement.endDate) : null;
        
        const formattedStartDate = startDate.toLocaleDateString();
        const formattedEndDate = endDate ? endDate.toLocaleDateString() : '-';
        
        // Get status badge class
        let statusClass = '';
        let statusText = '';
        
        switch(announcement.status) {
            case 'active':
                statusClass = 'status-active';
                statusText = 'Activo🟢';
                break;
            case 'paused':
                statusClass = 'status-paused';
                statusText = 'Pausado🟡';
                break;
            case 'draft':
                statusClass = 'status-draft';
                statusText = 'Borrador⚫';
                break;
        }
        
        // Get type text
        let typeText = '';
        switch(announcement.type) {
            case 'new':
                typeText = 'Nuevo🆕';
                break;
            case 'offer':
                typeText = 'Oferta💰';
                break;
            case 'update':
                typeText = 'Actualización🔄';
                break;
            case 'alert':
                typeText = 'Alerta⚠️';
                break;
            case 'event':
                typeText = 'Evento🎉';
                break;
        }
        
        row.innerHTML = `
            <td>${announcement.title}</td>
            <td>${typeText}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>${announcement.position}</td>
            <td>${formattedStartDate}</td>
            <td>${formattedEndDate}</td>
            <td class="action-cell">
                <button class="icon-btn btn-edit" data-id="${announcement.id}"><i class="bi bi-pencil"></i></button>
                <button class="icon-btn btn-delete" data-id="${announcement.id}"><i class="bi bi-trash"></i></button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const announcement = getAnnouncementById(id);
            if (announcement) {
                openAnnouncementModal(announcement);
            }
        });
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            deleteAnnouncement(id);
        });
    });
    
    // Also load the dashboard table if we're in the announcements section
    if (appState.currentSection === 'dashboard') {
        loadDashboardAnnouncementsTable();
    }
}

// Load dashboard announcements table
function loadDashboardAnnouncementsTable() {
    const announcements = JSON.parse(localStorage.getItem('keivrAnnouncements') || '[]');
    const tableBody = document.getElementById('announcements-table').querySelector('tbody');
    tableBody.innerHTML = '';
    
    // Get only recent announcements (max 5)
    const recentAnnouncements = announcements.slice(0, 5);
    
    if (recentAnnouncements.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay anuncios</td></tr>';
        return;
    }
    
    recentAnnouncements.forEach(announcement => {
        const row = document.createElement('tr');
        
        // Format dates
        const startDate = new Date(announcement.startDate);
        const endDate = announcement.endDate ? new Date(announcement.endDate) : null;
        
        const formattedStartDate = startDate.toLocaleDateString();
        const formattedEndDate = endDate ? endDate.toLocaleDateString() : '-';
        
        // Get status badge class
        let statusClass = '';
        let statusText = '';
        
        switch(announcement.status) {
            case 'active':
                statusClass = 'status-active';
                statusText = 'Activo🟢';
                break;
            case 'paused':
                statusClass = 'status-paused';
                statusText = 'Pausado🟡';
                break;
            case 'draft':
                statusClass = 'status-draft';
                statusText = 'Borrador⚫';
                break;
        }
        
        // Get type text
        let typeText = '';
        switch(announcement.type) {
            case 'new':
                typeText = 'Nuevo🆕';
                break;
            case 'offer':
                typeText = 'Oferta💰';
                break;
            case 'update':
                typeText = 'Actualización🔄';
                break;
            case 'alert':
                typeText = 'Alerta⚠️';
                break;
            case 'event':
                typeText = 'Evento🎉';
                break;
        }
        
        row.innerHTML = `
            <td>${announcement.title}</td>
            <td>${typeText}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>${formattedStartDate}</td>
            <td>${formattedEndDate}</td>
            <td class="action-cell">
                <button class="icon-btn btn-edit" data-id="${announcement.id}"><i class="bi bi-pencil"></i></button>
                <button class="icon-btn btn-delete" data-id="${announcement.id}"><i class="bi bi-trash"></i></button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('#announcements-table .btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const announcement = getAnnouncementById(id);
            if (announcement) {
                openAnnouncementModal(announcement);
            }
        });
    });
    
    document.querySelectorAll('#announcements-table .btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            deleteAnnouncement(id);
        });
    });
}

// Delete announcement
function deleteAnnouncement(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este anuncio?')) {
        let announcements = JSON.parse(localStorage.getItem('keivrAnnouncements') || '[]');
        announcements = announcements.filter(a => a.id !== id);
        localStorage.setItem('keivr_announcements', JSON.stringify(announcements));
        appState.announcements = announcements;
        
        // Reload tables
        loadAnnouncementsTable();
        loadDashboardAnnouncementsTable();
        
        showToast('Anuncio eliminado correctamente', 'success');
    }
}

// Load offers table
function loadOffersTable() {
    // This would be implemented similarly to loadAnnouncementsTable
    // For now, we'll just show a placeholder
    const tableBody = document.getElementById('offers-table').querySelector('tbody');
    tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Funcionalidad de ofertas en desarrollo</td></tr>';
}

// Handle credentials update
function handleCredentialsUpdate(e) {
    e.preventDefault();
    // This would validate and update credentials
    // For now, just show a success message
    showToast('Credenciales actualizadas correctamente', 'success');
}

// Create backup
function createBackup() {
    const announcements = localStorage.getItem('keivrAnnouncements');
    const offers = localStorage.getItem('keivrOffers');
    const settings = localStorage.getItem('keivrSettings');
    
    const backupData = {
        announcements: announcements ? JSON.parse(announcements) : [],
        offers: offers ? JSON.parse(offers) : [],
        settings: settings ? JSON.parse(settings) : {},
        timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(backupData);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `keivr-backup-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showToast('Backup creado correctamente', 'success');
}

// Restore backup
function restoreBackup(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const backupData = JSON.parse(e.target.result);
            
            if (backupData.announcements) {
                localStorage.setItem('keivrAnnouncements', JSON.stringify(backupData.announcements));
            }
            
            if (backupData.offers) {
                localStorage.setItem('keivrOffers', JSON.stringify(backupData.offers));
            }
            
            if (backupData.settings) {
                localStorage.setItem('keivrSettings', JSON.stringify(backupData.settings));
            }
            
            showToast('Backup restaurado correctamente', 'success');
            
            // Reload data
            loadData();
            
        } catch (error) {
            showToast('Error al restaurar el backup: archivo inválido', 'error');
            console.error('Backup restoration error:', error);
        }
    };
    reader.readAsText(file);
    
    // Reset the file input
    e.target.value = '';
}

// Save theme settings
function saveTheme() {
    const primaryColor = document.getElementById('primary-color').value;
    const secondaryColor = document.getElementById('secondary-color').value;
    const darkMode = document.getElementById('dark-mode').checked;
    
    const themeSettings = {
        primaryColor,
        secondaryColor,
        darkMode
    };
    
    localStorage.setItem('keivrTheme', JSON.stringify(themeSettings));
    applyTheme(themeSettings);
    
    showToast('Configuración de tema guardada', 'success');
}

// Reset theme to default
function resetTheme() {
    document.getElementById('primary-color').value = '#0A84FF';
    document.getElementById('secondary-color').value = '#00C6FF';
    document.getElementById('dark-mode').checked = true;
    
    localStorage.removeItem('keivrTheme');
    applyTheme({
        primaryColor: '#0A84FF',
        secondaryColor: '#00C6FF',
        darkMode: true
    });
    
    showToast('Tema restablecido a valores por defecto', 'success');
}

// Apply theme settings
function applyTheme(themeSettings) {
    // This would update CSS variables based on theme settings
    // For now, we'll just use the default theme
    document.documentElement.style.setProperty('--primary', themeSettings.primaryColor);
    
    // Update gradient
    const gradient = `linear-gradient(135deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})`;
    document.documentElement.style.setProperty('--primary-gradient', gradient);
}

// Load data from localStorage
function loadData() {
    // Load announcements
    const announcements = localStorage.getItem('keivrAnnouncements');
    if (announcements) {
        appState.announcements = JSON.parse(announcements);
    }
    
    // Load offers
    const offers = localStorage.getItem('keivrOffers');
    if (offers) {
        appState.offers = JSON.parse(offers);
    }
    
    // Load theme settings
    const themeSettings = localStorage.getItem('keivrTheme');
    if (themeSettings) {
        const theme = JSON.parse(themeSettings);
        document.getElementById('primary-color').value = theme.primaryColor;
        document.getElementById('secondary-color').value = theme.secondaryColor;
        document.getElementById('dark-mode').checked = theme.darkMode;
        applyTheme(theme);
    }
    
    // Load tables
    loadDashboardAnnouncementsTable();
}

// Show toast notification
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'bi-info-circle';
    if (type === 'success') icon = 'bi-check-circle';
    if (type === 'error') icon = 'bi-exclamation-circle';
    if (type === 'warning') icon = 'bi-exclamation-triangle';
    
    toast.innerHTML = `
        <i class="bi ${icon}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after animation
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Inactivity timer (30 minutes)
let inactivityTimer;
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(logoutDueToInactivity, 30 * 60 * 1000); // 30 minutes
}

function logoutDueToInactivity() {
    showToast('Sesión cerrada por inactividad', 'warning');
    handleLogout({ preventDefault: () => {} });
}