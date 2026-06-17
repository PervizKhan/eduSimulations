'use client';

import { useEffect, useRef } from 'react';
import { formatTelemetry } from '@/lib/physicsUtils';

export default function Freefall2D({ config, controls, isRunning }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    time: 0,
    velocity: 0,
    position: 0,
    maxVelocity: 0,
    landed: false,
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      const state = stateRef.current;
      const height = (controls.height || 100) * 2; // Scale for visualization
      const g = controls.g || 9.8;
      const airResistance = controls.air_resistance || 0;
      const dt = 0.016;

      if (isRunning && !state.landed) {
        state.time += dt;
        const a = g * (1 - airResistance);
        state.velocity = a * state.time;
        state.position = height - 0.5 * a * state.time * state.time;

        state.maxVelocity = Math.max(state.maxVelocity, state.velocity);

        if (state.position <= 0) {
          state.position = 0;
          state.landed = true;
        }
      } else if (!isRunning) {
        state.time = 0;
        state.velocity = 0;
        state.position = height;
        state.maxVelocity = 0;
        state.landed = false;
      }

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background - Sky and Ground
      ctx.fillStyle = '#bae6fd';
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.7);

      ctx.fillStyle = '#4ade80';
      ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);

      // Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Scale indicators (height markers)
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 12px Arial';
      for (let i = 0; i <= height; i += 50) {
        const y = canvas.height * 0.7 - (i / height) * (canvas.height * 0.6);
        ctx.fillText(`${(i / 2).toFixed(0)}m`, 10, y);
      }

      // Falling object
      const objectY =
        canvas.height * 0.7 - (state.position / height) * (canvas.height * 0.6);
      const objectX = canvas.width / 2;

      // Velocity trail (fading lines)
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        const alpha = (5 - i) / 5 * 0.3;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(objectX, objectY - i * 10, 8, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(objectX, canvas.height * 0.7, 30, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Object
      ctx.fillStyle = '#ff6b6b';
      ctx.beginPath();
      ctx.arc(objectX, objectY, 12, 0, Math.PI * 2);
      ctx.fill();

      // Velocity indicator arrow
      if (state.velocity > 0) {
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('↓', objectX - 8, objectY + 40);
      }

      // HUD Telemetry
      const finalVelocity = Math.sqrt(2 * g * (height / 2));
      const impactTime = Math.sqrt(2 * (height / 2) / g);

      const telemetry = formatTelemetry({
        time: state.time,
        speed: state.velocity,
        positionY: state.position / 2,
        maxHeight: height / 2,
        totalFlightTime: impactTime,
      });

      // HUD Panel
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillRect(canvas.width - 260, 20, 240, 260);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.strokeRect(canvas.width - 260, 20, 240, 260);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 14px monospace';
      ctx.fillText('📊 FREEFALL DATA', canvas.width - 240, 45);

      const textLines = [
        `Time: ${telemetry.time}s`,
        `Position: ${telemetry.positionY.toFixed(2)}m`,
        `Velocity: ${telemetry.speed.toFixed(3)}m/s`,
        `Acceleration: ${g.toFixed(2)}m/s²`,
        `Max Velocity: ${state.maxVelocity.toFixed(3)}m/s`,
        `Impact Time: ${impactTime.toFixed(3)}s`,
        `Drop Height: ${(height / 2).toFixed(2)}m`,
      ];

      if (state.landed) {
        textLines.push(`✅ LANDED (${state.time.toFixed(3)}s)`);
      }

      ctx.font = '12px monospace';
      ctx.fillStyle = '#0369a1';
      textLines.forEach((line, i) => {
        ctx.fillText(line, canvas.width - 240, 65 + i * 22);
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isRunning, controls]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        borderRadius: '1.5rem',
      }}
    />
  );
}
