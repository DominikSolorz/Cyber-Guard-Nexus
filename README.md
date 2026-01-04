# Cyber Guard Nexus - Advanced Hacking Simulator

![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Educational](https://img.shields.io/badge/purpose-educational-orange.svg)

An advanced, AI-powered hacking simulator designed for educational and entertainment purposes. This immersive platform provides realistic cybersecurity scenarios, interactive terminal interfaces, and stunning 3D network visualizations.

## ⚠️ LEGAL DISCLAIMER

**IMPORTANT: READ BEFORE USE**

This simulator is developed **EXCLUSIVELY** for:
- ✅ Educational purposes
- ✅ Cybersecurity training
- ✅ Entertainment

**This tool:**
- ❌ Does NOT perform actual hacking activities
- ❌ Does NOT access real computer systems
- ❌ Does NOT contain real exploits or malware
- ❌ Should NOT be used for illegal purposes

All simulations are **FICTIONAL** and occur entirely within your browser. Using real hacking tools against systems without permission is **ILLEGAL** and can result in severe legal consequences.

## 🚀 Features

### 1. AI Integration
- Dynamic AI-powered responses to user commands
- Contextual feedback based on actions
- Realistic simulation of system responses
- Non-repetitive, engaging interactions

### 2. Interactive Hacking Tools
- **Terminal Interface**: Full-featured command-line interface with command history
- **Port Scanner**: Simulate network port scanning
- **Brute Force Tool**: Simulate password cracking attempts
- **Exploit Framework**: Test various exploitation techniques
- **Network Map**: 3D visualization of network topology

### 3. Multiple Target Systems
- **Bank Servers**: High-security financial systems
- **Personal Computers**: Home user systems
- **Corporate Networks**: Enterprise-level infrastructure
- Progressive difficulty levels: Easy, Medium, Hard, Expert

### 4. Modern UI/UX
- Sleek, cyberpunk-inspired interface
- Real-time terminal output with color-coded responses
- Smooth animations and transitions
- Fully responsive design for all screen sizes
- 3D network visualization using Three.js

### 5. Advanced Features
- Command history (use arrow keys)
- Sound effects for immersive experience
- Multiple hacking scenarios
- Progress tracking
- Success/failure mechanics

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Modern web browser with WebGL support

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/DominikSolorz/Cyber-Guard-Nexus.git
cd Cyber-Guard-Nexus
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

The application will start on `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

The production build will be created in the `dist/` directory.

### 5. Preview Production Build
```bash
npm run preview
```

## 🎮 Usage

### Getting Started

1. **Accept the Disclaimer**: Upon first launch, read and accept the legal disclaimer
2. **Select a Target**: Choose from available systems (bank, personal, corporate)
3. **Access Terminal**: Navigate to the Terminal view
4. **Execute Commands**: Type `help` to see available commands

### Available Commands

| Command | Description | Example |
|---------|-------------|---------|
| `help` | Display all available commands | `help` |
| `scan <ip>` | Scan target for open ports | `scan 192.168.1.1` |
| `nmap <ip>` | Advanced port scanning | `nmap 192.168.1.1` |
| `connect <ip>` | Connect to target system | `connect 192.168.1.1` |
| `exploit <vuln>` | Attempt exploitation | `exploit sql-injection` |
| `bruteforce <service>` | Brute force attack | `bruteforce ssh` |
| `stealth` | Enable stealth mode | `stealth` |
| `proxy <ip>` | Route through proxy | `proxy 10.0.0.1` |
| `decrypt <file>` | Decrypt encrypted files | `decrypt data.enc` |
| `keylog` | Install keylogger | `keylog` |
| `backdoor` | Install backdoor | `backdoor` |
| `exfiltrate` | Extract sensitive data | `exfiltrate` |
| `clear` | Clear terminal | `clear` |
| `exit` | Exit terminal | `exit` |

### Terminal Features

- **Command History**: Use ↑ and ↓ arrow keys to navigate through previous commands
- **Auto-scroll**: Terminal automatically scrolls to show latest output
- **Color-coded Output**:
  - 🟢 Green: Success messages
  - 🔴 Red: Error messages
  - 🟡 Yellow: Warning messages
  - 🔵 Blue: System messages
  - ⚪ White: Information

### Network Map

- **3D Visualization**: Interactive 3D network topology
- **Node Types**:
  - 🔴 Servers
  - 🔵 Routers
  - 🟢 Clients
  - 🟡 Firewalls
- **Controls**:
  - Click and drag to rotate
  - Scroll to zoom
  - Click nodes for information

## 🏗️ Project Structure

```
Cyber-Guard-Nexus/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── Terminal.tsx     # Terminal interface
│   │   ├── NetworkMap.tsx   # 3D network visualization
│   │   ├── SystemSelector.tsx  # Target selection
│   │   └── DisclaimerModal.tsx # Legal disclaimer
│   ├── services/            # Business logic
│   │   ├── commandService.ts   # Command execution
│   │   └── aiService.ts        # AI response generation
│   ├── utils/               # Utility functions
│   │   └── soundManager.ts     # Audio feedback
│   ├── types/               # TypeScript definitions
│   │   └── index.ts
│   ├── App.tsx              # Main application
│   ├── main.tsx             # Entry point
│   └── styles.css           # Global styles
├── public/                  # Static assets
├── index.html              # HTML entry point
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite configuration
└── README.md               # This file
```

## 🎨 Customization

### Adding New Targets

Edit `/src/components/SystemSelector.tsx`:

```typescript
const TARGETS: Target[] = [
  {
    id: 'custom-01',
    name: 'Your Custom Target',
    type: 'corporate',
    difficulty: 'medium',
    ip: '10.0.0.100',
    description: 'Custom target description',
    ports: [80, 443, 3306],
    vulnerabilities: ['Custom Vuln 1', 'Custom Vuln 2']
  },
  // ... existing targets
];
```

### Adding New Commands

Edit `/src/services/commandService.ts`:

```typescript
case 'yourcommand':
  addOutput('Your custom output', 'info');
  // Add your command logic
  break;
```

### Styling

Modify `/src/styles.css` to customize colors, fonts, and animations.

## 🔧 Technologies Used

- **React 18**: UI framework
- **TypeScript**: Type-safe development
- **Three.js**: 3D graphics
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Three.js helpers
- **Vite**: Build tool and dev server
- **CSS3**: Styling and animations

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Future Enhancements

- [ ] Integration with real OpenAI API for dynamic responses
- [ ] More target systems and scenarios
- [ ] Achievements and scoring system
- [ ] Multiplayer mode
- [ ] Advanced 3D visualizations
- [ ] Mobile app version
- [ ] Tutorial mode for beginners
- [ ] Save/load progress
- [ ] Custom scenario builder

## 🐛 Known Issues

- None currently reported

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Dominik Solorz**
- GitHub: [@DominikSolorz](https://github.com/DominikSolorz)

## 🙏 Acknowledgments

- Inspired by cybersecurity training platforms
- Built for educational purposes only
- Thanks to the open-source community

## ⚖️ Ethical Use

This tool is created to:
- Teach cybersecurity concepts
- Demonstrate attack vectors for defensive purposes
- Provide safe practice environment

**Never use hacking tools on systems you don't own or have explicit permission to test.**

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Contact: [GitHub Issues](https://github.com/DominikSolorz/Cyber-Guard-Nexus/issues)

---

**Remember**: With great power comes great responsibility. Use your cybersecurity knowledge ethically and legally.

**This is a SIMULATION. Real hacking is illegal and unethical without permission.**

