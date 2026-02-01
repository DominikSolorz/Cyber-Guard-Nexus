import { Injectable, signal, computed } from '@angular/core';
import { Message, Conversation, MessageStatus } from '../models/types';

@Injectable({ providedIn: 'root' })
export class MessagingService {
  private messagesSignal = signal<Message[]>([]);
  private conversationsSignal = signal<Conversation[]>([]);
  private readonly MESSAGES_KEY = 'ekancelaria_messages';
  private readonly CONVERSATIONS_KEY = 'ekancelaria_conversations';

  constructor() {
    this.loadMessages();
    this.loadConversations();
  }

  private loadMessages() {
    try {
      const stored = localStorage.getItem(this.MESSAGES_KEY);
      if(stored) {
        const parsed = JSON.parse(stored);
        this.messagesSignal.set(
          parsed.map((m: any) => ({
            ...m,
            createdAt: new Date(m.createdAt),
            readAt: m.readAt ? new Date(m.readAt) : undefined
          }))
        );
      }
    } catch(e) {
      console.error('Error loading messages:', e);
    }
  }

  private loadConversations() {
    try {
      const stored = localStorage.getItem(this.CONVERSATIONS_KEY);
      if(stored) {
        const parsed = JSON.parse(stored);
        this.conversationsSignal.set(
          parsed.map((c: any) => ({
            ...c,
            createdAt: new Date(c.createdAt),
            updatedAt: new Date(c.updatedAt),
            lastMessage: c.lastMessage ? {
              ...c.lastMessage,
              createdAt: new Date(c.lastMessage.createdAt),
              readAt: c.lastMessage.readAt ? new Date(c.lastMessage.readAt) : undefined
            } : undefined
          }))
        );
      }
    } catch(e) {
      console.error('Error loading conversations:', e);
    }
  }

  private saveMessages() {
    localStorage.setItem(this.MESSAGES_KEY, JSON.stringify(this.messagesSignal()));
  }

  private saveConversations() {
    localStorage.setItem(this.CONVERSATIONS_KEY, JSON.stringify(this.conversationsSignal()));
  }

  messages = computed(() => this.messagesSignal());
  conversations = computed(() => this.conversationsSignal());

  getConversationsByUser(userId: string) {
    return computed(() =>
      this.conversationsSignal()
        .filter(c => c.participants.includes(userId))
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    );
  }

  getMessagesByConversation(conversationId: string) {
    return computed(() =>
      this.messagesSignal()
        .filter(m => m.conversationId === conversationId)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    );
  }

  getUnreadCount(userId: string): number {
    const conversations = this.conversationsSignal().filter(c => 
      c.participants.includes(userId)
    );
    return conversations.reduce((sum, c) => sum + (c.unreadCount[userId] || 0), 0);
  }

  findOrCreateConversation(participants: string[], caseId?: string): string {
    // Sortuj uczestników dla spójności
    const sortedParticipants = [...participants].sort();
    
    // Szukaj istniejącej konwersacji
    let conversation = this.conversationsSignal().find(c => {
      const sortedExisting = [...c.participants].sort();
      return JSON.stringify(sortedExisting) === JSON.stringify(sortedParticipants) &&
             (!caseId || c.caseId === caseId);
    });

    if(conversation) {
      return conversation.id;
    }

    // Utwórz nową konwersację
    const newConversation = {
      id: crypto.randomUUID(),
      participants,
      caseId,
      unreadCount: {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.conversationsSignal.update(list => [newConversation, ...list]);
    this.saveConversations();
    return newConversation.id;
  }

  sendMessage(
    conversationId: string,
    senderId: string,
    recipientId: string,
    content: string,
    subject?: string,
    caseId?: string,
    attachments?: string[]
  ): string {
    const message = {
      id: crypto.randomUUID(),
      conversationId,
      senderId,
      recipientId,
      caseId,
      subject,
      content,
      status: 'sent',
      attachments,
      createdAt: new Date()
    };

    this.messagesSignal.update(list => [...list, message]);
    this.saveMessages();

    // Aktualizuj konwersację
    this.conversationsSignal.update(list =>
      list.map(c => {
        if(c.id === conversationId) {
          const unreadCount = {...c.unreadCount};
          unreadCount[recipientId] = (unreadCount[recipientId] || 0) + 1;
          
          return {
            ...c,
            lastMessage: message,
            unreadCount,
            updatedAt: new Date()
          };
        }
        return c;
      })
    );
    this.saveConversations();

    return message.id;
  }

  markAsRead(messageId: string, userId: string) {
    this.messagesSignal.update(list =>
      list.map(m => {
        if(m.id === messageId && m.recipientId === userId) {
          return {...m, status: 'read' as MessageStatus, readAt: new Date()};
        }
        return m;
      })
    );
    this.saveMessages();

    // Zmniejsz licznik nieprzeczytanych
    const message = this.messagesSignal().find(m => m.id === messageId);
    if(message) {
      this.conversationsSignal.update(list =>
        list.map(c => {
          if(c.id === message.conversationId) {
            const unreadCount = {...c.unreadCount};
            if(unreadCount[userId] > 0) {
              unreadCount[userId]--;
            }
            return {...c, unreadCount};
          }
          return c;
        })
      );
      this.saveConversations();
    }
  }

  markConversationAsRead(conversationId: string, userId: string) {
    const messages = this.messagesSignal().filter(m => 
      m.conversationId === conversationId && m.recipientId === userId && m.status !== 'read'
    );

    messages.forEach(m => this.markAsRead(m.id, userId));

    // Wyzeruj licznik
    this.conversationsSignal.update(list =>
      list.map(c => {
        if(c.id === conversationId) {
          const unreadCount = {...c.unreadCount};
          unreadCount[userId] = 0;
          return {...c, unreadCount};
        }
        return c;
      })
    );
    this.saveConversations();
  }

  deleteMessage(messageId: string) {
    this.messagesSignal.update(list => list.filter(m => m.id !== messageId));
    this.saveMessages();
  }

  deleteConversation(conversationId: string) {
    this.messagesSignal.update(list => 
      list.filter(m => m.conversationId !== conversationId)
    );
    this.conversationsSignal.update(list => 
      list.filter(c => c.id !== conversationId)
    );
    this.saveMessages();
    this.saveConversations();
  }

  searchMessages(query: string, userId: string) {
    const lowerQuery = query.toLowerCase();
    return this.messagesSignal().filter(m => 
      (m.senderId === userId || m.recipientId === userId) &&
      (m.content.toLowerCase().includes(lowerQuery) ||
       m.subject?.toLowerCase().includes(lowerQuery))
    );
  }
}
