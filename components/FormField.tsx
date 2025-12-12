import React from 'react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
  label: string;
  error?: string;
  as?: 'input' | 'textarea' | 'select';
  options?: { value: string; label: string }[];
}

export const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  error, 
  className = '', 
  as = 'input', 
  options, 
  children,
  ...props 
}) => {
  const baseStyles = `w-full rounded-md border shadow-sm px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all ${
    error ? 'border-red-300 focus:ring-red-200 focus:border-red-500' : 'border-slate-300'
  }`;

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      
      {as === 'textarea' ? (
        <textarea 
            className={`${baseStyles} min-h-[100px]`} 
            {...props as React.TextareaHTMLAttributes<HTMLTextAreaElement>} 
        />
      ) : as === 'select' ? (
        <select 
            className={`${baseStyles} bg-white`} 
            {...props as React.SelectHTMLAttributes<HTMLSelectElement>}
        >
            {options ? options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            )) : children}
        </select>
      ) : (
        <input 
            className={baseStyles} 
            {...props as React.InputHTMLAttributes<HTMLInputElement>} 
        />
      )}
      
      {error && (
        <p className="mt-1 text-xs text-red-600 font-medium animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
};