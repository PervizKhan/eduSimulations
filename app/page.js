"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const simulations = [
    {
      id: '3d-projectile',
      slug: '3d-projectile',
      title: '🎯 Projectile Motion',
      description: 'Learn about projectile motion with real-time physics simulation. Adjust angle, velocity, and gravity to see how they affect the trajectory.',
      color: 'from-green-500 to-green-600',
      icon: '🚀',
      tags: ['Physics', 'Class 9-12', '3D'],
      features: ['Real-time physics', '3D visualization', 'Interactive controls']
    },
    {
      id: 'cartesian-coordinates',
      slug: 'cartesian-coordinates',
      title: '📐 Cartesian Coordinates',
      description: 'Explore the coordinate system! Plot points, understand quadrants, calculate distance, midpoint, and slope with interactive visualization.',
      color: 'from-blue-500 to-blue-600',
      icon: '📐',
      tags: ['Mathematics', 'Class 9-12', 'Geometry'],
      features: ['Plot points', 'Distance formula', 'Midpoint', 'Slope']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10"></div>
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 relative">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                FATA IT Academy
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-2">
              Pre-Matric Foundation Course
            </p>
            <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto">
              Interactive simulations for Class 9-12 students to learn Physics and Mathematics concepts through visual, hands-on experimentation.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl px-6 py-3 border border-slate-700">
                <span className="text-2xl font-bold text-cyan-400">2</span>
                <span className="text-slate-400 ml-2">Simulations</span>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl px-6 py-3 border border-slate-700">
                <span className="text-2xl font-bold text-purple-400">40+</span>
                <span className="text-slate-400 ml-2">Lectures</span>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl px-6 py-3 border border-slate-700">
                <span className="text-2xl font-bold text-green-400">Class 9-12</span>
                <span className="text-slate-400 ml-2">Curriculum</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulations Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Interactive Labs
            </span>
          </h2>
          <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            {simulations.length} available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {simulations.map((sim) => (
            <Link
              key={sim.id}
              href={`/simulations/${sim.slug}`}
              className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:scale-[1.02]"
            >
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${sim.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <div className="p-6 relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`text-3xl md:text-4xl bg-slate-700/50 rounded-xl p-2 group-hover:scale-110 transition-transform duration-300`}>
                      {sim.icon}
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {sim.title}
                      </h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {sim.tags.map((tag, i) => (
                          <span key={i} className="text-[10px] bg-slate-700/50 text-slate-400 px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-slate-600 group-hover:text-cyan-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                  {sim.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {sim.features.map((feature, i) => (
                    <span key={i} className="text-xs bg-slate-700/30 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-600/30">
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Launch Button */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Click to launch →
                  </span>
                  <span className="text-xs bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors">
                    Interactive
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl px-6 py-4">
            <p className="text-sm text-slate-400">
              🚀 More simulations coming soon...
            </p>
            <div className="flex gap-2 mt-2 justify-center">
              <span className="text-xs bg-slate-700/50 text-slate-500 px-2 py-0.5 rounded-full">Algebra</span>
              <span className="text-xs bg-slate-700/50 text-slate-500 px-2 py-0.5 rounded-full">Trigonometry</span>
              <span className="text-xs bg-slate-700/50 text-slate-500 px-2 py-0.5 rounded-full">Vectors</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © 2024 FATA IT Academy — Pre-Matric Foundation Course
            </p>
            <div className="flex gap-4 text-xs text-slate-500">
              <span>📚 Physics</span>
              <span>📐 Mathematics</span>
              <span>💻 Computer Science</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}