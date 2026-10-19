import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Starfield3DProps {
    isDark?: boolean;
}

export default function Starfield3D({ isDark = false }: Starfield3DProps) {
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

        const dotTexture = createRadialTexture(1, 0);

        // Digital Field Notes palette: Warm paper, Ink, Signal orange, Acid lime, Dusty grey
        const dotColor1 = isDark ? 0xF2EFE6 : 0x171914; // Paper vs Ink
        const dotColor2 = isDark ? 0xF15A24 : 0xF15A24; // Signal Orange
        const dotColor3 = isDark ? 0xD5F34A : 0x173C32; // Acid Lime vs Deep Forest

        // Helper to create tactile field layers
        const createFieldLayer = (
            count: number,
            size: number,
            depthRange: number,
            color: number,
            opacity: number,
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
                map: dotTexture,
                transparent: true,
                opacity,
                blending: isDark
                    ? THREE.AdditiveBlending
                    : THREE.NormalBlending,
                depthWrite: false,
            });

            return new THREE.Points(geometry, material);
        };

        // 3 refined tactile particle layers
        const layerDistant = createFieldLayer(400, 1.6, 500, dotColor1, isDark ? 0.35 : 0.15);
        const layerMid = createFieldLayer(150, 2.4, 400, dotColor2, isDark ? 0.45 : 0.25);
        const layerClose = createFieldLayer(60, 3.2, 300, dotColor3, isDark ? 0.5 : 0.2);

        scene.add(layerDistant);
        scene.add(layerMid);
        scene.add(layerClose);

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
                targetX += (mouseX * 12 - targetX) * 0.05;
                targetY += (-mouseY * 12 - targetY) * 0.05;
                camera.position.x = targetX;
                camera.position.y = targetY;

                // Hero push camera animation
                const elapsed = performance.now() - pushStartTime;
                if (elapsed < PUSH_DURATION) {
                    const progress = elapsed / PUSH_DURATION;
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    camera.position.z = START_Z - (START_Z - BASE_Z) * eased;
                } else {
                    camera.position.z = BASE_Z;
                }

                // Slow, graceful rotation of field layers
                layerDistant.rotation.y += 0.00015;
                layerMid.rotation.y += 0.0003;
                layerClose.rotation.y += 0.00045;

                renderer.render(scene, camera);
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            cancelAnimationFrame(animationFrameId);

            if (container && renderer.domElement) {
                container.removeChild(renderer.domElement);
            }

            // Dispose geometries and materials
            [layerDistant, layerMid, layerClose].forEach((layer) => {
                layer.geometry.dispose();
                (layer.material as THREE.Material).dispose();
            });
            dotTexture.dispose();
            renderer.dispose();
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
