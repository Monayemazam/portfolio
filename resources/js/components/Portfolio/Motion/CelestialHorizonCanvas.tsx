import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface CelestialHorizonCanvasProps {
    isDark?: boolean;
    isReducedMotion?: boolean;
}

export default function CelestialHorizonCanvas({
    isDark = true,
    isReducedMotion = false,
}: CelestialHorizonCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [webglSupported, setWebglSupported] = useState(true);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Check WebGL availability
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

        let animationFrameId: number;
        let isVisible = true;
        const clock = new THREE.Clock();

        let width = container.clientWidth || window.innerWidth;
        let height = container.clientHeight || window.innerHeight;

        // 1. Scene, Camera, High-Precision WebGL Renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            38,
            width / height,
            0.1,
            1000,
        );
        camera.position.set(0, 0, 16);

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = isDark ? 1.3 : 1.1;
        container.appendChild(renderer.domElement);

        // Resource disposal tracking
        const geometriesToDispose: THREE.BufferGeometry[] = [];
        const materialsToDispose: THREE.Material[] = [];

        // Exact Design Tokens from app.css & Design Guideline
        const orangeColor = new THREE.Color(0xf15a24); // --primary (burnt/signal orange)
        const forestColor = new THREE.Color(0x173c32); // --forest (deep emerald forest)
        const limeColor = new THREE.Color(0xd5f34a);   // --accent (acid lime)
        const warmWhite = new THREE.Color(0xf2efe6);   // --text / paper
        const darkBodyColor = new THREE.Color(0x0e1310); // Deep velvety near-black for celestial body
        const lightBodyColor = new THREE.Color(0xebe5d8); // Warm alabaster/sand for solar body

        // =========================================================================
        // 2. MULTI-DEPTH BACKGROUND STARFIELD
        // =========================================================================
        const starCount = isReducedMotion ? 180 : 380;
        const starGeo = new THREE.BufferGeometry();
        const starPositions = new Float32Array(starCount * 3);
        const starColors = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            starPositions[i3] = (Math.random() - 0.5) * 85;
            starPositions[i3 + 1] = (Math.random() - 0.5) * 55;
            starPositions[i3 + 2] = -12 - Math.random() * 40;

            const roll = Math.random();
            let c = warmWhite;
            if (roll < 0.22) c = orangeColor;
            else if (roll < 0.38) c = limeColor;
            else if (!isDark) c = forestColor;

            starColors[i3] = c.r;
            starColors[i3 + 1] = c.g;
            starColors[i3 + 2] = c.b;
        }

        starGeo.setAttribute(
            'position',
            new THREE.BufferAttribute(starPositions, 3),
        );
        starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
        geometriesToDispose.push(starGeo);

        const starMat = new THREE.PointsMaterial({
            size: 0.18,
            vertexColors: true,
            transparent: true,
            opacity: isDark ? 0.75 : 0.45,
        });
        materialsToDispose.push(starMat);

        const starField = new THREE.Points(starGeo, starMat);
        scene.add(starField);

        // Midground Stardust
        const dustCount = isReducedMotion ? 35 : 90;
        const dustGeo = new THREE.BufferGeometry();
        const dustPositions = new Float32Array(dustCount * 3);

        for (let i = 0; i < dustCount * 3; i += 3) {
            dustPositions[i] = (Math.random() - 0.5) * 28;
            dustPositions[i + 1] = (Math.random() - 0.5) * 18;
            dustPositions[i + 2] = (Math.random() - 0.5) * 12;
        }

        dustGeo.setAttribute(
            'position',
            new THREE.BufferAttribute(dustPositions, 3),
        );
        geometriesToDispose.push(dustGeo);

        const dustMat = new THREE.PointsMaterial({
            size: 0.1,
            color: orangeColor,
            transparent: true,
            opacity: isDark ? 0.45 : 0.25,
            blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
        });
        materialsToDispose.push(dustMat);

        const dustField = new THREE.Points(dustGeo, dustMat);
        scene.add(dustField);

        // =========================================================================
        // 3. THE CINEMATIC CELESTIAL EVENT HORIZON (Framing the Right Column)
        // =========================================================================
        // Placed strictly on the right side so it frames the floating glass window
        // and leaves the left half of the hero clear for typography
        const horizonGroup = new THREE.Group();
        scene.add(horizonGroup);

        const horizonRadius = 8.8;

        const updateHorizonPosition = () => {
            const isDesktop = width >= 1024;
            // Desktop: Center at X: 8.8, Y: -3.6 -> Leftmost curve touches X: 0.0,
            // sweeping up into upper-right (Y: +5.2, X: 8.8) behind the glass window!
            // Mobile: Center at X: 0, Y: -9.8 -> sweeps across bottom below the text
            const posX = isDesktop ? 8.8 : 0;
            const posY = isDesktop ? -3.6 : -9.8;
            const posZ = isDesktop ? -2.5 : -3.5;
            horizonGroup.position.set(posX, posY, posZ);
        };
        updateHorizonPosition();

        // 3A. Solid Celestial Horizon Body
        const bodyGeo = new THREE.SphereGeometry(
            horizonRadius,
            64,
            64,
            0,
            Math.PI * 2,
            0,
            Math.PI * 0.55,
        );
        geometriesToDispose.push(bodyGeo);

        const bodyMat = new THREE.MeshStandardMaterial({
            color: isDark ? darkBodyColor : lightBodyColor,
            roughness: 0.85,
            metalness: 0.15,
            transparent: true,
            opacity: isDark ? 0.94 : 0.45, // Soft translucency in light theme
        });
        materialsToDispose.push(bodyMat);

        const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
        bodyMesh.rotation.x = Math.PI * 0.14;
        bodyMesh.rotation.z = -Math.PI * 0.16;
        horizonGroup.add(bodyMesh);

        // 3B. Atmospheric Scattering Rim Shader (The Burnt-Orange Event Horizon)
        const atmosphereGeo = new THREE.SphereGeometry(
            horizonRadius * 1.02,
            80,
            80,
            0,
            Math.PI * 2,
            0,
            Math.PI * 0.55,
        );
        geometriesToDispose.push(atmosphereGeo);

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
                uniform vec3 emeraldColor;
                uniform vec3 sunLightPos;
                uniform float time;
                uniform float isDarkMode;

                void main() {
                    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
                    vec3 normal = normalize(vNormal);

                    // Fresnel angle across the curved horizon edge
                    float fresnel = 1.0 - max(0.0, dot(viewDir, normal));

                    // Directional lighting from top-right ("One Sun" principle)
                    vec3 sunDir = normalize(sunLightPos - vWorldPosition);
                    float sunAlignment = max(0.0, dot(normal, sunDir));

                    // Sharp, controlled core rim
                    float sharpRim = pow(fresnel, 4.5) * (1.1 + sunAlignment * 1.9);

                    // Soft atmospheric exosphere haze
                    float softHaze = pow(fresnel, 1.8) * 0.45;

                    // Wave breathing along the horizon
                    float wave = 0.92 + 0.08 * sin(time * 0.75 + vWorldPosition.x * 0.2);

                    // Color gradient: Burnt-orange core transitioning to emerald atmospheric depth
                    vec3 finalColor = mix(emeraldColor, rimColor, pow(fresnel, 2.2));
                    finalColor += vec3(0.2, 0.14, 0.06) * sunAlignment; // Sun flare accent

                    float alpha = (sharpRim * 1.2 + softHaze) * wave;

                    // Analytical left-side fade: 100% transparent at X <= 0.0 to protect headline
                    float leftFade = smoothstep(0.0, 3.5, vWorldPosition.x);
                    alpha *= leftFade;

                    if (isDarkMode < 0.5) {
                        alpha *= 0.85;
                    }

                    gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 1.0));
                }
            `,
            uniforms: {
                rimColor: { value: orangeColor },
                emeraldColor: { value: forestColor },
                sunLightPos: { value: new THREE.Vector3(14, 16, 9) },
                time: { value: 0 },
                isDarkMode: { value: isDark ? 1.0 : 0.0 },
            },
            transparent: true,
            blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
            side: THREE.FrontSide,
            depthWrite: false,
        });
        materialsToDispose.push(atmosphereMat);

        const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
        atmosphereMesh.rotation.copy(bodyMesh.rotation);
        horizonGroup.add(atmosphereMesh);

        // 3C. Outer Exosphere Emerald Shroud
        const exosphereGeo = new THREE.SphereGeometry(
            horizonRadius * 1.045,
            64,
            64,
            0,
            Math.PI * 2,
            0,
            Math.PI * 0.55,
        );
        geometriesToDispose.push(exosphereGeo);

        const exosphereMat = new THREE.ShaderMaterial({
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
                uniform vec3 glowColor;
                uniform float time;

                void main() {
                    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
                    float fresnel = pow(1.0 - max(0.0, dot(viewDir, normalize(vNormal))), 2.4);
                    
                    float leftFade = smoothstep(0.0, 4.0, vWorldPosition.x);
                    float pulse = 0.85 + 0.15 * sin(time * 0.5);

                    gl_FragColor = vec4(glowColor, fresnel * 0.38 * leftFade * pulse);
                }
            `,
            uniforms: {
                glowColor: { value: forestColor },
                time: { value: 0 },
            },
            transparent: true,
            blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
            side: THREE.BackSide,
            depthWrite: false,
        });
        materialsToDispose.push(exosphereMat);

        const exosphereMesh = new THREE.Mesh(exosphereGeo, exosphereMat);
        exosphereMesh.rotation.copy(bodyMesh.rotation);
        horizonGroup.add(exosphereMesh);

        // 3D. Curved Ionization Filament Arc along the Rim
        const ionizationPoints: THREE.Vector3[] = [];
        const ionSegments = 120;
        const ionAngleStart = Math.PI * 0.7;
        const ionAngleEnd = Math.PI * 1.25;

        for (let k = 0; k <= ionSegments; k++) {
            const frac = k / ionSegments;
            const a = ionAngleStart + frac * (ionAngleEnd - ionAngleStart);
            const r = horizonRadius * 1.026;
            const x = r * Math.sin(a);
            const y = r * Math.cos(a);
            const z = Math.sin(frac * Math.PI) * 0.6;
            ionizationPoints.push(new THREE.Vector3(x, y, z));
        }

        const ionizationGeo = new THREE.BufferGeometry().setFromPoints(
            ionizationPoints,
        );
        geometriesToDispose.push(ionizationGeo);

        const ionizationMat = new THREE.LineBasicMaterial({
            color: orangeColor,
            transparent: true,
            opacity: isDark ? 0.8 : 0.5,
            linewidth: 1.5,
        });
        materialsToDispose.push(ionizationMat);

        const ionizationLine = new THREE.Line(ionizationGeo, ionizationMat);
        ionizationLine.rotation.z = Math.PI * 0.26;
        horizonGroup.add(ionizationLine);

        // =========================================================================
        // 4. DIRECTIONAL LIGHTING ("One Sun" Principle from Design Guideline)
        // =========================================================================
        const keySunLight = new THREE.DirectionalLight(
            0xfff6ea,
            isDark ? 3.8 : 2.6,
        );
        keySunLight.position.set(14, 16, 10);
        scene.add(keySunLight);

        const emeraldFillLight = new THREE.DirectionalLight(
            0x173c32,
            isDark ? 2.5 : 1.4,
        );
        emeraldFillLight.position.set(-10, -8, 4);
        scene.add(emeraldFillLight);

        const ambientLight = new THREE.AmbientLight(
            isDark ? 0x111914 : 0xede8dc,
            isDark ? 0.7 : 1.0,
        );
        scene.add(ambientLight);

        // =========================================================================
        // 5. INTERACTION & LIFECYCLE MANAGEMENT
        // =========================================================================
        const handleResize = () => {
            if (!container) return;
            width = container.clientWidth || window.innerWidth;
            height = container.clientHeight || window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            updateHorizonPosition();
        };
        window.addEventListener('resize', handleResize, { passive: true });

        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisible = entry.isIntersecting;
            },
            { threshold: 0.05 },
        );
        observer.observe(container);

        let mouseX = 0;
        let mouseY = 0;
        let targetMouseX = 0;
        let targetMouseY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        };

        const handleMouseLeave = () => {
            targetMouseX = 0;
            targetMouseY = 0;
        };

        window.addEventListener('mousemove', handleMouseMove, {
            passive: true,
        });
        document.addEventListener('mouseleave', handleMouseLeave);

        // =========================================================================
        // 6. ANIMATION LOOP
        // =========================================================================
        const animate = () => {
            if (!isVisible && !isReducedMotion) {
                animationFrameId = requestAnimationFrame(animate);
                return;
            }

            const elapsedTime = clock.getElapsedTime();

            // Smooth pointer lerping
            mouseX += (targetMouseX - mouseX) * 0.04;
            mouseY += (targetMouseY - mouseY) * 0.04;

            if (!isReducedMotion) {
                // Subtle camera depth parallax
                camera.position.x = mouseX * 0.6;
                camera.position.y = mouseY * -0.4;
                camera.lookAt(0, 0, 0);

                // Update shader uniforms
                atmosphereMat.uniforms.time.value = elapsedTime;
                exosphereMat.uniforms.time.value = elapsedTime;

                // Slow planetary rotation
                bodyMesh.rotation.y += 0.0003;
                atmosphereMesh.rotation.y += 0.0003;

                // Drift stars and dust
                starField.rotation.y += 0.0001;
                dustField.rotation.y += 0.00025;

                // Subtle breathing horizon tilt
                horizonGroup.rotation.z = Math.sin(elapsedTime * 0.25) * 0.012;
            } else {
                camera.position.set(0, 0, 16);
                camera.lookAt(0, 0, 0);
            }

            renderer.render(scene, camera);

            if (!isReducedMotion) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        if (isReducedMotion) {
            animate();
        } else {
            animationFrameId = requestAnimationFrame(animate);
        }

        // Cleanup
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            observer.disconnect();

            geometriesToDispose.forEach((g) => g.dispose());
            materialsToDispose.forEach((m) => m.dispose());
            renderer.dispose();

            if (container && renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [isDark, isReducedMotion]);

    // High-Fidelity SVG Fallback if WebGL is unavailable
    if (!webglSupported) {
        return (
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 select-none overflow-hidden bg-transparent"
            >
                <svg
                    viewBox="0 0 1440 900"
                    className="h-full w-full opacity-60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M800,900 C1050,600 1280,420 1440,320 L1440,900 Z"
                        fill="url(#horizonFallbackGrad)"
                    />
                    <path
                        d="M800,900 C1050,600 1280,420 1440,320"
                        stroke="#f15a24"
                        strokeWidth="3"
                        strokeOpacity="0.85"
                    />
                    <defs>
                        <linearGradient
                            id="horizonFallbackGrad"
                            x1="800"
                            y1="900"
                            x2="1440"
                            y2="320"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="#111612" />
                            <stop offset="0.6" stopColor="#173c32" stopOpacity="0.5" />
                            <stop offset="1" stopColor="#f15a24" stopOpacity="0.25" />
                        </linearGradient>
                    </defs>
                </svg>
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
