import React from 'react';

interface AdminStatCardProps {
    value: string | number;
    label: string;
    icon: React.ReactNode;
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({ value, label, icon }) => {
    return (
        <div className="flex items-center justify-between p-6 bg-medical-50 border border-medical-200 rounded-xl shadow-sm">
            <div>
                <p className="text-gray-600 text-sm">{label}</p>
                <span className="text-4xl font-bold text-medical-800">{value}</span>
            </div>
            <div className="text-3xl text-medical-600">
                {icon}
            </div>
        </div>
    );
};