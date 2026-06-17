'use client';
import Link from 'next/link';

const simulations = [
  { slug: '3d-projectile', title: '3D Projectile Playground 🚀', category: 'Physics' },
  { slug: 'logic-gates', title: 'Logic Gates Explorer 💻', category: 'Computer Science' },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-sky-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-sky-900 mb-6">
            Learn General Sciences & CS with <br />
            <span className="text-orange-500">Pervez Khan Afridi</span>
          </h1>
          <p className="text-xl text-gray-600 mb-2">Interactive Laboratory for Next-Gen Learners</p>
          <p className="text-gray-500">Master complex concepts through live, gamified simulations.</p>
        </div>

        {/* Simulations Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {simulations.map((sim) => (
            <Link key={sim.slug} href={`/simulations/${sim.slug}`}>
              <div className="p-8 bg-white rounded-3xl shadow-md border-2 border-sky-100 hover:border-sky-300 transition-all hover:scale-[1.02]">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{sim.title}</h3>
                <p className="text-sm text-sky-600 font-semibold mb-6 uppercase tracking-wider">{sim.category}</p>
                <button className="w-full bg-sky-600 text-white font-bold py-3 px-6 rounded-full hover:bg-sky-700 transition-all">
                  Launch Simulation →
                </button>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center py-10 border-t border-sky-200">
          <p className="text-sky-800 font-bold">© 2026 Developed by Pervez Khan Afridi</p>
        </div>
      </div>
    </main>
  );
}