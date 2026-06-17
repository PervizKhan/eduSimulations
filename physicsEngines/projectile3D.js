import * as THREE from 'three';

export default class Projectile3DEngine {
  constructor({ container, config, controlValues, onTelemetryUpdate, isPremium }) {
    this.container = container;
    this.config = config;
    this.controlValues = controlValues;
    this.onTelemetryUpdate = onTelemetryUpdate;
    this.isPremium = isPremium;

    this.isRunning = false;
    this.animationId = null;
    this.time = 0;

    // Initialize Three.js scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    container.appendChild(this.renderer.domElement);

    // --- Scene Setup: Child-Friendly Aesthetics ---
    // Sky gradient background
    this.scene.background = new THREE.Color(0xbae6fd);

    // Grass ground
    const groundGeo = new THREE.PlaneGeometry(60, 60);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x4ade80,
      roughness: 0.8,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });
    this.ground = new THREE.Mesh(groundGeo, groundMat);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.y = -0.01;
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);

    // Grid helper (child-friendly subtle)
    const gridHelper = new THREE.GridHelper(60, 20, 0x86efac, 0x86efac);
    gridHelper.position.y = 0.01;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.3;
    this.scene.add(gridHelper);

    // Lighting - warm and playful
    const ambientLight = new THREE.AmbientLight(0x88ccff, 0.5);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffeedd, 2.0);
    sunLight.position.set(20, 30, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    const d = 30;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 50;
    this.scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x8888ff, 0.3);
    fillLight.position.set(-10, 20, -10);
    this.scene.add(fillLight);

    // --- Projectile Object ---
    const sphereGeo = new THREE.SphereGeometry(0.6, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.2,
      metalness: 0.4,
      emissive: 0xf97316,
      emissiveIntensity: 0.1,
    });
    this.projectile = new THREE.Mesh(sphereGeo, sphereMat);
    this.projectile.castShadow = true;
    this.projectile.position.set(0, 0.6, 0);
    this.scene.add(this.projectile);

    // Trail
    this.trailPositions = [];
    this.trailLine = null;

    // --- State ---
    this.position = { x: 0, y: 0.6, z: 0 };
    this.velocity = { x: 0, y: 0, z: 0 };
    this.maxHeight = 0;
    this.hasLanded = false;
    this.flightTime = 0;
    this.startX = 0;
    this.startZ = 0;

    // --- Camera ---
    this.camera.position.set(15, 12, 20);
    this.camera.lookAt(0, 2, 0);

    // Handle resize
    this.resizeHandler = () => this.handleResize();
    window.addEventListener('resize', this.resizeHandler);

    // Initialize with control values
    this.resetSimulation();
  }

  resetSimulation() {
    const { v0, angle, azimuth, g } = this.controlValues;
    const angleRad = angle * Math.PI / 180;
    const azimuthRad = azimuth * Math.PI / 180;

    this.time = 0;
    this.position = { x: 0, y: 0.6, z: 0 };
    this.velocity = {
      x: v0 * Math.cos(angleRad) * Math.sin(azimuthRad),
      y: v0 * Math.sin(angleRad),
      z: v0 * Math.cos(angleRad) * Math.cos(azimuthRad),
    };
    this.maxHeight = 0.6;
    this.hasLanded = false;
    this.flightTime = 0;
    this.startX = 0;
    this.startZ = 0;
    this.trailPositions = [];
    this.updateProjectilePosition();
    this.updateTelemetry();
  }

  updateProjectilePosition() {
    this.projectile.position.set(this.position.x, this.position.y, this.position.z);
  }

  updateTelemetry() {
    const speed = Math.sqrt(
      this.velocity.x ** 2 + this.velocity.y ** 2 + this.velocity.z ** 2
    );
    const range = Math.sqrt(
      (this.position.x - this.startX) ** 2 + (this.position.z - this.startZ) ** 2
    );

    this.onTelemetryUpdate({
      time: this.time,
      speed: speed,
      position: { ...this.position },
      maxHeight: this.maxHeight,
      totalRange: range,
      flightTime: this.flightTime,
    });
  }

  updateTrail() {
    if (this.trailPositions.length > 0) {
      const points = this.trailPositions.map(p => new THREE.Vector3(p.x, p.y, p.z));
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: 0xf97316,
        transparent: true,
        opacity: 0.5,
        linewidth: 2,
      });
      if (this.trailLine) {
        this.scene.remove(this.trailLine);
        this.trailLine.geometry.dispose();
        this.trailLine.material.dispose();
      }
      this.trailLine = new THREE.Line(geometry, material);
      this.scene.add(this.trailLine);
    }
  }

  step(deltaTime) {
    if (this.hasLanded) return;

    const { g } = this.controlValues;
    const dt = Math.min(deltaTime, 0.016);

    // Update velocity (gravity only affects Y)
    this.velocity.y -= g * dt;

    // Update position
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;
    this.position.z += this.velocity.z * dt;

    // Track max height
    if (this.position.y > this.maxHeight) {
      this.maxHeight = this.position.y;
    }

    // Track flight time
    this.flightTime += dt;

    // Check landing (y <= 0.6, which is the sphere radius from ground)
    if (this.position.y <= 0.6) {
      this.position.y = 0.6;
      this.hasLanded = true;
      // Stop all velocity
      this.velocity.x = 0;
      this.velocity.y = 0;
      this.velocity.z = 0;
    }

    // Store trail point (every few frames to avoid too many points)
    if (this.trailPositions.length === 0 ||
        this.trailPositions[this.trailPositions.length - 1].y > 0.6) {
      this.trailPositions.push({ ...this.position });
      if (this.trailPositions.length > 300) {
        this.trailPositions.shift();
      }
    }

    this.updateProjectilePosition();
    this.updateTelemetry();
    this.updateTrail();

    // Update time
    this.time += dt;
  }

  // Camera tracking - cinematic follow
  updateCamera() {
    const target = this.projectile.position.clone();
    // If landed, keep camera steady
    if (this.hasLanded) {
      return;
    }

    // Dynamic camera offset based on trajectory
    const offset = new THREE.Vector3(8, 6, 10);
    const desiredPos = target.clone().add(offset);

    // Smoothly interpolate camera position
    this.camera.position.lerp(desiredPos, 0.03);
    this.camera.lookAt(target);
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop();
  }

  loop() {
    if (!this.isRunning) return;

    const now = performance.now();
    const delta = (now - this.lastTime) / 1000;
    this.lastTime = now;

    // Step the simulation
    this.step(delta);

    // Update camera
    this.updateCamera();

    // Render
    this.renderer.render(this.scene, this.camera);

    this.animationId = requestAnimationFrame(() => this.loop());
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  destroy() {
    this.stop();
    window.removeEventListener('resize', this.resizeHandler);
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.container) {
      this.container.innerHTML = '';
    }
    // Clean up geometry and materials
    this.scene.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }

  handleResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  // External API for control updates
  updateParameter(id, value) {
    // Update control value
    this.controlValues[id] = value;
    // Reset simulation for immediate effect
    this.resetSimulation();
  }

  updateParameters(values) {
    Object.assign(this.controlValues, values);
    this.resetSimulation();
  }

  // Reset API
  reset() {
    this.resetSimulation();
  }
}