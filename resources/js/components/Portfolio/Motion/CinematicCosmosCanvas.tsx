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
        camera.position.set(0, 0, 18);

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;
        container.appendChild(renderer.domElement);

        // Responsive handling
        const handleResize = () => {
            if (!container) return;
            width = container.clientWidth;
            height = container.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };
        window.addEventListener('resize', handleResize);

        // Mouse Parallax coordinates (smooth lerping)
        let mouseX = 0;
        let mouseY = 0;
        let targetMouseX = 0;
        let targetMouseY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // Palette Colors
        const orangeColor = new THREE.Color(0xF15A24);
        const forestColor = new THREE.Color(0x173C32);
        const limeColor = new THREE.Color(0xD5F34A);
        const offWhite = new THREE.Color(0xF2EFE6);

        // 2. Multi-Layer Distant Starfield (Layer 1: Deep Cosmos)
        const starCount = isReducedMotion ? 400 : 1200;
        const starGeometry = new THREE.BufferGeometry();
        const starPositions = new Float32Array(starCount * 3);
        const starColors = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            // Spread stars across wide deep frustum
            starPositions[i3] = (Math.random() - 0.5) * 140;
            starPositions[i3 + 1] = (Math.random() - 0.5) * 90;
            starPositions[i3 + 2] = -30 - Math.random() * 80;

            const roll = Math.random();
            let c = offWhite;
            if (roll < 0.15) c = orangeColor;
            else if (roll < 0.3) c = limeColor;

            starColors[i3] = c.r;
            starColors[i3 + 1] = c.g;
            starColors[i3 + 2] = c.b;
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

        const starMaterial = new THREE.PointsMaterial({
            size: 0.28,
            vertexColors: true,
            transparent: true,
            opacity: 0.85,
        });
        const starField = new THREE.Points(starGeometry, starMaterial);
        scene.add(starField);

        // 3. Floating Cosmic Stardust (Layer 2: Foreground depth)
        const dustCount = isReducedMotion ? 100 : 350;
        const dustGeometry = new THREE.BufferGeometry();
        const dustPositions = new Float32Array(dustCount * 3);
        for (let i = 0; i < dustCount * 3; i += 3) {
            dustPositions[i] = (Math.random() - 0.5) * 35;
            dustPositions[i + 1] = (Math.random() - 0.5) * 25;
            dustPositions[i + 2] = (Math.random() - 0.5) * 20;
        }
        dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

        const dustMaterial = new THREE.PointsMaterial({
            size: 0.14,
            color: orangeColor,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
        });
        const dustField = new THREE.Points(dustGeometry, dustMaterial);
        scene.add(dustField);

        // 4. Procedural High-Detail Planet Horizon Texture
        const canvasTex = document.createElement('canvas');
        canvasTex.width = 1024;
        canvasTex.height = 512;
        const ctx = canvasTex.getContext('2d');
        if (ctx) {
            // Deep base tone
            ctx.fillStyle = isDark ? '#141712' : '#232924';
            ctx.fillRect(0, 0, 1024, 512);

            // Flowing organic continental features & mountain ridges
            for (let i = 0; i < 36; i++) {
                const y = Math.sin(i * 0.45) * 160 + 256;
                const h = Math.max(4, Math.abs(20 + Math.cos(i) * 25));
                ctx.fillStyle = i % 2 === 0
                    ? 'rgba(23, 60, 50, 0.45)' // Deep forest green
                    : 'rgba(241, 90, 36, 0.18)'; // Muted amber vein
                ctx.beginPath();
                ctx.ellipse((i * 35) % 1024, y, 480, h, 0.08, 0, Math.PI * 2);
                ctx.fill();
            }

            // Bioluminescent night-side filaments / civilization veins
            for (let j = 0; j < 50; j++) {
                const px = (Math.sin(j * 1.7) * 450 + 512) % 1024;
                const py = (Math.cos(j * 2.3) * 200 + 256) % 512;
                ctx.fillStyle = j % 3 === 0
                    ? 'rgba(213, 243, 74, 0.35)' // Acid lime
                    : 'rgba(241, 90, 36, 0.4)';  // Signal orange
                ctx.beginPath();
                ctx.arc(px, py, Math.random() * 3 + 1, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        const planetTexture = new THREE.CanvasTexture(canvasTex);

        // 5. Massive Sweeping Planet Mesh
        // Placed lower and offset so only the majestic curved limb sweeps across the horizon
        const planetRadius = 14;
        const planetGeo = new THREE.SphereGeometry(planetRadius, 64, 64);
        const planetMat = new THREE.MeshStandardMaterial({
            map: planetTexture,
            roughness: 0.75,
            metalness: 0.15,
            color: isDark ? 0x171914 : 0x222620,
        });

        const planetGroup = new THREE.Group();
        // Position planet: lower-right curvature arches majestically across viewport
        planetGroup.position.set(6, -15.5, -2);
        planetGroup.rotation.z = 0.28;

        const planetMesh = new THREE.Mesh(planetGeo, planetMat);
        planetGroup.add(planetMesh);

        // 6. Atmospheric Luminous Rim / Limb Arc (Custom Fresnel Shader)
        const atmosphereRadius = planetRadius * 1.018;
        const atmosphereGeo = new THREE.SphereGeometry(atmosphereRadius, 64, 64);
        const atmosphereMat = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vWorldPosition;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    gl_Position = projectionMatrix * viewMatrix * worldPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                varying vec3 vWorldPosition;
                uniform vec3 rimColor;
                uniform vec3 dawnColor;
                uniform vec3 lightDirection;
                void main() {
                    // Fresnel intensity
                    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
                    float fresnel = pow(1.0 - max(0.0, dot(viewDir, vNormal)), 3.2);
                    
                    // Light alignment (intense dawn highlight on light side)
                    float lightAlignment = max(0.0, dot(vNormal, lightDirection));
                    vec3 finalColor = mix(rimColor, dawnColor, pow(lightAlignment, 1.8));

                    float alpha = fresnel * (0.35 + lightAlignment * 0.95);
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,
            uniforms: {
                rimColor: { value: forestColor },
                dawnColor: { value: orangeColor },
                lightDirection: { value: new THREE.Vector3(0.7, 0.6, 0.4).normalize() },
            },
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            depthWrite: false,
        });

        const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
        planetGroup.add(atmosphereMesh);
        scene.add(planetGroup);

        // 7. Lighting System
        // Grazing directional sun light from the upper-right (cosmic dawn)
        const sunLight = new THREE.DirectionalLight(0xF15A24, 0); // Will ramp up in entrance
        sunLight.position.set(16, 14, 10);
        scene.add(sunLight);

        const ambientLight = new THREE.AmbientLight(0x173C32, 0.25);
        scene.add(ambientLight);

        // Secondary cyan/forest fill light from deep space
        const fillLight = new THREE.DirectionalLight(0x173C32, 0.6);
        fillLight.position.set(-10, -6, -4);
        scene.add(fillLight);

        // 8. Entrance Animation Timeline (~2.0 seconds)
        let startTime = performance.now();
        const entranceDuration = isReducedMotion ? 100 : 2000;

        // 9. Render & Interaction Loop
        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(1, elapsed / entranceDuration);

            // Coordinated Entrance Easing: Light & Atmosphere ignite
            if (progress < 1) {
                // EaseOutCubic
                const ease = 1 - Math.pow(1 - progress, 3);
                sunLight.intensity = ease * 3.8;
                starMaterial.opacity = ease * 0.85;
                dustMaterial.opacity = ease * 0.5;
            } else {
                sunLight.intensity = 3.8;
                starMaterial.opacity = 0.85;
                dustMaterial.opacity = 0.5;
            }

            // Interactive Pointer Lerp
            mouseX += (targetMouseX - mouseX) * 0.04;
            mouseY += (targetMouseY - mouseY) * 0.04;

            if (!isReducedMotion) {
                // Subtle camera tilt / orbital movement
                camera.position.x = mouseX * 1.8;
                camera.position.y = mouseY * -1.2;
                camera.lookAt(0, -1, 0);

                // Planet slow majestic continuous rotation
                planetMesh.rotation.y += 0.00035;

                // Dust field slow drift
                dustField.rotation.y += 0.0002;
                dustField.rotation.x = mouseY * 0.08;

                // Starfield subtle inverse parallax
                starField.position.x = mouseX * -0.6;
                starField.position.y = mouseY * 0.4;
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

            // Dispose geometries and materials
            planetGeo.dispose();
            planetMat.dispose();
            planetTexture.dispose();
            atmosphereGeo.dispose();
            atmosphereMat.dispose();
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
        // High-aesthetic CSS/SVG Fallback when WebGL is unavailable
        return (
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 select-none overflow-hidden bg-[var(--bg)]"
            >
                {/* Curved Planetary Horizon Gradient */}
                <div className="absolute -bottom-48 -right-40 h-[90vh] w-[90vh] rounded-full bg-gradient-to-tr from-[var(--forest)] via-[var(--primary)] to-[var(--accent)] opacity-40 blur-3xl" />
                <div className="absolute inset-0 bg-radial from-transparent via-[var(--bg)]/70 to-[var(--bg)]" />
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
