// Analytics functions for the admin panel

// Initialize analytics charts
function initCharts() {
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js is not loaded. Analytics charts will not be initialized.');
        return;
    }
    
    // Initialize visits chart
    initVisitsChart();
    
    // Initialize devices chart
    initDevicesChart();
    
    // Initialize browsers chart
    initBrowsersChart();
    
    // Initialize location chart
    initLocationChart();
}

// Initialize visits chart
function initVisitsChart() {
    const ctx = document.getElementById('visits-chart').getContext('2d');
    
    // Sample data - in a real application, this would come from your analytics API
    const data = {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
        datasets: [{
            label: 'Visitas',
            data: [120, 145, 132, 158, 140, 165, 190, 210, 195, 185, 175, 160, 178, 195, 210, 225, 215, 200, 190, 205, 220, 235, 245, 230, 215, 200, 225, 240, 255, 270],
            borderColor: '#0A84FF',
            backgroundColor: 'rgba(10, 132, 255, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };
    
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    };
    
    new Chart(ctx, config);
}

// Initialize devices chart
function initDevicesChart() {
    const ctx = document.getElementById('devices-chart').getContext('2d');
    
    const data = {
        labels: ['Móvil', 'Tablet', 'Escritorio'],
        datasets: [{
            data: [65, 15, 20],
            backgroundColor: [
                '#0A84FF',
                '#00C6FF',
                '#1a1f2e'
            ],
            borderWidth: 0
        }]
    };
    
    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    };
    
    new Chart(ctx, config);
}

// Initialize browsers chart
function initBrowsersChart() {
    const ctx = document.getElementById('browsers-chart').getContext('2d');
    
    const data = {
        labels: ['Chrome', 'Firefox', 'Safari', 'Edge', 'Otros'],
        datasets: [{
            label: 'Porcentaje',
            data: [45, 22, 18, 10, 5],
            backgroundColor: [
                '#0A84FF',
                '#00C6FF',
                '#1a1f2e',
                '#9aa4b2',
                '#e9f0f7'
            ],
            borderWidth: 0
        }]
    };
    
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    };
    
    new Chart(ctx, config);
}

// Initialize location chart
function initLocationChart() {
    const ctx = document.getElementById('location-chart').getContext('2d');
    
    const data = {
        labels: ['España', 'México', 'Colombia', 'Argentina', 'Chile', 'Perú', 'Otros'],
        datasets: [{
            label: 'Visitas',
            data: [35, 25, 15, 10, 8, 5, 2],
            backgroundColor: 'rgba(10, 132, 255, 0.5)',
            borderColor: '#0A84FF',
            borderWidth: 1
        }]
    };
    
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    };
    
    new Chart(ctx, config);
}

// Load analytics data based on selected range
function loadAnalyticsData(range) {
    // This function would fetch analytics data based on the selected time range
    // For now, we'll just reinitialize the charts
    initCharts();
}

// Event listener for analytics range change
document.addEventListener('DOMContentLoaded', function() {
    const analyticsRange = document.getElementById('analytics-range');
    if (analyticsRange) {
        analyticsRange.addEventListener('change', function() {
            loadAnalyticsData(this.value);
        });
    }
});

// Sample function to simulate updating analytics in real-time
function updateAnalyticsRealtime() {
    // This would connect to a real-time data source in a production environment
    // For now, we'll just simulate occasional updates
    setInterval(() => {
        // Randomly update charts occasionally
        if (Math.random() > 0.7) {
            initCharts();
        }
    }, 10000);
}

// Initialize real-time updates when the analytics section is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Start real-time updates
    updateAnalyticsRealtime();
});