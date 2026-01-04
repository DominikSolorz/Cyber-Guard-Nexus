# 🛡️ Cyber Guard Nexus - Hacking Simulator

![Version](https://img.shields.io/badge/version-2.0.0-green.svg)
![License](https://img.shields.io/badge/license-Educational-blue.svg)
![Status](https://img.shields.io/badge/status-Active-success.svg)

A fully immersive and realistic cyber hacking simulator designed for educational and entertainment purposes. This simulator provides an authentic experience of cybersecurity operations without accessing any real systems.

## ⚠️ IMPORTANT DISCLAIMER

**THIS IS A SIMULATION FOR EDUCATIONAL AND ENTERTAINMENT PURPOSES ONLY**

- All activities within this simulator are **completely fictional**
- No real systems, networks, or data are accessed or compromised
- This tool does **NOT** promote or facilitate illegal activities
- Unauthorized access to computer systems is **ILLEGAL**
- Use this simulator **responsibly and ethically**

## 🌟 Features

### 1. Dynamic Interactivity
- **Port Scanning**: Simulate realistic port scanning operations with detailed service detection
- **Brute-Force Attacks**: Visual progress tracking for simulated password cracking attempts
- **Server Connections**: TCP handshake simulation with realistic connection sequences
- **Real-time Updates**: Live terminal output with typing animations and status indicators

### 2. Advanced Front-end Design
- **Modern CSS Animations**: Scanline effects, glowing text, typing animations, and smooth transitions
- **Three.js Integration**: Interactive 3D network map visualization with animated nodes
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Dark Cyber Theme**: Professional hacker aesthetic with green terminal styling

### 3. Multiple Fake Modules
The simulator includes several realistic target modules:

#### 💻 Personal Computer
- Simulated Windows 10 desktop environment
- File system with folders (Documents, Downloads, Photos)
- Accessible password files for educational demonstrations

#### 🏦 Bank Portal
- Fake online banking interface
- Login simulation with account dashboard
- Balance display and transaction views

#### 🖥️ Server Terminal
- Remote server terminal access simulation
- Linux-style command execution
- File system navigation and configuration viewing

#### 📧 Email Server
- Corporate email system simulation
- Inbox with multiple emails containing sensitive information
- Realistic email content for social engineering scenarios

### 4. AI-Driven Response System
- **Access Granted/Denied**: Randomized realistic server responses
- **Trace Detection**: Security alert simulations
- **Success Messages**: Contextual feedback based on operations
- **Error Handling**: Realistic failure scenarios

### 5. Comprehensive Hacking Tools

#### Port Scanner
- Custom IP targeting
- Service detection on common ports (21, 22, 80, 443, 3306, 8080)
- Vulnerability discovery simulation

#### Brute Force Tool
- Multiple protocol support (SSH, FTP, HTTP)
- Visual progress bar
- Success/failure feedback with password reveals

#### Packet Sniffer
- Network interface selection
- Real-time packet capture simulation
- Protocol analysis (TCP, UDP, HTTP, HTTPS, DNS)

### 6. Terminal Features
- **Command History**: Navigate previous commands with arrow keys
- **Auto-complete**: Tab completion for common commands
- **Multiple Commands**: 
  - `help` - Display all available commands
  - `scan [target]` - Port scan simulation
  - `connect [ip]` - Server connection
  - `crack [target]` - Brute force attack
  - `exploit [vuln]` - Vulnerability exploitation
  - `status` - System status display
  - `clear` - Clear terminal
  - `whoami`, `ls`, `pwd`, `ifconfig`, `nmap` - Standard Unix commands

### 7. Customization & Scalability
- **Modular Architecture**: Easy to add new scenarios and modules
- **Configuration System**: Customizable responses and behaviors
- **Extensible Design**: Well-structured code for future enhancements

## 🚀 Installation & Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required for basic functionality
- Optional: Local web server for optimal performance

### Quick Start

#### Option 1: Direct File Access
1. Clone or download this repository
2. Navigate to the `public/` directory
3. Open `index.html` in your web browser

```bash
cd public/
# Open index.html in your browser
```

#### Option 2: Local Server (Recommended)
Using Python:
```bash
cd public/
python -m http.server 8000
# Visit http://localhost:8000 in your browser
```

Using Node.js:
```bash
cd public/
npx http-server -p 8000
# Visit http://localhost:8000 in your browser
```

Using PHP:
```bash
cd public/
php -S localhost:8000
# Visit http://localhost:8000 in your browser
```

#### Option 3: Development Mode (with Vite)
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:5173
```

#### Option 4: Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📖 Usage Guide

### Getting Started

1. **Accept the Disclaimer**: When you first launch the simulator, you'll see a legal disclaimer. Read it carefully and click "I Understand" to proceed.

2. **Explore the Interface**: The main interface consists of four tabs:
   - **Terminal**: Main command-line interface
   - **Network Map**: 3D visualization of network topology
   - **Target Modules**: Access to fake systems (PC, Bank, Server, Email)
   - **Hacking Tools**: Dedicated tools for scanning, brute-forcing, and sniffing

### Using the Terminal

The terminal is your primary interface for running hacking simulations:

```bash
# Display help
help

# Scan a target
scan 192.168.1.1

# Connect to a server
connect 10.0.0.1

# Crack a password
crack target.com

# Exploit a vulnerability
exploit CVE-2023-1234

# Check system status
status

# Clear the screen
clear
```

### Using Target Modules

1. Navigate to the "Target Modules" tab
2. Click "Launch" on any module card
3. A popup window will appear with the simulated system
4. Interact with the system:
   - **PC**: Click folders and files to view contents
   - **Bank**: Enter any credentials to access the dashboard
   - **Server**: Type commands in the terminal
   - **Email**: Click emails to read their contents

### Using Hacking Tools

#### Port Scanner
1. Go to "Hacking Tools" tab
2. Enter an IP address or leave blank for random
3. Click "Start Scan"
4. View the results showing open/closed ports

#### Brute Force
1. Enter a target system name
2. Select the protocol (SSH, FTP, HTTP)
3. Click "Start Attack"
4. Watch the progress bar and wait for results

#### Packet Sniffer
1. Select a network interface
2. Click "Start Capture"
3. Watch real-time packet information
4. Click "Stop" when finished

### Network Map

The Network Map tab displays a 3D visualization of a simulated network:
- Green spheres represent network nodes
- Lines show connections between nodes
- The map rotates automatically
- Hover over nodes for details (future feature)

## 🎨 Customization

### Adding New Commands

Edit `public/script.js` and add a new case in the `executeCommand` function:

```javascript
case 'mycommand':
    logToConsole('My custom command output', 'success');
    break;
```

### Adding New Modules

1. Add HTML structure for your module window in `index.html`
2. Add a module card in the "Target Modules" section
3. Create initialization function in `script.js`
4. Style your module in `styles.css`

### Customizing Responses

Modify the `AIResponses` object in `script.js`:

```javascript
const AIResponses = {
    accessGranted: [
        'Your custom access granted message',
        // Add more variations
    ],
    // Add new response categories
};
```

## 🏗️ Project Structure

```
public/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── script.js           # Core functionality and logic
├── assets/
│   ├── css/           # Additional stylesheets
│   └── js/            # Additional scripts
├── login/             # Login page (legacy)
├── register/          # Registration page (legacy)
└── privacy/           # Privacy policy page
```

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Advanced animations and responsive design
- **Vanilla JavaScript**: No framework dependencies
- **Three.js**: 3D network visualization (loaded via CDN)

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Performance
- Lightweight: ~100KB total (excluding Three.js)
- No build step required for basic usage
- Optimized animations for 60fps performance

## 🔒 Security & Ethics

### Educational Use Cases
- Cybersecurity training
- Awareness demonstrations
- Academic research
- Penetration testing education

### Ethical Guidelines
1. **Never use knowledge from this simulator for illegal activities**
2. **Always obtain authorization before testing real systems**
3. **Respect privacy and data protection laws**
4. **Use this tool to promote cybersecurity awareness**
5. **Report real vulnerabilities responsibly**

## 🐛 Troubleshooting

### Issue: Three.js network map not loading
**Solution**: Ensure you have internet connection as Three.js loads from CDN. Alternatively, download Three.js locally.

### Issue: Animations are slow or choppy
**Solution**: Close other browser tabs and ensure hardware acceleration is enabled in your browser settings.

### Issue: Module windows don't close
**Solution**: Refresh the page. If the issue persists, clear your browser cache.

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add comments for complex logic
- Test on multiple browsers
- Update documentation for new features

## 📝 License

This project is licensed for **Educational and Entertainment Purposes Only**. 

**By using this software, you agree to:**
- Use it only for legal and ethical purposes
- Not hold the authors responsible for any misuse
- Comply with all applicable laws and regulations

## 🙏 Acknowledgments

- Inspired by real cybersecurity tools and practices
- Built for educational purposes to promote cybersecurity awareness
- Thanks to the open-source community for tools and libraries

## 📞 Contact & Support

For questions, suggestions, or issues:
- Open an issue on GitHub
- Check existing documentation
- Review the code comments

## 🗺️ Roadmap

### Planned Features
- [ ] More target modules (IoT devices, databases)
- [ ] Save/load simulation scenarios
- [ ] Difficulty levels and challenges
- [ ] Achievement system
- [ ] Tutorial mode for beginners
- [ ] Multi-language support
- [ ] Sound effects and audio feedback
- [ ] Export terminal logs
- [ ] Custom scenario builder

## 📚 Learning Resources

To learn more about real cybersecurity:
- [OWASP](https://owasp.org/) - Web application security
- [Hack The Box](https://www.hackthebox.eu/) - Legal hacking practice
- [TryHackMe](https://tryhackme.com/) - Cybersecurity training
- [Cybrary](https://www.cybrary.it/) - Free cyber security training

---

**Remember: With great power comes great responsibility. Use your cybersecurity knowledge ethically!**

Made with 💚 for education and awareness
