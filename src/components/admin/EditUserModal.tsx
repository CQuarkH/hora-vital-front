import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../Input';
import type { SystemUser } from './UserListRow';
import type { PatientStatus } from '../patients/PatientStatusBadge';

interface EditUserModalProps {
    user: SystemUser | null;
    onClose: () => void;
    onSave: (updatedUser: SystemUser) => void;
}

interface EditFormValues {
    name: string;
    email: string;
    role: SystemUser['role'];
    status: PatientStatus;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onSave }) => {
    const { register, handleSubmit, reset } = useForm<EditFormValues>();

    useEffect(() => {
        if (user) {
            reset({
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
            });
        }
    }, [user, reset]);

    if (!user) return null;

    const onSubmit = (data: EditFormValues) => {
        const updatedUser = {
            ...user,
            ...data,
        };
        onSave(updatedUser);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Editar Usuario</h2>

                <div className="flex flex-col gap-4">
                    <Input
                        label="Nombre Completo"
                        {...register("name", { required: true })}
                    />
                    <Input
                        label="Email"
                        type="email"
                        {...register("email", { required: true })}
                    />
                    
                    <div className="flex flex-col gap-2 items-start w-full">
                        <label className="text-sm font-medium">Rol</label>
                        <select
                            {...register("role")}
                            className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                        >
                            <option value="Secretario/a">Secretario/a</option>
                            <option value="Administrador">Administrador</option>
                            <option value="Paciente">Paciente</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2 items-start w-full">
                        <label className="text-sm font-medium">Estado</label>
                        <select
                            {...register("status")}
                            className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                        >
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-medical-700 text-white rounded-lg font-medium hover:bg-medical-800 transition"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
};