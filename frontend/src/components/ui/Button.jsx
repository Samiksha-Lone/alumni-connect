import React from 'react'

export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'btn'
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn ghost'
  }

  const sizes = {
    sm: 'btn small',
    md: 'btn',
    lg: 'btn lg'
  }

  const cls = `${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`.trim()

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  )
}
