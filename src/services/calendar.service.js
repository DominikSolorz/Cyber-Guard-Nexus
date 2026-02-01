import { Injectable, signal, computed, inject } from '@angular/core';
import { CalendarEvent, EventType } from '../models/types';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CalendarService {
  private auth = inject(AuthService);
  private eventsSignal = signal<CalendarEvent[]>([]);
  private readonly KEY = 'ekancelaria_calendar_events';

  constructor() {
    this.load();
  }

  private load() {
    try {
      const stored = localStorage.getItem(this.KEY);
      if(stored) {
        const parsed = JSON.parse(stored);
        this.eventsSignal.set(
          parsed.map((e: any) => ({
            ...e,
            startDate: new Date(e.startDate),
            endDate: new Date(e.endDate),
            createdAt: new Date(e.createdAt),
            updatedAt: new Date(e.updatedAt)
          }))
        );
      }
    } catch(e) {
      console.error('Error loading calendar events:', e);
    }
  }

  private save() {
    localStorage.setItem(this.KEY, JSON.stringify(this.eventsSignal()));
  }

  events = computed(() => this.eventsSignal());

  getEventsByUser(userId: string) {
    return computed(() => 
      this.eventsSignal().filter(e => e.attendees.includes(userId))
    );
  }

  getEventsByDateRange(startDate, endDate) {
    return computed(() =>
      this.eventsSignal().filter(e => 
        e.startDate >= startDate && e.startDate <= endDate
      )
    );
  }

  getUpcomingEvents(userId: string, days: number = 7) {
    const now = new Date();
    const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    return computed(() =>
      this.eventsSignal()
        .filter(e => e.attendees.includes(userId) && e.startDate >= now && e.startDate <= future)
        .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    );
  }

  getTodayEvents(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return computed(() =>
      this.eventsSignal()
        .filter(e => e.attendees.includes(userId) && e.startDate >= today && e.startDate < tomorrow)
        .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    );
  }

  addEvent(event): string {
    const newEvent = {
      ...event,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.eventsSignal.update(list => [...list, newEvent]);
    this.save();
    return newEvent.id;
  }

  updateEvent(id: string, updates) {
    this.eventsSignal.update(list =>
      list.map(e => e.id === id ? {...e, ...updates, updatedAt: new Date()} : e)
    );
    this.save();
  }

  deleteEvent(id: string) {
    this.eventsSignal.update(list => list.filter(e => e.id !== id));
    this.save();
  }

  getEventById(id: string): CalendarEvent | undefined {
    return this.eventsSignal().find(e => e.id === id);
  }

  // Metody pomocnicze

  getEventsByType(type) {
    return computed(() => this.eventsSignal().filter(e => e.type === type));
  }

  hasConflict(startDate, endDate, attendees: string[], excludeEventId?: string): boolean {
    return this.eventsSignal().some(e => {
      if(excludeEventId && e.id === excludeEventId) return false;
      
      // Sprawdź czy są wspólni uczestnicy
      const hasCommonAttendees = e.attendees.some(a => attendees.includes(a));
      if(!hasCommonAttendees) return false;

      // Sprawdź czy czasy się nakładają
      return (startDate < e.endDate && endDate > e.startDate);
    });
  }

  getConflictingEvents(startDate, endDate, attendees: string[]) {
    return this.eventsSignal().filter(e => {
      const hasCommonAttendees = e.attendees.some(a => attendees.includes(a));
      if(!hasCommonAttendees) return false;
      return (startDate < e.endDate && endDate > e.startDate);
    });
  }
}
