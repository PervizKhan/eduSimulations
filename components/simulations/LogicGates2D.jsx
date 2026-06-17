"use client";
import React from 'react';

export default function LogicGates2D({ params }) {
  const result = (params.inputA && params.inputB) ? "ON" : "OFF";
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 bg-slate-900 text-white">
      <div className="text-2xl font-black text-sky-400">LOGIC GATE PLAYGROUND</div>
      <div className="flex gap-8">
        <div className={`p-8 rounded-full ${params.inputA ? 'bg-green-500' : 'bg-slate-700'}`}>A</div>
        <div className={`p-8 rounded-full ${params.inputB ? 'bg-green-500' : 'bg-slate-700'}`}>B</div>
      </div>
      <div className={`text-6xl font-black ${result === "ON" ? "text-yellow-400" : "text-gray-500"}`}>
        {result}
      </div>
    </div>
  );
}
