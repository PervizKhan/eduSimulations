"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import TelemetryHUD from '@/components/TelemetryHUD';

export default function CartesianCoordinates({ params }) {
  const mountRef = useRef(null);
  const [showDistance, setShowDistance] = useState(true);
  const [showMidpoint, setShowMidpoint] = useState(true);
  const [showLine, setShowLine] = useState(true);
  const [showQuadrants, setShowQuadrants] = useState(true);
  const [telemetry, setTelemetry] = useState({
    point1: '(3, 4)',
    point2: '(-2, -3)',
    distance: '—',
    midpoint: '—',
    quadrant1: 'I',
    quadrant2: 'III',
    slope: '—'
  });

  const safeParams = params || {
    pointX: 3,
    pointY: 4,
    point2X: -2,
    point2Y: -3,
    showGrid: 1,
    showLabels: 1
  };

  // ===== REFERENCES =====
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0, 0));
  const point1Ref = useRef(null);
  const point2Ref = useRef(null);
  const lineRef = useRef(null);
  const distanceLineRef = useRef(null);
  const midpointRef = useRef(null);
  const gridHelperRef = useRef(null);
  const axesHelperRef = useRef(null);
  const quadrantsRef = useRef([]);

  const animationIdRef = useRef(null);

  // ===== CALCULATE PHYSICS VALUES =====
  const calculateValues = useCallback((p) => {
    const x1 = p.pointX;
    const y1 = p.pointY;
    const x2 = p.point2X;
    const y2 = p.point2Y;

    // Distance
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Midpoint
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;

    // Slope
    const slope = dx !== 0 ? dy / dx : Infinity;

    // Quadrant determination
    const getQuadrant = (x, y) => {
      if (x === 0 || y === 0) return 'On Axis';
      if (x > 0 && y > 0) return 'I';
      if (x < 0 && y > 0) return 'II';
      if (x < 0 && y < 0) return 'III';
      if (x > 0 && y < 0) return 'IV';
      return 'On Axis';
    };

    return {
      point1: `(${x1.toFixed(1)}, ${y1.toFixed(1)})`,
      point2: `(${x2.toFixed(1)}, ${y2.toFixed(1)})`,
      distance: distance.toFixed(2),
      midpoint: `(${mx.toFixed(1)}, ${my.toFixed(1)})`,
      quadrant1: getQuadrant(x1, y1),
      quadrant2: getQuadrant(x2, y2),
      slope: dx !== 0 ? slope.toFixed(2) : '∞ (Vertical)'
    };
  }, []);

  const updateTelemetry = useCallback((p) => {
    const values = calculateValues(p);
    setTelemetry(values);
  }, [calculateValues]);

  // ===== UPDATE SCENE =====
  const updateScene = useCallback((p) => {
    const x1 = p.pointX;
    const y1 = p.pointY;
    const x2 = p.point2X;
    const y2 = p.point2Y;

    const point1Pos = new THREE.Vector3(x1, y1, 0);
    const point2Pos = new THREE.Vector3(x2, y2, 0);

    // Update Point 1
    if (point1Ref.current) {
      point1Ref.current.position.copy(point1Pos);
    }

    // Update Point 2
    if (point2Ref.current) {
      point2Ref.current.position.copy(point2Pos);
    }

    // Update Line
    if (lineRef.current && showLine) {
      const points = [point1Pos, point2Pos];
      lineRef.current.geometry.setFromPoints(points);
      lineRef.current.visible = true;
    } else if (lineRef.current) {
      lineRef.current.visible = false;
    }

    // Update Distance Line
    if (distanceLineRef.current && showDistance) {
      // Draw dashed vertical and horizontal lines for distance visualization
      const points = [
        new THREE.Vector3(x1, y1, 0),
        new THREE.Vector3(x1, y2, 0),
        new THREE.Vector3(x2, y2, 0)
      ];
      distanceLineRef.current.geometry.setFromPoints(points);
      distanceLineRef.current.visible = true;
    } else if (distanceLineRef.current) {
      distanceLineRef.current.visible = false;
    }

    // Update Midpoint
    if (midpointRef.current && showMidpoint) {
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      midpointRef.current.position.set(mx, my, 0);
      midpointRef.current.visible = true;
    } else if (midpointRef.current) {
      midpointRef.current.visible = false;
    }

    // Update Telemetry
    updateTelemetry(p);
  }, [showLine, showDistance, showMidpoint, updateTelemetry]);

  // ===== SYNC PARAMS =====
  useEffect(() => {
    updateScene(safeParams);
  }, [safeParams, updateScene]);

  // ===== THREE.JS SCENE SETUP =====
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- Scene ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a0e1a');
    sceneRef.current = scene;

    // --- Camera (Top-down isometric view) ---
    const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(18, 18, 25);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0x4a6fa5, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(20, 40, 20);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x4a6fa5, 0.3);
    fillLight.position.set(-20, 10, -20);
    scene.add(fillLight);

    // --- Grid ---
    const gridSize = 20;
    const divisions = 20;
    const gridHelper = new THREE.GridHelper(gridSize, divisions, 0x4a6fa5, 0x2a4a7a);
    gridHelper.position.y = 0;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = safeParams.showGrid ? 0.6 : 0;
    scene.add(gridHelper);
    gridHelperRef.current = gridHelper;

    // --- Axes (Enhanced) ---
    // X-axis (Red)
    const xAxisGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-12, 0, 0),
      new THREE.Vector3(12, 0, 0)
    ]);
    const xAxisMat = new THREE.LineBasicMaterial({ color: 0xff4444, linewidth: 2 });
    const xAxis = new THREE.Line(xAxisGeo, xAxisMat);
    scene.add(xAxis);

    // Y-axis (Green)
    const yAxisGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -10, 0),
      new THREE.Vector3(0, 10, 0)
    ]);
    const yAxisMat = new THREE.LineBasicMaterial({ color: 0x44ff44, linewidth: 2 });
    const yAxis = new THREE.Line(yAxisGeo, yAxisMat);
    scene.add(yAxis);

    // Axis labels (using sprites)
    const createLabel = (text, position, color = '#ffffff') => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 128;
      canvas.height = 64;
      ctx.fillStyle = 'transparent';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = 'bold 28px Arial';
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, canvas.width/2, canvas.height/2);
      
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ 
        map: texture, 
        transparent: true,
        depthTest: false
      });
      const sprite = new THREE.Sprite(material);
      sprite.position.copy(position);
      sprite.scale.set(1.5, 0.75, 1);
      return sprite;
    };

    if (safeParams.showLabels) {
      scene.add(createLabel('X', new THREE.Vector3(13, 0, 0), '#ff4444'));
      scene.add(createLabel('Y', new THREE.Vector3(0, 11, 0), '#44ff44'));
      scene.add(createLabel('O', new THREE.Vector3(-0.8, -0.8, 0), '#ffffff'));
    }

    // --- Quadrants (Background colors) ---
    const createQuadrant = (x, y, color) => {
      const geo = new THREE.PlaneGeometry(10, 10);
      const mat = new THREE.MeshBasicMaterial({ 
        color: color, 
        transparent: true, 
        opacity: 0.08,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, -0.1);
      mesh.rotation.x = -Math.PI / 2;
      mesh.visible = showQuadrants;
      return mesh;
    };

    const q1 = createQuadrant(5, 5, 0x44ff44);
    const q2 = createQuadrant(-5, 5, 0xff4444);
    const q3 = createQuadrant(-5, -5, 0x4444ff);
    const q4 = createQuadrant(5, -5, 0xffaa44);
    scene.add(q1);
    scene.add(q2);
    scene.add(q3);
    scene.add(q4);
    quadrantsRef.current = [q1, q2, q3, q4];

    // --- Quadrant Labels ---
    if (safeParams.showLabels && showQuadrants) {
      scene.add(createLabel('I', new THREE.Vector3(6, 6, 0), '#44ff44'));
      scene.add(createLabel('II', new THREE.Vector3(-6, 6, 0), '#ff4444'));
      scene.add(createLabel('III', new THREE.Vector3(-6, -6, 0), '#4444ff'));
      scene.add(createLabel('IV', new THREE.Vector3(6, -6, 0), '#ffaa44'));
    }

    // --- Point 1 (Red) ---
    const sphere1Geo = new THREE.SphereGeometry(0.5, 24, 24);
    const sphere1Mat = new THREE.MeshStandardMaterial({ 
      color: 0xff6b6b, 
      emissive: 0xff6b6b,
      emissiveIntensity: 0.3,
      roughness: 0.2,
      metalness: 0.3
    });
    const point1 = new THREE.Mesh(sphere1Geo, sphere1Mat);
    point1.position.set(safeParams.pointX, safeParams.pointY, 0);
    point1.castShadow = true;
    scene.add(point1);
    point1Ref.current = point1;

    // Point 1 label (P₁)
    const p1Label = createLabel('P₁', new THREE.Vector3(safeParams.pointX, safeParams.pointY + 0.8, 0), '#ff6b6b');
    scene.add(p1Label);

    // --- Point 2 (Blue) ---
    const sphere2Geo = new THREE.SphereGeometry(0.5, 24, 24);
    const sphere2Mat = new THREE.MeshStandardMaterial({ 
      color: 0x4dabf7, 
      emissive: 0x4dabf7,
      emissiveIntensity: 0.3,
      roughness: 0.2,
      metalness: 0.3
    });
    const point2 = new THREE.Mesh(sphere2Geo, sphere2Mat);
    point2.position.set(safeParams.point2X, safeParams.point2Y, 0);
    point2.castShadow = true;
    scene.add(point2);
    point2Ref.current = point2;

    // Point 2 label (P₂)
    const p2Label = createLabel('P₂', new THREE.Vector3(safeParams.point2X, safeParams.point2Y + 0.8, 0), '#4dabf7');
    scene.add(p2Label);

    // --- Line between points ---
    const lineGeo = new THREE.BufferGeometry();
    const linePoints = [
      new THREE.Vector3(safeParams.pointX, safeParams.pointY, 0),
      new THREE.Vector3(safeParams.point2X, safeParams.point2Y, 0)
    ];
    lineGeo.setFromPoints(linePoints);
    const lineMat = new THREE.LineBasicMaterial({ 
      color: 0xffdd00, 
      linewidth: 2,
      transparent: true,
      opacity: 0.6
    });
    const line = new THREE.Line(lineGeo, lineMat);
    scene.add(line);
    lineRef.current = line;

    // --- Distance visualization (dashed lines) ---
    const distGeo = new THREE.BufferGeometry();
    const distPoints = [
      new THREE.Vector3(safeParams.pointX, safeParams.pointY, 0),
      new THREE.Vector3(safeParams.pointX, safeParams.point2Y, 0),
      new THREE.Vector3(safeParams.point2X, safeParams.point2Y, 0)
    ];
    distGeo.setFromPoints(distPoints);
    const distMat = new THREE.LineDashedMaterial({
      color: 0xffaa44,
      dashSize: 0.2,
      gapSize: 0.15,
      transparent: true,
      opacity: 0.4
    });
    const distLine = new THREE.Line(distGeo, distMat);
    distLine.computeLineDistances();
    scene.add(distLine);
    distanceLineRef.current = distLine;

    // --- Midpoint (Purple Star) ---
    const mx = (safeParams.pointX + safeParams.point2X) / 2;
    const my = (safeParams.pointY + safeParams.point2Y) / 2;
    const midGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const midMat = new THREE.MeshStandardMaterial({ 
      color: 0xcc44ff, 
      emissive: 0xcc44ff,
      emissiveIntensity: 0.5
    });
    const midpoint = new THREE.Mesh(midGeo, midMat);
    midpoint.position.set(mx, my, 0);
    scene.add(midpoint);
    midpointRef.current = midpoint;

    // Midpoint label
    const mLabel = createLabel('M', new THREE.Vector3(mx, my + 0.8, 0), '#cc44ff');
    scene.add(mLabel);

    // --- Initial telemetry update ---
    updateTelemetry(safeParams);

    // --- Resize handler ---
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ===== ANIMATION LOOP =====
    const animate = () => {
      // Idle camera orbit (slow)
      const time = Date.now() * 0.00005;
      const radius = 30;
      const heightOffset = 20;
      const targetX = radius * Math.sin(time);
      const targetZ = radius * Math.cos(time);
      
      camera.position.lerp(new THREE.Vector3(targetX, heightOffset, targetZ), 0.01);
      camera.lookAt(0, 0, 0);
      cameraTargetRef.current.set(0, 0, 0);

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // ===== CLEANUP =====
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
  }, [safeParams, updateTelemetry, showQuadrants]);

  // ===== TOGGLE FUNCTIONS =====
  const toggleDistance = () => {
    setShowDistance(!showDistance);
    if (distanceLineRef.current) {
      distanceLineRef.current.visible = !showDistance;
    }
  };

  const toggleMidpoint = () => {
    setShowMidpoint(!showMidpoint);
    if (midpointRef.current) {
      midpointRef.current.visible = !showMidpoint;
    }
  };

  const toggleLine = () => {
    setShowLine(!showLine);
    if (lineRef.current) {
      lineRef.current.visible = !showLine;
    }
  };

  const toggleQuadrants = () => {
    setShowQuadrants(!showQuadrants);
    quadrantsRef.current.forEach(q => {
      if (q) q.visible = !showQuadrants;
    });
  };

  return (
    <div className="w-full h-full relative" ref={mountRef}>
      {/* Telemetry HUD */}
      <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10 max-w-[200px]">
        <div className="bg-slate-900/90 backdrop-blur-md rounded-xl p-3 border border-slate-700 shadow-xl">
          <h3 className="text-xs font-bold text-cyan-400 mb-2 border-b border-slate-700 pb-1">
            📊 Point Data
          </h3>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">P₁</span>
              <span className="text-red-400 font-mono">{telemetry.point1}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">P₂</span>
              <span className="text-blue-400 font-mono">{telemetry.point2}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Quadrant P₁</span>
              <span className="text-green-400 font-mono">{telemetry.quadrant1}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Quadrant P₂</span>
              <span className="text-green-400 font-mono">{telemetry.quadrant2}</span>
            </div>
            <div className="border-t border-slate-700 pt-1 mt-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Distance</span>
                <span className="text-yellow-400 font-mono">{telemetry.distance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Midpoint</span>
                <span className="text-purple-400 font-mono">{telemetry.midpoint}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Slope</span>
                <span className="text-orange-400 font-mono">{telemetry.slope}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 flex gap-1.5 md:gap-2 z-10 flex-wrap">
        <button
          onClick={toggleDistance}
          className={`px-2 py-1 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-bold transition ${
            showDistance 
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
              : 'bg-slate-700/50 text-slate-400 border border-slate-600'
          }`}
        >
          📏 Distance
        </button>
        <button
          onClick={toggleMidpoint}
          className={`px-2 py-1 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-bold transition ${
            showMidpoint 
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
              : 'bg-slate-700/50 text-slate-400 border border-slate-600'
          }`}
        >
          📍 Midpoint
        </button>
        <button
          onClick={toggleLine}
          className={`px-2 py-1 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-bold transition ${
            showLine 
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
              : 'bg-slate-700/50 text-slate-400 border border-slate-600'
          }`}
        >
          📐 Line
        </button>
        <button
          onClick={toggleQuadrants}
          className={`px-2 py-1 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-bold transition ${
            showQuadrants 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-slate-700/50 text-slate-400 border border-slate-600'
          }`}
        >
          🔲 Quadrants
        </button>
      </div>
    </div>
  );
}