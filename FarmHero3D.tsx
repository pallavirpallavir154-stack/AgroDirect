import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const FarmHero3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 450;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1a4329, 0.015);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 15, 30);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting (Warm golden morning sunlight)
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfef08a, 1.2);
    sunLight.position.set(20, 40, 20);
    scene.add(sunLight);

    const fillLight = new THREE.PointLight(0x4ade80, 0.8, 50);
    fillLight.position.set(-15, 10, 10);
    scene.add(fillLight);

    // Group for farm elements
    const farmGroup = new THREE.Group();
    scene.add(farmGroup);

    // Terrain grid plane with wave deformation
    const terrainGeo = new THREE.PlaneGeometry(60, 60, 40, 40);
    terrainGeo.rotateX(-Math.PI / 2);
    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const y = Math.sin(x * 0.15) * Math.cos(z * 0.15) * 1.5;
      posAttr.setY(i, y);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x163820,
      roughness: 0.85,
      metalness: 0.1,
      wireframe: false,
      flatShading: true,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.position.y = -2;
    farmGroup.add(terrain);

    // Crop Stalks / Wheat Field instances
    const cropCount = 180;
    const cropGeo = new THREE.ConeGeometry(0.12, 2.5, 4);
    const cropMat = new THREE.MeshStandardMaterial({
      color: 0xeab308, // Golden ripe crop
      roughness: 0.6,
      metalness: 0.2,
    });
    const greenMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e, // Fresh lush green crop
      roughness: 0.7,
    });

    const cropInstanced = new THREE.InstancedMesh(cropGeo, cropMat, cropCount);
    const greenCropInstanced = new THREE.InstancedMesh(cropGeo, greenMat, cropCount);

    const dummy = new THREE.Object3D();
    for (let i = 0; i < cropCount; i++) {
      const x = (Math.random() - 0.5) * 35;
      const z = (Math.random() - 0.5) * 35;
      const y = Math.sin(x * 0.15) * Math.cos(z * 0.15) * 1.5 - 0.8;
      
      dummy.position.set(x, y + 1.2, z);
      dummy.rotation.x = (Math.random() - 0.5) * 0.2;
      dummy.rotation.z = (Math.random() - 0.5) * 0.2;
      dummy.scale.setScalar(0.8 + Math.random() * 0.6);
      dummy.updateMatrix();
      cropInstanced.setMatrixAt(i, dummy.matrix);

      dummy.position.set(x + 2, y + 1.2, z + 2);
      dummy.updateMatrix();
      greenCropInstanced.setMatrixAt(i, dummy.matrix);
    }
    farmGroup.add(cropInstanced);
    farmGroup.add(greenCropInstanced);

    // Floating natural pollen / harvest particle field
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 50;
      particlePos[i + 1] = Math.random() * 18;
      particlePos[i + 2] = (Math.random() - 0.5) * 50;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xfef08a,
      size: 0.25,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / height) * 2 - 1);
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle wind wave across crops
      farmGroup.rotation.y = Math.sin(elapsedTime * 0.15) * 0.05 + mouseX * 0.08;
      farmGroup.rotation.x = mouseY * 0.05;

      // Float particles
      const positions = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] -= 0.02;
        if (positions[i] < 0) positions[i] = 18;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height || 450;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    });
    resizeObserver.observe(container);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="agro-3d-canvas-container"
      className="w-full h-80 sm:h-96 md:h-[460px] rounded-3xl overflow-hidden pointer-events-auto"
      style={{
        background: 'radial-gradient(ellipse at bottom, #1e4b30 0%, #102a1b 70%, #0a1b11 100%)',
      }}
    />
  );
};
