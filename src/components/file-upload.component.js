
import { Component, Input, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileService, FileUpload } from '../services/file.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white flex items-center gap-2">
          <span class="material-symbols-outlined">upload_file</span>
          Pliki sprawy
        </h3>
        @if (canUpload) {
          <label class="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <span class="material-symbols-outlined">add</span>
            <span>Dodaj plik</span>
            <input 
              type="file" 
              (change)="onFileSelected($event)" 
              [accept]="acceptedTypes"
              multiple
              class="hidden">
          </label>
        }
      </div>

      <!-- Upload Progress -->
      @if (fileService.uploadProgress() > 0) {
        <div class="mb-4 bg-slate-700/50 rounded-lg p-3">
          <div class="flex items-center justify-between text-sm text-slate-300 mb-2">
            <span>Przesyłanie...</span>
            <span>{{ fileService.uploadProgress() }}%</span>
          </div>
          <div class="w-full bg-slate-600 rounded-full h-2">
            <div 
              class="bg-blue-500 h-2 rounded-full transition-all duration-300"
              [style.width.%]="fileService.uploadProgress()"></div>
          </div>
        </div>
      }

      <!-- Files List -->
      <div class="space-y-2">
        @if (files().length === 0) {
          <div class="text-center py-8 text-slate-400">
            <span class="material-symbols-outlined text-5xl mb-2 opacity-50">folder_open</span>
            <p>Brak plików</p>
          </div>
        }

        @for (file of files(); track file.id) {
          <div class="bg-slate-700/30 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors">
            <div class="flex items-center gap-4">
              <!-- File Icon/Thumbnail -->
              <div class="flex-shrink-0">
                @if (file.thumbnail) {
                  <img [src]="file.thumbnail" alt="" class="w-12 h-12 rounded object-cover">
                } @else {
                  <div class="w-12 h-12 bg-slate-600 rounded flex items-center justify-center">
                    <span class="material-symbols-outlined text-slate-300">
                      {{ fileService.getFileIcon(file.type) }}
                    </span>
                  </div>
                }
              </div>

              <!-- File Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="text-white font-medium truncate">{{ file.name }}</h4>
                  <span class="text-xs px-2 py-0.5 bg-slate-600 text-slate-300 rounded">
                    {{ file.category }}
                  </span>
                </div>
                <div class="flex items-center gap-3 text-xs text-slate-400">
                  <span>{{ fileService.formatFileSize(file.size) }}</span>
                  <span>•</span>
                  <span>{{ formatDate(file.uploadedAt) }}</span>
                  @if (file.description) {
                    <span>•</span>
                    <span class="truncate">{{ file.description }}</span>
                  }
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2">
                <button 
                  (click)="downloadFile(file.id)"
                  class="p-2 hover:bg-slate-600 rounded-lg transition-colors group"
                  title="Pobierz">
                  <span class="material-symbols-outlined text-slate-400 group-hover:text-blue-400">download</span>
                </button>

                @if (canDelete) {
                  <button 
                    (click)="deleteFile(file.id)"
                    class="p-2 hover:bg-slate-600 rounded-lg transition-colors group"
                    title="Usuń">
                    <span class="material-symbols-outlined text-slate-400 group-hover:text-red-400">delete</span>
                  </button>
                }
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Storage Info -->
      @if (files().length > 0) {
        <div class="mt-4 pt-4 border-t border-slate-700 text-sm text-slate-400">
          <div class="flex items-center justify-between">
            <span>Łącznie: {{ files().length }} {{ files().length === 1 ? 'plik' : 'plików' }}</span>
            <span>{{ fileService.formatFileSize(totalSize()) }}</span>
          </div>
        </div>
      }
    </div>
  `
})
export class FileUploadComponent {
  @Input() caseId?: string;
  fileService = inject(FileService);
  auth = inject(AuthService);

  files = signal<FileUpload[]>([]);
  fileUploaded = output<FileUpload>();

  acceptedTypes = 'application/pdf,.doc,.docx,image/jpeg,image/jpg,image/png,image/gif,.txt,.xls,.xlsx';

  ngOnInit() {
    this.loadFiles();
  }

  loadFiles() {
    if (this.caseId) {
      this.files.set(this.fileService.getFilesByCaseId(this.caseId));
    } else {
      this.files.set(this.fileService.getAllFiles());
    }
  }

  get canUpload(): boolean {
    return this.auth.canUploadFiles();
  }

  get canDelete(): boolean {
    return this.auth.canDeleteFiles();
  }

  async onFileSelected(event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const user = this.auth.currentUser();
    if (!user) return;

    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      const result = await this.fileService.uploadFile(file, user.id, {
        caseId: this.caseId,
        category: 'document'
      });

      if (result.success) {
        this.loadFiles();
        const uploadedFile = this.fileService.getFileById(result.fileId!);
        if (uploadedFile) {
          this.fileUploaded.emit(uploadedFile);
        }
      }
    }

    // Reset input
    input.value = '';
  }

  downloadFile(fileId: string) {
    this.fileService.downloadFile(fileId);
  }

  deleteFile(fileId: string) {
    const user = this.auth.currentUser();
    if (!user) return;

    if (confirm('Czy na pewno chcesz usunąć ten plik?')) {
      const success = this.fileService.deleteFile(fileId, user.id, user.role);
      if (success) {
        this.loadFiles();
      }
    }
  }

  formatDate(date): string {
    return new Date(date).toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  totalSize = signal(0);

  ngAfterViewInit() {
    this.updateTotalSize();
  }

  private updateTotalSize() {
    this.totalSize.set(
      this.files().reduce((sum, f) => sum + f.size, 0)
    );
  }
}
