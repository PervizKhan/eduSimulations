'use client';

import Link from 'next/link';

const simulations = [
  { slug: '3d-projectile', title: '3D Projectile Playground 🚀', category: 'Physics', isPremium: true },
  { slug: 'basic-pendulum', title: 'Basic Pendulum Lab ⏱️', category: 'Physics', isPremium: false },
  { slug: 'freefall', title: 'Free Fall Simulator 📉', category: 'Physics', isPremium: false },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-sky-600 mb-4">
            🎓 EducationSimulation
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Interactive Physics &amp; Chemistry Learning for K-12 Students
          </p>
          <p className="text-gray-500">Explore, experiment, and master science through gamified simulations</p>
        </div>

        {/* Simulations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {simulations.map((sim) => (
            <Link key={sim.slug} href={`/simulations/${sim.slug}`}>
              <div className="p-6 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer border-2 border-sky-200">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-800">{sim.title}</h3>
                  {sim.isPremium && <span className="premium-badge">PREMIUM</span>}
                </div>
                <p className="text-sm text-gray-500 mb-4">{sim.category}</p>
                <button className="w-full bg-gradient-to-r from-sky-400 to-sky-600 text-white font-bold py-2 px-4 rounded-full hover:shadow-lg transition-all">
                  Launch Simulation →
                </button>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-3xl p-8 border-2 border-sky-200">
          <h2 className="text-2xl font-bold text-sky-600 mb-4">🎯 Why EducationSimulation?</h2>
          <ul className="space-y-3">
            <li className="flex items-center">
              <span className="text-2xl mr-3">✨</span>
              <span className="text-gray-700"><strong>Interactive Learning:</strong> Hands-on experimentation beats passive lectures</span>
            </li>
            <li className="flex items-center">
              <span className="text-2xl mr-3">🎮</span>
              <span className="text-gray-700"><strong>Gamified Experience:</strong> Playful design keeps students engaged and motivated</span>
            </li>
            <li className="flex items-center">
              <span className="text-2xl mr-3">🔬</span>
              <span className="text-gray-700"><strong>Real Physics:</strong> Accurate mathematical models teach genuine science concepts</span>
            </li>
            <li className="flex items-center">
              <span className="text-2xl mr-3">📊</span>
              <span className="text-gray-700"><strong>Live Telemetry:</strong> Real-time data visualization in the HUD panel</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
