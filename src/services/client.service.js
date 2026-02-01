import { Injectable, signal, computed } from '@angular/core';
import { Client } from '../models/types';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private clientsSignal = signal<Client[]>([]);
  private readonly KEY = 'ekancelaria_clients';

  constructor() {
    this.load();
  }

  private load() {
    try {
      const stored = localStorage.getItem(this.KEY);
      if(stored) {
        const parsed = JSON.parse(stored);
        this.clientsSignal.set(
          parsed.map((c: any) => ({
            ...c,
            createdAt: new Date(c.createdAt),
            updatedAt: new Date(c.updatedAt)
          }))
        );
      }
    } catch(e) {
      console.error('Error loading clients:', e);
    }
  }

  private save() {
    localStorage.setItem(this.KEY, JSON.stringify(this.clientsSignal()));
  }

  clients = computed(() => this.clientsSignal());

  getClientById(id: string) {
    return computed(() => this.clientsSignal().find(c => c.id === id));
  }

  getClientByUserId(userId: string) {
    return computed(() => this.clientsSignal().find(c => c.userId === userId));
  }

  getClientsByLawyer(lawyerId: string) {
    return computed(() =>
      this.clientsSignal().filter(c => c.assignedLawyers.includes(lawyerId))
    );
  }

  addClient(data: {
    userId: string;
    type: 'individual' | 'company';
    companyName?: string;
    registrationNumber?: string;
    taxId?: string;
    notes?: string;
    assignedLawyers?: string[];
    tags?: string[];
  }): string {
    const client = {
      id: crypto.randomUUID(),
      userId: data.userId,
      type: data.type,
      companyName: data.companyName,
      registrationNumber: data.registrationNumber,
      taxId: data.taxId,
      notes: data.notes,
      assignedLawyers: data.assignedLawyers || [],
      tags: data.tags || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.clientsSignal.update(list => [client, ...list]);
    this.save();
    return client.id;
  }

  updateClient(id: string, updates) {
    this.clientsSignal.update(list =>
      list.map(c => c.id === id ? {...c, ...updates, updatedAt: new Date()} : c)
    );
    this.save();
  }

  deleteClient(id: string) {
    this.clientsSignal.update(list => list.filter(c => c.id !== id));
    this.save();
  }

  assignLawyer(clientId: string, lawyerId: string) {
    this.clientsSignal.update(list =>
      list.map(c => {
        if(c.id === clientId && !c.assignedLawyers.includes(lawyerId)) {
          return {...c, assignedLawyers: [...c.assignedLawyers, lawyerId], updatedAt: new Date()};
        }
        return c;
      })
    );
    this.save();
  }

  removeLawyer(clientId: string, lawyerId: string) {
    this.clientsSignal.update(list =>
      list.map(c => {
        if(c.id === clientId) {
          return {
            ...c,
            assignedLawyers: c.assignedLawyers.filter(id => id !== lawyerId),
            updatedAt: new Date()
          };
        }
        return c;
      })
    );
    this.save();
  }

  addTag(clientId: string, tag: string) {
    this.clientsSignal.update(list =>
      list.map(c => {
        if(c.id === clientId) {
          const tags = c.tags || [];
          if(!tags.includes(tag)) {
            return {...c, tags: [...tags, tag], updatedAt: new Date()};
          }
        }
        return c;
      })
    );
    this.save();
  }

  removeTag(clientId: string, tag: string) {
    this.clientsSignal.update(list =>
      list.map(c => {
        if(c.id === clientId) {
          return {
            ...c,
            tags: (c.tags || []).filter(t => t !== tag),
            updatedAt: new Date()
          };
        }
        return c;
      })
    );
    this.save();
  }

  searchClients(query: string) {
    const lowerQuery = query.toLowerCase();
    return this.clientsSignal().filter(c =>
      c.companyName?.toLowerCase().includes(lowerQuery) ||
      c.registrationNumber?.toLowerCase().includes(lowerQuery) ||
      c.taxId?.toLowerCase().includes(lowerQuery) ||
      c.notes?.toLowerCase().includes(lowerQuery) ||
      c.tags?.some(t => t.toLowerCase().includes(lowerQuery))
    );
  }
}
