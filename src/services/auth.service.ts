
import { Injectable, signal } from '@angular/core';
import { User, UserRole, UserSettings } from '../models/types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User|null>(null);
  private users: User[] = [];
  private readonly USERS_KEY = 'ekancelaria_users_v2';
  private readonly SESSION_KEY = 'ekancelaria_session_v2';

  constructor() {
     this.loadUsers();
     this.restoreSession();
  }

  private loadUsers() {
     const stored = localStorage.getItem(this.USERS_KEY);
     if(stored) {
       try {
         const parsed = JSON.parse(stored);
         this.users = parsed.map((u: any) => ({
           ...u,
           createdAt: new Date(u.createdAt),
           lastLogin: u.lastLogin ? new Date(u.lastLogin) : undefined
         }));
       } catch(e) {
         console.error('Error loading users:', e);
         this.users = [];
       }
     } else {
       this.users = [];
     }

     // Utwórz konto admina jeśli nie istnieje
     this.ensureAdminExists();
  }

  private ensureAdminExists() {
     const adminExists = this.users.some(u => u.role === 'admin');
     if (!adminExists) {
       const adminUser: User = {
         id: 'admin-001',
         email: 'admin@ekancelaria.pl',
         username: 'admin',
         password: this.hashPassword('Admin2026!'),
         role: 'admin',
         firstName: 'Administrator',
         lastName: 'Systemu',
         phone: '+48 800 900 100',
         isActive: true,
         createdAt: new Date(),
         settings: this.getDefaultSettings()
       };
       this.users.push(adminUser);
       this.saveUsers();
       console.log('✅ Konto admina utworzone!');
       console.log('Login: admin');
       console.log('Hasło: Admin2026!');
     }
  }

  private getDefaultSettings(): UserSettings {
    return {
      theme: 'dark',
      language: 'pl',
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      twoFactorAuth: false
    };
  }

  private restoreSession() {
     const session = localStorage.getItem(this.SESSION_KEY);
     if(session) {
       try {
         const user = JSON.parse(session);
         user.createdAt = new Date(user.createdAt);
         if(user.lastLogin) user.lastLogin = new Date(user.lastLogin);
         this.currentUser.set(user);
       } catch(e) {
         console.error('Error restoring session:', e);
         localStorage.removeItem(this.SESSION_KEY);
       }
     }
  }

  private saveUsers() {
     localStorage.setItem(this.USERS_KEY, JSON.stringify(this.users));
  }

  private saveSession(user: User) {
     localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
  }

  login(username: string, password: string): boolean {
     const user = this.users.find(u => 
       (u.username === username || u.email === username) && u.isActive
     );
     
     if(user && this.verifyPassword(password, user.password)) {
       user.lastLogin = new Date();
       const userCopy = {...user};
       delete userCopy.password; // Nie przechowuj hasła w sesji
       
       this.currentUser.set(userCopy);
       this.saveSession(userCopy);
       this.updateUserLastLogin(user.id);
       return true;
     }
     return false;
  }

  logout() {
     this.currentUser.set(null);
     localStorage.removeItem(this.SESSION_KEY);
  }

  register(data: {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: UserRole;
    licenseNumber?: string; // Dla adwokatów
    specialization?: string[]; // Dla adwokatów
    pesel?: string; // Dla klientów
    nip?: string; // Dla firm
    companyName?: string; // Dla firm
    address?: { street: string; city: string; postalCode: string; country: string; };
  }): { success: boolean; message?: string; needsVerification?: boolean } {
     // Walidacja
     if(!data.email || !data.username || !data.password || !data.firstName || !data.lastName) {
       return { success: false, message: 'Wszystkie pola są wymagane' };
     }

     if(data.password.length < 8) {
       return { success: false, message: 'Hasło musi mieć minimum 8 znaków' };
     }

     if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
       return { success: false, message: 'Nieprawidłowy format email' };
     }

     if(this.users.some(u => u.username === data.username)) {
       return { success: false, message: 'Nazwa użytkownika już zajęta' };
     }

     if(this.users.some(u => u.email === data.email)) {
       return { success: false, message: 'Email już zarejestrowany' };
     }

     const newUser: User = {
       id: crypto.randomUUID(),
       email: data.email,
       username: data.username,
       password: this.hashPassword(data.password),
       role: data.role || 'client',
       firstName: data.firstName,
       lastName: data.lastName,
       phone: data.phone,
       isActive: data.role === 'lawyer' || data.role === 'assistant' ? false : true, // Kancelaria wymaga weryfikacji
       createdAt: new Date(),
       settings: this.getDefaultSettings()
     };

     // Dodatkowe dane dla adwokatów
     if(data.role === 'lawyer') {
       newUser.licenseNumber = data.licenseNumber;
       newUser.specialization = data.specialization;
     }

     // Dodatkowe dane dla klientów
     if(data.role === 'client') {
       newUser.pesel = data.pesel;
       newUser.nip = data.nip;
       newUser.companyName = data.companyName;
       newUser.address = data.address;
     }

     this.users.push(newUser);
     this.saveUsers();
     
     if(newUser.role === 'lawyer' || newUser.role === 'assistant') {
       return { 
         success: true, 
         message: 'Konto utworzone. Oczekiwanie na weryfikację administratora.',
         needsVerification: true
       };
     }

     // Auto-login dla klientów
     const loginSuccess = this.login(data.username, data.password);
     return { 
       success: loginSuccess, 
       message: loginSuccess ? 'Konto utworzone pomyślnie' : 'Błąd podczas logowania' 
     };
  }

  private hashPassword(password: string): string {
    // W produkcji użyj prawdziwego hashowania (bcrypt, scrypt)
    // To jest tylko placeholder do localStorage
    return btoa(password); // Base64 - NIE UŻYWAJ w produkcji!
  }

  private verifyPassword(input: string, hashed: string): boolean {
    return this.hashPassword(input) === hashed;
  }

  updateProfile(updates: Partial<User>): boolean {
     const current = this.currentUser();
     if(!current) return false;

     const userIndex = this.users.findIndex(u => u.id === current.id);
     if(userIndex === -1) return false;

     const updatedUser = {...this.users[userIndex], ...updates};
     delete updates.password; // Hasło aktualizowane osobno
     delete updates.role; // Rola aktualizowana tylko przez admina
     
     this.users[userIndex] = updatedUser;
     this.saveUsers();
     
     const sessionUser = {...updatedUser};
     delete sessionUser.password;
     this.currentUser.set(sessionUser);
     this.saveSession(sessionUser);
     
     return true;
  }

  updatePassword(newPassword: string, currentPassword?: string): boolean {
     const current = this.currentUser();
     if(!current) return false;

     const userIndex = this.users.findIndex(u => u.id === current.id);
     if(userIndex === -1) return false;

     // Weryfikuj stare hasło jeśli podano
     if(currentPassword && this.users[userIndex].password !== currentPassword) {
       return false;
     }

     this.users[userIndex].password = newPassword;
     this.saveUsers();
     return true;
  }

  private updateUserLastLogin(userId: string) {
     const userIndex = this.users.findIndex(u => u.id === userId);
     if(userIndex !== -1) {
       this.users[userIndex].lastLogin = new Date();
       this.saveUsers();
     }
  }

  getAllUsers(): User[] {
     return this.users.map(u => {
       const copy = {...u};
       delete copy.password;
       return copy;
     });
  }

  getUsersByRole(role: UserRole): User[] {
     return this.users
       .filter(u => u.role === role)
       .map(u => {
         const copy = {...u};
         delete copy.password;
         return copy;
       });
  }

  getLawyers(): User[] {
     return this.getUsersByRole('lawyer');
  }

  getClients(): User[] {
     return this.getUsersByRole('client');
  }

  getUserById(id: string): User | undefined {
     const user = this.users.find(u => u.id === id);
     if(user) {
       const copy = {...user};
       delete copy.password;
       return copy;
     }
     return undefined;
  }

  hasPermission(permission: string): boolean {
     const user = this.currentUser();
     if(!user || !user.isActive) return false;

     // Admin ma wszystkie uprawnienia
     if(user.role === 'admin') return true;

     // Definicje uprawnień dla ról - KLIENT MA TYLKO READ!
     const permissions: Record<UserRole, string[]> = {
       'admin': ['*'],
       'lawyer': [
         'cases.view',
         'cases.create',
         'cases.edit',
         'cases.delete',
         'files.view',
         'files.upload',
         'files.delete',
         'files.edit',
         'clients.view',
         'clients.create',
         'clients.edit',
         'clients.delete',
         'invoices.view',
         'invoices.create',
         'invoices.edit',
         'invoices.delete',
         'calendar.view',
         'calendar.create',
         'calendar.edit',
         'calendar.delete',
         'messages.send',
         'messages.view',
         'reports.generate',
         'reports.view',
         'tasks.view',
         'tasks.create',
         'tasks.edit',
         'tasks.delete'
       ],
       'assistant': [
         'cases.view',
         'cases.edit',
         'files.view',
         'files.upload',
         'clients.view',
         'clients.edit',
         'calendar.view',
         'calendar.create',
         'calendar.edit',
         'messages.send',
         'messages.view',
         'tasks.view',
         'tasks.create',
         'tasks.edit'
       ],
       'client': [
         // TYLKO ODCZYT!
         'cases.view_own',
         'files.view_own',
         'files.download_own',
         'messages.view_own',
         'messages.send',
         'invoices.view_own',
         'calendar.view_own',
         'tasks.view_own'
       ]
     };

     return permissions[user.role]?.includes(permission) || false;
  }

  // Pomocnicze metody sprawdzania uprawnień
  canUploadFiles(): boolean {
    const role = this.currentUser()?.role;
    return role === 'admin' || role === 'lawyer' || role === 'assistant';
  }

  canDeleteFiles(): boolean {
    const role = this.currentUser()?.role;
    return role === 'admin' || role === 'lawyer';
  }

  canEditCases(): boolean {
    const role = this.currentUser()?.role;
    return role === 'admin' || role === 'lawyer' || role === 'assistant';
  }

  canDeleteCases(): boolean {
    const role = this.currentUser()?.role;
    return role === 'admin' || role === 'lawyer';
  }

  canManageClients(): boolean {
    const role = this.currentUser()?.role;
    return role === 'admin' || role === 'lawyer';
  }

  isReadOnly(): boolean {
    return this.currentUser()?.role === 'client';
  }

  isAdmin(): boolean {
     return this.currentUser()?.role === 'admin';
  }

  isLawyer(): boolean {
     return this.currentUser()?.role === 'lawyer';
  }

  isClient(): boolean {
     return this.currentUser()?.role === 'client';
  }
}
