import React from "react";
import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

/**
 * Input reutilizable con soporte para label, validación y estilos consistentes.
 */
export const Input: React.FC<InputProps> = ({
    label,
    type = "text",
    placeholder,
    error,
    helperText,
    className,
    ...props
}) => {
    return (
        <div className="flex flex-col gap-2 items-start w-full">
            {label && (
                <label className="text-sm font-medium text-gray-700">{label}</label>
            )}

            <input
                type={type}
                placeholder={placeholder}
                className={clsx(
                    "p-2 w-full border-b outline-none transition-colors duration-200",
                    error
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 focus:border-primary",
                    className
                )}
                {...props}
            />

            {/* Mensaje de error o texto auxiliar */}
            {(error || helperText) && (
                <span
                    className={clsx(
                        "text-xs",
                        error ? "text-red-600" : "text-gray-500"
                    )}
                >
                    {error || helperText}
                </span>
            )}
        </div>
    );
};
