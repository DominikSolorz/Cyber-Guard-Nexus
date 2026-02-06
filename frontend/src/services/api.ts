import axios from 'axios';

// Dynamically get API URL based on environment
const getApiUrl = () => {
  // Check if we're in GitHub Codespaces
  if (window.location.hostname.includes('github.dev')) {
    // Replace frontend port (5173) with backend port (8000) in the URL
    const backendUrl = window.location.origin.replace('-5173.', '-8000.');
    console.log('🔧 Codespaces detected!');
    console.log('Frontend URL:', window.location.origin);
    console.log('Backend URL:', backendUrl);
    return `${backendUrl}/api`;
  }
  // Use environment variable or fallback to localhost
  const localUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
  console.log('🔧 Local development detected!');
  console.log('API URL:', localUrl);
  return localUrl;
};

const API_BASE_URL = getApiUrl();
console.log('✅ Final API Base URL:', API_BASE_URL);

// Export API base URL for constructing direct file URLs
export const getApiBaseUrl = () => API_BASE_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (email: string, username: string, password: string, fullName?: string) =>
    api.post('/auth/register', { email, username, password, full_name: fullName }),
  
  login: (username: string, password: string) =>
    api.post('/auth/login', new URLSearchParams({ username, password }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }),
  
  getMe: () => api.get('/auth/me'),
};

// Files API
export const filesAPI = {
  upload: (file: File, folderId?: number) => {
    const formData = new FormData();
    formData.append('file', file);
    if (folderId) formData.append('folder_id', folderId.toString());
    
    return api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  getFiles: (folderId?: number) =>
    api.get('/files', { params: { folder_id: folderId } }),
  
  deleteFile: (fileId: number) => api.delete(`/files/${fileId}`),
  
  downloadFile: (fileId: number) =>
    api.get(`/files/${fileId}/download`, { responseType: 'blob' }),
};

// Folders API
export const foldersAPI = {
  create: (name: string, parentId?: number, color?: string) =>
    api.post('/folders', { name, parent_id: parentId, color }),
  
  getFolders: () => api.get('/folders'),
};

// AI Chat API
export const aiAPI = {
  createChat: () => api.post('/ai/chat'),
  
  sendMessage: (chatId: number, message: string) =>
    api.post(`/ai/chat/${chatId}/message`, { message }),
  
  getChats: () => api.get('/ai/chats'),
  
  getMessages: (chatId: number) => api.get(`/ai/chat/${chatId}/messages`),
};

// Email API
export const emailAPI = {
  send: (toEmails: string[], subject: string, bodyText: string, bodyHtml?: string) =>
    api.post('/email/send', { to_emails: toEmails, subject, body_text: bodyText, body_html: bodyHtml }),
  
  getInbox: (limit: number = 50) => api.get('/email/inbox', { params: { limit } }),
};

export default api;
