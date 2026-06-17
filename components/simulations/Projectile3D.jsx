"use client";
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Projectile3D({ params }) {
  const mountRef = useRef(null);
  const paramsRef = useRef(params);
  
  // Game states managed inside React for the HUD buttons
  const [isFlying, setIsFlying] = useState(false);
  const isFlyingRef = useRef(false);
  const triggerResetRef = useRef(false);

  // Sync sliders and controls smoothly without restarting the 3D engine
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const handleLaunch = () => {
    if (isFlyingRef.current) return;
    triggerResetRef.current = true; // Reset to start position first
    setTimeout(() => {
      isFlyingRef.current = true;
      setIsFlying(true);
    }, 50);
  };

  const handleReset = () => {
    isFlyingRef.current = false;
    setIsFlying(false);
    triggerResetRef.current = true;
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 1. VIBRANT CYBERPUNK SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0f19); // Rich deep midnight blue
    scene.fog = new THREE.FogExp2(0x0b0f19, 0.015);

    // 2. STABLE GAME ISOMETRIC CAMERA
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(-5, 12, 30);

    // 3. SHARP RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // 4. RICH LIGHTING
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const neonLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    neonLight.position.set(10, 30, 10);
    scene.add(neonLight);

    // 5. GRID & SCI-FI FLOOR
    const grid = new THREE.GridHelper(300, 100, 0x0ea5e9, 0x1e293b);
    grid.position.y = 0;
    scene.add(grid);

    // 6. CHARMING CANNON
    const cannonGeometry = new THREE.CylinderGeometry(0.4, 0.6, 3, 16);
    cannonGeometry.translate(0, 1.5, 0); // Rotate around base
    const cannon = new THREE.Mesh(cannonGeometry, new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 }));
    cannon.position.set(0, 0, 0);
    scene.add(cannon);

    // 7. GLOWING TOY BALL
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 0.6 })
    );
    ball.position.set(0, 0, 0);
    scene.add(ball);

    // 8. LIVE PREDICTION TRAJECTORY LINE
    const maxPoints = 150;
    const trajectoryGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(maxPoints * 3);
    trajectoryGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const trajectoryMat = new THREE.LineDashedMaterial({ color: 0x38bdf8, dashSize: 0.5, gapSize: 0.3 });
    const trajectoryLine = new THREE.Line(trajectoryGeo, trajectoryMat);
    scene.add(trajectoryLine);

    // 9. TARGET RETICLE
    const target = new THREE.Mesh(
      new THREE.RingGeometry(1.2, 1.8, 32),
      new THREE.MeshBasicMaterial({ color: 0x22c55e, side: THREE.DoubleSide })
    );
    target.rotation.x = -Math.PI / 2;
    target.position.y = 0.05;
    scene.add(target);

    // --- MAIN GAME LOOP ---
    let t = 0;
    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Extract slider values dynamically (Supports angle, velocity, and custom gravity)
      const v0 = paramsRef.current.velocity ?? 15;
      const angleDeg = paramsRef.current.angle ?? 45;
      const g = paramsRef.current.gravity ?? 9.8;
      const angleRad = (angleDeg * Math.PI) / 180;

      // Real-time updates to Cannon and Target based on Sliders
      cannon.rotation.z = -((Math.PI / 2) - angleRad);
      const calculatedMaxRange = (v0 * v0 * Math.sin(2 * angleRad)) / g;
      target.position.x = calculatedMaxRange;

      // DRAW LIVE PREDICTION PATH (Angry Birds Style)
      const pathPositions = trajectoryLine.geometry.attributes.position.array;
      let stepTime = 0;
      for (let i = 0; i < maxPoints; i++) {
        const px = v0 * Math.cos(angleRad) * stepTime;
        const py = (v0 * Math.sin(angleRad) * stepTime) - (0.5 * g * stepTime * stepTime);
        
        pathPositions[i * 3] = px;
        pathPositions[i * 3 + 1] = Math.max(py, 0);
        pathPositions[i * 3 + 2] = 0;

        if (py < 0 && stepTime > 0.1) {
          // Fill the rest with the impact point
          for (let j = i; j < maxPoints; j++) {
            pathPositions[j * 3] = px;
            pathPositions[j * 3 + 1] = 0;
            pathPositions[j * 3 + 2] = 0;
          }
          break;
        }
        stepTime += 0.05;
      }
      trajectoryLine.geometry.attributes.position.needsUpdate = true;

      // FORCE RESET TRIGGER
      if (triggerResetRef.current) {
        t = 0;
        ball.position.set(0, 0, 0);
        triggerResetRef.current = false;
      }

      // FLYING ANIMATION LOGIC (Only runs when PLAY is active)
      if (isFlyingRef.current) {
        t += 0.04; // Playback speed
        const currentX = v0 * Math.cos(angleRad) * t;
        let currentY = (v0 * Math.sin(angleRad) * t) - (0.5 * g * t * t);

        if (currentY >= 0) {
          ball.position.set(currentX, currentY, 0);
          
          // Update HUD Numbers directly into DOM for maximum FPS performance
          const domX = document.getElementById('game-hud-x');
          const domY = document.getElementById('game-hud-y');
          const domT = document.getElementById('game-hud-t');
          if (domX) domX.innerText = currentX.toFixed(1);
          if (domY) domY.innerText = currentY.toFixed(1);
          if (domT) domT.innerText = t.toFixed(2);
        } else {
          // Ball hit the floor/target
          ball.position.set(calculatedMaxRange, 0, 0);
          isFlyingRef.current = false;
          setIsFlying(false);
        }
      } else if (!isFlyingRef.current && t === 0) {
        // Idle state: Ball sits perfectly inside the Cannon mouth
        ball.position.set(0, 0, 0);
      }

      // Smooth Camera tracking target area
      const midPointX = calculatedMaxRange / 2;
      camera.position.x += (midPointX - 3 - camera.position.x) * 0.05;
      camera.lookAt(midPointX, 4, 0);

      // Pulse effect on target ring
      target.scale.setScalar(1 + Math.sin(Date.now() * 0.006) * 0.15);

      renderer.render(scene, camera);
    };
    animate();

    // Mobile Responsive Auto-Resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) mountRef.current.innerHTML = '';
    };
  }, []);

  return (
    <div className="relative w-full h-full select-none overflow-hidden rounded-[1.5rem]">
      
      {/* 🔮 BEAUTIFIED SCI-FI HUD OVERLAY */}
      <div className="absolute top-4 left-4 right-4 flex flex-col sm:flex-row justify-between items-start gap-4 z-10 pointer-events-none">
        
        {/* Telemetry Box */}
        <div className="bg-slate-950/80 backdrop-blur-xl px-5 py-4 rounded-2xl border border-sky-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-full sm:w-56">
          <div className="text-[10px] font-black text-sky-400 tracking-widest uppercase mb-2">🚀 Live Telemetry</div>
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between"><span className="text-slate-400">DISTANCE:</span><span className="text-white font-bold"><span id="game-hud-x">0.0</span> m</span></div>
            <div className="flex justify-between"><span className="text-slate-400">HEIGHT:</span><span className="text-white font-bold"><span id="game-hud-y">0.0</span> m</span></div>
            <div className="flex justify-between"><span className="text-slate-400">FLIGHT TIME:</span><span className="text-orange-400 font-bold"><span id="game-hud-t">0.00</span> s</span></div>
          </div>
        </div>

        {/* Action Controls Container */}
        <div className="pointer-events-auto flex gap-3 self-end sm:self-start">
          <button
            onClick={handleLaunch}
            disabled={isFlying}
            className={`px-6 py-3 rounded-xl font-black text-xs tracking-wider uppercase transition-all duration-200 shadow-lg ${
              isFlying 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:scale-105 active:scale-95 border border-emerald-400/50 shadow-green-500/20'
            }`}
          >
            {isFlying ? "⚡ Flying..." : "▶️ Launch"}
          </button>
          
          <button
            onClick={handleReset}
            className="px-5 py-3 bg-slate-900/90 text-slate-300 hover:text-white rounded-xl font-black text-xs tracking-wider uppercase transition-all duration-200 border border-slate-700 hover:bg-slate-800 active:scale-95"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Canvas Holder */}
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}
