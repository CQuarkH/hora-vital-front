import { useNavigate } from "react-router-dom"
import Logo from "../../layouts/Logo"
import { Input } from "../../components/Input"
import BackToHome from "../../components/BackToHome";

function LoginPage() {
    const navigate = useNavigate()
    return (
        <div className="flex flex-col h-screen w-full justify-center items-center text-sm">
            <div className="flex flex-col gap-6 text-center w-full max-w-2xl">
                <div className="flex w-full justify-center">
                    <Logo />
                </div>
                <div className="flex flex-col bg-medical-50 border border-medical-200 shadow-sm p-8 rounded-xl gap-8 text-sm text-medical-900">
                    <div className="flex flex-col gap-2 w-full text-left">
                        <h3 className="font-bold text-lg">Iniciar Sesión</h3>
                        <p>Ingresa tus credenciales para acceder a tu cuenta.</p>
                    </div>

                    <div className="flex flex-col gap-6 w-full">
                        <Input label="RUT" placeholder="Ej. 12.345.678-9" />
                        <Input label="Contraseña" type="password" placeholder="Ej. ********" />
                    </div>


                    <div className="flex flex-col gap-3 w-full">
                        <button className="mt-4 bg-medical-700 text-white px-4 py-2 rounded-lg hover:bg-medical-800">Ingresar</button>

                        <div className="text-sm">
                            ¿No tienes una cuenta? <span onClick={() => navigate('/register')} className="text-medical-700 font-semibold cursor-pointer">Regístrate</span>
                        </div>
                    </div>
                </div>
                <BackToHome />
            </div>
        </div>

    )
}

export default LoginPage