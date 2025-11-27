import React from "react";
import clsx from "clsx";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  error?: string;
  helperText?: string;
  formatter?: (value: string) => string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Input reutilizable con soporte para label, validación, formateo y estilos consistentes.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      type = "text",
      placeholder,
      error,
      helperText,
      className,
      disabled,
      formatter,
      onChange,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (formatter) {
        const formatted = formatter(e.target.value);
        e.target.value = formatted;
      }
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className="flex flex-col gap-2 items-start w-full">
        {label && (
          <label
            className={clsx(
              "text-sm font-medium",
              disabled ? "opacity-70" : "opacity-100"
            )}
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          name={label}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleChange}
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
  }
);
