import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { Notification } from '../../../src/types/notification/notification_types';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { NotificationDropdown } from '../../../src/components/notifications/NotificationDropdown';

describe('NotificationDropdown Component', () => {
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'confirmation',
      title: 'Cita confirmada',
      message: 'Tu cita ha sido confirmada',
      timestamp: '2025-11-11 12:00',
      priority: 'Media',
      isRead: false,
    },
    {
      id: '2',
      type: 'reminder',
      title: 'Cita cancelada',
      message: 'Tu cita fue cancelada',
      timestamp: '2025-11-10 10:00',
      priority: 'Baja',
      isRead: true,
    },
  ];

  it('debería renderizar solo las notificaciones no leídas dentro del dropdown', () => {
    render(<NotificationDropdown notifications={mockNotifications} onMarkAsRead={vi.fn()} />);

    expect(screen.getByText('Cita confirmada')).toBeInTheDocument();
    expect(screen.queryByText('Cita cancelada')).not.toBeInTheDocument();
  });

  it('debería llamar a onMarkAsRead al hacer clic en una fila', () => {
    const handleMark = vi.fn();
    render(<NotificationDropdown notifications={mockNotifications} onMarkAsRead={handleMark} />);

    const row = screen.getByText('Cita confirmada');
    fireEvent.click(row);

    expect(handleMark).toHaveBeenCalledTimes(1);
    expect(handleMark).toHaveBeenCalledWith('1');
  });
});