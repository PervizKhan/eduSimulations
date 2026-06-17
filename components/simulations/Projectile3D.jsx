"use client";
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Projectile3D({ params }) {
  const mountRef = useRef(null);
  const paramsRef = useRef(params); // YEH SLIDER LAG FIX KAREGA

  // Sliders ki latest value ko bina engine restart kiye update karna
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    if (!mountRef.current) return;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 1. SCENE SETUP
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Cyberpunk Dark Blue

    // 2. SMART CAMERA (No Dizzy Movement)
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 10, 35);

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // 4. LIGHTS
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dLight = new THREE.DirectionalLight(0xffffff, 1);
    dLight.position.set(10, 20, 10);
    scene.add(dLight);

    // 5. GRID & FLOOR
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(300, 100),
      new THREE.MeshStandardMaterial({ color: 0x020617 })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const grid = new THREE.GridHelper(300, 150, 0x0ea5e9, 0x1e293b);
    scene.add(grid);

    // 6. CANNON & TARGET
    const cannon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 4, 16),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8 })
    );
    cannon.position.set(0, 1, 0);
    scene.add(cannon);

    const targetRing = new THREE.Mesh(
      new THREE.RingGeometry(1.5, 2.5, 32),
      new THREE.MeshBasicMaterial({ color: 0x22c55e, side: THREE.DoubleSide })
    );
    targetRing.rotation.x = -Math.PI / 2;
    targetRing.position.y = 0.1;
    scene.add(targetRing);

    // 7. GLOWING BALL
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c })
    );
    scene.add(ball);

    // --- GAME ENGINE LOGIC ---
    let t = 0;
    let isWaiting = false;
    let lastV = -1;
    let lastAngle = -1;
    const g = 9.8;
    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Read values directly from refs (NO LAG)
      const v0 = paramsRef.current.velocity || 15;
      const angleDeg = paramsRef.current.angle || 45;
      const angleRad = (angleDeg * Math.PI) / 180;

      // Agar user ne slider hilaya, toh ball foran wapis cannon mein!
      if (lastV !== v0 || lastAngle !== angleDeg) {
        t = 0;
        isWaiting = false;
        lastV = v0;
        lastAngle = angleDeg;
      }

      // Physics Math
      const maxRange = (v0 * v0 * Math.sin(2 * angleRad)) / g;
      
      // Update Environment Dynamically
      targetRing.position.x = maxRange;
      cannon.rotation.z = -((Math.PI / 2) - angleRad);
      
      // Smart Camera: Range ke hisaab se centre mein focus karega
      const targetCamX = maxRange / 2;
      camera.position.x += (targetCamX - camera.position.x) * 0.1;
      camera.lookAt(targetCamX, 5, 0);

      // Ball Movement Logic
      if (!isWaiting) {
        t += 0.05; // Playback speed
        const x = v0 * Math.cos(angleRad) * t;
        let y = (v0 * Math.sin(angleRad) * t) - (0.5 * g * t * t);
        y = Math.max(y, 0); // Zameen se neeche na jaye

        ball.position.set(x, y + 0.8, 0);

        // Update Live HUD directly in DOM (Super Fast, No React State Lag)
        const hudX = document.getElementById('hud-x');
        const hudY = document.getElementById('hud-y');
        const hudT = document.getElementById('hud-t');
        if (hudX) hudX.innerText = x.toFixed(1);
        if (hudY) hudY.innerText = y.toFixed(1);
        if (hudT) hudT.innerText = t.toFixed(2);

        // Hit the target!
        if (y <= 0 && t > 0.5) {
          isWaiting = true;
          ball.position.set(maxRange, 0.8, 0); // Lock to exact target
          setTimeout(() => { isWaiting = false; t = 0; }, 1500); // 1.5 second wait before relaunch
        }
      }

      // Target Ring Pulse Animation
      targetRing.scale.setScalar(1 + Math.sin(Date.now() * 0.005) * 0.2);

      renderer.render(scene, camera);
    };
    animate();

    // Handle Resize for Mobile
    const handleResize = () => {
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
  }, []); // EMPY ARRAY = Engine only starts once!

  return (
    <div className="relative w-full h-full">
      {/* 🎮 LIVE TELEMETRY HUD (Floating Panel) */}
      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-sky-500/50 shadow-[0_0_20px_rgba(14,165,233,0.3)] z-10 pointer-events-none">
        <h3 className="text-sky-400 font-black text-xs tracking-widest mb-2 border-b border-sky-500/30 pb-1">LIVE TELEMETRY</h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
          <div className="text-slate-400">DISTANCE</div>
          <div className="text-white font-mono text-right"><span id="hud-x">0.0</span> m</div>
          
          <div className="text-slate-400">HEIGHT</div>
          <div className="text-white font-mono text-right"><span id="hud-y">0.0</span> m</div>
          
          <div className="text-slate-400">FLIGHT TIME</div>
          <div className="text-white font-mono text-right text-orange-400"><span id="hud-t">0.00</span> s</div>
        </div>
      </div>

      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}
