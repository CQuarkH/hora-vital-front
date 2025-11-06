import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineBell, HiOutlineCheckCircle } from 'react-icons/hi';
import type { Notification } from '../types/notification/notification_types';

interface NotificationDropdownProps {
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
}

const DropdownRow: React.FC<{ notif: Notification, onClick: () => void }> = ({ notif, onClick }) => (
    <div onClick={onClick} className="flex items-start gap-3 p-3 hover:bg-medical-100 rounded-lg cursor-pointer">
        <HiOutlineBell className="text-lg text-medical-700 mt-1 flex-shrink-0" />
        <div className="flex-1">
            <p className="text-sm text-gray-800 leading-tight">{notif.title}</p>
            <span className="text-xs text-gray-500">{notif.timestamp.split(' ')[0]}</span>
        </div>
        {!notif.isRead && (
            <span className="h-2.5 w-2.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0" title="No leído"></span>
        )}
    </div>
);

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ notifications, onMarkAsRead }) => {
    const navigate = useNavigate();
    const unreadNotifications = notifications.filter(n => !n.isRead);

    const handleViewAll = () => {
        navigate('/notifications');
    };
    
    const handleRowClick = (id: string) => {
        onMarkAsRead(id);
        navigate(`/notifications/${id}`);
    };

    return (
        <div className="absolute right-0 top-14 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-100">
                <h4 className="font-semibold text-gray-900">Notificaciones</h4>
            </div>
            
            <div className="flex flex-col gap-1 p-2 max-h-80 overflow-y-auto">
                {unreadNotifications.length > 0 ? (
                    unreadNotifications.map(notif => (
                        <DropdownRow 
                            key={notif.id} 
                            notif={notif}
                            onClick={() => handleRowClick(notif.id)}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center text-gray-500">
                        <HiOutlineCheckCircle className="h-10 w-10 text-green-500" />
                        <p className="text-sm mt-2">Estás al día</p>
                        <p className="text-xs">No tienes notificaciones nuevas.</p>
                    </div>
                )}
            </div>

            <div className="p-2 border-t border-gray-100">
                <button
                    onClick={handleViewAll}
                    className="w-full text-center text-sm font-medium text-medical-600 hover:text-medical-800 p-2 rounded-lg"
                >
                    Ver Todas las Notificaciones
                </button>
            </div>
        </div>
    );
};