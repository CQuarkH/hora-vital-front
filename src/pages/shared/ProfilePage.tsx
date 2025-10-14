import React from "react";
import { useForm } from "react-hook-form";
import { CiUser, CiMail } from "react-icons/ci";
import { Input } from "../../components/Input";
import AuthContext from "../../context/AuthContext";

interface ProfileFormData {
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    email: string;
}

export default function ProfilePage() {
    const context = React.useContext(AuthContext)!;
    const { user } = context;

    const [isEditing, setIsEditing] = React.useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            address: user?.address || "",
            phone: user?.phone || "",
            email: user?.email || ""
        }
    });

    const onSubmit = (data: ProfileFormData) => {
        // Aquí harías la llamada a tu API para guardar los cambios
        console.log("Guardando cambios:", data);
        setIsEditing(false);
        // TODO: Actualizar el contexto o hacer la petición al backend
    };

    const handleCancel = () => {
        // Restaurar valores originales
        reset({
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            address: user?.address || "",
            phone: user?.phone || "",
            email: user?.email || ""
        });
        setIsEditing(false);
    };

    return !user ? <div className="p-8">Cargando...</div> : (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto px-8">
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
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-medical-600 text-white rounded-lg font-medium hover:bg-medical-700 transition"
                        >
                            Guardar Cambios
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
                    <Input label="RUT" value={user.rut} disabled />
                    <Input label="Fecha de Nacimiento" value={user.birthDate} disabled />
                    <Input
                        label="Nombres"
                        {...register("firstName", {
                            required: "Los nombres son requeridos"
                        })}
                        disabled={!isEditing}
                        error={errors.firstName?.message}
                    />
                    <Input
                        label="Apellidos"
                        {...register("lastName", {
                            required: "Los apellidos son requeridos"
                        })}
                        disabled={!isEditing}
                        error={errors.lastName?.message}
                    />
                    <Input label="Género" value={user.gender} disabled />
                    <Input
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
                            required: "El teléfono es requerido"
                        })}
                        disabled={!isEditing}
                        error={errors.phone?.message}
                    />
                    <Input label="Contacto de Emergencia" value={user.phone} disabled />
                </div>
            </section>
        </form>
    );
}