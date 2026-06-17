"use client";
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Projectile3D({ params }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Setup Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f9ff);
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Ball
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b })
    );
    scene.add(ball);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    camera.position.set(0, 2, 10);
    camera.lookAt(0, 0, 0);

    // Physics Variables
    let t = 0;
    const v0 = params.velocity || 10;
    const angle = (params.angle || 45) * (Math.PI / 180);
    const g = 9.8;

    function animate() {
      const frameId = requestAnimationFrame(animate);
      
      // Real Physics Calculation
      t += 0.05;
      const x = v0 * Math.cos(angle) * t;
      const y = (v0 * Math.sin(angle) * t) - (0.5 * g * t * t);

      ball.position.set(x - 5, y, 0);

      // Reset when it hits ground
      if (y < -2) t = 0;

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animate);
      if (mountRef.current) mountRef.current.innerHTML = '';
    };
  }, [params]); // Re-run when sliders change

  return <div ref={mountRef} className="w-full h-full" />;
}
