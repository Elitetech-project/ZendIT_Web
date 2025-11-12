"use client";

import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  className?: string;
  children: React.ReactNode;
}

const BtnComponent: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  const baseStyles =
    "px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none w-full font-poppins ";

  const variantStyles = {
    default: "bg-[#C10F45] text-black hover:opacity-90 text-white",
    outline: "border-2 border-[#C10F45] text-[#C10F45] bg-transparent hover:bg-[#F5C249]/10",
  };

  return (
    <button
      className={clsx(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default BtnComponent;
