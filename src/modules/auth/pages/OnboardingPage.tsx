import { CiCalendar } from "react-icons/ci";
import { LuUsers } from "react-icons/lu";
import { IoShieldOutline } from "react-icons/io5";

function OnboardingPage() {
    return (
        <div className="flex flex-col w-full h-full items-center gap-20">
            <div className="flex flex-col gap-6 text-center max-w-xl">
                <h1 className="text-3xl font-bold">Gestión de Citas Médicas Simplificada</h1>
                <p className="max-w-lg">
                    Hora Vital facilita la gestión de citas médicas en centros de atención primaria, ofreciendo una experiencia intuitiva para pacientes y personal administrativo.
                </p>
            </div>

            <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-center">Características Principales</h2>
                <div className="flex w-full items-center gap-5">
                    {/* cards */}
                    <div className="flex flex-col gap-5 bg-green-100 p-4 rounded-lg border-2 border-green-200 shadow-md">
                        <CiCalendar className="text-4xl text-green-800" />
                        <div className="flex flex-col gap-1">
                            <h3 className="font-semibold">Agendamiento Fácil</h3>
                            <p className="text-sm text-black/70">Los pacientes pueden agendar citas de forma rápida y sencilla</p>
                        </div>

                    </div>
                    <div className="flex flex-col gap-5 bg-green-100 p-4 rounded-lg border-2 border-green-200 shadow-md">
                        <LuUsers className="text-4xl text-green-800" />
                        <div className="flex flex-col gap-1">
                            <h3 className="font-semibold">Gestión Administrativa</h3>
                            <p className="text-sm text-black/70">Personal administrativo puede gestionar horarios y disponibilidad</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-5 bg-green-100 p-4 rounded-lg border-2 border-green-200 shadow-md">
                        <IoShieldOutline className="text-4xl text-green-800" />
                        <div className="flex flex-col gap-1">
                            <h3 className="font-semibold">Seguro y Confiable</h3>
                            <p className="text-sm text-black/70">Información médica protegida con los más altos estándares de seguridad</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OnboardingPage