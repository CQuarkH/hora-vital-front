import React from "react";
import AuthContext from "../context/AuthContext";
import { FaHeartbeat } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import ProfileTile from "./ProfileTile";

export const Header = () => {
    const context = React.useContext(AuthContext);
    const navigate = useNavigate();

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
                                <IoMdNotificationsOutline className="text-2xl text-medical-900 cursor-pointer" title="Notificaciones" />
                                <ProfileTile {...user} />
                                <IoLogOutOutline
                                    className="text-2xl text-medical-900 cursor-pointer"
                                    title="Cerrar Sesión"
                                    onClick={() => {
                                        navigate('/home');
                                        logout();
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center gap-6 text-sm font-medium">
                                <span 
                                    onClick={() => navigate('/login/form')}
                                    className="text-medical-700 cursor-pointer font-semibold hover:underline"
                                >
                                    Paciente
                                </span>
                                <span 
                                    onClick={() => navigate('/login/form')}
                                    className="text-gray-600 cursor-pointer hover:underline"
                                >
                                    Secretario/a
                                </span>
                                <span 
                                    onClick={() => navigate('/login/form')}
                                    className="text-gray-600 cursor-pointer hover:underline"
                                >
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