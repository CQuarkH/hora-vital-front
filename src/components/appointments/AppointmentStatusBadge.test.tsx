import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppointmentStatusBadge, AppointmentStatus } from './AppointmentStatusBadge';

describe('AppointmentStatusBadge Component', () => {
    const statuses: AppointmentStatus[] = [
        'Confirmada', 'Pendiente', 'Completada', 'Cancelada', 'En Atención', 'No Asistió'
    ];

    const styles: Record<AppointmentStatus, string[]> = {
        'Confirmada': ['bg-green-100', 'text-green-800'],
        'Pendiente': ['bg-yellow-100', 'text-yellow-800'],
        'Completada': ['bg-blue-100', 'text-blue-800'],
        'Cancelada': ['bg-red-100', 'text-red-800'],
        'En Atención': ['bg-orange-100', 'text-orange-800'],
        'No Asistió': ['bg-red-100', 'text-red-800'],
    };

    it.each(statuses)('debe renderizar el estado "%s" con los estilos correctos', (status) => {
        render(<AppointmentStatusBadge status={status} />);
        
        const badge = screen.getByText(status);
        expect(badge).toBeInTheDocument();
        
        const [bgClass, textClass] = styles[status];
        expect(badge).toHaveClass(bgClass);
        expect(badge).toHaveClass(textClass);
        expect(badge).toHaveClass('text-xs', 'font-semibold', 'rounded-full', 'border');
    });
});