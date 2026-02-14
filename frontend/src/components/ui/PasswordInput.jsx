import React, { useState } from 'react'
import { HiEye, HiEyeOff } from 'react-icons/hi'

export default function PasswordInput({ value, onChange, placeholder = 'Password', className = '', inputClassName = '', id, ...props }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-md dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all ${inputClassName}`}
        {...props}
      />
      <button
        type="button"
        aria-label={visible ? 'Hide password' : 'Show password'}
        onClick={() => setVisible(v => !v)}
        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
      >
        {visible ? (
          <HiEyeOff className="w-5 h-5" />
        ) : (
          <HiEye className="w-5 h-5" />
        )}
      </button>
    </div>
  )
}
