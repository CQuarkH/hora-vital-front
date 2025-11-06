import React from 'react';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { PatientStatusBadge } from '../patients/PatientStatusBadge';
import type { PatientStatus } from '../patients/PatientStatusBadge';

export interface SystemUser {
    id: string;
    name: string;
    email: string;
    role: 'Secretario/a' | 'Paciente' | 'Administrador';
    status: PatientStatus;
    lastAccess: string;
}

interface UserListRowProps {
    user: SystemUser;
    onEdit: (user: SystemUser) => void;
    onDelete: (user: SystemUser) => void;
}

export const UserListRow: React.FC<UserListRowProps> = ({ user, onEdit, onDelete }) => {
    return (
        <div className="grid grid-cols-5 gap-4 items-center p-4 border-b border-gray-200">
            <div className="col-span-1">
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <div className="col-span-1 text-sm text-gray-600">
                {user.role}
            </div>
            <div className="col-span-1">
                <PatientStatusBadge status={user.status} />
            </div>
            <div className="col-span-1 text-sm text-gray-600">
                {user.lastAccess}
            </div>
            <div className="col-span-1 flex justify-end items-center gap-4">
                <button 
                    onClick={() => onEdit(user)}
                    className="text-gray-500 hover:text-medical-700" 
                    title="Editar Usuario"
                >
                    <HiOutlinePencil className="h-5 w-5" />
                </button>
                <button 
                    onClick={() => onDelete(user)}
                    className="text-gray-500 hover:text-red-600" 
                    title="Eliminar Usuario"
                >
                    <HiOutlineTrash className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};