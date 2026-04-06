import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-6 py-6 min-h-[60vh] justify-center">
      
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-4 max-w-4xl mx-auto animate-slide-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary text-[10px] font-bold mb-4 border border-primary/20 uppercase tracking-wider">
          Professional Network
        </div>
        <h1 className="heading-xl mb-3 text-text-primary">
          {user 
            ? `Welcome back, ${user.name.split(' ')[0]}!` 
            : "Connect with Your Alumni Network"
          }
        </h1>
        <p className="text-sm md:text-base text-text-secondary mb-6 leading-relaxed max-w-xl text-balance">
          {user 
            ? "Stay engaged with your alma mater. Explore opportunities, attend events, and give back to the community."
            : "Alumni Connect helps you maintain lifelong relations with your institution and fellow graduates. Join us to bridge the gap between campus and career."
          }
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {user ? (
            <>
              <Link to="/alumni">
                <Button variant="primary" className="h-10 px-6 text-xs font-bold">
                  Explore Alumni Directory <ArrowRight size={14} className="ml-2" />
                </Button>
              </Link>
              <Link to="/opportunities">
                <Button variant="secondary" className="h-10 px-6 text-xs font-bold">
                  View Career Jobs
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="primary" className="h-10 px-6 text-xs font-bold">
                  Get Started for Free <ArrowRight size={14} className="ml-2" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="secondary" className="h-10 px-6 text-xs font-bold border-border">
                  Learn More About Us
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="section-container !py-0 flex flex-wrap justify-center gap-3 animate-fade-in delay-200">
        {['Alumni', 'Events', 'Opportunities', 'Gallery'].map((item) => (
          <Link 
            key={item} 
            to={`/${item.toLowerCase()}`}
            className="px-5 py-2.5 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-white dark:hover:bg-gray-800 transition-all font-bold text-xs text-text-secondary hover:text-primary shadow-sm"
          >
            {item}
          </Link>
        ))}
      </section>

    </div>
  );
}