import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Alert,
  LinearProgress,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { filesAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const UploadView = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setError('');
      setSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Wybierz plik do przesłania');
      return;
    }

    setUploading(true);
    setError('');

    try {
      await filesAPI.upload(selectedFile);
      setSuccess(true);
      setSelectedFile(null);
      
      setTimeout(() => {
        navigate('/dashboard/files');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Błąd przesyłania pliku');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Upload plików
      </Typography>

      <Paper sx={{ p: 4, mt: 3, textAlign: 'center' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Plik przesłany pomyślnie! Przekierowanie...
          </Alert>
        )}

        <input
          accept="*"
          style={{ display: 'none' }}
          id="file-upload"
          type="file"
          onChange={handleFileSelect}
          disabled={uploading}
        />
        <label htmlFor="file-upload">
          <Button
            variant="outlined"
            component="span"
            size="large"
            startIcon={<CloudUpload />}
            disabled={uploading}
            sx={{ mb: 2 }}
          >
            Wybierz plik
          </Button>
        </label>

        {selectedFile && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              Wybrany plik: <strong>{selectedFile.name}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rozmiar: {(selectedFile.size / 1024).toFixed(2)} KB
            </Typography>
          </Box>
        )}

        {uploading && <LinearProgress sx={{ mt: 2 }} />}

        <Button
          variant="contained"
          size="large"
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          sx={{ mt: 3 }}
        >
          {uploading ? 'Przesyłanie...' : 'Prześlij plik'}
        </Button>
      </Paper>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Maksymalny rozmiar pliku: 100 MB
      </Typography>
    </Box>
  );
};

export default UploadView;
