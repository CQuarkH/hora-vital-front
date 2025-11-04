import { HiOutlineBell } from 'react-icons/hi';

interface NotificationPreviewProps {
    title: string;
    timeAgo: string;
}

export const NotificationPreview: React.FC<NotificationPreviewProps> = ({ title, timeAgo }) => {
    return (
        <div className="flex items-start gap-3 p-3 hover:bg-medical-100 rounded-lg">
            <HiOutlineBell className="text-lg text-medical-700 mt-1" />
            <div className="flex-1">
                <p className="text-sm text-gray-800">{title}</p>
                <span className="text-xs text-gray-500">{timeAgo}</span>
            </div>
        </div>
    );
}