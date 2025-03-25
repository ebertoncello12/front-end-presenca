export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  time: string;
  read: boolean;
  link?: string;
  category?: 'academic' | 'attendance' | 'exam' | 'general';
  priority?: 'low' | 'medium' | 'high';
}