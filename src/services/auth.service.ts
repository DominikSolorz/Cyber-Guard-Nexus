
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
         this.createDefaultUsers();
       }
     } else {
       this.createDefaultUsers();
     }
  }

  private createDefaultUsers() {
     const now = new Date();
     this.users = [
       {
         id: '1',
         email: 'admin@kancelaria.pl',
         username: 'admin',
         password: 'admin123',
         role: 'admin',
         firstName: 'Administrator',
         lastName: 'Systemu',
         phone: '+48 123 456 789',
         isActive: true,
         createdAt: now,
         settings: this.getDefaultSettings()
       },
       {
         id: '2',
         email: 'jan.kowalski@kancelaria.pl',
         username: 'j.kowalski',
         password: 'lawyer123',
         role: 'lawyer',
         firstName: 'Jan',
         lastName: 'Kowalski',
         phone: '+48 500 100 200',
         licenseNumber: 'ADW/12345/2020',
         specialization: ['Prawo cywilne', 'Prawo rodzinne', 'Prawo spadkowe'],
         isActive: true,
         createdAt: now,
         settings: this.getDefaultSettings()
       },
       {
         id: '3',
         email: 'anna.nowak@kancelaria.pl',
         username: 'a.nowak',
         password: 'lawyer123',
         role: 'lawyer',
         firstName: 'Anna',
         lastName: 'Nowak',
         phone: '+48 600 200 300',
         licenseNumber: 'ADW/67890/2018',
         specialization: ['Prawo karne', 'Prawo gospodarcze'],
         isActive: true,
         createdAt: now,
         settings: this.getDefaultSettings()
       },
       {
         id: '4',
         email: 'maria.wisniewska@example.com',
         username: 'm.wisniewska',
         password: 'client123',
         role: 'client',
         firstName: 'Maria',
         lastName: 'Wiśniewska',
         phone: '+48 700 300 400',
         pesel: '85010112345',
         address: {
           street: 'ul. Kwiatowa 15/3',
           city: 'Warszawa',
           postalCode: '00-001',
           country: 'Polska'
         },
         isActive: true,
         createdAt: now,
         settings: this.getDefaultSettings()
       },
       {
         id: '5',
         email: 'asystent@kancelaria.pl',
         username: 'asystent',
         password: 'assist123',
         role: 'assistant',
         firstName: 'Piotr',
         lastName: 'Zieliński',
         phone: '+48 800 400 500',
         isActive: true,
         createdAt: now,
         settings: this.getDefaultSettings()
       }
     ];
     this.saveUsers();
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
       (u.username === username || u.email === username) && u.password === password && u.isActive
     );
     
     if(user) {
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
  }): boolean {
     if(this.users.some(u => u.username === data.username || u.email === data.email)) {
       return false;
     }

     const newUser: User = {
       id: crypto.randomUUID(),
       email: data.email,
       username: data.username,
       password: data.password,
       role: data.role || 'client',
       firstName: data.firstName,
       lastName: data.lastName,
       phone: data.phone,
       isActive: true,
       createdAt: new Date(),
       settings: this.getDefaultSettings()
     };

     this.users.push(newUser);
     this.saveUsers();
     return this.login(data.username, data.password);
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
     if(!user) return false;

     // Admin ma wszystkie uprawnienia
     if(user.role === 'admin') return true;

     // Definicje uprawnień dla ról
     const permissions: Record<UserRole, string[]> = {
       'admin': ['*'],
       'lawyer': [
         'cases.view',
         'cases.create',
         'cases.edit',
         'cases.delete',
         'files.upload',
         'files.delete',
         'clients.view',
         'clients.create',
         'invoices.create',
         'reports.generate'
       ],
       'assistant': [
         'cases.view',
         'cases.edit',
         'files.upload',
         'clients.view',
         'calendar.manage'
       ],
       'client': [
         'cases.view_own',
         'files.view_own',
         'messages.send',
         'invoices.view_own'
       ]
     };

     return permissions[user.role]?.includes(permission) || false;
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
