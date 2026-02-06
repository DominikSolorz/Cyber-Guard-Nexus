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
import { filesAPI, getApiBaseUrl } from '../services/api';

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

  const isPDF = (mimeType: string) => {
    return mimeType === 'application/pdf';
  };

  const isWord = (mimeType: string) => {
    return mimeType?.includes('word') || 
           mimeType?.includes('document') ||
           mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
           mimeType === 'application/msword';
  };

  const isPreviewable = (mimeType: string) => {
    return isImage(mimeType) || isPDF(mimeType) || isWord(mimeType);
  };

  const getFileIcon = (mimeType: string) => {
    if (isImage(mimeType)) return <ImageIcon sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.3)' }} />;
    if (isPDF(mimeType)) return <FolderIcon sx={{ fontSize: 64, color: 'rgba(255, 0, 110, 0.5)' }} />;
    if (isWord(mimeType)) return <FolderIcon sx={{ fontSize: 64, color: 'rgba(0, 240, 255, 0.5)' }} />;
    return <FolderIcon sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.3)' }} />;
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
    console.log('Preview clicked for:', file.filename, 'type:', file.mime_type);
    
    setPreviewFile(file);
    
    // For all file types, download and create blob URL
    if (isImage(file.mime_type) && thumbnails[file.id]) {
      setPreviewUrl(thumbnails[file.id]);
      setPreviewOpen(true);
    } else {
      try {
        const response = await filesAPI.downloadFile(file.id);
        console.log('File downloaded, creating blob...');
        
        // Create blob with correct MIME type
        const blob = new Blob([response.data], { type: file.mime_type });
        const url = window.URL.createObjectURL(blob);
        console.log('Blob URL created:', url);
        
        setPreviewUrl(url);
        setPreviewOpen(true);
      } catch (error) {
        console.error('Failed to load preview:', error);
        alert('Błąd ładowania podglądu: ' + error);
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
                  cursor: isPreviewable(file.mime_type) ? 'pointer' : 'default',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': isPreviewable(file.mime_type) ? {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(255, 0, 110, 0.3)',
                  } : {}
                }}
                onClick={() => isPreviewable(file.mime_type) && handlePreview(file)}
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
                    {getFileIcon(file.mime_type)}
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
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {isPreviewable(file.mime_type) && (
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={<Visibility />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreview(file);
                        }}
                        sx={{
                          background: 'linear-gradient(135deg, #ff006e 0%, #b967ff 100%)',
                          fontWeight: 600,
                          py: 1.5,
                          fontSize: '1rem',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #ff3385 0%, #c77fff 100%)',
                            transform: 'scale(1.02)',
                          }
                        }}
                      >
                        {isImage(file.mime_type) ? 'Zobacz obraz' : isPDF(file.mime_type) ? 'Zobacz PDF' : 'Zobacz dokument'}
                      </Button>
                    )}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        size="medium"
                        startIcon={<Download />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(file.id, file.filename);
                        }}
                        sx={{
                          borderColor: 'rgba(0, 240, 255, 0.5)',
                          color: '#00f0ff',
                          py: 1,
                          '&:hover': {
                            borderColor: '#00f0ff',
                            backgroundColor: 'rgba(0, 240, 255, 0.1)',
                          }
                        }}
                      >
                        Pobierz
                      </Button>
                      <IconButton
                        size="medium"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(file.id);
                        }}
                        sx={{
                          border: '2px solid',
                          borderColor: 'error.main',
                          width: 48,
                          height: 48,
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Preview Dialog */}
      <Dialog 
        open={previewOpen} 
        onClose={handleClosePreview}
        maxWidth={isPDF(previewFile?.mime_type || '') ? false : 'lg'}
        fullWidth
        fullScreen={isPDF(previewFile?.mime_type || '')}
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
        <DialogContent sx={{ 
          p: isPDF(previewFile?.mime_type || '') ? 0 : 3, 
          textAlign: 'center', 
          minHeight: isPDF(previewFile?.mime_type || '') ? '100%' : '60vh', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          overflow: isPDF(previewFile?.mime_type || '') ? 'hidden' : 'auto',
        }}>
          {previewUrl && previewFile && (
            <>
              {isImage(previewFile.mime_type) && (
                <Box
                  component="img"
                  src={previewUrl}
                  alt={previewFile.filename}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '70vh',
                    objectFit: 'contain',
                    borderRadius: 1,
                    boxShadow: '0 4px 24px rgba(0, 240, 255, 0.2)',
                  }}
                />
              )}
              {isPDF(previewFile.mime_type) && (
                <Box
                  component="iframe"
                  src={previewUrl}
                  sx={{
                    width: '100%',
                    height: '100%',
                    minHeight: 'calc(100vh - 120px)',
                    border: 'none',
                    backgroundColor: 'white',
                    touchAction: 'manipulation',
                  }}
                />
              )}
              {isWord(previewFile.mime_type) && (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: 3,
                  py: 4,
                }}>
                  <FolderIcon sx={{ fontSize: 100, color: 'rgba(0, 240, 255, 0.5)' }} />
                  <Typography variant="h5" sx={{ color: '#00f0ff' }}>
                    Dokument Word
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
                    Podgląd dokumentów Word wymaga pobrania pliku. 
                    Kliknij przycisk "Pobierz" poniżej aby otworzyć dokument.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Download />}
                    onClick={() => previewFile && handleDownload(previewFile.id, previewFile.filename)}
                    sx={{
                      background: 'linear-gradient(135deg, #ff006e 0%, #b967ff 100%)',
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #ff3385 0%, #c77fff 100%)',
                      }
                    }}
                  >
                    Pobierz dokument
                  </Button>
                </Box>
              )}
            </>
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
