import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Box, IconButton, Typography, CircularProgress } from '@mui/material';
import { ZoomIn, ZoomOut, NavigateBefore, NavigateNext } from '@mui/icons-material';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  fileUrl: string;
}

const PDFViewer = ({ fileUrl }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3.0));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#1a1a2e',
    }}>
      {/* Controls */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        p: 1,
        gap: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderBottom: '1px solid rgba(255, 0, 110, 0.3)',
      }}>
        {/* Page Navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            onClick={goToPrevPage} 
            disabled={pageNumber <= 1}
            sx={{ color: '#00f0ff' }}
          >
            <NavigateBefore />
          </IconButton>
          <Typography variant="body2" sx={{ color: '#fff', minWidth: 80, textAlign: 'center' }}>
            {pageNumber} / {numPages}
          </Typography>
          <IconButton 
            onClick={goToNextPage} 
            disabled={pageNumber >= numPages}
            sx={{ color: '#00f0ff' }}
          >
            <NavigateNext />
          </IconButton>
        </Box>

        {/* Zoom Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
            sx={{ color: '#ff006e' }}
          >
            <ZoomOut />
          </IconButton>
          <Typography variant="body2" sx={{ color: '#fff', minWidth: 50, textAlign: 'center' }}>
            {Math.round(scale * 100)}%
          </Typography>
          <IconButton 
            onClick={handleZoomIn}
            disabled={scale >= 3.0}
            sx={{ color: '#ff006e' }}
          >
            <ZoomIn />
          </IconButton>
        </Box>
      </Box>

      {/* PDF Document */}
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto', 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'flex-start',
        p: 2,
        touchAction: 'pan-y pinch-zoom',
      }}>
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 4 }}>
              <CircularProgress sx={{ color: '#ff006e' }} />
              <Typography sx={{ color: '#00f0ff' }}>Ładowanie PDF...</Typography>
            </Box>
          }
          error={
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="error">Błąd ładowania PDF</Typography>
            </Box>
          }
        >
          <Page 
            pageNumber={pageNumber} 
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </Box>
    </Box>
  );
};

export default PDFViewer;
