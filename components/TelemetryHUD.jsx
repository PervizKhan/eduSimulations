'use client';

export default function TelemetryHUD({ telemetry }) {
  const { time, speed, position, maxHeight, totalRange, flightTime } = telemetry;

  // Format numbers for child-friendly display
  const fmt = (val, decimals = 1) => {
    if (val === undefined || val === null) return '—';
    return Number(val).toFixed(decimals);
  };

  return (
    <div className="absolute top-3 right-3 z-10 bg-sky-900/85 backdrop-blur-md rounded-2xl p-4 min-w-[200px] border-2 border-white/30 shadow-xl">
      <div className="text-white text-sm space-y-1.5 font-mono">
        <div className="flex justify-between items-center border-b border-white/20 pb-1.5 mb-1.5">
          <span className="text-sky-300 text-xs uppercase tracking-wider font-bold">📡 Telemetry</span>
          <span className="text-sky-200 text-xs">live</span>
        </div>

        <DataRow label="⏱ Time" value={`${fmt(time)}s`} />
        <DataRow label="🚀 Speed" value={`${fmt(speed)} m/s`} />
        <DataRow
          label="📍 Position"
          value={`(${fmt(position?.x)}, ${fmt(position?.y)}, ${fmt(position?.z)})`}
          mono
        />
        <DataRow label="📈 Max Height" value={`${fmt(maxHeight)} m`} />
        <DataRow label="📏 Total Range" value={`${fmt(totalRange)} m`} />
        <DataRow label="🕐 Flight Time" value={`${fmt(flightTime)}s`} />
      </div>
    </div>
  );
}

function DataRow({ label, value, mono = false }) {
  return (
    <div className="flex justify-between items-center gap-4 text-xs">
      <span className="text-sky-300">{label}</span>
      <span className={`text-white font-semibold ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  );
}