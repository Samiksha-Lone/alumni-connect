import React from 'react';
import Card from '../components/ui/Card';

export default function About() {
  return (
    <div className="section-container max-w-4xl">
      <div className="mb-4 animate-slide-up">
        <h1 className="heading-lg mb-1.5">About Alumni Connect</h1>
      </div>
      
      <Card hover={false} className="p-6 md:p-8 space-y-5 bg-card border-border">
        <p className="text-base md:text-lg leading-relaxed text-text-secondary font-medium text-balance">
          Alumni Connect is a dynamic platform designed to foster meaningful connections between graduates and current students. 
          Our mission is to create a vibrant community that facilitates knowledge sharing, professional networking, 
          and career growth opportunities.
        </p>
        
        <p className="text-sm md:text-base leading-relaxed text-text-secondary">
          Through our platform, we bring together years of experience and fresh perspectives, creating a space where mentorship 
          flourishes and opportunities abound. Whether you're an alumnus looking to give back or a student seeking guidance, 
          Alumni Connect is your gateway to a supportive and enriching network.
        </p>
        
        <p className="text-sm md:text-base leading-relaxed text-text-secondary">
          We provide a comprehensive platform featuring job opportunities, networking events, mentorship programs, and an alumni directory. 
          Connect with fellow graduates, explore career paths, and build lasting professional relationships that will enhance your growth.
        </p>
      </Card>
    </div>
  );
}
