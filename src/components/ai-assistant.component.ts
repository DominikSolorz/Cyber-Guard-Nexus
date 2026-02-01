
import { Component, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleGenAI } from '@google/genai';
import { LegalCase } from '../services/case.service';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col bg-slate-900/50 rounded-xl border border-slate-800">
      <div class="p-3 border-b border-white/5 font-bold text-white flex items-center gap-2">
         <span class="material-symbols-outlined text-purple-400">psychology</span> Asystent Prawny
      </div>
      <div class="flex-1 overflow-y-auto p-4 space-y-4">
         @if(messages().length===0) {
            <div class="text-center text-gray-500 mt-10">
               <p>Jestem gotowy do pomocy w sprawie "{{ activeCaseContext()?.title }}".</p>
            </div>
         }
         @for(m of messages(); track $index) {
            <div [class.text-right]="m.role==='user'">
               <div class="inline-block p-3 rounded-xl max-w-[85%] text-sm"
                  [class.bg-blue-600]="m.role==='user'" [class.text-white]="m.role==='user'"
                  [class.bg-slate-800]="m.role==='ai'" [class.text-gray-300]="m.role==='ai'">
                  {{ m.text }}
               </div>
            </div>
         }
         @if(isThinking()) { <div class="text-xs text-gray-500 animate-pulse">Piszę...</div> }
      </div>
      <div class="p-3 border-t border-white/5 flex gap-2">
         <input [(ngModel)]="prompt" (keydown.enter)="send()" placeholder="Zapytaj o sprawę..." class="flex-1 bg-slate-800 border-none rounded px-3 py-2 text-sm text-white focus:outline-none">
         <button (click)="send()" [disabled]="!prompt" class="p-2 bg-purple-600 rounded text-white disabled:opacity-50"><span class="material-symbols-outlined">send</span></button>
      </div>
    </div>
  `
})
export class AiAssistantComponent {
  activeCaseContext = input<LegalCase|null>(null);
  prompt = '';
  isThinking = signal(false);
  messages = signal<{role:'user'|'ai', text:string}[]>([]);

  async send() {
     if(!this.prompt) return;
     const t = this.prompt;
     this.prompt = '';
     this.messages.update(m => [...m, {role:'user', text:t}]);
     this.isThinking.set(true);
     try {
        const apiKey = process.env['API_KEY'];
        if(apiKey) {
           const ai = new GoogleGenAI({ apiKey });
           const c = this.activeCaseContext();
           const ctx = c ? `Sprawa: ${c.title}, Pliki: ${c.files.map(f=>f.name).join(', ')}` : 'Brak sprawy';
           const r = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: `Kontekst: ${ctx}. Pytanie: ${t}. Odpowiedz krótko.`
           });
           this.messages.update(m => [...m, {role:'ai', text: r.text || 'Błąd.'}]);
        }
     } catch(e) { console.error(e); }
     finally { this.isThinking.set(false); }
  }
}
