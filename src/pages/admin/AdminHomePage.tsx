import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AdminStatCard } from '../../components/admin/AdminStatCard';
import { UserListRow } from '../../components/admin/UserListRow';
import type { SystemUser } from '../../components/admin/UserListRow';
import clsx from 'clsx';
import { HiOutlineUsers, HiOutlineShieldCheck, HiOutlineHeart, HiOutlineChartBar, HiOutlineSearch } from 'react-icons/hi';
import { EditUserModal } from '../../components/admin/EditUserModal';
import { DeleteConfirmationModal } from '../../components/admin/DeleteConfirmationModal';

// --- DATOS DE EJEMPLO (MOCK) ---
const MOCK_USERS_DATA: SystemUser[] = [
    { id: '1', name: 'María González', email: 'maria.gonzalez@cesfam.cl', role: 'Secretario/a', status: 'Activo', lastAccess: '2024-01-15' },
    { id: '2', name: 'Carlos Rodríguez', email: 'carlos.rodriguez@cesfam.cl', role: 'Secretario/a', status: 'Activo', lastAccess: '2024-01-14' },
    { id: '3', name: 'Ana Martínez', email: 'ana.martinez@cesfam.cl', role: 'Secretario/a', status: 'Inactivo', lastAccess: '2024-01-10' },
];

const MOCK_STATS = {
    total: 154,
    secretaries: 4,
    patients: 150,
    active: 142
};

const ROLE_OPTIONS = ['Todos', 'Secretario/a', 'Paciente', 'Administrador'];

export default function AdminHomePage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
    
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('Todos');

    const [users, setUsers] = useState<SystemUser[]>(MOCK_USERS_DATA);
    const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const filteredUsers = useMemo(() => {
        return users
            .filter(u => roleFilter === 'Todos' || u.role === roleFilter)
            .filter(u => 
                u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [users, searchTerm, roleFilter]);

    const handleEditUser = (user: SystemUser) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleDeleteUser = (user: SystemUser) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const onSaveEdit = (updatedUser: SystemUser) => {
        setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
        setIsEditModalOpen(false);
        setSelectedUser(null);
    };

    const onConfirmDelete = (userId: string) => {
        setUsers(prev => prev.filter(u => u.id !== userId));
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
    };

    const TabButton: React.FC<{ title: string, tabId: 'users' | 'roles', to: string }> = ({ title, tabId, to }) => (
        <button
            onClick={() => {
                setActiveTab(tabId);
                navigate(to);
            }}
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

            {activeTab === 'users' && (
                <div className="p-6 bg-medical-50 border border-medical-200 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-medical-900">
                                Usuarios del Sistema
                            </h3>
                            <p className="text-sm text-gray-500">
                                Gestiona todos los usuarios y sus permisos
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/admin-create-user')}
                            className="text-sm font-medium text-medical-600 hover:text-medical-800"
                        >
                            + Nuevo Usuario
                        </button>
                    </div>

                    <div className="flex gap-4 mb-4 p-4 bg-white rounded-lg border border-gray-200">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Buscar usuarios..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-2 pl-10 border border-gray-300 rounded-lg text-sm"
                            />
                            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="w-auto p-2 border border-gray-300 rounded-lg text-sm"
                        >
                            {ROLE_OPTIONS.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200">
                        <div className="grid grid-cols-5 gap-4 items-center p-4 border-b border-gray-300 bg-gray-50">
                            <div className="col-span-1 text-sm font-semibold text-gray-600">Usuario</div>
                            <div className="col-span-1 text-sm font-semibold text-gray-600">Rol</div>
                            <div className="col-span-1 text-sm font-semibold text-gray-600">Estado</div>
                            <div className="col-span-1 text-sm font-semibold text-gray-600">Último Acceso</div>
                            <div className="col-span-1 text-sm font-semibold text-gray-600 text-right">Acciones</div>
                        </div>

                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(u => (
                                <UserListRow 
                                    key={u.id} 
                                    user={u}
                                    onEdit={handleEditUser}
                                    onDelete={handleDeleteUser}
                                />
                            ))
                        ) : (
                            <p className="text-center text-gray-500 p-8">
                                No se encontraron usuarios.
                            </p>
                        )}
                    </div>
                </div>
            )}
            
            {isEditModalOpen && (
                <EditUserModal
                    user={selectedUser}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={onSaveEdit}
                />
            )}
            {isDeleteModalOpen && (
                <DeleteConfirmationModal
                    user={selectedUser}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={onConfirmDelete}
                />
            )}
        </div>
    );
}