// src/components/ui/Input.tsx
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...rest }, ref) => {
    return (
      <div className="mb-4">
        {label && (
          <label className="block text-gray-700 text-sm font-medium mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`input-field ${
            error ? "border-red-500" : ""
          } ${className}`}
          {...rest}
        />
        {error && <p className="mt-1 text-red-500 text-xs">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
