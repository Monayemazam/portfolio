import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Starfield3DProps {
    isDark?: boolean;
}

export default function Starfield3D({ isDark = true }: Starfield3DProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        // Scene, Camera, Renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            60,
            width / height,
            0.1,
            1000,
        );
        const PUSH_DURATION = 2200; // 2.2s total hero camera push
        const START_Z = 290;
        const BASE_Z = 200;
        const pushStartTime = performance.now();

        camera.position.z = START_Z;

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: false,
            powerPreference: 'high-performance',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Helper to generate soft circular radial textures
        const createRadialTexture = (innerOpacity = 1, outerOpacity = 0) => {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
                gradient.addColorStop(0, `rgba(255, 255, 255, ${innerOpacity})`);
                gradient.addColorStop(0.3, `rgba(255, 255, 255, ${innerOpacity * 0.6})`);
                gradient.addColorStop(0.7, `rgba(255, 255, 255, ${innerOpacity * 0.15})`);
                gradient.addColorStop(1, `rgba(255, 255, 255, ${outerOpacity})`);
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 64, 64);
            }
            const texture = new THREE.CanvasTexture(canvas);
            return texture;
        };

        const starTexture = createRadialTexture(1, 0);
        const nebulaTexture = createRadialTexture(0.5, 0);

        // Colors based on theme - Monayem Azam Digital Universe
        const starColor1 = isDark ? 0xf4f7ff : 0x7452fa;
        const starColor2 = isDark ? 0x53e0f7 : 0x088395;
        const starColor3 = isDark ? 0x8b6cff : 0x7452fa;

        // Helper to create star layers
        const createStarLayer = (
            count: number,
            size: number,
            depthRange: number,
            color: number,
        ) => {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(count * 3);

            for (let i = 0; i < count * 3; i += 3) {
                positions[i] = (Math.random() - 0.5) * 600;
                positions[i + 1] = (Math.random() - 0.5) * 600;
                positions[i + 2] = (Math.random() - 0.5) * depthRange;
            }

            geometry.setAttribute(
                'position',
                new THREE.BufferAttribute(positions, 3),
            );

            const material = new THREE.PointsMaterial({
                color,
                size,
                map: starTexture,
                transparent: true,
                opacity: isDark ? 0.85 : 0.65,
                blending: isDark
                    ? THREE.AdditiveBlending
                    : THREE.NormalBlending,
                depthWrite: false,
            });

            return new THREE.Points(geometry, material);
        };

        // 3 Layers of stars for parallax depth
        const layerDistant = createStarLayer(800, 1.8, 500, starColor1);
        const layerMid = createStarLayer(400, 2.8, 400, starColor2);
        const layerClose = createStarLayer(120, 3.6, 300, starColor3);

        scene.add(layerDistant);
        scene.add(layerMid);
        scene.add(layerClose);

        // Soft Nebula particles - large subtle glowing clouds
        const nebulaCount = 50;
        const nebulaGeo = new THREE.BufferGeometry();
        const nebulaPos = new Float32Array(nebulaCount * 3);
        for (let i = 0; i < nebulaCount * 3; i += 3) {
            nebulaPos[i] = (Math.random() - 0.5) * 450;
            nebulaPos[i + 1] = (Math.random() - 0.5) * 450;
            nebulaPos[i + 2] = (Math.random() - 0.5) * 200 - 50;
        }
        nebulaGeo.setAttribute(
            'position',
            new THREE.BufferAttribute(nebulaPos, 3),
        );
        const nebulaMat = new THREE.PointsMaterial({
            color: isDark ? 0x8b6cff : 0x7452fa,
            size: 60,
            map: nebulaTexture,
            transparent: true,
            opacity: isDark ? 0.09 : 0.04,
            blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
            depthWrite: false,
        });
        const nebula = new THREE.Points(nebulaGeo, nebulaMat);
        scene.add(nebula);

        // Shooting Star setup
        const shootingStarGeo = new THREE.BufferGeometry();
        const shootingStarPositions = new Float32Array([0, 0, 0, -25, 25, 0]);
        shootingStarGeo.setAttribute(
            'position',
            new THREE.BufferAttribute(shootingStarPositions, 3),
        );
        const shootingStarMat = new THREE.LineBasicMaterial({
            color: isDark ? 0x22d3ee : 0x6d28d9,
            transparent: true,
            opacity: 0,
        });
        const shootingStar = new THREE.Line(shootingStarGeo, shootingStarMat);
        scene.add(shootingStar);

        let shootingStarActive = false;
        let shootingStarProgress = 0;
        let nextShootingStarTime = Date.now() + 3000;

        // Mouse Parallax tracking
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = (e.clientX / width - 0.5) * 2;
            mouseY = (e.clientY / height - 0.5) * 2;
        };

        window.addEventListener('mousemove', handleMouseMove, {
            passive: true,
        });

        // Resize handler
        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        // Visibility pause
        let isRunning = true;
        const handleVisibilityChange = () => {
            isRunning = !document.hidden;
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Animation loop
        let animationFrameId: number;

        const animate = () => {
            if (isRunning) {
                // Parallax smoothing
                targetX += (mouseX * 15 - targetX) * 0.05;
                targetY += (-mouseY * 15 - targetY) * 0.05;
                camera.position.x = targetX;
                camera.position.y = targetY;
                // Camera forward push over 2.2s
                const elapsed = performance.now() - pushStartTime;
                let currentZ = BASE_Z;
                if (elapsed < PUSH_DURATION) {
                    const t = Math.min(1, elapsed / PUSH_DURATION);
                    const ease = 1 - Math.pow(1 - t, 3);
                    currentZ = START_Z - (START_Z - BASE_Z) * ease;
                }
                camera.position.z = currentZ;

                // Slow ambient drift
                layerDistant.rotation.y += 0.00015;
                layerMid.rotation.y += 0.0003;
                layerClose.rotation.y += 0.0006;
                nebula.rotation.z += 0.0001;

                // Shooting star logic
                const now = Date.now();
                if (!shootingStarActive && now > nextShootingStarTime) {
                    shootingStarActive = true;
                    shootingStarProgress = 0;
                    shootingStar.position.set(
                        (Math.random() - 0.5) * 400 + 100,
                        (Math.random() - 0.5) * 300 + 100,
                        (Math.random() - 0.5) * 100,
                    );
                    shootingStarMat.opacity = 1;
                }

                if (shootingStarActive) {
                    shootingStarProgress += 0.04;
                    shootingStar.position.x -= 8;
                    shootingStar.position.y -= 8;
                    shootingStarMat.opacity = Math.max(
                        0,
                        1 - shootingStarProgress,
                    );

                    if (shootingStarProgress >= 1) {
                        shootingStarActive = false;
                        shootingStarMat.opacity = 0;
                        nextShootingStarTime =
                            now + 4000 + Math.random() * 5000;
                    }
                }

                renderer.render(scene, camera);
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        // Cleanup
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            );

            scene.traverse((obj) => {
                if (obj instanceof THREE.Points || obj instanceof THREE.Line) {
                    obj.geometry.dispose();
                    if (Array.isArray(obj.material)) {
                        obj.material.forEach((m) => m.dispose());
                    } else {
                        obj.material.dispose();
                    }
                }
            });

            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [isDark]);

    return (
        <div
            ref={containerRef}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        />
    );
}
