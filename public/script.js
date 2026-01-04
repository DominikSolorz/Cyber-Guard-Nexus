// ========== CYBER GUARD NEXUS - HACKING SIMULATOR ==========
// Educational and Entertainment Purpose Only
// All activities are simulated and fictional

// ========== GLOBAL STATE ==========
const SimulatorState = {
    currentTarget: null,
    connectedServers: [],
    discoveredVulnerabilities: [],
    snifferActive: false,
    commandHistory: [],
    historyIndex: -1
};

// ========== UTILITY FUNCTIONS ==========
const Utils = {
    randomIP: () => {
        return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
    },
    
    randomPort: () => {
        const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 3306, 3389, 8080];
        return commonPorts[Math.floor(Math.random() * commonPorts.length)];
    },
    
    randomMAC: () => {
        const hexChars = '0123456789ABCDEF';
        return 'XX:XX:XX:XX:XX:XX'.replace(/X/g, () => {
            return hexChars.charAt(Math.floor(Math.random() * 16));
        });
    },
    
    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    
    typeWriter: async (element, text, speed = 30) => {
        for (let char of text) {
            element.textContent += char;
            element.parentElement.scrollTop = element.parentElement.scrollHeight;
            await Utils.sleep(speed);
        }
    },
    
    getTimeStamp: () => {
        const now = new Date();
        return `[${now.toLocaleTimeString()}]`;
    },
    
    formatTime: () => {
        const now = new Date();
        return now.toLocaleString();
    }
};

// ========== AI RESPONSE SYSTEM ==========
const AIResponses = {
    accessGranted: [
        'Access granted. Welcome, Administrator.',
        'Authentication successful. System access granted.',
        'Login accepted. Firewall bypassed.',
        'Credentials verified. Root access enabled.',
        'Handshake complete. Connection established.'
    ],
    
    accessDenied: [
        'Access denied. Invalid credentials.',
        'Authentication failed. Intrusion detected.',
        'Login rejected. Security protocol activated.',
        'Connection refused. Firewall active.',
        'Access blocked. Alert sent to system administrator.'
    ],
    
    traceDetected: [
        'WARNING: Trace detected! Counter-measures initiated.',
        'ALERT: Your IP is being traced. Disconnect recommended.',
        'SECURITY BREACH: Unauthorized access attempt logged.',
        'WARNING: Intrusion Detection System activated.',
        'ALERT: Connection monitored by security team.'
    ],
    
    success: [
        'Operation completed successfully.',
        'Task executed without errors.',
        'Command processed. Status: OK.',
        'Execution successful. No anomalies detected.',
        'Process finished. All systems nominal.'
    ],
    
    getRandom: function(category) {
        const responses = this[category] || this.success;
        return responses[Math.floor(Math.random() * responses.length)];
    }
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    initializeDisclaimer();
    initializeTerminal();
    initializeTabNavigation();
    initializeNetworkMap();
    initializeModules();
    initializeTools();
    updateSystemTime();
    setInterval(updateSystemTime, 1000);
});

// ========== DISCLAIMER MODAL ==========
function initializeDisclaimer() {
    const modal = document.getElementById('disclaimer-modal');
    const acceptBtn = document.getElementById('accept-disclaimer');
    
    acceptBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.getElementById('simulator').style.display = 'block';
        initializeSystem();
    });
}

function updateSystemTime() {
    const timeEl = document.getElementById('system-time');
    if (timeEl) {
        timeEl.textContent = Utils.formatTime();
    }
}

async function initializeSystem() {
    const consoleEl = document.getElementById('console');
    await Utils.typeWriter(consoleEl, `${Utils.getTimeStamp()} Initializing Cyber Guard Nexus...\n`);
    await Utils.sleep(500);
    await Utils.typeWriter(consoleEl, `${Utils.getTimeStamp()} Loading kernel modules... [OK]\n`);
    await Utils.sleep(300);
    await Utils.typeWriter(consoleEl, `${Utils.getTimeStamp()} Starting network services... [OK]\n`);
    await Utils.sleep(300);
    await Utils.typeWriter(consoleEl, `${Utils.getTimeStamp()} Initializing encryption protocols... [OK]\n`);
    await Utils.sleep(300);
    await Utils.typeWriter(consoleEl, `${Utils.getTimeStamp()} System ready. Type 'help' for available commands.\n\n`);
}

// ========== TERMINAL FUNCTIONALITY ==========
function initializeTerminal() {
    const inputEl = document.getElementById('input');
    const consoleEl = document.getElementById('console');
    
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = inputEl.value.trim();
            if (command) {
                executeCommand(command);
                SimulatorState.commandHistory.push(command);
                SimulatorState.historyIndex = SimulatorState.commandHistory.length;
                inputEl.value = '';
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (SimulatorState.historyIndex > 0) {
                SimulatorState.historyIndex--;
                inputEl.value = SimulatorState.commandHistory[SimulatorState.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (SimulatorState.historyIndex < SimulatorState.commandHistory.length - 1) {
                SimulatorState.historyIndex++;
                inputEl.value = SimulatorState.commandHistory[SimulatorState.historyIndex];
            } else {
                SimulatorState.historyIndex = SimulatorState.commandHistory.length;
                inputEl.value = '';
            }
        }
    });
}

async function executeCommand(command) {
    const consoleEl = document.getElementById('console');
    const parts = command.toLowerCase().split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);
    
    logToConsole(`root@cyberguard:~$ ${command}`, 'user');
    
    switch (cmd) {
        case 'help':
            showHelp();
            break;
        case 'scan':
            await scanTarget(args[0] || Utils.randomIP());
            break;
        case 'connect':
            await connectToServer(args[0] || Utils.randomIP());
            break;
        case 'crack':
            await bruteForceAttack(args[0] || 'target.com');
            break;
        case 'exploit':
            await exploitVulnerability(args[0] || 'CVE-2023-1234');
            break;
        case 'status':
            showStatus();
            break;
        case 'clear':
            consoleEl.innerHTML = '';
            break;
        case 'whoami':
            logToConsole('root', 'success');
            break;
        case 'ls':
            logToConsole('exploit.py  payloads/  scripts/  tools/', 'info');
            break;
        case 'pwd':
            logToConsole('/root/cyberguard', 'info');
            break;
        case 'ifconfig':
            showNetworkConfig();
            break;
        case 'nmap':
            await nmapScan(args.join(' '));
            break;
        default:
            logToConsole(`Command not found: ${cmd}. Type 'help' for available commands.`, 'error');
    }
}

function logToConsole(message, type = 'info') {
    const consoleEl = document.getElementById('console');
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    line.textContent = message;
    consoleEl.appendChild(line);
    consoleEl.scrollTop = consoleEl.scrollHeight;
}

function showHelp() {
    const helpText = `
Available Commands:
  help                - Show this help message
  scan [target]       - Perform port scan on target
  connect [ip]        - Establish connection to server
  crack [target]      - Launch brute-force attack
  exploit [vuln]      - Exploit vulnerability
  status              - Show system status
  clear               - Clear terminal
  whoami              - Display current user
  ls                  - List directory contents
  pwd                 - Print working directory
  ifconfig            - Show network configuration
  nmap [options]      - Network mapper scan
    `;
    logToConsole(helpText, 'info');
}

async function scanTarget(target) {
    logToConsole(`Starting port scan on ${target}...`, 'info');
    await Utils.sleep(1000);
    
    // Common ports with their services
    const ports = [21, 22, 23, 80, 443, 3306, 8080];
    const openPorts = [];
    
    for (let port of ports) {
        const status = Math.random() > 0.5 ? 'open' : 'closed';
        const service = getServiceName(port);
        logToConsole(`PORT ${port}/tcp  ${status.padEnd(10)} ${service}`, status === 'open' ? 'success' : 'info');
        if (status === 'open') {
            openPorts.push(port);
        }
        await Utils.sleep(200);
    }
    
    logToConsole(`\nScan complete. ${openPorts.length} open ports found.`, 'success');
    
    if (Math.random() > 0.7) {
        const vuln = `CVE-2023-${Math.floor(Math.random() * 9999)}`;
        logToConsole(`[!] Vulnerability detected: ${vuln}`, 'error');
        SimulatorState.discoveredVulnerabilities.push(vuln);
    }
}

async function connectToServer(ip) {
    logToConsole(`Initiating connection to ${ip}...`, 'info');
    await Utils.sleep(800);
    logToConsole('Establishing TCP handshake...', 'info');
    await Utils.sleep(600);
    logToConsole('SYN sent...', 'info');
    await Utils.sleep(400);
    logToConsole('SYN-ACK received...', 'info');
    await Utils.sleep(400);
    logToConsole('ACK sent...', 'info');
    await Utils.sleep(600);
    
    if (Math.random() > 0.3) {
        logToConsole(AIResponses.getRandom('accessGranted'), 'success');
        SimulatorState.connectedServers.push(ip);
        SimulatorState.currentTarget = ip;
    } else {
        logToConsole(AIResponses.getRandom('accessDenied'), 'error');
        if (Math.random() > 0.5) {
            await Utils.sleep(1000);
            logToConsole(AIResponses.getRandom('traceDetected'), 'error');
        }
    }
}

async function bruteForceAttack(target) {
    logToConsole(`Initiating brute-force attack on ${target}...`, 'info');
    logToConsole('Loading password dictionary...', 'info');
    await Utils.sleep(1000);
    
    const attempts = ['admin:admin', 'root:toor', 'admin:password', 'user:12345', 'admin:letmein'];
    for (let i = 0; i < attempts.length; i++) {
        logToConsole(`[${i + 1}/${attempts.length}] Trying: ${attempts[i]}`, 'info');
        await Utils.sleep(500);
    }
    
    await Utils.sleep(800);
    if (Math.random() > 0.4) {
        logToConsole(`\n[SUCCESS] Password cracked: admin:${Math.random().toString(36).substring(7)}`, 'success');
        logToConsole(AIResponses.getRandom('accessGranted'), 'success');
    } else {
        logToConsole('\n[FAILED] Unable to crack password with current dictionary.', 'error');
        logToConsole('Recommendation: Try different attack vector.', 'info');
    }
}

async function exploitVulnerability(vuln) {
    logToConsole(`Preparing exploit for ${vuln}...`, 'info');
    await Utils.sleep(1000);
    logToConsole('Compiling payload...', 'info');
    await Utils.sleep(800);
    logToConsole('Injecting shellcode...', 'info');
    await Utils.sleep(1000);
    logToConsole('Executing exploit...', 'info');
    await Utils.sleep(1200);
    
    if (Math.random() > 0.5) {
        logToConsole('[SUCCESS] Exploit executed. Shell access gained!', 'success');
        logToConsole('Type "shell" to access remote terminal.', 'info');
    } else {
        logToConsole('[FAILED] Exploit unsuccessful. Target may be patched.', 'error');
    }
}

function showStatus() {
    logToConsole('\n=== SYSTEM STATUS ===', 'info');
    logToConsole(`Current Target: ${SimulatorState.currentTarget || 'None'}`, 'info');
    logToConsole(`Connected Servers: ${SimulatorState.connectedServers.length}`, 'info');
    logToConsole(`Discovered Vulnerabilities: ${SimulatorState.discoveredVulnerabilities.length}`, 'info');
    logToConsole(`Packet Sniffer: ${SimulatorState.snifferActive ? 'Active' : 'Inactive'}`, 'info');
    logToConsole('====================\n', 'info');
}

function showNetworkConfig() {
    logToConsole(`eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500`, 'info');
    logToConsole(`        inet ${Utils.randomIP()}  netmask 255.255.255.0`, 'info');
    logToConsole(`        ether ${Utils.randomMAC()}  txqueuelen 1000`, 'info');
    logToConsole(`        RX packets 123456  bytes 98765432 (94.2 MB)`, 'info');
    logToConsole(`        TX packets 87654  bytes 12345678 (11.8 MB)`, 'info');
}

async function nmapScan(options) {
    const target = options || Utils.randomIP();
    logToConsole(`Starting Nmap scan on ${target}...`, 'info');
    await Utils.sleep(1000);
    logToConsole(`Nmap scan report for ${target}`, 'info');
    logToConsole(`Host is up (0.0${Math.floor(Math.random() * 9)}s latency).`, 'success');
    await Utils.sleep(500);
    
    const services = [
        { port: 22, service: 'ssh', version: 'OpenSSH 7.4' },
        { port: 80, service: 'http', version: 'Apache 2.4.6' },
        { port: 443, service: 'https', version: 'nginx 1.14.0' }
    ];
    
    for (let svc of services) {
        logToConsole(`${svc.port}/tcp  open  ${svc.service}  ${svc.version}`, 'success');
        await Utils.sleep(300);
    }
}

function getServiceName(port) {
    const services = {
        21: 'ftp',
        22: 'ssh',
        23: 'telnet',
        25: 'smtp',
        53: 'dns',
        80: 'http',
        110: 'pop3',
        143: 'imap',
        443: 'https',
        3306: 'mysql',
        3389: 'rdp',
        8080: 'http-proxy'
    };
    return services[port] || 'unknown';
}

// ========== TAB NAVIGATION ==========
function initializeTabNavigation() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// ========== NETWORK MAP (THREE.JS) ==========
function initializeNetworkMap() {
    const container = document.getElementById('network-canvas');
    if (!container || !window.THREE) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);
    
    // Create network nodes
    const nodes = [];
    const nodeGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    
    for (let i = 0; i < 8; i++) {
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        const angle = (i / 8) * Math.PI * 2;
        node.position.x = Math.cos(angle) * 3;
        node.position.y = Math.sin(angle) * 3;
        node.position.z = (Math.random() - 0.5) * 2;
        scene.add(node);
        nodes.push(node);
    }
    
    // Create connections
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, opacity: 0.3, transparent: true });
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            if (Math.random() > 0.6) {
                const points = [nodes[i].position, nodes[j].position];
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, lineMaterial);
                scene.add(line);
            }
        }
    }
    
    camera.position.z = 8;
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        nodes.forEach(node => {
            node.rotation.x += 0.01;
            node.rotation.y += 0.01;
        });
        
        scene.rotation.y += 0.002;
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (container.clientWidth > 0) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    });
}

// ========== MODULE WINDOWS ==========
function initializeModules() {
    // Module launchers
    const moduleLaunchers = document.querySelectorAll('.module-launch');
    moduleLaunchers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const module = e.target.closest('.module-card').getAttribute('data-module');
            openModule(module);
        });
    });
    
    // Window close buttons
    const closeButtons = document.querySelectorAll('.window-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const windowId = btn.getAttribute('data-window');
            document.getElementById(windowId).style.display = 'none';
        });
    });
    
    // PC Module
    initializePCModule();
    
    // Bank Module
    initializeBankModule();
    
    // Server Module
    initializeServerModule();
    
    // Email Module
    initializeEmailModule();
}

function openModule(moduleName) {
    const windowId = `${moduleName}-window`;
    const windowEl = document.getElementById(windowId);
    if (windowEl) {
        windowEl.style.display = 'block';
    }
}

function initializePCModule() {
    const folders = document.querySelectorAll('.pc-folder');
    const files = document.querySelectorAll('.pc-file');
    const contentEl = document.getElementById('pc-content');
    
    const folderContents = {
        documents: 'financial_report_2023.pdf\nproject_plans.docx\nmeeting_notes.txt',
        downloads: 'installer.exe\nsoftware_crack.zip\nbackup.tar.gz',
        photos: 'vacation_2023.jpg\nfamily.png\nscreenshot.png'
    };
    
    const fileContents = {
        'passwords.txt': 'Gmail: john.doe@email.com / MyP@ssw0rd123\nBank: account_4532 / Secur3P@ss\nWork VPN: jdoe / CompanyVPN2023!'
    };
    
    folders.forEach(folder => {
        folder.addEventListener('click', () => {
            const folderName = folder.getAttribute('data-folder');
            contentEl.textContent = `Contents of ${folderName}:\n\n${folderContents[folderName]}`;
        });
    });
    
    files.forEach(file => {
        file.addEventListener('click', () => {
            const fileName = file.getAttribute('data-file');
            contentEl.textContent = `${fileName}:\n\n${fileContents[fileName]}`;
        });
    });
}

function initializeBankModule() {
    const form = document.getElementById('bank-login-form');
    const dashboard = document.getElementById('bank-dashboard');
    const accountEl = document.getElementById('account-number');
    const balanceEl = document.getElementById('account-balance');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const account = document.getElementById('bank-account').value;
        const password = document.getElementById('bank-password').value;
        
        if (account && password) {
            form.style.display = 'none';
            dashboard.style.display = 'block';
            accountEl.textContent = account;
            balanceEl.textContent = (Math.random() * 100000).toFixed(2);
        }
    });
}

function initializeServerModule() {
    const inputEl = document.getElementById('server-input');
    const outputEl = document.getElementById('server-output');
    
    inputEl.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            const cmd = inputEl.value.trim();
            if (cmd) {
                const line = document.createElement('div');
                line.className = 'console-line';
                line.textContent = `root@target:~# ${cmd}`;
                outputEl.appendChild(line);
                
                await Utils.sleep(500);
                
                const response = document.createElement('div');
                response.className = 'console-line success';
                
                if (cmd === 'ls') {
                    response.textContent = 'database.sql  logs/  config/  backup/';
                } else if (cmd === 'whoami') {
                    response.textContent = 'root';
                } else if (cmd.startsWith('cat ')) {
                    response.textContent = 'DB_HOST=localhost\nDB_USER=admin\nDB_PASS=SuperSecret123';
                } else {
                    response.textContent = AIResponses.getRandom('success');
                }
                
                outputEl.appendChild(response);
                outputEl.scrollTop = outputEl.scrollHeight;
                inputEl.value = '';
            }
        }
    });
}

function initializeEmailModule() {
    const emailItems = document.querySelectorAll('.email-item');
    const emailContent = document.getElementById('email-content');
    
    const emails = [
        {
            from: 'admin@targetcorp.com',
            subject: 'Server Maintenance Schedule',
            body: 'The main server will undergo maintenance this Saturday from 2 AM to 6 AM. Please plan accordingly.\n\nServer IP: 192.168.1.100\nAdmin Panel: https://admin.targetcorp.com'
        },
        {
            from: 'security@targetcorp.com',
            subject: 'Password Reset Required',
            body: 'As part of our security policy, all users must reset their passwords.\n\nTemporary password: TempPass2023\nPlease change it immediately after login.'
        },
        {
            from: 'hr@targetcorp.com',
            subject: 'Employee Database Access',
            body: 'You have been granted access to the employee database.\n\nDatabase: HR_DB\nUsername: hr_user\nPassword: HRAccess456'
        }
    ];
    
    emailItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            const email = emails[index];
            emailContent.style.display = 'block';
            
            // Safely set content using textContent to prevent XSS
            emailContent.innerHTML = '';
            const fromLine = document.createElement('strong');
            fromLine.textContent = 'From: ';
            emailContent.appendChild(fromLine);
            emailContent.appendChild(document.createTextNode(email.from));
            emailContent.appendChild(document.createElement('br'));
            
            const subjectLine = document.createElement('strong');
            subjectLine.textContent = 'Subject: ';
            emailContent.appendChild(subjectLine);
            emailContent.appendChild(document.createTextNode(email.subject));
            emailContent.appendChild(document.createElement('br'));
            emailContent.appendChild(document.createElement('br'));
            
            // Convert newlines to <br> safely
            const bodyLines = email.body.split('\n');
            bodyLines.forEach((line, i) => {
                emailContent.appendChild(document.createTextNode(line));
                if (i < bodyLines.length - 1) {
                    emailContent.appendChild(document.createElement('br'));
                }
            });
        });
    });
}

// ========== HACKING TOOLS ==========
function initializeTools() {
    // Port Scanner
    document.getElementById('start-scan').addEventListener('click', async () => {
        const target = document.getElementById('scan-target').value || Utils.randomIP();
        const resultsEl = document.getElementById('scan-results');
        resultsEl.innerHTML = `Scanning ${target}...\n`;
        
        await Utils.sleep(1000);
        
        const ports = [21, 22, 80, 443, 3306, 8080];
        for (let port of ports) {
            const status = Math.random() > 0.5 ? 'OPEN' : 'CLOSED';
            resultsEl.innerHTML += `Port ${port}: ${status}\n`;
            await Utils.sleep(300);
        }
        
        resultsEl.innerHTML += '\nScan complete!';
    });
    
    // Brute Force
    document.getElementById('start-bruteforce').addEventListener('click', async () => {
        const target = document.getElementById('bruteforce-target').value || 'target.com';
        const type = document.getElementById('bruteforce-type').value;
        const progressBar = document.getElementById('bruteforce-bar');
        const statusEl = document.getElementById('bruteforce-status');
        
        statusEl.textContent = `Attacking ${target} via ${type.toUpperCase()}...`;
        
        for (let i = 0; i <= 100; i += 10) {
            progressBar.style.width = i + '%';
            await Utils.sleep(500);
        }
        
        if (Math.random() > 0.5) {
            statusEl.textContent = `SUCCESS! Password: ${Math.random().toString(36).substring(7)}`;
            statusEl.className = 'progress-text success';
        } else {
            statusEl.textContent = 'FAILED! Try different attack method.';
            statusEl.className = 'progress-text error';
        }
        
        setTimeout(() => {
            progressBar.style.width = '0%';
            statusEl.textContent = 'Ready';
            statusEl.className = 'progress-text';
        }, 3000);
    });
    
    // Packet Sniffer
    let snifferInterval = null;
    const MAX_PACKET_LINES = 20;
    
    document.getElementById('start-sniffer').addEventListener('click', () => {
        const outputEl = document.getElementById('packet-output');
        const startBtn = document.getElementById('start-sniffer');
        const stopBtn = document.getElementById('stop-sniffer');
        
        SimulatorState.snifferActive = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        
        snifferInterval = setInterval(() => {
            const protocols = ['TCP', 'UDP', 'HTTP', 'HTTPS', 'DNS'];
            const protocol = protocols[Math.floor(Math.random() * protocols.length)];
            const srcIP = Utils.randomIP();
            const dstIP = Utils.randomIP();
            const srcPort = Utils.randomPort();
            const dstPort = Utils.randomPort();
            
            const packet = `${Utils.getTimeStamp()} ${protocol} ${srcIP}:${srcPort} → ${dstIP}:${dstPort}\n`;
            outputEl.innerHTML += packet;
            outputEl.scrollTop = outputEl.scrollHeight;
            
            // Keep only last MAX_PACKET_LINES
            const lines = outputEl.innerHTML.split('\n');
            if (lines.length > MAX_PACKET_LINES) {
                outputEl.innerHTML = lines.slice(-MAX_PACKET_LINES).join('\n');
            }
        }, 1000);
    });
    
    document.getElementById('stop-sniffer').addEventListener('click', () => {
        SimulatorState.snifferActive = false;
        clearInterval(snifferInterval);
        document.getElementById('start-sniffer').disabled = false;
        document.getElementById('stop-sniffer').disabled = true;
    });
}