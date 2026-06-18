"use client";
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import TelemetryHUD from '@/components/TelemetryHUD';

export default function Projectile3D({ params }) {
  const mountRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPrediction, setShowPrediction] = useState(true);
  const [score, setScore] = useState(0);
  const [parrotHit, setParrotHit] = useState(false);
  const [telemetry, setTelemetry] = useState({
    time: 0,
    speed: 0,
    position: { x: 0, y: 0, z: 0 },
    maxHeight: 0,
    totalRange: 0,
    flightTime: 0
  });

  const safeParams = params || { angle: 45, velocity: 50, gravity: 9.8 };

  // ===== REFERENCES =====
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const ballRef = useRef(null);
  const arrowRef = useRef(null);
  const predictedLineRef = useRef(null);
  const realLineRef = useRef(null);
  const glowLightRef = useRef(null);
  const cameraTargetRef = useRef(new THREE.Vector3(0, 5, 0));
  const parrotRef = useRef(null);
  const treeRef = useRef(null);
  const sunRef = useRef(null);
  
  const simState = useRef({
    isPlaying: false,
    frame: 0,
    params: safeParams,
    realPathPoints: [],
    maxHeight: 0,
    totalRange: 0,
    flightTime: 0,
    parrotPosition: new THREE.Vector3(45, 12, 0),
    parrotHit: false,
    score: 0
  });

  const animationIdRef = useRef(null);

  // ===== PREDICTED PATH =====
  const calculatePredictedPath = (p) => {
    const points = [];
    const theta = (p.angle * Math.PI) / 180;
    const vx = p.velocity * Math.cos(theta);
    const vy = p.velocity * Math.sin(theta);
    
    if (p.angle === 0 || p.angle === 90) {
      // Handle edge cases
      if (p.angle === 0) {
        const steps = 80;
        for (let i = 0; i <= steps; i++) {
          const t = (10 / steps) * i;
          points.push(new THREE.Vector3(p.velocity * t, 0.8, 0));
        }
        return points;
      }
      if (p.angle === 90) {
        const totalTime = (2 * p.velocity) / p.gravity;
        const steps = 80;
        for (let i = 0; i <= steps; i++) {
          const t = (totalTime / steps) * i;
          const y = (p.velocity * t) - (0.5 * p.gravity * t * t);
          if (y >= 0) {
            points.push(new THREE.Vector3(0, y + 0.8, 0));
          }
        }
        return points;
      }
    }
    
    // Normal case
    const totalTime = (2 * vy) / p.gravity;
    const steps = 80;
    for (let i = 0; i <= steps; i++) {
      const t = (totalTime / steps) * i;
      const x = vx * t;
      const y = (vy * t) - (0.5 * p.gravity * t * t);
      if (y >= 0) {
        points.push(new THREE.Vector3(x, y + 0.8, 0));
      }
    }
    
    if (points.length === 0) {
      points.push(new THREE.Vector3(0, 0.8, 0));
    }
    return points;
  };

  const updatePredictedPath = (p) => {
    if (!predictedLineRef.current) return;
    const points = calculatePredictedPath(p);
    predictedLineRef.current.geometry.setFromPoints(points);
    predictedLineRef.current.geometry.computeBoundingSphere();
    if (points.length > 1) {
      predictedLineRef.current.computeLineDistances();
    }
  };

  const updateTelemetry = (data) => {
    setTelemetry({
      time: data.time || 0,
      speed: data.speed || 0,
      position: { x: data.range || 0, y: data.height || 0, z: 0 },
      maxHeight: data.maxHeight || 0,
      totalRange: data.totalRange || 0,
      flightTime: data.flightTime || 0
    });
  };

  // ===== SYNC PARAMS =====
  useEffect(() => {
    simState.current.params = safeParams;
    updatePredictedPath(safeParams);
    
    if (!simState.current.isPlaying && arrowRef.current && ballRef.current) {
      const theta = (safeParams.angle * Math.PI) / 180;
      const dir = new THREE.Vector3(Math.cos(theta), Math.sin(theta), 0).normalize();
      arrowRef.current.setDirection(dir);
      ballRef.current.position.set(0, 0.8, 0);
      arrowRef.current.position.set(0, 0.8, 0);
    }
    
    if (!simState.current.isPlaying) {
      updateTelemetry({ time: 0, range: 0, height: 0, speed: 0, maxHeight: 0, totalRange: 0, flightTime: 0 });
    }
  }, [safeParams]);

  // ===== THREE.JS SETUP =====
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#87CEEB'); // Sky blue
    scene.fog = new THREE.Fog(0x87CEEB, 150, 300);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 500);
    camera.position.set(60, 35, 80);
    camera.lookAt(0, 5, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffeedd, 1.5);
    sunLight.position.set(80, 120, 40);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.1;
    sunLight.shadow.camera.far = 300;
    sunLight.shadow.camera.left = -100;
    sunLight.shadow.camera.right = 100;
    sunLight.shadow.camera.top = 100;
    sunLight.shadow.camera.bottom = -100;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x4a6fa5, 0.3);
    fillLight.position.set(-40, 30, -40);
    scene.add(fillLight);

    // --- ☀️ SUN ---
    const sunGeo = new THREE.SphereGeometry(6, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffdd00 });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sun.position.set(-60, 70, -40);
    scene.add(sun);
    sunRef.current = sun;

    // Sun glow
    const sunGlowGeo = new THREE.SphereGeometry(8, 32, 32);
    const sunGlowMat = new THREE.MeshBasicMaterial({ 
      color: 0xffdd00, 
      transparent: true, 
      opacity: 0.2 
    });
    const sunGlow = new THREE.Mesh(sunGlowGeo, sunGlowMat);
    sunGlow.position.copy(sun.position);
    scene.add(sunGlow);

    // --- Ground (Grass) ---
    const groundGeo = new THREE.PlaneGeometry(400, 400);
    const groundMat = new THREE.MeshStandardMaterial({ 
      color: 0x4CAF50, 
      roughness: 0.9,
      metalness: 0
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // --- Grid ---
    const gridHelper = new THREE.GridHelper(200, 40, 0x2E7D32, 0x388E3C);
    gridHelper.position.y = 0.02;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.3;
    scene.add(gridHelper);

    // --- 🌳 TREE with Parrot ---
    const treeGroup = new THREE.Group();
    const treePos = new THREE.Vector3(45, 0, 0);
    
    // Tree trunk
    const trunkGeo = new THREE.CylinderGeometry(0.6, 1, 8, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5D4037 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(0, 4, 0);
    trunk.castShadow = true;
    treeGroup.add(trunk);

    // Tree canopy (3 spheres)
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0x2E7D32, roughness: 0.8 });
    const canopyPositions = [
      { x: 0, y: 9, z: 0, r: 3 },
      { x: -2.5, y: 7, z: 1, r: 2.5 },
      { x: 2.5, y: 7, z: -1, r: 2.5 },
      { x: 0, y: 6, z: -2, r: 2 },
      { x: 0, y: 6, z: 2, r: 2 }
    ];
    canopyPositions.forEach(pos => {
      const geo = new THREE.SphereGeometry(pos.r, 16, 16);
      const mesh = new THREE.Mesh(geo, canopyMat);
      mesh.position.set(pos.x, pos.y, pos.z);
      mesh.castShadow = true;
      treeGroup.add(mesh);
    });

    treeGroup.position.copy(treePos);
    scene.add(treeGroup);
    treeRef.current = treeGroup;

    // --- 🦜 PARROT ---
    const parrotGroup = new THREE.Group();
    const parrotPos = new THREE.Vector3(45, 12, 0);
    
    // Parrot body
    const bodyGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xff5722 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.scale.set(1, 1.2, 0.8);
    parrotGroup.add(body);

    // Parrot head
    const headGeo = new THREE.SphereGeometry(0.6, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xff7043 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(0, 0.9, 0);
    parrotGroup.add(head);

    // Parrot beak
    const beakGeo = new THREE.ConeGeometry(0.2, 0.4, 8);
    const beakMat = new THREE.MeshStandardMaterial({ color: 0xff6f00 });
    const beak = new THREE.Mesh(beakGeo, beakMat);
    beak.position.set(0.1, 0.7, 0.5);
    beak.rotation.x = -0.5;
    parrotGroup.add(beak);

    // Parrot wings
    const wingMat = new THREE.MeshStandardMaterial({ color: 0x4CAF50 });
    const wingGeo = new THREE.BoxGeometry(0.8, 0.1, 0.4);
    const wingL = new THREE.Mesh(wingGeo, wingMat);
    wingL.position.set(-0.7, 0, 0);
    parrotGroup.add(wingL);
    const wingR = new THREE.Mesh(wingGeo, wingMat);
    wingR.position.set(0.7, 0, 0);
    parrotGroup.add(wingR);

    // Parrot tail
    const tailMat = new THREE.MeshStandardMaterial({ color: 0x2196F3 });
    const tailGeo = new THREE.BoxGeometry(0.1, 0.3, 0.5);
    const tail = new THREE.Mesh(tailGeo, tailMat);
    tail.position.set(0, -0.9, 0);
    parrotGroup.add(tail);

    parrotGroup.position.copy(parrotPos);
    scene.add(parrotGroup);
    parrotRef.current = parrotGroup;
    simState.current.parrotPosition.copy(parrotPos);

    // --- Launch Pad ---
    const padGeo = new THREE.CylinderGeometry(1.5, 2, 0.5, 16);
    const padMat = new THREE.MeshStandardMaterial({ color: 0x607D8B, roughness: 0.7 });
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.position.set(0, 0.25, 0);
    pad.receiveShadow = true;
    pad.castShadow = true;
    scene.add(pad);

    // --- Predicted Path ---
    const predictedGeo = new THREE.BufferGeometry();
    const defaultPoints = [new THREE.Vector3(0, 0.8, 0), new THREE.Vector3(1, 0.8, 0)];
    predictedGeo.setFromPoints(defaultPoints);
    const predictedMat = new THREE.LineDashedMaterial({
      color: 0x8b5cf6,
      dashSize: 1.2,
      gapSize: 0.6,
      transparent: true,
      opacity: 0.6
    });
    const predictedLine = new THREE.Line(predictedGeo, predictedMat);
    predictedLine.computeLineDistances();
    scene.add(predictedLine);
    predictedLineRef.current = predictedLine;

    // --- Real Path ---
    const realGeo = new THREE.BufferGeometry();
    realGeo.setFromPoints([new THREE.Vector3(0, 0.8, 0)]);
    const realMat = new THREE.LineBasicMaterial({ color: 0xff6b6b, transparent: true, opacity: 0.8 });
    const realLine = new THREE.Line(realGeo, realMat);
    scene.add(realLine);
    realLineRef.current = realLine;

    // --- Ball ---
    const ballGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const ballMat = new THREE.MeshStandardMaterial({ 
      color: 0xff6b6b, 
      roughness: 0.2, 
      metalness: 0.3,
      emissive: 0xff6b6b,
      emissiveIntensity: 0.1
    });
    const ball = new THREE.Mesh(ballGeo, ballMat);
    ball.position.set(0, 0.8, 0);
    ball.castShadow = true;
    scene.add(ball);
    ballRef.current = ball;

    const glowLight = new THREE.PointLight(0xff6b6b, 0.3, 15);
    glowLight.position.set(0, 0.8, 0);
    scene.add(glowLight);
    glowLightRef.current = glowLight;

    // --- Arrow ---
    const arrowDir = new THREE.Vector3(1, 1, 0).normalize();
    const arrowHelper = new THREE.ArrowHelper(arrowDir, new THREE.Vector3(0, 0.8, 0), 6, 0x00d4ff, 1.5, 0.8);
    scene.add(arrowHelper);
    arrowRef.current = arrowHelper;

    updatePredictedPath(simState.current.params);

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ===== ANIMATION LOOP =====
    const FPS = 60;

    const animate = () => {
      const state = simState.current;
      const p = state.params;
      
      // Parrot idle animation (bobbing)
      if (parrotRef.current && !state.parrotHit) {
        const time = Date.now() * 0.002;
        parrotRef.current.position.y = state.parrotPosition.y + Math.sin(time) * 0.3;
        parrotRef.current.rotation.z = Math.sin(time * 0.5) * 0.05;
      }

      // Sun pulse
      if (sunRef.current) {
        const time = Date.now() * 0.001;
        const pulse = 1 + Math.sin(time) * 0.05;
        sunRef.current.scale.set(pulse, pulse, pulse);
      }

      if (state.isPlaying) {
        state.frame++;
        const t = state.frame / FPS;
        const theta = (p.angle * Math.PI) / 180;
        const vx = p.velocity * Math.cos(theta);
        const vy = p.velocity * Math.sin(theta);

        let currentX, currentY, currentVx, currentVy;

        if (p.angle === 90) {
          currentX = 0;
          currentY = (p.velocity * t) - (0.5 * p.gravity * t * t) + 0.8;
          currentVx = 0;
          currentVy = p.velocity - (p.gravity * t);
        } else {
          currentX = vx * t;
          currentY = (vy * t) - (0.5 * p.gravity * t * t) + 0.8;
          currentVx = vx;
          currentVy = vy - (p.gravity * t);
        }

        // Ground collision
        const isBelowGround = currentY <= 0.8;
        const hasLaunched = state.frame > 5;
        
        if (isBelowGround && hasLaunched) {
          currentY = 0.8;
          state.isPlaying = false;
          state.flightTime = t;
          state.totalRange = currentX;
          setIsPlaying(false);
          
          // Check if hit the parrot!
          const distToParrot = Math.sqrt(
            Math.pow(currentX - state.parrotPosition.x, 2) + 
            Math.pow(0.8 - state.parrotPosition.y, 2)
          );
          if (distToParrot < 3 && !state.parrotHit) {
            state.parrotHit = true;
            state.score++;
            setScore(state.score);
            setParrotHit(true);
            // Parrot falls
            if (parrotRef.current) {
              const fallInterval = setInterval(() => {
                if (parrotRef.current && parrotRef.current.position.y > 0.8) {
                  parrotRef.current.position.y -= 0.1;
                } else {
                  clearInterval(fallInterval);
                }
              }, 50);
            }
          }
          
          updateTelemetry({
            time: t,
            range: currentX,
            height: 0,
            speed: 0,
            maxHeight: state.maxHeight,
            totalRange: currentX,
            flightTime: t
          });
        }

        if (state.frame > 10 && currentY <= 0.8 && state.isPlaying) {
          state.isPlaying = false;
          state.flightTime = t;
          state.totalRange = p.angle === 0 ? currentX : 0;
          setIsPlaying(false);
          
          updateTelemetry({
            time: t,
            range: state.totalRange,
            height: 0,
            speed: 0,
            maxHeight: 0,
            totalRange: state.totalRange,
            flightTime: 0
          });
        }

        // Update ball
        if (ballRef.current && isFinite(currentX) && isFinite(currentY)) {
          ballRef.current.position.set(currentX, Math.max(currentY, 0.8), 0);
        }
        if (glowLightRef.current && isFinite(currentX) && isFinite(currentY)) {
          glowLightRef.current.position.set(currentX, Math.max(currentY, 0.8), 0);
        }

        // Update arrow
        const currentSpeed = Math.sqrt(currentVx * currentVx + currentVy * currentVy);
        if (arrowRef.current && currentSpeed > 0.1 && isFinite(currentX) && isFinite(currentY)) {
          const velDir = new THREE.Vector3(currentVx, currentVy, 0).normalize();
          if (velDir.length() > 0) {
            arrowRef.current.setDirection(velDir);
          }
          arrowRef.current.position.set(currentX, Math.max(currentY, 0.8), 0);
        }

        if (currentY > state.maxHeight) {
          state.maxHeight = currentY - 0.8;
        }

        if (currentY > 0.8 || p.angle === 0) {
          state.realPathPoints.push(new THREE.Vector3(currentX, Math.max(currentY, 0.8), 0));
          if (realLineRef.current) {
            realLineRef.current.geometry.setFromPoints(state.realPathPoints);
          }
        }

        updateTelemetry({
          time: t,
          range: currentX,
          height: Math.max(0, currentY - 0.8),
          speed: currentSpeed,
          maxHeight: state.maxHeight,
          totalRange: state.totalRange,
          flightTime: state.flightTime
        });

        // Camera chase
        const targetPos = new THREE.Vector3(currentX, Math.max(Math.max(currentY, 5), 10), 0);
        const desiredPos = new THREE.Vector3(
          currentX + 35,
          Math.max(Math.max(currentY, 15), 20),
          50
        );
        camera.position.lerp(desiredPos, 0.06);
        cameraTargetRef.current.lerp(targetPos, 0.06);
        camera.lookAt(cameraTargetRef.current);

        if (glowLightRef.current) {
          glowLightRef.current.intensity = 0.3 + 0.3 * Math.sin(t * 20);
        }
      } else {
        // Idle: Camera orbit
        const time = Date.now() * 0.0001;
        const radius = 80;
        const heightOffset = 25;
        const x = radius * Math.sin(time);
        const z = radius * Math.cos(time);
        camera.position.lerp(new THREE.Vector3(x, heightOffset, z), 0.02);
        camera.lookAt(25, 5, 0);
        cameraTargetRef.current.set(25, 5, 0);
      }

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    };
  }, []);

  // ===== LAUNCH =====
  const handleLaunch = () => {
    const state = simState.current;
    
    // Reset parrot if needed
    if (state.parrotHit) {
      state.parrotHit = false;
      setParrotHit(false);
      if (parrotRef.current) {
        parrotRef.current.position.copy(state.parrotPosition);
      }
    }
    
    state.frame = 0;
    state.realPathPoints = [];
    state.maxHeight = 0;
    state.totalRange = 0;
    state.flightTime = 0;
    state.isPlaying = true;
    
    if (ballRef.current) {
      ballRef.current.position.set(0, 0.8, 0);
    }
    if (arrowRef.current) {
      arrowRef.current.position.set(0, 0.8, 0);
      const theta = (state.params.angle * Math.PI) / 180;
      const dir = new THREE.Vector3(Math.cos(theta), Math.sin(theta), 0).normalize();
      arrowRef.current.setDirection(dir);
    }
    if (realLineRef.current) {
      realLineRef.current.geometry.setFromPoints([new THREE.Vector3(0, 0.8, 0)]);
    }
    
    setIsPlaying(true);
    
    updateTelemetry({ 
      time: 0, 
      range: 0, 
      height: 0, 
      speed: state.params.velocity, 
      maxHeight: 0, 
      totalRange: 0, 
      flightTime: 0 
    });
  };

  // ===== RESET =====
  const handleReset = () => {
    const state = simState.current;
    const p = state.params;
    
    state.isPlaying = false;
    state.frame = 0;
    state.realPathPoints = [];
    state.maxHeight = 0;
    state.totalRange = 0;
    state.flightTime = 0;
    state.parrotHit = false;
    setParrotHit(false);
    setScore(0);
    
    setIsPlaying(false);
    
    if (parrotRef.current) {
      parrotRef.current.position.copy(state.parrotPosition);
    }
    
    if (ballRef.current) {
      ballRef.current.position.set(0, 0.8, 0);
    }
    if (arrowRef.current) {
      arrowRef.current.position.set(0, 0.8, 0);
      const theta = (p.angle * Math.PI) / 180;
      const dir = new THREE.Vector3(Math.cos(theta), Math.sin(theta), 0).normalize();
      arrowRef.current.setDirection(dir);
    }
    if (realLineRef.current) {
      realLineRef.current.geometry.setFromPoints([new THREE.Vector3(0, 0.8, 0)]);
    }
    
    updateTelemetry({ time: 0, range: 0, height: 0, speed: 0, maxHeight: 0, totalRange: 0, flightTime: 0 });
  };

  const togglePrediction = () => {
    setShowPrediction(!showPrediction);
    if (predictedLineRef.current) {
      predictedLineRef.current.visible = !showPrediction;
    }
  };

  return (
    <div className="w-full h-full relative" ref={mountRef}>
      {/* Telemetry HUD - Mobile Responsive */}
      <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10">
        <TelemetryHUD telemetry={telemetry} />
      </div>

      {/* Score Display */}
      <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 md:px-4 md:py-2 shadow-lg border-2 border-yellow-400 z-10">
        <span className="text-sm md:text-base font-bold text-yellow-600">
          🏆 Score: {score}
        </span>
      </div>

      {/* Hit Message */}
      {parrotHit && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500/90 backdrop-blur-md rounded-2xl px-6 py-4 md:px-8 md:py-6 shadow-2xl z-20 text-center border-4 border-yellow-400 animate-bounce">
          <div className="text-4xl md:text-6xl mb-2">🎉</div>
          <h2 className="text-xl md:text-3xl font-extrabold text-white">You Hit the Parrot!</h2>
          <p className="text-sm md:text-base text-white/80 mt-1">Amazing shot! 🦜</p>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-20 left-2 md:bottom-24 md:left-4 bg-white/80 backdrop-blur-sm rounded-xl p-1.5 md:p-2.5 z-10 text-[9px] md:text-xs font-bold text-slate-600 flex flex-col gap-0.5 md:gap-1 shadow-lg">
        <div className="flex items-center gap-1 md:gap-2">
          <div className="w-3 md:w-6 h-0.5 border-t-2 border-dashed border-purple-400"></div>
          <span className="hidden md:inline">Predicted Path</span>
          <span className="md:hidden">Predicted</span>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <div className="w-3 md:w-6 h-0.5 bg-red-400"></div>
          <span className="hidden md:inline">Real Path</span>
          <span className="md:hidden">Real</span>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 flex gap-1.5 md:gap-3 z-10 flex-wrap">
        <button
          onClick={handleLaunch}
          disabled={isPlaying}
          className={`px-3 py-1.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl text-white font-extrabold shadow-lg transform active:scale-95 transition-all text-xs md:text-sm tracking-wide ${
            isPlaying 
              ? 'bg-slate-400 cursor-not-allowed animate-pulse' 
              : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-500/30'
          }`}
        >
          {isPlaying ? '🚀 Flying...' : '🚀 Launch'}
        </button>
        
        <button
          onClick={handleReset}
          className="px-3 py-1.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl bg-slate-600 hover:bg-slate-500 text-white font-extrabold shadow-lg transform active:scale-95 transition-all text-xs md:text-sm tracking-wide"
        >
          🔄 Reset
        </button>
        
        <button
          onClick={togglePrediction}
          className={`px-3 py-1.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-extrabold shadow-lg transform active:scale-95 transition-all text-xs md:text-sm tracking-wide ${
            showPrediction 
              ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/30' 
              : 'bg-slate-600 hover:bg-slate-500 text-white'
          }`}
        >
          {showPrediction ? '📐 Hide Path' : '📐 Show Path'}
        </button>
      </div>
    </div>
  );
}