import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import Logo from "../../layouts/Logo"
import { Input } from "../../components/Input"
import BackToHome from "../../components/BackToHome"
import { useAuth } from "../../context/AuthContext"
import { useState } from "react"
import { formatRUT } from "../../utils/formatters"
import { Button } from "../../components/Button"

interface LoginFormValues {
    rut: string
    password: string
}

function LoginPage() {
    const navigate = useNavigate()
    const [error, setError] = useState<string | undefined>()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>()
    const { login } = useAuth();

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const response = await login(data);
            if (response.success) {
                navigate('/home');
            } else {
                setError(response.error);
            }

        } catch (err) {
            setError("Error al iniciar sesión. Por favor, verifica tus credenciales.")
        }
    }

    return (
        <div className="flex flex-col h-screen w-full justify-center items-center text-sm">
            <div className="flex flex-col gap-6 text-center w-full max-w-2xl">
                <div className="flex w-full justify-center">
                    <Logo />
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col bg-medical-50 border border-medical-200 shadow-sm p-8 rounded-xl gap-8 text-sm text-medical-900"
                >
                    <div className="flex flex-col gap-2 w-full text-left">
                        <h3 className="font-bold text-lg">Iniciar Sesión</h3>
                        <p>Ingresa tus credenciales para acceder a tu cuenta.</p>
                    </div>

                    <div className="flex flex-col gap-6 w-full">
                        <Input
                            label="RUT"
                            placeholder="Ej. 12.345.678-9"
                            error={errors.rut?.message}
                            formatter={formatRUT}
                            {...register("rut", {
                                required: "El RUT es obligatorio",
                                pattern: {
                                    value: /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/,
                                    message: "Formato de RUT inválido",
                                },
                            })}
                        />
                        <Input
                            label="Contraseña"
                            type="password"
                            placeholder="Ej. ********"
                            error={errors.password?.message}
                            {...register("password", {
                                required: "La contraseña es obligatoria",
                            })}
                        />
                    </div>

                    <div className="flex flex-col gap-3 w-full">
                        {error && <div className="text-red-600 font-semibold text-xs text-center">
                            {error}
                        </div>}
                        <Button isLoading={isSubmitting} type="submit">
                            Iniciar Sesión
                        </Button>

                        <div className="text-sm">
                            ¿No tienes una cuenta?{" "}
                            <span
                                onClick={() => navigate("/register")}
                                className="text-medical-700 font-semibold cursor-pointer"
                            >
                                Regístrate
                            </span>
                        </div>
                    </div>
                </form>
                <BackToHome />
            </div>
        </div>
    )
}

export default LoginPage
