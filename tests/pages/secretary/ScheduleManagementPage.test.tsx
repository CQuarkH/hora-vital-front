import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ScheduleManagementPage from '../../../src/pages/secretary/ScheduleManagementPage';

vi.mock('../../../src/components/schedule/ScheduleDayRow', () => ({
    ScheduleDayRow: (props: any) => <div data-testid="schedule-day">{props.dayName}</div>
}));

vi.mock('../../../src/components/schedule/SchedulePreviewModal', () => ({
    SchedulePreviewModal: (props: any) => <div data-testid="schedule-preview">Preview</div>
}));

vi.mock('../../../src/services/appointments/appointment_service', () => ({
    appointmentService: {
        getDoctors: vi.fn().mockResolvedValue([
            {
                id: '1',
                user: { firstName: 'María', lastName: 'González' },
                specialty: { name: 'Cardiología' }
            },
            {
                id: '2',
                user: { firstName: 'Pedro', lastName: 'Rojas' },
                specialty: { name: 'Pediatría' }
            }
        ])
    }
}));

vi.mock('../../../src/services/secretary/secretaryService', () => ({
    secretaryService: {
        getDoctorAgenda: vi.fn().mockResolvedValue({
            schedules: [
                {
                    id: '1',
                    startTime: '09:00',
                    endTime: '17:00',
                    slotDuration: 30,
                    isActive: true
                }
            ],
            appointments: [],
            blockedPeriods: []
        }),
        updateSchedule: vi.fn().mockResolvedValue({}),
        blockPeriod: vi.fn().mockResolvedValue({}),
        unblockPeriod: vi.fn().mockResolvedValue({})
    }
}));

describe('ScheduleManagementPage', () => {
    beforeEach(() => vi.clearAllMocks());

    it('renderiza lista de días y permite abrir preview', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <ScheduleManagementPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Gestión de Agenda')).toBeInTheDocument();
        });

        const previewBtn = screen.getByText(/Ver Calendario/i);
        await user.click(previewBtn);

        await waitFor(() => {
            expect(screen.getByTestId('schedule-preview')).toBeInTheDocument();
        });
    });
});
