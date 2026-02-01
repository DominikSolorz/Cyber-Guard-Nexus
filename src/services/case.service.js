
import { Injectable, signal, computed, inject } from '@angular/core';
import { AuthService } from './auth.service';

export 
export 
export 

@Injectable({ providedIn: 'root' })
export class CaseService {
  private authService = inject(AuthService);
  private allCasesSignal = signal<LegalCase[]>([]);
  private readonly KEY = 'ekancelaria_cases_v2';

  constructor() { this.load(); }

  private load() {
     try {
        const d = localStorage.getItem(this.KEY);
        if(d) {
           const parsed = JSON.parse(d);
           parsed.forEach((c:any) => {
              if(c.deadline) c.deadline = new Date(c.deadline);
              c.files.forEach((f:any) => f.dateAdded = new Date(f.dateAdded));
           });
           this.allCasesSignal.set(parsed);
        }
     } catch(e) { console.error(e); }
  }

  private save() {
     localStorage.setItem(this.KEY, JSON.stringify(this.allCasesSignal()));
  }

  cases = computed(() => this.allCasesSignal());

  addCase(title: string, desc: string, deadline?: Date) {
     const owner = this.authService.currentUser()?.id || '1';
     const nc = { id: crypto.randomUUID(), ownerId: owner, title, description: desc, status: 'Nowa', deadline, folders: [], files: [] };
     this.allCasesSignal.update(l => [nc, ...l]);
     this.save();
  }

  updateCaseStatus(id: string, s: 'Nowa'|'W toku'|'Zakończona') {
     this.allCasesSignal.update(l => l.map(c => c.id===id ? {...c, status: s} : c));
     this.save();
  }

  addFolder(cid: string, name: string) {
     const f = { id: crypto.randomUUID(), name, isExpanded: true };
     this.allCasesSignal.update(l => l.map(c => c.id===cid ? {...c, folders: [...c.folders, f]} : c));
     this.save();
  }

  deleteFolder(cid: string, fid: string) {
     this.allCasesSignal.update(l => l.map(c => c.id===cid ? {...c, folders: c.folders.filter(x=>x.id!==fid), files: c.files.filter(x=>x.folderId!==fid)} : c));
     this.save();
  }
  
  toggleFolder(cid: string, fid: string) {
      this.allCasesSignal.update(l => l.map(c => c.id===cid ? {...c, folders: c.folders.map(f => f.id===fid ? {...f, isExpanded: !f.isExpanded} : f)} : c));
      this.save();
  }

  addFileToCase(cid: string, file, url: string, fid: string|null): string {
     const type = this.getType(file.name, file.type);
     const newFile = { 
        id: crypto.randomUUID(), folderId: fid, name: file.name, type, 
        size: (file.size/1024).toFixed(1)+' KB', dateAdded: new Date(), contentUrl: url 
     };
     this.allCasesSignal.update(l => l.map(c => c.id===cid ? {...c, files: [...c.files, newFile]} : c));
     this.save();
     return newFile.id;
  }

  renameFile(cid: string, fid: string, name: string) {
     this.allCasesSignal.update(l => l.map(c => c.id===cid ? {...c, files: c.files.map(f => f.id===fid ? {...f, name} : f)} : c));
     this.save();
  }

  deleteFile(cid: string, fid: string) {
     this.allCasesSignal.update(l => l.map(c => c.id===cid ? {...c, files: c.files.filter(f => f.id!==fid)} : c));
     this.save();
  }

  exportDataJson() { return JSON.stringify(this.allCasesSignal()); }
  importDataJson(json: string): boolean {
     try {
        const p = JSON.parse(json);
        if(Array.isArray(p)) {
           this.allCasesSignal.set(p);
           this.save();
           return true;
        }
     } catch(e){}
     return false;
  }

  private getType(n: string, m: string): 'pdf'|'image'|'word'|'other' {
     n = n.toLowerCase(); m = m.toLowerCase();
     if(m.includes('pdf') || n.endsWith('.pdf')) return 'pdf';
     if(m.includes('image') || n.match(/\.(jpg|png|jpeg|webp)$/)) return 'image';
     if(m.includes('word') || n.match(/\.(doc|docx)$/)) return 'word';
     return 'other';
  }
}
