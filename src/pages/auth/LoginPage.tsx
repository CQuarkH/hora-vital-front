import Logo from "../../layouts/Logo"

function LoginPage() {
    return (
        <div className="flex flex-col h-screen w-full justify-center items-center">
            <div className="flex flex-col gap-6 text-center">
                <div className="flex w-full justify-center">
                    <Logo />
                </div>
                <div className="flex flex-col bg-medical-50 border border-medical-200 shadow-sm p-8 rounded-xl gap-8 text-sm text-medical-900">
                    <div className="flex flex-col gap-2 w-full text-left">
                        <h3 className="font-bold">Iniciar Sesión</h3>
                        <p>Ingresa tus credenciales para acceder a tu cuenta.</p>
                    </div>

                    <div className="flex flex-col gap-6 w-full">
                        <div className="flex flex-col gap-2 items-start w-full">
                            <span>RUT</span>
                            <input type="text" placeholder="Ej. 12.345.678-9" className="p-2 border-b border-gray-300 w-full outline-none" />
                        </div>

                        <div className="flex flex-col gap-2 items-start w-full">
                            <span>Contraseña</span>
                            <input type="password" placeholder="********" className="p-2 border-b border-gray-300 w-full outline-none" />
                        </div>
                    </div>


                    <button className="mt-4 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800">Ingresar</button>

                    <div className="text-sm">
                        ¿No tienes una cuenta? <a href="/register" className="text-green-700 font-semibold">Regístrate</a>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default LoginPage