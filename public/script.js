// ============================================================================
// CYBER GUARD NEXUS - HACKING SIMULATOR
// Educational & Entertainment Purposes Only
// ============================================================================

// DOM Elements
const consoleElement = document.getElementById('console');
const inputElement = document.getElementById('input');
const submitButton = document.getElementById('submit');
const statusElement = document.getElementById('status');
const securityElement = document.getElementById('security');
const connectionsElement = document.getElementById('connections');
const traceTimerElement = document.getElementById('trace-timer');
const timerValueElement = document.getElementById('timer-value');

// Game State
let gameState = {
    connections: 0,
    securityLevel: 'NOMINAL',
    isTraceActive: false,
    traceTimeRemaining: 0,
    commandHistory: [],
    currentTarget: null,
    hackedSystems: [],
    failedAttempts: 0
};

// Fake server database
const servers = [
    { id: 'srv-001', name: 'DataCore Alpha', ip: '192.168.1.101', difficulty: 'easy', ports: [22, 80, 443] },
    { id: 'srv-002', name: 'SecureVault Beta', ip: '192.168.1.102', difficulty: 'medium', ports: [22, 443, 8080] },
    { id: 'srv-003', name: 'Fortress Gamma', ip: '192.168.1.103', difficulty: 'hard', ports: [22, 443, 3389] },
    { id: 'srv-004', name: 'Pentagon Mirror', ip: '10.0.0.50', difficulty: 'extreme', ports: [22] }
];

// ============================================================================
// 3D BACKGROUND VISUALIZATION (Three.js)
// ============================================================================
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    // Create network nodes
    const nodes = [];
    const nodeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00, wireframe: true });
    
    for (let i = 0; i < 50; i++) {
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.x = (Math.random() - 0.5) * 20;
        node.position.y = (Math.random() - 0.5) * 20;
        node.position.z = (Math.random() - 0.5) * 20;
        scene.add(node);
        nodes.push(node);
    }
    
    // Create connections
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00BFFF, transparent: true, opacity: 0.3 });
    const lines = [];
    
    for (let i = 0; i < 30; i++) {
        const points = [];
        const node1 = nodes[Math.floor(Math.random() * nodes.length)];
        const node2 = nodes[Math.floor(Math.random() * nodes.length)];
        points.push(node1.position);
        points.push(node2.position);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, lineMaterial);
        scene.add(line);
        lines.push(line);
    }
    
    camera.position.z = 15;
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate nodes
        nodes.forEach((node, index) => {
            node.rotation.x += 0.001 * (index % 2 === 0 ? 1 : -1);
            node.rotation.y += 0.001;
        });
        
        // Pulse effect
        const time = Date.now() * 0.001;
        nodes.forEach((node, index) => {
            node.scale.x = node.scale.y = node.scale.z = 1 + Math.sin(time + index) * 0.2;
        });
        
        scene.rotation.y += 0.0005;
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
function logToConsole(message, color = 'default') {
    const timestamp = new Date().toLocaleTimeString();
    let prefix = '';
    
    switch(color) {
        case 'success':
            prefix = '[✓]';
            break;
        case 'error':
            prefix = '[✗]';
            break;
        case 'warning':
            prefix = '[!]';
            break;
        case 'system':
            prefix = '[SYS]';
            break;
        default:
            prefix = '>';
    }
    
    consoleElement.value += `\n[${timestamp}] ${prefix} ${message}`;
    consoleElement.scrollTop = consoleElement.scrollHeight;
}

function updateStatus(status) {
    gameState.status = status;
    statusElement.textContent = status;
    statusElement.parentElement.className = status.includes('ALERT') ? 'status-item alert' : 'status-item';
}

function updateSecurity(level) {
    gameState.securityLevel = level;
    securityElement.textContent = level;
}

function updateConnections(count) {
    gameState.connections = count;
    connectionsElement.textContent = count;
}

function typeWriter(message, callback) {
    let i = 0;
    const speed = 30;
    
    function type() {
        if (i < message.length) {
            consoleElement.value += message.charAt(i);
            consoleElement.scrollTop = consoleElement.scrollHeight;
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }
    
    type();
}

// ============================================================================
// TRACE COUNTDOWN FEATURE
// ============================================================================
function startTrace(duration = 60) {
    if (gameState.isTraceActive) return;
    
    gameState.isTraceActive = true;
    gameState.traceTimeRemaining = duration;
    traceTimerElement.style.display = 'block';
    
    logToConsole('⚠️ WARNING: Trace initiated! Complete your task quickly!', 'warning');
    updateStatus('ALERT: TRACE ACTIVE');
    updateSecurity('COMPROMISED');
    
    const interval = setInterval(() => {
        gameState.traceTimeRemaining--;
        const minutes = Math.floor(gameState.traceTimeRemaining / 60);
        const seconds = gameState.traceTimeRemaining % 60;
        timerValueElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (gameState.traceTimeRemaining <= 0) {
            clearInterval(interval);
            endTrace(false);
        }
    }, 1000);
    
    gameState.traceInterval = interval;
}

function endTrace(success) {
    gameState.isTraceActive = false;
    traceTimerElement.style.display = 'none';
    clearInterval(gameState.traceInterval);
    
    if (success) {
        logToConsole('✓ Trace evaded successfully! Connection severed.', 'success');
        updateStatus('SAFE');
        updateSecurity('NOMINAL');
    } else {
        logToConsole('✗ TRACE COMPLETE! Your location has been compromised!', 'error');
        logToConsole('System lockdown initiated. Restarting in safe mode...', 'system');
        setTimeout(() => {
            updateStatus('STANDBY');
            updateSecurity('NOMINAL');
            gameState.connections = 0;
            updateConnections(0);
        }, 3000);
    }
}

// ============================================================================
// COMMAND HANDLERS
// ============================================================================
const commands = {
    help: () => {
        logToConsole('═══════════════ AVAILABLE COMMANDS ═══════════════', 'system');
        logToConsole('help          - Display this help message');
        logToConsole('scan          - Scan for available servers');
        logToConsole('connect <id>  - Connect to a server (e.g., connect srv-001)');
        logToConsole('ports         - Scan ports on connected server');
        logToConsole('hack          - Attempt to hack connected server');
        logToConsole('brute <pass>  - Brute force password (e.g., brute admin123)');
        logToConsole('disconnect    - Disconnect from current server');
        logToConsole('status        - Show current system status');
        logToConsole('clear         - Clear console');
        logToConsole('exit          - Exit trace mode (if active)');
        logToConsole('═════════════════════════════════════════════════', 'system');
    },
    
    scan: () => {
        logToConsole('Initiating network scan...', 'system');
        updateStatus('SCANNING');
        
        setTimeout(() => {
            logToConsole('═══════════ DETECTED SERVERS ═══════════');
            servers.forEach(srv => {
                const status = gameState.hackedSystems.includes(srv.id) ? '[COMPROMISED]' : '[SECURED]';
                logToConsole(`${srv.id} | ${srv.name.padEnd(20)} | ${srv.ip} ${status}`);
            });
            logToConsole('═══════════════════════════════════════');
            logToConsole(`Found ${servers.length} servers. Use 'connect <id>' to connect.`, 'success');
            updateStatus('STANDBY');
        }, 2000);
    },
    
    connect: (args) => {
        if (!args || args.length === 0) {
            logToConsole('Usage: connect <server-id>', 'error');
            return;
        }
        
        const serverId = args[0];
        const server = servers.find(s => s.id === serverId);
        
        if (!server) {
            logToConsole(`Server '${serverId}' not found. Use 'scan' to list available servers.`, 'error');
            return;
        }
        
        logToConsole(`Establishing connection to ${server.name} (${server.ip})...`, 'system');
        updateStatus('CONNECTING');
        
        setTimeout(() => {
            gameState.currentTarget = server;
            gameState.connections++;
            updateConnections(gameState.connections);
            logToConsole(`✓ Connected to ${server.name}`, 'success');
            logToConsole(`Difficulty: ${server.difficulty.toUpperCase()}`, 'warning');
            updateStatus('CONNECTED');
            
            // Chance to trigger trace on medium+ difficulty
            if (server.difficulty !== 'easy' && Math.random() > 0.6) {
                setTimeout(() => startTrace(90), 2000);
            }
        }, 2500);
    },
    
    ports: () => {
        if (!gameState.currentTarget) {
            logToConsole('Not connected to any server. Use "connect <id>" first.', 'error');
            return;
        }
        
        logToConsole('Scanning ports...', 'system');
        
        setTimeout(() => {
            logToConsole(`═══ PORT SCAN: ${gameState.currentTarget.name} ═══`);
            gameState.currentTarget.ports.forEach(port => {
                const service = {22: 'SSH', 80: 'HTTP', 443: 'HTTPS', 8080: 'HTTP-PROXY', 3389: 'RDP'}[port] || 'UNKNOWN';
                logToConsole(`Port ${port}/tcp OPEN - ${service}`);
            });
            logToConsole('═══════════════════════════════════════');
            logToConsole('Port scan complete.', 'success');
        }, 1500);
    },
    
    hack: () => {
        if (!gameState.currentTarget) {
            logToConsole('Not connected to any server. Use "connect <id>" first.', 'error');
            return;
        }
        
        if (gameState.hackedSystems.includes(gameState.currentTarget.id)) {
            logToConsole('This system has already been compromised.', 'warning');
            return;
        }
        
        logToConsole('Initiating hack sequence...', 'system');
        updateStatus('HACKING');
        
        const difficulty = {
            'easy': 0.8,
            'medium': 0.5,
            'hard': 0.3,
            'extreme': 0.1
        }[gameState.currentTarget.difficulty];
        
        setTimeout(() => {
            logToConsole('Analyzing security protocols...');
            setTimeout(() => {
                logToConsole('Searching for vulnerabilities...');
                setTimeout(() => {
                    logToConsole('Attempting exploit...');
                    setTimeout(() => {
                        if (Math.random() < difficulty) {
                            gameState.hackedSystems.push(gameState.currentTarget.id);
                            logToConsole('═════════════════════════════════════', 'success');
                            logToConsole('✓✓✓ ACCESS GRANTED ✓✓✓', 'success');
                            logToConsole('═════════════════════════════════════', 'success');
                            logToConsole(`Successfully compromised ${gameState.currentTarget.name}!`, 'success');
                            updateStatus('HACK SUCCESSFUL');
                            
                            if (gameState.isTraceActive) {
                                endTrace(true);
                            }
                        } else {
                            gameState.failedAttempts++;
                            logToConsole('✗ Access denied. Security firewall blocked the attempt.', 'error');
                            logToConsole('Try using "brute <password>" to crack credentials.', 'warning');
                            updateStatus('HACK FAILED');
                            
                            if (gameState.failedAttempts >= 2 && !gameState.isTraceActive) {
                                startTrace(60);
                            }
                        }
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    },
    
    brute: (args) => {
        if (!gameState.currentTarget) {
            logToConsole('Not connected to any server. Use "connect <id>" first.', 'error');
            return;
        }
        
        if (!args || args.length === 0) {
            logToConsole('Usage: brute <password>', 'error');
            logToConsole('Common passwords: admin, password, 123456, root, admin123', 'warning');
            return;
        }
        
        const password = args[0];
        const validPasswords = ['admin', 'password', '123456', 'root', 'admin123', 'letmein', 'qwerty'];
        
        logToConsole(`Attempting brute force with password: ${password}`, 'system');
        updateStatus('BRUTE FORCING');
        
        setTimeout(() => {
            logToConsole('Testing credentials...');
            setTimeout(() => {
                if (validPasswords.includes(password.toLowerCase())) {
                    gameState.hackedSystems.push(gameState.currentTarget.id);
                    logToConsole('═════════════════════════════════════', 'success');
                    logToConsole('✓✓✓ CREDENTIALS ACCEPTED ✓✓✓', 'success');
                    logToConsole('═════════════════════════════════════', 'success');
                    logToConsole(`Password cracked! Access granted to ${gameState.currentTarget.name}`, 'success');
                    updateStatus('BREACH SUCCESSFUL');
                    
                    if (gameState.isTraceActive) {
                        endTrace(true);
                    }
                } else {
                    logToConsole('✗ Invalid credentials. Access denied.', 'error');
                    updateStatus('BRUTE FORCE FAILED');
                    
                    if (!gameState.isTraceActive && Math.random() > 0.5) {
                        startTrace(45);
                    }
                }
            }, 2000);
        }, 1000);
    },
    
    disconnect: () => {
        if (!gameState.currentTarget) {
            logToConsole('No active connection to disconnect.', 'warning');
            return;
        }
        
        logToConsole(`Disconnecting from ${gameState.currentTarget.name}...`, 'system');
        setTimeout(() => {
            gameState.currentTarget = null;
            logToConsole('Connection terminated.', 'success');
            updateStatus('STANDBY');
        }, 1000);
    },
    
    status: () => {
        logToConsole('═══════════ SYSTEM STATUS ═══════════', 'system');
        logToConsole(`Status: ${gameState.status || 'STANDBY'}`);
        logToConsole(`Security Level: ${gameState.securityLevel}`);
        logToConsole(`Active Connections: ${gameState.connections}`);
        logToConsole(`Trace Active: ${gameState.isTraceActive ? 'YES' : 'NO'}`);
        logToConsole(`Current Target: ${gameState.currentTarget ? gameState.currentTarget.name : 'None'}`);
        logToConsole(`Compromised Systems: ${gameState.hackedSystems.length}`);
        logToConsole('═══════════════════════════════════');
    },
    
    clear: () => {
        consoleElement.value = '╔═══════════════════════════════════════════════════════════════╗\n';
        consoleElement.value += '║          CYBER GUARD NEXUS - SECURITY SIMULATOR v2.0          ║\n';
        consoleElement.value += '╚═══════════════════════════════════════════════════════════════╝\n\n';
        consoleElement.value += 'Console cleared.\nReady for input >\n';
    },
    
    exit: () => {
        if (gameState.isTraceActive) {
            endTrace(true);
        } else {
            logToConsole('No active trace to exit.', 'warning');
        }
    }
};

// ============================================================================
// COMMAND PROCESSOR
// ============================================================================
function processCommand(input) {
    const parts = input.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    gameState.commandHistory.push(input);
    logToConsole(`$ ${input}`, 'default');
    
    if (commands[command]) {
        commands[command](args);
    } else {
        logToConsole(`Command '${command}' not recognized. Type 'help' for available commands.`, 'error');
    }
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Three.js background
    initThreeJS();
    
    // Submit button click
    submitButton.addEventListener('click', () => {
        const command = inputElement.value.trim();
        inputElement.value = '';
        
        if (command === '') {
            logToConsole('Please enter a command.', 'warning');
            return;
        }
        
        processCommand(command);
    });
    
    // Enter key to submit
    inputElement.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitButton.click();
        }
    });
    
    // Focus input on load
    inputElement.focus();
    
    // Initial status
    updateStatus('STANDBY');
    updateSecurity('NOMINAL');
    updateConnections(0);
    
    // Welcome message
    setTimeout(() => {
        logToConsole('System ready. Type "help" for available commands.', 'success');
    }, 500);
});