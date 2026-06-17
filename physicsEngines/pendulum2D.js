// physicsEngines/pendulum2D.js
'use client';

import { useEffect, useRef } from 'react';
// Change from @/lib/physicsUtils to relative path
import { formatTelemetry } from '../lib/physicsUtils';

export default function Pendulum2D({ config, controls, isRunning }) {
  const canvasRef = useRef(null);
  // ... rest of your pendulum code
}