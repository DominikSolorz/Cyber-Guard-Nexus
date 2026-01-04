# Cyber Guard Nexus - Hacking Simulator

A fictional hacking simulator that visualizes cybersecurity processes on a pretend terminal interface. This is purely for entertainment and educational purposes.

## Features

### 🎮 Interactive Commands
- **Scan Ports** - Simulates port scanning on random IP addresses
- **Hack Password** - Demonstrates brute force password cracking attempts
- **Open Connection** - Simulates establishing secure connections
- **Brute Force** - Shows automated attack attempts
- **Exploit System** - Demonstrates vulnerability exploitation
- **Clear Terminal** - Clears the terminal output

### 🎨 Visual Effects
- **Cyberpunk-style design** with neon green terminal aesthetic
- **Glitch animations** on the title
- **Scanline effects** simulating CRT monitors
- **Typing animations** for realistic log entries
- **Color-coded status messages**:
  - 🟢 Green: Success
  - 🔴 Red: Errors
  - 🟡 Yellow: Warnings
  - 🔵 Cyan: Info

### 📊 Statistics Tracking
- **Systems Hacked** - Count of successful exploits
- **Ports Scanned** - Total ports analyzed
- **Connections** - Number of connections established
- **Success Rate** - Percentage of successful operations

### 🔊 Sound Effects
- **Keyboard typing sounds** during log entries (using Web Audio API)
- **Success notification** when operations succeed
- **Error sounds** when operations fail

## How to Use

### Local Testing
1. Open `hacking-simulator.html` directly in a web browser
2. Or serve it with a local HTTP server:
   ```bash
   python3 -m http.server 8080 --directory public
   # Then open http://localhost:8080/hacking-simulator.html
   ```

### GitHub Pages Deployment
The simulator is a single HTML file with embedded CSS and JavaScript, making it perfect for GitHub Pages:

1. The file is located at `public/hacking-simulator.html`
2. Access it via: `https://[username].github.io/Cyber-Guard-Nexus/hacking-simulator.html`

## Technical Details

### Built With
- **Pure HTML5/CSS3/JavaScript** - No external dependencies
- **Web Audio API** - For sound generation
- **CSS Animations** - For visual effects
- **Responsive Design** - Works on desktop and mobile

### Browser Compatibility
- Modern browsers with Web Audio API support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers supported with responsive design

## Educational Purpose

This simulator is designed for:
- Understanding cybersecurity concepts visually
- Educational demonstrations
- Entertainment purposes
- Learning about web development techniques

**Disclaimer**: This is a fictional simulator. All operations are fake and no actual hacking occurs.

## Customization

You can easily customize:
- **Colors**: Modify CSS color variables
- **Commands**: Add new functions in the JavaScript section
- **Animations**: Adjust timing and effects in CSS
- **Messages**: Change the fake log messages in JavaScript functions

## License

Part of the Cyber Guard Nexus project.
