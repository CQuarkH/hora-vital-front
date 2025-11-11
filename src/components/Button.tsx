import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    isActive?: boolean;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    isLoading = false,
    isActive = true,
    children,
    className = "",
    disabled,
    ...props
}) => {
    return (
        <button
            type="button"
            disabled={isLoading || disabled}
            className={
                `mt-4 bg-medical-700 text-white px-4 py-3 rounded-lg 
                hover:bg-green-800 flex items-center justify-center gap-2
                disabled:opacity-70 disabled:cursor-not-allowed transition-colors 
                ${className}`
            }
            {...props}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
                children
            )}
        </button>
    );
};
