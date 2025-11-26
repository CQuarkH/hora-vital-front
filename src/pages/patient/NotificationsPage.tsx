import { useState, useEffect } from 'react';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { NotificationCard } from '../../components/notifications/NotificationCard';
import { notificationService } from '../../services/notifications/notificationService';
import type { Notification as UINotification } from '../../types/notification/notification_types';

export default function NotificationsPage() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<UINotification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        setLoading(true);
        setError(null);

        const response = await notificationService.getUserNotifications(1, 50);

        if (response.success && response.data) {
            const mapped = response.data.notifications.map((n: any): UINotification => {
                const typeMap: Record<string, import('../../types/notification/notification_types').NotificationType> = {
                    'APPOINTMENT_REMINDER': 'reminder',
                    'APPOINTMENT_CONFIRMATION': 'confirmation',
                    'APPOINTMENT_CANCELLATION': 'general',
                    'GENERAL': 'general',
                    'APPOINTMENT_RESCHEDULED': 'rescheduled',
                    'TEST_RESULTS': 'test_results'
                };

                const uiType = typeMap[n.type] || 'general';
                const priority = (n.priority && (['Alta','Media','Baja'] as const).includes(n.priority)) ? n.priority : 'Media';

                return {
                    id: n.id,
                    type: uiType,
                    title: n.title || (n.message ? n.message.slice(0, 40) : 'Notificación'),
                    message: n.message || '',
                    timestamp: n.createdAt || new Date().toISOString(),
                    priority,
                    isRead: !!n.isRead
                };
            });

            setNotifications(mapped);
        } else {
            setError(response.message || 'Error al cargar notificaciones');
        }

        setLoading(false);
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleMarkAsRead = async (id: string) => {
        const response = await notificationService.markAsRead(id);

        if (response.success) {
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
        }
    };

    const handleDelete = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const handleMarkAllAsRead = async () => {
        const unreadNotifications = notifications.filter(n => !n.isRead);
        await Promise.all(
            unreadNotifications.map(n => notificationService.markAsRead(n.id))
        );

        setNotifications(prev =>
            prev.map(n => ({ ...n, isRead: true }))
        );
    };

    const sortedNotifications = [...notifications].sort(
        (a, b) => (a.isRead ? 1 : -1) - (b.isRead ? 1 : -1)
    );


    if (loading) {
        return (
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/home')}
                    className="flex items-center gap-1 text-sm font-medium text-medical-600 hover:text-medical-800 mb-4"
                >
                    <HiOutlineArrowLeft />
                    Volver al Dashboard
                </button>
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-medical-600"></div>
                    <p className="mt-4 text-gray-600">Cargando notificaciones...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/home')}
                    className="flex items-center gap-1 text-sm font-medium text-medical-600 hover:text-medical-800 mb-4"
                >
                    <HiOutlineArrowLeft />
                    Volver al Dashboard
                </button>
                <div className="text-center py-12">
                    <p className="text-red-600 font-medium">{error}</p>
                    <button
                        onClick={loadNotifications}
                        className="mt-4 px-4 py-2 bg-medical-600 text-white rounded-lg hover:bg-medical-700"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={() => navigate('/home')}
                className="flex items-center gap-1 text-sm font-medium text-medical-600 hover:text-medical-800 mb-4"
            >
                <HiOutlineArrowLeft />
                Volver al Dashboard
            </button>

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
                    <p className="text-gray-600">
                        {unreadCount > 0
                            ? `Tienes ${unreadCount} notificaciones sin leer`
                            : 'No tienes notificaciones nuevas'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => loadNotifications()}
                        className="px-4 py-2 bg-white border border-medical-300 text-medical-800 rounded-lg font-medium text-sm hover:bg-medical-50"
                        title="Actualizar"
                    >
                        Actualizar
                    </button>
                    <button
                        onClick={handleMarkAllAsRead}
                        disabled={unreadCount === 0}
                        className="px-4 py-2 bg-white border border-medical-300 text-medical-800 rounded-lg font-medium text-sm hover:bg-medical-50 disabled:opacity-50"
                    >
                        Marcar Todas como LeÃ­das
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {sortedNotifications.length > 0 ? (
                    sortedNotifications.map(notif => (
                        <NotificationCard
                            key={notif.id}
                            notification={notif}
                            onMarkAsRead={handleMarkAsRead}
                            onDelete={handleDelete}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-12">
                        No tienes notificaciones en este momento.
                    </p>
                )}
            </div>
        </div>
    );
}