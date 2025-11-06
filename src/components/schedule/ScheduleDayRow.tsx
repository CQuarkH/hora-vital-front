import React, { useState, useEffect } from 'react';
import { ToggleSwitch } from '../shared/ToggleSwitch';
import { Input } from '../Input';
import clsx from 'clsx';

export interface DaySchedule {
    isActive: boolean;
    startTime: string;
    endTime: string;
    breakTime: string;
    slotDuration: number;
}

interface ScheduleDayRowProps {
    dayName: string;
    initialSchedule: DaySchedule;
    onChange: (dayName: string, newSchedule: DaySchedule) => void;
}

const durationOptions = [15, 20, 30, 45, 60];

export const ScheduleDayRow: React.FC<ScheduleDayRowProps> = ({ dayName, initialSchedule, onChange }) => {
    
    const [schedule, setSchedule] = useState<DaySchedule>(initialSchedule);

    useEffect(() => {
        setSchedule(initialSchedule);
    }, [initialSchedule]);

    const handleChange = (field: keyof DaySchedule, value: any) => {
        const newSchedule = { ...schedule, [field]: value };
        setSchedule(newSchedule);
        onChange(dayName, newSchedule);
    };

    return (
        <div className={clsx(
            "p-4 rounded-lg",
            schedule.isActive ? "bg-white border border-gray-200" : "bg-gray-100"
        )}>
            <div className="grid grid-cols-6 gap-4 items-center">
                <h4 className={clsx(
                    "font-semibold",
                    schedule.isActive ? "text-gray-900" : "text-gray-500"
                )}>
                    {dayName}
                </h4>

                <Input
                    label="Hora Inicio"
                    type="time"
                    value={schedule.startTime}
                    disabled={!schedule.isActive}
                    onChange={(e) => handleChange('startTime', e.target.value)}
                    className="bg-white"
                />

                <Input
                    label="Hora Fin"
                    type="time"
                    value={schedule.endTime}
                    disabled={!schedule.isActive}
                    onChange={(e) => handleChange('endTime', e.target.value)}
                    className="bg-white"
                />

                <Input
                    label="Descanso"
                    placeholder="Ej. 12:00-13:00"
                    value={schedule.breakTime}
                    disabled={!schedule.isActive}
                    onChange={(e) => handleChange('breakTime', e.target.value)}
                    className="bg-white"
                />

                <div className="flex flex-col gap-2 items-start w-full">
                    <label className={clsx(
                        "text-sm font-medium",
                        !schedule.isActive ? "opacity-70" : "opacity-100"
                    )}>
                        Duración Cita (min)
                    </label>
                    <select
                        value={schedule.slotDuration}
                        disabled={!schedule.isActive}
                        onChange={(e) => handleChange('slotDuration', parseInt(e.target.value, 10))}
                        className="p-2 w-full border-b border-gray-300 focus:border-primary outline-none"
                    >
                        {durationOptions.map(opt => (
                            <option key={opt} value={opt}>{opt} minutos</option>
                        ))}
                    </select>
                </div>
                
                <div className="flex justify-end items-center pt-5">
                    <ToggleSwitch
                        enabled={schedule.isActive}
                        onChange={(value) => handleChange('isActive', value)}
                    />
                </div>
            </div>
        </div>
    );
};