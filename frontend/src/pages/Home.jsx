// import React from 'react'
// import { Link } from 'react-router-dom'
// import Button from '../components/ui/Button'
// import Card from '../components/ui/Card'

// export default function Home() {
//   const features = [
//     { icon: '👥', title: 'Alumni Directory', description: 'Connect with alumni members' },
//     { icon: '🎯', title: 'Opportunities', description: 'Browse jobs and internships' },
//     { icon: '🎉', title: 'Events', description: 'Attend college events' },
//     { icon: '🖼️', title: 'Gallery', description: 'View college photos and memories' },
//   ]

//   return (
//     <div className="max-w-6xl px-4 py-8 mx-auto">
//       {/* Hero */}
//       <section className="mb-10 overflow-hidden rounded-2xl">
//         <div className="px-6 py-16 text-center text-white bg-gradient-to-r from-sky-600 to-indigo-600">
//           <h1 className="mb-3 text-4xl font-extrabold md:text-5xl">Welcome to Alumni Connect</h1>
//           <p className="max-w-2xl mx-auto mb-6 text-lg opacity-90">Connect with alumni, discover opportunities, and stay engaged with your community.</p>

//           <div className="flex justify-center gap-4">
//             <Link to="/alumni"><Button variant="primary">Browse Alumni</Button></Link>
//             <Link to="/auth"><Button variant="secondary">Get Started</Button></Link>
//           </div>
//         </div>
//       </section>

//       {/* Features grid */}
//       <section className="mb-8">
//         <h2 className="mb-4 text-2xl font-semibold md:text-3xl text-slate-900 dark:text-slate-100">Explore</h2>
//         <div className="grid gap-6 md:grid-cols-3">
//           {features.map((feature, idx) => (
//             <Card key={idx} className="p-6 text-center">
//               <div className="mb-3 text-4xl">{feature.icon}</div>
//               <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{feature.title}</h3>
//               <p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
//             </Card>
//           ))}
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="p-6 text-center card-base">
//         <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Ready to reconnect?</h3>
//         <p className="mb-4 text-slate-600 dark:text-slate-400">Sign up or log in to start building your alumni network.</p>
//         <div className="flex justify-center gap-3">
//           <Link to="/auth"><Button variant="primary">Sign up</Button></Link>
//           <Link to="/alumni"><Button variant="secondary">Browse Directory</Button></Link>
//         </div>
//       </section>
//     </div>
//   )
// }



import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext' // Import Auth
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

export default function Home() {
  const { user } = useAuth();

  const features = [
    { icon: '👥', title: 'Alumni Directory', description: 'Find and chat with seniors.', link: '/alumni' },
    { icon: '🎯', title: 'Opportunities', description: 'Jobs and internships.', link: '/jobs' },
    { icon: '🎉', title: 'Events', description: 'Campus meetups.', link: '/events' },
    { icon: '🖼️', title: 'Gallery', description: 'Memories & photos.', link: '/gallery' },
  ]

  return (
    <div className="max-w-6xl px-4 py-12 mx-auto space-y-16">
      
      {/* Hero Section - Dynamic based on Login Status */}
      <section className="relative overflow-hidden shadow-2xl rounded-3xl">
        <div className="px-8 py-20 text-center text-white bg-gradient-to-br from-blue-700 via-indigo-600 to-violet-700">
          <div className="relative z-10">
            <h1 className="mb-6 text-4xl font-black tracking-tight md:text-6xl">
              {user ? `Welcome back, ${user.name.split(' ')[0]}!` : "Alumni Connect"}
            </h1>
            <p className="max-w-2xl mx-auto mb-10 text-lg font-medium leading-relaxed md:text-xl opacity-90">
              {user 
                ? "Ready to explore new opportunities or catch up with the community?"
                : "The bridge between students and alumni. Secure your future by connecting with those who've walked the path."
              }
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {user ? (
                <>
                  <Link to="/profile"><Button className="px-8 py-3 font-bold text-blue-700 bg-white hover:bg-slate-100">My Profile</Button></Link>
                  <Link to="/alumni"><Button className="px-8 py-3 font-bold border bg-blue-500/30 backdrop-blur-md border-white/30 hover:bg-blue-500/50">Browse Directory</Button></Link>
                </>
              ) : (
                <>
                  <Link to="/auth"><Button className="px-8 py-3 font-bold text-blue-700 bg-white hover:bg-slate-100">Join Community</Button></Link>
                  <Link to="/gallery"><Button className="px-8 py-3 font-bold border bg-blue-500/30 backdrop-blur-md border-white/30 hover:bg-blue-500/50">View Gallery</Button></Link>
                </>
              )}
            </div>
          </div>
          
          {/* Decorative Circles */}
          <div className="absolute top-0 left-0 w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 translate-x-1/2 translate-y-1/2 rounded-full bg-indigo-400/20 blur-3xl" />
        </div>
      </section>

      {/* Features Grid - Direct Links */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Explore Portal</h2>
          <p className="hidden text-slate-500 md:block">Everything you need in one place</p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => (
            <Link to={feature.link} key={idx} className="group">
              <Card className="h-full p-8 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900/50 group-hover:border-blue-500 dark:group-hover:border-blue-400">
                <div className="mb-6 text-5xl transition-transform transform group-hover:scale-110">{feature.icon}</div>
                <h3 className="mb-3 text-xl font-bold transition-colors text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Conditional CTA Section */}
      {!user && (
        <section className="p-10 text-center border bg-slate-100 dark:bg-slate-900 rounded-3xl border-slate-200 dark:border-slate-800">
          <h3 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">Are you an Alumnus?</h3>
          <p className="max-w-xl mx-auto mb-8 text-lg text-slate-600 dark:text-slate-400">
            Help the next generation of students by sharing your experience, job opportunities, and mentorship.
          </p>
          <Link to="/auth">
            <Button className="px-10 py-3 font-bold text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 rounded-xl">
              Register as Alumni
            </Button>
          </Link>
        </section>
      )}
    </div>
  )
}