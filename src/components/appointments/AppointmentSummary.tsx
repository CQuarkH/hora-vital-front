import React from 'react';
import clsx from 'clsx';

interface AppointmentSummaryProps {
    specialty?: string | null;
    doctor?: string | null;
    date?: string | null;
    time?: string | null;
    onConfirm: () => void;
}

export const AppointmentSummary: React.FC<AppointmentSummaryProps> = ({
    specialty,
    doctor,
    date,
    time,
    onConfirm,
}) => {
    const isComplete = !!specialty && !!doctor && !!date && !!time;

    return (
        <div className="p-6 bg-medical-50 border border-medical-200 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-medical-900 mb-4">Resumen de la Cita</h3>
            <p className="text-sm text-gray-600 mb-4">Revisa los detalles antes de confirmar.</p>

            <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">Especialidad:</span>
                    <span className="font-medium text-gray-900">{specialty || 'No seleccionada'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Médico:</span>
                    <span className="font-medium text-gray-900">{doctor || 'No seleccionado'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Fecha:</span>
                    <span className="font-medium text-gray-900">{date || 'No seleccionada'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Hora:</span>
                    <span className="font-medium text-gray-900">{time || 'No seleccionada'}</span>
                </div>
            </div>

            <button
                onClick={onConfirm}
                disabled={!isComplete}
                className={clsx(
                    'w-full p-3 rounded-lg text-white font-semibold mt-6 transition-colors',
                    isComplete ? 'bg-medical-600 hover:bg-medical-700' : 'bg-gray-400 cursor-not-allowed'
                )}
            >
                Confirmar Cita
            </button>
        </div>
    );
};

export default AppointmentSummary;