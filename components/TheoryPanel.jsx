"use client";
import React, { useState, useMemo } from 'react';

import projectileTheory from '@/config/theory/projectile-motion.json';
import cartesianTheory from '@/config/theory/cartesian-coordinates.json';


export default function TheoryPanel({ params, theoryConfig }) {
  const [showDerivations, setShowDerivations] = useState(false);
  const [activeSection, setActiveSection] = useState('definition');

  // ===== CALCULATE REAL-TIME PHYSICS VALUES =====
  const physicsValues = useMemo(() => {
    const theta = (params.angle * Math.PI) / 180;
    const v0 = params.velocity;
    const g = params.gravity;
    
    if (theta === 0 || v0 === 0) {
      return {
        range: 0,
        maxHeight: 0,
        timeOfFlight: 0,
        horizontalVelocity: 0,
        verticalVelocity: 0,
        theta: theta
      };
    }
    
    const range = (v0 * v0 * Math.sin(2 * theta)) / g;
    const maxHeight = (v0 * v0 * Math.sin(theta) * Math.sin(theta)) / (2 * g);
    const timeOfFlight = (2 * v0 * Math.sin(theta)) / g;
    const horizontalVelocity = v0 * Math.cos(theta);
    const verticalVelocity = v0 * Math.sin(theta);
    
    return {
      range: Math.max(0, range),
      maxHeight: Math.max(0, maxHeight),
      timeOfFlight: Math.max(0, timeOfFlight),
      horizontalVelocity: horizontalVelocity,
      verticalVelocity: verticalVelocity,
      theta: theta
    };
  }, [params]);

  // ===== GET CURRENT SECTION =====
  const currentSection = theoryConfig?.sections?.find(s => s.id === activeSection) || theoryConfig?.sections?.[0];

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl p-4 h-full flex flex-col overflow-hidden shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-3">
        <h2 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
          📚 Physics Theory
        </h2>
        <span className="text-xs bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20">
          Class 9-12
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 mb-3 scrollbar-thin scrollbar-thumb-slate-600">
        {theoryConfig?.sections?.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition ${
              activeSection === section.id
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            {section.title.replace(/^[📖📐💡🌍📝]+\s*/, '')}
          </button>
        ))}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar">
        
        {/* ===== SECTION CONTENT ===== */}
        {currentSection && (
          <>
            {/* Title */}
            <h3 className="text-sm font-bold text-slate-200">
              {currentSection.title}
            </h3>

            {/* Content */}
            {currentSection.content && (
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {currentSection.content}
              </p>
            )}

            {/* Key Points */}
            {currentSection.keyPoints && (
              <ul className="space-y-1">
                {currentSection.keyPoints.map((point, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-cyan-400 text-sm">▸</span>
                    <span dangerouslySetInnerHTML={{ __html: point }} />
                  </li>
                ))}
              </ul>
            )}

            {/* Formulas */}
            {currentSection.formulas && (
              <div className="space-y-2">
                {currentSection.formulas.map((formula, i) => (
                  <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs text-slate-400 font-medium">
                        {formula.name}
                      </span>
                      <span className="text-xs text-cyan-400 font-mono bg-slate-900/50 px-2 py-0.5 rounded">
                        {formula.formula}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {formula.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Points */}
            {currentSection.points && (
              <ul className="space-y-1">
                {currentSection.points.map((point, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-green-400 text-sm">✓</span>
                    <span dangerouslySetInnerHTML={{ __html: point }} />
                  </li>
                ))}
              </ul>
            )}

            {/* Examples */}
            {currentSection.examples && (
              <div className="flex flex-wrap gap-1">
                {currentSection.examples.map((example, i) => (
                  <span key={i} className="text-xs bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded-full">
                    {example}
                  </span>
                ))}
              </div>
            )}

            {/* Derivations */}
            {currentSection.steps && (
              <div className="space-y-1">
                <button
                  onClick={() => setShowDerivations(!showDerivations)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  {showDerivations ? '▼' : '▶'} Show Derivations
                </button>
                {showDerivations && (
                  <ol className="list-decimal list-inside space-y-1 pl-2">
                    {currentSection.steps.map((step, i) => (
                      <li key={i} className="text-xs text-slate-300">
                        {step}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            )}
          </>
        )}

        {/* ===== REAL-TIME PHYSICS VALUES ===== */}
        <div className="border-t border-slate-700 pt-3 mt-3">
          <h3 className="text-xs font-bold text-cyan-400 mb-2 flex items-center gap-2">
            📊 Real-Time Values
            <span className="text-[10px] text-green-400 animate-pulse">● live</span>
          </h3>
          
          <div className="grid grid-cols-2 gap-1.5">
            <div className="bg-slate-800/50 rounded-lg p-2">
              <span className="text-[10px] text-slate-400 block">Range</span>
              <span className="text-sm text-white font-mono">
                {physicsValues.range.toFixed(1)} m
              </span>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-2">
              <span className="text-[10px] text-slate-400 block">Max Height</span>
              <span className="text-sm text-white font-mono">
                {physicsValues.maxHeight.toFixed(1)} m
              </span>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-2">
              <span className="text-[10px] text-slate-400 block">Flight Time</span>
              <span className="text-sm text-white font-mono">
                {physicsValues.timeOfFlight.toFixed(1)} s
              </span>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-2">
              <span className="text-[10px] text-slate-400 block">vₓ (horizontal)</span>
              <span className="text-sm text-white font-mono">
                {physicsValues.horizontalVelocity.toFixed(1)} m/s
              </span>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-2 col-span-2">
              <span className="text-[10px] text-slate-400 block">vᵧ (vertical)</span>
              <span className="text-sm text-white font-mono">
                {physicsValues.verticalVelocity.toFixed(1)} m/s
              </span>
            </div>
          </div>

          {/* Formula Check */}
          <div className="mt-2 bg-green-900/10 border border-green-700/30 rounded-lg p-2">
            <p className="text-[10px] text-green-300 font-mono text-center">
              R = v₀²·sin(2θ) / g = {physicsValues.range.toFixed(1)} m
            </p>
          </div>
        </div>

        {/* Physics Tip */}
        <div className="bg-yellow-900/10 border border-yellow-700/30 rounded-lg p-2 mt-2">
          <p className="text-[10px] text-yellow-300 text-center">
            💡 <strong>Tip:</strong> Range is maximum when angle = 45°
          </p>
        </div>
      </div>
    </div>
  );
}