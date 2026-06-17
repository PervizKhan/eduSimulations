'use client';

import dynamic from 'next/dynamic';

// Dynamically import engine with SSR disabled
const EngineLoader = dynamic(
  () => import('../physicsEngines/engineRegistry'),
  { 
    ssr: false,
    loading: () => (
      <div className="animate-pulse text-center py-20 text-sky-600 flex flex-col items-center gap-4">
        <div className="text-4xl">🔄</div>
        <div className="text-lg font-semibold">Loading Simulation Engine...</div>
        <div className="text-sm text-sky-400">Preparing your 3D experience</div>
      </div>
    )
  }
);

export default function EngineLoaderWrapper({ config, controlValues, onTelemetryUpdate, isPremiumUnlocked }) {
  return (
    <EngineLoader 
      config={config} 
      controlValues={controlValues} 
      onTelemetryUpdate={onTelemetryUpdate} 
      isPremiumUnlocked={isPremiumUnlocked} 
    />
  );
}