// ============================================
// CYBER GUARD NEXUS - Advanced Hacking Simulator
// Educational Purposes Only
// ============================================

// Configuration
const MATRIX_CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const TYPING_DELAY_MIN = 50;
const TYPING_DELAY_MAX = 100;

class HackingSimulator {
    constructor() {
        this.console = document.getElementById('console');
        this.input = document.getElementById('input');
        this.traceLevel = 0;
        this.maxTrace = 100;
        this.accessLevel = 'NONE';
        this.currentScenario = null;
        this.stats = {
            portsScanned: 0,
            vulnsFound: 0
        };
        this.isTyping = false;
        this.commandQueue = [];
        
        // Initialize
        this.init();
    }
    
    init() {
        this.setupDisclaimer();
        this.setupEventListeners();
        this.setupMatrix();
        this.setupThreeJS();
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    }
    
    setupDisclaimer() {
        const disclaimer = document.getElementById('disclaimer');
        const acceptBtn = document.getElementById('accept-disclaimer');
        
        acceptBtn.addEventListener('click', () => {
            disclaimer.style.display = 'none';
            document.getElementById('main-interface').style.display = 'block';
            this.typeWelcomeMessage();
        });
    }
    
    setupEventListeners() {
        // Enter key to submit
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isTyping) {
                this.processCommand(this.input.value.trim());
                this.input.value = '';
            }
        });
        
        // Scenario buttons
        document.querySelectorAll('.scenario-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectScenario(btn.dataset.scenario);
                document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Quick command buttons
        document.querySelectorAll('.quick-cmd').forEach(btn => {
            btn.addEventListener('click', () => {
                const cmd = btn.dataset.cmd;
                this.autoTypeCommand(cmd);
            });
        });
    }
    
    setupMatrix() {
        const canvas = document.getElementById('matrix-bg');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const chars = MATRIX_CHARS;
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);
        
        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#0F0';
            ctx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        
        setInterval(draw, 33);
        
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
    
    setupThreeJS() {
        // Check if THREE.js is available
        // Note: Three.js is loaded from CDN. For production, consider using a local copy
        // or npm package with integrity checks for better security.
        if (typeof THREE === 'undefined') {
            console.warn('Three.js not loaded - 3D visualization disabled');
            return;
        }
        
        const container = document.getElementById('three-container');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);
        
        // Create grid
        const gridHelper = new THREE.GridHelper(50, 50, 0x00ff00, 0x003300);
        scene.add(gridHelper);
        
        // Create particles for data flow effect
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1000;
        const posArray = new Float32Array(particlesCount * 3);
        
        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 50;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.1,
            color: 0x00ff00,
            transparent: true,
            opacity: 0.6
        });
        
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);
        
        camera.position.z = 20;
        camera.position.y = 10;
        camera.lookAt(0, 0, 0);
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            gridHelper.rotation.y += 0.001;
            particlesMesh.rotation.y += 0.002;
            particlesMesh.rotation.x += 0.001;
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    updateTime() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
        document.getElementById('time-display').textContent = `Time: ${timeStr}`;
    }
    
    // Auto-type command with realistic delay
    async autoTypeCommand(command) {
        if (this.isTyping) return;
        
        this.isTyping = true;
        this.input.value = '';
        this.input.focus();
        
        for (let char of command) {
            this.input.value += char;
            await this.sleep(TYPING_DELAY_MIN + Math.random() * TYPING_DELAY_MAX);
        }
        
        await this.sleep(300);
        this.processCommand(command);
        this.input.value = '';
        this.isTyping = false;
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async typeWelcomeMessage() {
        await this.typeToConsole('system', '='.repeat(60));
        await this.typeToConsole('success', 'CYBER GUARD NEXUS v2.4.1 - INITIALIZED');
        await this.typeToConsole('system', '='.repeat(60));
        await this.typeToConsole('info', 'System boot complete. All modules loaded.');
        await this.typeToConsole('info', 'Type "help" for available commands.');
        await this.typeToConsole('warning', 'WARNING: Unauthorized access is illegal and monitored.');
        await this.typeToConsole('system', '');
    }
    
    async typeToConsole(type, message, delay = 20) {
        const line = document.createElement('div');
        line.className = `console-line ${type}`;
        this.console.appendChild(line);
        
        let displayText = '';
        for (let char of message) {
            displayText += char;
            line.textContent = displayText;
            this.console.scrollTop = this.console.scrollHeight;
            if (delay > 0) await this.sleep(delay);
        }
        
        this.console.scrollTop = this.console.scrollHeight;
    }
    
    addToConsole(type, message) {
        const line = document.createElement('div');
        line.className = `console-line ${type}`;
        line.textContent = message;
        this.console.appendChild(line);
        this.console.scrollTop = this.console.scrollHeight;
    }
    
    selectScenario(scenario) {
        this.currentScenario = scenario;
        this.resetStats();
        
        switch(scenario) {
            case 'corporate':
                this.startCorporateScenario();
                break;
            case 'wifi':
                this.startWiFiScenario();
                break;
            case 'custom':
                this.startCustomScenario();
                break;
        }
    }
    
    async startCorporateScenario() {
        this.addToConsole('system', '');
        await this.typeToConsole('info', '>>> SCENARIO: Corporate Network Breach <<<', 30);
        await this.typeToConsole('system', 'Target: MegaCorp Industries Internal Network');
        await this.typeToConsole('system', 'Objective: Gain administrative access to internal servers');
        await this.typeToConsole('warning', 'Difficulty: High - Advanced IDS systems active');
        await this.typeToConsole('info', 'Recommended: Start with "nmap scan"');
        this.addToConsole('system', '');
        
        document.getElementById('connection-status').innerHTML = 'Connection: <span class="connected">ACTIVE</span>';
    }
    
    async startWiFiScenario() {
        this.addToConsole('system', '');
        await this.typeToConsole('info', '>>> SCENARIO: Wi-Fi Network Attack <<<', 30);
        await this.typeToConsole('system', 'Target: Corporate Wi-Fi Network "SecureNet-5G"');
        await this.typeToConsole('system', 'Objective: Crack WPA2 encryption and gain network access');
        await this.typeToConsole('warning', 'Difficulty: Medium - WPA2 encryption detected');
        await this.typeToConsole('info', 'Recommended: Use "wifi scan" to discover networks');
        this.addToConsole('system', '');
        
        document.getElementById('connection-status').innerHTML = 'Connection: <span class="connected">ACTIVE</span>';
    }
    
    async startCustomScenario() {
        this.addToConsole('system', '');
        await this.typeToConsole('info', '>>> SCENARIO: Custom Penetration Test <<<', 30);
        await this.typeToConsole('system', 'Mode: Free exploration');
        await this.typeToConsole('info', 'Use any available commands to explore and test');
        this.addToConsole('system', '');
        
        document.getElementById('connection-status').innerHTML = 'Connection: <span class="connected">ACTIVE</span>';
    }
    
    async processCommand(command) {
        if (!command) return;
        
        this.addToConsole('user', `root@cyber-nexus:~$ ${command}`);
        
        const cmd = command.toLowerCase().trim();
        
        switch(true) {
            case cmd === 'help':
                await this.showHelp();
                break;
            case cmd === 'clear' || cmd === 'cls':
                this.console.innerHTML = '';
                break;
            case cmd.startsWith('nmap scan'):
                await this.nmapScan();
                break;
            case cmd.startsWith('port brute'):
                await this.portBrute();
                break;
            case cmd.startsWith('server exploit'):
                await this.serverExploit();
                break;
            case cmd.startsWith('wifi scan'):
                await this.wifiScan();
                break;
            case cmd.startsWith('wifi crack'):
                await this.wifiCrack();
                break;
            case cmd === 'status':
                await this.showStatus();
                break;
            case cmd === 'reset':
                this.resetStats();
                this.addToConsole('success', 'System reset complete.');
                break;
            default:
                await this.unknownCommand(command);
                break;
        }
    }
    
    async showHelp() {
        this.addToConsole('info', '');
        this.addToConsole('info', 'Available Commands:');
        this.addToConsole('info', '─'.repeat(60));
        this.addToConsole('system', '  help              - Display this help menu');
        this.addToConsole('system', '  clear/cls         - Clear console output');
        this.addToConsole('system', '  nmap scan         - Scan target network for open ports');
        this.addToConsole('system', '  port brute        - Attempt brute force on discovered ports');
        this.addToConsole('system', '  server exploit    - Exploit server vulnerabilities');
        this.addToConsole('system', '  wifi scan         - Scan for available Wi-Fi networks');
        this.addToConsole('system', '  wifi crack        - Attempt to crack Wi-Fi password');
        this.addToConsole('system', '  status            - Show current mission status');
        this.addToConsole('system', '  reset             - Reset session statistics');
        this.addToConsole('info', '─'.repeat(60));
        this.addToConsole('info', '');
    }
    
    async nmapScan() {
        await this.typeToConsole('info', 'Initiating Nmap network scan...', 15);
        await this.sleep(500);
        
        this.increaseTrace(5);
        
        await this.typeToConsole('system', 'Scanning target: 192.168.1.0/24');
        await this.sleep(300);
        
        const ports = [21, 22, 80, 443, 3306, 8080];
        for (let port of ports) {
            this.stats.portsScanned++;
            this.updateStats();
            
            const isOpen = Math.random() > 0.5;
            const status = isOpen ? '[OPEN]' : '[CLOSED]';
            const color = isOpen ? 'success' : 'system';
            
            await this.typeToConsole(color, `Port ${port}: ${status}`, 10);
            await this.sleep(100);
            
            if (isOpen && Math.random() > 0.6) {
                this.stats.vulnsFound++;
                this.updateStats();
                await this.typeToConsole('warning', `  └─ Potential vulnerability detected on port ${port}`, 10);
            }
        }
        
        await this.sleep(300);
        await this.typeToConsole('success', `Scan complete. ${this.stats.portsScanned} ports scanned, ${this.stats.vulnsFound} vulnerabilities found.`);
        this.addToConsole('system', '');
    }
    
    async portBrute() {
        if (this.stats.portsScanned === 0) {
            this.addToConsole('error', 'ERROR: No ports scanned yet. Run "nmap scan" first.');
            return;
        }
        
        await this.typeToConsole('warning', 'Initiating brute force attack...', 15);
        this.increaseTrace(15);
        
        await this.sleep(500);
        
        const passwords = ['admin', 'password', 'root', '123456', 'letmein', 'qwerty', 'admin123'];
        
        for (let i = 0; i < passwords.length; i++) {
            await this.typeToConsole('system', `Attempting password: ${passwords[i]}`, 10);
            await this.sleep(200);
            
            if (i === passwords.length - 1) {
                await this.sleep(500);
                await this.typeToConsole('success', '>>> ACCESS GRANTED <<<');
                await this.typeToConsole('success', `Valid credentials found: admin:${passwords[i]}`);
                this.accessLevel = 'USER';
                this.updateStats();
                
                if (Math.random() > 0.7) {
                    this.increaseTrace(20);
                    await this.typeToConsole('error', '⚠️ WARNING: TRACE DETECTED ⚠️');
                    await this.typeToConsole('warning', 'IDS system has logged suspicious activity');
                }
            } else {
                await this.typeToConsole('error', '✗ Authentication failed');
            }
        }
        
        this.addToConsole('system', '');
    }
    
    async serverExploit() {
        if (this.accessLevel === 'NONE') {
            this.addToConsole('error', 'ERROR: Access required. Authenticate first.');
            return;
        }
        
        await this.typeToConsole('warning', 'Launching exploit against target server...', 15);
        this.increaseTrace(25);
        
        await this.sleep(800);
        
        const exploits = [
            'SQL Injection (CVE-2023-1234)',
            'Buffer Overflow (CVE-2023-5678)',
            'Remote Code Execution (CVE-2023-9012)'
        ];
        
        for (let exploit of exploits) {
            await this.typeToConsole('system', `Testing: ${exploit}`, 15);
            await this.sleep(300);
            
            if (Math.random() > 0.5) {
                await this.typeToConsole('success', '  └─ Exploit successful!');
            } else {
                await this.typeToConsole('error', '  └─ Exploit failed - patched');
            }
        }
        
        await this.sleep(500);
        
        if (Math.random() > 0.5) {
            await this.typeToConsole('success', '>>> ROOT ACCESS OBTAINED <<<');
            this.accessLevel = 'ROOT';
            this.updateStats();
            await this.typeToConsole('success', 'Full system privileges granted');
            
            this.increaseTrace(30);
            await this.sleep(200);
            await this.typeToConsole('error', '⚠️⚠️⚠️ CRITICAL: TRACE ACTIVE ⚠️⚠️⚠️');
            await this.typeToConsole('error', 'Security team alerted - immediate action required');
        } else {
            await this.typeToConsole('warning', 'Privilege escalation failed');
            this.increaseTrace(10);
        }
        
        this.addToConsole('system', '');
    }
    
    async wifiScan() {
        await this.typeToConsole('info', 'Scanning for Wi-Fi networks...', 15);
        await this.sleep(500);
        
        const networks = [
            { ssid: 'SecureNet-5G', security: 'WPA2', signal: 85 },
            { ssid: 'CoffeeShop_WiFi', security: 'WPA', signal: 62 },
            { ssid: 'HomeNetwork_2.4G', security: 'WPA2', signal: 45 },
            { ssid: 'Guest_Network', security: 'OPEN', signal: 71 }
        ];
        
        this.addToConsole('info', '');
        this.addToConsole('info', 'SSID                    Security    Signal');
        this.addToConsole('info', '─'.repeat(60));
        
        for (let net of networks) {
            await this.sleep(200);
            const ssid = net.ssid.padEnd(23);
            const sec = net.security.padEnd(11);
            const signal = `${net.signal}%`;
            
            this.addToConsole('system', `${ssid} ${sec} ${signal}`);
        }
        
        this.addToConsole('info', '');
        this.addToConsole('success', `${networks.length} networks discovered`);
        this.addToConsole('system', '');
    }
    
    async wifiCrack() {
        await this.typeToConsole('warning', 'Initiating Wi-Fi password crack...', 15);
        await this.typeToConsole('system', 'Target: SecureNet-5G');
        await this.typeToConsole('system', 'Method: Dictionary attack + WPA2 handshake capture');
        
        this.increaseTrace(10);
        await this.sleep(800);
        
        await this.typeToConsole('info', 'Capturing WPA2 handshake...');
        await this.sleep(1000);
        await this.typeToConsole('success', 'Handshake captured successfully');
        
        await this.sleep(500);
        await this.typeToConsole('info', 'Running dictionary attack...');
        
        for (let i = 0; i < 5; i++) {
            await this.sleep(400);
            await this.typeToConsole('system', `Testing ${(i + 1) * 2000} passwords...`, 5);
        }
        
        await this.sleep(800);
        await this.typeToConsole('success', '>>> PASSWORD CRACKED <<<');
        await this.typeToConsole('success', 'Wi-Fi Password: SecureP@ssw0rd2024');
        await this.typeToConsole('success', 'Network access granted');
        
        this.increaseTrace(15);
        this.addToConsole('system', '');
    }
    
    async showStatus() {
        this.addToConsole('info', '');
        this.addToConsole('info', '=== MISSION STATUS ===');
        this.addToConsole('system', `Scenario: ${this.currentScenario || 'None'}`);
        this.addToConsole('system', `Access Level: ${this.accessLevel}`);
        this.addToConsole('system', `Ports Scanned: ${this.stats.portsScanned}`);
        this.addToConsole('system', `Vulnerabilities: ${this.stats.vulnsFound}`);
        this.addToConsole('system', `Trace Level: ${this.traceLevel}%`);
        this.addToConsole('info', '');
    }
    
    async unknownCommand(cmd) {
        const responses = [
            `Command not found: ${cmd}`,
            `Unknown command: ${cmd}. Type "help" for available commands.`,
            `Error: "${cmd}" is not recognized as a valid command.`
        ];
        
        this.addToConsole('error', responses[Math.floor(Math.random() * responses.length)]);
    }
    
    increaseTrace(amount) {
        this.traceLevel = Math.min(this.traceLevel + amount, this.maxTrace);
        this.updateTraceDisplay();
        
        if (this.traceLevel >= 75) {
            document.getElementById('trace-status').innerHTML = 'Trace: <span class="danger">CRITICAL</span>';
        } else if (this.traceLevel >= 40) {
            document.getElementById('trace-status').innerHTML = 'Trace: <span class="warning">ELEVATED</span>';
        } else {
            document.getElementById('trace-status').innerHTML = 'Trace: <span class="safe">CLEAR</span>';
        }
    }
    
    updateTraceDisplay() {
        const traceFill = document.getElementById('trace-fill');
        traceFill.style.width = `${this.traceLevel}%`;
        
        if (this.traceLevel > 75) {
            traceFill.style.background = 'linear-gradient(90deg, #ff0000, #ff6600)';
        } else if (this.traceLevel > 40) {
            traceFill.style.background = 'linear-gradient(90deg, #ffaa00, #ff0000)';
        }
    }
    
    updateStats() {
        document.getElementById('ports-scanned').textContent = this.stats.portsScanned;
        document.getElementById('vulns-found').textContent = this.stats.vulnsFound;
        document.getElementById('access-level').textContent = this.accessLevel;
    }
    
    resetStats() {
        this.stats.portsScanned = 0;
        this.stats.vulnsFound = 0;
        this.traceLevel = 0;
        this.accessLevel = 'NONE';
        this.updateStats();
        this.updateTraceDisplay();
        document.getElementById('trace-status').innerHTML = 'Trace: <span class="safe">CLEAR</span>';
    }
}

// Initialize the simulator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const simulator = new HackingSimulator();
});
