import React from "react";
import { useForm } from "react-hook-form";
import { CiUser, CiMail } from "react-icons/ci";
import { Input } from "../../components/Input";
import { useAuth } from "../../context/AuthContext";
import { formatPhoneNumber } from "../../utils/formatters";
import toast from "react-hot-toast";

interface ProfileFormData {
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    email: string;
}

export default function ProfilePage() {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            address: user?.address || "",
            phone: user?.phone || "",
            email: user?.email || ""
        }
    });

    const onSubmit = async (data: ProfileFormData) => {
        try {
            setIsLoading(true);
            setMessage(null);

            const result = await updateProfile({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                address: data.address,
            });

            if (result.success) {
                toast.success('Perfil actualizado con éxito');
                setIsEditing(false);

                // Actualizar formulario con datos frescos del servidor
                reset({
                    firstName: result.data?.firstName || data.firstName,
                    lastName: result.data?.lastName || data.lastName,
                    address: result.data?.address || data.address,
                    phone: result.data?.phone || data.phone,
                    email: result.data?.email || data.email,
                });
            } else {
                toast.error(result.error || 'Error al actualizar perfil');
            }
        } catch (error: any) {
            console.error('Error al actualizar perfil:', error);
            toast.error(error.message || 'Error de conexión con el servidor');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        // Restaurar valores originales del usuario
        reset({
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            address: user?.address || "",
            phone: user?.phone || "",
            email: user?.email || ""
        });
        setIsEditing(false);
        setMessage(null);
    };

    // Auto-hide success message after 3 seconds
    React.useEffect(() => {
        if (message?.type === 'success') {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    // Sincronizar formulario con cambios en el usuario del contexto
    React.useEffect(() => {
        if (user && !isEditing) {
            reset({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                address: user.address || "",
                phone: user.phone || "",
                email: user.email || ""
            });
        }
    }, [user, isEditing, reset]);

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-600">Cargando perfil...</div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto px-8 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
                    <p className="text-gray-600">
                        Gestiona tu información personal y preferencias
                    </p>
                </div>

                {!isEditing ? (
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-medical-600 text-white rounded-lg font-medium hover:bg-medical-700 transition"
                    >
                        Editar Perfil
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isLoading}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-medical-600 text-white rounded-lg font-medium hover:bg-medical-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                )}
            </div>

            {/* Información Personal */}
            <section className="mb-6 bg-medical-100 border border-medical-200 rounded-xl shadow-xs p-6">
                <div className="flex items-center gap-2 mb-3">
                    <CiUser className="text-medical-900 text-xl" />
                    <h2 className="text-lg font-semibold text-medical-800">
                        Información Personal
                    </h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                    Datos básicos de tu cuenta
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="RUT"
                        value={user.rut}
                        disabled
                    />
                    <Input
                        label="Fecha de Nacimiento"
                        value={user.birthDate ? new Date(user.birthDate).toLocaleDateString() : 'No especificado'}
                        disabled
                    />
                    <Input
                        label="Nombres"
                        {...register("firstName", {
                            required: "Los nombres son requeridos",
                            minLength: {
                                value: 2,
                                message: "El nombre debe tener al menos 2 caracteres"
                            }
                        })}
                        disabled={!isEditing}
                        error={errors.firstName?.message}
                    />
                    <Input
                        label="Apellidos"
                        {...register("lastName", {
                            required: "Los apellidos son requeridos",
                            minLength: {
                                value: 2,
                                message: "El apellido debe tener al menos 2 caracteres"
                            }
                        })}
                        disabled={!isEditing}
                        error={errors.lastName?.message}
                    />
                    <Input
                        label="Género"
                        value={user.gender || 'No especificado'}
                        disabled
                    />
                    <Input
                        value={user.address}
                        label="Dirección"
                        {...register("address", {
                            required: "La dirección es requerida"
                        })}
                        disabled={!isEditing}
                        error={errors.address?.message}
                    />
                </div>
            </section>

            {/* Información de Contacto */}
            <section className="bg-medical-100 border border-medical-200 rounded-xl shadow-xs p-6">
                <div className="flex items-center gap-2 mb-3">
                    <CiMail className="text-medical-900 text-xl" />
                    <h2 className="text-lg font-semibold text-medical-800">
                        Información de Contacto
                    </h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                    Datos para comunicarnos contigo
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Correo Electrónico"
                        type="email"
                        {...register("email", {
                            required: "El correo es requerido",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Correo electrónico inválido"
                            }
                        })}
                        disabled={!isEditing}
                        error={errors.email?.message}
                    />
                    <Input
                        label="Teléfono"
                        {...register("phone", {
                            required: "El teléfono es requerido",
                            pattern: {
                                value: /^\+?56\s?9\s?\d{4}\s?\d{4}$/,
                                message: "Formato de teléfono inválido (ej: +56 9 1234 5678)"
                            }
                        })}
                        formatter={formatPhoneNumber}
                        disabled={!isEditing}
                        error={errors.phone?.message}
                    />
                    <Input
                        label="Contacto de Emergencia"
                        value={user.phone}
                        disabled
                    />
                </div>
            </section>
        </form>
    );
}