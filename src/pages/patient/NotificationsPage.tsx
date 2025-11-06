import React, { useState } from 'react';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { NotificationCard } from '../../components/notifications/NotificationCard';
import type { Notification } from '../../types/notification/notification_types';

// --- DATOS DE EJEMPLO (MOCK) ---
const MOCK_NOTIFICATIONS_DATA: Notification[] = [
    { id: '1', type: 'reminder', title: 'Recordatorio de Cita', message: 'Tu cita con Dr. María Rodríguez es mañana a las 10:30', timestamp: '13-01-2024 14:30', priority: 'Alta', isRead: false },
    { id: '2', type: 'confirmation', title: 'Cita Confirmada', message: 'Tu cita del 22 de enero con Dr. Carlos Mendoza ha sido confirmada', timestamp: '12-01-2024 09:15', priority: 'Media', isRead: false },
    { id: '3', type: 'system', title: 'Actualización del Sistema', message: 'El sistema estará en mantenimiento el domingo de 02:00 a 06:00', timestamp: '11-01-2024 16:45', priority: 'Baja', isRead: true },
    { id: '4', type: 'test_results', title: 'Exámenes Pendientes', message: 'Recuerda traer tus exámenes de sangre a la próxima cita', timestamp: '09-01-2024 11:20', priority: 'Media', isRead: true },
    { id: '5', type: 'rescheduled', title: 'Cita Reprogramada', message: 'Tu cita ha sido reprogramada para el 25 de enero a las 15:00', timestamp: '07-01-2024 13:30', priority: 'Alta', isRead: false },
];

export default function NotificationsPage() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS_DATA);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleMarkAsRead = (id: string) => {
        setNotifications(prev => 
            prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
    };

    const handleDelete = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prev => 
            prev.map(n => ({ ...n, isRead: true }))
        );
    };

    const sortedNotifications = [...notifications].sort(
        (a, b) => (a.isRead ? 1 : -1) - (b.isRead ? 1 : -1)
    );

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
                <button
                    onClick={handleMarkAllAsRead}
                    disabled={unreadCount === 0}
                    className="px-4 py-2 bg-white border border-medical-300 text-medical-800 rounded-lg font-medium text-sm hover:bg-medical-50 disabled:opacity-50"
                >
                    Marcar Todas como Leídas
                </button>
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