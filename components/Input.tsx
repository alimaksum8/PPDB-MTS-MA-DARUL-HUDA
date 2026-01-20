
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  icon?: string;
  as?: 'input' | 'select' | 'textarea';
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  icon, 
  as = 'input', 
  children, 
  className = '', 
  ...props 
}) => {
  const baseClasses = "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none bg-white/50 backdrop-blur-sm";
  const Comp = as as any;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-2">
        {icon && <i className={`${icon} text-emerald-600 w-4`}></i>}
        {label}
      </label>
      <Comp className={baseClasses} {...props}>
        {children}
      </Comp>
      {error && <span className="text-xs text-red-500 mt-0.5 ml-1 font-medium">{error}</span>}
    </div>
  );
};
