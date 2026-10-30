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

        // Check prefers-reduced-motion
        const prefersReduced =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const shouldReduce = isOff || prefersReduced;

        // Scene & Orthographic Camera for Full-Screen Quad Shader
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({
                canvas,
                alpha: true,
                antialias: false,
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
        // Optimization: Cap DPR at 1.0 to eliminate redundant pixel calculations and maintain 60+ FPS
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

        // Highly Refined Fragment Shader:
        // Anchored Singularity Core, Seamless Differential Keplerian Accretion Flow,
        // Relativistic Infalling Matter Streams, Gravitational Slingshot Particles, and Subtle Pulse Waves.
        const fragmentShader = `
            precision highp float;
            varying vec2 vUv;

            uniform vec2 uResolution;
            uniform float uTime;
            uniform float uProgress;
            uniform float uIsDark;
            uniform vec2 uMouse;
            uniform float uPulseTime;

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

            void main() {
                vec2 uv = gl_FragCoord.xy / uResolution.xy;
                float aspect = uResolution.x / max(1.0, uResolution.y);

                float isMobile = step(aspect, 1.05);

                // --- 1. Visually Anchored Central Event Horizon ---
                // The central black hole origin remains rock-solid in screen coordinates.
                vec2 center = mix(vec2(0.66, 0.50), vec2(0.50, 0.40), isMobile);

                vec2 p = uv - center;
                p.x *= aspect;

                float r = length(p);
                float rSingularity = mix(0.24, 0.20, isMobile);

                // Early-out for Central Singularity Void:
                // Perfectly circular, anchored void with zero computation overhead
                if (r < rSingularity - 0.02) {
                    gl_FragColor = vec4(0.03, 0.035, 0.03, 1.0);
                    return;
                }

                // --- 2. Subtle Depth Parallax (Anchored Core Guarantee) ---
                // Parallax is smoothly 0 at the event horizon (r <= rSingularity)
                float parallaxFactor = smoothstep(rSingularity * 0.98, rSingularity + 0.42, r);
                vec2 pDisk = p - uMouse * (0.016 * parallaxFactor);

                // --- 3. Tilted 3D Accretion Disk Geometry ---
                float cosAngle = 0.94;
                float sinAngle = 0.34;
                vec2 pRot = vec2(pDisk.x * cosAngle - pDisk.y * sinAngle, pDisk.x * sinAngle + pDisk.y * cosAngle);

                float diskY = pRot.y / 0.44;
                float rDisk = length(vec2(pRot.x, diskY));
                float phi = atan(diskY, pRot.x);

                // Relativistic Differential Rotation:
                // Inner matter orbits substantially faster than outer matter (Keplerian differential shear)
                float omega = 1.85 / (pow(rDisk / rSingularity, 1.25) + 0.14);
                float flowAngle = phi - uTime * omega * 0.42;

                // Logarithmic Infalling Spiral Phase (directional flow along physical curved streamlines)
                float spiralPhase = 3.2 * log(max(0.01, rDisk / rSingularity));
                float psiSpiral = flowAngle + spiralPhase;

                // Accretion Disk Radial Bounds
                float rInnerDisk = rSingularity * 1.08;
                float rOuterDisk = mix(0.85, 0.72, isMobile);

                float diskRadial = smoothstep(rInnerDisk - 0.015, rInnerDisk + 0.06, rDisk) *
                                   smoothstep(rOuterDisk + 0.45, rInnerDisk + 0.04, rDisk);

                float diskScaleHeight = 0.16 + rDisk * 0.14;
                float diskVertical = exp(-pow(diskY / diskScaleHeight, 2.0));

                // Relativistic Doppler Beaming (approaching side boosted, receding side softened)
                float dopplerBeaming = 1.0 + 0.48 * cos(phi + 0.35);

                // Flowing Plasma along Curved Streamlines (100% seamless around 360-degree circle)
                float plasmaDensity = 0.0;
                if (diskRadial > 0.005) {
                    // Seamless harmonic circular basis vectors
                    vec2 dir1 = vec2(cos(flowAngle), sin(flowAngle));
                    vec2 dir2 = vec2(cos(2.0 * flowAngle), sin(2.0 * flowAngle));

                    // Multi-scale convective plasma turbulence (orbital sampling, zero radial boiling)
                    vec2 noiseUV1 = vec2(rDisk * 4.2, 0.0) + dir1 * 1.7;
                    float n1 = snoise(noiseUV1);

                    vec2 noiseUV2 = vec2(rDisk * 7.4 + n1 * 0.5, 0.0) + dir2 * 1.5;
                    float n2 = snoise(noiseUV2);
                    float turbulence = n1 * 0.65 + n2 * 0.35;

                    // High-speed incandescent filaments and streamers sheared by tidal gravity
                    float stream1 = pow(clamp(sin(4.0 * psiSpiral + turbulence * 2.4) * 0.5 + 0.5, 0.0, 1.0), 2.2);
                    float stream2 = pow(clamp(cos(7.0 * psiSpiral - turbulence * 1.6) * 0.5 + 0.5, 0.0, 1.0), 2.8);

                    // Flowing radiance pulses traveling along the curved structure
                    float lightPulse = pow(clamp(sin(2.0 * flowAngle - uTime * 0.85 + spiralPhase * 0.6) * 0.5 + 0.5, 0.0, 1.0), 2.2);

                    // Composite active orbital plasma
                    float plasma = 0.50 + 0.40 * turbulence + 0.60 * stream1 + 0.38 * stream2 + 0.22 * lightPulse;

                    plasmaDensity = diskRadial * diskVertical * dopplerBeaming *
                                    plasma *
                                    uProgress;
                }

                // --- 4. Anchored Photon Sphere with Subtle Relativistic Shimmer ---
                float rPhoton = rSingularity * 1.02;
                float photonDist = abs(r - rPhoton);

                // Subtle micro-shimmer along the ring without excessive pulsing or flashing
                float phiRing = atan(p.y, p.x);
                float ringDoppler = 1.0 + 0.18 * cos(phiRing + 0.35);
                float ringShimmer = 1.0 + 0.05 * sin(phiRing * 4.0 - uTime * 1.1) + 0.03 * cos(phiRing * 2.0 + uTime * 0.7);

                float photonRim = exp(-photonDist * 72.0) * ringDoppler * ringShimmer * uProgress;
                float photonCorona = exp(-photonDist * 18.0) * ringDoppler * (1.0 + 0.04 * sin(phiRing * 3.0 - uTime * 0.8)) * uProgress;

                // Gravitational Lensing Arc (light bent across the horizon)
                float lensArcDist = abs(r - rSingularity * 1.42);
                float arcFlow = 1.0 + 0.08 * sin(atan(p.y, p.x) * 2.0 - uTime * 0.6);
                float lensArc = exp(-lensArcDist * 26.0) * 0.85 * arcFlow * uProgress;

                // --- 5. Gravitational Lensing & Background Stars ---
                float lensDist = max(0.02, r - rSingularity);
                float lensWarp = 0.022 / (lensDist * lensDist + 0.018);
                vec2 pDeflected = p * (1.0 + lensWarp * 0.35);

                // Distant stars with subtle parallax depth
                vec2 starUV = (pDeflected - uMouse * 0.035) * 4.5;
                float starNoise = snoise(starUV * 8.0);
                float starField = pow(max(0.0, starNoise - 0.78), 4.0) * 16.0;

                // --- 6. Volumetric Atmospheric Scattering ---
                float spaceGlowDist1 = length(p - uMouse * 0.015);
                float spaceGlowDist2 = length(p - uMouse * 0.025);
                float spaceGlow1 = exp(-spaceGlowDist1 * 1.6) * 0.75 * uProgress;
                float spaceGlow2 = exp(-spaceGlowDist2 * 0.65) * 0.35 * uProgress;
                float eventHorizonVoid = smoothstep(rSingularity - 0.02, rSingularity + 0.005, r);

                // --- 7. Relativistic Particle Field (Infalling Streams & Slingshots) ---
                vec3 particleLight = vec3(0.0);
                vec3 colParticleWhite = (uIsDark > 0.5) ? vec3(1.0, 0.98, 0.94) : vec3(1.0, 0.98, 0.95);
                vec3 colParticleAmber = (uIsDark > 0.5) ? vec3(1.0, 0.58, 0.18) : vec3(0.96, 0.58, 0.20);
                vec3 colParticleEmber = vec3(0.945, 0.353, 0.141);

                for (int i = 0; i < 18; i++) {
                    float fi = float(i);
                    float seedAngle = fi * 1.9634954;
                    float seedSpeed = 0.065 + fract(sin(fi * 45.23) * 43758.5453) * 0.075;

                    float pR = 0.0;
                    float pAngle = 0.0;
                    float pAlpha = 0.0;
                    vec2 pVelocity = vec2(0.0);

                    if (i < 11) {
                        // Infalling Accreting Streamers (accelerating toward event horizon)
                        float tCycle = fract(uTime * seedSpeed + fi * 0.0909);
                        pR = mix(rOuterDisk * 1.28, rSingularity * 1.012, pow(tCycle, 2.2));
                        float spinOmega = 3.6 / (pow(pR / rSingularity, 1.35) + 0.12);
                        pAngle = seedAngle + spinOmega * tCycle * 6.28318;

                        float fadeIn = smoothstep(0.0, 0.12, tCycle);
                        float tidalFlash = 1.0 + 1.8 * smoothstep(0.72, 0.95, tCycle);
                        float eventHorizonAbsorption = smoothstep(0.992, 0.94, tCycle);
                        pAlpha = fadeIn * tidalFlash * eventHorizonAbsorption * uProgress;
                        pVelocity = vec2(-sin(pAngle), cos(pAngle)) * (0.012 + 0.03 * pow(tCycle, 2.0));
                    } else if (i < 15) {
                        // Gravitational Slingshot & Push-Back Particles (hyperbolic flybys)
                        float tFlyby = fract(uTime * (seedSpeed * 1.35) + fi * 0.23);
                        float s = (tFlyby - 0.5) * 2.0; // -1 to +1
                        pR = (rSingularity * 1.07) + pow(abs(s), 1.85) * (rOuterDisk * 0.88);
                        pAngle = seedAngle + atan(s * 4.5) * 1.85;

                        float flybyAlpha = smoothstep(1.0, 0.75, abs(s));
                        pAlpha = flybyAlpha * (1.1 + 0.5 * (1.0 - abs(s))) * uProgress;
                        pVelocity = vec2(-sin(pAngle), cos(pAngle)) * 0.035;
                    } else {
                        // Resonant Orbital Particles
                        pR = mix(rInnerDisk * 1.35, rOuterDisk * 0.85, 0.5 + 0.5 * sin(fi * 2.7));
                        float orbOmega = 1.85 / (pow(pR / rSingularity, 1.25) + 0.14);
                        pAngle = seedAngle + uTime * orbOmega * 0.42;
                        pAlpha = (0.75 + 0.25 * sin(uTime * 2.0 + fi)) * uProgress;
                        pVelocity = vec2(-sin(pAngle), cos(pAngle)) * 0.016;
                    }

                    // Projected 3D tilted orbit
                    vec2 pOrb = vec2(cos(pAngle) * pR, sin(pAngle) * pR * 0.44);
                    vec2 pScreen = vec2(pOrb.x * cosAngle + pOrb.y * sinAngle, -pOrb.x * sinAngle + pOrb.y * cosAngle);

                    // Subtle mouse gravitational influence
                    vec2 toMouse = (uMouse * 0.18) - pScreen;
                    float dMouse = length(toMouse);
                    if (dMouse < 0.45) {
                        pScreen += normalize(toMouse) * (0.015 * (1.0 - dMouse / 0.45));
                    }

                    float dPart = length(p - pScreen);
                    float core = exp(-dPart * 120.0);
                    float aura = exp(-dPart * 26.0) * 0.35;
                    float dTrail = length(p - (pScreen - pVelocity * 0.55));
                    float trail = exp(-dTrail * 65.0) * 0.25;

                    float pIntensity = (core + aura + trail) * pAlpha;
                    float pDoppler = 1.0 + 0.48 * cos(pAngle + 0.35);
                    vec3 colCurrent = mix(colParticleEmber, colParticleWhite, clamp(pDoppler * 0.55 + pAlpha * 0.45, 0.0, 1.0));

                    particleLight += colCurrent * pIntensity * pDoppler;
                }

                // --- 8. Gravitational Wave Expansion from Singularity on Click ---
                float timeSincePulse = uTime - uPulseTime;
                float pulseWave = 0.0;
                if (timeSincePulse > 0.0 && timeSincePulse < 1.8) {
                    float rWave = timeSincePulse * 0.65;
                    float waveDist = abs(r - rWave);
                    pulseWave = exp(-waveDist * waveDist * 160.0) * exp(-timeSincePulse * 1.6) * 0.20 * uProgress;
                }

                // --- 9. Color Synthesis (Preserving Exact Brand Palette) ---
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

                    // Relativistic Particles & Tracer Streams
                    finalColor += particleLight;

                    // Gravitational Wave Pulse
                    finalColor += colInnerRim * pulseWave * 0.85;
                    finalColor += colWhiteHot * pulseWave * 0.45;

                    // Photon Sphere Rim
                    finalColor += colInnerRim * photonCorona * 0.85;
                    finalColor += colWhiteHot * photonRim * 1.45;

                    // Void Masking (Anchored Singularity Void)
                    finalColor *= (0.02 + 0.98 * eventHorizonVoid);

                    finalAlpha = clamp(
                        plasmaDensity * 1.1 + photonRim * 1.2 + photonCorona * 0.8 +
                        lensArc * 0.7 + spaceGlow1 * 0.85 + spaceGlow2 * 0.45 + starField * 0.6 +
                        length(particleLight) * 0.55 + pulseWave * 0.8,
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

                    // Particles & Wave Pulse in Light Theme
                    finalColor += particleLight * 0.85;
                    finalColor += colSolarGold * pulseWave * 0.65;

                    finalColor *= (0.12 + 0.88 * eventHorizonVoid);
                    finalAlpha = clamp(plasmaDensity * 0.85 + photonRim * 0.9 + spaceGlow1 * 0.5 + length(particleLight) * 0.4, 0.0, 0.88);
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
                uProgress: { value: shouldReduce ? 1.0 : 0.0 },
                uIsDark: { value: isDark ? 1.0 : 0.0 },
                uMouse: { value: new THREE.Vector2(0, 0) },
                uPulseTime: { value: -999.0 },
            },
        });

        const planeGeometry = new THREE.PlaneGeometry(2, 2);
        const plane = new THREE.Mesh(planeGeometry, material);
        scene.add(plane);

        updateSize();
        window.addEventListener('resize', updateSize, { passive: true });

        // Gentle, Cinematic Mouse Parallax with Smooth Easing
        let targetMouseX = 0;
        let targetMouseY = 0;
        let currentMouseX = 0;
        let currentMouseY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            if (shouldReduce) return;
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;
            targetMouseX = Math.max(-0.5, Math.min(0.5, x * 0.35));
            targetMouseY = Math.max(-0.5, Math.min(0.5, y * 0.35));
        };

        const handleMouseLeave = () => {
            targetMouseX = 0;
            targetMouseY = 0;
        };

        // Click / Pointerdown triggers spacetime gravitational ripple wave from singularity
        const handlePointerDown = () => {
            if (shouldReduce) return;
            material.uniforms.uPulseTime.value = clock.getElapsedTime();
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
        window.addEventListener('blur', handleMouseLeave, { passive: true });
        window.addEventListener('pointerdown', handlePointerDown, { passive: true });

        // Coordinated Animation Loop: Fully halted when off-screen or tab hidden
        let animId: number | null = null;
        let isRunning = false;
        let isIntersecting = true;
        const clock = new THREE.Clock();
        let entranceProgress = shouldReduce ? 1.0 : 0.0;

        const render = () => {
            if (!isRunning) return;

            const delta = clock.getDelta();
            const elapsedTime = clock.getElapsedTime();

            if (!shouldReduce) {
                if (entranceProgress < 1.0) {
                    entranceProgress = Math.min(1.0, entranceProgress + delta * 0.95);
                    material.uniforms.uProgress.value = entranceProgress;
                }

                // Smooth cinematic easing to target mouse position
                currentMouseX += (targetMouseX - currentMouseX) * 0.04;
                currentMouseY += (targetMouseY - currentMouseY) * 0.04;
                material.uniforms.uMouse.value.set(currentMouseX, currentMouseY);

                material.uniforms.uTime.value = elapsedTime;
            } else {
                material.uniforms.uProgress.value = 1.0;
                material.uniforms.uTime.value = 10.0;
                material.uniforms.uMouse.value.set(0, 0);
                material.uniforms.uPulseTime.value = -999.0;
            }

            material.uniforms.uIsDark.value = isDark ? 1.0 : 0.0;
            renderer.render(scene, camera);

            if (!shouldReduce) {
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
            window.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('blur', handleMouseLeave);
            window.removeEventListener('pointerdown', handlePointerDown);
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
