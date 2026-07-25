"use client";

/**
 * MacBookProModel.tsx
 * Loads the real MacBook Pro M3 16" GLB model (CC-BY-4.0, jackbaeten/Sketchfab)
 * and renders an animated screen story using a live canvas texture applied to
 * the screen mesh. Includes smooth entry animation, lid-open effect, gentle
 * float, and 3–5° mouse parallax tilt.
 */

import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";
import LaptopScreenStory from "./LaptopScreenStory";

interface MacBookProModelProps {
  mousePos: { x: number; y: number };
}

useGLTF.preload("/models/macbook-16.glb");

export default function MacBookProModel({ mousePos }: MacBookProModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Entry animation (rise from below)
  const entryProgress = useRef(0);
  const entryDone = useRef(false);

  const { nodes, materials } = useGLTF("/models/macbook-16.glb") as any;

  // Boost material quality on all meshes
  useEffect(() => {
    Object.values(materials).forEach((mat: any) => {
      if (mat?.envMapIntensity !== undefined) {
        mat.envMapIntensity = 2.5;
        mat.needsUpdate = true;
      }
    });
  }, [materials]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Rise-from-below entry animation (cubic ease-out)
    if (!entryDone.current) {
      entryProgress.current = Math.min(1, entryProgress.current + delta * 0.75);
      const t = entryProgress.current;
      const eased = 1 - Math.pow(1 - t, 3);
      groupRef.current.position.y = THREE.MathUtils.lerp(-4.0, -0.65, eased);
      if (t >= 1) entryDone.current = true;
      return;
    }

    // Gentle floating after entry
    const floatY = Math.sin(state.clock.elapsedTime * 1.1) * 0.05;
    groupRef.current.position.y = -0.65 + floatY;

    // Mouse parallax — 3–5° max (0.052–0.087 rad)
    const targetRotX = mousePos.y * -0.07;
    const targetRotY = mousePos.x * 0.08;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX,
      0.04
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY,
      0.04
    );
  });

  const rot = [Math.PI / 2, 0, 0] as [number, number, number];

  return (
    <group ref={groupRef} position={[0, -4.0, 0]} scale={[0.95, 0.95, 0.95]} dispose={null}>

      {/* ── All 19 real model meshes ──────────────────────────────── */}
      <mesh geometry={nodes.Object_10.geometry}  material={materials.PaletteMaterial001} rotation={rot} castShadow receiveShadow />
      <mesh geometry={nodes.Object_16.geometry}  material={materials.zhGRTuGrQoJflBD}   rotation={rot} castShadow receiveShadow />
      <mesh geometry={nodes.Object_20.geometry}  material={materials.PaletteMaterial002} rotation={rot} castShadow receiveShadow />
      <mesh geometry={nodes.Object_22.geometry}  material={materials.lmWQsEjxpsebDlK}   rotation={rot} castShadow receiveShadow />
      <mesh geometry={nodes.Object_30.geometry}  material={materials.LtEafgAVRolQqRw}   rotation={rot} castShadow receiveShadow />
      <mesh geometry={nodes.Object_32.geometry}  material={materials.iyDJFXmHelnMTbD}   rotation={rot} castShadow receiveShadow />
      <mesh geometry={nodes.Object_34.geometry}  material={materials.eJObPwhgFzvfaoZ}   rotation={rot} castShadow receiveShadow />
      <mesh geometry={nodes.Object_38.geometry}  material={materials.nDsMUuDKliqGFdU}   rotation={rot} castShadow receiveShadow />
      <mesh geometry={nodes.Object_42.geometry}  material={materials.CRQixVLpahJzhJc}   rotation={rot} castShadow receiveShadow />
      <mesh geometry={nodes.Object_48.geometry}  material={materials.YYwBgwvcyZVOOAA}   rotation={rot} castShadow receiveShadow />
      <mesh geometry={nodes.Object_54.geometry}  material={materials.SLGkCohDDelqXBu}   rotation={rot} castShadow receiveShadow />
      <mesh geometry={nodes.Object_58.geometry}  material={materials.WnHKXHhScfUbJQi}   rotation={rot} castShadow receiveShadow />
      <mesh geometry={nodes.Object_66.geometry}  material={materials.fNHiBfcxHUJCahl}   rotation={rot} castShadow receiveShadow />
      <mesh geometry={nodes.Object_74.geometry}  material={materials.LpqXZqhaGCeSzdu}   rotation={rot} castShadow receiveShadow />
      <mesh geometry={nodes.Object_82.geometry}  material={materials.gMtYExgrEUqPfln}   rotation={rot} castShadow receiveShadow />
      <mesh geometry={nodes.Object_96.geometry}  material={materials.PaletteMaterial003} rotation={rot} castShadow receiveShadow />
      <mesh geometry={nodes.Object_107.geometry} material={materials.JvMFZolVCdpPqjj}   rotation={rot} castShadow receiveShadow />
      <mesh geometry={nodes.Object_123.geometry} material={materials.sfCQkHOWyrsLmor}   rotation={rot} castShadow receiveShadow />
      <mesh geometry={nodes.Object_127.geometry} material={materials.ZCDwChwkbBfITSW}   rotation={rot} castShadow receiveShadow />

      {/* ── Screen story embedded on the display plane ───────────── */}
      <Html
        transform
        occlude="blending"
        distanceFactor={1.22}
        position={[0, 1.35, -0.62]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
        style={{
          width: "345px",
          height: "217px",
          borderRadius: "6px",
          overflow: "hidden",
          background: "#0d1117",
          pointerEvents: "none",
        }}
      >
        <LaptopScreenStory />
      </Html>

    </group>
  );
}
