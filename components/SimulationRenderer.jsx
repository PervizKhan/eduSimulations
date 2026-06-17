"use client";
import React from 'react';
import dynamic from 'next/dynamic';

// Safe client-side dynamic import inside a Client Component
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

export default function SimulationRenderer({ slug, params }) {
  // This component receives 'params' automatically from SimulationWrapper's React.cloneElement
  if (slug === '3d-projectile') {
    return <Projectile3DCanvas params={params} />;
  }

  // Future daily simulations can be registered here:
  // if (slug === 'basic-pendulum') return <Pendulum2DCanvas params={params} />;

  return (
    <div className="absolute inset-0 flex items-center justify-center text-red-500 font-bold">
      ❌ Simulation engine module not found.
    </div>
  );
}