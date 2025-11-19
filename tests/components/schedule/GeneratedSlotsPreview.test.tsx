import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GeneratedSlotsPreview } from '../../../src/components/schedule/GeneratedSlotsPreview';
import type { DaySchedule } from '../../../src/components/schedule/ScheduleDayRow';

describe('GeneratedSlotsPreview', () => {
    const activeSchedule: DaySchedule = {
        isActive: true,
        startTime: '09:00',
        endTime: '11:00',
        breakTime: '00:00-00:00',
        slotDuration: 30,
    };

    const inactiveSchedule: DaySchedule = {
        isActive: false,
        startTime: '09:00',
        endTime: '11:00',
        breakTime: '00:00-00:00',
        slotDuration: 30,
    };

    it('renders generated time slots for an active schedule', () => {
        render(<GeneratedSlotsPreview schedule={activeSchedule} />);

        expect(screen.getByText('09:00')).toBeInTheDocument();
        expect(screen.getByText('09:30')).toBeInTheDocument();
        expect(screen.getByText('10:00')).toBeInTheDocument();
        expect(screen.getByText('10:30')).toBeInTheDocument();
    });

    it('shows a message when the doctor is not active that day', () => {
        render(<GeneratedSlotsPreview schedule={inactiveSchedule} />);

        expect(screen.getByText('El médico no atiende este día.')).toBeInTheDocument();
    });
});