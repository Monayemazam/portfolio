import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface HeroCenterpieceProps {
    isDark?: boolean;
    isReducedMotion?: boolean;
}

export default function HeroCenterpiece({
    isDark = true,
    isReducedMotion = false,
}: HeroCenterpieceProps) {
    const mountRef = useRef<HTMLDivElement>(null);
    const [webglSupported, setWebglSupported] = useState(true);

    useEffect(() => {
        // Test WebGL support
        try {
            const canvas = document.createElement('canvas');
            const gl =
                canvas.getContext('webgl') ||
                canvas.getContext('experimental-webgl');
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
        camera.position.z = 4.8;

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Group to hold all celestial elements for parallax tilt
        const worldGroup = new THREE.Group();
        scene.add(worldGroup);

        // Colors
        const cyanColor = isDark ? 0x53e0f7 : 0x088395;
        const violetColor = isDark ? 0x8b6cff : 0x7452fa;
        const ambientLightColor = isDark ? 0x17223a : 0xf0f4ff;

        // Lighting
        const keyLight = new THREE.DirectionalLight(cyanColor, isDark ? 2.8 : 2.0);
        keyLight.position.set(5, 4, 3);
        scene.add(keyLight);

        const rimLight = new THREE.DirectionalLight(violetColor, isDark ? 2.5 : 1.8);
        rimLight.position.set(-5, -3, -2);
        scene.add(rimLight);

        const ambientLight = new THREE.AmbientLight(ambientLightColor, isDark ? 0.9 : 1.4);
        scene.add(ambientLight);

        // Core Planet Sphere
        const sphereGeo = new THREE.SphereGeometry(1.35, 64, 64);
        const sphereMat = new THREE.MeshStandardMaterial({
            color: isDark ? 0x0e172a : 0xe2e8f0,
            roughness: 0.35,
            metalness: 0.65,
            wireframe: false,
        });
        const planet = new THREE.Mesh(sphereGeo, sphereMat);
        worldGroup.add(planet);

        // Digital Grid Wireframe overlay around planet
        const gridGeo = new THREE.SphereGeometry(1.365, 32, 16);
        const gridMat = new THREE.MeshBasicMaterial({
            color: cyanColor,
            wireframe: true,
            transparent: true,
            opacity: isDark ? 0.22 : 0.15,
        });
        const gridMesh = new THREE.Mesh(gridGeo, gridMat);
        worldGroup.add(gridMesh);

        // Inner glowing core
        const atmosphereGeo = new THREE.SphereGeometry(1.48, 48, 48);
        const atmosphereMat = new THREE.MeshBasicMaterial({
            color: violetColor,
            transparent: true,
            opacity: isDark ? 0.12 : 0.08,
            side: THREE.BackSide,
        });
        const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
        worldGroup.add(atmosphere);

        // Orbital Ring 1 (Tilted Equatorial Ring)
        const ring1Geo = new THREE.TorusGeometry(2.05, 0.018, 16, 120);
        const ring1Mat = new THREE.MeshStandardMaterial({
            color: cyanColor,
            emissive: cyanColor,
            emissiveIntensity: 0.6,
            roughness: 0.2,
        });
        const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
        ring1.rotation.x = Math.PI / 2.7;
        ring1.rotation.y = Math.PI / 8;
        worldGroup.add(ring1);

        // Orbital Ring 2 (Counter-tilted Polar Orbit Ring)
        const ring2Geo = new THREE.TorusGeometry(2.28, 0.012, 16, 120);
        const ring2Mat = new THREE.MeshStandardMaterial({
            color: violetColor,
            emissive: violetColor,
            emissiveIntensity: 0.5,
            roughness: 0.2,
        });
        const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
        ring2.rotation.x = -Math.PI / 3.2;
        ring2.rotation.y = -Math.PI / 6;
        worldGroup.add(ring2);

        // Satellite Nodes along Orbit 1
        const satelliteGeo = new THREE.SphereGeometry(0.055, 16, 16);
        const satelliteMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
        });
        const satellite1 = new THREE.Mesh(satelliteGeo, satelliteMat);
        worldGroup.add(satellite1);

        const satellite2 = new THREE.Mesh(satelliteGeo, satelliteMat);
        worldGroup.add(satellite2);

        // Particle halo around sculpture
        const particleCount = 80;
        const particlePositions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i += 3) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 1.6 + Math.random() * 1.4;
            const elevation = (Math.random() - 0.5) * 1.2;
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
            color: cyanColor,
            size: 0.04,
            transparent: true,
            opacity: 0.7,
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
            const relX = (e.clientX - rect.left) / rect.width - 0.5;
            const relY = (e.clientY - rect.top) / rect.height - 0.5;
            mouseX = relX * 0.8;
            mouseY = relY * 0.8;
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // Animation Loop
        let animationFrameId: number;
        let clock = new THREE.Clock();

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const delta = clock.getDelta();
            const time = clock.getElapsedTime();

            // Planet & grid rotation
            planet.rotation.y += delta * 0.25;
            gridMesh.rotation.y += delta * 0.15;
            gridMesh.rotation.x += delta * 0.05;

            // Rings subtle counter rotation
            ring1.rotation.z += delta * 0.12;
            ring2.rotation.z -= delta * 0.08;

            // Satellites orbiting
            const sat1Angle = time * 0.8;
            satellite1.position.set(
                Math.cos(sat1Angle) * 2.05,
                Math.sin(sat1Angle) * 0.6,
                Math.sin(sat1Angle) * 1.8,
            );

            const sat2Angle = time * 0.6 + Math.PI;
            satellite2.position.set(
                Math.cos(sat2Angle) * 2.28,
                -Math.sin(sat2Angle) * 0.9,
                Math.sin(sat2Angle) * 1.9,
            );

            // Particles slow drift
            particles.rotation.y += delta * 0.05;

            // Smooth parallax interpolation
            targetX += (mouseX - targetX) * 0.05;
            targetY += (mouseY - targetY) * 0.05;
            worldGroup.rotation.y = targetX;
            worldGroup.rotation.x = -targetY * 0.6;

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            if (!container) return;
            const newW = container.clientWidth;
            const newH = container.clientHeight;
            camera.aspect = newW / newH;
            camera.updateProjectionMatrix();
            renderer.setSize(newW, newH);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
            sphereGeo.dispose();
            sphereMat.dispose();
            gridGeo.dispose();
            gridMat.dispose();
            ring1Geo.dispose();
            ring1Mat.dispose();
            ring2Geo.dispose();
            ring2Mat.dispose();
        };
    }, [isDark, isReducedMotion]);

    // Fallback UI when WebGL unavailable or reduced motion active
    if (!webglSupported || isReducedMotion) {
        return (
            <div className="relative flex h-full w-full items-center justify-center">
                <div className="relative flex h-72 w-72 items-center justify-center rounded-full bg-gradient-to-tr from-[var(--primary)]/30 via-[var(--secondary)]/20 to-transparent p-6 shadow-[0_0_80px_rgba(83,224,247,0.25)] sm:h-96 sm:w-96">
                    <div className="relative flex h-full w-full items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface)] shadow-inner">
                        <div className="h-44 w-44 rounded-full bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] opacity-80 blur-md sm:h-56 sm:w-56" />
                        <div className="absolute inset-0 flex items-center justify-center font-display text-xs font-bold tracking-widest text-white uppercase drop-shadow-md">
                            Digital Universe
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={mountRef}
            className="relative flex h-full min-h-[380px] w-full items-center justify-center sm:min-h-[460px] lg:min-h-[580px]"
            aria-label="3D Interactive Digital Universe Celestial Sculpture"
        />
    );
}
