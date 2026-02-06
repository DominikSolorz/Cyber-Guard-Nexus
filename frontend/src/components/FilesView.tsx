import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button,
} from '@mui/material';
import { Download, Delete, Folder as FolderIcon } from '@mui/icons-material';
import { filesAPI } from '../services/api';

interface File {
  id: number;
  filename: string;
  size: number;
  mime_type: string;
  created_at: string;
  is_favorite: boolean;
}

const FilesView = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const response = await filesAPI.getFiles();
      setFiles(response.data);
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId: number) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten plik?')) {
      try {
        await filesAPI.deleteFile(fileId);
        loadFiles();
      } catch (error) {
        console.error('Failed to delete file:', error);
      }
    }
  };

  const handleDownload = async (fileId: number, filename: string) => {
    try {
      const response = await filesAPI.downloadFile(fileId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  if (loading) {
    return <Typography>Ładowanie...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Moje pliki
      </Typography>

      {files.length === 0 ? (
        <Typography color="text.secondary">
          Brak plików. Przejdź do zakładki Upload aby dodać pliki.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {files.map((file) => (
            <Grid item xs={12} sm={6} md={4} key={file.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <FolderIcon sx={{ mr: 1 }} />
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                      {file.filename}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {formatFileSize(file.size)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(file.created_at).toLocaleDateString()}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleDownload(file.id, file.filename)}
                    >
                      <Download />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(file.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default FilesView;
