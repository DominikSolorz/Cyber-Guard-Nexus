# 🛡️ Cyber Guard Nexus - Hacking Simulator

![Version](https://img.shields.io/badge/version-2.0.0-green.svg)
![License](https://img.shields.io/badge/license-Educational-blue.svg)
![Status](https://img.shields.io/badge/status-Active-success.svg)

A fully immersive and realistic cyber hacking simulator designed for educational and entertainment purposes. Experience authentic cybersecurity operations in a safe, simulated environment.

## ⚠️ LEGAL DISCLAIMER

**THIS IS A SIMULATION FOR EDUCATIONAL AND ENTERTAINMENT PURPOSES ONLY**

All activities within this simulator are completely fictional. No real systems, networks, or data are accessed. This tool does NOT promote or facilitate illegal activities. Unauthorized access to computer systems is ILLEGAL. Use responsibly and ethically.

## 🚀 Quick Start

### Option 1: Direct Access (Simplest)
```bash
cd public/
# Open index.html in your browser
```

### Option 2: Local Server (Recommended)
```bash
cd public/
python -m http.server 8000
# Visit http://localhost:8000
```

### Option 3: Development Mode
```bash
npm install
npm run dev
# Visit http://localhost:5173
```

## 🌟 Key Features

- **Interactive Terminal** - Full command-line interface with realistic hacking commands
- **3D Network Map** - Three.js powered visualization of network topology
- **Multiple Target Modules** - PC, Bank, Server, and Email simulations
- **Advanced Hacking Tools** - Port scanner, brute-force, packet sniffer
- **AI-Driven Responses** - Realistic server feedback and security alerts
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern Animations** - CSS animations and visual effects

## 📖 Documentation

For complete documentation, setup instructions, and usage guide, see:
- [Full Documentation](./public/README.md) - Comprehensive guide
- [Quick Start Guide](#quick-start) - Get running in minutes

## 🎯 Main Components

### 1. Terminal Interface
Execute realistic hacking commands:
- `scan [target]` - Port scanning
- `connect [ip]` - Server connection
- `crack [target]` - Brute-force attack
- `exploit [vuln]` - Vulnerability exploitation

### 2. Target Modules
- 💻 **Personal Computer** - Simulated PC with file system
- 🏦 **Bank Portal** - Fake online banking
- 🖥️ **Server Terminal** - Remote server access
- 📧 **Email Server** - Corporate email system

### 3. Hacking Tools
- **Port Scanner** - Scan targets for open ports
- **Brute Force** - Password cracking simulation
- **Packet Sniffer** - Network traffic monitoring

## 🛠️ Technology Stack

- HTML5, CSS3, Vanilla JavaScript
- Three.js for 3D visualization
- No build process required for basic usage
- Vite for development (optional)

## 📁 Project Structure

```
Cyber-Guard-Nexus/
├── public/              # Main simulator (standalone)
│   ├── index.html      # Main interface
│   ├── script.js       # Core functionality
│   ├── styles.css      # Styling & animations
│   └── README.md       # Full documentation
├── src/                # Alternative Phaser-based game
├── CANON/              # Project templates & patterns
├── package.json        # Dependencies
└── README.md           # This file
```

## 🎓 Educational Purpose

This simulator is designed to:
- Teach cybersecurity concepts
- Demonstrate hacking techniques safely
- Promote security awareness
- Provide hands-on learning experience

**Always use your knowledge ethically and legally!**

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

Educational and Entertainment Use Only. See [public/README.md](./public/README.md) for full license details.

## 🔗 Related Resources

- **Main Simulator**: `/public/` directory
- **Documentation**: `/public/README.md`
- **Legacy Content**: `/CANON/` for templates and patterns

---

**Made with 💚 for education and cybersecurity awareness**

**Remember: Use your skills to protect, not to harm!**
