// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeActivityFeed();
    initializeStats();
    initializeSettings();
});

/**
 * Initialize navigation between sections
 */
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.content-section');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Remove active class from all buttons and sections
            navButtons.forEach(btn => btn.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked button and corresponding section
            this.classList.add('active');
            document.getElementById(targetSection).classList.add('active');
        });
    });
}

/**
 * Initialize and populate activity feed
 */
function initializeActivityFeed() {
    const activityList = document.getElementById('activity-list');
    
    const activities = [
        {
            message: 'System scan completed successfully',
            time: '5 minutes ago'
        },
        {
            message: 'New security update installed',
            time: '1 hour ago'
        },
        {
            message: 'Firewall rules updated',
            time: '3 hours ago'
        },
        {
            message: 'User authentication successful',
            time: '5 hours ago'
        },
        {
            message: 'Backup completed',
            time: '8 hours ago'
        }
    ];

    activities.forEach(activity => {
        const activityItem = createActivityItem(activity.message, activity.time);
        activityList.appendChild(activityItem);
    });
}

/**
 * Create an activity item element
 */
function createActivityItem(message, time) {
    const item = document.createElement('div');
    item.className = 'activity-item';
    
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'activity-time';
    timeSpan.textContent = time;
    
    item.appendChild(messageSpan);
    item.appendChild(timeSpan);
    
    return item;
}

/**
 * Initialize stats with animations
 */
function initializeStats() {
    animateCounter('threats-count', 0, 0, 1000);
    animateCounter('systems-count', 0, 12, 1000);
    animateCounter('connections-count', 0, 48, 1000);
    animateCounter('scans-count', 0, 156, 1000);
    
    // Simulate real-time updates
    setInterval(() => {
        updateStatsRandomly();
    }, 5000);
}

/**
 * Animate a counter from start to end value
 */
function animateCounter(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

/**
 * Update stats with random increments to simulate real-time monitoring
 */
function updateStatsRandomly() {
    const connectionsElement = document.getElementById('connections-count');
    const scansElement = document.getElementById('scans-count');
    
    // Randomly update connections (±5)
    const currentConnections = parseInt(connectionsElement.textContent);
    const newConnections = currentConnections + Math.floor(Math.random() * 11) - 5;
    connectionsElement.textContent = Math.max(0, newConnections);
    
    // Randomly increment scans
    const currentScans = parseInt(scansElement.textContent);
    scansElement.textContent = currentScans + Math.floor(Math.random() * 3);
}

/**
 * Initialize settings functionality
 */
function initializeSettings() {
    const saveButton = document.querySelector('.btn-primary');
    
    saveButton.addEventListener('click', function() {
        const monitoringEnabled = document.querySelector('input[type="checkbox"]:nth-of-type(1)').checked;
        const threatDetection = document.querySelector('input[type="checkbox"]:nth-of-type(2)').checked;
        const emailNotifications = document.querySelector('input[type="checkbox"]:nth-of-type(3)').checked;
        const scanInterval = document.getElementById('scan-interval').value;
        
        // Create settings object
        const settings = {
            monitoring: monitoringEnabled,
            threatDetection: threatDetection,
            emailNotifications: emailNotifications,
            scanInterval: scanInterval
        };
        
        // Save to localStorage
        localStorage.setItem('cyberGuardSettings', JSON.stringify(settings));
        
        // Show confirmation
        showNotification('Settings saved successfully!');
    });
    
    // Load saved settings
    loadSettings();
}

/**
 * Load settings from localStorage
 */
function loadSettings() {
    const savedSettings = localStorage.getItem('cyberGuardSettings');
    
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        document.querySelector('input[type="checkbox"]:nth-of-type(1)').checked = settings.monitoring !== false;
        document.querySelector('input[type="checkbox"]:nth-of-type(2)').checked = settings.threatDetection !== false;
        document.querySelector('input[type="checkbox"]:nth-of-type(3)').checked = settings.emailNotifications || false;
        
        if (settings.scanInterval) {
            document.getElementById('scan-interval').value = settings.scanInterval;
        }
    }
}

/**
 * Show a notification message
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #00d4ff;
        color: #0f0c29;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add slide animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
