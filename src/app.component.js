
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './components/login.component';
import { DashboardComponent } from './components/dashboard.component';

registerLocaleData(localePl, 'pl');

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LoginComponent, DashboardComponent, DatePipe],
  template: `
    @if (isLoading()) {
      <div class="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center text-white">
         <div class="animate-spin text-4xl material-symbols-outlined mb-4 text-blue-500">sync</div>
         <h1 class="text-2xl font-bold">E-Kancelaria Pro</h1>
      </div>
    } @else {
      @if (auth.currentUser()) {
         <nav class="bg-slate-900 border-b border-white/5 px-6 py-3 flex justify-between items-center text-white">
            <div class="flex items-center gap-2 font-bold text-lg">
               <span class="material-symbols-outlined text-blue-500">balance</span> E-Kancelaria Pro
            </div>
            <div class="flex items-center gap-4">
               <span class="text-sm text-gray-400">{{ now | date:'shortTime' }}</span>
               <div class="text-right">
                  <div class="text-sm font-medium">{{ auth.currentUser()?.username }}</div>
                  <div class="text-[10px] text-gray-500 uppercase">{{ auth.currentUser()?.role }}</div>
               </div>
               <button (click)="auth.logout()" class="p-2 hover:bg-white/10 rounded-full"><span class="material-symbols-outlined">logout</span></button>
            </div>
         </nav>
         <app-dashboard></app-dashboard>
      } @else {
         <app-login></app-login>
      }
    }
  `
})
export class AppComponent implements OnInit {
  auth = inject(AuthService);
  isLoading = signal(true);
  now = new Date();

  ngOnInit() {
     setTimeout(() => this.isLoading.set(false), 1000);
     setInterval(() => this.now = new Date(), 60000);
  }
}
