import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ScheduleManagementPage from '../../../src/pages/secretary/ScheduleManagementPage';

vi.mock('../../../src/components/schedule/ScheduleDayRow', () => ({
    ScheduleDayRow: (props: any) => <div data-testid="schedule-day">{props.dayName}</div>
}));

vi.mock('../../../src/components/schedule/SchedulePreviewModal', () => ({
    SchedulePreviewModal: (props: any) => <div data-testid="schedule-preview">Preview</div>
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

        expect(screen.getByText('Gestión de Agenda')).toBeInTheDocument();
        expect(screen.getAllByTestId('schedule-day').length).toBeGreaterThan(0);

        const previewBtn = screen.getByText(/Ver Calendario \(Vista Previa\)/i);
        await user.click(previewBtn);
        expect(screen.getByTestId('schedule-preview')).toBeInTheDocument();
    });
});
