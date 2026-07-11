import React from "react";


interface CalculatorButtonProps {

  children: React.ReactNode;

  type?:
    | "button"
    | "submit"
    | "reset";

  variant?:
    | "primary"
    | "secondary"
    | "danger";

  disabled?: boolean;

  loading?: boolean;

  onClick?: () => void;

}



export default function CalculatorButton({

  children,

  type = "button",

  variant = "primary",

  disabled = false,

  loading = false,

  onClick,

}: CalculatorButtonProps) {



  const variantClasses = {

    primary:
      "bg-gray-900 text-white hover:bg-gray-800",

    secondary:
      "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50",

    danger:
      "bg-red-600 text-white hover:bg-red-700",

  };



  return (

    <button

      type={type}

      disabled={
        disabled || loading
      }

      onClick={onClick}

      className={

        `rounded-lg px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]}`

      }

    >

      {loading
        ? "Calculating..."
        : children}

    </button>

  );

}