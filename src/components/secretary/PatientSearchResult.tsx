import React from 'react';
import clsx from 'clsx';
import { HiOutlineCheckCircle } from 'react-icons/hi';

export interface PatientSearchResult {
    id: string;
    name: string;
    rut: string;
    phone: string;
}

interface PatientSearchResultProps {
    patient: PatientSearchResult;
    isSelected: boolean;
    onSelect: (patient: PatientSearchResult) => void;
}

export const PatientSearchResult: React.FC<PatientSearchResultProps> = ({ 
    patient, 
    isSelected, 
    onSelect 
}) => {
    return (
        <button
            type="button"
            onClick={() => onSelect(patient)}
            className={clsx(
                "w-full text-left p-4 rounded-lg border-2",
                isSelected
                    ? "bg-medical-50 border-medical-600"
                    : "bg-white border-gray-200 hover:bg-gray-50"
            )}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h5 className="font-semibold text-gray-900">{patient.name}</h5>
                    <p className="text-sm text-gray-500">RUT: {patient.rut}</p>
                    <p className="text-sm text-gray-500">{patient.phone}</p>
                </div>
                {isSelected && (
                    <HiOutlineCheckCircle className="h-6 w-6 text-medical-600" />
                )}
            </div>
        </button>
    );
};