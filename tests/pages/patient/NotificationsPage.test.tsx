import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import NotificationsPage from '../../../src/pages/patient/NotificationsPage';
import AuthContext from '../../../src/context/AuthContext';
import type { User } from '../../../src/types/auth/auth_types';
import type { Notification } from '../../../src/types/notification/notification_types';

vi.mock('../../../src/components/notifications/NotificationCard', () => ({
    NotificationCard: ({ notification, onDelete }: { notification: Notification, onDelete: (id: string) => void }) => (
        <div data-testid="notification-card">
            {notification.title}
            <button onClick={() => onDelete(notification.id)}>Eliminar</button>
        </div>
    )
}));

const mockUser: User = { id: 'user-1', /* ... */ } as User;
const mockAuthContextValue = {
    user: mockUser,
} as Partial<any>;

const renderComponent = () => {
    render(
        <MemoryRouter>
            <AuthContext.Provider value={mockAuthContextValue as any}>
                <NotificationsPage />
            </AuthContext.Provider>
        </MemoryRouter>
    );
};

describe('NotificationsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debe cargar y mostrar la lista de notificaciones', async () => {
        renderComponent();

        expect(screen.getByText('Notificaciones')).toBeInTheDocument();
        expect(screen.getByText(/Tienes \d+ notificaciones sin leer/)).toBeInTheDocument();
        expect(screen.getAllByTestId('notification-card').length).toBeGreaterThan(0);
    });

    it('debe mostrar un mensaje si no hay notificaciones', async () => {
        renderComponent();

        const cards = screen.getAllByTestId('notification-card');
        const user = userEvent.setup();
        for (const card of cards) {
            const btn = within(card).getByRole('button', { name: 'Eliminar' });
            await user.click(btn);
        }

        await waitFor(() => {
            expect(screen.getByText('No tienes notificaciones en este momento.')).toBeInTheDocument();
            expect(screen.queryByTestId('notification-card')).not.toBeInTheDocument();
        });
    });

    it('eliminar una notificación actualiza la lista', async () => {
        const user = userEvent.setup();
        renderComponent();

        const initialCards = screen.getAllByTestId('notification-card');
        expect(initialCards.length).toBeGreaterThan(1);

        const firstCard = initialCards[0];
        const deleteBtn = within(firstCard).getByRole('button', { name: 'Eliminar' });
        await user.click(deleteBtn);

        await waitFor(() => {
            expect(screen.getAllByTestId('notification-card').length).toBe(initialCards.length - 1);
        });
    });
});