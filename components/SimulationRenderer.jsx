"use client";
import React from 'react';
import dynamic from 'next/dynamic';

// Dynamic client lazy loaders mapping configurations
const Projectile3DCanvas = dynamic(
  () => import('@/components/simulations/Projectile3D'),
  { 
    ssr: false, 
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-sky-100 text-sky-600 font-bold">
        🚀 Booting Up 3D Physics Engine Laboratory...
      </div>
    )
  }
);

const LogicGatesCanvas = dynamic(
  () => import('@/components/simulations/LogicGates2D'),
  { 
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-sky-400 font-bold">
        💻 Initializing Logic Gate Gates Playground...
      </div>
    )
  }
);

export default function SimulationRenderer({ slug, params }) {
  if (slug === '3d-projectile') {
    return <Projectile3DCanvas params={params} />;
  }
  
  if (slug === 'logic-gates') {
    return <LogicGatesCanvas params={params} />;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center text-red-500 font-bold bg-white">
      ❌ Simulation engine module not found.
    </div>
  );
}