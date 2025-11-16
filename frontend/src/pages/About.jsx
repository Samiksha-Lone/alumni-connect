import React from 'react'

export default function About() {
  return (
    <div style={{ display: 'grid', gap: '32px', padding: '20px' }}>
      <section style={{ padding: '40px' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '2rem', color: 'var(--accent)' }}>Alumni Connect</h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '24px' }}>
          Alumni Connect is a dynamic platform designed to foster meaningful connections between graduates and current students.
          Our mission is to create a vibrant community that facilitates knowledge sharing, professional networking, and career growth
          opportunities.
        </p>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '24px' }}>
          Through our platform, we bring together years of experience and fresh perspectives, creating a space where mentorship
          flourishes and opportunities abound. Whether you're an alumnus looking to give back or a student seeking guidance,
          Alumni Connect is your gateway to a supportive and enriching network.
        </p>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
          We provide a comprehensive platform featuring job opportunities, networking events, mentorship programs, and an alumni directory.
          Connect with fellow graduates, explore career paths, and build lasting professional relationships that will enhance your growth.
        </p>
      </section>
    </div>
  )
}
