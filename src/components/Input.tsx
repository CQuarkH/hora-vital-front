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
    disabled,
    ...props
}) => {
    return (
        <div className="flex flex-col gap-2 items-start w-full">
            {label && (
                <label className={clsx(
                    "text-sm font-medium",
                    disabled ? "opacity-70" : "opacity-100"
                )}>
                    {label}
                </label>
            )}

            <input
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                className={clsx(
                    "p-2 w-full border-b outline-none transition-colors duration-200",
                    error
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 focus:border-primary",
                    disabled && "opacity-50 cursor-not-allowed",
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

// Ejemplo de uso
export default function App() {
    return (
        <div className="p-8 max-w-md mx-auto space-y-6">
            <Input
                label="Input Normal"
                placeholder="Escribe algo..."
            />

            <Input
                label="Input Disabled"
                placeholder="No puedes editar esto"
                disabled
                value="Texto deshabilitado"
            />

            <Input
                label="Con Error"
                error="Este campo es requerido"
                placeholder="Campo con error"
            />

            <Input
                label="Disabled con Error"
                error="Error en campo deshabilitado"
                disabled
                value="Campo deshabilitado con error"
            />
        </div>
    );
}