import React from 'react';
import clsx from 'clsx';

export type PatientStatus = 'Activo' | 'Inactivo';

interface PatientStatusBadgeProps {
    status: PatientStatus;
}

export const PatientStatusBadge: React.FC<PatientStatusBadgeProps> = ({ status }) => {
    
    const statusStyles = {
        'Activo': 'bg-green-100 text-green-800',
        'Inactivo': 'bg-yellow-100 text-yellow-800',
    };

    return (
        <span
            className={clsx(
                "text-xs font-semibold px-2.5 py-0.5 rounded-full",
                statusStyles[status] || 'bg-gray-100 text-gray-800'
            )}
        >
            {status}
        </span>
    );
};