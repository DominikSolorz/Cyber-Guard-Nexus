import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import {
  CloudUpload,
  Chat,
  Email,
  Folder,
  Security,
  Speed,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Folder sx={{ fontSize: 60, color: '#1976d2' }} />,
      title: 'Zarządzanie plikami',
      description: 'Organizuj dokumenty w folderach, dodawaj tagi, wyszukuj błyskawicznie',
    },
    {
      icon: <Chat sx={{ fontSize: 60, color: '#1976d2' }} />,
      title: 'Chat AI',
      description: 'Rozmawiaj z ChatGPT-4 z edytorem WYSIWYG jak w Word',
    },
    {
      icon: <Email sx={{ fontSize: 60, color: '#1976d2' }} />,
      title: 'System Email',
      description: 'Integracja z Gmail - wysyłaj i odbieraj wiadomości z załącznikami',
    },
    {
      icon: <CloudUpload sx={{ fontSize: 60, color: '#1976d2' }} />,
      title: 'Upload plików',
      description: 'Przesyłaj pliki do 100MB, wersjonowanie, udostępnianie',
    },
    {
      icon: <Security sx={{ fontSize: 60, color: '#1976d2' }} />,
      title: 'Bezpieczeństwo',
      description: 'JWT autentykacja, szyfrowanie haseł, zabezpieczone API',
    },
    {
      icon: <Speed sx={{ fontSize: 60, color: '#1976d2' }} />,
      title: 'Tryb offline',
      description: 'Pracuj bez internetu, automatyczna synchronizacja',
    },
  ];

  return (
    <>
      {/* Navigation Bar */}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Document Manager AI
          </Typography>
          <Button color="inherit" onClick={() => navigate('/login')}>
            Zaloguj się
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{ ml: 2 }}
            onClick={() => navigate('/register')}
          >
            Zarejestruj się
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: 12,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Document Manager AI
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Zaawansowany system zarządzania dokumentami z wbudowaną sztuczną inteligencją
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem' }}>
            Organizuj pliki, rozmawiaj z AI, zarządzaj emailami - wszystko w jednym miejscu.
            Pracuj online i offline. Bezpieczne, szybkie, intuicyjne.
          </Typography>
          <Box>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: '#1976d2',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': { bgcolor: '#f5f5f5' },
                mr: 2,
              }}
              onClick={() => navigate('/register')}
            >
              Rozpocznij za darmo
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': { borderColor: '#f5f5f5', bgcolor: 'rgba(255,255,255,0.1)' },
              }}
              onClick={() => navigate('/login')}
            >
              Mam już konto
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography
          variant="h3"
          component="h2"
          textAlign="center"
          gutterBottom
          fontWeight="bold"
        >
          Funkcje
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Wszystko czego potrzebujesz do zarządzania dokumentami w jednej aplikacji
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-8px)' },
                }}
                elevation={2}
              >
                <CardContent sx={{ flexGrow: 1, py: 4 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Screenshots Section */}
      <Box sx={{ bgcolor: '#f5f5f5', py: 10 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            fontWeight="bold"
          >
            Zobacz jak to działa
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6 }}
          >
            Galeria funkcji aplikacji
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                title: 'Dashboard - Zarządzanie plikami',
                description: 'Intuicyjny interfejs do organizacji dokumentów',
              },
              {
                title: 'Chat AI z edytorem',
                description: 'Rozmowa z ChatGPT-4 z możliwością formatowania',
              },
              {
                title: 'System Email',
                description: 'Pełna integracja z Gmail - wysyłanie i odbieranie',
              },
            ].map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card elevation={3}>
                  <CardMedia
                    component="div"
                    sx={{
                      height: 200,
                      bgcolor: '#e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h6" color="text.secondary">
                      Screenshot {index + 1}
                    </Typography>
                  </CardMedia>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* About Section */}
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
          O aplikacji
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem' }}>
          Document Manager AI to zaawansowany system zarządzania dokumentami z wbudowaną
          sztuczną inteligencją. Pozwala organizować pliki, rozmawiać z ChatGPT-4,
          zarządzać emailami i pracować offline - wszystko w jednym miejscu.
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem' }}>
          Aplikacja wykorzystuje najnowsze technologie: React 18, TypeScript, FastAPI,
          PostgreSQL, OpenAI GPT-4 i Gmail API. Zapewnia pełne bezpieczeństwo dzięki
          JWT autentykacji i szyfrowaniu haseł.
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem', color: 'text.secondary' }}>
          Stworzona z myślą o wydajności, bezpieczeństwie i łatwości użytkowania.
        </Typography>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: '#1976d2',
          color: 'white',
          py: 6,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h6" gutterBottom>
            Document Manager AI
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            © 2026 Document Manager AI - Stworzone przez Dominik Solorz
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Kontakt: goldservicepoland@gmail.com
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default LandingPage;
