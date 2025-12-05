import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationCard } from '../../../src/components/notifications/NotificationCard';
import type { Notification } from '../../../src/types/notification/notification_types';

const mockOnMarkAsRead = vi.fn();
const mockOnDelete = vi.fn();

const mockNotification: Notification = {
    id: 'n-123',
    type: 'confirmation',
    title: 'Cita Confirmada',
    message: 'Tu cita ha sido confirmada para el día...',
    timestamp: '2024-01-01T10:00:00.000Z',
    priority: 'Media',
    isRead: false,
    data: {}
};

describe('NotificationCard Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe renderizar una notificación no leída', () => {
        render(<NotificationCard notification={mockNotification} onMarkAsRead={mockOnMarkAsRead} onDelete={mockOnDelete} />);

        expect(screen.getByText('Cita Confirmada')).toBeInTheDocument();
        expect(screen.getByText('Tu cita ha sido confirmada para el día...')).toBeInTheDocument();
        expect(screen.getByTitle('No leído')).toBeInTheDocument();
        expect(screen.getByText('Marcar como Leída')).toBeInTheDocument();
    });

    it('debe renderizar una notificación leída', () => {
        const readNotification = { ...mockNotification, isRead: true };
        render(<NotificationCard notification={readNotification} onMarkAsRead={mockOnMarkAsRead} onDelete={mockOnDelete} />);

        expect(screen.queryByTitle('No leído')).not.toBeInTheDocument();
        expect(screen.queryByText('Marcar como Leída')).not.toBeInTheDocument();
    });

    it('debe llamar a onMarkAsRead cuando se hace clic', async () => {
        const user = userEvent.setup();
        render(<NotificationCard notification={mockNotification} onMarkAsRead={mockOnMarkAsRead} onDelete={mockOnDelete} />);

        await user.click(screen.getByText('Marcar como Leída'));
        expect(mockOnMarkAsRead).toHaveBeenCalledTimes(1);
        expect(mockOnMarkAsRead).toHaveBeenCalledWith('n-123');
    });

    it('debe llamar a onDelete cuando se hace clic en el ícono de basura', async () => {
        const user = userEvent.setup();
        render(<NotificationCard notification={mockNotification} onMarkAsRead={mockOnMarkAsRead} onDelete={mockOnDelete} />);

        await user.click(screen.getByTitle('Eliminar'));
        expect(mockOnDelete).toHaveBeenCalledTimes(1);
        expect(mockOnDelete).toHaveBeenCalledWith('n-123');
    });

    it('debe renderizar el estilo de prioridad "Alta"', () => {
        const highPrio = { ...mockNotification, priority: 'Alta' as 'Alta' };
        render(<NotificationCard notification={highPrio} onMarkAsRead={mockOnMarkAsRead} onDelete={mockOnDelete} />);

        const badge = screen.getByText('Alta');
        expect(badge).toHaveClass('bg-red-100', 'text-red-800');
    });

    it('debe renderizar el estilo de prioridad "Baja"', () => {
        const lowPrio = { ...mockNotification, priority: 'Baja' as 'Baja' };
        render(<NotificationCard notification={lowPrio} onMarkAsRead={mockOnMarkAsRead} onDelete={mockOnDelete} />);

        const badge = screen.getByText('Baja');
        expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800');
    });
});