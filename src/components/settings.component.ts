
import { Component, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CaseService } from '../services/case.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
       <div class="bg-slate-900 border border-slate-700 p-6 rounded-xl w-full max-w-sm">
          <h2 class="text-xl font-bold text-white mb-4">Ustawienia</h2>
          <div class="mb-4 text-gray-400 text-sm">Zalogowany: {{ auth.currentUser()?.username }}</div>
          
          <h3 class="font-bold text-white mb-2 text-sm">Hasło</h3>
          <input [(ngModel)]="np" type="password" placeholder="Nowe hasło" class="w-full bg-slate-800 border border-slate-700 rounded p-2 mb-2 text-white">
          <button (click)="cp()" [disabled]="!np" class="w-full bg-slate-800 text-white py-2 rounded mb-4 hover:bg-slate-700">Zmień</button>
          
          <h3 class="font-bold text-white mb-2 text-sm">Dane</h3>
          <button (click)="dl()" class="w-full bg-green-600 text-white py-2 rounded mb-2 hover:bg-green-500">Pobierz Backup (JSON)</button>
          <div class="relative">
             <input type="file" (change)="up($event)" class="absolute inset-0 opacity-0 cursor-pointer">
             <button class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500">Wgraj Backup</button>
          </div>
          
          <button (click)="close.emit()" class="mt-6 w-full text-gray-500 hover:text-white">Zamknij</button>
          @if(msg) { <p class="text-green-400 text-center mt-2 text-xs">{{ msg }}</p> }
       </div>
    </div>
  `
})
export class SettingsComponent {
  auth = inject(AuthService);
  cs = inject(CaseService);
  close = output<void>();
  np=''; msg='';

  cp() { this.auth.updatePassword(this.np); this.msg='Hasło zmienione'; this.np=''; }
  dl() {
     const b = new Blob([this.cs.exportDataJson()], {type:'application/json'});
     const u = URL.createObjectURL(b);
     const a = document.createElement('a'); a.href=u; a.download='backup.json'; a.click();
  }
  up(e:any) {
     const f = e.target.files[0];
     if(f) {
        const r = new FileReader();
        r.onload = (x) => { if(this.cs.importDataJson(x.target?.result as string)) this.msg='Dane wgrane'; };
        r.readAsText(f);
     }
  }
}
