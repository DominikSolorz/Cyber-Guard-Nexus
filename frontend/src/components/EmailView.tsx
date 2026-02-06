import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import { Send, Inbox } from '@mui/icons-material';
import { emailAPI } from '../services/api';

interface Email {
  message_id: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  body: string;
}

const EmailView = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  
  // Compose form
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    setLoading(true);
    try {
      const response = await emailAPI.getInbox(20);
      setEmails(response.data);
    } catch (err) {
      console.error('Failed to load emails:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!to || !subject || !body) {
      setError('Wypełnij wszystkie pola');
      return;
    }

    setSending(true);
    setError('');

    try {
      await emailAPI.send([to], subject, body);
      setSuccess(true);
      setTo('');
      setSubject('');
      setBody('');
      
      setTimeout(() => {
        setSuccess(false);
        setShowCompose(false);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Błąd wysyłania');
    } finally {
      setSending(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Email (Gmail)</Typography>
        <Button
          variant="contained"
          onClick={() => setShowCompose(!showCompose)}
        >
          {showCompose ? 'Anuluj' : 'Napisz wiadomość'}
        </Button>
      </Box>

      {/* Compose Email */}
      {showCompose && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Nowa wiadomość
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>Wiadomość wysłana!</Alert>}

          <TextField
            fullWidth
            label="Do"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            margin="normal"
            placeholder="adres@example.com"
          />
          <TextField
            fullWidth
            label="Temat"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Wiadomość"
            multiline
            rows={6}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={sending}
            startIcon={<Send />}
            sx={{ mt: 2 }}
          >
            {sending ? 'Wysyłanie...' : 'Wyślij'}
          </Button>
        </Paper>
      )}

      {/* Inbox */}
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Inbox sx={{ mr: 1 }} />
          <Typography variant="h6">Odebrane wiadomości</Typography>
          <Button size="small" onClick={loadEmails} sx={{ ml: 2 }}>
            Odśwież
          </Button>
        </Box>

        {loading ? (
          <Typography>Ładowanie...</Typography>
        ) : emails.length === 0 ? (
          <Typography color="text.secondary">Brak wiadomości</Typography>
        ) : (
          <List>
            {emails.map((email, index) => (
              <Box key={index}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {email.subject || '(Brak tematu)'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Od: {email.from}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {email.body?.substring(0, 200)}
                        {email.body?.length > 200 && '...'}
                      </Typography>
                    }
                  />
                  <Chip label={new Date(email.date).toLocaleDateString()} size="small" />
                </ListItem>
                {index < emails.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default EmailView;
