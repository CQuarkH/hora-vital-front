import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NotificationPreview } from '../../../src/components/dashboard/NotificationPreview';

describe('NotificationPreview Component', () => {
    it('debe renderizar el título y el tiempo transcurrido', () => {
        render(
            <NotificationPreview
                title="Nueva cita confirmada"
                timeAgo="Hace 5 minutos"
            />
        );

        expect(screen.getByText('Nueva cita confirmada')).toBeInTheDocument();

        expect(screen.getByText('Hace 5 minutos')).toBeInTheDocument();
    });

    it('debe renderizar el ícono de campana (HiOutlineBell)', () => {
        const { container } = render(
            <NotificationPreview
                title="Test"
                timeAgo="Test time"
            />
        );

        const svgElement = container.querySelector('svg');
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveClass('text-medical-700');
    });
});