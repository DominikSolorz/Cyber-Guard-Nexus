# Cyber Guard Nexus - Advanced Hacking Simulator

![Educational Banner](https://img.shields.io/badge/Purpose-Educational%2FEntertainment-red)
![Status](https://img.shields.io/badge/Status-Active-green)
![License](https://img.shields.io/badge/License-Educational%20Only-blue)

## ⚠️ DISCLAIMER

**This is a FICTIONAL educational and entertainment tool only.** All hacking activities simulated in this application are completely fake and do not interact with any real systems. This simulator is designed for:
- Educational purposes to understand cybersecurity concepts
- Entertainment and demonstration
- Training awareness about security threats

**DO NOT use real hacking tools without proper authorization. Unauthorized access to computer systems is illegal.**

## 🎮 Features

### Realistic Terminal Interface
- **Advanced Commands:**
  - `nmap scan` - Network port scanning simulation
  - `sqlmap injection` - SQL injection attack demonstration
  - `curl attack` - Data exfiltration simulation
  - `ping flood` - DoS attack simulation
  - `connect <ip>` - Establish connection to target
  - `disconnect` - Terminate connection
  - `status` - Show system status
  - `help` - Display help message
  - `clear` - Clear terminal

### Automated Scenarios
1. **Corporate Network Infiltration**
   - Multi-step automated attack scenario
   - Port scanning, SQL injection, and data exfiltration
   - Realistic progression with trace detection

2. **Wi-Fi Password Cracking**
   - Simulated handshake capture
   - Dictionary attack demonstration
   - Network access simulation

3. **Bank System Heist**
   - Admin panel bypass simulation
   - Database infiltration
   - High-security target scenario

4. **Manual Mode**
   - Full control over all commands
   - Build your own attack sequence
   - Learn command sequences

### Visual Effects
- **Matrix-Style Terminal:** Green text on black background with subtle effects
- **Network Visualization:** Animated network nodes with data packet flows
- **Trace Alerts:** Red warning system with countdown when detected
- **Status Indicators:** Real-time connection, trace level, and data metrics

### Audio Feedback
- Typewriter sound effects for commands
- Alert sounds for trace detection
- Connection/disconnection audio cues

## 🚀 Quick Start

### Running Locally

1. **Navigate to the `public` directory**
2. **Start a local web server:**

```bash
# Using Python 3
python3 -m http.server 8080

# Using Python 2
python -m SimpleHTTPServer 8080

# Using Node.js
npx http-server -p 8080

# Using PHP
php -S localhost:8080
```

3. **Open your browser** and navigate to `http://localhost:8080`

### No Installation Required
- Pure HTML/CSS/JavaScript
- No dependencies
- Works offline
- No build process needed

## 📖 Usage Guide

### Basic Commands

1. **Connect to a target:**
```
connect 192.168.1.100
```

2. **Scan for open ports:**
```
nmap scan
```

3. **Run SQL injection:**
```
sqlmap injection
```

4. **Exfiltrate data:**
```
curl attack
```

5. **DoS simulation:**
```
ping flood
```

6. **Check status:**
```
status
```

7. **Disconnect safely:**
```
disconnect
```

### Automated Scenarios

Simply click on one of the scenario buttons in the left panel:
- **Corporate Network** - Automated multi-step attack
- **Wi-Fi Crack** - Password cracking simulation
- **Bank Heist** - High-security breach scenario
- **Manual Mode** - Full manual control

### Understanding the Interface

#### Left Panel
- **System Status:** Shows connection state, trace level, and data exfiltrated
- **Scenarios:** Pre-programmed attack scenarios
- **Available Commands:** Quick reference for all commands

#### Center Panel
- **Terminal:** Main command interface
- Type commands and press Enter to execute
- Use arrow keys (↑/↓) to navigate command history

#### Right Panel
- **Network Visualization:** Visual representation of network connections
- **Trace Alert:** Warning system when detection level is high

## 🔧 Technical Details

### Technologies Used
- **HTML5** - Structure
- **CSS3** - Styling and animations
- **Vanilla JavaScript** - Logic and interactivity
- **Canvas API** - Network visualization
- **Web Audio API** - Sound effects

### Browser Compatibility
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

### Performance
- Optimized rendering with requestAnimationFrame
- Single AudioContext for efficient audio
- Minimal DOM manipulation
- No external dependencies

## 📚 Educational Value

This simulator helps users understand:
- How port scanning works
- SQL injection vulnerabilities
- Data exfiltration techniques
- DoS attack patterns
- Intrusion detection systems
- Trace and detection mechanisms

**Remember:** This is for learning purposes only. Real hacking without authorization is illegal and unethical.

## 🛡️ Security Notice

This application:
- ✅ Does NOT connect to any real systems
- ✅ Does NOT perform actual hacking
- ✅ Does NOT collect or transmit data
- ✅ Runs entirely in your browser
- ✅ Works offline
- ✅ Is safe for educational demonstrations

## 📝 License

This project is for educational and entertainment purposes only. Use responsibly and ethically.

## 🔗 Resources

To learn more about cybersecurity:
- [OWASP](https://owasp.org/) - Web application security
- [Hack The Box](https://www.hackthebox.eu/) - Legal penetration testing practice
- [TryHackMe](https://tryhackme.com/) - Cybersecurity training
- [Cybrary](https://www.cybrary.it/) - Free cybersecurity courses

---

**Made for educational and entertainment purposes | Not for illegal use**
