
import { Injectable, signal, computed, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { 
  LegalCase, CaseFile, CaseFolder, Task, CalendarEvent, Note, 
  TimelineEntry, Deadline, CaseStatus, CasePriority, TaskStatus,
  EventType, DocumentStatus
} from '../models/types';

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

  addCase(title: string, desc: string, caseNumber?: string, clientId?: string, type: string = 'Ogólna') {
     const owner = this.authService.currentUser()?.id || '1';
     const now = new Date();
     const nc: Partial<LegalCase> = { 
       id: crypto.randomUUID(), 
       caseNumber: caseNumber || `SPR/${now.getFullYear()}/${Math.floor(Math.random() * 10000)}`,
       title, 
       description: desc, 
       status: 'draft' as CaseStatus,
       priority: 'medium' as CasePriority,
       type,
       clientId: clientId || owner,
       assignedLawyers: [owner],
       createdAt: now,
       updatedAt: now,
       deadlines: [],
       folders: [], 
       files: [],
       tasks: [],
       events: [],
       notes: [],
       timeline: [{
         id: crypto.randomUUID(),
         type: 'custom',
         title: 'Sprawa utworzona',
         performedBy: owner,
         timestamp: now,
         icon: 'add_circle',
         color: 'green'
       }],
       tags: [],
       isArchived: false,
       confidential: false
     };
     this.allCasesSignal.update(l => [nc as LegalCase, ...l]);
     this.save();
     return nc.id;
  }

  updateCaseStatus(id: string, s: CaseStatus) {
     const userId = this.authService.currentUser()?.id || '1';
     this.allCasesSignal.update(l => l.map(c => {
       if(c.id === id) {
         const timeline = [...(c.timeline || []), {
           id: crypto.randomUUID(),
           type: 'status_change' as const,
           title: `Status zmieniony na: ${this.getStatusLabel(s)}`,
           performedBy: userId,
           timestamp: new Date(),
           metadata: { oldStatus: c.status, newStatus: s },
           icon: 'update',
           color: 'blue'
         }];
         return {...c, status: s, updatedAt: new Date(), timeline};
       }
       return c;
     }));
     this.save();
  }

  private getStatusLabel(status: CaseStatus): string {
    const labels: Record<CaseStatus, string> = {
      'draft': 'Projekt',
      'active': 'Aktywna',
      'pending': 'Oczekująca',
      'closed': 'Zamknięta',
      'archived': 'Zarchiwizowana'
    };
    return labels[status] || status;
  }

  addFolder(cid: string, name: string, parentId?: string) {
     const f: CaseFolder = { 
       id: crypto.randomUUID(), 
       name, 
       parentId: parentId || null,
       isExpanded: true,
       createdAt: new Date()
     };
     this.allCasesSignal.update(l => l.map(c => c.id===cid ? {...c, folders: [...(c.folders || []), f]} : c));
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

  addFileToCase(cid: string, file: File, url: string, fid: string|null): string {
     const userId = this.authService.currentUser()?.id || '1';
     const type = this.getType(file.name, file.type);
     const newFile: Partial<CaseFile> = { 
        id: crypto.randomUUID(), 
        folderId: fid,
        name: file.name,
        originalName: file.name,
        type, 
        mimeType: file.type,
        size: file.size,
        sizeFormatted: this.formatFileSize(file.size),
        dateAdded: new Date(), 
        uploadedBy: userId,
        contentUrl: url,
        status: 'draft' as DocumentStatus,
        version: 1,
        signed: false,
        verified: false,
        accessLevel: 'public'
     };
     
     this.allCasesSignal.update(l => l.map(c => {
       if(c.id === cid) {
         const timeline = [...(c.timeline || []), {
           id: crypto.randomUUID(),
           type: 'file_upload' as const,
           title: `Dodano plik: ${file.name}`,
           performedBy: userId,
           timestamp: new Date(),
           metadata: { fileName: file.name, fileSize: file.size },
           icon: 'upload_file',
           color: 'purple'
         }];
         return {...c, files: [...(c.files || []), newFile as CaseFile], timeline};
       }
       return c;
     }));
     this.save();
     return newFile.id!;
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
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

  private getType(n: string, m: string): 'pdf'|'image'|'word'|'excel'|'email'|'other' {
     n = n.toLowerCase(); m = m.toLowerCase();
     if(m.includes('pdf') || n.endsWith('.pdf')) return 'pdf';
     if(m.includes('image') || n.match(/\.(jpg|png|jpeg|webp|gif|bmp)$/)) return 'image';
     if(m.includes('word') || n.match(/\.(doc|docx)$/)) return 'word';
     if(m.includes('excel') || n.match(/\.(xls|xlsx|csv)$/)) return 'excel';
     if(m.includes('email') || n.match(/\.(eml|msg)$/)) return 'email';
     return 'other';
  }

  // === ZARZĄDZANIE ZADANIAMI ===
  
  addTask(cid: string, title: string, description?: string, dueDate?: Date, priority: CasePriority = 'medium'): string {
    const userId = this.authService.currentUser()?.id || '1';
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      status: 'todo',
      priority,
      assignedTo: [userId],
      createdBy: userId,
      dueDate,
      subtasks: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.allCasesSignal.update(l => l.map(c => {
      if(c.id === cid) {
        const timeline = [...(c.timeline || []), {
          id: crypto.randomUUID(),
          type: 'custom' as const,
          title: `Dodano zadanie: ${title}`,
          performedBy: userId,
          timestamp: new Date(),
          icon: 'task_alt',
          color: 'indigo'
        }];
        return {...c, tasks: [...(c.tasks || []), newTask], timeline};
      }
      return c;
    }));
    this.save();
    return newTask.id;
  }

  updateTaskStatus(cid: string, taskId: string, status: TaskStatus) {
    const userId = this.authService.currentUser()?.id || '1';
    this.allCasesSignal.update(l => l.map(c => {
      if(c.id === cid) {
        const tasks = (c.tasks || []).map(t => {
          if(t.id === taskId) {
            const updated = {...t, status, updatedAt: new Date()};
            if(status === 'completed') updated.completedAt = new Date();
            return updated;
          }
          return t;
        });
        
        const task = tasks.find(t => t.id === taskId);
        const timeline = task && status === 'completed' ? [...(c.timeline || []), {
          id: crypto.randomUUID(),
          type: 'task_completed' as const,
          title: `Zakończono zadanie: ${task.title}`,
          performedBy: userId,
          timestamp: new Date(),
          icon: 'check_circle',
          color: 'green'
        }] : c.timeline || [];

        return {...c, tasks, timeline};
      }
      return c;
    }));
    this.save();
  }

  deleteTask(cid: string, taskId: string) {
    this.allCasesSignal.update(l => l.map(c => 
      c.id === cid ? {...c, tasks: (c.tasks || []).filter(t => t.id !== taskId)} : c
    ));
    this.save();
  }

  addSubTask(cid: string, taskId: string, title: string) {
    this.allCasesSignal.update(l => l.map(c => {
      if(c.id === cid) {
        const tasks = (c.tasks || []).map(t => {
          if(t.id === taskId) {
            const subtask = { id: crypto.randomUUID(), title, completed: false };
            return {...t, subtasks: [...(t.subtasks || []), subtask]};
          }
          return t;
        });
        return {...c, tasks};
      }
      return c;
    }));
    this.save();
  }

  // === ZARZĄDZANIE NOTATKAMI ===

  addNote(cid: string, content: string, title?: string): string {
    const userId = this.authService.currentUser()?.id || '1';
    const newNote: Note = {
      id: crypto.randomUUID(),
      title,
      content,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
      tags: []
    };

    this.allCasesSignal.update(l => l.map(c => {
      if(c.id === cid) {
        const timeline = [...(c.timeline || []), {
          id: crypto.randomUUID(),
          type: 'note_added' as const,
          title: `Dodano notatkę${title ? ': ' + title : ''}`,
          performedBy: userId,
          timestamp: new Date(),
          icon: 'note_add',
          color: 'yellow'
        }];
        return {...c, notes: [...(c.notes || []), newNote], timeline};
      }
      return c;
    }));
    this.save();
    return newNote.id;
  }

  updateNote(cid: string, noteId: string, content: string, title?: string) {
    this.allCasesSignal.update(l => l.map(c => {
      if(c.id === cid) {
        const notes = (c.notes || []).map(n => 
          n.id === noteId ? {...n, content, title, updatedAt: new Date()} : n
        );
        return {...c, notes};
      }
      return c;
    }));
    this.save();
  }

  deleteNote(cid: string, noteId: string) {
    this.allCasesSignal.update(l => l.map(c => 
      c.id === cid ? {...c, notes: (c.notes || []).filter(n => n.id !== noteId)} : c
    ));
    this.save();
  }

  togglePinNote(cid: string, noteId: string) {
    this.allCasesSignal.update(l => l.map(c => {
      if(c.id === cid) {
        const notes = (c.notes || []).map(n => 
          n.id === noteId ? {...n, isPinned: !n.isPinned} : n
        );
        return {...c, notes};
      }
      return c;
    }));
    this.save();
  }

  // === ZARZĄDZANIE WYDARZENIAMI ===

  addEvent(cid: string, event: Partial<CalendarEvent>): string {
    const userId = this.authService.currentUser()?.id || '1';
    const newEvent: CalendarEvent = {
      id: crypto.randomUUID(),
      title: event.title || 'Nowe wydarzenie',
      description: event.description,
      type: event.type || 'other',
      startDate: event.startDate || new Date(),
      endDate: event.endDate || new Date(),
      location: event.location,
      attendees: event.attendees || [userId],
      reminderMinutes: event.reminderMinutes || 30,
      isAllDay: event.isAllDay || false,
      color: event.color,
      videoConferenceUrl: event.videoConferenceUrl,
      notes: event.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.allCasesSignal.update(l => l.map(c => {
      if(c.id === cid) {
        const timeline = [...(c.timeline || []), {
          id: crypto.randomUUID(),
          type: 'event_scheduled' as const,
          title: `Zaplanowano: ${newEvent.title}`,
          description: new Date(newEvent.startDate).toLocaleString('pl-PL'),
          performedBy: userId,
          timestamp: new Date(),
          icon: 'event',
          color: 'cyan'
        }];
        return {...c, events: [...(c.events || []), newEvent], timeline};
      }
      return c;
    }));
    this.save();
    return newEvent.id;
  }

  updateEvent(cid: string, eventId: string, updates: Partial<CalendarEvent>) {
    this.allCasesSignal.update(l => l.map(c => {
      if(c.id === cid) {
        const events = (c.events || []).map(e => 
          e.id === eventId ? {...e, ...updates, updatedAt: new Date()} : e
        );
        return {...c, events};
      }
      return c;
    }));
    this.save();
  }

  deleteEvent(cid: string, eventId: string) {
    this.allCasesSignal.update(l => l.map(c => 
      c.id === cid ? {...c, events: (c.events || []).filter(e => e.id !== eventId)} : c
    ));
    this.save();
  }

  // === ZARZĄDZANIE TERMINAMI ===

  addDeadline(cid: string, title: string, dueDate: Date, priority: CasePriority = 'medium'): string {
    const userId = this.authService.currentUser()?.id || '1';
    const newDeadline: Deadline = {
      id: crypto.randomUUID(),
      title,
      dueDate,
      priority,
      completed: false,
      reminderDays: 3,
      assignedTo: userId
    };

    this.allCasesSignal.update(l => l.map(c => 
      c.id === cid ? {...c, deadlines: [...(c.deadlines || []), newDeadline]} : c
    ));
    this.save();
    return newDeadline.id;
  }

  completeDeadline(cid: string, deadlineId: string) {
    this.allCasesSignal.update(l => l.map(c => {
      if(c.id === cid) {
        const deadlines = (c.deadlines || []).map(d => 
          d.id === deadlineId ? {...d, completed: true, completedAt: new Date()} : d
        );
        return {...c, deadlines};
      }
      return c;
    }));
    this.save();
  }

  deleteDeadline(cid: string, deadlineId: string) {
    this.allCasesSignal.update(l => l.map(c => 
      c.id === cid ? {...c, deadlines: (c.deadlines || []).filter(d => d.id !== deadlineId)} : c
    ));
    this.save();
  }

  // === INNE METODY ===

  updateCasePriority(cid: string, priority: CasePriority) {
    this.allCasesSignal.update(l => l.map(c => 
      c.id === cid ? {...c, priority, updatedAt: new Date()} : c
    ));
    this.save();
  }

  addCaseTags(cid: string, tags: string[]) {
    this.allCasesSignal.update(l => l.map(c => {
      if(c.id === cid) {
        const existingTags = c.tags || [];
        const newTags = [...new Set([...existingTags, ...tags])];
        return {...c, tags: newTags};
      }
      return c;
    }));
    this.save();
  }

  assignLawyer(cid: string, lawyerId: string) {
    this.allCasesSignal.update(l => l.map(c => {
      if(c.id === cid) {
        const lawyers = c.assignedLawyers || [];
        if(!lawyers.includes(lawyerId)) {
          return {...c, assignedLawyers: [...lawyers, lawyerId]};
        }
      }
      return c;
    }));
    this.save();
  }
}
