import React from 'react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--nav-bg)',
      padding: '24px 20px',
      marginTop: 'auto',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.95rem' }}>
          © {currentYear} Alumni Connect. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
