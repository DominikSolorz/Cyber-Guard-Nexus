
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { CaseService } from '../services/case.service';
import { FileService } from '../services/file.service';
import { MessageService } from '../services/messaging.service';
import { InvoiceService } from '../services/invoice.service';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <!-- Header -->
      <header class="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
        <div class="max-w-6xl mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span class="material-symbols-outlined text-white">person</span>
              </div>
              <div>
                <h1 class="text-xl font-bold text-white">Panel Klienta</h1>
                <p class="text-sm text-slate-400">{{ user()?.firstName }} {{ user()?.lastName }}</p>
              </div>
            </div>
            <button 
              (click)="logout()"
              class="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
              <span class="material-symbols-outlined text-lg">logout</span>
              <span>Wyloguj</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-6xl mx-auto px-4 py-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
            <div class="flex items-center justify-between mb-2">
              <span class="material-symbols-outlined text-3xl opacity-80">folder</span>
              <span class="text-3xl font-bold">{{ myCases().length }}</span>
            </div>
            <div class="text-sm opacity-90">Moje sprawy</div>
          </div>

          <div class="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
            <div class="flex items-center justify-between mb-2">
              <span class="material-symbols-outlined text-3xl opacity-80">description</span>
              <span class="text-3xl font-bold">{{ myFiles().length }}</span>
            </div>
            <div class="text-sm opacity-90">Dokumenty</div>
          </div>

          <div class="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 text-white">
            <div class="flex items-center justify-between mb-2">
              <span class="material-symbols-outlined text-3xl opacity-80">mail</span>
              <span class="text-3xl font-bold">{{ unreadMessages() }}</span>
            </div>
            <div class="text-sm opacity-90">Nowe wiadomości</div>
          </div>

          <div class="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
            <div class="flex items-center justify-between mb-2">
              <span class="material-symbols-outlined text-3xl opacity-80">receipt</span>
              <span class="text-3xl font-bold">{{ myInvoices().length }}</span>
            </div>
            <div class="text-sm opacity-90">Faktury</div>
          </div>
        </div>

        <!-- My Cases -->
        <div class="bg-slate-800/50 rounded-xl border border-slate-700 p-6 mb-6">
          <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined">folder_open</span>
            Moje sprawy
          </h2>

          @if (myCases().length === 0) {
            <div class="text-center py-12 text-slate-400">
              <span class="material-symbols-outlined text-6xl mb-3 opacity-50">inbox</span>
              <p>Brak przypisanych spraw</p>
            </div>
          } @else {
            <div class="space-y-3">
              @for (caseItem of myCases(); track caseItem.id) {
                <div class="bg-slate-700/30 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors cursor-pointer"
                     (click)="selectCase(caseItem.id)">
                  <div class="flex items-start justify-between mb-2">
                    <div class="flex-1">
                      <h3 class="text-white font-semibold mb-1">{{ caseItem.title }}</h3>
                      <div class="flex items-center gap-3 text-xs text-slate-400">
                        <span>Sygnatura: {{ caseItem.signature }}</span>
                        <span>•</span>
                        <span>{{ caseItem.category }}</span>
                      </div>
                    </div>
                    <span [class]="getStatusClass(caseItem.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                      {{ getStatusLabel(caseItem.status) }}
                    </span>
                  </div>

                  @if (caseItem.description) {
                    <p class="text-sm text-slate-300 mb-3">{{ caseItem.description }}</p>
                  }

                  <div class="flex items-center gap-4 text-xs text-slate-400">
                    <span class="flex items-center gap-1">
                      <span class="material-symbols-outlined text-base">event</span>
                      Utworzono: {{ formatDate(caseItem.createdAt) }}
                    </span>
                    @if (getCaseFileCount(caseItem.id) > 0) {
                      <span class="flex items-center gap-1">
                        <span class="material-symbols-outlined text-base">attach_file</span>
                        {{ getCaseFileCount(caseItem.id) }} {{ getCaseFileCount(caseItem.id) === 1 ? 'plik' : 'plików' }}
                      </span>
                    }
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <!-- Case Details Modal (simplified) -->
        @if (selectedCaseId()) {
          <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
               (click)="selectedCaseId.set(null)">
            <div class="bg-slate-800 rounded-xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                 (click)="$event.stopPropagation()">
              @if (selectedCase()) {
                <div class="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between">
                  <h2 class="text-2xl font-bold text-white">{{ selectedCase()!.title }}</h2>
                  <button 
                    (click)="selectedCaseId.set(null)"
                    class="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                    <span class="material-symbols-outlined text-slate-300">close</span>
                  </button>
                </div>

                <div class="p-6 space-y-6">
                  <!-- Case Info -->
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <div class="text-sm text-slate-400 mb-1">Sygnatura</div>
                      <div class="text-white font-medium">{{ selectedCase()!.signature }}</div>
                    </div>
                    <div>
                      <div class="text-sm text-slate-400 mb-1">Status</div>
                      <span [class]="getStatusClass(selectedCase()!.status)" class="inline-block px-3 py-1 rounded-full text-xs font-medium">
                        {{ getStatusLabel(selectedCase()!.status) }}
                      </span>
                    </div>
                    <div>
                      <div class="text-sm text-slate-400 mb-1">Kategoria</div>
                      <div class="text-white">{{ selectedCase()!.category }}</div>
                    </div>
                    <div>
                      <div class="text-sm text-slate-400 mb-1">Data utworzenia</div>
                      <div class="text-white">{{ formatDate(selectedCase()!.createdAt) }}</div>
                    </div>
                  </div>

                  @if (selectedCase()!.description) {
                    <div>
                      <div class="text-sm text-slate-400 mb-2">Opis sprawy</div>
                      <div class="bg-slate-700/30 rounded-lg p-4 text-slate-200">
                        {{ selectedCase()!.description }}
                      </div>
                    </div>
                  }

                  <!-- Files -->
                  <div>
                    <h3 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <span class="material-symbols-outlined">folder</span>
                      Dokumenty sprawy
                    </h3>
                    @if (selectedCaseFiles().length === 0) {
                      <div class="text-center py-8 text-slate-400">
                        <span class="material-symbols-outlined text-4xl mb-2 opacity-50">description</span>
                        <p>Brak dokumentów</p>
                      </div>
                    } @else {
                      <div class="space-y-2">
                        @for (file of selectedCaseFiles(); track file.id) {
                          <div class="bg-slate-700/30 rounded-lg p-3 border border-slate-600 flex items-center gap-3">
                            <div class="w-10 h-10 bg-slate-600 rounded flex items-center justify-center flex-shrink-0">
                              <span class="material-symbols-outlined text-slate-300">
                                {{ fileService.getFileIcon(file.type) }}
                              </span>
                            </div>
                            <div class="flex-1 min-w-0">
                              <div class="text-white font-medium truncate">{{ file.name }}</div>
                              <div class="text-xs text-slate-400">
                                {{ fileService.formatFileSize(file.size) }} • {{ formatDate(file.uploadedAt) }}
                              </div>
                            </div>
                            <button 
                              (click)="downloadFile(file.id)"
                              class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-2">
                              <span class="material-symbols-outlined text-lg">download</span>
                              <span>Pobierz</span>
                            </button>
                          </div>
                        }
                      </div>
                    }
                  </div>

                  <!-- Timeline (read-only) -->
                  @if (selectedCase()!.timeline && selectedCase()!.timeline.length > 0) {
                    <div>
                      <h3 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <span class="material-symbols-outlined">timeline</span>
                        Historia sprawy
                      </h3>
                      <div class="space-y-2">
                        @for (event of selectedCase()!.timeline; track $index) {
                          <div class="flex gap-3 text-sm">
                            <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div class="flex-1">
                              <div class="text-white">{{ event.description }}</div>
                              <div class="text-xs text-slate-400">{{ formatDate(event.date) }}</div>
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        }
      </main>
    </div>
  `
})
export class ClientDashboardComponent {
  auth = inject(AuthService);
  caseService = inject(CaseService);
  fileService = inject(FileService);
  messageService = inject(MessageService);
  invoiceService = inject(InvoiceService);

  user = this.auth.currentUser;
  selectedCaseId = signal<string | null>(null);

  myCases = computed(() => {
    const userId = this.user()?.id;
    if (!userId) return [];
    return this.caseService.getCasesByClient(userId);
  });

  myFiles = computed(() => {
    const userId = this.user()?.id;
    if (!userId) return [];
    return this.fileService.getFilesByUser(userId);
  });

  myInvoices = computed(() => {
    const userId = this.user()?.id;
    if (!userId) return [];
    return this.invoiceService.getInvoicesByClient(userId);
  });

  unreadMessages = computed(() => {
    const userId = this.user()?.id;
    if (!userId) return 0;
    return this.messageService.getUnreadCount(userId);
  });

  selectedCase = computed(() => {
    const caseId = this.selectedCaseId();
    if (!caseId) return null;
    return this.caseService.getCaseById(caseId);
  });

  selectedCaseFiles = computed(() => {
    const caseId = this.selectedCaseId();
    if (!caseId) return [];
    return this.fileService.getFilesByCaseId(caseId);
  });

  logout() {
    this.auth.logout();
  }

  selectCase(caseId: string) {
    this.selectedCaseId.set(caseId);
  }

  getCaseFileCount(caseId: string): number {
    return this.fileService.getFilesByCaseId(caseId).length;
  }

  downloadFile(fileId: string) {
    this.fileService.downloadFile(fileId);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'new': 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      'in-progress': 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
      'closed': 'bg-gray-500/20 text-gray-300 border border-gray-500/30',
      'won': 'bg-green-500/20 text-green-300 border border-green-500/30',
      'lost': 'bg-red-500/20 text-red-300 border border-red-500/30'
    };
    return classes[status] || classes['new'];
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'new': 'Nowa',
      'in-progress': 'W toku',
      'closed': 'Zamknięta',
      'won': 'Wygrana',
      'lost': 'Przegrana'
    };
    return labels[status] || status;
  }
}
