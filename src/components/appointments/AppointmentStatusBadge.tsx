import React from 'react';
import clsx from 'clsx';

export type AppointmentStatus = 
    | 'Confirmada' 
    | 'Pendiente' 
    | 'Completada' 
    | 'Cancelada' 
    | 'En Atención' 
    | 'No Asistió';

interface AppointmentStatusBadgeProps {
    status: AppointmentStatus;
}

export const AppointmentStatusBadge: React.FC<AppointmentStatusBadgeProps> = ({ status }) => {
    
    const statusStyles: Record<AppointmentStatus, string> = {
        'Confirmada': 'bg-green-100 text-green-800 border-green-300',
        'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-300',
        'Completada': 'bg-blue-100 text-blue-800 border-blue-300',
        'Cancelada': 'bg-red-100 text-red-800 border-red-300',
        'En Atención': 'bg-orange-100 text-orange-800 border-orange-300',
        'No Asistió': 'bg-red-100 text-red-800 border-red-300',
    };

    return (
        <span
            className={clsx(
                "text-xs font-semibold px-2.5 py-0.5 rounded-full border",
                statusStyles[status] || 'bg-gray-100 text-gray-800 border-gray-300'
            )}
        >
            {status}
        </span>
    );
};