import { useNavigate } from "react-router-dom"
import Logo from "../../layouts/Logo"
import { Input } from "../../components/Input"

function RegisterPage() {
    const navigate = useNavigate()
    return (
        <div className="flex flex-col h-screen w-full justify-center items-center text-sm">
            <div className="flex flex-col gap-3 text-center w-full max-w-3xl">
                <div className="flex w-full justify-center">
                    <Logo />
                </div>
                <div className="flex flex-col bg-medical-50 border border-medical-200 shadow-sm p-6 rounded-xl gap-8 text-sm text-medical-900">
                    <div className="flex flex-col gap-2 w-full text-left">
                        <h3 className="font-bold text-lg">Registro de Paciente</h3>
                        <p>Ingresa tus datos personales para registrarte en el sistema</p>
                    </div>


                    {/* Sección de información personal */}
                    <div className="flex flex-col gap-6 w-full text-left">
                        <h3 className="font-semibold">Información Personal</h3>
                        <div className="flex gap-3 items-center">
                            <Input label="Nombre" placeholder="Ej. Juan" />
                            <Input label="Apellido" placeholder="Ej. Pérez" />
                        </div>
                        <div className="flex gap-3 items-center">
                            <Input label="RUT" placeholder="Ej. 12.345.678-9" />
                            <Input label="Fecha de Nacimiento" placeholder="Ej. 01/01/2000" />
                        </div>


                    </div>

                    {/* Sección de contacto */}
                    <div className="flex flex-col gap-6 w-full text-left">
                        <h3 className="font-semibold">Información de Contacto</h3>
                        <div className="flex gap-3 items-center">
                            <Input label="Correo" placeholder="Ej. juan@ejemplo.com" />
                            <Input label="Teléfono" placeholder="Ej. +56 9 1234 5678" />
                        </div>



                    </div>

                    {/* Sección de credenciales */}
                    <div className="flex flex-col gap-6 w-full text-left">
                        <h3 className="font-semibold">Credenciales</h3>
                        <div className="flex flex-col gap-3 items-center">
                            <Input label="Contraseña" placeholder="Ej. ********" />
                            <Input label="Repetir Contraseña" placeholder="Ej. ********" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full">
                        <button className="mt-4 bg-medical-700 text-white px-4 py-3 rounded-lg hover:bg-green-800">Registrarse</button>

                        <div className="text-sm">
                            ¿Ya tienes una cuenta? <span onClick={() => navigate('/login')} className="text-medical-700 font-semibold cursor-pointer">Inicia Sesión</span>
                        </div>
                    </div>

                </div>
            </div>

        </div>


    )
}

export default RegisterPage