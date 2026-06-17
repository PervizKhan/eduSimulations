"use client";
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Projectile3D({ params }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 1. SCENE & ENVIRONMENT (Gamified Cyberpunk Look)
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0f172a, 0.02); // Dark neon fog
    scene.background = new THREE.Color(0x0f172a);

    // 2. RESPONSIVE CAMERA
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(-8, 8, 25);

    // 3. RENDERER (Mobile Friendly & HD)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Sharp on phones
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // 4. LIGHTING (Dramatic Game Lighting)
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const spotLight = new THREE.SpotLight(0xffffff, 3);
    spotLight.position.set(10, 20, 10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // 5. GRID & FLOOR
    const floorGeo = new THREE.PlaneGeometry(200, 50);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 1 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(200, 100, 0x0ea5e9, 0x1e293b); // Neon Blue Grid
    grid.position.y = 0.01;
    scene.add(grid);

    // 6. LAUNCHER CANNON
    const cannonGroup = new THREE.Group();
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2, 1, 16), baseMat);
    base.position.y = 0.5;
    base.receiveShadow = true;
    scene.add(base);

    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 3, 16), baseMat);
    barrel.position.y = 1.5;
    barrel.castShadow = true;
    cannonGroup.add(barrel);
    scene.add(cannonGroup);

    // 7. GLOWING PROJECTILE
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshStandardMaterial({
        color: 0xf97316,
        emissive: 0xea580c,
        emissiveIntensity: 0.8,
        metalness: 0.3
      })
    );
    ball.castShadow = true;
    scene.add(ball);

    const ballLight = new THREE.PointLight(0xf97316, 2, 15);
    ball.add(ballLight);

    // 8. TARGET (Bullseye Ring)
    const targetGroup = new THREE.Group();
    const ringGeo = new THREE.RingGeometry(1.5, 2, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x22c55e, side: THREE.DoubleSide });
    const targetRing = new THREE.Mesh(ringGeo, ringMat);
    targetRing.rotation.x = -Math.PI / 2;
    targetGroup.add(targetRing);
    
    const dotMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
    const targetDot = new THREE.Mesh(new THREE.CircleGeometry(0.4, 32), dotMat);
    targetDot.rotation.x = -Math.PI / 2;
    targetGroup.add(targetDot);
    targetGroup.position.y = 0.05;
    scene.add(targetGroup);

    // 9. TRAIL EFFECT
    const MAX_POINTS = 100;
    const trailGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(MAX_POINTS * 3);
    trailGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const trailMat = new THREE.LineBasicMaterial({ color: 0xfbd38d, linewidth: 2 });
    const trail = new THREE.Line(trailGeo, trailMat);
    scene.add(trail);

    // --- PHYSICS VARIABLES ---
    let t = 0;
    let trailIndex = 0;
    const v0 = params.velocity || 15;
    const angleDeg = params.angle || 45;
    const angle = (angleDeg * Math.PI) / 180;
    const g = 9.8;

    // Apply Live Angle to Cannon
    cannonGroup.rotation.z = -((Math.PI / 2) - angle);
    
    // Set Target Location (Physics Formula: R = v^2 * sin(2*theta) / g)
    const maxRange = (v0 * v0 * Math.sin(2 * angle)) / g;
    targetGroup.position.x = maxRange;

    // Handle Mobile/Desktop Resize
    const onResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // --- GAME LOOP ---
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Advance Time
      t += 0.04;

      // Projectile Math
      const x = v0 * Math.cos(angle) * t;
      const y = (v0 * Math.sin(angle) * t) - (0.5 * g * t * t);

      if (y >= 0) {
        ball.position.set(x, y + 0.5, 0);

        // Draw Trail
        if (trailIndex < MAX_POINTS) {
          positions[trailIndex * 3] = x;
          positions[trailIndex * 3 + 1] = y + 0.5;
          positions[trailIndex * 3 + 2] = 0;
          trailGeo.attributes.position.needsUpdate = true;
          trailGeo.setDrawRange(0, trailIndex);
          trailIndex++;
        }
      } else {
        // Reset and loop the shot
        t = 0;
        trailIndex = 0;
        trailGeo.setDrawRange(0, 0);
      }

      // Cinematic Camera Follow
      const targetCamX = ball.position.x * 0.6 - 5;
      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.lookAt(ball.position.x * 0.5, 4, 0);

      // Pulsating Target Animation
      const pulse = 1 + Math.sin(Date.now() * 0.005) * 0.2;
      targetRing.scale.set(pulse, pulse, 1);

      renderer.render(scene, camera);
    };
    animate();

    // CLEANUP MEMORY (Crucial for React + Three.js)
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      if (mountRef.current) mountRef.current.innerHTML = '';
      
      floorGeo.dispose(); floorMat.dispose();
      baseMat.dispose(); trailGeo.dispose(); trailMat.dispose();
      ringGeo.dispose(); ringMat.dispose(); dotMat.dispose();
    };
  }, [params]); // Engine restarts when sliders move

  return <div ref={mountRef} className="w-full h-full" />;
}
