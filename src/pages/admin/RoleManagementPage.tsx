import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { AdminStatCard } from '../../components/admin/AdminStatCard';
import { RoleCard } from '../../components/admin/RoleCard';
import type { RoleData } from '../../components/admin/RoleCard';
import clsx from 'clsx';

import { 
    HiOutlineUsers, 
    HiOutlineShieldCheck, 
    HiOutlineHeart, 
    HiOutlineChartBar
} from 'react-icons/hi';

// --- DATOS DE EJEMPLO (MOCK) ---
const MOCK_STATS = {
    total: 154,
    secretaries: 4,
    patients: 150,
    active: 142
};

const MOCK_ROLES: RoleData[] = [
    { 
        id: '1', 
        name: 'Administrador General', 
        permissions: [
            { name: 'Gestión completa' }, 
            { name: 'Usuarios' }, 
            { name: 'Configuración' }
        ],
        userCount: 1,
        canBeDeleted: false
    },
    { 
        id: '2', 
        name: 'Secretario/a', 
        permissions: [
            { name: 'Gestión de citas' }, 
            { name: 'Ver agenda' }, 
            { name: 'Editar citas' }
        ],
        userCount: 3,
        canBeDeleted: true
    },
    { 
        id: '3', 
        name: 'Paciente', 
        permissions: [
            { name: 'Agendar citas' }, 
            { name: 'Ver historial' }, 
            { name: 'Perfil' }
        ],
        userCount: 150,
        canBeDeleted: true
    }
];

export default function RoleManagementPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const activeTab: 'users' | 'roles' = 'roles';
    
    const handleEditRole = (role: RoleData) => {
        console.log("Editando Rol:", role.name);
    };
    
    const handleDeleteRole = (role: RoleData) => {
        if (!role.canBeDeleted) return;
        console.log("Eliminando Rol:", role.name);
        toast(`Simulando eliminación de ${role.name}`);
    };

    const TabButton: React.FC<{ title: string, tabId: 'users' | 'roles', to: string }> = ({ title, tabId, to }) => (
        <button
            onClick={() => navigate(to)}
            className={clsx(
                "py-3 px-6 font-semibold",
                activeTab === tabId
                    ? "text-medical-600 border-b-2 border-medical-600"
                    : "text-gray-500 hover:text-gray-700"
            )}
        >
            {title}
        </button>
    );

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Panel de Administración
                </h1>
                <p className="text-gray-600">
                    Bienvenido, {user?.firstName || 'Admin'}.
                </p>
            </div>
                
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdminStatCard
                    label="Total Usuarios"
                    value={MOCK_STATS.total}
                    icon={<HiOutlineUsers />}
                />
                <AdminStatCard
                    label="Secretarios/as"
                    value={MOCK_STATS.secretaries}
                    icon={<HiOutlineShieldCheck />}
                />
                <AdminStatCard
                    label="Pacientes"
                    value={MOCK_STATS.patients}
                    icon={<HiOutlineHeart />}
                />
                <AdminStatCard
                    label="Usuarios Activos"
                    value={MOCK_STATS.active}
                    icon={<HiOutlineChartBar />}
                />
            </div>

            <div className="border-b border-gray-200">
                <TabButton title="Gestión de Usuarios" tabId="users" to="/home" />
                <TabButton title="Gestión de Roles" tabId="roles" to="/admin-roles" />
            </div>

            <div className="p-6 bg-medical-50 border border-medical-200 rounded-xl">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-medical-900">
                            Roles y Permisos
                        </h3>
                        <p className="text-sm text-gray-500">
                            Configura los roles del sistema y sus permisos
                        </p>
                    </div>
                    <button
                        className="text-sm font-medium text-medical-600 hover:text-medical-800"
                    >
                        + Nuevo Rol
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {MOCK_ROLES.map(role => (
                        <RoleCard 
                            key={role.id}
                            role={role}
                            onEdit={handleEditRole}
                            onDelete={handleDeleteRole}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}