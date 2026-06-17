"use client";
export default function LogicGates2D({ params }) {
  const result = params.inputA && params.inputB ? "ON" : "OFF";
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 bg-gradient-to-b from-slate-800 to-slate-900 text-white">
      <div className="text-3xl font-black tracking-widest text-sky-400">LOGIC GATE</div>
      
      <div className="flex gap-6">
        <div className={`p-8 rounded-full ${params.inputA ? 'bg-green-500 shadow-[0_0_20px_#22c55e]' : 'bg-slate-700'}`}>A</div>
        <div className={`p-8 rounded-full ${params.inputB ? 'bg-green-500 shadow-[0_0_20px_#22c55e]' : 'bg-slate-700'}`}>B</div>
      </div>

      <div className={`text-6xl font-black ${result === "ON" ? "text-yellow-400" : "text-gray-500"}`}>
        {result}
      </div>
    </div>
  );
}
        
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
