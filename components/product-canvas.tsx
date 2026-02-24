'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, Float, MeshDistortMaterial } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';

function PlaceholderModel({ color = '#06b6d4' }: { color?: string }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            // Subtle breathing animation
            meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime) * 0.05);
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[1, 1]} />
                <MeshDistortMaterial
                    color={color}
                    envMapIntensity={0.8}
                    clearcoat={1}
                    clearcoatRoughness={0}
                    metalness={0.5}
                    distort={0.4}
                    speed={2}
                />
            </mesh>
        </Float>
    );
}

export function ProductCanvas({ color }: { color?: string }) {
    return (
        <div className="w-full h-full min-h-[400px] bg-gradient-to-br from-slate-900 to-black rounded-2xl overflow-hidden cursor-move">
            <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
                <Suspense fallback={null}>
                    <Stage environment="city" intensity={0.6}>
                        <PlaceholderModel color={color} />
                    </Stage>
                    <OrbitControls autoRotate autoRotateSpeed={4} enableZoom={false} />
                </Suspense>
            </Canvas>

            <div className="absolute bottom-4 left-4 pointer-events-none">
                <div className="bg-black/50 backdrop-blur px-3 py-1 rounded-full border border-white/10 text-xs text-cyan-400 font-mono">
                    INTERACTIVE 3D PREVIEW
                </div>
            </div>
        </div>
    );
}
