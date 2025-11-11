import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import Logo from "../../layouts/Logo"
import { Input } from "../../components/Input"
import { useAuth } from "../../context/AuthContext"
import { formatPhoneNumber, formatRUT } from "../../utils/formatters"
import { isValidRUT } from "../../utils/validators"
import { useState } from "react"
import { Button } from "../../components/Button"

interface RegisterFormValues {
    firstName: string
    lastName: string
    rut: string
    birthDate: string
    email: string
    phone: string
    password: string
    confirmPassword: string
}

function RegisterPage() {
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>()
    const [gError, setGError] = useState<string | null>(null);

    const { register: registerUser } = useAuth();

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            setGError(null)

            console.log('Enviando datos de registro:', data)

            await new Promise((resolve) => setTimeout(resolve, 1500)); // Simular retardo de red
            const response = await registerUser(data)

            console.log('Respuesta del registro:', response)

            if (response.success) {
                navigate('/home')
            } else {
                setGError(response.error || "Error al registrar usuario")
            }
        } catch (error: any) {
            console.error('Error en onSubmit:', error)
            setGError('Error inesperado al registrar usuario')
        }
    }

    const password = watch("password")

    return (
        <div className="flex flex-col h-screen w-full justify-center items-center text-sm">
            <div className="flex flex-col gap-3 text-center w-full max-w-3xl">
                <div className="flex w-full justify-center">
                    <Logo />
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col bg-medical-50 border border-medical-200 shadow-sm p-6 rounded-xl gap-8 text-sm text-medical-900"
                >
                    {/* Información Personal */}
                    <div className="flex flex-col gap-6 w-full text-left">
                        <h3 className="font-semibold">Información Personal</h3>
                        <div className="flex gap-3 items-center">
                            <Input
                                label="Nombre"
                                placeholder="Ej. Juan"
                                error={errors.firstName?.message}
                                {...register("firstName", {
                                    required: "El nombre es obligatorio",
                                })}
                            />
                            <Input
                                label="Apellido"
                                placeholder="Ej. Pérez"
                                error={errors.lastName?.message}
                                {...register("lastName", {
                                    required: "El apellido es obligatorio",
                                })}
                            />
                        </div>
                        <div className="flex gap-3 items-center">
                            <Input
                                label="RUT"
                                placeholder="Ej. 12.345.678-9"
                                formatter={formatRUT}
                                error={errors.rut?.message}
                                {...register("rut", {
                                    required: "El RUT es obligatorio",
                                    pattern: {
                                        value: /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/,
                                        message: "Formato de RUT inválido",
                                    }, validate: (value) =>
                                        isValidRUT(value) || "El RUT ingresado no es válido",

                                })}
                            />
                            <Input
                                label="Fecha de Nacimiento"
                                type="date"
                                error={errors.birthDate?.message}
                                {...register("birthDate", {
                                    required: "La fecha de nacimiento es obligatoria",
                                })}
                            />
                        </div>
                    </div>

                    {/* Información de Contacto */}
                    <div className="flex flex-col gap-6 w-full text-left">
                        <h3 className="font-semibold">Información de Contacto</h3>
                        <div className="flex gap-3 items-center">
                            <Input
                                label="Correo"
                                placeholder="Ej. juan@ejemplo.com"
                                error={errors.email?.message}
                                {...register("email", {
                                    required: "El correo es obligatorio",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Correo inválido",
                                    },
                                })}
                            />
                            <Input
                                label="Teléfono"
                                placeholder="Ej. +56 9 1234 5678"
                                error={errors.phone?.message}
                                formatter={formatPhoneNumber}
                                {...register("phone", {
                                    required: "El teléfono es obligatorio",
                                })}
                            />
                        </div>
                    </div>

                    {/* Credenciales */}
                    <div className="flex flex-col gap-6 w-full text-left">
                        <h3 className="font-semibold">Credenciales</h3>
                        <div className="flex flex-col gap-3 items-center">
                            <Input
                                label="Contraseña"
                                type="password"
                                error={errors.password?.message}
                                {...register("password", {
                                    required: "La contraseña es obligatoria",
                                    minLength: {
                                        value: 6,
                                        message: "Debe tener al menos 6 caracteres",
                                    },
                                })}
                            />
                            <Input
                                label="Repetir Contraseña"
                                type="password"
                                error={errors.confirmPassword?.message}
                                {...register("confirmPassword", {
                                    required: "Debe repetir la contraseña",
                                    validate: (value) =>
                                        value === password ||
                                        "Las contraseñas no coinciden",
                                })}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full">
                        {gError && (
                            <div className="text-red-600 font-semibold text-xs text-center">
                                {gError}
                            </div>
                        )}
                        <Button isLoading={isSubmitting} type="submit">
                            Registrarse
                        </Button>

                        <div className="text-sm">
                            ¿Ya tienes una cuenta?{" "}
                            <span
                                onClick={() => navigate("/login")}
                                className="text-medical-700 font-semibold cursor-pointer"
                            >
                                Inicia Sesión
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterPage
