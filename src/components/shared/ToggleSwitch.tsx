import React from 'react';
import clsx from 'clsx';

interface ToggleSwitchProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange, disabled = false }) => {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => !disabled && onChange(!enabled)}
            className={clsx(
                "relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                enabled ? 'bg-medical-600' : 'bg-gray-200',
                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                "focus:outline-none focus:ring-2 focus:ring-medical-500 focus:ring-offset-2"
            )}
        >
            <span
                aria-hidden="true"
                className={clsx(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    enabled ? 'translate-x-5' : 'translate-x-0'
                )}
            />
        </button>
    );
};