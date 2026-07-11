import React from "react";

export interface CalculatorInputProps {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string) => void;

  type?: "text" | "number" | "email";
  placeholder?: string;

  min?: number;
  max?: number;
  step?: number;

  prefix?: string;
  suffix?: string;

  helpText?: string;
  error?: string;

  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
}

export function CalculatorInput({
  id,
  label,
  value,
  onChange,

  type = "number",
  placeholder,

  min,
  max,
  step,

  prefix,
  suffix,

  helpText,
  error,

  required = false,
  disabled = false,
  autoFocus = false,
}: CalculatorInputProps) {
  return (
    <div className="space-y-2">

      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-800"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-600">*</span>
        )}
      </label>

      <div className="relative">

        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {prefix}
          </span>
        )}

        <input
          id={id}
          type={type}
          value={value}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          autoFocus={autoFocus}
          required={required}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={[
            "w-full rounded-lg border",
            "border-gray-300",
            "bg-white",
            "py-3",
            prefix ? "pl-8" : "pl-4",
            suffix ? "pr-10" : "pr-4",
            "text-gray-900",
            "focus:border-red-600",
            "focus:outline-none",
            "focus:ring-2",
            "focus:ring-red-200",
            disabled ? "bg-gray-100 cursor-not-allowed" : "",
            error ? "border-red-500" : "",
          ].join(" ")}
        />

        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {suffix}
          </span>
        )}

      </div>

      {helpText && !error && (
        <p className="text-sm text-gray-500">
          {helpText}
        </p>
      )}

      {error && (
        <p className="text-sm font-medium text-red-600">
          {error}
        </p>
      )}

    </div>
  );
}

interface SelectOption {
  label: string;
  value: string;
}

interface CalculatorSelectProps {
  id: string;
  label: string;

  value: string;

  options: SelectOption[];

  onChange: (value: string) => void;

  helpText?: string;
}

export function CalculatorSelect({
  id,
  label,
  value,
  options,
  onChange,
  helpText,
}: CalculatorSelectProps) {
  return (
    <div className="space-y-2">

      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-800"
      >
        {label}
      </label>

      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {helpText && (
        <p className="text-sm text-gray-500">
          {helpText}
        </p>
      )}

    </div>
  );
}

interface SliderProps {
  id: string;
  label: string;

  value: number;

  min: number;
  max: number;
  step?: number;

  onChange: (value: number) => void;

  formatter?: (value: number) => string;
}

export function CalculatorSlider({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatter,
}: SliderProps) {
  return (
    <div className="space-y-3">

      <div className="flex items-center justify-between">

        <label
          htmlFor={id}
          className="text-sm font-semibold text-gray-800"
        >
          {label}
        </label>

        <span className="font-semibold text-red-700">
          {formatter ? formatter(value) : value}
        </span>

      </div>

      <input
        id={id}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer"
      />

    </div>
  );
}
