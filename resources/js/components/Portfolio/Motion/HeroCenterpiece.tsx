import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface HeroCenterpieceProps {
    isDark?: boolean;
    isReducedMotion?: boolean;
}

export default function HeroCenterpiece({
    isDark = false,
    isReducedMotion = false,
}: HeroCenterpieceProps) {
    const mountRef = useRef<HTMLDivElement>(null);
    const [webglSupported, setWebglSupported] = useState(true);

    useEffect(() => {
        // Test WebGL support
        try {
            const testCanvas = document.createElement('canvas');
            const gl =
                testCanvas.getContext('webgl') ||
                testCanvas.getContext('experimental-webgl');
            if (!gl) {
                setWebglSupported(false);
                return;
            }
        } catch {
            setWebglSupported(false);
            return;
        }

        if (isReducedMotion) return;

        const container = mountRef.current;
        if (!container) return;

        const width = container.clientWidth || 480;
        const height = container.clientHeight || 480;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.z = 5.2;

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        container.appendChild(renderer.domElement);

        // Group to hold all celestial elements for parallax tilt
        const worldGroup = new THREE.Group();
        scene.add(worldGroup);

        // Curated Editorial Systems tokens
        // Paper: #F2EFE6, Ink: #171914, Forest: #173C32, Orange: #F15A24, Lime: #D5F34A
        const orangeColor = 0xF15A24;
        const limeColor = 0xD5F34A;
        const forestColor = 0x173C32;
        const coreSurfaceColor = isDark ? 0x171914 : 0xF2EFE6;
        const ambientLightColor = isDark ? 0x173C32 : 0xDED8CB;

        // Lighting
        const keyLight = new THREE.DirectionalLight(orangeColor, isDark ? 3.0 : 2.4);
        keyLight.position.set(5, 4, 3);
        scene.add(keyLight);

        const rimLight = new THREE.DirectionalLight(limeColor, isDark ? 2.6 : 1.9);
        rimLight.position.set(-5, -3, -2);
        scene.add(rimLight);

        const ambientLight = new THREE.AmbientLight(
            ambientLightColor,
            isDark ? 1.2 : 1.5,
        );
        scene.add(ambientLight);

        // Core Planet Sphere
        const sphereGeo = new THREE.SphereGeometry(1.35, 64, 64);
        const sphereMat = new THREE.MeshStandardMaterial({
            color: coreSurfaceColor,
            roughness: 0.35,
            metalness: isDark ? 0.65 : 0.25,
            wireframe: false,
        });
        const planet = new THREE.Mesh(sphereGeo, sphereMat);
        worldGroup.add(planet);

        // Digital Grid Wireframe overlay around planet
        const gridGeo = new THREE.SphereGeometry(1.365, 32, 16);
        const gridMat = new THREE.MeshBasicMaterial({
            color: orangeColor,
            wireframe: true,
            transparent: true,
            opacity: isDark ? 0.26 : 0.20,
        });
        const gridMesh = new THREE.Mesh(gridGeo, gridMat);
        worldGroup.add(gridMesh);

        // Inner glowing core atmosphere
        const atmosphereGeo = new THREE.SphereGeometry(1.48, 48, 48);
        const atmosphereMat = new THREE.MeshBasicMaterial({
            color: forestColor,
            transparent: true,
            opacity: isDark ? 0.25 : 0.15,
            side: THREE.BackSide,
        });
        const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
        worldGroup.add(atmosphere);

        // Orbital Ring 1 (Tilted Equatorial Ring - Signal Orange)
        const ring1Geo = new THREE.TorusGeometry(2.05, 0.02, 16, 120);
        const ring1Mat = new THREE.MeshStandardMaterial({
            color: orangeColor,
            emissive: orangeColor,
            emissiveIntensity: 0.7,
            roughness: 0.2,
        });
        const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
        ring1.rotation.x = Math.PI / 2.7;
        ring1.rotation.y = Math.PI / 8;
        worldGroup.add(ring1);

        // Orbital Ring 2 (Counter-tilted Polar Orbit Ring - Acid Lime)
        const ring2Geo = new THREE.TorusGeometry(2.28, 0.014, 16, 120);
        const ring2Mat = new THREE.MeshStandardMaterial({
            color: limeColor,
            emissive: limeColor,
            emissiveIntensity: 0.5,
            roughness: 0.2,
        });
        const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
        ring2.rotation.x = -Math.PI / 3.2;
        ring2.rotation.y = -Math.PI / 6;
        worldGroup.add(ring2);

        // Satellite Nodes along Orbits
        const sat1Geo = new THREE.SphereGeometry(0.065, 16, 16);
        const sat1Mat = new THREE.MeshBasicMaterial({ color: orangeColor });
        const satellite1 = new THREE.Mesh(sat1Geo, sat1Mat);
        worldGroup.add(satellite1);

        const sat2Geo = new THREE.SphereGeometry(0.05, 16, 16);
        const sat2Mat = new THREE.MeshBasicMaterial({ color: limeColor });
        const satellite2 = new THREE.Mesh(sat2Geo, sat2Mat);
        worldGroup.add(satellite2);

        const sat3Geo = new THREE.SphereGeometry(0.045, 16, 16);
        const sat3Mat = new THREE.MeshBasicMaterial({
            color: isDark ? 0xF2EFE6 : 0x171914,
        });
        const satellite3 = new THREE.Mesh(sat3Geo, sat3Mat);
        worldGroup.add(satellite3);

        // Particle halo around sculpture
        const particleCount = 85;
        const particlePositions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i += 3) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 1.65 + Math.random() * 1.35;
            const elevation = (Math.random() - 0.5) * 1.3;
            particlePositions[i] = Math.cos(angle) * radius;
            particlePositions[i + 1] = elevation;
            particlePositions[i + 2] = Math.sin(angle) * radius;
        }
        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute(
            'position',
            new THREE.BufferAttribute(particlePositions, 3),
        );
        const particleMat = new THREE.PointsMaterial({
            color: orangeColor,
            size: 0.038,
            transparent: true,
            opacity: 0.75,
            blending: THREE.AdditiveBlending,
        });
        const particles = new THREE.Points(particleGeo, particleMat);
        worldGroup.add(particles);

        // Mouse Parallax
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) return;
            const relX = (e.clientX - rect.left) / rect.width - 0.5;
            const relY = (e.clientY - rect.top) / rect.height - 0.5;
            mouseX = relX * 0.75;
            mouseY = relY * 0.75;
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // Animation Loop
        let animationFrameId: number;
        const clock = new THREE.Clock();

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const delta = clock.getDelta();
            const time = clock.getElapsedTime();

            // Planet & grid rotation
            planet.rotation.y += delta * 0.22;
            gridMesh.rotation.y += delta * 0.15;
            gridMesh.rotation.x += delta * 0.05;

            // Rings subtle counter rotation
            ring1.rotation.z += delta * 0.11;
            ring2.rotation.z -= delta * 0.08;

            // Satellites orbiting
            const sat1Angle = time * 0.75;
            satellite1.position.set(
                Math.cos(sat1Angle) * 2.05,
                Math.sin(sat1Angle) * 0.65,
                Math.sin(sat1Angle) * 1.85,
            );

            const sat2Angle = time * 0.55 + Math.PI;
            satellite2.position.set(
                Math.cos(sat2Angle) * 2.28,
                -Math.sin(sat2Angle) * 0.95,
                Math.sin(sat2Angle) * 1.95,
            );

            const sat3Angle = time * 0.85 + Math.PI / 2;
            satellite3.position.set(
                Math.sin(sat3Angle) * 1.8,
                Math.cos(sat3Angle) * 1.05,
                Math.cos(sat3Angle) * 1.5,
            );

            // Particles slow drift
            particles.rotation.y += delta * 0.04;

            // Smooth parallax interpolation
            targetX += (mouseX - targetX) * 0.06;
            targetY += (mouseY - targetY) * 0.06;
            worldGroup.rotation.y = targetX;
            worldGroup.rotation.x = -targetY * 0.6;

            renderer.render(scene, camera);
        };

        animate();

        // Responsive Resize Handling via ResizeObserver
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width: newW, height: newH } = entry.contentRect;
                if (newW > 0 && newH > 0) {
                    camera.aspect = newW / newH;
                    camera.updateProjectionMatrix();
                    renderer.setSize(newW, newH);
                }
            }
        });
        resizeObserver.observe(container);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('mousemove', handleMouseMove);
            resizeObserver.disconnect();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
            sphereGeo.dispose();
            sphereMat.dispose();
            gridGeo.dispose();
            gridMat.dispose();
            atmosphereGeo.dispose();
            atmosphereMat.dispose();
            ring1Geo.dispose();
            ring1Mat.dispose();
            ring2Geo.dispose();
            ring2Mat.dispose();
            sat1Geo.dispose();
            sat1Mat.dispose();
            sat2Geo.dispose();
            sat2Mat.dispose();
            sat3Geo.dispose();
            sat3Mat.dispose();
            particleGeo.dispose();
            particleMat.dispose();
        };
    }, [isDark, isReducedMotion]);

    return (
        <div
            className="group relative w-full max-w-[480px] sm:max-w-[540px] aspect-square flex flex-col justify-between border-2 border-foreground bg-surface p-4 sm:p-5 shadow-sm transition-transform duration-300"
            data-field-tag="CELESTIAL-CENTERPIECE"
        >
            {/* Top Archival Header Bar */}
            <div className="flex items-center justify-between border-b border-border pb-3 font-mono text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground select-none">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-[var(--primary)] inline-block" />
                    <span className="font-bold text-foreground">
                        SPEC // 01 · 3D CELESTIAL CORE
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="inline-block h-1.5 w-1.5 bg-[#171914]" />
                    <span className="inline-block h-1.5 w-1.5 bg-[#173C32]" />
                    <span className="inline-block h-1.5 w-1.5 bg-[#F15A24]" />
                    <span className="inline-block h-1.5 w-1.5 bg-[#D5F34A]" />
                    <span className="text-[10px] text-muted-foreground/60 ml-1">+</span>
                </div>
            </div>

            {/* Central Stage: Three.js Canvas or Reduced Motion Fallback */}
            <div className="relative my-auto w-full aspect-square flex items-center justify-center overflow-hidden">
                {!webglSupported || isReducedMotion ? (
                    // Intentional static editorial composition when WebGL is unavailable or motion reduced
                    <div className="relative flex h-full w-full items-center justify-center p-6">
                        <div className="relative flex h-64 w-64 sm:h-72 sm:w-72 items-center justify-center rounded-full border-2 border-[var(--primary)] bg-surface shadow-inner">
                            {/* Inner concentric rings */}
                            <div className="absolute inset-4 rounded-full border border-dashed border-border" />
                            <div className="absolute inset-8 rounded-full border border-border bg-[var(--forest)]/10" />
                            <div className="h-28 w-28 rounded-full bg-[var(--forest)] border-2 border-foreground flex items-center justify-center shadow-lg">
                                <span className="font-display text-2xl font-black text-white tracking-tighter">
                                    MA.
                                </span>
                            </div>
                            {/* Orbiting nodes */}
                            <div className="absolute top-2 right-12 h-3.5 w-3.5 rounded-full bg-[var(--primary)] border border-foreground" />
                            <div className="absolute bottom-6 left-10 h-2.5 w-2.5 rounded-full bg-[var(--accent)] border border-foreground" />
                        </div>
                    </div>
                ) : (
                    <div
                        ref={mountRef}
                        className="relative h-full w-full flex items-center justify-center select-none"
                        aria-label="3D Interactive Celestial Centerpiece Sculpture"
                    />
                )}
            </div>

            {/* Bottom Archival Metadata Strip */}
            <div className="flex items-center justify-between border-t border-border pt-3 font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground select-none">
                <span className="text-foreground font-semibold">
                    ORBITAL SIMULATION · 60 FPS
                </span>
                <span className="text-[var(--primary)] font-bold">
                    23°48'N · 90°24'E
                </span>
            </div>

            {/* Corner Registration Marks */}
            <span
                className="absolute -top-2.5 -left-2.5 font-mono text-xs text-foreground/40 select-none pointer-events-none"
                aria-hidden="true"
            >
                +
            </span>
            <span
                className="absolute -top-2.5 -right-2.5 font-mono text-xs text-foreground/40 select-none pointer-events-none"
                aria-hidden="true"
            >
                +
            </span>
            <span
                className="absolute -bottom-2.5 -left-2.5 font-mono text-xs text-foreground/40 select-none pointer-events-none"
                aria-hidden="true"
            >
                +
            </span>
            <span
                className="absolute -bottom-2.5 -right-2.5 font-mono text-xs text-foreground/40 select-none pointer-events-none"
                aria-hidden="true"
            >
                +
            </span>
        </div>
    );
}
