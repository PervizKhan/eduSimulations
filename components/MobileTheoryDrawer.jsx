"use client";
import React, { useState, useMemo } from 'react';

export default function MobileTheoryDrawer({ params, theoryConfig }) {
  const [isOpen, setIsOpen] = useState(false);

  // ===== CALCULATE REAL-TIME PHYSICS VALUES =====
  const physicsValues = useMemo(() => {
    const theta = (params.angle * Math.PI) / 180;
    const v0 = params.velocity;
    const g = params.gravity;
    
    if (theta === 0 || v0 === 0) {
      return { range: 0, maxHeight: 0, timeOfFlight: 0 };
    }
    
    const range = (v0 * v0 * Math.sin(2 * theta)) / g;
    const maxHeight = (v0 * v0 * Math.sin(theta) * Math.sin(theta)) / (2 * g);
    const timeOfFlight = (2 * v0 * Math.sin(theta)) / g;
    
    return {
      range: Math.max(0, range),
      maxHeight: Math.max(0, maxHeight),
      timeOfFlight: Math.max(0, timeOfFlight)
    };
  }, [params]);

  // Get first section for quick reference
  const quickSection = theoryConfig?.sections?.[0];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 md:hidden bg-slate-800/90 backdrop-blur-md text-cyan-400 p-3.5 rounded-full shadow-2xl border border-cyan-500/30 z-40 hover:bg-slate-700 transition active:scale-95"
        aria-label="Toggle theory panel"
      >
        {isOpen ? '✕' : '📚'}
      </button>

      {/* Drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Drawer Content */}
          <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg rounded-t-3xl border-t border-slate-700 p-4 max-h-[70vh] overflow-y-auto z-50 shadow-2xl md:hidden">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
                📚 Physics Theory
              </h2>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-slate-400 text-2xl hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {/* Quick Definition */}
            {quickSection && (
              <div className="bg-slate-800/50 rounded-xl p-3 mb-3">
                <h3 className="text-xs font-bold text-cyan-300 mb-1">
                  {quickSection.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {quickSection.content}
                </p>
                {quickSection.keyPoints && (
                  <ul className="mt-1 space-y-0.5">
                    {quickSection.keyPoints.slice(0, 2).map((point, i) => (
                      <li key={i} className="text-[10px] text-slate-400 flex items-start gap-1">
                        <span className="text-cyan-400">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Real-time Values */}
            <div className="bg-green-900/10 border border-green-700/30 rounded-xl p-3 mb-3">
              <h3 className="text-xs font-bold text-green-300 mb-2">📊 Current Values</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <span className="text-[9px] text-slate-400 block">Range</span>
                  <span className="text-sm text-white font-mono">
                    {physicsValues.range.toFixed(0)}m
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[9px] text-slate-400 block">Height</span>
                  <span className="text-sm text-white font-mono">
                    {physicsValues.maxHeight.toFixed(0)}m
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[9px] text-slate-400 block">Time</span>
                  <span className="text-sm text-white font-mono">
                    {physicsValues.timeOfFlight.toFixed(1)}s
                  </span>
                </div>
              </div>
            </div>

            {/* Key Formula */}
            <div className="bg-purple-900/10 border border-purple-700/30 rounded-xl p-3 mb-3">
              <p className="text-xs text-center text-white font-mono">
                R = v₀²·sin(2θ) / g = {physicsValues.range.toFixed(1)} m
              </p>
            </div>

            {/* Key Concepts (collapsible) */}
            <details className="bg-slate-800/30 rounded-xl p-2">
              <summary className="text-xs font-bold text-blue-300 cursor-pointer">
                💡 Key Concepts
              </summary>
              <ul className="mt-1 space-y-0.5 pl-3">
                <li className="text-[10px] text-slate-300">• Horizontal velocity is constant</li>
                <li className="text-[10px] text-slate-300">• Vertical velocity changes with gravity</li>
                <li className="text-[10px] text-slate-300">• Max range at 45°</li>
              </ul>
            </details>

            {/* Physics Tip */}
            <div className="mt-2 bg-yellow-900/10 border border-yellow-700/30 rounded-xl p-2">
              <p className="text-[10px] text-yellow-300 text-center">
                💡 <strong>Tip:</strong> Range is maximum at 45°
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}