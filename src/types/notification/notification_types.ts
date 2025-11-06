export type NotificationType = 'reminder' | 'confirmation' | 'system' | 'rescheduled' | 'test_results' | 'general';
export type NotificationPriority = 'Alta' | 'Media' | 'Baja';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: string;
    priority: NotificationPriority;
    isRead: boolean;
}