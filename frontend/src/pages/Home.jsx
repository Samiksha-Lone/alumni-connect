import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

export default function Home() {
  const features = [
    { icon: '👥', title: 'Alumni Directory', description: 'Connect with alumni members' },
    { icon: '🎯', title: 'Opportunities', description: 'Browse jobs and internships' },
    { icon: '🎉', title: 'Events', description: 'Attend college events' },
    { icon: '🖼️', title: 'Gallery', description: 'View college photos and memories' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <section className="rounded-2xl overflow-hidden mb-10">
        <div className="bg-gradient-to-r from-sky-600 to-indigo-600 px-6 py-16 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Welcome to Alumni Connect</h1>
          <p className="max-w-2xl mx-auto text-lg opacity-90 mb-6">Connect with alumni, discover opportunities, and stay engaged with your community.</p>

          <div className="flex justify-center gap-4">
            <Link to="/alumni"><Button variant="primary">Browse Alumni</Button></Link>
            <Link to="/auth"><Button variant="secondary">Get Started</Button></Link>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Explore</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, idx) => (
            <Card key={idx} className="p-6 text-center">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-slate-100">{feature.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="card-base p-6 text-center">
        <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">Ready to reconnect?</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">Sign up or log in to start building your alumni network.</p>
        <div className="flex justify-center gap-3">
          <Link to="/auth"><Button variant="primary">Sign up</Button></Link>
          <Link to="/alumni"><Button variant="secondary">Browse Directory</Button></Link>
        </div>
      </section>
    </div>
  )
}
