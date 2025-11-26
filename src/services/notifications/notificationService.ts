import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export interface Notification {
    id: string;
    userId: string;
    type: 'APPOINTMENT_REMINDER' | 'APPOINTMENT_CONFIRMATION' | 'APPOINTMENT_CANCELLATION' | 'GENERAL';
    title: string;
    message: string;
    isRead: boolean;
    data?: any;
    createdAt: string;
    updatedAt: string;
}

export interface NotificationsResponse {
    success: boolean;
    data?: {
        notifications: Notification[];
        meta: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    };
    message?: string;
}

export interface MarkAsReadResponse {
    success: boolean;
    data?: Notification;
    message?: string;
}

export const notificationService = {
    async getUserNotifications(page = 1, limit = 20, isRead?: boolean): Promise<NotificationsResponse> {
        try {
            const token = localStorage.getItem('token');
            const params: any = { page, limit };
            if (isRead !== undefined) {
                params.isRead = isRead;
            }

            const headers: Record<string,string> = {};
            if (token) headers.Authorization = `Bearer ${token}`;

            const response = await axios.get(`${API_URL}/notifications`, {
                headers,
                params,
            });

            return response.data;
        } catch (error: any) {
            console.error('Error fetching notifications:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Error al cargar notificaciones',
            };
        }
    },

    async markAsRead(notificationId: string): Promise<MarkAsReadResponse> {
        try {
            const token = localStorage.getItem('token');
            const headers: Record<string,string> = {};
            if (token) headers.Authorization = `Bearer ${token}`;

            const response = await axios.patch(
                `${API_URL}/notifications/${notificationId}/read`,
                {},
                {
                    headers,
                }
            );

            return response.data;
        } catch (error: any) {
            console.error('Error marking notification as read:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Error al marcar como leÃ­da',
            };
        }
    },

    async getUnreadNotifications(): Promise<NotificationsResponse> {
        return this.getUserNotifications(1, 50, false);
    },

    async getUnreadCount(): Promise<number> {
        try {
            const response = await this.getUnreadNotifications();
            if (response.success && response.data) {
                return response.data.meta.total;
            }
            return 0;
        } catch (error) {
            console.error('Error getting unread count:', error);
            return 0;
        }
    },
};