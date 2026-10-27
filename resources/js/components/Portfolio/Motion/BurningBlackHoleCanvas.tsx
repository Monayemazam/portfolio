import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface BurningBlackHoleCanvasProps {
    isDark?: boolean;
    isOff?: boolean;
    className?: string;
}

export default function BurningBlackHoleCanvas({
    isDark = true,
    isOff = false,
    className = '',
}: BurningBlackHoleCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [webGlSupported, setWebGlSupported] = useState(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        // Scene & Orthographic Camera for Full-Screen Quad Shader
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({
                canvas,
                alpha: true,
                antialias: false, // Atmospheric plasma does not require hardware MSAA
                powerPreference: 'high-performance',
                stencil: false,
                depth: false,
            });
        } catch (err) {
            console.warn('WebGL initialization failed, falling back to static celestial visual:', err);
            setWebGlSupported(false);
            return;
        }

        renderer.setClearColor(0x000000, 0);
        // Optimization: Cap DPR at 1.0 to eliminate multi-million redundant pixel calculations on high-DPI screens
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.0));

        const updateSize = () => {
            const width = container.clientWidth || window.innerWidth;
            const height = container.clientHeight || window.innerHeight;
            renderer.setSize(width, height, false);
            if (material.uniforms.uResolution) {
                material.uniforms.uResolution.value.set(width, height);
            }
        };

        // Vertex Shader
        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `;

        // Highly Optimized Fragment Shader: Astrophysically-Inspired Full-Screen Burning Black Hole
        const fragmentShader = `
            precision highp float;
            varying vec2 vUv;

            uniform vec2 uResolution;
            uniform float uTime;
            uniform float uProgress;
            uniform float uIsDark;
            uniform vec2 uMouse;

            // --- Fast Simplex Noise Hashing ---
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

            float snoise(vec2 v) {
                const vec4 C = vec4(0.211324865405187,
                                    0.366025403784439,
                                   -0.577350269189626,
                                    0.024390243902439);
                vec2 i  = floor(v + dot(v, C.yy));
                vec2 x0 = v -   i + dot(i, C.xx);
                vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                vec4 x12 = x0.xyxy + C.xxzz;
                x12.xy -= i1;
                i = mod289(i);
                vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
                vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
                m = m * m;
                m = m * m;
                vec3 x = 2.0 * fract(p * C.www) - 1.0;
                vec3 h = abs(x) - 0.5;
                vec3 ox = floor(x + 0.5);
                vec3 a0 = x - ox;
                m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
                vec3 g;
                g.x = a0.x * x0.x + h.x * x0.y;
                g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                return 130.0 * dot(m, g);
            }

            // High-Performance Domain-Warped Turbulent Plasma (Just 4 Simplex calls instead of 40)
            float fastPlasma(vec2 p, float t) {
                vec2 q = vec2(
                    snoise(p + vec2(t * 0.22, 0.0)),
                    snoise(p * 1.15 + vec2(0.0, t * 0.18))
                );
                vec2 r = vec2(
                    snoise(p + q * 1.35 + vec2(t * 0.30, -t * 0.12)),
                    snoise(p + q * 1.35 + vec2(-t * 0.20, t * 0.24))
                );
                return snoise(p + r * 1.7) * 0.65 + snoise(p * 2.1 + r * 0.7) * 0.35;
            }

            void main() {
                vec2 uv = gl_FragCoord.xy / uResolution.xy;
                float aspect = uResolution.x / max(1.0, uResolution.y);

                float isMobile = step(aspect, 1.05);
                vec2 targetCenter = mix(
                    vec2(0.66 + uMouse.x * 0.025, 0.50 + uMouse.y * 0.025),
                    vec2(0.50 + uMouse.x * 0.015, 0.40 + uMouse.y * 0.015),
                    isMobile
                );

                vec2 p = uv - targetCenter;
                p.x *= aspect;

                float r = length(p);
                float rSingularity = mix(0.24, 0.20, isMobile);

                // --- 1. Early-Out for Central Singularity Void ---
                // Avoids calculating noise, disk coordinates, or lighting for pixels inside the black hole
                if (r < rSingularity - 0.02) {
                    gl_FragColor = vec4(0.03, 0.035, 0.03, 1.0);
                    return;
                }

                // --- 2. Gravitational Lensing & Coordinate Projection ---
                float lensDist = max(0.02, r - rSingularity);
                float lensWarp = 0.022 / (lensDist * lensDist + 0.018);
                vec2 pDeflected = p * (1.0 + lensWarp * 0.35);

                // Tilted 3D Elliptical Accretion Disk
                float cosAngle = 0.94;
                float sinAngle = 0.34;
                vec2 pRot = vec2(p.x * cosAngle - p.y * sinAngle, p.x * sinAngle + p.y * cosAngle);

                float diskY = pRot.y / 0.44;
                float rDisk = length(vec2(pRot.x, diskY));
                float phi = atan(diskY, pRot.x);

                // Keplerian Differential Rotation
                float omega = 2.4 / (pow(rDisk + 0.14, 1.25));
                float flowAngle = phi - uTime * omega * 0.42;

                // Accretion Disk Radial Bounds
                float rInnerDisk = rSingularity * 1.08;
                float rOuterDisk = mix(0.85, 0.72, isMobile);

                float diskRadial = smoothstep(rInnerDisk - 0.015, rInnerDisk + 0.06, rDisk) *
                                   smoothstep(rOuterDisk + 0.45, rInnerDisk + 0.04, rDisk);

                float diskScaleHeight = 0.16 + rDisk * 0.14;
                float diskVertical = exp(-pow(diskY / diskScaleHeight, 2.0));

                // Doppler Beaming
                float dopplerBeaming = 1.0 + 0.48 * cos(phi + 0.35);

                // Plasma calculation only where disk density is non-zero
                float plasmaDensity = 0.0;
                if (diskRadial > 0.005) {
                    vec2 plasmaUV = vec2(rDisk * 3.8, flowAngle * 2.2);
                    float plasma = fastPlasma(plasmaUV, uTime * 0.6);
                    float filaments = pow(clamp(sin(flowAngle * 7.0 + plasma * 4.5 + uTime * 0.7) * 0.5 + 0.5, 0.0, 1.0), 2.5);
                    plasmaDensity = diskRadial * diskVertical * dopplerBeaming *
                                    (0.55 + 0.75 * plasma + 0.5 * filaments) *
                                    uProgress;
                }

                // --- 3. Photon Sphere & Lensing Arch ---
                float rPhoton = rSingularity * 1.02;
                float photonDist = abs(r - rPhoton);
                float photonRim = exp(-photonDist * 72.0) * uProgress;
                float photonCorona = exp(-photonDist * 18.0) * uProgress;

                float lensArcDist = abs(r - rSingularity * 1.42);
                float lensArc = exp(-lensArcDist * 26.0) * 0.85 * uProgress;

                // --- 4. Distant Stars (Analytical Screen-Space Generation) ---
                vec2 starUV = pDeflected * 4.5;
                float starNoise = snoise(starUV * 8.0);
                float starField = pow(max(0.0, starNoise - 0.78), 4.0) * 16.0;

                // --- 5. Volumetric Atmospheric Scattering ---
                float spaceGlow1 = exp(-r * 1.6) * 0.75 * uProgress;
                float spaceGlow2 = exp(-r * 0.65) * 0.35 * uProgress;
                float eventHorizonVoid = smoothstep(rSingularity - 0.02, rSingularity + 0.005, r);

                // --- 6. Color Synthesis ---
                vec3 finalColor = vec3(0.0);
                float finalAlpha = 0.0;

                if (uIsDark > 0.5) {
                    // Deep Space Dark Theme
                    vec3 colWhiteHot     = vec3(1.0, 0.98, 0.94);
                    vec3 colInnerRim     = vec3(1.0, 0.56, 0.16); // Blazing orange #FF8F29
                    vec3 colBurntOrange  = vec3(0.945, 0.353, 0.141); // Signature #F15A24
                    vec3 colDeepEmber    = vec3(0.74, 0.22, 0.05); // Warm red-orange #BC380D
                    vec3 colForestMist   = vec3(0.09, 0.235, 0.196); // Deep forest green #173C32

                    // Atmosphere & Stars
                    finalColor += colForestMist * spaceGlow2 * 0.65;
                    finalColor += colDeepEmber * spaceGlow1 * 0.55;
                    finalColor += vec3(0.95, 0.96, 1.0) * starField * (1.0 - diskVertical * 0.85);

                    // Lensing Arc & Burning Plasma
                    finalColor += colBurntOrange * lensArc * 0.85;
                    finalColor += colWhiteHot * lensArc * 0.25;

                    finalColor += colDeepEmber * plasmaDensity * 0.7;
                    finalColor += colBurntOrange * plasmaDensity * 1.1;
                    finalColor += colInnerRim * pow(plasmaDensity, 1.5) * 0.9;
                    finalColor += colWhiteHot * pow(plasmaDensity, 2.6) * 1.3;

                    // Photon Sphere Rim
                    finalColor += colInnerRim * photonCorona * 0.85;
                    finalColor += colWhiteHot * photonRim * 1.45;

                    // Void Masking
                    finalColor *= (0.02 + 0.98 * eventHorizonVoid);

                    finalAlpha = clamp(
                        plasmaDensity * 1.1 + photonRim * 1.2 + photonCorona * 0.8 +
                        lensArc * 0.7 + spaceGlow1 * 0.85 + spaceGlow2 * 0.45 + starField * 0.6,
                        0.0, 1.0
                    );
                } else {
                    // Solar Light Theme
                    vec3 colSolarWhite  = vec3(1.0, 0.98, 0.95);
                    vec3 colSolarGold   = vec3(0.96, 0.58, 0.20);
                    vec3 colSolarAmber  = vec3(0.945, 0.353, 0.141);
                    vec3 colWarmSky     = vec3(0.88, 0.90, 0.94);

                    finalColor += colWarmSky * spaceGlow2 * 0.35;
                    finalColor += colSolarAmber * spaceGlow1 * 0.4;
                    finalColor += colSolarAmber * plasmaDensity * 0.9;
                    finalColor += colSolarGold * pow(plasmaDensity, 1.6) * 0.7;
                    finalColor += colSolarWhite * photonRim * 1.2;

                    finalColor *= (0.12 + 0.88 * eventHorizonVoid);
                    finalAlpha = clamp(plasmaDensity * 0.85 + photonRim * 0.9 + spaceGlow1 * 0.5, 0.0, 0.88);
                }

                gl_FragColor = vec4(finalColor, finalAlpha);
            }
        `;

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            transparent: true,
            depthWrite: false,
            uniforms: {
                uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
                uTime: { value: 0 },
                uProgress: { value: isOff ? 1.0 : 0.0 },
                uIsDark: { value: isDark ? 1.0 : 0.0 },
                uMouse: { value: new THREE.Vector2(0, 0) },
            },
        });

        const planeGeometry = new THREE.PlaneGeometry(2, 2);
        const plane = new THREE.Mesh(planeGeometry, material);
        scene.add(plane);

        updateSize();
        window.addEventListener('resize', updateSize, { passive: true });

        // Gentle Mouse Parallax
        let targetMouseX = 0;
        let targetMouseY = 0;
        let currentMouseX = 0;
        let currentMouseY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            if (isOff) return;
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;
            targetMouseX = Math.max(-0.5, Math.min(0.5, x * 0.35));
            targetMouseY = Math.max(-0.5, Math.min(0.5, y * 0.35));
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // Animation Loop Control: Fully paused when off-screen or tab hidden
        let animId: number | null = null;
        let isRunning = false;
        let isIntersecting = true;
        let clock = new THREE.Clock();
        let entranceProgress = isOff ? 1.0 : 0.0;

        const render = () => {
            if (!isRunning) return;

            const delta = clock.getDelta();
            const elapsedTime = clock.getElapsedTime();

            if (!isOff) {
                if (entranceProgress < 1.0) {
                    entranceProgress = Math.min(1.0, entranceProgress + delta * 0.95);
                    material.uniforms.uProgress.value = entranceProgress;
                }

                currentMouseX += (targetMouseX - currentMouseX) * 0.05;
                currentMouseY += (targetMouseY - currentMouseY) * 0.05;
                material.uniforms.uMouse.value.set(currentMouseX, currentMouseY);

                material.uniforms.uTime.value = elapsedTime;
            } else {
                material.uniforms.uProgress.value = 1.0;
                material.uniforms.uTime.value = 10.0;
            }

            material.uniforms.uIsDark.value = isDark ? 1.0 : 0.0;
            renderer.render(scene, camera);

            if (!isOff) {
                animId = requestAnimationFrame(render);
            }
        };

        const startLoop = () => {
            if (isRunning || !isIntersecting || document.hidden) return;
            isRunning = true;
            clock.start();
            render();
        };

        const stopLoop = () => {
            if (!isRunning) return;
            isRunning = false;
            if (animId !== null) {
                cancelAnimationFrame(animId);
                animId = null;
            }
            clock.stop();
        };

        // Viewport Intersection Observer: Halts render loop completely when scrolled out of view
        const observer = new IntersectionObserver(
            ([entry]) => {
                isIntersecting = entry.isIntersecting;
                if (isIntersecting && !document.hidden) {
                    startLoop();
                } else {
                    stopLoop();
                }
            },
            { threshold: 0.02 }
        );
        observer.observe(container);

        // Tab Visibility Observer: Halts render loop when tab is hidden
        const handleVisibilityChange = () => {
            if (document.hidden) {
                stopLoop();
            } else if (isIntersecting) {
                startLoop();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Initial launch
        startLoop();

        return () => {
            stopLoop();
            window.removeEventListener('resize', updateSize);
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            observer.disconnect();
            planeGeometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, [isDark, isOff]);

    return (
        <div ref={containerRef} className={`relative overflow-hidden select-none ${className}`}>
            {webGlSupported ? (
                <canvas ref={canvasRef} className="h-full w-full block pointer-events-none" />
            ) : (
                /* High-Fidelity SVG Fallback if WebGL is unavailable */
                <div className="relative h-full w-full flex items-center justify-center">
                    <svg
                        className="h-full w-full pointer-events-none"
                        viewBox="0 0 1440 900"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <radialGradient id="bhVoidGradient" cx="66%" cy="50%" r="45%">
                                <stop offset="0%" stopColor="#0B0D0A" />
                                <stop offset="35%" stopColor="#0F120E" />
                                <stop offset="42%" stopColor="#F15A24" stopOpacity="0.8" />
                                <stop offset="55%" stopColor="#173C32" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#171914" stopOpacity="0" />
                            </radialGradient>
                            <linearGradient id="bhDiskFlare" x1="20%" y1="50%" x2="100%" y2="50%">
                                <stop offset="0%" stopColor="#F15A24" stopOpacity="0" />
                                <stop offset="40%" stopColor="#F15A24" stopOpacity="0.6" />
                                <stop offset="66%" stopColor="#FFFFFF" stopOpacity="0.9" />
                                <stop offset="85%" stopColor="#F15A24" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#F15A24" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <rect width="1440" height="900" fill="url(#bhVoidGradient)" />
                        <ellipse cx="950" cy="450" rx="420" ry="140" fill="url(#bhDiskFlare)" opacity="0.75" />
                        <circle cx="950" cy="450" r="160" fill="#0C0E0B" />
                        <circle cx="950" cy="450" r="162" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.95" />
                        <circle cx="950" cy="450" r="166" stroke="#F15A24" strokeWidth="6" opacity="0.8" />
                    </svg>
                </div>
            )}
        </div>
    );
}
