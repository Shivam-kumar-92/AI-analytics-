import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const Background3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [is3DActive, setIs3DActive] = useState<boolean>(true);

  useEffect(() => {
    if (!is3DActive || !mountRef.current) return;

    const container = mountRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    // Subtle cyber depth fog
    scene.fog = new THREE.FogExp2(0x020617, 0.0018);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 45);

    // 3. Renderer setup — lower quality on mobile to keep it smooth
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.innerWidth < 768;
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile, // disable antialiasing on mobile for perf
      powerPreference: isMobile ? 'low-power' : 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
    renderer.setClearColor(0x000000, 0); // transparent
    container.appendChild(renderer.domElement);

    // 4. Lighting: Indian Tricolor Theme (Orange / Saffron, White, Emerald Green)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Saffron / Orange Point Light (Top Left)
    const pointLight1 = new THREE.PointLight(0xff7700, 3.5, 140);
    pointLight1.position.set(-30, 25, 30);
    scene.add(pointLight1);

    // Pure White Point Light (Center Horizon)
    const pointLight2 = new THREE.PointLight(0xffffff, 2.5, 110);
    pointLight2.position.set(0, 10, 25);
    scene.add(pointLight2);

    // Emerald Green Point Light (Bottom Right)
    const pointLight3 = new THREE.PointLight(0x138808, 3.5, 140);
    pointLight3.position.set(30, -25, 30);
    scene.add(pointLight3);

    // 5. 3D Floating Geometry & Data Prisms
    const group = new THREE.Group();
    scene.add(group);

    // Dynamic 3D Geometric Mesh Prisms
    const geometries = [
      new THREE.IcosahedronGeometry(2.4, 0),
      new THREE.OctahedronGeometry(2.8, 0),
      new THREE.TetrahedronGeometry(2.2, 0),
      new THREE.TorusGeometry(3.0, 0.4, 8, 24),
      new THREE.DodecahedronGeometry(2.0, 0),
    ];

    // Materials: Combination of Orange, White, and Green
    const materials = [
      // Saffron Orange Wireframe
      new THREE.MeshStandardMaterial({
        color: 0xff7700,
        roughness: 0.2,
        metalness: 0.85,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
        emissive: 0xff5500,
        emissiveIntensity: 0.2,
      }),
      // Pure Pearl White Wireframe & Glint
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.95,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
        emissive: 0xffffff,
        emissiveIntensity: 0.25,
      }),
      // Emerald Green Wireframe
      new THREE.MeshStandardMaterial({
        color: 0x138808,
        roughness: 0.2,
        metalness: 0.85,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
        emissive: 0x0a6e04,
        emissiveIntensity: 0.2,
      }),
      // Translucent Saffron Orange Prism
      new THREE.MeshStandardMaterial({
        color: 0xff9933,
        roughness: 0.25,
        metalness: 0.7,
        wireframe: false,
        transparent: true,
        opacity: 0.28,
      }),
      // Translucent Emerald Green Prism
      new THREE.MeshStandardMaterial({
        color: 0x10b981,
        roughness: 0.25,
        metalness: 0.7,
        wireframe: false,
        transparent: true,
        opacity: 0.28,
      }),
    ];

    const floatingObjects: {
      mesh: THREE.Mesh;
      rotSpeedX: number;
      rotSpeedY: number;
      floatSpeed: number;
      initialY: number;
    }[] = [];

    for (let i = 0; i < 22; i++) {
      const geom = geometries[i % geometries.length];
      const mat = materials[i % materials.length];
      const mesh = new THREE.Mesh(geom, mat);

      const x = (Math.random() - 0.5) * 80;
      const y = (Math.random() - 0.5) * 60;
      const z = (Math.random() - 0.5) * 50;

      mesh.position.set(x, y, z);
      const scale = 0.6 + Math.random() * 0.9;
      mesh.scale.set(scale, scale, scale);

      group.add(mesh);
      floatingObjects.push({
        mesh,
        rotSpeedX: (Math.random() - 0.5) * 0.015,
        rotSpeedY: (Math.random() - 0.5) * 0.015,
        floatSpeed: 0.005 + Math.random() * 0.01,
        initialY: y,
      });
    }

    // 6. 3D Particle Cloud: Exclusively Orange, White, and Green
    const particleCount = 220;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0xff7700), // Vibrant Saffron Orange
      new THREE.Color(0xffa500), // Golden Orange
      new THREE.Color(0xffffff), // Pure Crisp White
      new THREE.Color(0xf1f5f9), // Platinum White
      new THREE.Color(0x138808), // India Emerald Green
      new THREE.Color(0x10b981), // Vivid Mint Green
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 70;

      const c = palette[i % palette.length];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 7. Interactive Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 8. Handle Window Resize
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 9. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation
      targetX += (mouseX * 8 - targetX) * 0.03;
      targetY += (-mouseY * 8 - targetY) * 0.03;

      camera.position.x = targetX;
      camera.position.y = targetY;
      camera.lookAt(0, 0, 0);

      // Rotate group gently
      group.rotation.y = elapsedTime * 0.05;
      group.rotation.x = Math.sin(elapsedTime * 0.03) * 0.1;

      // Animate individual floating objects
      floatingObjects.forEach((obj, idx) => {
        obj.mesh.rotation.x += obj.rotSpeedX;
        obj.mesh.rotation.y += obj.rotSpeedY;
        obj.mesh.position.y = obj.initialY + Math.sin(elapsedTime * 1.5 + idx) * 2.5;
      });

      // Animate particles
      particles.rotation.y = elapsedTime * 0.02;
      particles.rotation.x = -elapsedTime * 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [is3DActive]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 opacity-45 md:opacity-60" />

      {/* Indian Tricolor Ambient Gradient Glow: Top Orange, Center White Luminescence, Bottom Emerald Green */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_20%_-10%,rgba(255,119,0,0.18),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_110%,rgba(19,136,8,0.18),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.04),transparent)]" />

      {/* Decorative 3D Depth Grid Floor with Saffron Orange and Emerald Green gridlines */}
      <div
        className="absolute bottom-0 left-0 right-0 h-96 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 119, 0, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(19, 136, 8, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '44px 44px',
          transform: 'perspective(500px) rotateX(65deg) translateY(40px)',
          transformOrigin: 'bottom center',
        }}
      />
    </div>
  );
};
