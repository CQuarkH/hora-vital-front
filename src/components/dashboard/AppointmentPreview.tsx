import { useNavigate } from 'react-router-dom';
import { HiOutlineClock } from 'react-icons/hi';
import clsx from 'clsx';

interface AppointmentPreviewProps {
    id: string;
    doctorName: string;
    specialty: string;
    date: {
        day: string;
        month: string;
    };
    time: string;
    status: 'Confirmada' | 'Pendiente';
}

export const AppointmentPreview: React.FC<AppointmentPreviewProps> = ({
    id,
    doctorName,
    specialty,
    date,
    time,
    status
}) => {
    const navigate = useNavigate();

    const statusColor = status === 'Confirmada'
        ? 'bg-green-100 text-green-800 border-green-300'
        : 'bg-yellow-100 text-yellow-800 border-yellow-300';

    return (
        <div
            data-testid="appointment-preview"
            className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
        >
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-medical-50 border border-medical-200">
                <span className="text-xl font-bold text-medical-800">{date.day}</span>
                <span className="text-sm font-medium text-medical-700 uppercase">{date.month}</span>
            </div>

            <div className="flex-1">
                <h4 className="font-bold text-medical-900">{doctorName}</h4>
                <p className="text-sm text-gray-600">{specialty}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <HiOutlineClock />
                    <span>{time}</span>
                </div>
            </div>

            <div className="flex flex-col items-end gap-2">
                <span
                    className={clsx(
                        "text-xs font-semibold px-2.5 py-0.5 rounded-full border",
                        statusColor
                    )}
                >
                    {status}
                </span>
                <button
                    onClick={() => navigate(`/appointments/${id}`)}
                    className="text-sm font-medium text-medical-600 hover:text-medical-800"
                >
                    Ver Detalles
                </button>
            </div>
        </div>
    );
}