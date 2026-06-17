"use client";
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Projectile3D({ params }) {
  const mountRef = useRef(null);
  useEffect(() => {
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f9ff);
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(400, 400);
    mountRef.current.appendChild(renderer.domElement);
    const geo = new THREE.SphereGeometry(0.5, 32, 32);
    const mat = new THREE.MeshStandardMaterial({ color: 0xff6b6b });
    const ball = new THREE.Mesh(geo, mat);
    scene.add(ball);
    camera.position.z = 10;
    function animate() {
      requestAnimationFrame(animate);
      ball.position.y = Math.sin(Date.now() * 0.005) * 2;
      renderer.render(scene, camera);
    }
    animate();
    return () => { if (mountRef.current) mountRef.current.innerHTML = ''; };
  }, []);
  return <div ref={mountRef} className="flex justify-center items-center w-full h-full" />;
}
