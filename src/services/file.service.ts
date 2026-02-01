
import { Injectable, signal } from '@angular/core';

export interface FileUpload {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
  caseId?: string;
  description?: string;
  category: 'document' | 'evidence' | 'correspondence' | 'other';
  data: string; // Base64 data URL
  thumbnail?: string; // For images
}

@Injectable({ providedIn: 'root' })
export class FileService {
  private files: FileUpload[] = [];
  private readonly FILES_KEY = 'ekancelaria_files_v2';
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  
  uploadProgress = signal<number>(0);
  
  // Dozwolone typy plików
  private readonly ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'text/plain',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  constructor() {
    this.loadFiles();
  }

  private loadFiles() {
    const stored = localStorage.getItem(this.FILES_KEY);
    if(stored) {
      try {
        const parsed = JSON.parse(stored);
        this.files = parsed.map((f: any) => ({
          ...f,
          uploadedAt: new Date(f.uploadedAt)
        }));
      } catch(e) {
        console.error('Error loading files:', e);
        this.files = [];
      }
    }
  }

  private saveFiles() {
    localStorage.setItem(this.FILES_KEY, JSON.stringify(this.files));
  }

  async uploadFile(
    file: File, 
    userId: string,
    options?: {
      caseId?: string;
      description?: string;
      category?: FileUpload['category'];
    }
  ): Promise<{ success: boolean; message?: string; fileId?: string }> {
    
    // Walidacja rozmiaru
    if(file.size > this.MAX_FILE_SIZE) {
      return { success: false, message: `Plik przekracza maksymalny rozmiar (${this.MAX_FILE_SIZE / 1024 / 1024}MB)` };
    }

    // Walidacja typu
    if(!this.ALLOWED_TYPES.includes(file.type)) {
      return { success: false, message: 'Nieobsługiwany typ pliku' };
    }

    try {
      this.uploadProgress.set(0);
      
      // Konwersja do Base64
      const dataUrl = await this.fileToBase64(file);
      
      this.uploadProgress.set(50);

      // Generuj miniaturkę dla obrazów
      let thumbnail: string | undefined;
      if(file.type.startsWith('image/')) {
        thumbnail = await this.generateThumbnail(dataUrl, 200);
      }

      this.uploadProgress.set(75);

      const fileUpload: FileUpload = {
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date(),
        uploadedBy: userId,
        caseId: options?.caseId,
        description: options?.description,
        category: options?.category || 'document',
        data: dataUrl,
        thumbnail
      };

      this.files.push(fileUpload);
      this.saveFiles();
      
      this.uploadProgress.set(100);
      
      setTimeout(() => this.uploadProgress.set(0), 1000);

      return { success: true, fileId: fileUpload.id };
      
    } catch(error) {
      console.error('Upload error:', error);
      this.uploadProgress.set(0);
      return { success: false, message: 'Błąd podczas przesyłania pliku' };
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private generateThumbnail(dataUrl: string, maxSize: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Skalowanie
        if(width > height) {
          if(width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if(height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = reject;
      img.src = dataUrl;
    });
  }

  getFileById(id: string): FileUpload | undefined {
    return this.files.find(f => f.id === id);
  }

  getFilesByCaseId(caseId: string): FileUpload[] {
    return this.files.filter(f => f.caseId === caseId);
  }

  getFilesByUser(userId: string): FileUpload[] {
    return this.files.filter(f => f.uploadedBy === userId);
  }

  getAllFiles(): FileUpload[] {
    return [...this.files];
  }

  deleteFile(id: string, userId: string, userRole: string): boolean {
    const fileIndex = this.files.findIndex(f => f.id === id);
    if(fileIndex === -1) return false;

    const file = this.files[fileIndex];
    
    // Tylko właściciel lub kancelaria może usunąć
    if(file.uploadedBy !== userId && userRole === 'client') {
      return false;
    }

    this.files.splice(fileIndex, 1);
    this.saveFiles();
    return true;
  }

  updateFileDescription(id: string, description: string): boolean {
    const file = this.files.find(f => f.id === id);
    if(!file) return false;

    file.description = description;
    this.saveFiles();
    return true;
  }

  downloadFile(id: string): boolean {
    const file = this.files.find(f => f.id === id);
    if(!file) return false;

    // Tworzenie linku do pobrania
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  }

  getFileIcon(type: string): string {
    if(type.includes('pdf')) return 'picture_as_pdf';
    if(type.includes('word') || type.includes('document')) return 'description';
    if(type.includes('image')) return 'image';
    if(type.includes('excel') || type.includes('sheet')) return 'table_chart';
    return 'insert_drive_file';
  }

  formatFileSize(bytes: number): string {
    if(bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Statystyki
  getTotalStorageUsed(): number {
    return this.files.reduce((sum, f) => sum + f.size, 0);
  }

  getFileCountByCategory(): Record<string, number> {
    return this.files.reduce((acc, f) => {
      acc[f.category] = (acc[f.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}
