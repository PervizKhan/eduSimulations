"use client";
import React, { useState, useEffect } from 'react';

export default function LogicGates2D({ params }) {
  const [result, setResult] = useState(0);
  const [gateName, setGateName] = useState("AND");

  useEffect(() => {
    const a = params?.inputA || 0;
    const b = params?.inputB || 0;
    const gate = params?.gateType || 1;

    if (gate === 1) {
      setResult(a && b ? 1 : 0);
      setGateName("AND");
    } else if (gate === 2) {
      setResult(a || b ? 1 : 0);
      setGateName("OR");
    } else {
      setResult(a !== b ? 1 : 0);
      setGateName("XOR");
    }
  }, [params]);

  return (
    <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center p-4 relative select-none">
      {/* Live Telemetry Display */}
      <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 font-mono text-[11px] text-sky-400 shadow-md">
        STATUS: {result === 1 ? '⚡ POWER FLOWING' : '🌑 NO POWER'}
      </div>

      {/* SVG Vector Drawing Workspace */}
      <svg viewBox="0 0 400 200" className="w-full max-w-md drop-shadow-2xl">
        {/* Dynamic Input Wires */}
        <line x1="50" y1="60" x2="150" y2="60" stroke={params?.inputA ? "#fbbf24" : "#334155"} strokeWidth="4" />
        <line x1="50" y1="140" x2="150" y2="140" stroke={params?.inputB ? "#fbbf24" : "#334155"} strokeWidth="4" />
        
        {/* Dynamic Output Wire */}
        <line x1="250" y1="100" x2="320" y2="100" stroke={result ? "#fbbf24" : "#334155"} strokeWidth="4" className={result ? "animate-pulse" : ""} />

        {/* Gate Housing Block */}
        <rect x="150" y="50" width="100" height="100" rx="15" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />
        <text x="200" y="108" textAnchor="middle" fill="#38bdf8" className="font-extrabold text-xl tracking-widest font-sans">{gateName}</text>

        {/* Input Interactive Indicator Pins */}
        <circle cx="50" cy="60" r="8" fill={params?.inputA ? "#fbbf24" : "#334155"} />
        <circle cx="50" cy="140" r="8" fill={params?.inputB ? "#fbbf24" : "#334155"} />
        <text x="25" y="64" fill="#94a3b8" className="text-[12px] font-bold font-mono">A</text>
        <text x="25" y="144" fill="#94a3b8" className="text-[12px] font-bold font-mono">B</text>

        {/* The Output Terminal Logic Bulb */}
        <circle cx="350" cy="100" r="20" fill={result ? "#fbbf24" : "#1e293b"} stroke={result ? "#f59e0b" : "#334155"} strokeWidth="4" />
        <text x="350" y="104" textAnchor="middle" fill={result ? "#92400e" : "#64748b"} className="font-extrabold text-[10px] font-mono">{result ? 'ON' : 'OFF'}</text>
      </svg>

      <div className="mt-6 text-center">
        <p className="text-sky-400 text-xs font-mono uppercase tracking-wider">
          {result ? '🎉 Circuit Completed!' : '⚡ Flip the sliders to guide current'}
        </p>
      </div>
    </div>
  );
}