
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './components/login.component';
import { ClientDashboardComponent } from './components/client-dashboard.component';
import { LawyerDashboardComponent } from './components/lawyer-dashboard.component';

registerLocaleData(localePl, 'pl');

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LoginComponent, ClientDashboardComponent, LawyerDashboardComponent, DatePipe],
  template: `
    @if (isLoading()) {
      <div class="fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex flex-col items-center justify-center text-white">
         <div class="mb-6">
           <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-900/50 animate-pulse">
             <span class="material-symbols-outlined text-5xl text-white">balance</span>
           </div>
         </div>
         <h1 class="text-3xl font-bold mb-2">E-Kancelaria Pro</h1>
         <p class="text-blue-300 text-sm">Ładowanie aplikacji...</p>
      </div>
    } @else {
      @if (auth.currentUser()) {
         <!-- Route to appropriate dashboard based on user role -->
         @if (auth.isClient()) {
           <app-client-dashboard></app-client-dashboard>
         } @else {
           <app-lawyer-dashboard></app-lawyer-dashboard>
         }
      } @else {
         <app-login></app-login>
      }
    }
  `
})
export class AppComponent implements OnInit {
  auth = inject(AuthService);
  isLoading = signal(true);

  ngOnInit() {
     setTimeout(() => this.isLoading.set(false), 800);
  }
}
  }
}
