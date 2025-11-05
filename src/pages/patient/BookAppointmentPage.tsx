import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StepSelector } from '../../components/appointments/StepSelector';
import { Calendar } from '../../components/appointments/Calendar';
import { TimeSlotPicker } from '../../components/appointments/TimeSlotPicker';
import type { TimeSlot } from '../../components/appointments/TimeSlotPicker';
import { AppointmentSummary } from '../../components/appointments/AppointmentSummary';

import { FaUserMd, FaStethoscope, FaRegClock } from 'react-icons/fa';

// --- DATOS DE EJEMPLO (MOCK) ---
const MOCK_SPECIALTIES = ["Medicina General", "Cardiología", "Pediatría", "Dermatología"];
const MOCK_DOCTORS: Record<string, string[]> = {
    "Medicina General": ["Dr. María Rodríguez", "Dr. Luis Torres"],
    "Cardiología": ["Dr. Carlos Mendoza"],
    "Pediatría": ["Dra. Ana Silva"],
    "Dermatología": ["Dra. Laura Gómez"],
};

const MOCK_BLOCKED_SLOTS: { date: string; time: string }[] = [
    { date: '2025-11-04', time: '10:00' },
    { date: '2025-11-04', time: '14:30' },
];

// Función simulada de API para "consultar horarios disponibles"
const fetchAvailability = (doctorId: string, date: Date): Promise<TimeSlot[]> => {
    console.log(`Simulando fetch de disponibilidad para Dr. ${doctorId} en ${date.toDateString()}`);
    
    const allTimes = [
        "10:00", "10:30", "11:00", "11:30",
        "14:00", "14:30", "15:00", "15:30",
        "16:00", "16:30", "17:00", "17:30"
    ];

    const slots = allTimes.map(time => ({
        time,
        available: (Math.random() + date.getDate() + doctorId.length) > 5 
    }));

    return new Promise(resolve => {
        setTimeout(() => {
            resolve(slots);
        }, 800);
    });
};

export default function BookAppointmentPage() {
    const navigate = useNavigate();

    const [specialty, setSpecialty] = useState<string | null>(null);
    const [doctor, setDoctor] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [time, setTime] = useState<string | null>(null);

    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    const availableDoctors = specialty ? MOCK_DOCTORS[specialty] || [] : [];
    
    useEffect(() => {
        if (doctor && selectedDate) {
            setIsLoadingSlots(true);
            setAvailableSlots([]);
            setTime(null);

            fetchAvailability(doctor, selectedDate).then(slots => {
                const y = selectedDate.getFullYear();
                const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const d = String(selectedDate.getDate()).padStart(2, '0');
                const selectedKey = `${y}-${m}-${d}`;

                const merged = slots.map(s => {
                    const isBlocked = MOCK_BLOCKED_SLOTS.some(b => b.date === selectedKey && b.time === s.time);
                    return {
                        ...s,
                        available: isBlocked ? false : s.available
                    };
                });

                setAvailableSlots(merged);
                setIsLoadingSlots(false);
            });
        }
    }, [doctor, selectedDate]);

    const formattedDate = selectedDate
        ? selectedDate.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')
        : null;

    const handleConfirm = () => {
        console.log("Cita confirmada:", { specialty, doctor, formattedDate, time });
        navigate('/appointment-confirmation');
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Agendar Nueva Cita</h1>
                <p className="text-gray-600">
                    Selecciona la especialidad, médico, fecha y hora para tu cita
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-2 flex flex-col gap-6">
                    
                    <StepSelector
                        icon={<FaStethoscope />}
                        title="Especialidad"
                        description="Selecciona el tipo de consulta médica"
                    >
                        <select
                            value={specialty || ""}
                            onChange={(e) => {
                                setSpecialty(e.target.value);
                                setDoctor(null);
                                setTime(null);
                                setAvailableSlots([]);
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                        >
                            <option value="" disabled>Selecciona una especialidad</option>
                            {MOCK_SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </StepSelector>

                    <StepSelector
                        icon={<FaUserMd />}
                        title="Médico"
                        description="Selecciona el profesional de tu preferencia"
                    >
                        <select
                            value={doctor || ""}
                            onChange={(e) => setDoctor(e.target.value)}
                            disabled={!specialty}
                            className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                        >
                            <option value="" disabled>
                                {specialty ? "Selecciona un médico" : "Primero selecciona una especialidad"}
                            </option>
                            {availableDoctors.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </StepSelector>

                    <StepSelector
                        icon={<FaRegClock />}
                        title="Horario"
                        description="Selecciona la hora de tu preferencia"
                    >
                        {isLoadingSlots && (
                            <div className="text-sm text-gray-500">
                                Buscando horarios disponibles...
                            </div>
                        )}

                        {!isLoadingSlots && availableSlots.length > 0 && (
                            <TimeSlotPicker
                                slots={availableSlots}
                                selectedTime={time}
                                onTimeChange={setTime}
                            />
                        )}

                        {!isLoadingSlots && availableSlots.length === 0 && (
                             <p className="text-sm text-gray-500">
                                Selecciona un médico y una fecha para ver los horarios.
                            </p>
                        )}
                    </StepSelector>
                </div>
                
                <div className="lg:col-span-1 flex flex-col gap-6">
                    
                    <Calendar
                        selectedDate={selectedDate}
                        onDateChange={setSelectedDate}
                    />

                    <AppointmentSummary
                        specialty={specialty}
                        doctor={doctor}
                        date={formattedDate}
                        time={time}
                        onConfirm={handleConfirm}
                    />
                </div>
            </div>
        </div>
    );
}