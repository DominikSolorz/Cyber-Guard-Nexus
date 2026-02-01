# Cyber Guard Nexus

🛡️ A modular security & AI platform for monitoring automation and system integration.

## Overview

Cyber Guard Nexus is a modern web-based security monitoring dashboard that provides real-time insights into your system's security status, network activity, and threat detection.

## Features

- **Real-time Dashboard**: Monitor active threats, system status, and network connections
- **Security Monitoring**: Track network traffic, system performance, and security protocols
- **Alert System**: Stay informed about security events and system updates
- **Customizable Settings**: Configure monitoring intervals and notification preferences
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Project Structure

```
Cyber-Guard-Nexus/
├── public/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # CSS styles
│   └── app.js          # JavaScript functionality
├── README.md           # This file
└── .gitignore         # Git ignore rules
```

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No additional dependencies required - this is a standalone web application

### Installation

1. Clone the repository:
```bash
git clone https://github.com/DominikSolorz/Cyber-Guard-Nexus.git
cd Cyber-Guard-Nexus
```

2. Open the application:
   - Simply open `public/index.html` in your web browser
   - Or use a local web server (recommended):

**Using Python:**
```bash
cd public
python -m http.server 8000
# Then open http://localhost:8000 in your browser
```

**Using Node.js:**
```bash
npx http-server public -p 8000
# Then open http://localhost:8000 in your browser
```

## Usage

### Dashboard
The main dashboard displays:
- Active threats counter
- Number of monitored systems
- Active connections
- Daily scan count
- Recent activity feed

### Monitoring
View real-time status of:
- Network traffic
- System performance
- Security protocols

### Alerts
Check security alerts and system notifications.

### Settings
Configure:
- Real-time monitoring
- Automatic threat detection
- Email notifications
- Scan interval

Settings are automatically saved in your browser's local storage.

## Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with animations and transitions
- **Vanilla JavaScript**: No frameworks required
- **LocalStorage API**: For persistent settings

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Author

DominikSolorz

## Acknowledgments

- Modern UI/UX design principles
- Security dashboard best practices
- Responsive web design patterns
