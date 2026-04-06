import React from 'react'

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost'
  }

  const cls = `btn ${variants[variant] || variants.primary} ${className}`.trim()

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  )
}
