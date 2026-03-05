export type UserCategory = 'blind' | 'mute' | 'deaf' | 'general';
export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  category: UserCategory;
  role: UserRole;
  department: string;
  courses: string[];
  createdAt: Date;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  instructor: string;
  description: string;
  credits: number;
  schedule: string;
  resources: Resource[];
  assignments: Assignment[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'audio' | 'document' | 'link';
  url: string;
  uploadedAt: Date;
  description: string;
  accessibilityNotes: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  submissionUrl?: string;
  grade?: number;
  feedback?: string;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  recipientId: string;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: 'small' | 'normal' | 'large' | 'xlarge';
  screenReaderOptimized: boolean;
  reducedMotion: boolean;
  captionsEnabled: boolean;
  brailleMode: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: Date;
  category: string;
}
