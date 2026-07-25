"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import MacBookProModel from "./MacBookProModel";

function MacBookLoadingScreen() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-2 border-brand-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
        </div>
        <span className="text-slate-400 text-sm font-medium tracking-wide">Loading 3D Model</span>
      </div>
    </div>
  );
}

export default function MacBookPro3DCanvas() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-2xl"
      style={{ height: "520px" }}
    >
      {/* Ambient background glow for depth */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-tr from-brand-600/20 via-accent-violet/15 to-accent-rose/10 blur-[120px] animate-pulse-glow" />
      </div>

      {isMounted ? (
        <Canvas
          shadows
          camera={{ position: [0, 2.5, 8], fov: 36 }}
          dpr={[1, 2]}
          className="relative z-10"
          gl={{ antialias: true, alpha: true }}
        >
          {/* Studio-style Apple lighting setup */}
          <ambientLight intensity={0.5} />

          {/* Key light (top-right, warm) */}
          <directionalLight
            position={[6, 10, 6]}
            intensity={2.2}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-near={0.1}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />

          {/* Fill light (left, cool purple) */}
          <directionalLight
            position={[-6, 4, -4]}
            intensity={0.6}
            color="#8b5cf6"
          />

          {/* Rim light (bottom front, cyan) */}
          <pointLight position={[0, -2, 5]} intensity={0.8} color="#38bdf8" distance={12} />

          {/* Overhead spot for sheen/reflections */}
          <spotLight
            position={[0, 12, 0]}
            angle={0.2}
            penumbra={1}
            intensity={3.0}
            castShadow
          />

          {/* HDR environment for physically-based reflections */}
          <Environment preset="studio" />

          {/* Soft contact shadow on ground plane */}
          <ContactShadows
            position={[0, -3.0, 0]}
            opacity={0.6}
            scale={15}
            blur={3}
            far={6}
          />

          {/* Real MacBook Pro M3 16" GLB model */}
          <Suspense fallback={null}>
            <MacBookProModel mousePos={mousePos} />
          </Suspense>
        </Canvas>
      ) : (
        <MacBookLoadingScreen />
      )}
    </div>
  );
}
