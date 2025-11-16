import React from 'react'

export default function Home() {
  return (
    <section>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, var(--accent) 0%, #1e40af 100%)',
        borderRadius: '12px',
        padding: '50px 40px',
        marginBottom: '40px',
        color: 'white',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(37, 99, 235, 0.2)'
      }}>
        <h1 style={{ fontSize: '40px', marginBottom: '12px', fontWeight: 700 }}>
          Alumni Connect
        </h1>
        <p style={{ fontSize: '18px', opacity: 0.95 }}>
          Connect with alumni, discover opportunities, and stay engaged with your community
        </p>
      </div>

      {/* Features Row - single-line */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          overflowX: 'auto',
          paddingBottom: '6px'
        }}>
          <div style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            minWidth: '220px',
            flex: '0 0 23%'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>👥</div>
            <h3 style={{ color: 'var(--text)', marginBottom: '6px', fontSize: '16px', fontWeight: 600 }}>
              Alumni Directory
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '13px' }}>
              Connect with alumni members
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            minWidth: '220px',
            flex: '0 0 23%'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎯</div>
            <h3 style={{ color: 'var(--text)', marginBottom: '6px', fontSize: '16px', fontWeight: 600 }}>
              Opportunities
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '13px' }}>
              Browse jobs and internships
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            minWidth: '220px',
            flex: '0 0 23%'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎉</div>
            <h3 style={{ color: 'var(--text)', marginBottom: '6px', fontSize: '16px', fontWeight: 600 }}>
              Events
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '13px' }}>
              Attend college events
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            minWidth: '220px',
            flex: '0 0 23%'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🖼️</div>
            <h3 style={{ color: 'var(--text)', marginBottom: '6px', fontSize: '16px', fontWeight: 600 }}>
              Gallery
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '13px' }}>
              View college photos and memories
            </p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div style={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '30px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: 'var(--text)', marginBottom: '12px', fontSize: '22px', fontWeight: 600 }}>
          Get Started Today
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '0' }}>
          Register or log in to access all features and connect with your alumni community
        </p>
      </div>
    </section>
  )
}
