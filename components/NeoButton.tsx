import React from 'react';
import { motion } from 'framer-motion';

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const NeoButton: React.FC<NeoButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "font-bold border-black border-2 transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed block relative";
  
  const sizeStyles = {
    sm: "px-3 py-1 text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
    md: "px-6 py-2 text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    lg: "px-8 py-4 text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
  };

  const variantStyles = {
    primary: "bg-purple-600 text-white",
    secondary: "bg-yellow-300 text-black",
    danger: "bg-red-500 text-white",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, rotate: Math.random() > 0.5 ? 1 : -1 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props as any}
    >
      {children}
    </motion.button>
  );
};