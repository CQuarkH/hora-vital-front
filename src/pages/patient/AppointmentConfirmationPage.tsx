import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AppointmentConfirmationPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="max-w-xl w-full bg-medical-50 border border-medical-200 shadow-sm p-8 rounded-xl text-center">
                <h1 className="text-2xl font-bold text-medical-900 mb-4">¡Cita agendada!</h1>
                <p className="text-medical-700 mb-6">Tu cita se ha registrado correctamente. Revisa tu sección de "Mis citas" para más detalles.</p>

                <div className="flex justify-center gap-3">
                    <button
                        onClick={() => navigate('/appointments')}
                        className="bg-medical-700 text-white px-4 py-2 rounded-lg hover:bg-medical-800"
                    >
                        Ir a Mis Citas
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-white border border-medical-300 px-4 py-2 rounded-lg hover:bg-medical-100"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        </div>
    );
}