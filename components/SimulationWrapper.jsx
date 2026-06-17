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
    <div className="flex flex-col lg:flex-row gap-4 p-4 max-w-[1600px] mx-auto min-h-screen bg-sky-50 font-sans">
      
      {/* 📘 COLUMN 1: Left Bar - Science Journal (Auto hidden on Mobile for cleaner view) */}
      <div className="hidden lg:flex w-72 bg-white border-3 border-sky-200 rounded-3xl p-5 shadow-md flex-col gap-4">
        <h3 className="text-lg font-extrabold text-sky-800 border-b-2 border-sky-100 pb-2 flex items-center gap-2">
          📘 Science Journal
        </h3>
        <div className="text-sm text-slate-600 flex flex-col gap-3 overflow-y-auto max-h-[65vh] pr-1">
          {config.slug === '3d-projectile' ? (
            <>
              <p className="bg-sky-50 p-3 rounded-xl border border-sky-100">
                <strong>Projectile Motion</strong> tab hoti hai hai jab kisi object ko hawa mein throw kiya jaye aur us par sirf gravity chale. Iska rasta hamesha ek <strong>Parabola</strong> curve banta hai!
              </p>
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 flex flex-col gap-2">
                <h4 className="font-bold text-amber-800 text-xs uppercase tracking-wider">📐 Key Formulas</h4>
                <div className="p-2 bg-white rounded-lg border border-amber-100 font-mono text-[11px] flex flex-col gap-2 text-slate-700">
                  <p>H = (v₀² · sin²θ) / 2g</p>
                  <p>R = (v₀² · sin(2θ)) / g</p>
                  <p>T = (2v₀ · sinθ) / g</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="bg-sky-50 p-3 rounded-xl border border-sky-100">
                <strong>Logic Gates</strong> computer hardware ki buniyad hain. Yeh circuits binary signals (0 aur 1) par Boolean math apply karke computer ko decision-making power dete hain.
              </p>
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 flex flex-col gap-2">
                <h4 className="font-bold text-amber-800 text-xs uppercase tracking-wider">💡 Logic Rules</h4>
                <div className="p-2 bg-white rounded-lg border border-amber-100 font-mono text-[11px] flex flex-col gap-1.5 text-slate-700">
                  <p><strong>AND:</strong> Dono inputs 1 honge toh output 1 hoga.</p>
                  <p><strong>OR:</strong> Koi ek input bhi 1 ho toh output 1 hoga.</p>
                  <p><strong>XOR:</strong> Dono inputs different honge toh output 1 hoga.</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 🎮 COLUMN 2: Center Viewport - Core Canvas Box */}
      <div className="flex-1 flex flex-col gap-3 relative">
        <h1 className="text-xl font-bold text-sky-900 bg-white p-3 rounded-2xl border-2 border-sky-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>{config.title}</span>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-semibold whitespace-nowrap">
            ✨ Interactive Engine V2
          </span>
        </h1>
        
        {/* Responsive Canvas Box */}
        <div className="relative w-full h-[380px] sm:h-[450px] lg:h-[500px] bg-sky-200 border-4 border-sky-200 rounded-3xl overflow-hidden shadow-md">
          {React.Children.map(children, child => 
            React.isValidElement(child) ? React.cloneElement(child, { params }) : child
          )}
        </div>

        {/* ⭐ SIGNATURE BRANDING CREDIT FOOTER */}
        <div className="w-full text-center py-2 text-xs font-bold tracking-wide text-sky-700/60 font-mono bg-white rounded-xl border border-sky-100 shadow-xs">
          🚀 Designed & Engineered by <span className="text-orange-500 font-extrabold uppercase">Pervez Khan Afridi</span>
        </div>
      </div>

      {/* ⚙️ COLUMN 3: Right Bar - Control Sliders Dashboard */}
      <div className="w-full lg:w-72 bg-white border-3 border-sky-200 rounded-3xl p-5 shadow-md flex flex-col gap-5">
        <h3 className="text-lg font-extrabold text-sky-700 text-center border-b-2 border-sky-100 pb-2">
          ⚙️ Lab Settings
        </h3>
        
        <div className="flex flex-col gap-4">
          {config.controls.map((ctrl) => (
            <div key={ctrl.id} className="flex flex-col gap-1.5">
              <div className="flex justify-between font-bold text-xs text-sky-800">
                <span>{ctrl.label}</span>
                <span className="bg-sky-100 px-2 py-0.5 rounded-lg text-sky-600 font-mono">
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

    </div>
  );
}