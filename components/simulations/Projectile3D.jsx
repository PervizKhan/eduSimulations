"use client";
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Projectile3D({ params }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f9ff);
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(400, 400);
    mountRef.current.appendChild(renderer.domElement);

    // Cute sphere
    const geo = new THREE.SphereGeometry(0.5, 32, 32);
    const mat = new THREE.MeshStandardMaterial({ color: 0xff6b6b });
    const ball = new THREE.Mesh(geo, mat);
    scene.add(ball);
    
    // Light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    camera.position.z = 10;
    
    function animate() {
      requestAnimationFrame(animate);
      ball.position.y = Math.sin(Date.now() * 0.005) * 2; // Simple fun motion
      renderer.render(scene, camera);
    }
    animate();

    return () => { mountRef.current?.removeChild(renderer.domElement); };
  }, [params]);

  return <div ref={mountRef} className="flex justify-center items-center w-full h-full" />;
}
    const sampleSteps = 60;

    for (let i = 0; i <= sampleSteps; i++) {
      const t = (totalFlightTime / sampleSteps) * i;
      const x = vx * t;
      const y = (vy * t) - (0.5 * p.g * t * t);
      if (y >= 0) {
        points.push(new THREE.Vector3(x, y, 0));
      }
    }

    // Set geometry vector arrays updating coordinates buffers
    refs.expectedLine.geometry.setFromPoints(points);
    refs.expectedLine.geometry.computeBoundingSphere();
  };

  // Sync state and pre-flight path live trackers on slider updates
  useEffect(() => {
    stateRef.current.params = params;
    updateExpectedTrajectory(params);

    // If physics isn't flying, point arrow directly matching static launch config angular metrics
    if (!stateRef.current.isPlaying && referencesRef.current.arrow && referencesRef.current.ball) {
      const theta = (params.angle * Math.PI) / 180;
      const dir = new THREE.Vector3(Math.cos(theta), Math.sin(theta), 0).normalize();
      referencesRef.current.arrow.setDirection(dir);
      referencesRef.current.ball.position.set(0, 1, 0); // Ground default altitude offset placement
      referencesRef.current.arrow.position.set(0, 1, 0);
    }
  }, [params]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Enhanced Isometric Isometric Stylized Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#bae6fd');

    // 2. High Quality Fixed Diagonal Overview Isometric Camera Angle
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(45, 30, 95);
    camera.lookAt(40, 10, 0);

    // 3. Renderer Settings
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 4. Ambient & Sun Shadow Casters Lights Layouts
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 0.7);
    sunLight.position.set(40, 120, 40);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // 5. Stylized Safe Physics Experimental Grid Flooring
    const groundGeo = new THREE.PlaneGeometry(2000, 2000);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.9 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const gridHelper = new THREE.GridHelper(1000, 200, 0xcbd5e1, 0xe2e8f0);
    gridHelper.position.y = 0.02;
    scene.add(gridHelper);

    // 6. Setup Expected Trajectory Render Mesh Pipeline (Purple Dashed Ribbon)
    const expectedGeo = new THREE.BufferGeometry();
    const expectedMat = new THREE.LineDashedMaterial({
      color: 0x8b5cf6,
      dashSize: 1.5,
      gapSize: 0.8,
      linewidth: 3
    });
    const expectedLine = new THREE.Line(expectedGeo, expectedMat);
    scene.add(expectedLine);
    referencesRef.current.expectedLine = expectedLine;

    // 7. Setup Live Physics Real Path Tracker Trail Mesh (Bright Gold Line)
    const realGeo = new THREE.BufferGeometry();
    const realMat = new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 4 });
    const realLine = new THREE.Line(realGeo, realMat);
    scene.add(realLine);
    referencesRef.current.realLine = realLine;

    // 8. Core Active Flying Target Ball 🔴
    const ballGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const ballMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2, metalness: 0.1 });
    const ball = new THREE.Mesh(ballGeo, ballMat);
    ball.position.set(0, 0.8, 0);
    ball.castShadow = true;
    scene.add(ball);
    referencesRef.current.ball = ball;

    // 9. Flight Vector Analytics Direction Arrow Helper 🏹
    const arrowDir = new THREE.Vector3(1, 1, 0).normalize();
    const arrowHelper = new THREE.ArrowHelper(arrowDir, ball.position, 4, 0x0284c7, 1.2, 0.6);
    scene.add(arrowHelper);
    referencesRef.current.arrow = arrowHelper;

    // Perform initial calculations configuration mappings
    updateExpectedTrajectory(stateRef.current.params);

    // 10. Frame Loop Animation
    let animationFrameId;
    const fps = 50;

    const animate = () => {
      const state = stateRef.current;

      if (state.isPlaying) {
        state.frame++;
        const t = state.frame / fps;
        const p = state.params;

        const theta = (p.angle * Math.PI) / 180;
        const vx = p.v0 * Math.cos(theta);
        const vy = p.v0 * Math.sin(theta);

        let currentX = vx * t;
        let currentY = 0.8 + (vy * t) - (0.5 * p.g * t * t); // Compensating sphere scale thickness metrics offset

        // Handle ground collision thresholds
        if (currentY <= 0.8 && state.frame > 1) {
          currentY = 0.8;
          state.isPlaying = false;
          setIsPlaying(false);
        }

        // Apply updated vectors onto target mesh components coordinates
        ball.position.set(currentX, currentY, 0);
        arrowHelper.position.set(currentX, currentY, 0);

        // Compute instant direction trajectory components mapping
        const currentVy = vy - (p.g * t);
        const velocityVector = new THREE.Vector3(vx, currentVy, 0);
        const currentSpeed = velocityVector.length();
        
        // Normalize vector direction mapping parameters configurations
        arrowHelper.setDirection(velocityVector.normalize());

        // Append coordinates tracking elements onto history log array limits
        state.realPathPoints.push(new THREE.Vector3(currentX, currentY, 0));
        referencesRef.current.realLine.geometry.setFromPoints(state.realPathPoints);

        // Beautiful Dynamic Camera Tracking Optimization
        camera.position.x = currentX + 35;
        camera.lookAt(currentX, currentY, 0);

        setHud({
          time: t,
          x: currentX,
          y: currentY - 0.8,
          speed: currentY === 0.8 && state.frame > 2 ? 0 : currentSpeed
        });
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleLaunch = () => {
    stateRef.current.frame = 0;
    stateRef.current.realPathPoints = [];
    referencesRef.current.realLine.geometry.setFromPoints([]);
    stateRef.current.isPlaying = true;
    setIsPlaying(true);
  };

  return (
    <div className="w-full h-full relative" ref={mountRef}>
      {/* Absolute Locked HUD Dashboard */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md border-2 border-sky-300 rounded-2xl p-4 w-52 shadow-lg pointer-events-none z-10 font-mono text-xs text-sky-800 flex flex-col gap-1.5">
        <h4 className="font-extrabold text-sky-900 border-b border-sky-200 pb-1 mb-1 text-center text-[13px]">📊 Live Telemetry</h4>
        <p className="flex justify-between"><span>⏱️ Time:</span> <span className="font-bold text-slate-700">{hud.time.toFixed(2)}s</span></p>
        <p className="flex justify-between"><span>↔️ Range X:</span> <span className="font-bold text-slate-700">{hud.x.toFixed(1)}m</span></p>
        <p className="flex justify-between"><span>↕️ Height Y:</span> <span className="font-bold text-slate-700">{hud.y.toFixed(1)}m</span></p>
        <p className="flex justify-between"><span>⚡ Velocity:</span> <span className="font-bold text-slate-700">{hud.speed.toFixed(1)} m/s</span></p>
      </div>

      {/* Trajectory Legends HUD Marker */}
      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-xs border border-sky-200 rounded-xl p-2.5 z-10 text-[11px] font-bold text-slate-600 flex flex-col gap-1 shadow-sm pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 border-t-2 border-dashed border-violet-500"></div>
          <span>Expected Path (Calculated)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-amber-500"></div>
          <span>Real Path (Actual Flight)</span>
        </div>
      </div>

      {/* Trigger Launch Panel */}
      <div className="absolute bottom-4 left-4 z-10">
        <button
          onClick={handleLaunch}
          disabled={isPlaying}
          className={`px-6 py-3 rounded-2xl text-white font-extrabold shadow-md transform active:scale-95 transition-all text-sm tracking-wide ${
            isPlaying ? 'bg-slate-400 cursor-not-allowed animate-pulse' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-200'
          }`}
        >
          {isPlaying ? '🚀 Simulation Running' : '💥 Fire Projectile'}
        </button>
      </div>
    </div>
  );
}
