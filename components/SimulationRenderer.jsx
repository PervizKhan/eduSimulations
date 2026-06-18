"use client";
import React from 'react';
import dynamic from 'next/dynamic';

// ===== REGISTER ALL SIMULATION ENGINES =====
const engines = {
  // Add both slugs that point to the same engine
  '3d-projectile': dynamic(
    () => import('@/components/simulations/Projectile3D'),
    { 
      ssr: false, 
      loading: () => <LoadingScreen text="Booting 3D Physics Engine..." />
    }
  ),
  'projectile-3d': dynamic(
    () => import('@/components/simulations/Projectile3D'),
    { 
      ssr: false, 
      loading: () => <LoadingScreen text="Booting 3D Physics Engine..." />
    }
  ),
  
  // Coming soon - all 40+ simulations will be registered here:
  // 'rational-numbers': dynamic(() => import('@/components/simulations/RationalNumbers'), { ssr: false }),
  // ... etc
};

// ===== LOADING SCREEN =====
function LoadingScreen({ text }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900">
      <div className="text-4xl mb-4 animate-bounce">🚀</div>
      <div className="text-cyan-400 font-bold text-lg animate-pulse">{text}</div>
      <div className="mt-4 flex gap-2">
        <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
}

// ===== MAIN RENDERER =====
export default function SimulationRenderer({ slug, params }) {
  const EngineComponent = engines[slug];
  
  if (EngineComponent) {
    return <EngineComponent params={params} />;
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900">
      <div className="text-6xl mb-4">🧪</div>
      <div className="text-red-400 font-bold text-xl">Simulation Not Found</div>
      <div className="text-slate-400 text-sm mt-2">slug: {slug}</div>
      <div className="text-slate-500 text-xs mt-4">Available: {Object.keys(engines).join(', ')}</div>
    </div>
  );
}