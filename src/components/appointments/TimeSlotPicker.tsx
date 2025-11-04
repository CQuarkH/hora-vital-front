import React from 'react';
import clsx from 'clsx';

export interface TimeSlot {
    time: string;
    available: boolean;
}

interface TimeSlotPickerProps {
    slots: TimeSlot[];
    selectedTime: string | null;
    onTimeChange: (time: string) => void;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ 
    slots, 
    selectedTime, 
    onTimeChange 
}) => {
    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {slots.map((slot) => (
                <button
                    type="button"
                    key={slot.time}
                    disabled={!slot.available}
                    onClick={() => onTimeChange(slot.time)}
                    className={clsx(
                        "p-2 rounded-lg border text-sm font-medium transition-colors",
                        
                        slot.available && selectedTime !== slot.time &&
                        "bg-white text-medical-800 border-medical-300 hover:bg-medical-100",

                        slot.available && selectedTime === slot.time &&
                        "bg-medical-600 text-white border-medical-700",

                        !slot.available &&
                        "bg-gray-100 text-gray-400 border-gray-200 line-through cursor-not-allowed"
                    )}
                >
                    {slot.time}
                </button>
            ))}
        </div>
    );
};