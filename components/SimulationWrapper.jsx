"use client";
import React, { useState, useEffect } from 'react';
import TheoryPanel from './TheoryPanel';
import MobileTheoryDrawer from './MobileTheoryDrawer';
import theoryConfig from '@/config/theory/projectile-motion.json';

export default function SimulationWrapper({ config, children }) {
  // Initialize params from config
  const initialParams = {};
  config.controls.forEach(ctrl => {
    initialParams[ctrl.id] = ctrl.default;
  });

  const [params, setParams] = useState(initialParams);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSliderChange = (id, val) => {
    setParams(prev => ({ ...prev, [id]: parseFloat(val) }));
  };

  const handleReset = () => {
    setParams(initialParams);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-lg md:text-2xl font-bold text-cyan-400 flex items-center gap-2">
            🎯 {config.title}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden md:inline">
              Class 9-12 Physics
            </span>
            <button
              onClick={handleReset}
              className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg transition flex items-center gap-1"
            >
              🔄 Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto p-3 md:p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* LEFT: Simulation + Controls */}
          <div className="flex-1 min-w-0">
            {/* Simulation Viewport */}
            <div className="relative w-full aspect-video lg:h-[600px] bg-slate-900/50 border-2 border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
              {React.Children.map(children, child => 
                React.isValidElement(child) ? React.cloneElement(child, { params }) : child
              )}
            </div>

            {/* Controls (Desktop & Mobile) */}
            <div className="mt-3 bg-slate-800/95 backdrop-blur-md rounded-xl p-4 border border-slate-700 shadow-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-cyan-400">🎮 Controls</h3>
                <button
                  onClick={handleReset}
                  className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 rounded-lg transition lg:hidden"
                >
                  🔄 Reset
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {config.controls.map((ctrl) => (
                  <div key={ctrl.id} className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">{ctrl.label}</span>
                      <span className="text-cyan-400 font-bold bg-slate-700/50 px-2 py-0.5 rounded">
                        {params[ctrl.id]} {ctrl.unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={ctrl.min}
                      max={ctrl.max}
                      step={ctrl.step}
                      value={params[ctrl.id]}
                      onChange={(e) => handleSliderChange(ctrl.id, e.target.value)}
                      className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Theory Panel (Desktop) */}
          {!isMobile && (
            <div className="w-80 xl:w-96 flex-shrink-0">
              <TheoryPanel params={params} theoryConfig={theoryConfig} />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Theory Drawer */}
      <MobileTheoryDrawer params={params} theoryConfig={theoryConfig} />
    </div>
  );
}