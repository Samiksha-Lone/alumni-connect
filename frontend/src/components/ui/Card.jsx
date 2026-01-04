import React from 'react'

export default function Card({ children, className = '', ...props }) {
  return (
    <article className={`card ${className}`} {...props}>
      {children}
    </article>
  )
}
