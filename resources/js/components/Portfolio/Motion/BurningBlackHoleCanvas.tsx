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
                antialias: false,
                powerPreference: 'high-performance',
                stencil: false,
                depth: false,
                premultipliedAlpha: true,
            });
        } catch (err) {
            console.warn('WebGL initialization failed, falling back to static celestial visual:', err);
            setWebGlSupported(false);
            return;
        }

        renderer.setClearColor(0x000000, 0);
        // Optimization: Cap DPR at 1.15 to ensure razor sharpness on Retina while avoiding GPU fill-rate choke
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.15));

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

        // Fragment Shader: "The Living Singularity"
        // Features: Relativistic Gravitational Lensing, Infalling Logarithmic Spiral Filaments,
        // Doppler Beaming Asymmetry, Razor-Thin Photon Sphere, Plunge Tendrils & Interactive 3D Tilt
        const fragmentShader = `
            precision highp float;
            varying vec2 vUv;

            uniform vec2 uResolution;
            uniform float uTime;
            uniform float uProgress;
            uniform float uIsDark;
            uniform vec2 uMouse;
            uniform vec2 uTilt;
            uniform float uInteraction;

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

            // High-Performance Domain-Warped Turbulent Accretion Plasma
            // Calculates fine magnetic braided filaments and relativistic infalling matter streams
            float accretionFlow(vec2 uvCoord, float flowAngle, float radius, float t, float rSingularity, float mouseRipple) {
                // Relativistic differential rotation: inner matter whips around much faster than outer matter
                float omega = 2.5 / (pow(radius / rSingularity, 1.32) + 0.12);
                // Logarithmic spiral angle: creates authentic infalling matter streamers pulled toward horizon
                float spiralAngle = flowAngle - t * omega * 0.42 + 3.4 * log(max(0.001, radius / rSingularity)) + mouseRipple;

                // 1. Fine magnetic stream braids (multi-frequency filaments)
                float b1 = sin(spiralAngle * 6.0 + radius * 14.0);
                float b2 = cos(spiralAngle * 11.0 - radius * 22.0 + t * 0.7);
                float b3 = sin(spiralAngle * 19.0 + 34.0 * log(max(0.001, radius / rSingularity)));
                float braidedFilaments = (b1 * 0.42 + b2 * 0.35 + b3 * 0.23) * 0.5 + 0.5;

                // 2. Turbulent MHD convective eddies
                vec2 pEddy = vec2(radius * 4.4, spiralAngle * 2.3);
                vec2 q = vec2(
                    snoise(pEddy + vec2(t * 0.22, 0.0)),
                    snoise(pEddy * 1.15 + vec2(0.0, t * 0.18))
                );
                vec2 rWarp = vec2(
                    snoise(pEddy + q * 1.35 + vec2(t * 0.30, -t * 0.15)),
                    snoise(pEddy + q * 1.35 + vec2(-t * 0.20, t * 0.24))
                );
                float turbulence = snoise(pEddy + rWarp * 1.5) * 0.65 + snoise(pEddy * 2.1 + rWarp * 0.75) * 0.35;
                turbulence = clamp(turbulence * 0.5 + 0.5, 0.0, 1.0);

                // 3. Relativistic sheared flaring knots orbiting at high velocity
                float flare1 = exp(-pow(fract((spiralAngle + t * 0.22) * 0.159155) - 0.4, 2.0) * 34.0) *
                               exp(-pow((radius - rSingularity * 1.38) / 0.11, 2.0));
                float flare2 = exp(-pow(fract((spiralAngle - 1.9 - t * 0.16) * 0.159155) - 0.62, 2.0) * 26.0) *
                               exp(-pow((radius - rSingularity * 1.85) / 0.16, 2.0));
                float flares = flare1 * 1.35 + flare2 * 0.95;

                return clamp(turbulence * 0.55 + braidedFilaments * 0.45 + flares * 0.65, 0.0, 2.5);
            }

            void main() {
                vec2 uv = gl_FragCoord.xy / uResolution.xy;
                float aspect = uResolution.x / max(1.0, uResolution.y);

                float isMobile = step(aspect, 1.05);

                // Anchored celestial coordinates: desktop places black hole on right side, mobile centers it
                vec2 baseCenter = mix(vec2(0.67, 0.50), vec2(0.50, 0.38), isMobile);

                // Differential parallax: singularity core has heavy mass and moves gently, outer fields move more
                vec2 coreCenter = baseCenter + uMouse * mix(0.016, 0.010, isMobile);
                vec2 outerCenter = baseCenter + uMouse * mix(0.038, 0.020, isMobile);

                vec2 p = uv - coreCenter;
                p.x *= aspect;

                float r = length(p);
                float rSingularity = mix(0.22, 0.18, isMobile);

                // --- 1. Deep Event Horizon Early Void Optimization ---
                // For pixels deeply inside the event horizon, early exit with absolute pure black void
                if (r < rSingularity * 0.965) {
                    if (uIsDark > 0.5) {
                        gl_FragColor = vec4(0.005, 0.008, 0.006, 1.0);
                    } else {
                        gl_FragColor = vec4(0.08, 0.09, 0.08, 0.95);
                    }
                    return;
                }

                // Interactive 3D Disk Tilt & Rotation
                // At rest, tilted ~22 degrees forward with gentle diagonal swoop
                float basePitch = 0.38;
                float baseRoll  = 0.26;
                float curPitch  = clamp(basePitch + uTilt.y * 0.16, 0.24, 0.56);
                float curRoll   = baseRoll + uTilt.x * 0.18;

                float cosRoll = cos(curRoll);
                float sinRoll = sin(curRoll);
                float diskInc = curPitch;

                // Rotated coordinates for tilted direct accretion disk
                vec2 pRot = vec2(p.x * cosRoll - p.y * sinRoll, p.x * sinRoll + p.y * cosRoll);
                vec2 diskUV = vec2(pRot.x, pRot.y / diskInc);
                float rDiskDirect = length(diskUV);
                float phiDiskDirect = atan(diskUV.y, diskUV.x);

                // Interactive mouse tidal perturbation on plasma streams
                vec2 mouseDelta = p - (uMouse * 0.35);
                float mouseDist = length(mouseDelta);
                float mouseRipple = exp(-mouseDist * 2.8) * uInteraction * 0.14 * sin(uTime * 2.5 + r * 10.0);

                // Relativistic Doppler Beaming
                // Matter approaching the observer (left-lower side) is fiercely amplified and blue/white shifted;
                // receding matter (right-upper side) is dimmed and redshifted to deep ember
                float dopplerDirect = pow(max(0.05, 1.0 + 0.60 * sin(phiDiskDirect + 0.32) * (1.0 - diskInc * 0.45)), 3.2);

                // --- 2. Foreground Direct Accretion Disk ---
                float rInnerDisk = rSingularity * 1.06;
                float rOuterDisk = mix(0.92, 0.78, isMobile);

                float directMask = smoothstep(rInnerDisk - 0.015, rInnerDisk + 0.06, rDiskDirect) *
                                   smoothstep(rOuterDisk + 0.45, rInnerDisk + 0.04, rDiskDirect);

                float directPlasma = 0.0;
                if (directMask > 0.003) {
                    float rawPlasma = accretionFlow(diskUV, phiDiskDirect, rDiskDirect, uTime, rSingularity, mouseRipple);
                    float hScale = 0.15 + rDiskDirect * 0.12;
                    float vProfile = exp(-pow(pRot.y / (diskInc * hScale), 2.0));
                    directPlasma = rawPlasma * directMask * vProfile * dopplerDirect;
                }

                // --- 3. Gravitationally Lensed Halo (The Einstein Arch) ---
                // General Relativity bends rays passing behind the black hole over the top and bottom of the event horizon
                float lensRadius = (rSingularity * rSingularity * 1.42) / max(0.005, r - rSingularity * 0.96);
                float rDiskLensed = clamp(lensRadius, rInnerDisk, rOuterDisk * 1.25);
                float phiDiskLensed = atan(pRot.y, -pRot.x);

                float dopplerLensed = pow(max(0.05, 1.0 + 0.52 * sin(phiDiskLensed + 0.32) * (1.0 - diskInc * 0.45)), 3.0);
                float lensedMask = smoothstep(rSingularity * 1.01, rSingularity * 1.05, r) *
                                   smoothstep(rSingularity * 2.7, rSingularity * 1.15, r);

                float lensedPlasma = 0.0;
                if (lensedMask > 0.003 && rDiskLensed < rOuterDisk * 1.25) {
                    float rawLensed = accretionFlow(vec2(rDiskLensed, phiDiskLensed), phiDiskLensed, rDiskLensed, uTime, rSingularity, mouseRipple);
                    float archShape = exp(-pow((r - rSingularity * 1.44) / 0.17, 2.0));
                    lensedPlasma = rawLensed * lensedMask * archShape * dopplerLensed * 0.85;
                }

                // --- 4. Active Infalling Plunge Tendrils across ISCO ---
                // Matter losing stable orbit and accelerating directly into the singularity
                float plungePlasma = 0.0;
                if (r >= rSingularity * 0.97 && r <= rInnerDisk * 1.35) {
                    float plungeSpiral = phiDiskDirect - 15.0 * log(max(0.001, (r - rSingularity * 0.97) / 0.14)) - uTime * 3.2;
                    float tendrils = pow(sin(plungeSpiral * 8.0) * 0.5 + 0.5, 3.2);
                    float plungeMask = smoothstep(rInnerDisk * 1.3, rSingularity * 1.01, r) *
                                       smoothstep(rSingularity * 0.975, rSingularity * 1.015, r);
                    plungePlasma = tendrils * plungeMask * dopplerDirect * 1.45;
                }

                // --- 5. Razor-Sharp Relativistic Photon Sphere & Sub-Rings ---
                // Infinitely trapped light boundary at the photon sphere
                float dPhoton = abs(r - rSingularity * 1.014);
                float rimDoppler = 1.0 + 0.52 * sin(phiDiskDirect + 0.35);
                float photonRing = exp(-dPhoton * 190.0) * (1.2 + 0.45 * sin(phiDiskDirect + 0.4)) * rimDoppler * uProgress;
                float photonSubRing = exp(-abs(r - rSingularity * 1.036) * 280.0) * 0.48 * rimDoppler * uProgress;
                float photonCorona = exp(-dPhoton * 28.0) * 0.75 * rimDoppler * uProgress;

                // --- 6. Relativistic Infalling Micro-Sparks (Active Matter Consumption) ---
                // 12 procedural high-energy sparks spiraling into the black hole along geodesic paths
                float sparks = 0.0;
                for (int i = 0; i < 12; i++) {
                    float fi = float(i);
                    float phase = fract(uTime * 0.14 + fi * 0.08333);
                    float sparkR = mix(rOuterDisk * 0.88, rSingularity * 1.01, pow(phase, 1.9));
                    float sparkAngle = fi * 1.95 + pow(phase, 1.45) * 7.5 + uTime * 0.38;
                    vec2 spDisk = vec2(cos(sparkAngle) * sparkR, sin(sparkAngle) * sparkR * diskInc);
                    vec2 spWorld = vec2(spDisk.x * cosRoll - spDisk.y * sinRoll, spDisk.x * sinRoll + spDisk.y * cosRoll);

                    // Slight cursor gravitational deflection on nearby sparks
                    vec2 spMouseDelta = (uMouse * 0.28) - spWorld;
                    spWorld += spMouseDelta * (0.04 * uInteraction / (length(spMouseDelta) + 0.12));

                    float dSp = length(p - spWorld);
                    float sparkLife = sin(phase * 3.14159) * (0.35 + 0.65 * pow(phase, 2.2));
                    sparks += exp(-dSp * 88.0) * sparkLife * (0.85 + 0.4 * sin(fi * 2.8 + uTime * 3.0));
                }

                // --- 7. Deep Atmospheric Space Glow & Lensed Distant Stars ---
                vec2 pOuter = uv - outerCenter;
                pOuter.x *= aspect;
                float rOuter = length(pOuter);

                float spaceGlow1 = exp(-rOuter * 1.5) * 0.70 * uProgress;
                float spaceGlow2 = exp(-rOuter * 0.58) * 0.35 * uProgress;

                // Deflected distant background stars
                float lensWarp = (rSingularity * 0.032) / max(0.015, r - rSingularity * 0.96);
                vec2 pDeflected = p * (1.0 + lensWarp * 0.45);
                float starNoise = snoise(pDeflected * 34.0);
                float starField = pow(max(0.0, starNoise - 0.76), 4.0) * 20.0 * (1.0 - smoothstep(rSingularity, rSingularity * 2.2, r) * 0.8);

                // --- 8. Event Horizon Void Masking ---
                // Absolute pure black inside event horizon
                float eventHorizonVoid = smoothstep(rSingularity * 0.975, rSingularity * 1.002, r);

                // Typography Vignette Protection: Gently attenuates glow towards left screen edge
                float textVignette = smoothstep(0.04, 0.50, uv.x);

                // --- 9. Final Color Grading & Synthesis ---
                vec3 finalColor = vec3(0.0);
                float finalAlpha = 0.0;

                float totalPlasma = (directPlasma + lensedPlasma + plungePlasma) * uProgress;

                if (uIsDark > 0.5) {
                    // Deep Space Dark Theme (Charcoal #171914, Primary Orange #F15A24, Forest #173C32)
                    vec3 colWhiteHot      = vec3(1.0, 0.98, 0.94);
                    vec3 colGold          = vec3(1.0, 0.74, 0.24);
                    vec3 colSignalOrange  = vec3(0.945, 0.353, 0.141); // #F15A24 Brand Primary
                    vec3 colDeepEmber     = vec3(0.72, 0.18, 0.04);
                    vec3 colDarkCrimson   = vec3(0.40, 0.08, 0.02);
                    vec3 colForest        = vec3(0.09, 0.235, 0.196); // #173C32 Forest Token

                    // Multi-layer plasma color spectrum
                    vec3 plasmaCol = mix(colDarkCrimson, colDeepEmber, clamp(totalPlasma * 0.85, 0.0, 1.0));
                    plasmaCol = mix(plasmaCol, colSignalOrange, clamp(pow(totalPlasma, 1.35) * 0.92, 0.0, 1.0));
                    plasmaCol = mix(plasmaCol, colGold, clamp(pow(totalPlasma, 2.1) * 1.15, 0.0, 1.0));
                    plasmaCol = mix(plasmaCol, colWhiteHot, clamp(pow(totalPlasma, 3.2) * 1.45, 0.0, 1.0));

                    // Ambient cosmic environment
                    finalColor += colForest * spaceGlow2 * 0.60;
                    finalColor += colDeepEmber * spaceGlow1 * 0.50;
                    finalColor += vec3(0.95, 0.96, 1.0) * starField * (1.0 - directMask * 0.75);

                    // Flowing plasma & infalling tendrils
                    finalColor += plasmaCol * totalPlasma * 1.30;

                    // Relativistic infalling sparks
                    finalColor += colGold * sparks * 0.75;
                    finalColor += colWhiteHot * sparks * 1.45;

                    // Razor-hot photon ring & corona
                    finalColor += colSignalOrange * photonCorona * 0.85;
                    finalColor += colGold * (photonRing + photonSubRing) * 0.95;
                    finalColor += colWhiteHot * (photonRing * 1.65 + photonSubRing * 0.75);

                    // Mask with Event Horizon Void (deep pure black inside)
                    vec3 voidColor = vec3(0.005, 0.008, 0.006);
                    finalColor = mix(voidColor, finalColor, eventHorizonVoid);

                    // Apply left-side typography contrast preservation
                    finalColor = mix(finalColor * 0.35, finalColor, textVignette);

                    finalAlpha = clamp(
                        (1.0 - eventHorizonVoid) * 0.98 +
                        (totalPlasma * 1.25 + photonRing * 1.35 + photonCorona * 0.85 +
                         sparks * 1.25 + spaceGlow1 * 0.85 + spaceGlow2 * 0.45 + starField * 0.55) * eventHorizonVoid,
                        0.0, 1.0
                    );
                } else {
                    // Solar Light Theme (Paper #F2EFE6, Radiant Solar Vortex)
                    vec3 colSolarWhite  = vec3(1.0, 0.98, 0.95);
                    vec3 colSolarGold   = vec3(0.96, 0.62, 0.18);
                    vec3 colSolarAmber  = vec3(0.945, 0.353, 0.141);
                    vec3 colWarmSky     = vec3(0.88, 0.89, 0.86);

                    vec3 plasmaCol = mix(colWarmSky, colSolarAmber, clamp(totalPlasma * 0.85, 0.0, 1.0));
                    plasmaCol = mix(plasmaCol, colSolarGold, clamp(pow(totalPlasma, 1.5) * 0.85, 0.0, 1.0));
                    plasmaCol = mix(plasmaCol, colSolarWhite, clamp(pow(totalPlasma, 2.6) * 1.2, 0.0, 1.0));

                    finalColor += colWarmSky * spaceGlow2 * 0.35;
                    finalColor += colSolarAmber * spaceGlow1 * 0.40;
                    finalColor += plasmaCol * totalPlasma * 1.10;
                    finalColor += colSolarGold * sparks * 0.65 + colSolarWhite * sparks * 1.2;
                    finalColor += colSolarAmber * photonCorona * 0.75;
                    finalColor += colSolarWhite * (photonRing * 1.35 + photonSubRing * 0.65);

                    vec3 solarVoidColor = vec3(0.08, 0.09, 0.08);
                    finalColor = mix(solarVoidColor, finalColor, eventHorizonVoid);
                    finalColor = mix(finalColor * 0.45, finalColor, textVignette);

                    finalAlpha = clamp(
                        (1.0 - eventHorizonVoid) * 0.90 +
                        (totalPlasma * 0.95 + photonRing * 1.05 + spaceGlow1 * 0.55 + sparks * 0.95) * eventHorizonVoid,
                        0.0, 0.92
                    );
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
                uTilt: { value: new THREE.Vector2(0, 0) },
                uInteraction: { value: 0.0 },
            },
        });

        const planeGeometry = new THREE.PlaneGeometry(2, 2);
        const plane = new THREE.Mesh(planeGeometry, material);
        scene.add(plane);

        updateSize();
        window.addEventListener('resize', updateSize, { passive: true });

        // Physics-Based Mouse Tracking with Inertia & Spring Damping
        let targetMouseX = 0;
        let targetMouseY = 0;
        let currentMouseX = 0;
        let currentMouseY = 0;
        let mouseVelX = 0;
        let mouseVelY = 0;

        let targetTiltX = 0;
        let targetTiltY = 0;
        let currentTiltX = 0;
        let currentTiltY = 0;
        let tiltVelX = 0;
        let tiltVelY = 0;

        let interactionWeight = 0;
        let targetInteraction = 0;
        let lastMoveTimestamp = 0;

        const handleMouseMove = (e: MouseEvent) => {
            if (isOff) return;
            // Normalized screen coordinates [-1, 1]
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;

            // Clamped range so the composition remains centered and majestic
            targetMouseX = Math.max(-0.75, Math.min(0.75, x));
            targetMouseY = Math.max(-0.75, Math.min(0.75, y));

            targetInteraction = 1.0;
            lastMoveTimestamp = performance.now();
        };

        const handleMouseLeave = () => {
            targetMouseX = 0;
            targetMouseY = 0;
            targetInteraction = 0;
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
        window.addEventListener('blur', handleMouseLeave, { passive: true });

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
                // Smooth entrance reveal
                if (entranceProgress < 1.0) {
                    entranceProgress = Math.min(1.0, entranceProgress + delta * 0.95);
                    material.uniforms.uProgress.value = entranceProgress;
                }

                // If mouse hasn't moved for 2.2 seconds, smoothly decay interaction weight
                if (performance.now() - lastMoveTimestamp > 2200) {
                    targetInteraction = 0.0;
                    targetMouseX *= 0.98;
                    targetMouseY *= 0.98;
                }

                interactionWeight += (targetInteraction - interactionWeight) * 0.04;

                // Critically damped spring simulation for cursor position (giving black hole physical mass & inertia)
                const springK = 0.038;
                const friction = 0.82;
                mouseVelX += (targetMouseX - currentMouseX) * springK;
                mouseVelY += (targetMouseY - currentMouseY) * springK;
                mouseVelX *= friction;
                mouseVelY *= friction;
                currentMouseX += mouseVelX;
                currentMouseY += mouseVelY;

                // 3D Disk Tilt derived from mouse movement
                targetTiltX = currentMouseX * 0.55;
                targetTiltY = currentMouseY * 0.42;
                tiltVelX += (targetTiltX - currentTiltX) * 0.032;
                tiltVelY += (targetTiltY - currentTiltY) * 0.032;
                tiltVelX *= 0.85;
                tiltVelY *= 0.85;
                currentTiltX += tiltVelX;
                currentTiltY += tiltVelY;

                // Subtle autonomous cosmic precession (alive at all times, including mobile & idle)
                const autoDriftX = Math.sin(elapsedTime * 0.32) * 0.065;
                const autoDriftY = Math.cos(elapsedTime * 0.26) * 0.045;

                material.uniforms.uMouse.value.set(
                    currentMouseX + autoDriftX,
                    currentMouseY + autoDriftY
                );
                material.uniforms.uTilt.value.set(
                    currentTiltX + autoDriftX * 0.6,
                    currentTiltY + autoDriftY * 0.6
                );
                material.uniforms.uInteraction.value = interactionWeight;
                material.uniforms.uTime.value = elapsedTime;
            } else {
                // Reduced motion / Calm snapshot
                material.uniforms.uProgress.value = 1.0;
                material.uniforms.uTime.value = 15.0;
                material.uniforms.uMouse.value.set(0, 0);
                material.uniforms.uTilt.value.set(0, 0);
                material.uniforms.uInteraction.value = 0.0;
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
            window.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('blur', handleMouseLeave);
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
                            <radialGradient id="bhVoidGradient" cx="67%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#050806" />
                                <stop offset="30%" stopColor="#0B0E0B" />
                                <stop offset="42%" stopColor="#F15A24" stopOpacity="0.85" />
                                <stop offset="55%" stopColor="#173C32" stopOpacity="0.45" />
                                <stop offset="100%" stopColor="#171914" stopOpacity="0" />
                            </radialGradient>
                            <linearGradient id="bhDiskFlare" x1="15%" y1="50%" x2="100%" y2="50%">
                                <stop offset="0%" stopColor="#F15A24" stopOpacity="0" />
                                <stop offset="35%" stopColor="#F15A24" stopOpacity="0.75" />
                                <stop offset="65%" stopColor="#FFF2D6" stopOpacity="0.95" />
                                <stop offset="85%" stopColor="#F15A24" stopOpacity="0.7" />
                                <stop offset="100%" stopColor="#F15A24" stopOpacity="0" />
                            </linearGradient>
                            <filter id="bhBlurGlow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="12" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>
                        <rect width="1440" height="900" fill="url(#bhVoidGradient)" />
                        <ellipse cx="965" cy="450" rx="440" ry="145" transform="rotate(-12 965 450)" fill="url(#bhDiskFlare)" opacity="0.85" filter="url(#bhBlurGlow)" />
                        <ellipse cx="965" cy="430" rx="280" ry="90" fill="none" stroke="#F15A24" strokeWidth="5" opacity="0.6" />
                        <circle cx="965" cy="450" r="162" fill="#040604" />
                        <circle cx="965" cy="450" r="164" stroke="#FFF5E0" strokeWidth="2.5" opacity="0.98" />
                        <circle cx="965" cy="450" r="168" stroke="#F15A24" strokeWidth="5.5" opacity="0.85" />
                    </svg>
                </div>
            )}
        </div>
    );
}
