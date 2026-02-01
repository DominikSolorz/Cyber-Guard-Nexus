
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-950">
      <div class="bg-slate-900 p-8 rounded-xl shadow-2xl w-full max-w-sm border border-slate-800">
         <h1 class="text-2xl font-bold text-white mb-6 text-center">E-Kancelaria</h1>
         <input [(ngModel)]="u" placeholder="Login" class="w-full mb-3 bg-slate-800 border border-slate-700 rounded p-3 text-white">
         <input [(ngModel)]="p" type="password" placeholder="Hasło" class="w-full mb-6 bg-slate-800 border border-slate-700 rounded p-3 text-white">
         <button (click)="login()" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded mb-4">Zaloguj</button>
         <button (click)="reg=!reg" class="w-full text-sm text-gray-500 hover:text-white">{{ reg ? 'Mam konto' : 'Załóż konto' }}</button>
         @if(err) { <p class="text-red-500 text-center mt-4 text-sm">{{ err }}</p> }
      </div>
    </div>
  `
})
export class LoginComponent {
  auth = inject(AuthService);
  u=''; p=''; reg=false; err='';
  login() {
     if(this.reg) {
        if(!this.auth.register(this.u, this.p)) this.err = 'Login zajęty';
     } else {
        if(!this.auth.login(this.u, this.p)) this.err = 'Błąd logowania';
     }
  }
}
