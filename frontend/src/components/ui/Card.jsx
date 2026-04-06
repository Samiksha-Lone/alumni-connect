import React from 'react'

export default function Card({ children, className = '', hover = true, ...props }) {
  const cls = `card ${hover ? 'card-hover' : ''} ${className}`.trim()
  return (
    <article className={cls} {...props}>
      {children}
    </article>
  )
}
