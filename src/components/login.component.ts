
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

            @if (success()) {
              <div class="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm flex items-center gap-2">
                <span class="material-symbols-outlined text-lg">check_circle</span>
                {{ success() }}
              </div>
            }

            <!-- Account Type Selection -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-blue-100 mb-3">Typ konta</label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  (click)="accountType.set('client')"
                  [class]="accountType() === 'client' 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'bg-white/5 border-white/20 text-blue-100 hover:bg-white/10'"
                  class="border-2 rounded-lg p-4 transition-all text-center">
                  <span class="material-symbols-outlined text-3xl mb-2">person</span>
                  <div class="font-semibold">Klient</div>
                  <div class="text-xs opacity-75">Osoba fizyczna/firma</div>
                </button>
                <button
                  type="button"
                  (click)="accountType.set('lawyer')"
                  [class]="accountType() === 'lawyer' 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'bg-white/5 border-white/20 text-blue-100 hover:bg-white/10'"
                  class="border-2 rounded-lg p-4 transition-all text-center">
                  <span class="material-symbols-outlined text-3xl mb-2">balance</span>
                  <div class="font-semibold">Kancelaria</div>
                  <div class="text-xs opacity-75">Adwokat/Radca prawny</div>
                </button>
              </div>
            </div>

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

              <!-- Lawyer-specific fields -->
              @if (accountType() === 'lawyer') {
                <div>
                  <label class="block text-sm font-medium text-blue-100 mb-2">Zawód</label>
                  <select 
                    [(ngModel)]="registerData.profession" 
                    name="profession"
                    required
                    class="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                    <option value="" class="bg-slate-800">Wybierz zawód</option>
                    <option value="lawyer" class="bg-slate-800">Adwokat</option>
                    <option value="attorney" class="bg-slate-800">Radca prawny</option>
                    <option value="notary" class="bg-slate-800">Notariusz</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-blue-100 mb-2">Numer licencji/uprawnień</label>
                  <input 
                    type="text" 
                    [(ngModel)]="registerData.licenseNumber" 
                    name="licenseNumber"
                    placeholder="ADW/12345/2020"
                    required
                    class="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 px-4 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                </div>

                <div>
                  <label class="block text-sm font-medium text-blue-100 mb-2">Specjalizacja (opcjonalnie)</label>
                  <input 
                    type="text" 
                    [(ngModel)]="registerData.specialization" 
                    name="specialization"
                    placeholder="Prawo karne, prawo rodzinne..."
                    class="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 px-4 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                </div>
              }

              <!-- Client-specific fields -->
              @if (accountType() === 'client') {
                <div>
                  <label class="block text-sm font-medium text-blue-100 mb-2">Typ klienta</label>
                  <select 
                    [(ngModel)]="registerData.clientType" 
                    name="clientType"
                    required
                    class="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                    <option value="" class="bg-slate-800">Wybierz typ</option>
                    <option value="individual" class="bg-slate-800">Osoba fizyczna</option>
                    <option value="company" class="bg-slate-800">Firma</option>
                  </select>
                </div>

                @if (registerData.clientType === 'individual') {
                  <div>
                    <label class="block text-sm font-medium text-blue-100 mb-2">PESEL (opcjonalnie)</label>
                    <input 
                      type="text" 
                      [(ngModel)]="registerData.pesel" 
                      name="pesel"
                      placeholder="85010112345"
                      maxlength="11"
                      class="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 px-4 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                  </div>
                }

                @if (registerData.clientType === 'company') {
                  <div>
                    <label class="block text-sm font-medium text-blue-100 mb-2">Nazwa firmy</label>
                    <input 
                      type="text" 
                      [(ngModel)]="registerData.companyName" 
                      name="companyName"
                      placeholder="ABC Sp. z o.o."
                      required
                      class="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 px-4 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-blue-100 mb-2">NIP</label>
                    <input 
                      type="text" 
                      [(ngModel)]="registerData.nip" 
                      name="nip"
                      placeholder="1234567890"
                      required
                      maxlength="10"
                      class="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 px-4 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                  </div>
                }
              }

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
  success = signal('');
  isRegistering = signal(false);
  confirmPassword = '';
  accountType = signal<'client' | 'lawyer'>('client');

  registerData: any = {
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    // Lawyer fields
    profession: '',
    licenseNumber: '',
    specialization: '',
    // Client fields
    clientType: '',
    pesel: '',
    companyName: '',
    nip: ''
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
    this.success.set('');
    
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

    // Walidacja specyficzna dla typu konta
    if(this.accountType() === 'lawyer') {
      if(!this.registerData.profession || !this.registerData.licenseNumber) {
        this.error.set('Wypełnij wszystkie pola dla kancelarii');
        return;
      }
    }

    if(this.accountType() === 'client') {
      if(!this.registerData.clientType) {
        this.error.set('Wybierz typ klienta');
        return;
      }
      if(this.registerData.clientType === 'company' && (!this.registerData.companyName || !this.registerData.nip)) {
        this.error.set('Wypełnij dane firmy');
        return;
      }
    }

    // Ustaw rolę
    const dataToSubmit = {
      ...this.registerData,
      role: this.accountType() === 'lawyer' ? 'lawyer' : 'client',
      specialization: this.registerData.specialization ? this.registerData.specialization.split(',').map((s: string) => s.trim()) : undefined
    };

    const result = this.auth.register(dataToSubmit);
    if(!result.success) {
      this.error.set(result.message || 'Błąd rejestracji');
    } else {
      if(result.needsVerification) {
        this.success.set('Konto utworzone! Oczekiwanie na weryfikację przez administratora.');
        setTimeout(() => {
          this.isRegistering.set(false);
          this.success.set('');
        }, 3000);
      }
    }
  }
}
