import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface CelestialPlanetProps {
    isDark?: boolean;
    isReducedMotion?: boolean;
}

export default function CelestialPlanet({
    isDark = true,
    isReducedMotion = false,
}: CelestialPlanetProps) {
    const mountRef = useRef<HTMLDivElement>(null);
    const [webglSupported, setWebglSupported] = useState(true);

    useEffect(() => {
        // Test WebGL availability
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

        const container = mountRef.current;
        if (!container) return;

        let width = container.clientWidth || 540;
        let height = container.clientHeight || 540;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
        camera.position.z = 4.6;

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        container.appendChild(renderer.domElement);

        const worldGroup = new THREE.Group();
        scene.add(worldGroup);

        // Core Colors based on palette
        const orangeColor = 0xF15A24;
        const forestColor = 0x173C32;
        const limeColor = 0xD5F34A;
        const inkColor = isDark ? 0x11130F : 0xF2EFE6;

        // 1. Procedural Surface Texture Canvas
        const textureCanvas = document.createElement('canvas');
        textureCanvas.width = 1024;
        textureCanvas.height = 512;
        const tctx = textureCanvas.getContext('2d');
        if (tctx) {
            // Dark base
            tctx.fillStyle = isDark ? '#141712' : '#E8E5DC';
            tctx.fillRect(0, 0, 1024, 512);

            // Flowing planetary continental bands
            for (let i = 0; i < 40; i++) {
                const y = Math.sin(i * 0.4) * 200 + 256;
                const h = Math.max(3, Math.abs(15 + Math.cos(i) * 20));
                tctx.fillStyle = isDark
                    ? i % 3 === 0
                        ? 'rgba(23, 60, 50, 0.35)'
                        : 'rgba(241, 90, 36, 0.12)'
                    : i % 3 === 0
                    ? 'rgba(222, 216, 203, 0.4)'
                    : 'rgba(241, 90, 36, 0.08)';
                tctx.beginPath();
                tctx.ellipse(512 + (i * 25) % 500 - 250, y, 600, h, 0.05, 0, Math.PI * 2);
                tctx.fill();
            }
        }
        const surfaceTexture = new THREE.CanvasTexture(textureCanvas);

        // 2. Main High-Fidelity Planet Sphere
        const planetGeo = new THREE.SphereGeometry(1.5, 64, 64);
        const planetMat = new THREE.MeshStandardMaterial({
            map: surfaceTexture,
            color: inkColor,
            roughness: 0.65,
            metalness: 0.2,
        });
        const planetMesh = new THREE.Mesh(planetGeo, planetMat);
        worldGroup.add(planetMesh);

        // 3. Atmospheric Luminous Halo / Rim (Fresnel outer glow)
        const atmosphereGeo = new THREE.SphereGeometry(1.58, 48, 48);
        const atmosphereMat = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                uniform vec3 color;
                void main() {
                    float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
                    gl_FragColor = vec4(color, intensity * 0.85);
                }
            `,
            uniforms: {
                color: { value: new THREE.Color(isDark ? forestColor : orangeColor) },
            },
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            transparent: true,
        });
        const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
        worldGroup.add(atmosphereMesh);

        // 4. Subtle Orbital Trajectory Arc (Signal Orange hairline)
        const arcCurve = new THREE.EllipseCurve(
            0, 0,
            2.4, 2.1,
            0, Math.PI * 2,
            false,
            0
        );
        const arcPoints = arcCurve.getPoints(120);
        const arcGeo = new THREE.BufferGeometry().setFromPoints(
            arcPoints.map(p => new THREE.Vector3(p.x, 0, p.y))
        );
        const arcMat = new THREE.LineBasicMaterial({
            color: orangeColor,
            transparent: true,
            opacity: isDark ? 0.35 : 0.2,
        });
        const orbitalArc = new THREE.Line(arcGeo, arcMat);
        orbitalArc.rotation.x = Math.PI / 3.4;
        orbitalArc.rotation.z = Math.PI / 10;
        worldGroup.add(orbitalArc);

        // 5. Tiny Orbiting Stardust Particles
        const particleCount = 45;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const radius = 2.0 + (i % 5) * 0.25;
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = (Math.sin(i * 1.5) * 0.4);
            positions[i * 3 + 2] = Math.sin(angle) * radius;
        }
        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMat = new THREE.PointsMaterial({
            color: limeColor,
            size: 0.045,
            transparent: true,
            opacity: 0.65,
        });
        const particleSystem = new THREE.Points(particleGeo, particleMat);
        particleSystem.rotation.x = Math.PI / 3.4;
        particleSystem.rotation.z = Math.PI / 10;
        worldGroup.add(particleSystem);

        // 6. Lighting Composition
        // Sunlight from top right
        const sunLight = new THREE.DirectionalLight(orangeColor, isDark ? 3.8 : 2.5);
        sunLight.position.set(6, 4, 3);
        scene.add(sunLight);

        // Soft forest rim light from opposite side
        const rimLight = new THREE.DirectionalLight(forestColor, isDark ? 2.5 : 1.5);
        rimLight.position.set(-6, -3, -2);
        scene.add(rimLight);

        // Ambient cosmic fill
        const ambientLight = new THREE.AmbientLight(isDark ? 0x0A0D08 : 0xF2EFE6, isDark ? 0.6 : 1.2);
        scene.add(ambientLight);

        // Pointer Parallax
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        const onMouseMove = (e: MouseEvent) => {
            if (isReducedMotion) return;
            const rect = container.getBoundingClientRect();
            targetX = ((e.clientX - rect.left) / width - 0.5) * 0.4;
            targetY = ((e.clientY - rect.top) / height - 0.5) * 0.4;
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });

        // Animation Loop
        let animId: number;
        const animate = () => {
            if (!isReducedMotion) {
                // Gentle continuous rotation
                planetMesh.rotation.y += 0.0012;
                orbitalArc.rotation.z += 0.0006;
                particleSystem.rotation.z += 0.0015;

                // Smooth pointer damping
                mouseX += (targetX - mouseX) * 0.05;
                mouseY += (targetY - mouseY) * 0.05;

                worldGroup.rotation.y = mouseX;
                worldGroup.rotation.x = mouseY;
            }

            renderer.render(scene, camera);
            animId = requestAnimationFrame(animate);
        };

        animate();

        const onResize = () => {
            if (!container) return;
            width = container.clientWidth || 540;
            height = container.clientHeight || 540;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };
        window.addEventListener('resize', onResize, { passive: true });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
            cancelAnimationFrame(animId);
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [isDark, isReducedMotion]);

    if (!webglSupported) {
        return (
            <div className="relative flex h-[380px] sm:h-[480px] w-full max-w-[480px] items-center justify-center">
                <div className="h-64 w-64 rounded-full bg-gradient-to-tr from-[var(--forest)] to-[var(--primary)] opacity-40 blur-2xl" />
                <div className="absolute h-56 w-56 rounded-full border-2 border-[var(--primary)]/40 bg-[var(--surface)] shadow-2xl" />
            </div>
        );
    }

    return (
        <div
            ref={mountRef}
            aria-hidden="true"
            className="relative flex h-[360px] sm:h-[480px] lg:h-[580px] w-full max-w-[580px] items-center justify-center select-none pointer-events-none"
        />
    );
}
