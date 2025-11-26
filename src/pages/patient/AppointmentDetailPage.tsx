import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppointmentStatusBadge } from '../../components/appointments/AppointmentStatusBadge';
import type { AppointmentStatus } from '../../components/appointments/AppointmentStatusBadge';
import { CancelAppointmentModal } from '../../components/appointments/CancelAppointmentModal';
import { appointmentService } from '../../services/appointments/appointment_service';
import type { Appointment as APIAppointment } from '../../types/appointments/appointment_types';
import toast from 'react-hot-toast';

import {
    HiOutlineCalendar,
    HiOutlineClock,
    HiOutlineLocationMarker,
    HiOutlinePhone,
    HiOutlineUser,
    HiOutlineClipboardList,
    HiOutlineArrowLeft
} from 'react-icons/hi';

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    const dayName = days[date.getDay()];
    const dayNum = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayName}, ${dayNum} de ${monthName} de ${year}`;
};

export default function AppointmentDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [appointment, setAppointment] = useState<APIAppointment | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadAppointmentDetail();
    }, [id]);

    const loadAppointmentDetail = async () => {
        if (!id) return;

        setIsLoading(true);
        try {
            const appointments = await appointmentService.getMyAppointments();
            const found = appointments.find(apt => apt.id === id);

            if (found) {
                setAppointment(found);
            } else {
                toast.error('Cita no encontrada');
                navigate('/appointments');
            }
        } catch (error) {
            console.error('Error loading appointment:', error);
            toast.error('Error al cargar la cita');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelConfirm = async (reason: string) => {
        if (!id) return;

        try {
            await appointmentService.cancelAppointment(id, reason);
            toast.success('Cita cancelada exitosamente');
            setShowCancelModal(false);
            navigate('/appointments');
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            toast.error('Error al cancelar la cita');
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-medical-600"></div>
                    <p className="mt-4 text-gray-600">Cargando detalle de la cita...</p>
                </div>
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="max-w-4xl mx-auto">
                <p className="text-center text-gray-500 py-12">Cita no encontrada</p>
            </div>
        );
    }

    let status: AppointmentStatus = 'Pendiente';
    if (appointment.status === 'SCHEDULED') status = 'Confirmada';
    if (appointment.status === 'CANCELLED') status = 'Cancelada';
    if (appointment.status === 'COMPLETED') status = 'Completada';
    if (appointment.status === 'NO_SHOW') status = 'Cancelada';

    const canCancel = status === 'Confirmada' || status === 'Pendiente';

    const doctorName = `Dr. ${appointment.doctorProfile.user.firstName} ${appointment.doctorProfile.user.lastName}`;
    const specialtyName = appointment.specialty?.name || appointment.doctorProfile.specialty?.name || 'General';
    const formattedDate = formatDate(appointment.appointmentDate);

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
                <AppointmentStatusBadge status={status} />
            </div>

            <div className="bg-medical-50 border border-medical-200 rounded-xl shadow-sm p-6">

                <h3 className="text-lg font-semibold text-medical-800 mb-4">Información de la Cita</h3>

                <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
                    <div className="flex items-center gap-3">
                        <HiOutlineUser className="text-2xl text-medical-700" />
                        <div>
                            <h4 className="font-bold text-medical-900">{doctorName}</h4>
                            <p className="text-sm text-gray-600">{specialtyName}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t">
                        <div className="flex items-center gap-3">
                            <HiOutlineCalendar className="text-2xl text-medical-700" />
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{formattedDate}</p>
                                <p className="text-xs text-gray-500">Fecha de la cita</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <HiOutlineClock className="text-2xl text-medical-700" />
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{appointment.startTime}</p>
                                <p className="text-xs text-gray-500">Hora de la cita</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 mt-4">
                    <div className="p-4 bg-white rounded-lg border border-gray-200 flex items-center gap-3">
                        <HiOutlineLocationMarker className="text-2xl text-medical-700" />
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Centro Médico Hora Vital</p>
                            <p className="text-xs text-gray-500">Av Libertador 1234, Santiago</p>
                        </div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-gray-200 flex items-center gap-3">
                        <HiOutlinePhone className="text-2xl text-medical-700" />
                        <div>
                            <p className="text-sm font-semibold text-gray-900">+56 2 2345 6789</p>
                            <p className="text-xs text-gray-500">Teléfono del centro médico</p>
                        </div>
                    </div>
                    {appointment.notes && (
                        <div className="p-4 bg-white rounded-lg border border-gray-200 flex items-center gap-3">
                            <HiOutlineClipboardList className="text-2xl text-medical-700" />
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Notas de la cita</p>
                                <p className="text-xs text-gray-500">{appointment.notes}</p>
                            </div>
                        </div>
                    )}
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