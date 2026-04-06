import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({ 
  value, 
  onChange, 
  placeholder = '••••••••', 
  className = '', 
  id, 
  ...props 
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-input pr-12 focus:ring-primary/20"
        {...props}
      />
      <button
        type="button"
        aria-label={visible ? 'Hide password' : 'Show password'}
        onClick={() => setVisible(v => !v)}
        className="absolute top-1/2 right-3 -translate-y-1/2 p-2 text-text-secondary hover:text-primary transition-colors cursor-pointer"
      >
        {visible ? (
          <EyeOff size={18} />
        ) : (
          <Eye size={18} />
        )}
      </button>
    </div>
  );
}
