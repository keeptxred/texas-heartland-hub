import React from "react";

interface CalculatorInputFieldProps {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: "number" | "currency" | "percent" | "text";
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  helpText?: string;
  error?: string;
}

export default function CalculatorInputField({
  id,
  label,
  value,
  onChange,
  type = "number",
  prefix,
  suffix,
  placeholder,
  helpText,
  error,
}: CalculatorInputFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            {prefix}
          </span>
        )}

        <input
          id={id}
          type={type === "text" ? "text" : "number"}
          inputMode={type === "currency" || type === "number" ? "decimal" : "text"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
          className={`w-full rounded-lg border bg-white px-3 py-2.5 text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:ring-2 ${
            prefix ? "pl-8" : ""
          } ${suffix ? "pr-12" : ""} ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-gray-900 focus:ring-gray-200"
          }`}
        />

        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
            {suffix}
          </span>
        )}
      </div>

      {error ? (
        <p id={`${id}-error`} className="text-sm text-red-600">
          {error}
        </p>
      ) : helpText ? (
        <p id={`${id}-help`} className="text-sm text-gray-500">
          {helpText}
        </p>
      ) : null}
    </div>
  );
}
