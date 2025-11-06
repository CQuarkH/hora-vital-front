import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi';

export default function CreateUserPage() {
    const navigate = useNavigate();
    return (
        <div className="max-w-4xl mx-auto">
            <button 
                onClick={() => navigate('/home')} 
                className="flex items-center gap-1 text-sm font-medium text-medical-600 hover:text-medical-800 mb-4"
            >
                <HiOutlineArrowLeft />
                Volver al Panel
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Usuario</h1>
            <p className="text-gray-600">
                Formulario para registrar un nuevo secretario o administrador.
            </p>
        </div>
    );
}