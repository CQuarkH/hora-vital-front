import React from 'react';
import type { SystemUser } from './UserListRow';

interface DeleteConfirmationModalProps {
    user: SystemUser | null;
    onClose: () => void;
    onConfirm: (userId: string) => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ user, onClose, onConfirm }) => {
    if (!user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
                <h2 className="text-2xl font-bold text-red-700 mb-4">Confirmar Eliminación</h2>
                <p className="text-gray-600 mb-6">
                    ¿Estás seguro de que deseas eliminar al usuario <strong>{user.name}</strong> ({user.email})? 
                    Esta acción es irreversible.
                </p>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={() => onConfirm(user.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                    >
                        Sí, Eliminar Usuario
                    </button>
                </div>
            </div>
        </div>
    );
};