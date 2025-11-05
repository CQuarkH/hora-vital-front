import React, { useState } from 'react';

interface CancelAppointmentModalProps {
	appointmentId: string;
	onClose: () => void;
	onConfirm: (reason: string) => void;
}

export const CancelAppointmentModal: React.FC<CancelAppointmentModalProps> = ({ appointmentId, onClose, onConfirm }) => {
	const [reason, setReason] = useState('');

	const handleConfirm = () => {
		onConfirm(reason);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
				<h3 className="text-lg font-semibold mb-2">Cancelar cita</h3>
				<p className="text-sm text-gray-600 mb-4">Estás a punto de cancelar la cita <strong>{appointmentId}</strong>. Indica la razón (opcional):</p>

				<textarea
					value={reason}
					onChange={(e) => setReason(e.target.value)}
					placeholder="Motivo de la cancelación"
					className="w-full p-3 border border-gray-300 rounded-md text-sm mb-4"
					rows={4}
				/>

				<div className="flex justify-end gap-3">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
					>
						Volver
					</button>
					<button
						onClick={handleConfirm}
						className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
					>
						Confirmar cancelación
					</button>
				</div>
			</div>
		</div>
	);
};

export default CancelAppointmentModal;
