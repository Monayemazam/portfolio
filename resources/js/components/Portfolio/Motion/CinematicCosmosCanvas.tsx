import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface CinematicCosmosCanvasProps {
    isDark?: boolean;
    isReducedMotion?: boolean;
}

export default function CinematicCosmosCanvas({
    isDark = true,
    isReducedMotion = false,
}: CinematicCosmosCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [webglSupported, setWebglSupported] = useState(true);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Check WebGL availability
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) {
                setWebglSupported(false);
                return;
            }
        } catch {
            setWebglSupported(false);
            return;
        }

        let animationFrameId: number;
        let width = container.clientWidth || window.innerWidth;
        let height = container.clientHeight || window.innerHeight;

        // 1. Scene, Camera, Renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
        camera.position.set(0, 0, 16);

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = isDark ? 1.15 : 0.95;
        container.appendChild(renderer.domElement);

        // Palette Colors
        const orangeColor = new THREE.Color(0xF15A24);
        const forestColor = new THREE.Color(0x173C32);
        const limeColor = new THREE.Color(0xD5F34A);
        const warmWhite = new THREE.Color(0xF2EFE6);
        const coreBaseColor = isDark ? new THREE.Color(0x171914) : new THREE.Color(0xF2EFE6);

        // 2. Multi-Layer Celestial Starfield
        const starCount = isReducedMotion ? 250 : 650;
        const starGeometry = new THREE.BufferGeometry();
        const starPositions = new Float32Array(starCount * 3);
        const starColors = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            starPositions[i3] = (Math.random() - 0.5) * 100;
            starPositions[i3 + 1] = (Math.random() - 0.5) * 60;
            starPositions[i3 + 2] = -15 - Math.random() * 50;

            const roll = Math.random();
            let c = warmWhite;
            if (roll < 0.18) c = orangeColor;
            else if (roll < 0.32) c = limeColor;
            else if (!isDark) c = forestColor;

            starColors[i3] = c.r;
            starColors[i3 + 1] = c.g;
            starColors[i3 + 2] = c.b;
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

        const starMaterial = new THREE.PointsMaterial({
            size: 0.22,
            vertexColors: true,
            transparent: true,
            opacity: isDark ? 0.75 : 0.45,
        });
        const starField = new THREE.Points(starGeometry, starMaterial);
        scene.add(starField);

        // 3. Floating Atmospheric Stardust
        const dustCount = isReducedMotion ? 60 : 180;
        const dustGeometry = new THREE.BufferGeometry();
        const dustPositions = new Float32Array(dustCount * 3);
        for (let i = 0; i < dustCount * 3; i += 3) {
            dustPositions[i] = (Math.random() - 0.5) * 28;
            dustPositions[i + 1] = (Math.random() - 0.5) * 18;
            dustPositions[i + 2] = (Math.random() - 0.5) * 14;
        }
        dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

        const dustMaterial = new THREE.PointsMaterial({
            size: 0.12,
            color: orangeColor,
            transparent: true,
            opacity: isDark ? 0.45 : 0.25,
            blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
        });
        const dustField = new THREE.Points(dustGeometry, dustMaterial);
        scene.add(dustField);



        // 5. Lighting
        const mainLight = new THREE.DirectionalLight(0xF15A24, isDark ? 2.8 : 2.0);
        mainLight.position.set(12, 10, 8);
        scene.add(mainLight);

        const forestLight = new THREE.DirectionalLight(0x173C32, isDark ? 1.5 : 1.0);
        forestLight.position.set(-8, -6, 4);
        scene.add(forestLight);

        const ambientLight = new THREE.AmbientLight(isDark ? 0x173C32 : 0xDED8CB, isDark ? 0.4 : 0.8);
        scene.add(ambientLight);

        // Resize handler
        const handleResize = () => {
            if (!container) return;
            width = container.clientWidth;
            height = container.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };
        window.addEventListener('resize', handleResize);

        // Smooth Mouse Parallax
        let mouseX = 0;
        let mouseY = 0;
        let targetMouseX = 0;
        let targetMouseY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // Animation Loop
        const animate = () => {
            // Interactive mouse lerping
            mouseX += (targetMouseX - mouseX) * 0.04;
            mouseY += (targetMouseY - mouseY) * 0.04;

            if (!isReducedMotion) {
                // Subtle camera depth parallax
                camera.position.x = mouseX * 0.8;
                camera.position.y = mouseY * -0.6;
                camera.lookAt(0, 0, 0);

                // Ambient stardust and starfield slow drift
                starField.rotation.y += 0.00015;
                dustField.rotation.y += 0.00035;
            }

            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        // Cleanup
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);

            starGeometry.dispose();
            starMaterial.dispose();
            dustGeometry.dispose();
            dustMaterial.dispose();
            renderer.dispose();

            if (container && renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [isDark, isReducedMotion]);

    if (!webglSupported) {
        return (
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 select-none overflow-hidden bg-transparent"
            >
                <div className="absolute top-1/4 right-1/8 h-72 w-72 rounded-full border border-[var(--primary)]/30 opacity-40 shadow-[0_0_50px_rgba(241,90,36,0.2)]" />
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full select-none overflow-hidden"
        />
    );
}
