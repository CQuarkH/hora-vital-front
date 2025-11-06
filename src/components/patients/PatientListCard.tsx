import React from 'react';
import { PatientStatusBadge } from './PatientStatusBadge';
import type { PatientStatus} from './PatientStatusBadge';
import { 
    HiOutlineCalendar, 
    HiOutlineDocumentText, 
    HiOutlinePencil, 
    HiOutlineUser 
} from 'react-icons/hi';

export interface PatientData {
    id: string;
    name: string;
    rut: string;
    phone: string;
    email: string;
    age: number;
    lastVisit: string;
    nextVisit: string;
    totalAppointments: number;
    status: PatientStatus;
}

interface PatientListCardProps {
    patient: PatientData;
}

export const PatientListCard: React.FC<PatientListCardProps> = ({ patient }) => {
    
    const initials = patient.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    return (
        <div className="flex items-center w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            
            <div className="w-10 h-10 rounded-full bg-medical-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                {initials}
            </div>

            <div className="flex-1 ml-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                
                <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                    <PatientStatusBadge status={patient.status} />
                </div>
                <div className="text-gray-500"><span className="font-medium text-gray-700">Edad:</span> {patient.age} años</div>
                <div className="text-gray-500"><span className="font-medium text-gray-700">RUT:</span> {patient.rut}</div>
                <div className="text-gray-500"><span className="font-medium text-gray-700">Email:</span> {patient.email}</div>
                <div className="text-gray-500"><span className="font-medium text-gray-700">Teléfono:</span> {patient.phone}</div>
                <div className="text-gray-500"><span className="font-medium text-gray-700">Última visita:</span> {patient.lastVisit}</div>
                <div className="text-gray-500"><span className="font-medium text-gray-700">Próxima cita:</span> {patient.nextVisit}</div>

            </div>

            <div className="flex-shrink-0 mx-6 text-center">
                <span className="text-2xl font-bold text-medical-700">{patient.totalAppointments}</span>
                <p className="text-xs text-gray-500">Citas totales</p>
            </div>

            <div className="flex-shrink-0 flex items-center gap-4 text-gray-500">
                <button className="hover:text-medical-700" title="Agendar Cita">
                    <HiOutlineCalendar className="h-5 w-5" />
                </button>
                <button className="hover:text-medical-700" title="Ver Historial">
                    <HiOutlineDocumentText className="h-5 w-5" />
                </button>
                <button className="hover:text-medical-700" title="Editar Paciente">
                    <HiOutlinePencil className="h-5 w-5" />
                </button>
                <button className="hover:text-medical-700" title="Ver Ficha">
                    <HiOutlineUser className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};