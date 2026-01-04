import React from 'react'
import Card from '../components/ui/Card'

export default function About() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <div className="space-y-8">
        <Card className="p-8">
          <h2 className="text-4xl font-bold mb-6">Alumni Connect</h2>
          <p className="text-lg leading-relaxed muted mb-4">
            Alumni Connect is a dynamic platform designed to foster meaningful connections between graduates and current students.
            Our mission is to create a vibrant community that facilitates knowledge sharing, professional networking, and career growth
            opportunities.
          </p>
          <p className="text-lg leading-relaxed muted mb-4">
            Through our platform, we bring together years of experience and fresh perspectives, creating a space where mentorship
            flourishes and opportunities abound. Whether you're an alumnus looking to give back or a student seeking guidance,
            Alumni Connect is your gateway to a supportive and enriching network.
          </p>
          <p className="text-lg leading-relaxed muted">
            We provide a comprehensive platform featuring job opportunities, networking events, mentorship programs, and an alumni directory.
            Connect with fellow graduates, explore career paths, and build lasting professional relationships that will enhance your growth.
          </p>
        </Card>
      </div>
    </section>
  )
}
