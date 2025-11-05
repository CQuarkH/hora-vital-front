import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppointmentStatusBadge } from '../../components/appointments/AppointmentStatusBadge';
import type { AppointmentStatus  } from '../../components/appointments/AppointmentStatusBadge';
import { CancelAppointmentModal } from '../../components/appointments/CancelAppointmentModal';

import { 
    HiOutlineCalendar, 
    HiOutlineClock, 
    HiOutlineLocationMarker, 
    HiOutlinePhone,
    HiOutlineUser,
    HiOutlineClipboardList,
    HiOutlineArrowLeft
} from 'react-icons/hi';

// --- DATOS DE EJEMPLO (MOCK) ---
const MOCK_APPOINTMENT_DETAIL = {
    id: 'APT-2024-001',
    doctorName: 'Dr. María Rodríguez',
    specialty: 'Medicina General',
    status: 'Confirmada' as AppointmentStatus,
    date: 'domingo, 14 de enero de 2024',
    time: '10:30',
    location: 'CESFAM San Juan',
    address: 'Av Libertador 1234, Santiago',
    phone: '+56 2 2345 6789',
    notes: 'Control de rutina. Traer exámenes de sangre si los tiene.'
};

export default function AppointmentDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [showCancelModal, setShowCancelModal] = useState(false);
    
    const appointment = MOCK_APPOINTMENT_DETAIL;
    const isLoading = false;

    // Lógica para manejar la confirmación de cancelación
    const handleCancelConfirm = (reason: string) => {
        setShowCancelModal(false);
        alert(`Cita ${id} cancelada. Razón: ${reason}`);
        navigate('/appointments'); 
    };
    
    // No mostrar el botón de cancelar si la cita ya pasó o está cancelada
    const canCancel = appointment.status === 'Confirmada' || appointment.status === 'Pendiente';

    if (isLoading) {
        return <div>Cargando detalle de la cita...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <button 
                onClick={() => navigate('/appointments')} 
                className="flex items-center gap-1 text-sm font-medium text-medical-600 hover:text-medical-800 mb-4"
            >
                <HiOutlineArrowLeft />
                Volver a Mis Citas
            </button>

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Detalle de Cita Médica</h1>
                    <p className="text-gray-600">
                        Confirmación: {appointment.id}
                    </p>
                </div>
                <AppointmentStatusBadge status={appointment.status} />
            </div>

            <div className="bg-medical-50 border border-medical-200 rounded-xl shadow-sm p-6">
                
                <h3 className="text-lg font-semibold text-medical-800 mb-4">Información de la Cita</h3>

                <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
                    <div className="flex items-center gap-3">
                        <HiOutlineUser className="text-2xl text-medical-700" />
                        <div>
                            <h4 className="font-bold text-medical-900">{appointment.doctorName}</h4>
                            <p className="text-sm text-gray-600">{appointment.specialty}</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t">
                        <div className="flex items-center gap-3">
                            <HiOutlineCalendar className="text-2xl text-medical-700" />
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{appointment.date}</p>
                                <p className="text-xs text-gray-500">Fecha de la cita</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-3">
                            <HiOutlineClock className="text-2xl text-medical-700" />
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{appointment.time}</p>
                                <p className="text-xs text-gray-500">Hora de la cita</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 mt-4">
                    <div className="p-4 bg-white rounded-lg border border-gray-200 flex items-center gap-3">
                        <HiOutlineLocationMarker className="text-2xl text-medical-700" />
                        <div>
                            <p className="text-sm font-semibold text-gray-900">{appointment.location}</p>
                            <p className="text-xs text-gray-500">{appointment.address}</p>
                        </div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-gray-200 flex items-center gap-3">
                        <HiOutlinePhone className="text-2xl text-medical-700" />
                        <div>
                            <p className="text-sm font-semibold text-gray-900">{appointment.phone}</p>
                            <p className="text-xs text-gray-500">Teléfono del centro médico</p>
                        </div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-gray-200 flex items-center gap-3">
                        <HiOutlineClipboardList className="text-2xl text-medical-700" />
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Notas de la cita</p>
                            <p className="text-xs text-gray-500">{appointment.notes}</p>
                        </div>
                    </div>
                </div>

            </div>

            <div className="flex justify-between items-center mt-8">
                {canCancel ? (
                     <button
                        onClick={() => setShowCancelModal(true)}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                    >
                        Cancelar Cita
                    </button>
                ) : (
                    <div></div>
                )}

                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/appointments')}
                        className="px-6 py-2 bg-white border border-medical-300 text-medical-800 rounded-lg font-medium"
                    >
                        Ver Todas las Citas
                    </button>
                    <button
                        onClick={() => navigate('/home')}
                        className="px-6 py-2 bg-medical-700 text-white rounded-lg font-medium"
                    >
                        Ir al Dashboard
                    </button>
                </div>
            </div>

            {showCancelModal && (
                <CancelAppointmentModal
                    appointmentId={appointment.id}
                    onClose={() => setShowCancelModal(false)}
                    onConfirm={handleCancelConfirm}
                />
            )}
        </div>
    );
}