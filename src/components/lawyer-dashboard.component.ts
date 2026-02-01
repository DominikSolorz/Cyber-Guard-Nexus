
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CaseService } from '../services/case.service';
import { FileService } from '../services/file.service';
import { ClientService } from '../services/client.service';
import { InvoiceService } from '../services/invoice.service';
import { CalendarService } from '../services/calendar.service';
import { FileUploadComponent } from './file-upload.component';

@Component({
  selector: 'app-lawyer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, FileUploadComponent],
  template: `
    <div class="min-h-screen bg-slate-950">
      <!-- Top Navigation -->
      <nav class="bg-gradient-to-r from-blue-900 to-indigo-900 border-b border-blue-800 sticky top-0 z-20">
        <div class="max-w-7xl mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <span class="material-symbols-outlined text-2xl text-white">balance</span>
              </div>
              <div>
                <h1 class="text-xl font-bold text-white">Panel Kancelarii</h1>
                <p class="text-sm text-blue-200">
                  {{ user()?.firstName }} {{ user()?.lastName }}
                  @if (user()?.licenseNumber) {
                    <span class="ml-2 opacity-75">• {{ user()?.licenseNumber }}</span>
                  }
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <button 
                (click)="showProfile.set(!showProfile())"
                class="flex items-center gap-2 px-4 py-2 bg-blue-800/50 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <span class="material-symbols-outlined">account_circle</span>
                <span>Profil</span>
              </button>
              <button 
                (click)="logout()"
                class="flex items-center gap-2 px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-colors">
                <span class="material-symbols-outlined">logout</span>
                <span>Wyloguj</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div class="flex max-w-7xl mx-auto">
        <!-- Sidebar -->
        <aside class="w-64 bg-slate-900 border-r border-slate-800 min-h-screen p-4 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
          <nav class="space-y-2">
            <button 
              (click)="currentView.set('dashboard')"
              [class]="currentView() === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors">
              <span class="material-symbols-outlined">dashboard</span>
              <span class="font-medium">Dashboard</span>
            </button>

            <button 
              (click)="currentView.set('cases')"
              [class]="currentView() === 'cases' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors">
              <span class="material-symbols-outlined">folder</span>
              <span class="font-medium">Sprawy</span>
              <span class="ml-auto text-xs bg-slate-700 px-2 py-1 rounded-full">{{ allCases().length }}</span>
            </button>

            <button 
              (click)="currentView.set('clients')"
              [class]="currentView() === 'clients' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors">
              <span class="material-symbols-outlined">people</span>
              <span class="font-medium">Klienci</span>
              <span class="ml-auto text-xs bg-slate-700 px-2 py-1 rounded-full">{{ allClients().length }}</span>
            </button>

            <button 
              (click)="currentView.set('calendar')"
              [class]="currentView() === 'calendar' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors">
              <span class="material-symbols-outlined">calendar_month</span>
              <span class="font-medium">Kalendarz</span>
            </button>

            <button 
              (click)="currentView.set('invoices')"
              [class]="currentView() === 'invoices' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors">
              <span class="material-symbols-outlined">receipt_long</span>
              <span class="font-medium">Faktury</span>
            </button>

            <button 
              (click)="currentView.set('files')"
              [class]="currentView() === 'files' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors">
              <span class="material-symbols-outlined">cloud</span>
              <span class="font-medium">Pliki</span>
            </button>

            <hr class="my-4 border-slate-800">

            <button 
              (click)="currentView.set('reports')"
              [class]="currentView() === 'reports' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors">
              <span class="material-symbols-outlined">analytics</span>
              <span class="font-medium">Raporty</span>
            </button>

            <button 
              (click)="currentView.set('settings')"
              [class]="currentView() === 'settings' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors">
              <span class="material-symbols-outlined">settings</span>
              <span class="font-medium">Ustawienia</span>
            </button>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 p-6">
          <!-- Dashboard View -->
          @if (currentView() === 'dashboard') {
            <div>
              <h2 class="text-2xl font-bold text-white mb-6">Dashboard - Przegląd</h2>

              <!-- Stats Grid -->
              <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-xl">
                  <div class="flex items-center justify-between mb-3">
                    <span class="material-symbols-outlined text-4xl opacity-80">folder</span>
                    <span class="text-4xl font-bold">{{ allCases().length }}</span>
                  </div>
                  <div class="text-sm opacity-90">Wszystkie sprawy</div>
                  <div class="text-xs opacity-75 mt-1">{{ activeCases().length }} aktywnych</div>
                </div>

                <div class="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white shadow-xl">
                  <div class="flex items-center justify-between mb-3">
                    <span class="material-symbols-outlined text-4xl opacity-80">people</span>
                    <span class="text-4xl font-bold">{{ allClients().length }}</span>
                  </div>
                  <div class="text-sm opacity-90">Klienci</div>
                  <div class="text-xs opacity-75 mt-1">Baza klientów</div>
                </div>

                <div class="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white shadow-xl">
                  <div class="flex items-center justify-between mb-3">
                    <span class="material-symbols-outlined text-4xl opacity-80">receipt</span>
                    <span class="text-4xl font-bold">{{ totalRevenue() }}</span>
                  </div>
                  <div class="text-sm opacity-90">Przychód (PLN)</div>
                  <div class="text-xs opacity-75 mt-1">Faktury wystawione</div>
                </div>

                <div class="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 text-white shadow-xl">
                  <div class="flex items-center justify-between mb-3">
                    <span class="material-symbols-outlined text-4xl opacity-80">event</span>
                    <span class="text-4xl font-bold">{{ upcomingEvents().length }}</span>
                  </div>
                  <div class="text-sm opacity-90">Nadchodzące terminy</div>
                  <div class="text-xs opacity-75 mt-1">W tym tygodniu</div>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="bg-slate-900 rounded-xl border border-slate-800 p-6 mb-6">
                <h3 class="text-lg font-semibold text-white mb-4">Szybkie akcje</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button class="flex flex-col items-center gap-2 p-4 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                    <span class="material-symbols-outlined text-3xl text-blue-400">add_circle</span>
                    <span class="text-sm text-white">Nowa sprawa</span>
                  </button>
                  <button class="flex flex-col items-center gap-2 p-4 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                    <span class="material-symbols-outlined text-3xl text-purple-400">person_add</span>
                    <span class="text-sm text-white">Nowy klient</span>
                  </button>
                  <button class="flex flex-col items-center gap-2 p-4 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                    <span class="material-symbols-outlined text-3xl text-green-400">description</span>
                    <span class="text-sm text-white">Nowa faktura</span>
                  </button>
                  <button class="flex flex-col items-center gap-2 p-4 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                    <span class="material-symbols-outlined text-3xl text-orange-400">upload</span>
                    <span class="text-sm text-white">Upload plików</span>
                  </button>
                </div>
              </div>

              <!-- Recent Cases -->
              <div class="bg-slate-900 rounded-xl border border-slate-800 p-6">
                <h3 class="text-lg font-semibold text-white mb-4">Ostatnie sprawy</h3>
                <div class="space-y-3">
                  @for (caseItem of allCases().slice(0, 5); track caseItem.id) {
                    <div class="flex items-center justify-between p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer">
                      <div class="flex-1">
                        <div class="text-white font-medium">{{ caseItem.title }}</div>
                        <div class="text-sm text-slate-400">{{ caseItem.signature }}</div>
                      </div>
                      <span [class]="getStatusClass(caseItem.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                        {{ getStatusLabel(caseItem.status) }}
                      </span>
                    </div>
                  }
                </div>
              </div>
            </div>
          }

          <!-- Cases View -->
          @if (currentView() === 'cases') {
            <div>
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-white">Zarządzanie sprawami</h2>
                <button class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                  <span class="material-symbols-outlined">add</span>
                  <span>Nowa sprawa</span>
                </button>
              </div>

              <div class="bg-slate-900 rounded-xl border border-slate-800 p-6">
                <div class="space-y-3">
                  @for (caseItem of allCases(); track caseItem.id) {
                    <div class="bg-slate-800 rounded-lg p-4 border border-slate-700">
                      <div class="flex items-start justify-between mb-3">
                        <div class="flex-1">
                          <h3 class="text-white font-semibold text-lg mb-1">{{ caseItem.title }}</h3>
                          <div class="flex items-center gap-3 text-sm text-slate-400">
                            <span>{{ caseItem.signature }}</span>
                            <span>•</span>
                            <span>{{ caseItem.category }}</span>
                          </div>
                        </div>
                        <span [class]="getStatusClass(caseItem.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                          {{ getStatusLabel(caseItem.status) }}
                        </span>
                      </div>

                      <div class="flex items-center gap-4 mt-4">
                        <button class="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm transition-colors">
                          <span class="material-symbols-outlined text-base">edit</span>
                          <span>Edytuj</span>
                        </button>
                        <button class="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors">
                          <span class="material-symbols-outlined text-base">upload</span>
                          <span>Pliki</span>
                        </button>
                        <button class="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors">
                          <span class="material-symbols-outlined text-base">visibility</span>
                          <span>Szczegóły</span>
                        </button>
                        <button class="flex items-center gap-2 px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded text-sm transition-colors ml-auto">
                          <span class="material-symbols-outlined text-base">delete</span>
                          <span>Usuń</span>
                        </button>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          }

          <!-- Other views placeholder -->
          @if (currentView() !== 'dashboard' && currentView() !== 'cases') {
            <div class="bg-slate-900 rounded-xl border border-slate-800 p-12 text-center">
              <span class="material-symbols-outlined text-6xl text-slate-600 mb-4">construction</span>
              <h3 class="text-xl font-semibold text-white mb-2">Widok: {{ currentView() }}</h3>
              <p class="text-slate-400">Sekcja w budowie - zaawansowany interfejs kancelarii</p>
            </div>
          }
        </main>
      </div>
    </div>
  `
})
export class LawyerDashboardComponent {
  auth = inject(AuthService);
  caseService = inject(CaseService);
  fileService = inject(FileService);
  clientService = inject(ClientService);
  invoiceService = inject(InvoiceService);
  calendarService = inject(CalendarService);

  user = this.auth.currentUser;
  currentView = signal<string>('dashboard');
  showProfile = signal(false);

  allCases = computed(() => this.caseService.getAllCases());
  activeCases = computed(() => this.caseService.getCasesByStatus('in-progress'));
  allClients = computed(() => this.clientService.getAllClients());

  upcomingEvents = computed(() => {
    const events = this.calendarService.getUpcomingEvents(7);
    return events;
  });

  totalRevenue = computed(() => {
    const invoices = this.invoiceService.getAllInvoices();
    const paid = invoices.filter(i => i.status === 'paid');
    return paid.reduce((sum, inv) => sum + inv.totalAmount, 0);
  });

  logout() {
    this.auth.logout();
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
