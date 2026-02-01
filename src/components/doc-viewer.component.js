
import { Component, input, output, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CaseFile } from '../services/case.service';



@Component({
  selector: 'app-doc-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-[100] flex flex-col bg-slate-950/95 backdrop-blur-md animate-in fade-in zoom-in duration-200">
        
        <!-- Navbar -->
        <div class="flex items-center gap-3 p-3 border-b border-white/10 bg-slate-900 shadow-md z-20 shrink-0">
          <button (click)="close.emit()" class="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors flex items-center justify-center shadow-sm border border-white/5" title="Zamknij">
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          
          <div class="flex-1 min-w-0 px-2">
             <h2 class="text-base font-semibold text-white truncate">{{ file()?.name }}</h2>
             <p class="text-xs text-gray-400">{{ file()?.size }} • {{ file()?.type | uppercase }}</p>
          </div>

          <div class="flex gap-2">
              <button (click)="downloadFile()" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg transition-transform active:scale-95 flex items-center gap-2 border border-white/10">
                 <span class="material-symbols-outlined text-[18px]">download</span>
                 <span class="hidden sm:inline text-sm font-medium">Pobierz</span>
              </button>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 relative flex items-center justify-center p-0 md:p-4 overflow-hidden h-full bg-slate-900/50">
          
          @let state = viewState();

          @if (state.status === 'success') {
             @if (file()?.type === 'pdf') {
                 <div class="w-full h-full bg-white md:rounded-lg shadow-2xl relative overflow-hidden flex flex-col border border-slate-700">
                     <iframe 
                        [src]="state.url" 
                        class="w-full h-full border-none block" 
                        title="Podgląd PDF"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                     ></iframe>
                 </div>
             } 
             @else if (file()?.type === 'image') {
                <img [src]="state.url" class="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-slate-700 bg-slate-950" alt="Preview" />
             }
             @else {
                <!-- Unsupported Format -->
                <div class="flex flex-col items-center justify-center text-center p-8 max-w-md bg-slate-800 border border-slate-600 rounded-xl shadow-2xl mx-4">
                  <div class="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mb-6 ring-1 ring-white/10">
                     <span class="material-symbols-outlined text-5xl text-blue-400">description</span>
                  </div>
                  <h3 class="text-xl font-bold text-white mb-2">Podgląd niedostępny</h3>
                  <p class="text-gray-400 mb-8 leading-relaxed text-sm">
                    Pliki typu <b>{{ file()?.type | uppercase }}</b> nie są obsługiwane w przeglądarce.
                  </p>
                  <button (click)="downloadFile()" class="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2">
                     <span class="material-symbols-outlined">download</span>
                     Pobierz Plik
                  </button>
                </div>
             }
          } 
          @else if (state.status === 'error') {
             <div class="flex flex-col items-center justify-center text-center p-8 max-w-md bg-red-900/10 border border-red-500/30 rounded-xl shadow-2xl mx-4">
                <span class="material-symbols-outlined text-5xl text-red-500 mb-4">broken_image</span>
                <h3 class="text-xl font-bold text-white mb-2">Błąd pliku</h3>
                <p class="text-red-200/80 mb-6 text-sm">{{ state.message }}</p>
                <button (click)="close.emit()" class="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">Zamknij</button>
             </div>
          }
          @else {
             <div class="flex flex-col items-center text-blue-400">
                <span class="material-symbols-outlined text-4xl animate-spin mb-4">sync</span>
                <p class="text-sm font-medium">Wczytywanie...</p>
             </div>
          }
        </div>
    </div>
  `
})
export class DocViewerComponent implements OnDestroy {
  file = input<CaseFile | null>(null);
  close = output<void>();
  private currentObjectUrl: string | null = null;

  constructor(private sanitizer) {}

  viewState = computed<ViewState>(() => {
    const f = this.file();
    if (!f || !f.contentUrl) return { status: 'loading' };

    this.cleanupUrl();

    try {
      if (f.contentUrl.startsWith('blob:')) {
          return { status: 'success', url: this.sanitizer.bypassSecurityTrustResourceUrl(f.contentUrl) };
      }
      if (f.contentUrl.startsWith('data:')) {
          const blob = this.dataURItoBlob(f.contentUrl);
          const url = URL.createObjectURL(blob);
          this.currentObjectUrl = url;
          return { status: 'success', url: this.sanitizer.bypassSecurityTrustResourceUrl(url) };
      }
      return { status: 'success', url: this.sanitizer.bypassSecurityTrustResourceUrl(f.contentUrl) };
    } catch (e: any) {
      console.error('DocViewer Error:', e);
      return { status: 'error', message: 'Nie udało się przetworzyć pliku. Dane mogą być uszkodzone.' };
    }
  });

  ngOnDestroy() { this.cleanupUrl(); }

  private cleanupUrl() {
    if (this.currentObjectUrl) {
      URL.revokeObjectURL(this.currentObjectUrl);
      this.currentObjectUrl = null;
    }
  }

  downloadFile() {
    const f = this.file();
    if (!f) return;
    const a = document.createElement('a');
    a.href = f.contentUrl; 
    a.download = f.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  private dataURItoBlob(dataURI: string) {
    if (!dataURI.startsWith('data:')) throw new Error('Błędny format danych.');
    const split = dataURI.split(',');
    const mimeString = split[0].split(':')[1].split(';')[0];
    const byteString = atob(split[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    return new Blob([ab], { type: mimeString });
  }
}
