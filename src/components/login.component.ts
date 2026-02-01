
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <!-- Background pattern -->
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNjAgMTAgTSAxMCAwIEwgMTAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

      <div class="relative w-full max-w-md">
        <!-- Logo and Title -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-2xl shadow-blue-900/50 mb-4">
            <span class="material-symbols-outlined text-5xl text-white">balance</span>
          </div>
          <h1 class="text-4xl font-bold text-white mb-2">E-Kancelaria Pro</h1>
          <p class="text-blue-200 text-sm">System zarządzania kancelarią prawną</p>
        </div>

        <!-- Login Card -->
        <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
          
          @if (!isRegistering()) {
            <!-- Login Form -->
            <h2 class="text-2xl font-bold text-white mb-6">Logowanie</h2>
            
            @if (error()) {
              <div class="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-center gap-2">
                <span class="material-symbols-outlined text-lg">error</span>
                {{ error() }}
              </div>
            }

            <form (ngSubmit)="handleLogin()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-blue-100 mb-2">Email lub nazwa użytkownika</label>
                <div class="relative">
                  <span class="material-symbols-outlined absolute left-3 top-2.5 text-blue-300">person</span>
                  <input 
                    type="text" 
                    [(ngModel)]="username" 
                    name="username"
                    placeholder="Wprowadź login"
                    required
                    class="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 pl-11 pr-4 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-blue-100 mb-2">Hasło</label>
                <div class="relative">
                  <span class="material-symbols-outlined absolute left-3 top-2.5 text-blue-300">lock</span>
                  <input 
                    [type]="showPassword() ? 'text' : 'password'" 
                    [(ngModel)]="password" 
                    name="password"
                    placeholder="Wprowadź hasło"
                    required
                    class="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 pl-11 pr-12 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                  <button 
                    type="button"
                    (click)="showPassword.set(!showPassword())"
                    class="absolute right-3 top-2.5 text-blue-300 hover:text-white transition-colors">
                    <span class="material-symbols-outlined">{{ showPassword() ? 'visibility_off' : 'visibility' }}</span>
                  </button>
                </div>
              </div>

              <div class="flex items-center justify-between text-sm">
                <label class="flex items-center text-blue-100 cursor-pointer">
                  <input type="checkbox" class="mr-2 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500">
                  Zapamiętaj mnie
                </label>
                <a href="#" class="text-blue-300 hover:text-blue-200 transition-colors">Zapomniałeś hasła?</a>
              </div>

              <button 
                type="submit"
                class="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg shadow-blue-900/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                Zaloguj się
              </button>
            </form>

            <div class="mt-6 text-center">
              <button 
                (click)="isRegistering.set(true)"
                class="text-blue-300 hover:text-blue-200 text-sm transition-colors">
                Nie masz konta? <span class="font-semibold">Zarejestruj się</span>
              </button>
            </div>

          } @else {
            <!-- Registration Form -->
            <h2 class="text-2xl font-bold text-white mb-6">Rejestracja</h2>
            
            @if (error()) {
              <div class="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-center gap-2">
                <span class="material-symbols-outlined text-lg">error</span>
                {{ error() }}
              </div>
            }

            <form (ngSubmit)="handleRegister()" class="space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-blue-100 mb-2">Imię</label>
                  <input 
                    type="text" 
                    [(ngModel)]="registerData.firstName" 
                    name="firstName"
                    placeholder="Jan"
                    required
                    class="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 px-4 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                </div>
                <div>
                  <label class="block text-sm font-medium text-blue-100 mb-2">Nazwisko</label>
                  <input 
                    type="text" 
                    [(ngModel)]="registerData.lastName" 
                    name="lastName"
                    placeholder="Kowalski"
                    required
                    class="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 px-4 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-blue-100 mb-2">Email</label>
                <input 
                  type="email" 
                  [(ngModel)]="registerData.email" 
                  name="email"
                  placeholder="jan.kowalski@example.com"
                  required
                  class="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 px-4 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
              </div>

              <div>
                <label class="block text-sm font-medium text-blue-100 mb-2">Nazwa użytkownika</label>
                <input 
                  type="text" 
                  [(ngModel)]="registerData.username" 
                  name="username"
                  placeholder="j.kowalski"
                  required
                  class="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 px-4 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
              </div>

              <div>
                <label class="block text-sm font-medium text-blue-100 mb-2">Telefon</label>
                <input 
                  type="tel" 
                  [(ngModel)]="registerData.phone" 
                  name="phone"
                  placeholder="+48 123 456 789"
                  class="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 px-4 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
              </div>

              <div>
                <label class="block text-sm font-medium text-blue-100 mb-2">Hasło</label>
                <input 
                  type="password" 
                  [(ngModel)]="registerData.password" 
                  name="password"
                  placeholder="Minimum 8 znaków"
                  required
                  minlength="8"
                  class="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 px-4 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
              </div>

              <div>
                <label class="block text-sm font-medium text-blue-100 mb-2">Potwierdź hasło</label>
                <input 
                  type="password" 
                  [(ngModel)]="confirmPassword" 
                  name="confirmPassword"
                  placeholder="Wprowadź hasło ponownie"
                  required
                  class="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 px-4 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
              </div>

              <label class="flex items-center text-blue-100 text-sm cursor-pointer">
                <input type="checkbox" required class="mr-2 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500">
                Akceptuję regulamin i politykę prywatności
              </label>

              <button 
                type="submit"
                class="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg shadow-blue-900/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                Zarejestruj się
              </button>
            </form>

            <div class="mt-6 text-center">
              <button 
                (click)="isRegistering.set(false); error.set('')"
                class="text-blue-300 hover:text-blue-200 text-sm transition-colors">
                Masz już konto? <span class="font-semibold">Zaloguj się</span>
              </button>
            </div>
          }
        </div>

        <!-- Footer -->
        <div class="mt-8 text-center text-blue-200/60 text-xs">
          <p>&copy; 2026 E-Kancelaria Pro. Wszelkie prawa zastrzeżone.</p>
          <p class="mt-1">Wersja 2.0.0 Professional</p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  auth = inject(AuthService);
  username = '';
  password = '';
  showPassword = signal(false);
  error = signal('');
  isRegistering = signal(false);
  confirmPassword = '';

  registerData = {
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  };

  handleLogin() {
    this.error.set('');
    if(!this.username || !this.password) {
      this.error.set('Wypełnij wszystkie pola');
      return;
    }

    const success = this.auth.login(this.username, this.password);
    if(!success) {
      this.error.set('Nieprawidłowy login lub hasło');
    }
  }

  handleRegister() {
    this.error.set('');
    
    if(!this.registerData.email || !this.registerData.username || !this.registerData.password ||
       !this.registerData.firstName || !this.registerData.lastName) {
      this.error.set('Wypełnij wszystkie wymagane pola');
      return;
    }

    if(this.registerData.password.length < 8) {
      this.error.set('Hasło musi mieć minimum 8 znaków');
      return;
    }

    if(this.registerData.password !== this.confirmPassword) {
      this.error.set('Hasła nie są identyczne');
      return;
    }

    const result = this.auth.register(this.registerData);
    if(!result.success) {
      this.error.set(result.message || 'Błąd rejestracji');
    }
  }
}
