// ==========================================
// CYBER-GUARD NEXUS - AUTOMATED HACKING SIMULATOR
// Educational and Entertainment Purposes Only
// ==========================================

// Global State
const state = {
    isRunning: false,
    currentScenario: 0,
    stats: {
        packetsSent: 0,
        portsScanned: 0,
        accessAttempts: 0,
        successfulHacks: 0,
        totalAttempts: 0
    },
    traceActive: false
};

// DOM Elements
let consoleElement, currentCommandElement, statusText, threatText, timerDisplay;
let packetsSentElement, portsScannedElement, accessAttemptsElement, successRateElement;

// Three.js variables
let scene, camera, renderer, globe, particles;

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(arr) {
    return arr[randomInt(0, arr.length - 1)];
}

// ==========================================
// CONSOLE OUTPUT FUNCTIONS
// ==========================================

function logToConsole(message, className = 'system') {
    const line = document.createElement('div');
    line.className = className;
    line.textContent = message;
    consoleElement.appendChild(line);
    consoleElement.scrollTop = consoleElement.scrollHeight;
}

function clearConsole() {
    consoleElement.innerHTML = '';
}

async function typeCommand(command, delay = 50) {
    currentCommandElement.textContent = '';
    for (let char of command) {
        currentCommandElement.textContent += char;
        await sleep(delay);
    }
    await sleep(300);
    logToConsole(`root@nexus:~$ ${command}`, 'info');
    currentCommandElement.textContent = '';
}

// ==========================================
// VISUAL EFFECTS
// ==========================================

function init3DScene() {
    const container = document.getElementById('3d-container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x0a0a0a);
    container.appendChild(renderer.domElement);

    // Create globe
    const geometry = new THREE.SphereGeometry(1.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        color: 0x00FF00,
        wireframe: true
    });
    globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Create particles (data packets)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCnt = 1000;
    const posArray = new Float32Array(particlesCnt * 3);

    for (let i = 0; i < particlesCnt * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x0099ff
    });

    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    camera.position.z = 5;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        if (globe) {
            globe.rotation.y += 0.005;
            globe.rotation.x += 0.002;
        }
        
        if (particles) {
            particles.rotation.y += 0.001;
        }

        renderer.render(scene, camera);
    }
    animate();
}

function updateStats() {
    packetsSentElement.textContent = state.stats.packetsSent;
    portsScannedElement.textContent = state.stats.portsScanned;
    accessAttemptsElement.textContent = state.stats.accessAttempts;
    
    const successRate = state.stats.totalAttempts > 0
        ? Math.round((state.stats.successfulHacks / state.stats.totalAttempts) * 100)
        : 0;
    successRateElement.textContent = successRate + '%';
}

function showAlert(type, header, message, duration = 5000) {
    const alertContainer = document.getElementById('alert-container');
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    
    const alertHeader = document.createElement('div');
    alertHeader.className = 'alert-header';
    alertHeader.textContent = header;
    
    const alertMessage = document.createElement('div');
    alertMessage.className = 'alert-message';
    alertMessage.textContent = message;
    
    alert.appendChild(alertHeader);
    alert.appendChild(alertMessage);
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, duration);
    
    return alert;
}

async function showTraceAlert(seconds) {
    const alert = showAlert('error', '⚠️ TRACE INITIATED', 'Security trace detected! Disconnecting...', seconds * 1000);
    
    const timerElement = document.createElement('div');
    timerElement.className = 'alert-timer';
    alert.appendChild(timerElement);
    
    for (let i = seconds; i > 0; i--) {
        timerElement.textContent = `${i}s`;
        await sleep(1000);
    }
}

function updateStatus(status, threat = null) {
    statusText.textContent = status;
    if (threat !== null) {
        threatText.textContent = threat;
    }
}

// ==========================================
// ANIMATION SEQUENCES
// ==========================================

async function portScanAnimation() {
    logToConsole('Initiating port scan sequence...', 'system');
    await sleep(500);
    
    const ports = [21, 22, 23, 25, 53, 80, 110, 143, 443, 3306, 3389, 8080];
    
    for (let port of ports) {
        const status = Math.random() > 0.6 ? 'OPEN' : 'CLOSED';
        const className = status === 'OPEN' ? 'success' : 'error';
        logToConsole(`Port ${port}: ${status}`, className);
        state.stats.portsScanned++;
        updateStats();
        await sleep(randomInt(100, 300));
    }
    
    await sleep(500);
    logToConsole('Port scan complete. Found ' + ports.filter(() => Math.random() > 0.6).length + ' open ports.', 'success');
}

async function bruteForceAnimation() {
    logToConsole('Initiating brute force attack...', 'system');
    await sleep(500);
    
    const attempts = randomInt(15, 25);
    for (let i = 0; i < attempts; i++) {
        const password = generateRandomPassword();
        logToConsole(`Attempting: ${password}`, 'warning');
        state.stats.packetsSent += 10;
        state.stats.accessAttempts++;
        updateStats();
        await sleep(randomInt(150, 400));
    }
}

async function tracingAnimation() {
    logToConsole('Tracing target IP address...', 'trace');
    await sleep(500);
    
    const hops = randomInt(8, 15);
    for (let i = 1; i <= hops; i++) {
        const ip = `${randomInt(1, 255)}.${randomInt(1, 255)}.${randomInt(1, 255)}.${randomInt(1, 255)}`;
        const latency = randomInt(10, 150);
        logToConsole(`Hop ${i}: ${ip} (${latency}ms)`, 'info');
        await sleep(randomInt(200, 500));
    }
    
    await sleep(300);
    logToConsole('Target location: ' + randomChoice(['New York', 'London', 'Tokyo', 'Moscow', 'Berlin', 'Shanghai']), 'success');
}

function generateRandomPassword() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < randomInt(6, 12); i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// ==========================================
// HACKING SCENARIOS
// ==========================================

const scenarios = [
    {
        name: 'Corporate Network Breach',
        difficulty: 'MEDIUM',
        async execute() {
            await typeCommand('nmap -sV 192.168.1.0/24');
            await portScanAnimation();
            
            await sleep(1000);
            await typeCommand('hydra -l admin -P wordlist.txt ssh://192.168.1.50');
            await bruteForceAnimation();
            
            await sleep(800);
            logToConsole('Password found: admin123!', 'success');
            state.stats.successfulHacks++;
            state.stats.totalAttempts++;
            updateStats();
            
            await sleep(500);
            await typeCommand('ssh admin@192.168.1.50');
            await sleep(1000);
            logToConsole('Connection established.', 'success');
            logToConsole('Welcome to CorporateServer v2.1', 'info');
            
            await sleep(800);
            await typeCommand('cat /etc/shadow');
            await sleep(500);
            logToConsole('root:$6$xyz...:18234:0:99999:7:::', 'system');
            logToConsole('admin:$6$abc...:18234:0:99999:7:::', 'system');
            
            await sleep(1000);
            showAlert('success', '✓ ACCESS GRANTED', 'Corporate network compromised successfully!');
            updateStatus('CONNECTED', 'MODERATE');
        }
    },
    {
        name: 'Database Server Infiltration',
        difficulty: 'HIGH',
        async execute() {
            await typeCommand('nmap -p 3306 --script mysql-enum 10.0.0.5');
            await sleep(1000);
            logToConsole('MySQL 5.7.32 detected on port 3306', 'info');
            logToConsole('Server version: 5.7.32-0ubuntu0.18.04.1', 'system');
            
            await sleep(1000);
            await typeCommand('sqlmap -u "http://10.0.0.5/login.php" --dbs');
            await sleep(1500);
            logToConsole('Testing SQL injection vulnerability...', 'warning');
            
            for (let i = 0; i < 5; i++) {
                logToConsole(`Payload ${i + 1}: Testing OR-based injection`, 'system');
                state.stats.packetsSent += 5;
                updateStats();
                await sleep(randomInt(300, 600));
            }
            
            await sleep(500);
            logToConsole('Vulnerability found! Extracting databases...', 'success');
            await sleep(800);
            logToConsole('[+] customers', 'success');
            logToConsole('[+] employees', 'success');
            logToConsole('[+] financial_records', 'success');
            
            state.stats.successfulHacks++;
            state.stats.totalAttempts++;
            updateStats();
            
            // Trace detection
            await sleep(2000);
            logToConsole('!!! INTRUSION DETECTION SYSTEM ACTIVATED !!!', 'error');
            state.traceActive = true;
            updateStatus('DETECTED', 'HIGH');
            showTraceAlert(10);
            
            await sleep(5000);
            await typeCommand('exit');
            logToConsole('Connection terminated.', 'warning');
            state.traceActive = false;
            updateStatus('DISCONNECTED', 'LOW');
        }
    },
    {
        name: 'Wireless Network Penetration',
        difficulty: 'LOW',
        async execute() {
            await typeCommand('airmon-ng start wlan0');
            await sleep(800);
            logToConsole('Interface wlan0mon created', 'success');
            
            await sleep(600);
            await typeCommand('airodump-ng wlan0mon');
            await sleep(1000);
            logToConsole('Scanning for wireless networks...', 'system');
            
            await sleep(1500);
            logToConsole('BSSID              PWR  CH  ESSID', 'info');
            logToConsole('00:11:22:33:44:55  -45   6  CoffeeShop_WiFi', 'system');
            logToConsole('AA:BB:CC:DD:EE:FF  -62  11  HomeNetwork_5G', 'system');
            logToConsole('11:22:33:44:55:66  -38   1  CORP_SECURE', 'system');
            
            await sleep(1000);
            await typeCommand('aircrack-ng -w wordlist.txt capture.cap');
            await sleep(1000);
            logToConsole('Attempting to crack WPA2 handshake...', 'warning');
            
            for (let i = 0; i < 8; i++) {
                logToConsole(`Keys tested: ${(i + 1) * 10000}/80000`, 'system');
                state.stats.accessAttempts++;
                updateStats();
                await sleep(randomInt(400, 700));
            }
            
            await sleep(500);
            logToConsole('KEY FOUND: Welcome2023!', 'success');
            state.stats.successfulHacks++;
            state.stats.totalAttempts++;
            updateStats();
            
            await sleep(800);
            showAlert('success', '✓ NETWORK CRACKED', 'Wireless access credentials obtained!');
            updateStatus('AUTHENTICATED', 'LOW');
        }
    },
    {
        name: 'Advanced Persistent Threat Deployment',
        difficulty: 'EXPERT',
        async execute() {
            await typeCommand('msfconsole');
            await sleep(1500);
            logToConsole('Metasploit Framework v6.2.0', 'info');
            logToConsole('=[ metasploit v6.2.0-dev                          ]', 'system');
            
            await sleep(800);
            await typeCommand('use exploit/windows/smb/ms17_010_eternalblue');
            await sleep(500);
            logToConsole('Module loaded: EternalBlue SMB Remote Windows Kernel Pool Corruption', 'success');
            
            await sleep(600);
            await typeCommand('set RHOSTS 172.16.0.50');
            logToConsole('RHOSTS => 172.16.0.50', 'system');
            
            await sleep(400);
            await typeCommand('set PAYLOAD windows/x64/meterpreter/reverse_tcp');
            logToConsole('PAYLOAD => windows/x64/meterpreter/reverse_tcp', 'system');
            
            await sleep(600);
            await typeCommand('exploit');
            await sleep(1000);
            logToConsole('[*] Started reverse TCP handler on 10.0.0.1:4444', 'info');
            logToConsole('[*] Connecting to target for exploitation...', 'warning');
            
            await sleep(2000);
            await tracingAnimation();
            
            await sleep(1000);
            logToConsole('[+] Exploit completed successfully!', 'success');
            logToConsole('[*] Sending stage (200262 bytes)...', 'system');
            
            await sleep(1500);
            logToConsole('[*] Meterpreter session 1 opened', 'success');
            state.stats.successfulHacks++;
            state.stats.totalAttempts++;
            updateStats();
            
            await sleep(800);
            await typeCommand('sysinfo');
            await sleep(500);
            logToConsole('Computer        : WIN-SERVER2019', 'system');
            logToConsole('OS              : Windows Server 2019', 'system');
            logToConsole('Architecture    : x64', 'system');
            logToConsole('System Language : en_US', 'system');
            
            await sleep(1000);
            showAlert('success', '✓ SYSTEM COMPROMISED', 'Full remote access established!');
            updateStatus('ROOT ACCESS', 'CRITICAL');
        }
    }
];

// ==========================================
// MAIN SIMULATION LOOP
// ==========================================

async function runSimulation() {
    if (state.isRunning) return;
    
    state.isRunning = true;
    clearConsole();
    
    logToConsole('╔═══════════════════════════════════════════════════════╗', 'success');
    logToConsole('║  CYBER-GUARD NEXUS - TACTICAL HACKING SIMULATOR      ║', 'success');
    logToConsole('║  Version 2.0 - Educational Purposes Only             ║', 'success');
    logToConsole('╚═══════════════════════════════════════════════════════╝', 'success');
    logToConsole('', 'system');
    
    await sleep(1000);
    logToConsole('Initializing secure connection...', 'info');
    await sleep(800);
    logToConsole('[OK] Encryption layer activated', 'success');
    await sleep(500);
    logToConsole('[OK] Anonymizer proxy connected', 'success');
    await sleep(500);
    logToConsole('[OK] Firewall bypass enabled', 'success');
    await sleep(1000);
    
    logToConsole('', 'system');
    logToConsole('System ready. Commencing automated penetration testing...', 'info');
    await sleep(1500);
    
    // Run all scenarios in sequence
    for (let i = 0; i < scenarios.length; i++) {
        const scenario = scenarios[i];
        
        logToConsole('', 'system');
        logToConsole('═'.repeat(60), 'info');
        logToConsole(`SCENARIO ${i + 1}: ${scenario.name}`, 'info');
        logToConsole(`DIFFICULTY: ${scenario.difficulty}`, 'warning');
        logToConsole('═'.repeat(60), 'info');
        logToConsole('', 'system');
        
        await sleep(1000);
        await scenario.execute();
        
        await sleep(3000);
    }
    
    // Final summary
    await sleep(2000);
    logToConsole('', 'system');
    logToConsole('═'.repeat(60), 'success');
    logToConsole('SIMULATION COMPLETE', 'success');
    logToConsole('═'.repeat(60), 'success');
    logToConsole('', 'system');
    logToConsole(`Total Scenarios: ${scenarios.length}`, 'info');
    logToConsole(`Successful Breaches: ${state.stats.successfulHacks}`, 'success');
    logToConsole(`Total Packets Sent: ${state.stats.packetsSent}`, 'info');
    logToConsole(`Ports Scanned: ${state.stats.portsScanned}`, 'info');
    logToConsole('', 'system');
    logToConsole('All operations completed. This was a simulation.', 'warning');
    logToConsole('Remember: Unauthorized access to systems is illegal.', 'error');
    
    updateStatus('SIMULATION ENDED', 'NONE');
    state.isRunning = false;
    
    // Restart after delay
    await sleep(10000);
    runSimulation();
}

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    consoleElement = document.getElementById('console');
    currentCommandElement = document.getElementById('current-command');
    statusText = document.querySelector('.status-text');
    threatText = document.querySelector('.threat-text');
    timerDisplay = document.getElementById('timer-display');
    
    packetsSentElement = document.getElementById('packets-sent');
    portsScannedElement = document.getElementById('ports-scanned');
    accessAttemptsElement = document.getElementById('access-attempts');
    successRateElement = document.getElementById('success-rate');
    
    // Disclaimer acceptance
    const disclaimerButton = document.getElementById('accept-disclaimer');
    const disclaimer = document.getElementById('disclaimer');
    const simulator = document.getElementById('simulator');
    
    disclaimerButton.addEventListener('click', () => {
        disclaimer.style.display = 'none';
        simulator.style.display = 'flex';
        
        // Initialize 3D scene
        init3DScene();
        
        // Start simulation after a short delay
        setTimeout(() => {
            runSimulation();
        }, 1000);
    });
});