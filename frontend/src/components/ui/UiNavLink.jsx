import React from 'react'
import { NavLink } from 'react-router-dom'

export default function UiNavLink({ to, children, className = '', ...props }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''} ${className}`}
      {...props}
    >
      {children}
    </NavLink>
  )
}
