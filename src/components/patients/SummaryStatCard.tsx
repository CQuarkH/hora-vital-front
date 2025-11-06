import React from 'react';

interface SummaryStatCardProps {
    value: string | number;
    label: string;
}

export const SummaryStatCard: React.FC<SummaryStatCardProps> = ({ value, label }) => {
    return (
        <div className="flex flex-col items-center justify-center p-6 bg-medical-50 border border-medical-200 rounded-xl shadow-sm">
            <span className="text-4xl font-bold text-medical-700">{value}</span>
            <p className="text-sm font-medium text-gray-600 mt-1">{label}</p>
        </div>
    );
};