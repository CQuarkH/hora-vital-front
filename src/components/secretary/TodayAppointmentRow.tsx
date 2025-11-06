import React from 'react';
import { AppointmentStatusBadge } from '../appointments/AppointmentStatusBadge';
import type { AppointmentStatus } from '../appointments/AppointmentStatusBadge';
import { HiOutlinePencil, HiOutlineCalendar } from 'react-icons/hi';

// Tipo de dato para la fila
export interface TodayAppointment {
    id: string;
    time: string; // "08:30"
    patientName: string;
    appointmentType: 'Control' | 'Primera Vez' | 'Urgencia';
    rut: string;
    doctorInfo: string;
    status: AppointmentStatus;
}

interface TodayAppointmentRowProps {
    appointment: TodayAppointment;
}

export const TodayAppointmentRow: React.FC<TodayAppointmentRowProps> = ({ appointment }) => {
    return (
        <div className="grid grid-cols-10 gap-4 items-center p-4 bg-white border-b border-gray-200">
            
            <div className="col-span-1">
                <span className="font-semibold text-medical-800">{appointment.time}</span>
            </div>

            <div className="col-span-5">
                <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{appointment.patientName}</h4>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                        {appointment.appointmentType}
                    </span>
                </div>
                <p className="text-sm text-gray-500">RUT: {appointment.rut}</p>
                <p className="text-sm text-gray-500">{appointment.doctorInfo}</p>
            </div>

            <div className="col-span-2 flex justify-start">
                <AppointmentStatusBadge status={appointment.status} />
            </div>

            <div className="col-span-2 flex justify-end items-center gap-4 text-gray-500">
                <button className="hover:text-medical-700" title="Reprogramar Cita">
                    <HiOutlineCalendar className="h-5 w-5" />
                </button>
                <button className="hover:text-medical-700" title="Editar / Ver Ficha">
                    <HiOutlinePencil className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};