import React from 'react';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';

export interface RolePermission {
    name: string;
}

export interface RoleData {
    id: string;
    name: string;
    permissions: RolePermission[];
    userCount: number;
    canBeDeleted: boolean;
}

interface RoleCardProps {
    role: RoleData;
    onEdit: (role: RoleData) => void;
    onDelete: (role: RoleData) => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({ role, onEdit, onDelete }) => {
    return (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-medical-800">{role.name}</h3>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => onEdit(role)}
                        className="text-gray-500 hover:text-medical-700" 
                        title="Editar Rol"
                    >
                        <HiOutlinePencil className="h-5 w-5" />
                    </button>
                    
                    <button 
                        onClick={() => onDelete(role)}
                        disabled={!role.canBeDeleted}
                        className="text-gray-500 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed" 
                        title={role.canBeDeleted ? "Eliminar Rol" : "No se puede eliminar este rol"}
                    >
                        <HiOutlineTrash className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
                {role.permissions.map(perm => (
                    <span 
                        key={perm.name}
                        className="text-xs font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full"
                    >
                        {perm.name}
                    </span>
                ))}
            </div>

            <p className="text-sm text-gray-500 mt-4">
                {role.userCount} {role.userCount === 1 ? 'usuario asignado' : 'usuarios asignados'}
            </p>
        </div>
    );
};