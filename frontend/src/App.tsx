import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

// Cyberpunk theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff006e', // Cyber Pink
      light: '#ff4d9a',
      dark: '#cc0058',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00f0ff', // Cyber Blue
      light: '#4df4ff',
      dark: '#00bdcc',
      contrastText: '#000000',
    },
    background: {
      default: '#0a0e27', // Cyber Dark
      paper: '#1a1f3a', // Cyber Card
    },
    text: {
      primary: '#e0e7ff', // Cyber Text
      secondary: '#94a3b8', // Cyber Text Dim
    },
    error: {
      main: '#ff006e',
    },
    warning: {
      main: '#ffbe0b', // Cyber Yellow
    },
    info: {
      main: '#00f0ff',
    },
    success: {
      main: '#00ff88',
    },
    divider: '#2d3561', // Cyber Border
  },
  typography: {
    fontFamily: '"Rajdhani", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '0.02em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 24px',
          boxShadow: '0 0 10px rgba(255, 0, 110, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 0 20px rgba(255, 0, 110, 0.6), 0 0 40px rgba(0, 240, 255, 0.3)',
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #ff006e 0%, #b967ff 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #ff4d9a 0%, #d094ff 100%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(0, 240, 255, 0.2)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(0, 240, 255, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 240, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00f0ff',
              boxShadow: '0 0 10px rgba(0, 240, 255, 0.5)',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(185, 103, 255, 0.2)',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'rgba(185, 103, 255, 0.5)',
            boxShadow: '0 4px 30px rgba(185, 103, 255, 0.3)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
