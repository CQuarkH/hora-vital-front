import React from "react";
import AuthContext from "../context/AuthContext";

export const Header = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('Header debe ser usado dentro de un AuthProvider');
    }
    const { user, logout } = context;

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => { }}
                    >

                        <span className="text-2xl font-bold text-gray-900">Hora Vital</span>
                    </div>

                    <nav className="flex items-center gap-6">
                        <button
                            onClick={() => { }}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            Paciente
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                            Secretario/a
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                            Administrador
                        </button>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-700">
                                    Hola, {user.firstName}
                                </span>
                                <button
                                    onClick={() => { }}
                                    className="px-4 py-2 text-sm text-green-700 border border-green-700 rounded-lg hover:bg-green-50"
                                >
                                    Mi Perfil
                                </button>
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => { }}
                                className="px-4 py-2 text-sm text-white bg-green-700 rounded-lg hover:bg-green-800"
                            >
                                Iniciar Sesión
                            </button>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};