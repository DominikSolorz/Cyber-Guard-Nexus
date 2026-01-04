import { TerminalOutput, ScanResult } from '../types';
import { getAIResponse } from './aiService';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const executeCommand = async (
  command: string, 
  target: string | null
): Promise<TerminalOutput[]> => {
  const outputs: TerminalOutput[] = [];
  const parts = command.trim().split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  const addOutput = (text: string, type: TerminalOutput['type'] = 'info') => {
    outputs.push({ text, type, timestamp: new Date() });
  };

  switch (cmd) {
    case 'help':
      addOutput('Available Commands:', 'system');
      addOutput('  help              - Show this help message');
      addOutput('  scan <ip>         - Scan target for open ports');
      addOutput('  nmap <ip>         - Advanced port scanning');
      addOutput('  connect <ip>      - Connect to target system');
      addOutput('  exploit <vuln>    - Attempt to exploit vulnerability');
      addOutput('  bruteforce <service> - Brute force attack on service');
      addOutput('  stealth           - Enable stealth mode');
      addOutput('  proxy <ip>        - Route through proxy');
      addOutput('  decrypt <file>    - Decrypt encrypted file');
      addOutput('  keylog            - Install keylogger');
      addOutput('  backdoor          - Install backdoor');
      addOutput('  exfiltrate        - Extract sensitive data');
      addOutput('  clear             - Clear terminal');
      addOutput('  exit              - Exit terminal');
      break;

    case 'scan':
      if (!args[0]) {
        addOutput('Usage: scan <ip>', 'error');
        break;
      }
      await performPortScan(args[0], addOutput);
      break;

    case 'nmap':
      if (!args[0]) {
        addOutput('Usage: nmap <ip>', 'error');
        break;
      }
      await performAdvancedScan(args[0], addOutput);
      break;

    case 'connect':
      if (!args[0]) {
        addOutput('Usage: connect <ip>', 'error');
        break;
      }
      await performConnection(args[0], addOutput);
      break;

    case 'exploit':
      if (!args[0]) {
        addOutput('Usage: exploit <vulnerability>', 'error');
        break;
      }
      await performExploit(args.join(' '), addOutput);
      break;

    case 'bruteforce':
      if (!args[0]) {
        addOutput('Usage: bruteforce <service>', 'error');
        break;
      }
      await performBruteforce(args[0], addOutput);
      break;

    case 'stealth':
      addOutput('Enabling stealth mode...', 'warning');
      await delay(800);
      addOutput('✓ IP spoofing enabled', 'success');
      addOutput('✓ MAC address randomized', 'success');
      addOutput('✓ Traffic encryption active', 'success');
      addOutput('Stealth mode: ACTIVE', 'success');
      break;

    case 'proxy':
      if (!args[0]) {
        addOutput('Usage: proxy <ip>', 'error');
        break;
      }
      addOutput(`Routing through proxy ${args[0]}...`, 'info');
      await delay(600);
      addOutput('✓ Proxy connection established', 'success');
      break;

    case 'decrypt':
      if (!args[0]) {
        addOutput('Usage: decrypt <file>', 'error');
        break;
      }
      await performDecryption(args[0], addOutput);
      break;

    case 'keylog':
      addOutput('Installing keylogger...', 'warning');
      await delay(1000);
      addOutput('✓ Keylogger installed: /tmp/.syslog', 'success');
      addOutput('✓ Capturing keystrokes...', 'success');
      break;

    case 'backdoor':
      addOutput('Installing persistent backdoor...', 'warning');
      await delay(1200);
      addOutput('✓ Backdoor installed on port 4444', 'success');
      addOutput('✓ Auto-start on boot enabled', 'success');
      break;

    case 'exfiltrate':
      await performExfiltration(addOutput);
      break;

    case 'clear':
      // This is handled by the Terminal component
      addOutput('Terminal cleared', 'system');
      break;

    case 'exit':
      addOutput('Closing connection...', 'warning');
      await delay(500);
      addOutput('Connection closed.', 'system');
      break;

    case 'whoami':
      addOutput('root', 'success');
      break;

    case 'pwd':
      addOutput('/root/cyberguard', 'info');
      break;

    case 'ls':
      addOutput('exploits/  payloads/  tools/  data/  logs/', 'info');
      break;

    default:
      // Try to get AI response for unknown commands
      addOutput(`Command not found: ${cmd}`, 'error');
      addOutput('Type "help" for available commands.', 'info');
      break;
  }

  return outputs;
};

async function performPortScan(ip: string, addOutput: Function) {
  addOutput(`Starting port scan on ${ip}...`, 'info');
  await delay(500);
  
  const ports = [21, 22, 80, 135, 139, 443, 445, 3306, 3389, 8080];
  const openPorts: number[] = [];

  for (let i = 0; i < ports.length; i++) {
    const port = ports[i];
    const isOpen = Math.random() > 0.5;
    
    if (isOpen) {
      openPorts.push(port);
      addOutput(`Port ${port}/tcp   OPEN`, 'success');
    }
    
    if (i % 3 === 0) await delay(200);
  }

  addOutput('', 'info');
  addOutput(`Scan complete. Found ${openPorts.length} open ports.`, 'success');
}

async function performAdvancedScan(ip: string, addOutput: Function) {
  addOutput(`Starting Nmap scan on ${ip}...`, 'info');
  addOutput('', 'info');
  await delay(800);
  
  addOutput('PORT     STATE SERVICE       VERSION', 'system');
  addOutput('22/tcp   open  ssh           OpenSSH 8.2p1', 'success');
  await delay(300);
  addOutput('80/tcp   open  http          Apache 2.4.41', 'success');
  await delay(300);
  addOutput('443/tcp  open  https         Apache 2.4.41', 'success');
  await delay(300);
  addOutput('3306/tcp open  mysql         MySQL 5.7.33', 'success');
  await delay(300);
  
  addOutput('', 'info');
  addOutput('OS: Linux 5.4.0-42-generic', 'info');
  addOutput('', 'info');
  addOutput('Scan complete.', 'success');
}

async function performConnection(ip: string, addOutput: Function) {
  addOutput(`Attempting to connect to ${ip}...`, 'info');
  await delay(1000);
  
  const success = Math.random() > 0.3;
  
  if (success) {
    addOutput('✓ Connection established', 'success');
    addOutput(`Connected to ${ip}`, 'success');
    addOutput('Waiting for authentication...', 'warning');
  } else {
    addOutput('✗ Connection refused', 'error');
    addOutput('Target may have firewall enabled', 'warning');
  }
}

async function performExploit(vulnerability: string, addOutput: Function) {
  addOutput(`Loading exploit: ${vulnerability}...`, 'warning');
  await delay(800);
  addOutput('Preparing payload...', 'info');
  await delay(600);
  addOutput('Sending exploit...', 'warning');
  await delay(1000);
  
  const success = Math.random() > 0.4;
  
  if (success) {
    addOutput('✓ Exploit successful!', 'success');
    addOutput('✓ Shell access gained', 'success');
    addOutput('root@target:~#', 'success');
  } else {
    addOutput('✗ Exploit failed', 'error');
    addOutput('Target may be patched or IDS detected intrusion', 'warning');
  }
}

async function performBruteforce(service: string, addOutput: Function) {
  addOutput(`Starting brute force attack on ${service}...`, 'warning');
  await delay(500);
  
  const passwords = ['admin', '123456', 'password', 'root', 'admin123', 'letmein', 'qwerty'];
  
  for (let i = 0; i < 5; i++) {
    addOutput(`Trying: ${passwords[i]}... FAILED`, 'error');
    await delay(300);
  }
  
  addOutput(`Trying: ${passwords[5]}... SUCCESS!`, 'success');
  await delay(300);
  addOutput('', 'info');
  addOutput(`✓ Password found: ${passwords[5]}`, 'success');
  addOutput('✓ Access granted', 'success');
}

async function performDecryption(file: string, addOutput: Function) {
  addOutput(`Decrypting ${file}...`, 'warning');
  await delay(500);
  addOutput('Analyzing encryption algorithm...', 'info');
  await delay(700);
  addOutput('Detected: AES-256-CBC', 'info');
  await delay(600);
  addOutput('Brute forcing encryption key...', 'warning');
  await delay(1200);
  
  const success = Math.random() > 0.35;
  
  if (success) {
    addOutput('✓ Decryption successful', 'success');
    addOutput(`✓ File saved to: ${file}.decrypted`, 'success');
  } else {
    addOutput('✗ Decryption failed', 'error');
    addOutput('Key length may exceed brute force capabilities', 'warning');
  }
}

async function performExfiltration(addOutput: Function) {
  addOutput('Searching for sensitive data...', 'warning');
  await delay(800);
  addOutput('Found: /var/db/users.sql', 'success');
  await delay(300);
  addOutput('Found: /etc/passwords.txt', 'success');
  await delay(300);
  addOutput('Found: /home/admin/keys.pem', 'success');
  await delay(500);
  addOutput('', 'info');
  addOutput('Compressing files...', 'info');
  await delay(700);
  addOutput('Encrypting archive...', 'info');
  await delay(700);
  addOutput('Uploading to remote server...', 'warning');
  await delay(1000);
  addOutput('✓ Exfiltration complete', 'success');
  addOutput('✓ 3 files transferred (2.4 MB)', 'success');
}
