# Cyber Guard Nexus

Advanced Cybersecurity Platform with real-time threat detection, vulnerability scanning, and security monitoring.

## 🚀 Features

- **Security Scanning**: Comprehensive network and application security scans
- **Vulnerability Management**: Track and remediate security vulnerabilities
- **Threat Detection**: Real-time monitoring and threat intelligence
- **System Monitoring**: Live metrics and security event tracking
- **Modern Stack**: Built with latest technologies (2026)

## 🛠️ Technology Stack

### Frontend
- **React 18.3** with TypeScript 5.4
- **Vite 5.1** - Next generation frontend tooling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **TanStack Query** - Powerful data synchronization
- **Framer Motion** - Production-ready animations
- **Vitest** - Blazing fast unit testing

### Backend
- **Python 3.13** - Latest Python version
- **FastAPI 0.110** - Modern, fast web framework
- **SQLAlchemy 2.0** - SQL toolkit and ORM
- **Pydantic 2.6** - Data validation using Python type annotations
- **Redis** - In-memory data structure store
- **PostgreSQL 16** - Advanced open source database

### Security Tools
- **Scapy** - Packet manipulation
- **TensorFlow** & **PyTorch** - ML-based threat detection
- **Cryptography** - Cryptographic recipes and primitives

### DevOps
- **Docker** & **Docker Compose**
- **GitHub Actions** - CI/CD
- **Node.js 22 LTS** - JavaScript runtime

## 📋 Prerequisites

- Node.js >= 22.0.0
- Python >= 3.13
- Docker & Docker Compose
- PostgreSQL 16
- Redis 7

## 🚦 Quick Start

### Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/DominikSolorz/Cyber-Guard-Nexus.git
cd Cyber-Guard-Nexus
```

2. **Install Frontend Dependencies**
```bash
npm install
```

3. **Install Backend Dependencies**
```bash
cd backend
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

4. **Start Development Servers**

Frontend:
```bash
npm run dev
```

Backend:
```bash
npm run backend:dev
```

### Docker Setup

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📁 Project Structure

```
Cyber-Guard-Nexus/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── api/               # API client
│   ├── hooks/             # Custom hooks
│   └── utils/             # Utility functions
├── backend/               # Backend application
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Core configuration
│   │   ├── models/       # Database models
│   │   └── services/     # Business logic
│   └── tests/            # Backend tests
├── public/               # Static assets
└── docker-compose.yml    # Docker orchestration
```

## 🧪 Testing

### Frontend Tests
```bash
npm test                  # Run tests
npm run test:ui          # Run tests with UI
npm run test:coverage    # Generate coverage report
```

### Backend Tests
```bash
cd backend
pytest                   # Run tests
pytest --cov            # Run with coverage
```

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

### Backend
- `python -m uvicorn main:app --reload` - Start development server
- `black .` - Format code
- `ruff check .` - Lint code
- `mypy .` - Type checking
- `pytest` - Run tests

## 🌐 API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/api/v1/docs
- ReDoc: http://localhost:8000/api/v1/redoc

## 🔐 Security Features

- JWT-based authentication
- HTTPS/TLS encryption
- Rate limiting
- CORS protection
- SQL injection prevention
- XSS protection
- CSRF tokens

## 📊 Monitoring & Metrics

- Real-time system metrics
- Security event logging
- Performance monitoring
- Threat intelligence feeds

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Dominik Solorz**

## 🙏 Acknowledgments

- FastAPI team for the excellent framework
- React team for the amazing library
- All open source contributors

---

Built with ❤️ using the latest technologies in 2026
