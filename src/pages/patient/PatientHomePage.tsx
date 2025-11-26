import { useAuth } from '../../context/AuthContext';
import { DashboardCard } from '../../components/dashboard/DashboardCard';
import { AppointmentPreview } from '../../components/dashboard/AppointmentPreview';
import { NotificationPreview } from '../../components/dashboard/NotificationPreview';
import { appointmentService } from '../../services/appointments/appointment_service';
import type { Appointment } from '../../types/appointments/appointment_types';
import { useEffect, useState } from 'react';

import {
    HiOutlinePlus,
    HiOutlineCalendar,
    HiOutlineBell,
    HiOutlineUser,
    HiOutlineArrowRight
} from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const formatAppointmentDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    return {
        day: date.getDate().toString(),
        month: months[date.getMonth()]
    };
};

export default function PatientHomePage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loadingAppointments, setLoadingAppointments] = useState(true);

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        setLoadingAppointments(true);
        try {
            const allAppointments = await appointmentService.getMyAppointments('SCHEDULED');
            const now = new Date();
            const upcoming = allAppointments
                .filter(apt => {
                    const aptDate = new Date(apt.appointmentDate);
                    return aptDate >= now;
                })
                .sort((a, b) => {
                    const dateA = new Date(a.appointmentDate + 'T' + a.startTime);
                    const dateB = new Date(b.appointmentDate + 'T' + b.startTime);
                    return dateA.getTime() - dateB.getTime();
                })
                .slice(0, 3);

            setAppointments(upcoming);
        } catch (error) {
            console.error('Error loading appointments:', error);
        }
        setLoadingAppointments(false);
    };

    if (!user) {
        return <div>Cargando...</div>;
    }

    const upcomingAppointments = appointments.map(apt => ({
        id: apt.id,
        doctorName: `Dr. ${apt.doctorProfile?.user.firstName} ${apt.doctorProfile?.user.lastName}`,
        specialty: apt.doctorProfile?.specialty.name || apt.specialty?.name || '',
        date: formatAppointmentDate(apt.appointmentDate),
        time: apt.startTime,
        status: 'Confirmada' as const,
    }));

    const recentNotifications: any[] = [];


    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Bienvenido, {user.firstName}
                </h1>
                <p className="text-gray-600">
                    Gestiona tus citas médicas y mantente al día con tu salud
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard
                    title="Agendar Cita"
                    description="Nueva cita médica"
                    icon={<HiOutlinePlus />}
                    to="/book-appointment"
                />
                <DashboardCard
                    title="Mis Citas"
                    description="Ver historial"
                    icon={<HiOutlineCalendar />}
                    to="/appointments"
                />
                <DashboardCard
                    title="Notificaciones"
                    description="Mensajes importantes"
                    icon={<HiOutlineBell />}
                    to="/notifications"
                />
                <DashboardCard
                    title="Mi Perfil"
                    description="Configuración"
                    icon={<HiOutlineUser />}
                    to="/profile"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 flex flex-col gap-4 p-6 bg-medical-50 border border-medical-200 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-medical-900">
                            Próximas Citas
                        </h3>
                        <button
                            onClick={() => navigate('/appointments')}
                            className="flex items-center gap-1 text-sm font-medium text-medical-600 hover:text-medical-800"
                        >
                            Ver Todas <HiOutlineArrowRight />
                        </button>
                    </div>


                    <div className="flex flex-col gap-3">
                        {loadingAppointments ? (
                            <div className="text-center py-6">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-medical-600"></div>
                                <p className="mt-2 text-gray-500 text-sm">Cargando citas...</p>
                            </div>
                        ) : upcomingAppointments.length > 0 ? (
                            upcomingAppointments.map((cita) => (
                                <AppointmentPreview key={cita.id} {...cita} />
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-6">
                                No tienes citas próximas. ¡Agenda una nueva cita!
                            </p>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-1 flex flex-col gap-3 p-6 bg-medical-50 border border-medical-200 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-medical-900">
                            Notificaciones
                        </h3>
                    </div>

                    <div className="flex flex-col gap-2">
                        {recentNotifications.length > 0 ? (
                            recentNotifications.map((notif) => (
                                <NotificationPreview key={notif.id} {...notif} />
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-6 text-sm">
                                No tienes notificaciones nuevas
                            </p>
                        )}
                    </div>

                    <button
                        onClick={() => navigate('/notifications')}
                        className="mt-4 w-full text-center text-sm font-medium text-medical-600 hover:text-medical-800"
                    >
                        Ver Todas
                    </button>
                </div>

            </div>
        </div>
    );
}