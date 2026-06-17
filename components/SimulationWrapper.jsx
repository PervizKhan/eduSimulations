"use client";
import React, { useState } from 'react';

export default function SimulationWrapper({ config, children }) {
  const initialParams = {};
  config.controls.forEach(ctrl => {
    initialParams[ctrl.id] = ctrl.default;
  });

  const [params, setParams] = useState(initialParams);

  const handleSliderChange = (id, val) => {
    setParams(prev => ({ ...prev, [id]: parseFloat(val) }));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4 max-w-[1600px] mx-auto min-h-screen bg-sky-50">
      
      {/* 📘 COLUMN 1: Left Bar - Science Theory Lab */}
      <div className="w-full lg:w-72 bg-white border-3 border-sky-200 rounded-3xl p-5 shadow-md flex flex-col gap-4">
        <h3 className="text-lg font-extrabold text-sky-800 border-b-2 border-sky-100 pb-2 flex items-center gap-2">
          📘 Science Journal
        </h3>
        <div className="text-sm text-slate-600 flex flex-col gap-3 overflow-y-auto max-h-[75vh] pr-1">
          <p className="bg-sky-50 p-3 rounded-xl border border-sky-100">
            <strong>Projectile Motion</strong> tab hoti hai jab kisi object ko hawa mein throw kiya jaye aur us par sirf gravity ka zor chale. Iska rasta hamesha ek <strong>Parabola</strong> curve banta hai!
          </p>
          
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 flex flex-col gap-2">
            <h4 className="font-bold text-amber-800 text-xs uppercase tracking-wider">📐 Key Formulas</h4>
            <div className="p-2 bg-white rounded-lg border border-amber-100 font-mono text-[11px] flex flex-col gap-3 text-slate-700 overflow-x-auto">
              <div>
                <p className="font-sans text-[10px] text-amber-600 font-semibold mb-0.5">Max Height (H):</p>
                <p className="p-1.5 bg-slate-50 rounded text-center font-bold text-slate-800">
                  {"H = (v₀² · sin²θ) / 2g"}
                </p>
              </div>
              <div className="border-t border-slate-100 pt-1">
                <p className="font-sans text-[10px] text-amber-600 font-semibold mb-0.5">Total Range (R):</p>
                <p className="p-1.5 bg-slate-50 rounded text-center font-bold text-slate-800">
                  {"R = (v₀² · sin(2θ)) / g"}
                </p>
              </div>
              <div className="border-t border-slate-100 pt-1">
                <p className="font-sans text-[10px] text-amber-600 font-semibold mb-0.5">Flight Time (T):</p>
                <p className="p-1.5 bg-slate-50 rounded text-center font-bold text-slate-800">
                  {"T = (2v₀ · sinθ) / g"}
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-slate-400 italic">
            💡 Notice karein ke Launch Angle badalne se kis tarah predicted target curve change hota hai!
          </p>
        </div>
      </div>

      {/* 🎮 COLUMN 2: Center Viewport - The Live Canvas Sandbox */}
      <div className="flex-1 flex flex-col gap-3 relative">
        <h1 className="text-xl font-bold text-sky-900 bg-white p-3 rounded-2xl border-2 border-sky-200 shadow-sm flex justify-between items-center">
          <span>{config.title}</span>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-semibold">
            ✨ Interactive Engine V2
          </span>
        </h1>
        
        <div className="relative w-full h-[500px] bg-sky-200 border-4 border-sky-200 rounded-3xl overflow-hidden shadow-md">
          {React.Children.map(children, child => 
            React.isValidElement(child) ? React.cloneElement(child, { params }) : child
          )}
        </div>
      </div>

      {/* ⚙️ COLUMN 3: Right Bar - Controls Menu */}
      <div className="w-full lg:w-72 bg-white border-3 border-sky-200 rounded-3xl p-5 shadow-md flex flex-col gap-5">
        <h3 className="text-lg font-extrabold text-sky-700 text-center border-b-2 border-sky-100 pb-2">
          ⚙️ Lab Settings
        </h3>
        
        {config.controls.map((ctrl) => (
          <div key={ctrl.id} className="flex flex-col gap-1.5">
            <div className="flex justify-between font-bold text-xs text-sky-800">
              <span>{ctrl.label}</span>
              <span className="bg-sky-100 px-2 py-0.5 rounded-lg text-sky-600">
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
              className="w-full h-2 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-orange-400"
            />
          </div>
        ))}
      </div>

    </div>
  );
}