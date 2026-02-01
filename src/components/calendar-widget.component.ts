import { Component, Input, Output, EventEmitter, signal, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarEvent, EventType } from '../models/types';
import { CalendarService } from '../services/calendar.service';

@Component({
  selector: 'app-calendar-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  template: `
    <div class="h-full flex flex-col bg-slate-900/50 rounded-xl border border-slate-800">
      <!-- Header -->
      <div class="p-4 border-b border-white/5 flex justify-between items-center">
        <h3 class="font-bold text-white flex items-center gap-2">
          <span class="material-symbols-outlined text-green-400">event</span>
          Kalendarz
        </h3>
        <button 
          (click)="showNewEventModal.set(true)"
          class="px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-sm text-white flex items-center gap-1">
          <span class="material-symbols-outlined text-[16px]">add</span>
          Dodaj
        </button>
      </div>

      <!-- Mini Calendar -->
      <div class="p-4 border-b border-white/5">
        <div class="flex justify-between items-center mb-3">
          <button (click)="previousMonth()" class="p-1 hover:bg-slate-800 rounded">
            <span class="material-symbols-outlined text-gray-400">chevron_left</span>
          </button>
          <h4 class="text-sm font-semibold text-white">
            {{ currentMonth() | date:'LLLL yyyy':'':'pl' }}
          </h4>
          <button (click)="nextMonth()" class="p-1 hover:bg-slate-800 rounded">
            <span class="material-symbols-outlined text-gray-400">chevron_right</span>
          </button>
        </div>

        <!-- Days grid -->
        <div class="grid grid-cols-7 gap-1 text-xs">
          @for(day of ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd']; track day) {
            <div class="text-center text-gray-500 font-medium py-1">{{ day }}</div>
          }
          @for(day of calendarDays(); track day) {
            <button 
              (click)="selectDate(day)"
              [class]="getDayClasses(day)"
              class="aspect-square flex items-center justify-center rounded hover:bg-slate-700 transition-colors">
              {{ day.getDate() }}
              @if(hasEventsOnDay(day)) {
                <span class="absolute bottom-0.5 w-1 h-1 bg-blue-400 rounded-full"></span>
              }
            </button>
          }
        </div>
      </div>

      <!-- Events List -->
      <div class="flex-1 overflow-y-auto p-3 space-y-2">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-xs font-semibold text-gray-400 uppercase">
            @if(selectedDate()) {
              {{ selectedDate() | date:'d MMMM yyyy':'':'pl' }}
            } @else {
              Nadchodzące wydarzenia
            }
          </h4>
        </div>

        @for (event of displayedEvents(); track event.id) {
          <div class="p-3 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors group">
            <div class="flex items-start gap-2">
              <div class="w-1 h-full rounded-full shrink-0" 
                [style.background-color]="event.color || getEventTypeColor(event.type)">
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h5 class="font-medium text-white text-sm truncate">{{ event.title }}</h5>
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-gray-300 shrink-0">
                    {{ getEventTypeLabel(event.type) }}
                  </span>
                </div>
                <div class="flex items-center gap-3 text-xs text-gray-400">
                  <span class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px]">schedule</span>
                    {{ event.startDate | date:'HH:mm' }} - {{ event.endDate | date:'HH:mm' }}
                  </span>
                  @if(event.location) {
                    <span class="flex items-center gap-1 truncate">
                      <span class="material-symbols-outlined text-[14px]">location_on</span>
                      {{ event.location }}
                    </span>
                  }
                </div>
                @if(event.description) {
                  <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ event.description }}</p>
                }
              </div>
              <button 
                (click)="onEventDelete.emit(event.id)"
                class="p-1 hover:bg-red-600 rounded text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <span class="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>
          </div>
        } @empty {
          <div class="text-center py-8 text-gray-500">
            <span class="material-symbols-outlined text-4xl mb-2 opacity-20">event_available</span>
            <p class="text-sm">Brak wydarzeń</p>
          </div>
        }
      </div>

      <!-- New Event Modal -->
      @if (showNewEventModal()) {
        <div class="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div class="bg-slate-900 border border-slate-700 p-6 rounded-xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 class="text-lg font-bold text-white mb-4">Nowe wydarzenie</h3>
            
            <div class="space-y-3">
              <div>
                <label class="block text-sm text-gray-400 mb-1">Tytuł*</label>
                <input 
                  type="text" 
                  [(ngModel)]="newEvent.title"
                  placeholder="Nazwa wydarzenia"
                  class="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm">
              </div>

              <div>
                <label class="block text-sm text-gray-400 mb-1">Typ</label>
                <select 
                  [(ngModel)]="newEvent.type"
                  class="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm">
                  <option value="hearing">Rozprawa</option>
                  <option value="meeting">Spotkanie</option>
                  <option value="deadline">Termin</option>
                  <option value="consultation">Konsultacja</option>
                  <option value="other">Inne</option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Data rozpoczęcia*</label>
                  <input 
                    type="datetime-local" 
                    [(ngModel)]="newEvent.startDate"
                    class="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm">
                </div>

                <div>
                  <label class="block text-sm text-gray-400 mb-1">Data zakończenia*</label>
                  <input 
                    type="datetime-local" 
                    [(ngModel)]="newEvent.endDate"
                    class="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm">
                </div>
              </div>

              <div>
                <label class="block text-sm text-gray-400 mb-1">Lokalizacja</label>
                <input 
                  type="text" 
                  [(ngModel)]="newEvent.location"
                  placeholder="np. Sala nr 101"
                  class="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm">
              </div>

              <div>
                <label class="block text-sm text-gray-400 mb-1">Opis</label>
                <textarea 
                  [(ngModel)]="newEvent.description"
                  placeholder="Dodatkowe informacje..."
                  rows="3"
                  class="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm"></textarea>
              </div>

              <div>
                <label class="block text-sm text-gray-400 mb-1">Przypomnienie (minuty)</label>
                <input 
                  type="number" 
                  [(ngModel)]="newEvent.reminderMinutes"
                  min="0"
                  placeholder="30"
                  class="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm">
              </div>
            </div>

            <div class="flex gap-2 justify-end mt-6">
              <button 
                (click)="showNewEventModal.set(false); resetNewEvent()"
                class="px-4 py-2 text-gray-300 hover:text-white text-sm">
                Anuluj
              </button>
              <button 
                (click)="createEvent()"
                [disabled]="!newEvent.title || !newEvent.startDate || !newEvent.endDate"
                class="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                Utwórz
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class CalendarWidgetComponent {
  @Input() events = signal<CalendarEvent[]>([]);
  @Input() userId!: string;
  @Output() onEventAdd = new EventEmitter<Partial<CalendarEvent>>();
  @Output() onEventDelete = new EventEmitter<string>();

  calendarService = inject(CalendarService);
  
  showNewEventModal = signal(false);
  currentMonth = signal(new Date());
  selectedDate = signal<Date | null>(null);
  
  newEvent = {
    title: '',
    type: 'meeting' as EventType,
    startDate: '',
    endDate: '',
    location: '',
    description: '',
    reminderMinutes: 30
  };

  calendarDays = computed(() => {
    const month = this.currentMonth();
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    
    const days: Date[] = [];
    
    // Dodaj dni z poprzedniego miesiąca
    const firstDayOfWeek = firstDay.getDay() || 7; // 1 = Poniedziałek
    for(let i = firstDayOfWeek - 1; i > 0; i--) {
      days.push(new Date(year, monthIndex, 1 - i));
    }
    
    // Dodaj dni bieżącego miesiąca
    for(let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, monthIndex, i));
    }
    
    // Dodaj dni z następnego miesiąca do wypełnienia siatki
    const remainingDays = 35 - days.length;
    for(let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, monthIndex + 1, i));
    }
    
    return days;
  });

  displayedEvents = computed(() => {
    if(this.selectedDate()) {
      const date = this.selectedDate()!;
      return this.events().filter(e => this.isSameDay(e.startDate, date));
    }
    // Pokaż nadchodzące wydarzenia (następne 7 dni)
    const now = new Date();
    const future = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return this.events()
      .filter(e => e.startDate >= now && e.startDate <= future)
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  });

  previousMonth() {
    const current = this.currentMonth();
    this.currentMonth.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth() {
    const current = this.currentMonth();
    this.currentMonth.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  selectDate(date: Date) {
    if(this.selectedDate() && this.isSameDay(this.selectedDate()!, date)) {
      this.selectedDate.set(null);
    } else {
      this.selectedDate.set(date);
    }
  }

  getDayClasses(day: Date): string {
    const classes: string[] = ['relative text-sm'];
    const current = this.currentMonth();
    
    if(day.getMonth() !== current.getMonth()) {
      classes.push('text-gray-600');
    } else {
      classes.push('text-white');
    }
    
    if(this.isToday(day)) {
      classes.push('bg-blue-600 font-bold');
    }
    
    if(this.selectedDate() && this.isSameDay(this.selectedDate()!, day)) {
      classes.push('bg-green-600');
    }
    
    return classes.join(' ');
  }

  hasEventsOnDay(day: Date): boolean {
    return this.events().some(e => this.isSameDay(e.startDate, day));
  }

  isToday(date: Date): boolean {
    return this.isSameDay(date, new Date());
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  getEventTypeColor(type: EventType): string {
    const colors: Record<EventType, string> = {
      'hearing': '#ef4444',
      'meeting': '#3b82f6',
      'deadline': '#f59e0b',
      'consultation': '#10b981',
      'other': '#6b7280'
    };
    return colors[type] || colors.other;
  }

  getEventTypeLabel(type: EventType): string {
    const labels: Record<EventType, string> = {
      'hearing': 'Rozprawa',
      'meeting': 'Spotkanie',
      'deadline': 'Termin',
      'consultation': 'Konsultacja',
      'other': 'Inne'
    };
    return labels[type] || type;
  }

  createEvent() {
    if(!this.newEvent.title || !this.newEvent.startDate || !this.newEvent.endDate) return;

    this.onEventAdd.emit({
      title: this.newEvent.title,
      type: this.newEvent.type,
      startDate: new Date(this.newEvent.startDate),
      endDate: new Date(this.newEvent.endDate),
      location: this.newEvent.location || undefined,
      description: this.newEvent.description || undefined,
      reminderMinutes: this.newEvent.reminderMinutes,
      attendees: [this.userId],
      isAllDay: false
    });

    this.showNewEventModal.set(false);
    this.resetNewEvent();
  }

  resetNewEvent() {
    this.newEvent = {
      title: '',
      type: 'meeting',
      startDate: '',
      endDate: '',
      location: '',
      description: '',
      reminderMinutes: 30
    };
  }
}
