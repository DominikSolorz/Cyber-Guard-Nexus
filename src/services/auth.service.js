
import { Injectable, signal } from '@angular/core';

export 

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User|null>(null);
  private users = [];

  constructor() {
     const u = localStorage.getItem('ekancelaria_users');
     this.users = u ? JSON.parse(u) : [{id:'1', username:'admin', role:'admin', password:'123'}];
     const s = localStorage.getItem('ekancelaria_session');
     if(s) this.currentUser.set(JSON.parse(s));
     else {
        // Auto-login admin for demo
        this.login('admin', '123');
     }
  }

  login(u: string, p: string): boolean {
     const user = this.users.find(x => x.username === u && x.password === p);
     if(user) { this.currentUser.set(user); localStorage.setItem('ekancelaria_session', JSON.stringify(user)); return true; }
     return false;
  }

  logout() {
     this.currentUser.set(null);
     localStorage.removeItem('ekancelaria_session');
  }

  register(u: string, p: string): boolean {
     if(this.users.some(x => x.username === u)) return false;
     const nu = { id: crypto.randomUUID(), username: u, password: p, role: 'user' };
     this.users.push(nu);
     localStorage.setItem('ekancelaria_users', JSON.stringify(this.users));
     return this.login(u, p);
  }

  updatePassword(np: string) {
     const c = this.currentUser();
     if(c) {
        c.password = np;
        const idx = this.users.findIndex(x => x.id === c.id);
        if(idx !== -1) this.users[idx] = c;
        localStorage.setItem('ekancelaria_users', JSON.stringify(this.users));
     }
  }
}
