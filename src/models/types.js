// Modele danych dla systemu E-Kancelaria Pro

export type UserRole = 'lawyer' | 'client' | 'admin' | 'assistant';
export type CaseStatus = 'draft' | 'active' | 'pending' | 'closed' | 'archived';
export type CasePriority = 'low' | 'medium' | 'high' | 'urgent';
export type DocumentStatus = 'draft' | 'review' | 'approved' | 'signed' | 'archived';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed' | 'cancelled';
export type EventType = 'hearing' | 'meeting' | 'deadline' | 'consultation' | 'other';
export type NotificationType = 'info' | 'warning' | 'success' | 'error';
export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';
export type MessageStatus = 'sent' | 'delivered' | 'read';

export 

export 

export ;
  twoFactorAuth: boolean;
}

export 

export ;
  isArchived: boolean;
  confidential: boolean;
}

export 

export 

export 

export 

export 

export 

export 

export 

export 

export ;
  icon?: string;
  color?: string;
}

export 

export 

export 

export 

export ;
  createdAt;
  updatedAt;
}

export ;
}

export 

export  };
  ipAddress?: string;
  userAgent?: string;
  timestamp;
}

export 

export ;
  generatedBy: string;
  generatedAt;
  data: any;
  format: 'pdf' | 'excel' | 'json';
}
