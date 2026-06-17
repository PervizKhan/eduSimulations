"use client";
import React, { useState } from 'react';

export default function SimulationWrapper({ config, children }) {
  const [params, setParams] = useState(config.controls.reduce((acc, c) => ({ ...acc, [c.id]: c.default }), {}));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-sky-100 p-4 lg:p-8 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
        
        {/* Left: Interactive Playground */}
        <div className="flex-1">
          <div className="bg-white rounded-[2rem] p-2 shadow-2xl border-4 border-white">
            <div className="relative w-full h-[400px] lg:h-[500px] rounded-[1.5rem] overflow-hidden bg-gradient-to-tr from-sky-400 to-blue-600">
              {React.cloneElement(children, { params })}
            </div>
          </div>
          <div className="mt-4 text-center text-xs font-bold text-sky-800 opacity-60">
            ENGINEERED BY PERVEZ KHAN AFRIDI
          </div>
        </div>

        {/* Right: Charming Controls */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-sky-100">
            <h2 className="text-xl font-black text-sky-900 mb-6 text-center uppercase">Control Lab</h2>
            <div className="grid grid-cols-1 gap-6">
              {config.controls.map((ctrl) => (
                <div key={ctrl.id} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-sky-700">
                    <span>{ctrl.label}</span>
                    <span className="bg-sky-100 px-2 py-0.5 rounded-lg">{params[ctrl.id]}</span>
                  </div>
                  <input
                    type="range"
                    min={ctrl.min}
                    max={ctrl.max}
                    step={ctrl.step}
                    value={params[ctrl.id]}
                    onChange={(e) => setParams(p => ({ ...p, [ctrl.id]: parseFloat(e.target.value) }))}
                    className="w-full h-3 rounded-full appearance-none cursor-pointer bg-sky-200 accent-orange-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
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
