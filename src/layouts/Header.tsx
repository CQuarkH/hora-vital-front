import React, { useState } from "react";
import AuthContext from "../context/AuthContext";
import { FaHeartbeat } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import ProfileTile from "./ProfileTile";
import { NotificationDropdown } from "../components/notifications/NotificationDropdown";
import type { Notification } from "../types/notification/notification_types";

// --- DATOS DE EJEMPLO (MOCK) ---
const MOCK_NOTIFICATIONS_DATA: Notification[] = [
    { id: '1', type: 'reminder', title: 'Recordatorio de Cita', message: 'Tu cita con Dr. María Rodríguez es mañana a las 10:30', timestamp: '13-01-2024 14:30', priority: 'Alta', isRead: false },
    { id: '2', type: 'confirmation', title: 'Cita Confirmada', message: 'Tu cita del 22 de enero con Dr. Carlos Mendoza ha sido confirmada', timestamp: '12-01-2024 09:15', priority: 'Media', isRead: false },
    { id: '3', type: 'system', title: 'Actualización del Sistema', message: 'El sistema estará en mantenimiento el domingo de 02:00 a 06:00', timestamp: '11-01-2024 16:45', priority: 'Baja', isRead: true },
];
// --- FIN DE DATOS DE EJEMPLO ---

export const Header = () => {
    const context = React.useContext(AuthContext);
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS_DATA);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleMarkAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
        );
    };

    if (!context) {
        throw new Error('Header debe ser usado dentro de un AuthProvider');
    }
    const { user, logout } = context;

    const mapUserRoleToLabel = (role: string | undefined) => {
        switch (role) {
            case 'admin':
                return 'Administrador';
            case 'patient':
                return 'Paciente';
            case 'secretary':
                return 'Secretaria';
        }
    }

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => navigate(user ? '/home' : '/')}
                    >
                        <FaHeartbeat className="text-2xl text-green-600" />
                        <span className="text-2xl font-bold text-gray-900 mb-1">Hora Vital</span>

                        {
                            user && (<span className="text-sm ml-4 px-2 py-1 rounded-lg bg-amber-300 border border-amber-500"> {mapUserRoleToLabel(user.role)} </span>)
                        }
                    </div>

                    <nav className="flex items-center gap-6">
                        {user ? (
                            <div className="flex items-center gap-6">

                                <div className="relative">
                                    <button
                                        onClick={() => setIsDropdownOpen(prev => !prev)}
                                        className="text-2xl text-medical-900 cursor-pointer" 
                                        title="Notificaciones"
                                    >
                                        <IoMdNotificationsOutline />
                                    </button>
                                    
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1.5 h-4 w-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}

                                    {isDropdownOpen && (
                                        <NotificationDropdown 
                                            notifications={notifications}
                                            onMarkAsRead={handleMarkAsRead}
                                        />
                                    )}
                                </div>

                                <ProfileTile {...user} />

                                <IoLogOutOutline
                                    className="text-2xl text-medical-900 cursor-pointer"
                                    title="Cerrar Sesión"
                                    onClick={() => {
                                        logout();
                                        navigate('/login');
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center gap-6 text-sm font-medium">
                                <span onClick={() => navigate('/login')} className="text-medical-700 cursor-pointer font-semibold hover:underline">
                                    Paciente
                                </span>
                                <span onClick={() => navigate('/login')} className="text-gray-600 cursor-pointer hover:underline">
                                    Secretario/a
                                </span>
                                <span onClick={() => navigate('/login')} className="text-gray-600 cursor-pointer hover:underline">
                                    Administrador
                                </span>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};