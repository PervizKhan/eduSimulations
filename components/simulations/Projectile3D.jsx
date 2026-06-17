"use client";
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Projectile3D({ params }) {
  const mountRef = useRef(null);
  const paramsRef = useRef(params);
  
  const [isFlying, setIsFlying] = useState(false);
  const isFlyingRef = useRef(false);
  const triggerResetRef = useRef(false);

  // Sync sliders dynamically
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const handleLaunch = () => {
    if (isFlyingRef.current) return;
    triggerResetRef.current = true;
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

    // 1. CYBERPUNK ENVIRONMENT SETUP
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0f19);
    scene.fog = new THREE.FogExp2(0x0b0f19, 0.008);

    // 2. CINEMATIC CAMERA SETUP
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    // Initial dynamic starting position
    camera.position.set(-15, 20, 50);

    // 3. PERFORMANCE RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // 4. LIGHTS
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const neonLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    neonLight.position.set(20, 40, 20);
    scene.add(neonLight);

    // 5. SCI-FI SCIENTIFIC GRID
    const grid = new THREE.GridHelper(600, 120, 0x0ea5e9, 0x1e293b);
    scene.add(grid);

    // 6. ROTATING CANNON MESH
    const cannonGeometry = new THREE.CylinderGeometry(0.5, 0.7, 4, 16);
    cannonGeometry.translate(0, 2, 0); 
    const cannon = new THREE.Mesh(cannonGeometry, new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 }));
    scene.add(cannon);

    // 7. ENERGY BALL PROJECTILE
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 0.7 })
    );
    scene.add(ball);

    // 8. LIVE PREDICTION PATH MATRIX (Blueprint Line)
    const maxPoints = 200;
    const trajectoryGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(maxPoints * 3);
    trajectoryGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const trajectoryMat = new THREE.LineBasicMaterial({ color: 0x38bdf8 });
    const trajectoryLine = new THREE.Line(trajectoryGeo, trajectoryMat);
    scene.add(trajectoryLine);

    // 9. DYNAMIC TARGET RETICLE
    const target = new THREE.Mesh(
      new THREE.RingGeometry(2, 3, 32),
      new THREE.MeshBasicMaterial({ color: 0x22c55e, side: THREE.DoubleSide })
    );
    target.rotation.x = -Math.PI / 2;
    target.position.y = 0.1;
    scene.add(target);

    // --- RENDER CORE GAME LOOP ---
    let t = 0;
    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Extract control keys from JSON configuration
      const v0 = paramsRef.current.v0 ?? 45;
      const angleDeg = paramsRef.current.angle ?? 45;
      const g = paramsRef.current.g ?? 9.8;
      const angleRad = (angleDeg * Math.PI) / 180;

      // Update Launcher Pitch Angle Live
      cannon.rotation.z = -((Math.PI / 2) - angleRad);
      
      // Calculate Expected Safe Impact Landing Vector
      const calculatedMaxRange = (v0 * v0 * Math.sin(2 * angleRad)) / g;
      target.position.x = calculatedMaxRange;

      // REALTIME TRACER LINE
      const pathPositions = trajectoryLine.geometry.attributes.position.array;
      let stepTime = 0;
      for (let i = 0; i < maxPoints; i++) {
        const px = v0 * Math.cos(angleRad) * stepTime;
        const py = (v0 * Math.sin(angleRad) * stepTime) - (0.5 * g * stepTime * stepTime);
        
        pathPositions[i * 3] = px;
        pathPositions[i * 3 + 1] = Math.max(py, 0);
        pathPositions[i * 3 + 2] = 0;

        if (py < 0 && stepTime > 0.1) {
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

      // RESET TRIGGER
      if (triggerResetRef.current) {
        t = 0;
        ball.position.set(0, 0, 0);
        triggerResetRef.current = false;
      }

      // PHYSICS FLIGHT LOGIC
      if (isFlyingRef.current) {
        t += 0.04; 
        const currentX = v0 * Math.cos(angleRad) * t;
        let currentY = (v0 * Math.sin(angleRad) * t) - (0.5 * g * t * t);

        if (currentY >= 0) {
          ball.position.set(currentX, currentY, 0);
          
          // Direct DOM injection updates HUD bypasses React delay
          const domX = document.getElementById('game-hud-x');
          const domY = document.getElementById('game-hud-y');
          const domT = document.getElementById('game-hud-t');
          if (domX) domX.innerText = currentX.toFixed(1);
          if (domY) domY.innerText = currentY.toFixed(1);
          if (domT) domT.innerText = t.toFixed(2);
        } else {
          ball.position.set(calculatedMaxRange, 0, 0);
          isFlyingRef.current = false;
          setIsFlying(false);
        }

        // 🎥 GLORIOUS DYNAMIC TRACKING CAMERA MOVEMENT (Flight Mode)
        // Camera sweeps in a gorgeous rotational orbit ahead and around the moving ball
        const rotationSweep = t * 0.15; 
        const radius = 35 - Math.min(t * 1.5, 15); // Zooms in slightly as it tracks
        
        const targetCamX = ball.position.x - radius * Math.cos(rotationSweep);
        const targetCamY = ball.position.y + 12 + Math.sin(t * 0.3) * 3;
        const targetCamZ = radius * Math.sin(rotationSweep) + 20;

        // Ultra smooth tracking interpolation
        camera.position.x += (targetCamX - camera.position.x) * 0.08;
        camera.position.y += (targetCamY - camera.position.y) * 0.08;
        camera.position.z += (targetCamZ - camera.position.z) * 0.08;
        
        // Lock gaze directly onto the flying projectile core
        camera.lookAt(ball.position.x, ball.position.y, ball.position.z);

      } else {
        // Idle state layout
        if (t === 0) {
          ball.position.set(0, 0, 0);
        }

        // 🎥 GLORIOUS PANORAMIC ORBIT MOVEMENT (Idle Mode)
        // Camera rotates slowly around the playground landscape for high visual fidelity
        const idlePulse = Date.now() * 0.0003;
        const midPointX = calculatedMaxRange / 2;
        
        const targetCamX = midPointX - 35 * Math.cos(idlePulse);
        const targetCamY = 18 + Math.sin(idlePulse) * 2;
        const targetCamZ = 50 + Math.sin(idlePulse) * 6;

        camera.position.x += (targetCamX - camera.position.x) * 0.04;
        camera.position.y += (targetCamY - camera.position.y) * 0.04;
        camera.position.z += (targetCamZ - camera.position.z) * 0.04;

        // Keep viewport centered on the upcoming flight path zone
        camera.lookAt(midPointX, 5, 0);
      }

      // Target Ring Pulse feedback
      target.scale.setScalar(1 + Math.sin(Date.now() * 0.006) * 0.15);

      renderer.render(scene, camera);
    };
    animate();

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
      
      {/* 🚀 LIVE TELEMETRY - TOP LEFT */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="bg-slate-950/80 backdrop-blur-xl px-5 py-4 rounded-2xl border border-sky-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-48 sm:w-56">
          <div className="text-[10px] font-black text-sky-400 tracking-widest uppercase mb-2">🚀 Live Telemetry</div>
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between"><span className="text-slate-400">DISTANCE:</span><span className="text-white font-bold"><span id="game-hud-x">0.0</span> m</span></div>
            <div className="flex justify-between"><span className="text-slate-400">HEIGHT:</span><span className="text-white font-bold"><span id="game-hud-y">0.0</span> m</span></div>
            <div className="flex justify-between"><span className="text-slate-400">FLIGHT TIME:</span><span className="text-orange-400 font-bold"><span id="game-hud-t">0.00</span> s</span></div>
          </div>
        </div>
      </div>

      {/* 🎮 BUTTONS - BOTTOM RIGHT (Trajectory ke raste se mukammal bahir) */}
      <div className="absolute bottom-4 right-4 z-10 flex gap-3 pointer-events-auto">
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

      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}
