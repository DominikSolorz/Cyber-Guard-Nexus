import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import { Download, Delete, Folder as FolderIcon, Image as ImageIcon, Visibility } from '@mui/icons-material';
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
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [thumbnails, setThumbnails] = useState<Record<number, string>>({});

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    // Load thumbnails for images
    files.forEach(file => {
      if (isImage(file.mime_type) && !thumbnails[file.id]) {
        loadThumbnail(file.id);
      }
    });
  }, [files]);

  const isImage = (mimeType: string) => {
    return mimeType?.startsWith('image/');
  };

  const loadThumbnail = async (fileId: number) => {
    try {
      const response = await filesAPI.downloadFile(fileId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setThumbnails(prev => ({ ...prev, [fileId]: url }));
    } catch (error) {
      console.error('Failed to load thumbnail:', error);
    }
  };

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

  const handlePreview = async (file: File) => {
    setPreviewFile(file);
    if (thumbnails[file.id]) {
      setPreviewUrl(thumbnails[file.id]);
      setPreviewOpen(true);
    } else {
      try {
        const response = await filesAPI.downloadFile(file.id);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setPreviewUrl(url);
        setPreviewOpen(true);
      } catch (error) {
        console.error('Failed to load preview:', error);
      }
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewFile(null);
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
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{
          background: 'linear-gradient(135deg, #ff006e 0%, #00f0ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700,
          mb: 3,
        }}
      >
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
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: isImage(file.mime_type) ? 'pointer' : 'default',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': isImage(file.mime_type) ? {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(255, 0, 110, 0.3)',
                  } : {}
                }}
                onClick={() => isImage(file.mime_type) && handlePreview(file)}
              >
                {isImage(file.mime_type) && thumbnails[file.id] ? (
                  <CardMedia
                    component="img"
                    height="200"
                    image={thumbnails[file.id]}
                    alt={file.filename}
                    sx={{ 
                      objectFit: 'cover',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }}
                  />
                ) : (
                  <Box 
                    sx={{ 
                      height: 200, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, rgba(255, 0, 110, 0.1) 0%, rgba(0, 240, 255, 0.1) 100%)',
                    }}
                  >
                    {isImage(file.mime_type) ? (
                      <ImageIcon sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.3)' }} />
                    ) : (
                      <FolderIcon sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.3)' }} />
                    )}
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant="h6" 
                    noWrap 
                    sx={{ 
                      mb: 1,
                      fontWeight: 600,
                    }}
                  >
                    {file.filename}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatFileSize(file.size)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {new Date(file.created_at).toLocaleDateString('pl-PL')}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {isImage(file.mime_type) && (
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreview(file);
                        }}
                        sx={{
                          border: '1px solid',
                          borderColor: 'primary.main',
                        }}
                      >
                        <Visibility />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(file.id, file.filename);
                      }}
                      sx={{
                        border: '1px solid',
                        borderColor: 'info.main',
                        color: 'info.main',
                      }}
                    >
                      <Download />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file.id);
                      }}
                      sx={{
                        border: '1px solid',
                        borderColor: 'error.main',
                      }}
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

      {/* Image Preview Dialog */}
      <Dialog 
        open={previewOpen} 
        onClose={handleClosePreview}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(10, 10, 35, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 0, 110, 0.3)',
            boxShadow: '0 8px 32px rgba(255, 0, 110, 0.3)',
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, rgba(255, 0, 110, 0.2) 0%, rgba(0, 240, 255, 0.2) 100%)',
          borderBottom: '1px solid rgba(255, 0, 110, 0.3)',
        }}>
          {previewFile?.filename}
        </DialogTitle>
        <DialogContent sx={{ p: 3, textAlign: 'center' }}>
          {previewUrl && (
            <Box
              component="img"
              src={previewUrl}
              alt={previewFile?.filename}
              sx={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                borderRadius: 1,
                boxShadow: '0 4px 24px rgba(0, 240, 255, 0.2)',
              }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{
          borderTop: '1px solid rgba(255, 0, 110, 0.3)',
          p: 2,
        }}>
          <Button 
            onClick={() => previewFile && handleDownload(previewFile.id, previewFile.filename)}
            variant="outlined"
            startIcon={<Download />}
            sx={{
              borderColor: 'rgba(0, 240, 255, 0.5)',
              color: '#00f0ff',
              '&:hover': {
                borderColor: '#00f0ff',
                backgroundColor: 'rgba(0, 240, 255, 0.1)',
              }
            }}
          >
            Pobierz
          </Button>
          <Button 
            onClick={handleClosePreview}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #ff006e 0%, #b967ff 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #ff3385 0%, #c77fff 100%)',
              }
            }}
          >
            Zamknij
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FilesView;
