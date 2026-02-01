import { Injectable, signal, computed } from '@angular/core';
import { Invoice, InvoiceItem, PaymentStatus, TimeEntry } from '../models/types';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private invoicesSignal = signal<Invoice[]>([]);
  private timeEntriesSignal = signal<TimeEntry[]>([]);
  private readonly INVOICES_KEY = 'ekancelaria_invoices';
  private readonly TIME_KEY = 'ekancelaria_time_entries';

  constructor() {
    this.loadInvoices();
    this.loadTimeEntries();
  }

  private loadInvoices() {
    try {
      const stored = localStorage.getItem(this.INVOICES_KEY);
      if(stored) {
        const parsed = JSON.parse(stored);
        this.invoicesSignal.set(
          parsed.map((inv: any) => ({
            ...inv,
            issueDate: new Date(inv.issueDate),
            dueDate: new Date(inv.dueDate),
            paidAt: inv.paidAt ? new Date(inv.paidAt) : undefined,
            createdAt: new Date(inv.createdAt)
          }))
        );
      }
    } catch(e) {
      console.error('Error loading invoices:', e);
    }
  }

  private loadTimeEntries() {
    try {
      const stored = localStorage.getItem(this.TIME_KEY);
      if(stored) {
        const parsed = JSON.parse(stored);
        this.timeEntriesSignal.set(
          parsed.map((entry: any) => ({
            ...entry,
            startTime: new Date(entry.startTime),
            endTime: entry.endTime ? new Date(entry.endTime) : undefined,
            createdAt: new Date(entry.createdAt)
          }))
        );
      }
    } catch(e) {
      console.error('Error loading time entries:', e);
    }
  }

  private saveInvoices() {
    localStorage.setItem(this.INVOICES_KEY, JSON.stringify(this.invoicesSignal()));
  }

  private saveTimeEntries() {
    localStorage.setItem(this.TIME_KEY, JSON.stringify(this.timeEntriesSignal()));
  }

  invoices = computed(() => this.invoicesSignal());
  timeEntries = computed(() => this.timeEntriesSignal());

  getInvoicesByClient(clientId: string) {
    return computed(() =>
      this.invoicesSignal().filter(inv => inv.clientId === clientId)
    );
  }

  getInvoicesByCase(caseId: string) {
    return computed(() =>
      this.invoicesSignal().filter(inv => inv.caseId === caseId)
    );
  }

  getPendingInvoices() {
    return computed(() =>
      this.invoicesSignal().filter(inv => inv.status === 'pending')
    );
  }

  getOverdueInvoices() {
    const now = new Date();
    return computed(() =>
      this.invoicesSignal().filter(inv => 
        inv.status === 'pending' && inv.dueDate < now
      )
    );
  }

  createInvoice(data: {
    clientId: string;
    caseId?: string;
    items;
    dueDate;
    taxRate?: number;
    notes?: string;
    createdBy: string;
  }): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const invoiceNumber = `FV/${year}/${month}/${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    const subtotal = data.items.reduce((sum, item) => sum + item.total, 0);
    const tax = data.items.reduce((sum, item) => sum + (item.total * item.taxRate / 100), 0);
    const total = subtotal + tax;

    const invoice = {
      id: crypto.randomUUID(),
      invoiceNumber,
      clientId: data.clientId,
      caseId: data.caseId,
      issueDate: now,
      dueDate: data.dueDate,
      items: data.items,
      subtotal,
      tax,
      total,
      status: 'pending',
      notes: data.notes,
      createdBy: data.createdBy,
      createdAt: now
    };

    this.invoicesSignal.update(list => [invoice, ...list]);
    this.saveInvoices();
    return invoice.id;
  }

  updateInvoiceStatus(id: string, status, paymentMethod?: string) {
    this.invoicesSignal.update(list =>
      list.map(inv => {
        if(inv.id === id) {
          const updates = { status };
          if(status === 'paid') {
            updates.paidAt = new Date();
            updates.paymentMethod = paymentMethod;
          }
          return {...inv, ...updates};
        }
        return inv;
      })
    );
    this.saveInvoices();
  }

  deleteInvoice(id: string) {
    this.invoicesSignal.update(list => list.filter(inv => inv.id !== id));
    this.saveInvoices();
  }

  // === ZARZĄDZANIE CZASEM ===

  getTimeEntriesByCase(caseId: string) {
    return computed(() =>
      this.timeEntriesSignal().filter(entry => entry.caseId === caseId)
    );
  }

  getTimeEntriesByUser(userId: string) {
    return computed(() =>
      this.timeEntriesSignal().filter(entry => entry.userId === userId)
    );
  }

  getBillableTimeByCase(caseId: string): number {
    return this.timeEntriesSignal()
      .filter(entry => entry.caseId === caseId && entry.billable && !entry.invoiced)
      .reduce((sum, entry) => sum + entry.duration, 0);
  }

  startTimeEntry(caseId: string, userId: string, description: string, hourlyRate: number): string {
    const entry = {
      id: crypto.randomUUID(),
      caseId,
      userId,
      description,
      startTime: new Date(),
      duration: 0,
      hourlyRate,
      billable: true,
      invoiced: false,
      createdAt: new Date()
    };

    this.timeEntriesSignal.update(list => [entry, ...list]);
    this.saveTimeEntries();
    return entry.id;
  }

  stopTimeEntry(id: string) {
    this.timeEntriesSignal.update(list =>
      list.map(entry => {
        if(entry.id === id && !entry.endTime) {
          const endTime = new Date();
          const duration = Math.floor((endTime.getTime() - entry.startTime.getTime()) / (1000 * 60));
          return {...entry, endTime, duration};
        }
        return entry;
      })
    );
    this.saveTimeEntries();
  }

  updateTimeEntry(id: string, updates) {
    this.timeEntriesSignal.update(list =>
      list.map(entry => entry.id === id ? {...entry, ...updates} : entry)
    );
    this.saveTimeEntries();
  }

  deleteTimeEntry(id: string) {
    this.timeEntriesSignal.update(list => list.filter(entry => entry.id !== id));
    this.saveTimeEntries();
  }

  markEntriesAsInvoiced(entryIds: string[], invoiceId: string) {
    this.timeEntriesSignal.update(list =>
      list.map(entry => 
        entryIds.includes(entry.id) ? {...entry, invoiced: true, invoiceId} : entry
      )
    );
    this.saveTimeEntries();
  }

  // === RAPORTY ===

  getTotalRevenue(): number {
    return this.invoicesSignal()
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0);
  }

  getRevenueByPeriod(startDate, endDate): number {
    return this.invoicesSignal()
      .filter(inv => 
        inv.status === 'paid' && 
        inv.paidAt && 
        inv.paidAt >= startDate && 
        inv.paidAt <= endDate
      )
      .reduce((sum, inv) => sum + inv.total, 0);
  }

  getOutstandingAmount(): number {
    return this.invoicesSignal()
      .filter(inv => inv.status === 'pending')
      .reduce((sum, inv) => sum + inv.total, 0);
  }
}
