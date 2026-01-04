# Cyber Guard Nexus - Advanced Hacking Simulator

## ⚠️ EDUCATIONAL PURPOSES ONLY ⚠️

This is a **simulation tool designed strictly for educational purposes**. It demonstrates cybersecurity concepts, penetration testing methodologies, and network security in a safe, controlled environment.

**IMPORTANT LEGAL NOTICE:**
- Unauthorized access to computer systems is illegal
- This simulator is for learning only
- Do not use these techniques on real systems without permission
- Always follow ethical hacking guidelines and obtain proper authorization

## Features

### 🎯 Core Functionalities

#### 1. Automatic Terminal Command Typing
- Commands are automatically typed character-by-character with realistic delays
- Simulates actual typing speed and patterns
- Supports commands like `nmap scan`, `port brute`, `server exploit`

#### 2. Dynamic AI-Powered Responses
- Realistic server-like responses
- System vulnerability reports
- Penetration test results
- Security alerts including "Trace Detected" and "Access Granted" warnings
- Randomized outcomes for authentic simulation

#### 3. Interactive 3D Visual Effects
- **Three.js Integration**: 3D hacking grid visualization
- **Animated Grid**: Rotating grid representing network topology
- **Particle Systems**: Data flow animations showing network traffic
- **Matrix Background**: Classic falling code effect for immersion

### 🎨 Aesthetic Enhancements

- **Dark Terminal UI**: Authentic command-line interface
- **Neon Text Effects**: Green terminal text with color-coded alerts
  - Green: System messages and success
  - Cyan: Information
  - Yellow: Warnings
  - Red: Errors and critical alerts
- **Glitch Effects**: Title text with cyberpunk-style glitch animation
- **Matrix-Style Background**: Falling characters animation
- **Smooth Animations**: Fade-in effects for console output

### 🎮 Scenario Modules

#### 1. Corporate Network Hacking
- Simulate breaking through corporate firewalls
- Exploit vulnerabilities in enterprise systems
- Gain administrative access to internal servers
- Advanced IDS (Intrusion Detection System) simulation

#### 2. Wi-Fi Network Attacks
- Network discovery and scanning
- WPA2 encryption cracking simulation
- Handshake capture demonstration
- Dictionary attack visualization

#### 3. Custom Session
- Free exploration mode
- Test all available commands
- Practice penetration testing workflows

### 📊 Live Statistics

- **Ports Scanned**: Track network scanning progress
- **Vulnerabilities Found**: Count discovered security flaws
- **Access Level**: Display current privilege level (NONE → USER → ROOT)
- **Trace Progress**: Visual indicator of detection risk

### 🎯 Trace Detection System

- Dynamic trace level that increases with risky actions
- Visual progress bar showing detection risk
- Three threat levels:
  - **CLEAR** (Green): Safe operations
  - **ELEVATED** (Yellow): Moderate risk
  - **CRITICAL** (Red): High detection risk
- Realistic IDS alerts and warnings

## Available Commands

| Command | Description |
|---------|-------------|
| `help` | Display available commands and usage |
| `clear` / `cls` | Clear the console output |
| `nmap scan` | Scan target network for open ports |
| `port brute` | Attempt brute force attack on discovered ports |
| `server exploit` | Exploit server vulnerabilities for privilege escalation |
| `wifi scan` | Scan for available Wi-Fi networks |
| `wifi crack` | Attempt to crack Wi-Fi password |
| `status` | Show current mission status and statistics |
| `reset` | Reset session statistics and start fresh |

## Quick Start Guide

### Method 1: Direct File Access (Simplest)

1. **Navigate to the `public` directory**
   ```bash
   cd public
   ```

2. **Open `index.html` in your web browser**
   - Double-click `index.html`, or
   - Right-click and select "Open with" → your preferred browser

### Method 2: Local Web Server (Recommended)

Using a local web server is recommended for the best experience with all features.

#### Option A: Python HTTP Server
```bash
cd public
python3 -m http.server 8000
```
Then open: http://localhost:8000

#### Option B: Node.js HTTP Server
```bash
npm install -g http-server
cd public
http-server -p 8000
```
Then open: http://localhost:8000

#### Option C: PHP Built-in Server
```bash
cd public
php -S localhost:8000
```
Then open: http://localhost:8000

### Method 3: Using npm/Vite (Full Development)

1. **Install dependencies** (from root directory)
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Preview production build**
   ```bash
   npm run preview
   ```

## Deployment Guide

### GitHub Pages

1. **Enable GitHub Pages** in repository settings
   - Go to Settings → Pages
   - Select source: `main` branch
   - Select folder: `/public` or `/` (depending on your structure)

2. **Access your deployed site**
   - URL: `https://<username>.github.io/<repository-name>/`

### Netlify

1. **Connect repository** to Netlify
2. **Build settings**:
   - Build command: `npm run build` (if using Vite)
   - Publish directory: `dist` or `public`
3. **Deploy**

### Vercel

1. **Import project** to Vercel
2. **Configure**:
   - Framework: Vite (or Static)
   - Root directory: `./`
   - Output directory: `dist` or `public`
3. **Deploy**

### Traditional Web Hosting

1. **Upload the `public` folder** contents to your web server
2. **Ensure the web server** serves `index.html` as the default page
3. **No server-side processing required** - pure client-side application

## Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

**Requirements:**
- Modern browser with ES6+ support
- WebGL support for 3D visualizations
- Canvas support for Matrix background

## File Structure

```
Cyber-Guard-Nexus/
├── public/             # Main hacking simulator application
│   ├── index.html      # Main HTML file with UI structure
│   ├── styles.css      # Complete styling with animations
│   ├── script.js       # Main simulator logic and functionality
│   └── README.md       # This documentation file
├── src/                # Additional source files (Vite project)
├── package.json        # Node.js dependencies (optional)
├── vite.config.ts      # Vite configuration (optional)
└── index.html          # Root index (redirects or separate app)
```

**Note**: The hacking simulator is self-contained in the `public/` directory and can run independently.

## Technology Stack

- **HTML5**: Semantic markup and structure
- **CSS3**: Advanced styling with animations and effects
- **JavaScript (ES6+)**: Modern vanilla JavaScript
- **Three.js**: 3D graphics and visualizations (loaded from CDN)
- **Canvas API**: Matrix background effect

### Security Note

Three.js is currently loaded from the unpkg CDN for simplicity. For production use, consider:
- Downloading Three.js locally for better security
- Using npm/package manager with SRI (Subresource Integrity) checks
- Implementing Content Security Policy (CSP) headers

## Educational Use Cases

This simulator is designed for:

1. **Cybersecurity Education**
   - Teaching penetration testing concepts
   - Demonstrating network security principles
   - Understanding hacking methodologies

2. **Training Environments**
   - Security awareness training
   - Ethical hacking courses
   - IT security certifications prep

3. **Demonstrations**
   - Security conference presentations
   - Educational workshops
   - Cybersecurity awareness events

## Customization

### Adding New Commands

Edit `script.js` and add to the `processCommand` method:

```javascript
case cmd.startsWith('your-command'):
    await this.yourCommandFunction();
    break;
```

### Modifying Scenarios

Edit scenario methods in `script.js`:
- `startCorporateScenario()`
- `startWiFiScenario()`
- `startCustomScenario()`

### Changing Colors/Theme

Modify CSS variables in `styles.css`:
- Text colors: `.system`, `.info`, `.warning`, `.error`, `.success`
- Background: `body { background-color: ... }`
- Borders and accents: Look for `#00ff00` (green) color codes

## Performance Optimization

For better performance on lower-end devices:

1. **Reduce particle count** in `setupThreeJS()`:
   ```javascript
   const particlesCount = 500; // Reduced from 1000
   ```

2. **Adjust Matrix effect**:
   ```javascript
   const fontSize = 16; // Increased from 14 (fewer columns)
   ```

3. **Disable animations** by commenting out the Three.js section

## Troubleshooting

### Three.js not loading
- Check internet connection (loaded from CDN)
- Verify browser console for errors
- Ensure WebGL is enabled in browser

### Commands not working
- Accept the disclaimer first
- Select a scenario
- Check browser console for errors

### Styling issues
- Clear browser cache
- Ensure `styles.css` is loaded
- Check for CSS conflicts if embedded in another site

## Credits

**Developed for Cyber Guard Nexus Project**

- Educational cybersecurity simulation
- Built with modern web technologies
- Designed for safe, legal learning

## License

This project is released for educational purposes. Please use responsibly and ethically.

## Disclaimer

**THIS SOFTWARE IS PROVIDED FOR EDUCATIONAL PURPOSES ONLY**

The creators and contributors of this software:
- Do not condone illegal hacking activities
- Are not responsible for misuse of this educational tool
- Recommend only using these concepts in authorized environments
- Encourage ethical hacking practices with proper authorization

**Remember:** Always hack legally and ethically. Unauthorized access to computer systems is illegal and punishable by law.

---

**Stay Safe. Hack Responsibly. Learn Continuously.**
