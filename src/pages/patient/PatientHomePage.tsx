import { useAuth } from '../../context/AuthContext';
import { DashboardCard } from '../../components/dashboard/DashboardCard';
import { AppointmentPreview } from '../../components/dashboard/AppointmentPreview';
import { NotificationPreview } from '../../components/dashboard/NotificationPreview';

import { 
    HiOutlinePlus, 
    HiOutlineCalendar, 
    HiOutlineBell, 
    HiOutlineUser, 
    HiOutlineArrowRight
} from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

export default function PatientHomePage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return <div>Cargando...</div>; // O un spinner
    }

    // --- DATOS DE EJEMPLO (MOCK) ---
    const upcomingAppointments = [
        {
            id: '1',
            doctorName: 'Dr. María Rodríguez',
            specialty: 'Medicina General',
            date: { day: '14', month: 'ene' },
            time: '10:30',
            status: 'Confirmada' as const,
        },
        {
            id: '2',
            doctorName: 'Dr. Carlos Mendoza',
            specialty: 'Cardiología',
            date: { day: '21', month: 'ene' },
            time: '14:00',
            status: 'Pendiente' as const,
        },
    ];

    const recentNotifications = [
        {
            id: '1',
            title: 'Recordatorio: Cita médica mañana a las 10:30',
            timeAgo: 'Hace 2 horas',
        },
        {
            id: '2',
            title: 'Tu cita del 22 de enero ha sido confirmada',
            timeAgo: 'Hace 1 día',
        },
    ];


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
                        {upcomingAppointments.map((cita) => (
                            <AppointmentPreview key={cita.id} {...cita} />
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-1 flex flex-col gap-3 p-6 bg-medical-50 border border-medical-200 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-medical-900">
                            Notificaciones
                        </h3>
                    </div>

                    <div className="flex flex-col gap-2">
                        {recentNotifications.map((notif) => (
                            <NotificationPreview key={notif.id} {...notif} />
                        ))}
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