import React from 'react';

interface StepSelectorProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    children: React.ReactNode;
}

export const StepSelector: React.FC<StepSelectorProps> = ({ icon, title, description, children }) => {
    return (
        <div className="flex flex-col gap-4 p-6 bg-medical-50 border border-medical-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
                <div className="text-2xl text-medical-700">
                    {icon}
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-medical-900">{title}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
            </div>
            <div className="mt-2">
                {children}
            </div>
        </div>
    );
};