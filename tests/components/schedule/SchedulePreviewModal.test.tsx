import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SchedulePreviewModal } from '../../../src/components/schedule/SchedulePreviewModal';
import type { DaySchedule } from '../../../src/components/schedule/ScheduleDayRow';

vi.mock('../../../src/components/schedule/GeneratedSlotsPreview', () => ({
    GeneratedSlotsPreview: ({ schedule }: any) => (
        <div>MOCK_SLOTS {schedule?.startTime}</div>
    )
}));

vi.mock('../../../src/components/appointments/Calendar', () => ({
    Calendar: (_props: any) => (
        <button onClick={() => _props.onDateChange(new Date())}>Mock Calendar</button>
    )
}));

describe('SchedulePreviewModal', () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();

    const makeScheduleData = (sched: DaySchedule) => ({
        Domingo: sched,
        Lunes: sched,
        Martes: sched,
        'Miércoles': sched,
        Jueves: sched,
        Viernes: sched,
        Sábado: sched,
    });

    it('renders preview and generated slots when scheduleData contains the day', () => {
        const daySchedule: DaySchedule = {
            isActive: true,
            startTime: '09:00',
            endTime: '11:00',
            breakTime: '00:00-00:00',
            slotDuration: 30,
        };

        render(<SchedulePreviewModal scheduleData={makeScheduleData(daySchedule)} onClose={mockOnClose} />);

        expect(screen.getByText('Vista Previa de Horarios Generados')).toBeInTheDocument();
        expect(screen.getByText(/Horarios para el/)).toBeInTheDocument();
        expect(screen.getByText('MOCK_SLOTS 09:00')).toBeInTheDocument();
    });

    it('calls onClose when clicking Cerrar', async () => {
        const daySchedule: DaySchedule = {
            isActive: true,
            startTime: '09:00',
            endTime: '11:00',
            breakTime: '00:00-00:00',
            slotDuration: 30,
        };

        render(<SchedulePreviewModal scheduleData={makeScheduleData(daySchedule)} onClose={mockOnClose} />);

        await user.click(screen.getByRole('button', { name: 'Cerrar' }));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('shows a no-configuration message when scheduleData is empty', () => {
        render(<SchedulePreviewModal scheduleData={{}} onClose={mockOnClose} />);
        expect(screen.getByText('No hay configuración para este día.')).toBeInTheDocument();
    });
});