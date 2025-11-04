import { useNavigate } from 'react-router-dom';
import clsx from 'clsx'; // Ya tienes clsx en tu package.json

interface DashboardCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    to: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, description, icon, to }) => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(to)}
            className={clsx(
                "flex flex-col items-center justify-center gap-2 p-6 rounded-xl",
                "bg-medical-50 border border-medical-200 shadow-sm",
                "hover:bg-medical-100 hover:border-medical-300 transition-all duration-200"
            )}
        >
            <div className="text-3xl text-medical-700">{icon}</div>
            <span className="font-semibold text-medical-900">{title}</span>
            <span className="text-sm text-gray-600">{description}</span>
        </button>
    );
};