// ============================================
// Cyber Guard Nexus - Advanced Hacking Simulator
// Educational/Entertainment Purpose Only
// ============================================

class HackingSimulator {
    constructor() {
        this.terminalOutput = document.getElementById('terminal-output');
        this.terminalInput = document.getElementById('terminal-input');
        this.connectionStatus = document.getElementById('connection-status');
        this.traceLevel = document.getElementById('trace-level');
        this.dataExfil = document.getElementById('data-exfil');
        this.traceAlert = document.getElementById('trace-alert');
        this.alertCounter = document.getElementById('alert-counter');
        
        this.currentScenario = 'manual';
        this.isConnected = false;
        this.traceValue = 0;
        this.dataExfilValue = 0;
        this.scenarioStep = 0;
        this.commandHistory = [];
        this.historyIndex = -1;
        
        // Network visualization
        this.networkViz = null;
        
        // Audio flags
        this.audioEnabled = true;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initNetworkVisualization();
        this.displayWelcomeMessage();
        this.startBackgroundEffects();
    }
    
    setupEventListeners() {
        // Terminal input
        this.terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.executeCommand(this.terminalInput.value.trim());
                this.terminalInput.value = '';
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory('up');
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory('down');
            }
        });
        
        // Scenario buttons
        document.querySelectorAll('.scenario-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectScenario(e.target.dataset.scenario);
            });
        });
        
        // Focus terminal input by default
        this.terminalInput.focus();
    }
    
    displayWelcomeMessage() {
        const welcomeText = `
╔═══════════════════════════════════════════════════════════════╗
║         CYBER GUARD NEXUS - HACKING SIMULATOR v2.0           ║
║                                                               ║
║  WARNING: This is a FICTIONAL educational simulation          ║
║  For training and entertainment purposes only                 ║
╚═══════════════════════════════════════════════════════════════╝

[SYSTEM] Initializing secure terminal...
[SYSTEM] Loading encryption modules...
[SYSTEM] Establishing anonymous proxy chain...
[SYSTEM] System ready. Type 'help' for available commands.
`;
        this.printToTerminal(welcomeText, 'system', false);
    }
    
    printToTerminal(text, type = 'system', animate = true) {
        const lines = text.split('\n');
        let delay = 0;
        
        lines.forEach((line, index) => {
            if (animate) {
                setTimeout(() => {
                    this.addTerminalLine(line, type);
                    if (this.audioEnabled && type === 'system' && Math.random() > 0.7) {
                        this.playSound('type');
                    }
                }, delay);
                delay += 50;
            } else {
                this.addTerminalLine(line, type);
            }
        });
    }
    
    addTerminalLine(text, type = 'system') {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.textContent = text;
        this.terminalOutput.appendChild(line);
        this.terminalOutput.scrollTop = this.terminalOutput.scrollHeight;
    }
    
    executeCommand(command) {
        if (!command) return;
        
        // Add to history
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;
        
        // Display command
        this.addTerminalLine(`root@nexus:~$ ${command}`, 'user');
        
        // Parse and execute
        const cmd = command.toLowerCase().trim();
        
        if (this.currentScenario !== 'manual' && this.scenarioStep < this.getScenarioSteps().length) {
            this.processScenarioCommand(cmd);
        } else {
            this.processManualCommand(cmd);
        }
    }
    
    processManualCommand(cmd) {
        if (cmd === 'help') {
            this.showHelp();
        } else if (cmd === 'clear' || cmd === 'cls') {
            this.clearTerminal();
        } else if (cmd.startsWith('nmap')) {
            this.executeNmapScan(cmd);
        } else if (cmd.startsWith('sqlmap')) {
            this.executeSqlmapInjection(cmd);
        } else if (cmd.startsWith('curl')) {
            this.executeCurlAttack(cmd);
        } else if (cmd.startsWith('ping flood')) {
            this.executePingFlood(cmd);
        } else if (cmd === 'connect' || cmd.startsWith('connect ')) {
            this.executeConnect(cmd);
        } else if (cmd === 'disconnect') {
            this.executeDisconnect();
        } else if (cmd === 'status') {
            this.showStatus();
        } else {
            this.addTerminalLine(`[ERROR] Command not recognized: ${cmd}`, 'error');
            this.addTerminalLine(`[SYSTEM] Type 'help' for available commands.`, 'system');
        }
    }
    
    showHelp() {
        const helpText = `
Available Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  connect <ip>         - Establish connection to target
  disconnect            - Terminate current connection
  nmap scan             - Network port scanning
  sqlmap injection      - SQL injection attack simulation
  curl attack           - Data exfiltration via HTTP
  ping flood            - DoS attack simulation
  status                - Show system status
  clear                 - Clear terminal
  help                  - Display this help message
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
        this.printToTerminal(helpText, 'system');
    }
    
    clearTerminal() {
        this.terminalOutput.innerHTML = '';
    }
    
    async executeNmapScan(cmd) {
        if (!this.isConnected) {
            this.addTerminalLine('[ERROR] Not connected to target. Use "connect <ip>" first.', 'error');
            return;
        }
        
        this.printToTerminal('[SYSTEM] Initiating Nmap scan...', 'system');
        await this.delay(1000);
        
        this.printToTerminal('[SYSTEM] Starting Nmap 7.92 ( https://nmap.org )', 'system');
        await this.delay(800);
        
        const ports = [
            { port: 22, service: 'ssh', version: 'OpenSSH 8.2p1' },
            { port: 80, service: 'http', version: 'Apache httpd 2.4.38' },
            { port: 443, service: 'https', version: 'Apache httpd 2.4.38 (SSL)' },
            { port: 3306, service: 'mysql', version: 'MySQL 5.7.33' },
            { port: 8080, service: 'http-proxy', version: 'Squid 4.10' }
        ];
        
        this.printToTerminal('\nScanning target ports...', 'system');
        await this.delay(1500);
        
        this.printToTerminal('\nPORT     STATE    SERVICE     VERSION', 'system');
        this.printToTerminal('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'system');
        
        for (const portInfo of ports) {
            await this.delay(500);
            const line = `${portInfo.port.toString().padEnd(8)} open     ${portInfo.service.padEnd(11)} ${portInfo.version}`;
            this.printToTerminal(line, 'success');
            this.increaseTrace(2);
        }
        
        await this.delay(800);
        this.printToTerminal('\n[SUCCESS] Scan completed. 5 open ports detected.', 'success');
        this.printToTerminal('[WARNING] Scan activity may have been logged!', 'warning');
    }
    
    async executeSqlmapInjection(cmd) {
        if (!this.isConnected) {
            this.addTerminalLine('[ERROR] Not connected to target. Use "connect <ip>" first.', 'error');
            return;
        }
        
        this.printToTerminal('[SYSTEM] Starting SQLMap injection attack...', 'system');
        await this.delay(1000);
        
        this.printToTerminal('[INFO] Testing connection to the target URL', 'system');
        await this.delay(1500);
        
        this.printToTerminal('[INFO] Testing parameter vulnerability...', 'system');
        await this.delay(2000);
        
        const injectionTests = [
            'Testing Boolean-based blind injection',
            'Testing Time-based blind injection',
            'Testing Error-based injection',
            'Testing UNION query injection'
        ];
        
        for (const test of injectionTests) {
            this.printToTerminal(`[TESTING] ${test}...`, 'system');
            await this.delay(1200);
        }
        
        await this.delay(1000);
        this.printToTerminal('\n[CRITICAL] SQL injection vulnerability detected!', 'warning');
        this.printToTerminal('[INFO] Parameter "id" is vulnerable to UNION-based injection', 'system');
        this.printToTerminal('[INFO] Backend DBMS: MySQL 5.7.33', 'system');
        await this.delay(800);
        
        this.printToTerminal('\n[SYSTEM] Enumerating database tables...', 'system');
        await this.delay(2000);
        
        const tables = ['users', 'accounts', 'transactions', 'admin_users', 'session_tokens'];
        this.printToTerminal('\nAvailable tables:', 'success');
        tables.forEach(table => {
            this.printToTerminal(`  • ${table}`, 'success');
        });
        
        this.increaseTrace(15);
        this.addDataExfiltrated(45);
        this.printToTerminal('\n[WARNING] High intrusion activity detected!', 'warning');
    }
    
    async executeCurlAttack(cmd) {
        if (!this.isConnected) {
            this.addTerminalLine('[ERROR] Not connected to target. Use "connect <ip>" first.', 'error');
            return;
        }
        
        this.printToTerminal('[SYSTEM] Initiating data exfiltration via CURL...', 'system');
        await this.delay(1000);
        
        this.printToTerminal('[INFO] Establishing secure tunnel...', 'system');
        await this.delay(1500);
        
        this.printToTerminal('[INFO] Downloading sensitive files...', 'system');
        
        const files = [
            { name: 'user_credentials.db', size: 2456 },
            { name: 'config.json', size: 134 },
            { name: 'api_keys.txt', size: 892 },
            { name: 'customer_data.csv', size: 15678 }
        ];
        
        for (const file of files) {
            await this.delay(1000);
            this.printToTerminal(`[DOWNLOADING] ${file.name} (${file.size} KB)`, 'system');
            await this.delay(800);
            this.printToTerminal(`[SUCCESS] Downloaded: ${file.name}`, 'success');
            this.addDataExfiltrated(file.size);
            this.increaseTrace(8);
        }
        
        await this.delay(500);
        this.printToTerminal('\n[SUCCESS] Data exfiltration complete!', 'success');
        this.printToTerminal('[WARNING] Transfer detected by IDS!', 'warning');
    }
    
    async executePingFlood(cmd) {
        if (!this.isConnected) {
            this.addTerminalLine('[ERROR] Not connected to target. Use "connect <ip>" first.', 'error');
            return;
        }
        
        this.printToTerminal('[SYSTEM] Initiating PING flood attack...', 'system');
        this.printToTerminal('[WARNING] DoS attack in progress...', 'warning');
        await this.delay(1000);
        
        for (let i = 0; i < 20; i++) {
            await this.delay(100);
            const time = (Math.random() * 10).toFixed(2);
            const bytes = 64;
            this.printToTerminal(`PING 192.168.1.100: ${bytes} bytes, time=${time}ms`, 'system');
            this.increaseTrace(3);
        }
        
        await this.delay(500);
        this.printToTerminal('\n[SUCCESS] Target server overloaded!', 'success');
        this.printToTerminal('[CRITICAL] Attack traced! Disconnect immediately!', 'error');
    }
    
    executeConnect(cmd) {
        const parts = cmd.split(' ');
        const ip = parts[1] || this.generateRandomIP();
        
        this.printToTerminal(`[SYSTEM] Connecting to ${ip}...`, 'system');
        
        setTimeout(() => {
            this.printToTerminal('[SYSTEM] Establishing encrypted channel...', 'system');
        }, 1000);
        
        setTimeout(() => {
            this.printToTerminal('[SYSTEM] Bypassing firewall...', 'system');
        }, 2000);
        
        setTimeout(() => {
            this.printToTerminal(`[SUCCESS] Connected to ${ip}`, 'success');
            this.isConnected = true;
            this.updateConnectionStatus(true);
            this.playSound('connect');
            this.networkViz.addConnection();
        }, 3000);
    }
    
    executeDisconnect() {
        if (!this.isConnected) {
            this.addTerminalLine('[ERROR] No active connection.', 'error');
            return;
        }
        
        this.printToTerminal('[SYSTEM] Disconnecting...', 'system');
        this.printToTerminal('[SYSTEM] Clearing traces...', 'system');
        
        setTimeout(() => {
            this.printToTerminal('[SUCCESS] Disconnected safely.', 'success');
            this.isConnected = false;
            this.updateConnectionStatus(false);
            this.resetTrace();
            this.networkViz.removeConnection();
        }, 1500);
    }
    
    showStatus() {
        const status = `
System Status Report:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Connection:        ${this.isConnected ? 'CONNECTED' : 'DISCONNECTED'}
Trace Level:       ${this.traceValue}%
Data Exfiltrated:  ${this.dataExfilValue} KB
Active Scenario:   ${this.currentScenario.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
        this.printToTerminal(status, 'system');
    }
    
    selectScenario(scenario) {
        // Clear active class
        document.querySelectorAll('.scenario-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Set active
        const activeBtn = document.querySelector(`[data-scenario="${scenario}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        
        this.currentScenario = scenario;
        this.scenarioStep = 0;
        
        this.clearTerminal();
        this.displayWelcomeMessage();
        
        if (scenario !== 'manual') {
            this.startScenario(scenario);
        } else {
            this.printToTerminal('\n[SYSTEM] Manual mode activated. You have full control.', 'system');
        }
    }
    
    async startScenario(scenario) {
        this.resetTrace();
        this.dataExfilValue = 0;
        this.updateDataExfil();
        
        const scenarios = {
            corporate: async () => {
                this.printToTerminal('\n╔═══════════════════════════════════════════════════════╗', 'system');
                this.printToTerminal('║  SCENARIO: Corporate Network Infiltration           ║', 'system');
                this.printToTerminal('╚═══════════════════════════════════════════════════════╝', 'system');
                await this.delay(1000);
                this.printToTerminal('\n[OBJECTIVE] Infiltrate SecureCorp network and extract data', 'warning');
                this.printToTerminal('[TARGET] 192.168.10.50', 'system');
                await this.delay(1500);
                this.executeConnect('connect 192.168.10.50');
                await this.delay(4000);
                this.executeNmapScan('nmap scan');
                await this.delay(8000);
                this.executeSqlmapInjection('sqlmap injection');
                await this.delay(12000);
                this.executeCurlAttack('curl attack');
                await this.delay(10000);
                this.printToTerminal('\n[MISSION] Complete! Data successfully exfiltrated.', 'success');
                this.executeDisconnect();
            },
            
            wifi: async () => {
                this.printToTerminal('\n╔═══════════════════════════════════════════════════════╗', 'system');
                this.printToTerminal('║  SCENARIO: Wi-Fi Password Cracking                   ║', 'system');
                this.printToTerminal('╚═══════════════════════════════════════════════════════╝', 'system');
                await this.delay(1000);
                this.printToTerminal('\n[INFO] Scanning for wireless networks...', 'system');
                await this.delay(2000);
                this.printToTerminal('[FOUND] SSID: SecureOffice-5G (WPA2-PSK)', 'success');
                this.printToTerminal('[INFO] Starting handshake capture...', 'system');
                await this.delay(3000);
                this.printToTerminal('[SUCCESS] Handshake captured!', 'success');
                this.printToTerminal('[INFO] Launching dictionary attack...', 'system');
                
                for (let i = 0; i < 10; i++) {
                    await this.delay(500);
                    this.printToTerminal(`[TRYING] Password attempt ${i + 1}/10...`, 'system');
                    this.increaseTrace(5);
                }
                
                await this.delay(1000);
                this.printToTerminal('\n[SUCCESS] Password cracked: "SecureP@ss2024"', 'success');
                this.printToTerminal('[MISSION] Complete! Network access obtained.', 'success');
            },
            
            bank: async () => {
                this.printToTerminal('\n╔═══════════════════════════════════════════════════════╗', 'system');
                this.printToTerminal('║  SCENARIO: Bank System Infiltration                  ║', 'system');
                this.printToTerminal('╚═══════════════════════════════════════════════════════╝', 'system');
                await this.delay(1000);
                this.printToTerminal('\n[WARNING] HIGH SECURITY TARGET - Proceed with caution', 'warning');
                this.printToTerminal('[TARGET] bank-secure.example.com', 'system');
                await this.delay(1500);
                this.executeConnect('connect bank-secure.example.com');
                await this.delay(4000);
                this.printToTerminal('[INFO] Attempting admin panel access...', 'system');
                await this.delay(2000);
                this.printToTerminal('[TESTING] Trying default credentials...', 'system');
                await this.delay(2000);
                this.printToTerminal('[FAILED] admin:admin - Access denied', 'error');
                await this.delay(1000);
                this.printToTerminal('[TESTING] admin:password123', 'system');
                await this.delay(2000);
                this.printToTerminal('[SUCCESS] Access granted!', 'success');
                await this.delay(1000);
                this.executeSqlmapInjection('sqlmap injection');
                await this.delay(12000);
                this.executeCurlAttack('curl attack');
                await this.delay(10000);
                this.printToTerminal('\n[CRITICAL] Security breach detected!', 'error');
                this.printToTerminal('[MISSION] Complete! Disconnect now!', 'warning');
                await this.delay(2000);
                this.executeDisconnect();
            }
        };
        
        if (scenarios[scenario]) {
            scenarios[scenario]();
        }
    }
    
    // Helper functions
    navigateHistory(direction) {
        if (direction === 'up' && this.historyIndex > 0) {
            this.historyIndex--;
            this.terminalInput.value = this.commandHistory[this.historyIndex];
        } else if (direction === 'down' && this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
            this.terminalInput.value = this.commandHistory[this.historyIndex];
        } else if (direction === 'down') {
            this.historyIndex = this.commandHistory.length;
            this.terminalInput.value = '';
        }
    }
    
    updateConnectionStatus(connected) {
        this.connectionStatus.textContent = connected ? 'CONNECTED' : 'DISCONNECTED';
        this.connectionStatus.className = connected ? 'value connected' : 'value disconnected';
    }
    
    increaseTrace(amount) {
        this.traceValue = Math.min(100, this.traceValue + amount);
        this.traceLevel.textContent = `${this.traceValue}%`;
        
        if (this.traceValue >= 80) {
            this.showTraceAlert();
        }
    }
    
    resetTrace() {
        this.traceValue = 0;
        this.traceLevel.textContent = '0%';
        this.hideTraceAlert();
    }
    
    addDataExfiltrated(kb) {
        this.dataExfilValue += kb;
        this.updateDataExfil();
    }
    
    updateDataExfil() {
        this.dataExfil.textContent = `${this.dataExfilValue} KB`;
    }
    
    showTraceAlert() {
        this.traceAlert.classList.remove('hidden');
        this.alertCounter.textContent = `${100 - this.traceValue}%`;
        this.playSound('alert');
        
        if (this.traceValue >= 95) {
            this.printToTerminal('\n[CRITICAL] TRACE COMPLETE! Connection terminated!', 'error');
            this.executeDisconnect();
        }
    }
    
    hideTraceAlert() {
        this.traceAlert.classList.add('hidden');
    }
    
    generateRandomIP() {
        return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    playSound(type) {
        // Simplified sound implementation
        // In a full implementation, you'd have actual audio files
        if (!this.audioEnabled) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            if (type === 'type') {
                oscillator.frequency.value = 800;
                gainNode.gain.value = 0.02;
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.05);
            } else if (type === 'alert') {
                oscillator.frequency.value = 440;
                gainNode.gain.value = 0.1;
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.2);
            } else if (type === 'connect') {
                oscillator.frequency.value = 600;
                gainNode.gain.value = 0.05;
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.15);
            }
        } catch (e) {
            // Audio not supported
        }
    }
    
    // Network Visualization
    initNetworkVisualization() {
        const canvas = document.getElementById('network-canvas');
        const container = document.getElementById('network-viz-container');
        
        this.networkViz = new NetworkVisualization(canvas, container);
        this.networkViz.start();
    }
    
    startBackgroundEffects() {
        // Trace level monitoring
        setInterval(() => {
            if (this.isConnected && this.traceValue > 0) {
                this.alertCounter.textContent = `${100 - this.traceValue}%`;
            }
        }, 1000);
    }
    
    getScenarioSteps() {
        // For future expansion
        return [];
    }
    
    processScenarioCommand(cmd) {
        // For future expansion
        this.processManualCommand(cmd);
    }
}

// ============================================
// Network Visualization using Canvas
// ============================================

class NetworkVisualization {
    constructor(canvas, container) {
        this.canvas = canvas;
        this.container = container;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.particles = [];
        this.animationId = null;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.initNodes();
    }
    
    resize() {
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
    }
    
    initNodes() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Central node (user)
        this.nodes.push({
            x: centerX,
            y: centerY,
            radius: 8,
            color: '#00ff00',
            label: 'YOU',
            type: 'user'
        });
        
        // Surrounding nodes (targets)
        const angles = [0, 60, 120, 180, 240, 300];
        const distance = 80;
        
        angles.forEach((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            this.nodes.push({
                x: centerX + Math.cos(rad) * distance,
                y: centerY + Math.sin(rad) * distance,
                radius: 6,
                color: '#0066ff',
                label: `NODE-${i + 1}`,
                type: 'target'
            });
        });
    }
    
    addConnection() {
        if (this.connections.length === 0) {
            // Connect to first target
            this.connections.push({
                from: 0,
                to: 1,
                active: true
            });
        }
    }
    
    removeConnection() {
        this.connections = [];
        this.particles = [];
    }
    
    start() {
        this.animate();
    }
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.connections.forEach(conn => {
            const from = this.nodes[conn.from];
            const to = this.nodes[conn.to];
            
            this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(from.x, from.y);
            this.ctx.lineTo(to.x, to.y);
            this.ctx.stroke();
            
            // Add particles
            if (Math.random() > 0.95) {
                this.particles.push({
                    x: from.x,
                    y: from.y,
                    targetX: to.x,
                    targetY: to.y,
                    progress: 0,
                    speed: 0.02
                });
            }
        });
        
        // Draw and update particles
        this.particles = this.particles.filter(p => {
            p.progress += p.speed;
            if (p.progress >= 1) return false;
            
            const x = p.x + (p.targetX - p.x) * p.progress;
            const y = p.y + (p.targetY - p.y) * p.progress;
            
            this.ctx.fillStyle = '#00ff00';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            return true;
        });
        
        // Draw nodes
        this.nodes.forEach(node => {
            // Node circle
            this.ctx.fillStyle = node.color;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Node glow
            const gradient = this.ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, node.radius * 2
            );
            gradient.addColorStop(0, node.color + '88');
            gradient.addColorStop(1, node.color + '00');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Label
            this.ctx.fillStyle = node.color;
            this.ctx.font = '10px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(node.label, node.x, node.y - node.radius - 8);
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// Initialize Application
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const simulator = new HackingSimulator();
    
    // Make it available globally for debugging
    window.hackSimulator = simulator;
});