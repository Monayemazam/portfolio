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

        // 4. Restrained Art-Directed Celestial Form & Astrolabe Spatial Structure
        const celestialGroup = new THREE.Group();

        // Responsive position: On desktop, balance to right side; on mobile, center gracefully
        const isDesktop = width >= 1024;
        const targetX = isDesktop ? 4.8 : 0;
        const targetY = isDesktop ? 0.4 : -1.8;
        celestialGroup.position.set(targetX, targetY, -2);
        celestialGroup.rotation.x = 0.25;
        celestialGroup.rotation.z = -0.15;

        // Core Sphere: procedural tactile lunar/planetary sphere
        const coreRadius = isDesktop ? 2.6 : 1.9;
        const coreGeo = new THREE.SphereGeometry(coreRadius, 48, 48);
        const coreMat = new THREE.MeshStandardMaterial({
            color: coreBaseColor,
            roughness: 0.65,
            metalness: 0.2,
            wireframe: false,
        });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        celestialGroup.add(coreMesh);

        // Core Atmospheric Halo
        const haloGeo = new THREE.SphereGeometry(coreRadius * 1.03, 36, 36);
        const haloMat = new THREE.ShaderMaterial({
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
                uniform vec3 accentColor;
                void main() {
                    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
                    float fresnel = pow(1.0 - max(0.0, dot(viewDir, vNormal)), 2.8);
                    vec3 color = mix(rimColor, accentColor, fresnel * 0.7);
                    gl_FragColor = vec4(color, fresnel * 0.85);
                }
            `,
            uniforms: {
                rimColor: { value: forestColor },
                accentColor: { value: orangeColor },
            },
            transparent: true,
            blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
            side: THREE.BackSide,
            depthWrite: false,
        });
        const haloMesh = new THREE.Mesh(haloGeo, haloMat);
        celestialGroup.add(haloMesh);

        // Spatial Structure 1: Primary Coordinate Ring (Equatorial)
        const ring1Geo = new THREE.TorusGeometry(coreRadius * 1.5, 0.035, 16, 100);
        const ring1Mat = new THREE.MeshBasicMaterial({
            color: orangeColor,
            transparent: true,
            opacity: 0.7,
        });
        const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
        ring1.rotation.x = Math.PI / 2.3;
        celestialGroup.add(ring1);

        // Spatial Structure 2: Polar Meridian Ring
        const ring2Geo = new THREE.TorusGeometry(coreRadius * 1.75, 0.025, 16, 100);
        const ring2Mat = new THREE.MeshBasicMaterial({
            color: limeColor,
            transparent: true,
            opacity: 0.55,
        });
        const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
        ring2.rotation.y = Math.PI / 3;
        celestialGroup.add(ring2);

        // Spatial Structure 3: Fine Technical Orbit Segment
        const ring3Geo = new THREE.TorusGeometry(coreRadius * 2.1, 0.015, 12, 120);
        const ring3Mat = new THREE.MeshBasicMaterial({
            color: forestColor,
            transparent: true,
            opacity: 0.45,
        });
        const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
        ring3.rotation.z = Math.PI / 4;
        celestialGroup.add(ring3);

        // Glowing Orbital Waypoint Node
        const nodeGeo = new THREE.SphereGeometry(0.12, 16, 16);
        const nodeMat = new THREE.MeshBasicMaterial({ color: orangeColor });
        const waypointNode = new THREE.Mesh(nodeGeo, nodeMat);
        waypointNode.position.set(coreRadius * 1.5, 0, 0);
        ring1.add(waypointNode);

        scene.add(celestialGroup);

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

            const desktop = width >= 1024;
            celestialGroup.position.set(desktop ? 4.8 : 0, desktop ? 0.4 : -1.8, -2);
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
        let startTime = performance.now();
        const animate = (currentTime: number) => {
            // Interactive mouse lerping
            mouseX += (targetMouseX - mouseX) * 0.04;
            mouseY += (targetMouseY - mouseY) * 0.04;

            if (!isReducedMotion) {
                // Subtle camera depth parallax
                camera.position.x = mouseX * 1.2;
                camera.position.y = mouseY * -0.8;
                camera.lookAt(0, 0, 0);

                // Elegant celestial rotations
                coreMesh.rotation.y += 0.0012;
                ring1.rotation.z += 0.0025;
                ring2.rotation.x += 0.0018;
                ring3.rotation.y += 0.001;

                // Ambient dust float
                dustField.rotation.y += 0.0004;

                // Subtle astrolabe tilt
                celestialGroup.rotation.y = mouseX * 0.2;
                celestialGroup.rotation.x = 0.25 + mouseY * 0.15;
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
            coreGeo.dispose();
            coreMat.dispose();
            haloGeo.dispose();
            haloMat.dispose();
            ring1Geo.dispose();
            ring1Mat.dispose();
            ring2Geo.dispose();
            ring2Mat.dispose();
            ring3Geo.dispose();
            ring3Mat.dispose();
            nodeGeo.dispose();
            nodeMat.dispose();
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
