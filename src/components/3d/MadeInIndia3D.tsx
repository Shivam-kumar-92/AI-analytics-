import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Shield, RotateCw, ExternalLink, Award, CheckCircle2 } from 'lucide-react';

interface MadeInIndia3DProps {
  variant?: 'hero-widget' | 'compact-badge' | 'modal-view';
  onExplore?: () => void;
}

export const MadeInIndia3D: React.FC<MadeInIndia3DProps> = ({
  variant = 'hero-widget',
  onExplore,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showModal, setShowModal] = useState(false);

  // 3D Canvas initialization for the interactive 3D Coin/Emblem
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const size = variant === 'compact-badge' ? 44 : 260;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 7);

    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.innerWidth < 768;
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: isMobile ? 'low-power' : 'high-performance',
    });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Golden directional light
    const dirLight1 = new THREE.DirectionalLight(0xffd700, 2.5);
    dirLight1.position.set(5, 5, 8);
    scene.add(dirLight1);

    // Saffron accent light
    const saffronLight = new THREE.PointLight(0xff9933, 3, 15);
    saffronLight.position.set(-4, 3, 4);
    scene.add(saffronLight);

    // Emerald Green accent light
    const greenLight = new THREE.PointLight(0x138808, 3, 15);
    greenLight.position.set(4, -3, 4);
    scene.add(greenLight);

    // 3D Emblem Group
    const emblemGroup = new THREE.Group();
    scene.add(emblemGroup);

    // 1. Outer Coin Base (Gold Metallic Cylinder)
    const coinGeom = new THREE.CylinderGeometry(2.3, 2.3, 0.28, 64);
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xdfab37,
      metalness: 0.92,
      roughness: 0.25,
    });
    const coinMesh = new THREE.Mesh(coinGeom, goldMaterial);
    coinMesh.rotation.x = Math.PI / 2;
    emblemGroup.add(coinMesh);

    // 2. Outer Rim Bevel
    const rimGeom = new THREE.TorusGeometry(2.32, 0.08, 16, 64);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xffe082,
      metalness: 0.95,
      roughness: 0.15,
    });
    const rimMesh = new THREE.Mesh(rimGeom, rimMat);
    emblemGroup.add(rimMesh);

    // 3. Indian Tricolor Bands (Saffron, White, Emerald Green) - Front & Back
    // Front Saffron Arc
    const saffronBandGeom = new THREE.TorusGeometry(2.08, 0.12, 16, 32, Math.PI * 0.65);
    const saffronMat = new THREE.MeshStandardMaterial({
      color: 0xff7700,
      metalness: 0.5,
      roughness: 0.2,
      emissive: 0xff5500,
      emissiveIntensity: 0.4,
    });
    const saffronBandFront = new THREE.Mesh(saffronBandGeom, saffronMat);
    saffronBandFront.position.z = 0.16;
    saffronBandFront.rotation.z = Math.PI * 0.18;
    emblemGroup.add(saffronBandFront);

    // Back Saffron Arc
    const saffronBandBack = new THREE.Mesh(saffronBandGeom, saffronMat);
    saffronBandBack.position.z = -0.16;
    saffronBandBack.rotation.z = Math.PI * 0.18;
    emblemGroup.add(saffronBandBack);

    // Front Green Arc
    const greenBandGeom = new THREE.TorusGeometry(2.08, 0.12, 16, 32, Math.PI * 0.65);
    const greenMat = new THREE.MeshStandardMaterial({
      color: 0x138808,
      metalness: 0.5,
      roughness: 0.2,
      emissive: 0x0a6e04,
      emissiveIntensity: 0.4,
    });
    const greenBandFront = new THREE.Mesh(greenBandGeom, greenMat);
    greenBandFront.position.z = 0.16;
    greenBandFront.rotation.z = Math.PI * 1.18;
    emblemGroup.add(greenBandFront);

    // Back Green Arc
    const greenBandBack = new THREE.Mesh(greenBandGeom, greenMat);
    greenBandBack.position.z = -0.16;
    greenBandBack.rotation.z = Math.PI * 1.18;
    emblemGroup.add(greenBandBack);

    // 4. Central Ashoka Chakra in Navy Blue (24 Spokes) - Front & Back
    const navyMat = new THREE.MeshStandardMaterial({
      color: 0x000080,
      metalness: 0.8,
      roughness: 0.3,
    });

    const hubGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.06, 24);
    const chakraRimGeom = new THREE.TorusGeometry(1.0, 0.045, 12, 48);
    const spokeGeom = new THREE.BoxGeometry(0.035, 1.0, 0.03);

    const createChakra = (zPos: number) => {
      const chGroup = new THREE.Group();
      chGroup.position.z = zPos;

      // Hub
      const hubMesh = new THREE.Mesh(hubGeom, navyMat);
      hubMesh.rotation.x = Math.PI / 2;
      chGroup.add(hubMesh);

      // Rim
      const chakraRim = new THREE.Mesh(chakraRimGeom, navyMat);
      chGroup.add(chakraRim);

      // 24 Spokes
      for (let i = 0; i < 24; i++) {
        const spoke = new THREE.Mesh(spokeGeom, navyMat);
        const angle = (i * Math.PI) / 12;
        spoke.position.set((Math.sin(angle) * 1.0) / 2, (Math.cos(angle) * 1.0) / 2, 0);
        spoke.rotation.z = -angle;
        chGroup.add(spoke);
      }

      return chGroup;
    };

    const chakraGroup = createChakra(0.18);
    emblemGroup.add(chakraGroup);

    const chakraGroupBack = createChakra(-0.18);
    emblemGroup.add(chakraGroupBack);

    // 5. Gear Teeth (Make in India Industrial Cogs)
    const gearMat = new THREE.MeshStandardMaterial({
      color: 0xffd54f,
      metalness: 0.9,
      roughness: 0.2,
    });
    const toothGeom = new THREE.BoxGeometry(0.22, 0.18, 0.25);
    for (let i = 0; i < 16; i++) {
      const tooth = new THREE.Mesh(toothGeom, gearMat);
      const angle = (i * 2 * Math.PI) / 16;
      tooth.position.set(Math.cos(angle) * 2.36, Math.sin(angle) * 2.36, 0);
      tooth.rotation.z = angle;
      emblemGroup.add(tooth);
    }

    // Set initial proud 3D perspective angle
    emblemGroup.rotation.y = -0.25;
    emblemGroup.rotation.x = 0.12;

    // Mouse & Touch Drag Rotation
    let isDragging = false;
    let previousClientX = 0;
    let previousClientY = 0;
    let rotationVelocityX = 0;
    let rotationVelocityY = 0.008; // Smooth auto spin default

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousClientX = e.clientX;
      previousClientY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousClientX;
      const deltaY = e.clientY - previousClientY;
      emblemGroup.rotation.y += deltaX * 0.015;
      emblemGroup.rotation.x += deltaY * 0.015;
      rotationVelocityY = deltaX * 0.008;
      rotationVelocityX = deltaY * 0.008;
      previousClientX = e.clientX;
      previousClientY = e.clientY;
    };

    const onMouseUp = () => { isDragging = false; };

    // ---- Touch support for Android / iOS ----
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousClientX = e.touches[0].clientX;
        previousClientY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      e.preventDefault(); // prevent page scroll while spinning
      const deltaX = e.touches[0].clientX - previousClientX;
      const deltaY = e.touches[0].clientY - previousClientY;
      emblemGroup.rotation.y += deltaX * 0.015;
      emblemGroup.rotation.x += deltaY * 0.015;
      rotationVelocityY = deltaX * 0.008;
      rotationVelocityX = deltaY * 0.008;
      previousClientX = e.touches[0].clientX;
      previousClientY = e.touches[0].clientY;
    };

    const onTouchEnd = () => { isDragging = false; };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    domElement.addEventListener('touchmove', onTouchMove, { passive: false });
    domElement.addEventListener('touchend', onTouchEnd, { passive: true });

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isDragging) {
        // Continuous auto-spin with damping
        emblemGroup.rotation.y += rotationVelocityY;
        emblemGroup.rotation.x += rotationVelocityX;

        // Ashoka Chakra internal counter-rotation
        chakraGroup.rotation.z -= 0.01;

        // Smoothly restore base velocity
        rotationVelocityY = THREE.MathUtils.lerp(rotationVelocityY, 0.008, 0.02);
        rotationVelocityX = THREE.MathUtils.lerp(rotationVelocityX, 0, 0.02);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('touchstart', onTouchStart);
      domElement.removeEventListener('touchmove', onTouchMove);
      domElement.removeEventListener('touchend', onTouchEnd);
      cancelAnimationFrame(animationFrameId);

      coinGeom.dispose();
      rimGeom.dispose();
      saffronBandGeom.dispose();
      greenBandGeom.dispose();
      hubGeom.dispose();
      chakraRimGeom.dispose();
      spokeGeom.dispose();
      toothGeom.dispose();
      goldMaterial.dispose();
      rimMat.dispose();
      saffronMat.dispose();
      greenMat.dispose();
      navyMat.dispose();
      gearMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [variant]);

  // CSS 3D Tilt Card physics (mouse)
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -10;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 10;
    setMousePos({ x: rotateY, y: rotateX });
  };

  // CSS 3D Tilt Card physics (touch — for Android)
  const handleCardTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || e.touches.length !== 1) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -8;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 8;
    setIsHovered(true);
    setMousePos({ x: rotateY, y: rotateX });
  };

  const handleCardMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  if (variant === 'compact-badge') {
    return (
      <div
        onClick={() => {
          if (onExplore) onExplore();
          else setShowModal(true);
        }}
        className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-emerald-500/10 border border-amber-500/30 hover:border-amber-400/70 shadow-md shadow-amber-500/10 cursor-pointer transition-all hover:scale-105 group select-none"
        title="100% Made in India • Click to view 3D Emblem"
      >
        {/* 3D Spinning Chakra Badge Icon */}
        <div className="relative w-5 h-5 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-amber-400/80 animate-spin [animation-duration:8s]" />
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#FF9933] via-white to-[#138808] flex items-center justify-center p-0.5 shadow-sm">
            {/* 24-spoke mini Chakra */}
            <svg viewBox="0 0 24 24" className="w-3 h-3 text-[#000080] animate-spin [animation-duration:12s]" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="12" r="2.5" fill="currentColor" />
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <line
                  key={deg}
                  x1="12"
                  y1="12"
                  x2={12 + 9 * Math.cos((deg * Math.PI) / 180)}
                  y2={12 + 9 * Math.sin((deg * Math.PI) / 180)}
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              ))}
            </svg>
          </div>
        </div>

        <div className="flex flex-col text-left">
          <div className="flex items-center space-x-1">
            <span className="text-[11px] font-black tracking-wider text-amber-300 uppercase">Made in India</span>
            <span className="text-[10px]">🇮🇳</span>
          </div>
          <span className="text-[9px] font-semibold text-slate-400 group-hover:text-amber-200 transition-colors">
            Atmanirbhar Bharat
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={(e) => { setIsHovered(true); handleCardMouseMove(e); }}
      onMouseLeave={handleCardMouseLeave}
      onTouchMove={handleCardTouchMove}
      onTouchEnd={() => { setIsHovered(false); setMousePos({ x: 0, y: 0 }); }}
      style={{
        transform: `perspective(1000px) rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
      }}
      className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90 border border-orange-500/35 hover:border-emerald-500/50 shadow-2xl shadow-orange-500/10 backdrop-blur-xl overflow-hidden group"
    >
      {/* Dynamic Specular Sheen on 3D Tilt */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25 group-hover:opacity-50 transition-opacity bg-gradient-to-tr from-transparent via-orange-300/15 to-emerald-300/15"
        style={{
          transform: `translate(${mousePos.x * 3}px, ${mousePos.y * 3}px)`,
        }}
      />

      {/* Indian Tricolor Glowing Header Bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF7700] via-[#FFFFFF] to-[#138808] shadow-md shadow-orange-500/20" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        {/* Left: 3D Interactive WebGL Canvas */}
        <div className="flex flex-col items-center text-center">
          <div className="relative group/canvas cursor-grab active:cursor-grabbing">
            {/* Ambient Circular Glow: Orange, White, and Green */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-500/30 via-white/10 to-emerald-500/30 blur-2xl -z-10 animate-pulse" />
            <div ref={mountRef} className="w-[240px] h-[240px] sm:w-[260px] sm:h-[260px] flex items-center justify-center" />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-950/90 border border-orange-500/40 text-[10px] font-extrabold text-orange-300 flex items-center space-x-1.5 pointer-events-none opacity-85 group-hover/canvas:opacity-100 transition-opacity shadow-lg">
              <RotateCw className="w-2.5 h-2.5 animate-spin text-emerald-400" />
              <span>Drag / Touch to Spin</span>
            </div>
          </div>
        </div>

        {/* Right: National Economic & Product Intelligence Badges */}
        <div className="space-y-4 max-w-lg text-left">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-orange-500/15 via-white/5 to-emerald-500/15 border border-orange-500/30 text-orange-300 text-xs font-black uppercase tracking-wider">
            <span>🇮🇳</span>
            <span>Atmanirbhar Bharat Analytics Initiative</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
            Proudly Made in India. <br />
            <span className="bg-gradient-to-r from-orange-400 via-white to-emerald-400 bg-clip-text text-transparent">
              Engineered For Indian Markets.
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Every analytical model, review sentiment taxonomy, and pricing benchmark is customized specifically for Indian consumer behaviors, Kirana & Quick-Commerce networks, and rupee transactions.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-white block">100% Rupee Standard</span>
                <span className="text-[10px] text-slate-400">All metrics calibrated in ₹</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-white block">Indian Household Demos</span>
                <span className="text-[10px] text-slate-400">boAt, Tata, Himalaya & more</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-white block">Local Channel Intel</span>
                <span className="text-[10px] text-slate-400">Blinkit, Zepto, Flipkart & Amazon</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-white block">Enterprise Ready</span>
                <span className="text-[10px] text-slate-400">Institutional PDF & Excel exports</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full 3D Interactive Inspection Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-lg w-full rounded-3xl bg-slate-900 border border-amber-500/40 p-6 sm:p-8 shadow-2xl shadow-amber-500/20 text-center space-y-5">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <span>🇮🇳</span>
              <span>Atmanirbhar Bharat Analytics • 3D View</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              Make in India 3D Emblem
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Symbol of Indian manufacturing, engineering, and digital commerce. Featuring the industrial gear teeth, Ashoka Chakra with 24 spokes, and the vibrant Tricolor bands.
            </p>

            {/* Modal 3D interactive area */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center space-y-2">
              <div className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-amber-500/20 via-white/10 to-emerald-500/20 flex items-center justify-center p-2 shadow-2xl border-2 border-amber-400/50">
                <svg viewBox="0 0 100 100" className="w-28 h-28 animate-spin [animation-duration:16s]">
                  {/* Outer Gear */}
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#dfab37" strokeWidth="3" strokeDasharray="4, 3" />
                  {/* Outer Tricolor Ring */}
                  <circle cx="50" cy="50" r="41" fill="none" stroke="#FF9933" strokeWidth="4" strokeDasharray="64 64" />
                  <circle cx="50" cy="50" r="41" fill="none" stroke="#138808" strokeWidth="4" strokeDasharray="64 64" strokeDashoffset="64" />
                  {/* Inner Navy Blue Chakra */}
                  <circle cx="50" cy="50" r="28" fill="none" stroke="#000080" strokeWidth="2.5" />
                  <circle cx="50" cy="50" r="6" fill="#000080" />
                  {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345].map((deg) => (
                    <line
                      key={deg}
                      x1="50"
                      y1="50"
                      x2={50 + 28 * Math.cos((deg * Math.PI) / 180)}
                      y2={50 + 28 * Math.sin((deg * Math.PI) / 180)}
                      stroke="#000080"
                      strokeWidth="1.2"
                    />
                  ))}
                </svg>
              </div>
              <span className="text-[11px] font-bold text-amber-300">
                24-Spoke Dharma Chakra & Industrial Cogs
              </span>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-extrabold text-sm shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
            >
              Continue Exploring Yuktivya AI
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
