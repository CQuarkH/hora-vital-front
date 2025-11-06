import React from 'react';
import type { DaySchedule } from './ScheduleDayRow';

interface GeneratedSlotsPreviewProps {
    schedule: DaySchedule;
}

const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

const minutesToTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60).toString().padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
};

const generateSlots = (schedule: DaySchedule): string[] => {
    if (!schedule.isActive) {
        return [];
    }
    
    const slots: string[] = [];
    const start = timeToMinutes(schedule.startTime);
    const end = timeToMinutes(schedule.endTime);
    const duration = schedule.slotDuration;
    
    const [breakStart, breakEnd] = schedule.breakTime.split('-').map(timeToMinutes);
    
    let current = start;
    
    while (current + duration <= end) {
        const slotEnd = current + duration;
        const isOverlap = current < breakEnd && slotEnd > breakStart;
        
        if (!isOverlap) {
            slots.push(minutesToTime(current));
        }
        
        current += duration;
    }
    
    return slots;
};

export const GeneratedSlotsPreview: React.FC<GeneratedSlotsPreviewProps> = ({ schedule }) => {
    if (!schedule.isActive) {
        return <p className="text-sm text-gray-500">El médico no atiende este día.</p>;
    }

    const slots = generateSlots(schedule);

    return (
        <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
            {slots.length > 0 ? (
                slots.map(slot => (
                    <span 
                        key={slot}
                        className="bg-medical-100 text-medical-800 text-sm font-medium px-3 py-1 rounded-full"
                    >
                        {slot}
                    </span>
                ))
            ) : (
                <p className="text-sm text-gray-500">No se generaron horarios. Revisa la configuración.</p>
            )}
        </div>
    );
};