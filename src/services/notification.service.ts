import { Injectable, signal, computed } from '@angular/core';
import { Notification, NotificationType } from '../models/types';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationsSignal = signal<Notification[]>([]);
  private readonly KEY = 'ekancelaria_notifications';

  constructor() {
    this.load();
  }

  private load() {
    try {
      const stored = localStorage.getItem(this.KEY);
      if(stored) {
        const parsed = JSON.parse(stored);
        this.notificationsSignal.set(
          parsed.map((n: any) => ({
            ...n,
            createdAt: new Date(n.createdAt),
            readAt: n.readAt ? new Date(n.readAt) : undefined
          }))
        );
      }
    } catch(e) {
      console.error('Error loading notifications:', e);
    }
  }

  private save() {
    localStorage.setItem(this.KEY, JSON.stringify(this.notificationsSignal()));
  }

  notifications = computed(() => this.notificationsSignal());
  
  unreadCount = computed(() => 
    this.notificationsSignal().filter(n => !n.read).length
  );

  getByUser(userId: string) {
    return computed(() => 
      this.notificationsSignal()
        .filter(n => n.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    );
  }

  add(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    link?: string,
    metadata?: any
  ): string {
    const notification: Notification = {
      id: crypto.randomUUID(),
      userId,
      type,
      title,
      message,
      link,
      read: false,
      createdAt: new Date(),
      metadata
    };

    this.notificationsSignal.update(list => [notification, ...list]);
    this.save();
    return notification.id;
  }

  markAsRead(id: string) {
    this.notificationsSignal.update(list =>
      list.map(n => n.id === id ? {...n, read: true, readAt: new Date()} : n)
    );
    this.save();
  }

  markAllAsRead(userId: string) {
    this.notificationsSignal.update(list =>
      list.map(n => n.userId === userId ? {...n, read: true, readAt: new Date()} : n)
    );
    this.save();
  }

  delete(id: string) {
    this.notificationsSignal.update(list => list.filter(n => n.id !== id));
    this.save();
  }

  deleteByUser(userId: string) {
    this.notificationsSignal.update(list => list.filter(n => n.userId !== userId));
    this.save();
  }

  // Metody pomocnicze do tworzenia powiadomień

  notifyDeadlineApproaching(userId: string, caseTitle: string, deadline: Date, caseId: string) {
    const daysLeft = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    this.add(
      userId,
      'warning',
      'Zbliżający się termin',
      `Sprawa "${caseTitle}" - termin za ${daysLeft} dni`,
      `/cases/${caseId}`,
      { deadline, caseId }
    );
  }

  notifyNewCase(userId: string, caseTitle: string, caseId: string) {
    this.add(
      userId,
      'info',
      'Nowa sprawa',
      `Przypisano Cię do sprawy: ${caseTitle}`,
      `/cases/${caseId}`,
      { caseId }
    );
  }

  notifyTaskAssigned(userId: string, taskTitle: string, caseId: string) {
    this.add(
      userId,
      'info',
      'Nowe zadanie',
      `Przydzielono zadanie: ${taskTitle}`,
      `/cases/${caseId}`,
      { caseId }
    );
  }

  notifyNewMessage(userId: string, senderName: string, conversationId: string) {
    this.add(
      userId,
      'info',
      'Nowa wiadomość',
      `${senderName} wysłał wiadomość`,
      `/messages/${conversationId}`,
      { conversationId }
    );
  }

  notifyPaymentReceived(userId: string, amount: number, invoiceId: string) {
    this.add(
      userId,
      'success',
      'Otrzymano płatność',
      `Płatność ${amount.toFixed(2)} PLN została zaksięgowana`,
      `/invoices/${invoiceId}`,
      { amount, invoiceId }
    );
  }

  notifyDocumentSigned(userId: string, documentName: string, caseId: string, fileId: string) {
    this.add(
      userId,
      'success',
      'Dokument podpisany',
      `Dokument "${documentName}" został podpisany`,
      `/cases/${caseId}/files/${fileId}`,
      { caseId, fileId }
    );
  }
}
