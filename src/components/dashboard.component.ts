
import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleGenAI } from '@google/genai';
import { CaseService, LegalCase, CaseFile, CaseFolder } from '../services/case.service';
import { AiAssistantComponent } from './ai-assistant.component';
import { DocViewerComponent } from './doc-viewer.component';
import { SettingsComponent } from './settings.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, AiAssistantComponent, DocViewerComponent, SettingsComponent, DatePipe],
  template: `
    <div class="pb-10 min-h-screen bg-slate-950 text-gray-200">
      
      <!-- Top Bar -->
      <div class="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-white/5 p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div class="flex-1 w-full md:w-auto relative">
           <span class="material-symbols-outlined absolute left-3 top-2.5 text-gray-500">search</span>
           <input type="text" [(ngModel)]="searchQuery" placeholder="Szukaj sprawy..." class="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none text-white">
        </div>
        
        <div class="flex gap-2 w-full md:w-auto">
           <button (click)="openSettings()" class="p-2 bg-slate-800 rounded-lg border border-slate-700 hover:bg-slate-700 text-gray-300"><span class="material-symbols-outlined">settings</span></button>
           <button (click)="openNewCaseModal()" class="flex-1 md:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-medium shadow-lg shadow-blue-900/20">
              <span class="material-symbols-outlined text-[18px]">add</span> Nowa Sprawa
           </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 h-[calc(100vh-80px)]">
        
        <!-- Left: Case List -->
        <div class="lg:col-span-3 flex flex-col gap-4 h-full overflow-hidden">
           <div class="flex items-center justify-between px-2">
              <h2 class="text-xs font-bold text-gray-400 uppercase tracking-wider">Biblioteka Spraw</h2>
              <div class="flex gap-1">
                 <button (click)="setFilter('all')" [class.text-blue-400]="activeFilter()=='all'" class="text-xs font-bold hover:text-white px-1">WSZYSTKIE</button>
                 <button (click)="setFilter('W toku')" [class.text-yellow-400]="activeFilter()=='W toku'" class="text-xs font-bold hover:text-white px-1">W TOKU</button>
              </div>
           </div>
           
           <div class="flex-1 overflow-y-auto space-y-2 pr-1 custom-scroll">
              @for (c of filteredCases(); track c.id) {
                 <div (click)="selectCase(c)" 
                      class="p-3 rounded-lg border cursor-pointer transition-all hover:bg-slate-800"
                      [class.bg-blue-600]="selectedCaseId() === c.id"
                      [class.border-blue-400]="selectedCaseId() === c.id"
                      [class.bg-slate-900]="selectedCaseId() !== c.id"
                      [class.border-slate-800]="selectedCaseId() !== c.id">
                    <div class="flex justify-between items-start mb-1">
                       <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/20"
                          [class.text-green-300]="c.status === 'Nowa'"
                          [class.text-yellow-300]="c.status === 'W toku'"
                          [class.text-gray-300]="c.status === 'Zakończona'">{{ c.status }}</span>
                       @if(c.deadline) { <span class="text-[10px] opacity-70">{{ c.deadline | date:'dd.MM' }}</span> }
                    </div>
                    <h3 class="font-bold text-sm truncate">{{ c.title }}</h3>
                 </div>
              }
              @if (filteredCases().length === 0) {
                 <div class="p-4 text-center text-gray-500 text-sm">Brak spraw.</div>
              }
           </div>
        </div>

        <!-- Middle: Workspace -->
        <div class="lg:col-span-6 flex flex-col h-full bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden relative"
             (dragover)="onDragOver($event)" (dragleave)="onDragLeave($event)" (drop)="onDrop($event)">
           
           @if (activeCase(); as activeCase) {
              <!-- Case Header -->
              <div class="p-4 border-b border-white/5 bg-slate-900">
                 <div class="flex justify-between items-start mb-2">
                    <h1 class="text-xl font-bold text-white">{{ activeCase.title }}</h1>
                    <button (click)="cycleStatus(activeCase)" class="text-xs border border-slate-700 px-2 py-1 rounded hover:bg-slate-800">{{ activeCase.status }}</button>
                 </div>
                 <p class="text-sm text-gray-400 line-clamp-2">{{ activeCase.description }}</p>
              </div>

              <!-- Toolbar -->
              <div class="p-2 border-b border-white/5 flex gap-2 items-center bg-slate-800/30">
                 <button (click)="startCreateFolder()" class="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-xs hover:bg-slate-700 flex items-center gap-1">
                    <span class="material-symbols-outlined text-[16px]">create_new_folder</span> Folder
                 </button>
                 <label class="px-3 py-1.5 bg-blue-600 rounded text-xs hover:bg-blue-500 text-white cursor-pointer flex items-center gap-1">
                    <span class="material-symbols-outlined text-[16px]">upload</span> Plik
                    <input type="file" class="hidden" (change)="onFileSelected($event, activeCase.id)" />
                 </label>
                 @if (isAnalyzingFile()) {
                    <span class="ml-auto text-xs text-purple-400 animate-pulse flex items-center gap-1">
                       <span class="material-symbols-outlined text-[14px] animate-spin">sync</span> AI Analizuje...
                    </span>
                 }
              </div>

              <!-- Files Grid/List -->
              <div class="flex-1 overflow-y-auto p-2">
                 
                 <!-- New Folder Input -->
                 @if (isCreatingFolder()) {
                    <div class="flex items-center gap-2 p-2 bg-slate-800 rounded mb-2 border border-blue-500">
                       <span class="material-symbols-outlined text-yellow-500">folder</span>
                       <input #folderInput type="text" [(ngModel)]="newFolderName" (keydown.enter)="confirmCreateFolder(activeCase.id)" class="bg-transparent border-none focus:outline-none text-sm text-white flex-1" autoFocus placeholder="Nazwa folderu...">
                       <button (click)="confirmCreateFolder(activeCase.id)" class="text-green-400"><span class="material-symbols-outlined">check</span></button>
                       <button (click)="cancelCreateFolder()" class="text-red-400"><span class="material-symbols-outlined">close</span></button>
                    </div>
                 }

                 <!-- Folders -->
                 @for (folder of activeCase.folders; track folder.id) {
                    <div class="mb-2 border border-slate-800 rounded bg-slate-900/50 overflow-hidden">
                       <div (click)="toggleFolder(activeCase.id, folder.id)" class="flex items-center p-2 cursor-pointer hover:bg-slate-800">
                          <span class="material-symbols-outlined text-yellow-500 mr-2">{{ folder.isExpanded ? 'folder_open' : 'folder' }}</span>
                          <span class="text-sm font-medium flex-1">{{ folder.name }}</span>
                          <button (click)="deleteFolder(activeCase.id, folder.id); $event.stopPropagation()" class="text-gray-600 hover:text-red-400 p-1"><span class="material-symbols-outlined text-[16px]">delete</span></button>
                       </div>
                       @if (folder.isExpanded) {
                          <div class="pl-4 pr-2 pb-2">
                             @for (file of getFiles(activeCase, folder.id); track file.id) {
                                <div (click)="previewFile(file)" class="flex items-center p-2 hover:bg-slate-800 rounded cursor-pointer group">
                                   <span class="material-symbols-outlined mr-2 text-gray-400 text-[18px]">description</span>
                                   <span class="text-sm text-gray-300 flex-1 truncate">{{ file.name }}</span>
                                   <span class="text-xs text-gray-600 mr-2">{{ file.size }}</span>
                                   <button (click)="deleteFile(activeCase.id, file.id); $event.stopPropagation()" class="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><span class="material-symbols-outlined text-[16px]">delete</span></button>
                                </div>
                             }
                             @if (getFiles(activeCase, folder.id).length === 0) {
                                <div class="text-xs text-gray-600 italic pl-8 py-1">Pusty folder</div>
                             }
                          </div>
                       }
                    </div>
                 }

                 <!-- Root Files -->
                 @if (getFiles(activeCase, null).length > 0) {
                     <div class="mt-4">
                        <h3 class="text-xs font-bold text-gray-500 uppercase mb-2 pl-2">Luźne Pliki</h3>
                        @for (file of getFiles(activeCase, null); track file.id) {
                           <div (click)="previewFile(file)" class="flex items-center p-2 bg-slate-800/50 border border-slate-800 rounded mb-1 cursor-pointer hover:bg-slate-800 group">
                              <span class="material-symbols-outlined mr-3 text-blue-400">description</span>
                              <div class="flex-1 min-w-0">
                                 <div class="text-sm font-medium text-gray-200 truncate">{{ file.name }}</div>
                                 <div class="text-xs text-gray-500">{{ file.dateAdded | date:'short' }} • {{ file.size }}</div>
                              </div>
                              <button (click)="deleteFile(activeCase.id, file.id); $event.stopPropagation()" class="p-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <span class="material-symbols-outlined">delete</span>
                              </button>
                           </div>
                        }
                     </div>
                 }

                 <!-- Empty State -->
                 @if (activeCase.files.length === 0 && activeCase.folders.length === 0 && !isCreatingFolder()) {
                    <div class="flex flex-col items-center justify-center h-48 text-gray-600 border-2 border-dashed border-slate-800 rounded-xl m-4">
                       <span class="material-symbols-outlined text-4xl mb-2">cloud_upload</span>
                       <p class="text-sm">Przeciągnij pliki tutaj</p>
                    </div>
                 }
              </div>

              <!-- Drag Overlay -->
              @if (isDragging()) {
                 <div class="absolute inset-0 bg-blue-600/90 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div class="text-white font-bold text-2xl animate-bounce">Upuść Pliki</div>
                 </div>
              }

           } @else {
              <div class="flex flex-col items-center justify-center h-full text-gray-500">
                 <span class="material-symbols-outlined text-6xl mb-4 opacity-20">folder_open</span>
                 <p>Wybierz sprawę z biblioteki</p>
              </div>
           }
        </div>

        <!-- Right: AI -->
        <div class="lg:col-span-3 h-full">
           <app-ai-assistant [activeCaseContext]="activeCase()"></app-ai-assistant>
        </div>
      </div>

      <!-- Modals -->
      @if (showNewCaseModal()) {
         <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div class="bg-slate-900 border border-slate-700 p-6 rounded-xl w-full max-w-md shadow-2xl">
               <h2 class="text-lg font-bold text-white mb-4">Nowa Sprawa</h2>
               <input type="text" [(ngModel)]="newCaseTitle" placeholder="Tytuł sprawy" class="w-full bg-slate-800 border border-slate-700 rounded p-2 mb-3 text-white">
               <textarea [(ngModel)]="newCaseDesc" placeholder="Opis..." class="w-full bg-slate-800 border border-slate-700 rounded p-2 mb-4 h-24 text-white"></textarea>
               <div class="flex gap-2 justify-end">
                  <button (click)="showNewCaseModal.set(false)" class="px-4 py-2 text-gray-300 hover:text-white">Anuluj</button>
                  <button (click)="confirmAddCase()" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded">Utwórz</button>
               </div>
            </div>
         </div>
      }

      @if (fileToPreview()) {
         <app-doc-viewer [file]="fileToPreview()" (close)="closePreview()"></app-doc-viewer>
      }

      @if (showSettings()) {
         <app-settings (close)="closeSettings()"></app-settings>
      }
    </div>
  `
})
export class DashboardComponent {
  caseService = inject(CaseService);
  searchQuery = '';
  activeFilter = signal('all');
  selectedCaseId = signal<string | null>(null);
  
  showNewCaseModal = signal(false);
  newCaseTitle = '';
  newCaseDesc = '';
  
  isCreatingFolder = signal(false);
  newFolderName = '';
  isAnalyzingFile = signal(false);
  isDragging = signal(false);
  
  fileToPreview = signal<CaseFile | null>(null);
  showSettings = signal(false);

  constructor() {
    const all = this.caseService.cases();
    if (all.length > 0) this.selectedCaseId.set(all[0].id);
  }

  activeCase = computed(() => this.caseService.cases().find(c => c.id === this.selectedCaseId()) || null);
  
  filteredCases = computed(() => {
    const q = this.searchQuery.toLowerCase();
    const filter = this.activeFilter();
    return this.caseService.cases().filter(c => {
       const matchSearch = c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
       const matchFilter = filter === 'all' ? true : c.status === filter;
       return matchSearch && matchFilter;
    });
  });

  setFilter(f: string) { this.activeFilter.set(f); }
  selectCase(c: LegalCase) { this.selectedCaseId.set(c.id); }
  openNewCaseModal() { this.newCaseTitle=''; this.newCaseDesc=''; this.showNewCaseModal.set(true); }
  
  confirmAddCase() {
     if(this.newCaseTitle) {
        this.caseService.addCase(this.newCaseTitle, this.newCaseDesc, new Date());
        this.showNewCaseModal.set(false);
     }
  }

  cycleStatus(c: LegalCase) {
     const statuses: ('Nowa'|'W toku'|'Zakończona')[] = ['Nowa', 'W toku', 'Zakończona'];
     const idx = statuses.indexOf(c.status);
     const next = statuses[(idx + 1) % statuses.length];
     this.caseService.updateCaseStatus(c.id, next);
  }

  startCreateFolder() { this.isCreatingFolder.set(true); this.newFolderName=''; }
  cancelCreateFolder() { this.isCreatingFolder.set(false); }
  confirmCreateFolder(cid: string) {
     if(this.newFolderName) this.caseService.addFolder(cid, this.newFolderName);
     this.cancelCreateFolder();
  }
  
  deleteFolder(cid: string, fid: string) { this.caseService.deleteFolder(cid, fid); }
  deleteFile(cid: string, fid: string) { this.caseService.deleteFile(cid, fid); }
  toggleFolder(cid: string, fid: string) { this.caseService.toggleFolder(cid, fid); }
  
  getFiles(c: LegalCase, fid: string | null) { return c.files.filter(f => f.folderId === (fid || null)); }

  // Drag & Drop
  onDragOver(e: DragEvent) { e.preventDefault(); this.isDragging.set(true); }
  onDragLeave(e: DragEvent) { e.preventDefault(); this.isDragging.set(false); }
  onDrop(e: DragEvent) {
     e.preventDefault();
     this.isDragging.set(false);
     if(this.activeCase() && e.dataTransfer?.files.length) {
        Array.from(e.dataTransfer.files).forEach(f => this.processFile(f, this.activeCase()!.id));
     }
  }
  onFileSelected(e: Event, cid: string) {
     const input = e.target as HTMLInputElement;
     if(input.files?.length) this.processFile(input.files[0], cid);
  }

  processFile(file: File, cid: string) {
     const reader = new FileReader();
     reader.onload = (e) => {
        const url = e.target?.result as string;
        const fid = this.caseService.addFileToCase(cid, file, url, null);
        // AI Rename Trigger
        if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
           this.analyzeFile(cid, fid, url, file.type, file.name);
        }
     };
     reader.readAsDataURL(file);
  }

  async analyzeFile(cid: string, fid: string, dataUrl: string, mime: string, name: string) {
     this.isAnalyzingFile.set(true);
     try {
        const apiKey = process.env['API_KEY'];
        if(apiKey) {
           const ai = new GoogleGenAI({ apiKey });
           const base64 = dataUrl.split(',')[1];
           const resp = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: { parts: [
                 { text: `Proponuj profesjonalną nazwę pliku (np. Faktura_X.pdf). Oryginalna: ${name}. Tylko nazwa.` },
                 { inlineData: { mimeType: mime, data: base64 } }
              ]}
           });
           const newName = resp.text?.trim();
           if(newName) this.caseService.renameFile(cid, fid, newName);
        }
     } catch(e) { console.error(e); }
     finally { this.isAnalyzingFile.set(false); }
  }

  previewFile(f: CaseFile) { this.fileToPreview.set(f); }
  closePreview() { this.fileToPreview.set(null); }
  openSettings() { this.showSettings.set(true); }
  closeSettings() { this.showSettings.set(false); }
}
