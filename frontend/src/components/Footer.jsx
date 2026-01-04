import React from 'react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="app-footer">
      <div className="inner">
        <p>© {currentYear} Alumni Connect. All rights reserved.</p>
      </div>
    </footer>
  )
}
