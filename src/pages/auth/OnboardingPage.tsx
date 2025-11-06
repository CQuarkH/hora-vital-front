import { useNavigate } from 'react-router-dom';
import { HiOutlineCalendar, HiOutlineUsers, HiOutlineShieldCheck, HiOutlineArrowRight } from 'react-icons/hi';
import { FaNotesMedical } from 'react-icons/fa';

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
    <div className="flex flex-col gap-4 bg-medical-50 p-6 rounded-xl border border-medical-100 shadow-sm">
        <div className="text-3xl text-medical-600">
            {icon}
        </div>
        <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    </div>
);

function OnboardingPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col w-full h-full items-center gap-20 py-12">
            
            <div className="flex flex-col gap-8 text-center max-w-2xl">
                <h1 className="text-5xl font-bold text-gray-900">
                    Gestión de Citas Médicas Simplificada
                </h1>
                <p className="text-lg text-gray-600 max-w-xl mx-auto">
                    Hora Vital facilita la gestión de citas médicas en centros de atención
                    primaria, ofreciendo una experiencia intuitiva para pacientes y personal
                    administrativo.
                </p>
                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onClick={() => navigate('/login/form')}
                        className="flex items-center gap-2 px-6 py-3 bg-medical-700 text-white rounded-lg font-semibold hover:bg-medical-800 transition-colors"
                    >
                        <FaNotesMedical />
                        Agendar Cita
                    </button>
                    <button
                        onClick={() => navigate('/login/form')}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        Acceso Administrativo
                        <HiOutlineArrowRight />
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-6 max-w-5xl">
                <h2 className="text-3xl font-bold text-center">
                    Características Principales
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 w-full items-center gap-6 mt-4">
                    <FeatureCard
                        icon={<HiOutlineCalendar />}
                        title="Agendamiento Fácil"
                        description="Los pacientes pueden agendar citas de forma rápida y sencilla"
                    />
                    <FeatureCard
                        icon={<HiOutlineUsers />}
                        title="Gestión Administrativa"
                        description="Personal administrativo puede gestionar horarios y disponibilidad"
                    />
                    <FeatureCard
                        icon={<HiOutlineShieldCheck />}
                        title="Seguro y Confiable"
                        description="Información médica protegida con los más altos estándares de seguridad"
                    />
                </div>
            </div>
        </div>
    );
}

export default OnboardingPage;