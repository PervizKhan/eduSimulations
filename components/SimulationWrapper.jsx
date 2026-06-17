"use client";
import React, { useState } from 'react';

export default function SimulationWrapper({ config, children }) {
  const [params, setParams] = useState(config.controls.reduce((acc, c) => ({ ...acc, [c.id]: c.default }), {}));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-sky-100 p-4 lg:p-8 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="bg-white rounded-[2rem] p-2 shadow-2xl border-4 border-white">
            <div className="relative w-full h-[400px] lg:h-[500px] rounded-[1.5rem] overflow-hidden bg-gradient-to-tr from-sky-400 to-blue-600">
              {React.cloneElement(children, { params })}
            </div>
          </div>
          <p className="mt-4 text-center text-xs font-bold text-sky-800 opacity-60">
            ENGINEERED BY PERVEZ KHAN AFRIDI
          </p>
        </div>
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
                  <input type="range" min={ctrl.min} max={ctrl.max} step={ctrl.step} value={params[ctrl.id]} onChange={(e) => setParams(p => ({ ...p, [ctrl.id]: parseFloat(e.target.value) }))} className="w-full h-3 rounded-full appearance-none cursor-pointer bg-sky-200 accent-orange-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
