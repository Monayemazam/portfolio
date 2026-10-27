import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface SpaceTimeWindowProps {
    isOff?: boolean;
    isDark?: boolean;
    className?: string;
}

export default function SpaceTimeWindow({
    isOff = false,
    isDark = true,
    className = '',
}: SpaceTimeWindowProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [webglSupported, setWebglSupported] = useState(true);

    // Smooth pointer tracking reference with inertia
    const mouseRef = useRef({
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
    });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Check WebGL availability
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

        let animationFrameId: number;
        let isVisible = true;
        const clock = new THREE.Clock();

        let width = container.clientWidth || 480;
        let height = container.clientHeight || 480;

        // 1. Scene, Camera, High-Precision WebGL Renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            34,
            width / height,
            0.1,
            100,
        );
        // Position camera to view the complete dimensional aperture unclipped at an authoritative 3/4 angle
        camera.position.set(0, 0, 10.6);

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = isDark ? 1.35 : 1.15;
        container.appendChild(renderer.domElement);

        // Resource disposal tracking
        const geometriesToDispose: THREE.BufferGeometry[] = [];
        const materialsToDispose: THREE.Material[] = [];

        // Exact Design Tokens from app.css & Design Guideline
        const orangeColor = new THREE.Color(0xf15a24); // --primary (burnt/signal orange)
        const forestColor = new THREE.Color(0x173c32); // --forest (deep emerald forest)
        const limeColor = new THREE.Color(0xd5f34a);   // --accent (acid lime)
        const warmWhite = new THREE.Color(0xf2efe6);   // --text / paper
        const voidDark = new THREE.Color(0x080a08);    // Event horizon core void
        const voidLight = new THREE.Color(0x171914);   // Event horizon core in light mode (--ink)

        // 2. Coordinated Directional Lighting ("One Sun" Principle from Design Guideline)
        // Key Sun Light from top-right
        const keySunLight = new THREE.DirectionalLight(
            0xfff5eb,
            isDark ? 4.6 : 3.4,
        );
        keySunLight.position.set(6.5, 7.5, 7.0);
        scene.add(keySunLight);

        // Warm Burnt-Orange Caustic Grazing Light
        const orangeGrazingLight = new THREE.DirectionalLight(
            0xf15a24,
            isDark ? 3.2 : 2.2,
        );
        orangeGrazingLight.position.set(5.5, -3.5, 5.0);
        scene.add(orangeGrazingLight);

        // Deep Emerald Volumetric Fill from bottom-left
        const emeraldFillLight = new THREE.DirectionalLight(
            0x173c32,
            isDark ? 3.6 : 2.0,
        );
        emeraldFillLight.position.set(-7.0, -6.0, 3.5);
        scene.add(emeraldFillLight);

        // Soft Ambient Light
        const ambientLight = new THREE.AmbientLight(
            isDark ? 0x111a14 : 0xece6d8,
            isDark ? 0.95 : 1.25,
        );
        scene.add(ambientLight);

        // Internal Caustic Point Light located at the throat of the void
        const throatLight = new THREE.PointLight(
            0xf15a24,
            isDark ? 4.2 : 2.8,
            6.5,
        );
        throatLight.position.set(0.3, 0.2, -0.8);
        scene.add(throatLight);

        // 3. Master Window Group (Holds all dimensional structures)
        const windowGroup = new THREE.Group();
        // Initial majestic perspective tilt: reveals the depth of the void & warped saddle
        windowGroup.rotation.set(0.24, -0.22, 0.08);
        scene.add(windowGroup);

        // =========================================================================
        // 4. THE WARPED MANIFOLD (Sculpted Curved Energy Surface / Gravitational Aperture)
        // =========================================================================
        const radialSegments = 54;
        const angularSegments = 108;
        const rMin = 0.78; // Edge of the central event void
        const rMax = 2.65; // Outer boundary of the sculpted aperture

        const manifoldGeo = new THREE.BufferGeometry();
        const vertexCount = (radialSegments + 1) * (angularSegments + 1);
        const positions = new Float32Array(vertexCount * 3);
        const normals = new Float32Array(vertexCount * 3);
        const uvs = new Float32Array(vertexCount * 2);
        const colors = new Float32Array(vertexCount * 3);

        // Compute vertex positions following the relativistic space-time curvature equation
        const evaluateSurface = (r: number, theta: number, timeVal: number = 0) => {
            const normalizedR = (r - rMin) / (rMax - rMin); // 0 to 1

            // Gravitational funnel drop into negative z
            const funnelDepth = -1.62 / Math.pow(1.0 + (r - rMin) * 1.85, 1.15);

            // Sculpted harmonic wave distortion: creates the architectural saddle fold
            const wave1 =
                0.28 * Math.cos(2 * theta - 0.35 + timeVal * 0.2) * Math.pow(normalizedR, 0.9);
            const wave2 =
                0.12 * Math.sin(3 * theta + 0.5) * Math.pow(normalizedR, 1.4);

            const z = funnelDepth + wave1 + wave2;
            const x = r * Math.cos(theta);
            const y = r * Math.sin(theta);

            return new THREE.Vector3(x, y, z);
        };

        // Populate initial geometry buffer
        let vIndex = 0;
        let uvIndex = 0;
        for (let i = 0; i <= radialSegments; i++) {
            const r = rMin + (i / radialSegments) * (rMax - rMin);
            const normalizedR = i / radialSegments;

            for (let j = 0; j <= angularSegments; j++) {
                const theta = (j / angularSegments) * Math.PI * 2;
                const pos = evaluateSurface(r, theta, 0);

                const i3 = vIndex * 3;
                positions[i3] = pos.x;
                positions[i3 + 1] = pos.y;
                positions[i3 + 2] = pos.z;

                uvs[uvIndex] = normalizedR;
                uvs[uvIndex + 1] = j / angularSegments;

                // Color gradient along the dimensional fold
                // Inner rim is illuminated with caustic warmth, mid-funnel has emerald depth
                let c = isDark
                    ? new THREE.Color(0x131a15)
                    : new THREE.Color(0xede8dc);

                if (normalizedR < 0.18) {
                    // Caustic photon sphere proximity
                    c = isDark
                        ? new THREE.Color(0x4a2412)
                        : new THREE.Color(0xd9cdb8);
                } else if (normalizedR < 0.6) {
                    // Emerald depth
                    c = isDark
                        ? new THREE.Color(0x12241d)
                        : new THREE.Color(0xe0ded2);
                }

                colors[i3] = c.r;
                colors[i3 + 1] = c.g;
                colors[i3 + 2] = c.b;

                vIndex++;
                uvIndex += 2;
            }
        }

        // Indices for manifold grid quads
        const indices: number[] = [];
        for (let i = 0; i < radialSegments; i++) {
            for (let j = 0; j < angularSegments; j++) {
                const a = i * (angularSegments + 1) + j;
                const b = (i + 1) * (angularSegments + 1) + j;
                const c = (i + 1) * (angularSegments + 1) + (j + 1);
                const d = i * (angularSegments + 1) + (j + 1);

                indices.push(a, b, d);
                indices.push(b, c, d);
            }
        }

        manifoldGeo.setAttribute(
            'position',
            new THREE.BufferAttribute(positions, 3),
        );
        manifoldGeo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
        manifoldGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        manifoldGeo.setIndex(indices);
        manifoldGeo.computeVertexNormals();
        geometriesToDispose.push(manifoldGeo);

        // Translucent Crystalline Smoked Glass / Sculpted Alabaster Material
        const manifoldMat = new THREE.MeshPhysicalMaterial({
            vertexColors: true,
            roughness: isDark ? 0.22 : 0.28,
            metalness: isDark ? 0.42 : 0.2,
            transmission: isDark ? 0.32 : 0.15,
            ior: 1.54,
            reflectivity: 0.88,
            clearcoat: 1.0,
            clearcoatRoughness: 0.12,
            transparent: true,
            opacity: isDark ? 0.94 : 0.96,
            side: THREE.DoubleSide,
            flatShading: false,
        });
        materialsToDispose.push(manifoldMat);

        const manifoldMesh = new THREE.Mesh(manifoldGeo, manifoldMat);
        windowGroup.add(manifoldMesh);

        // =========================================================================
        // 5. CONCENTRIC GEODESIC CONTOURS (Curved Energy Ribbons around the Void)
        // =========================================================================
        // Instead of flat rings, these 3D ribbons follow the exact curvature of the manifold!
        const contourRadii = [0.92, 1.22, 1.58, 1.98, 2.34, 2.64];
        const contourMeshes: {
            line: THREE.Line;
            radius: number;
            baseMat: THREE.LineBasicMaterial;
        }[] = [];

        contourRadii.forEach((r, idx) => {
            const curvePoints: THREE.Vector3[] = [];
            const segments = 120;

            for (let j = 0; j <= segments; j++) {
                const theta = (j / segments) * Math.PI * 2;
                const pt = evaluateSurface(r, theta, 0);
                // Slight offset above the surface to prevent z-fighting
                pt.z += 0.022;
                curvePoints.push(pt);
            }

            const contourGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
            geometriesToDispose.push(contourGeo);

            // Inner contour is the brilliant burnt-orange Photon Sphere
            const isPhotonSphere = idx === 0;
            const isOuterRim = idx === contourRadii.length - 1;
            const isAccent = idx === 2;

            const contourMat = new THREE.LineBasicMaterial({
                color: isPhotonSphere
                    ? orangeColor
                    : isAccent
                    ? limeColor
                    : isDark
                    ? idx % 2 === 0
                        ? orangeColor
                        : forestColor
                    : idx % 2 === 0
                    ? orangeColor
                    : new THREE.Color(0x173c32),
                transparent: true,
                opacity: isPhotonSphere
                    ? 0.95
                    : isAccent
                    ? 0.85
                    : isDark
                    ? isOuterRim
                        ? 0.65
                        : 0.5
                    : 0.6,
                linewidth: isPhotonSphere ? 2.5 : 1.2,
            });
            materialsToDispose.push(contourMat);

            const contourLine = new THREE.Line(contourGeo, contourMat);
            windowGroup.add(contourLine);

            contourMeshes.push({
                line: contourLine,
                radius: r,
                baseMat: contourMat,
            });
        });

        // =========================================================================
        // 6. CURVED GEODESIC MERIDIANS (Structural Spines converging into the Void)
        // =========================================================================
        // 8 curved spines along the gravitational slope of the window
        const meridianAngles = [
            0,
            Math.PI * 0.25,
            Math.PI * 0.5,
            Math.PI * 0.75,
            Math.PI,
            Math.PI * 1.25,
            Math.PI * 1.5,
            Math.PI * 1.75,
        ];

        meridianAngles.forEach((angle, mIdx) => {
            const meridianPoints: THREE.Vector3[] = [];
            const rSteps = 40;

            for (let s = 0; s <= rSteps; s++) {
                const r = rMin + (s / rSteps) * (rMax - rMin);
                const pt = evaluateSurface(r, angle, 0);
                pt.z += 0.025;
                meridianPoints.push(pt);
            }

            const mGeo = new THREE.BufferGeometry().setFromPoints(meridianPoints);
            geometriesToDispose.push(mGeo);

            const isKeySpine = mIdx === 1 || mIdx === 5; // Top-right and bottom-left diagonals
            const mMat = new THREE.LineBasicMaterial({
                color: isKeySpine ? orangeColor : forestColor,
                transparent: true,
                opacity: isKeySpine ? 0.75 : isDark ? 0.35 : 0.25,
                linewidth: 1.0,
            });
            materialsToDispose.push(mMat);

            const mLine = new THREE.Line(mGeo, mMat);
            windowGroup.add(mLine);
        });

        // =========================================================================
        // 7. THE CENTRAL DIMENSIONAL VOID & RELATIVISTIC LENSING CAUSTIC RING
        // =========================================================================
        // Core Event Horizon Sphere: Absorbs all light in the dimensional center
        const voidGeo = new THREE.SphereGeometry(rMin * 0.98, 36, 36);
        geometriesToDispose.push(voidGeo);
        const voidMat = new THREE.MeshBasicMaterial({
            color: isDark ? voidDark : voidLight,
        });
        materialsToDispose.push(voidMat);

        const voidMesh = new THREE.Mesh(voidGeo, voidMat);
        voidMesh.position.set(0, 0, -1.68);
        windowGroup.add(voidMesh);

        // Gravitational Lensing Caustic Halo (Light bending around the void edge)
        const lensingHaloGeo = new THREE.RingGeometry(rMin * 0.98, rMin * 1.1, 64);
        geometriesToDispose.push(lensingHaloGeo);
        const lensingHaloMat = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec2 vUv;
                uniform vec3 haloColor;
                uniform vec3 accentColor;
                uniform float time;
                void main() {
                    // Angular asymmetric brightness (One Sun from top-right)
                    vec2 centered = vUv - vec2(0.5);
                    float angle = atan(centered.y, centered.x);
                    float sunFacing = max(0.0, dot(normalize(centered), normalize(vec2(0.7, 0.7))));
                    
                    float pulse = 0.8 + 0.2 * sin(time * 2.0 + angle * 2.0);
                    vec3 col = mix(haloColor, accentColor, sunFacing * 0.6);
                    float alpha = (0.55 + 0.45 * sunFacing) * pulse;
                    gl_FragColor = vec4(col, alpha);
                }
            `,
            uniforms: {
                haloColor: { value: orangeColor },
                accentColor: { value: limeColor },
                time: { value: 0 },
            },
            transparent: true,
            blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
            side: THREE.DoubleSide,
            depthWrite: false,
        });
        materialsToDispose.push(lensingHaloMat);

        const lensingHalo = new THREE.Mesh(lensingHaloGeo, lensingHaloMat);
        lensingHalo.position.set(0, 0, -1.6);
        windowGroup.add(lensingHalo);

        // =========================================================================
        // 8. TRAVELLING CAUSTIC PHOTON PACKETS (Gliding along the inner photon ring)
        // =========================================================================
        const photonCount = 3;
        const photonMeshes: THREE.Mesh[] = [];
        const photonGeo = new THREE.SphereGeometry(0.055, 12, 12);
        geometriesToDispose.push(photonGeo);

        const photonMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.95,
        });
        materialsToDispose.push(photonMat);

        for (let p = 0; p < photonCount; p++) {
            const photon = new THREE.Mesh(photonGeo, photonMat);
            windowGroup.add(photon);
            photonMeshes.push(photon);
        }

        // =========================================================================
        // 9. FINE SPATIAL STARDUST PARTICLES (14 Depth Markers caught in the Field)
        // =========================================================================
        const particleCount = 14;
        const particleGeo = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        const particleColors = new Float32Array(particleCount * 3);
        const particleData: {
            angle: number;
            radius: number;
            speed: number;
            baseZ: number;
        }[] = [];

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const r = 0.95 + Math.random() * 1.9;
            const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
            const z = -1.0 + Math.random() * 2.5;

            particlePositions[i3] = r * Math.cos(angle);
            particlePositions[i3 + 1] = r * Math.sin(angle);
            particlePositions[i3 + 2] = z;

            const roll = i % 3;
            let c = warmWhite;
            if (roll === 1) c = orangeColor;
            else if (roll === 2) c = limeColor;

            particleColors[i3] = c.r;
            particleColors[i3 + 1] = c.g;
            particleColors[i3 + 2] = c.b;

            particleData.push({
                angle,
                radius: r,
                speed: 0.15 + (i % 4) * 0.08,
                baseZ: z,
            });
        }

        particleGeo.setAttribute(
            'position',
            new THREE.BufferAttribute(particlePositions, 3),
        );
        particleGeo.setAttribute(
            'color',
            new THREE.BufferAttribute(particleColors, 3),
        );
        geometriesToDispose.push(particleGeo);

        const particleMat = new THREE.PointsMaterial({
            size: 0.09,
            vertexColors: true,
            transparent: true,
            opacity: isDark ? 0.85 : 0.65,
        });
        materialsToDispose.push(particleMat);

        const particlePoints = new THREE.Points(particleGeo, particleMat);
        windowGroup.add(particlePoints);

        // =========================================================================
        // 10. ARCHITECTURAL DATUM MARKS (Outer Frame Precision Alignment Ticks)
        // =========================================================================
        const tickAngles = [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5];
        const tickMaterial = new THREE.LineBasicMaterial({
            color: orangeColor,
            transparent: true,
            opacity: isDark ? 0.75 : 0.5,
            linewidth: 1.5,
        });
        materialsToDispose.push(tickMaterial);

        tickAngles.forEach((angle) => {
            const rInner = rMax - 0.12;
            const rOuter = rMax + 0.15;
            const p1 = evaluateSurface(rInner, angle, 0);
            const p2 = evaluateSurface(rOuter, angle, 0);
            p1.z += 0.03;
            p2.z += 0.03;

            const tickGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
            geometriesToDispose.push(tickGeo);
            const tickLine = new THREE.Line(tickGeo, tickMaterial);
            windowGroup.add(tickLine);
        });

        // =========================================================================
        // 11. INTERACTION & LIFECYCLE LISTENERS
        // =========================================================================
        const handleResize = () => {
            if (!container) return;
            width = container.clientWidth || 480;
            height = container.clientHeight || 480;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };
        window.addEventListener('resize', handleResize, { passive: true });

        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisible = entry.isIntersecting;
            },
            { threshold: 0.05 },
        );
        observer.observe(container);

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Clamped pointer coordinates (-1 to 1)
            const dx = (e.clientX - centerX) / (window.innerWidth * 0.45);
            const dy = (e.clientY - centerY) / (window.innerHeight * 0.45);

            mouseRef.current.targetX = Math.max(-1, Math.min(1, dx));
            mouseRef.current.targetY = Math.max(-1, Math.min(1, dy));
        };

        const handleMouseLeave = () => {
            mouseRef.current.targetX = 0;
            mouseRef.current.targetY = 0;
        };

        window.addEventListener('mousemove', handleMouseMove, {
            passive: true,
        });
        document.addEventListener('mouseleave', handleMouseLeave);

        // Entrance animation interpolation
        let entranceProgress = isOff ? 1 : 0;
        const entranceSpeed = 1.35;

        // Default authoritative beauty showcase orientation
        const defaultRotX = 0.24;
        const defaultRotY = -0.22;
        const defaultRotZ = 0.08;

        // =========================================================================
        // 12. ANIMATION LOOP (Coordinated, Fluid, Performance-Capped)
        // =========================================================================
        const animate = () => {
            if (!isVisible && !isOff) {
                animationFrameId = requestAnimationFrame(animate);
                return;
            }

            const delta = clock.getDelta();
            const elapsedTime = clock.getElapsedTime();

            // Smooth pointer tracking interpolation
            mouseRef.current.x +=
                (mouseRef.current.targetX - mouseRef.current.x) * 0.045;
            mouseRef.current.y +=
                (mouseRef.current.targetY - mouseRef.current.y) * 0.045;

            // Entrance reveal sequence
            if (entranceProgress < 1 && !isOff) {
                entranceProgress = Math.min(
                    1,
                    entranceProgress + delta * entranceSpeed,
                );
            }
            const easeEntrance =
                entranceProgress === 1
                    ? 1
                    : 1 - Math.pow(1 - entranceProgress, 3);

            if (!isOff) {
                // Coordinated ambient motion: gentle breathing undulation of space-time
                const breathSlow = Math.sin(elapsedTime * 0.4) * 0.04;
                const breathTiltX = Math.cos(elapsedTime * 0.35) * 0.025;
                const breathTiltY = Math.sin(elapsedTime * 0.3) * 0.035;

                // Parallax response: mouse gently rotates perspective
                const mouseRotX = mouseRef.current.y * -0.16;
                const mouseRotY = mouseRef.current.x * 0.22;

                windowGroup.rotation.x =
                    defaultRotX + breathTiltX + mouseRotX;
                windowGroup.rotation.y =
                    defaultRotY + breathTiltY + mouseRotY;
                windowGroup.rotation.z = defaultRotZ + breathSlow * 0.5;

                // Subtle depth scale on entrance
                const scaleVal = 0.94 + 0.06 * easeEntrance;
                windowGroup.scale.set(scaleVal, scaleVal, scaleVal);

                // Update Lensing Halo time uniform
                lensingHaloMat.uniforms.time.value = elapsedTime;

                // Update Throat Light pulse
                const pulse = 0.88 + Math.sin(elapsedTime * 2.2) * 0.12;
                throatLight.intensity = (isDark ? 4.2 : 2.8) * pulse;

                // Travelling Caustic Photon Packets around the inner rim
                const innerRadius = 0.95;
                photonMeshes.forEach((photon, pIdx) => {
                    const phase = pIdx * ((Math.PI * 2) / photonCount);
                    const pAngle = elapsedTime * 0.65 + phase;
                    const pt = evaluateSurface(innerRadius, pAngle, 0);
                    photon.position.set(pt.x, pt.y, pt.z + 0.035);
                    const photonPulse = 0.6 + 0.4 * Math.sin(elapsedTime * 3.0 + pIdx);
                    (photon.material as THREE.MeshBasicMaterial).opacity =
                        (isDark ? 0.95 : 0.8) * photonPulse;
                });

                // Stardust Drift in the dimensional field
                const pPosAttr = particleGeo.getAttribute(
                    'position',
                ) as THREE.BufferAttribute;
                if (pPosAttr) {
                    for (let i = 0; i < particleCount; i++) {
                        const i3 = i * 3;
                        const data = particleData[i];
                        data.angle += delta * data.speed * 0.3;

                        const curR =
                            data.radius +
                            Math.sin(elapsedTime * 0.8 + i) * 0.08;
                        const curZ =
                            data.baseZ +
                            Math.cos(elapsedTime * 0.6 + i * 1.5) * 0.1;

                        pPosAttr.setXYZ(
                            i,
                            curR * Math.cos(data.angle),
                            curR * Math.sin(data.angle),
                            curZ,
                        );
                    }
                    pPosAttr.needsUpdate = true;
                }
            } else {
                // Pristine static render at ideal architectural beauty angle
                windowGroup.rotation.set(defaultRotX, defaultRotY, defaultRotZ);
                windowGroup.scale.set(1, 1, 1);
            }

            renderer.render(scene, camera);

            if (!isOff) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        if (isOff) {
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
    }, [isDark, isOff]);

    // High-Fidelity Architectural SVG Fallback
    if (!webglSupported) {
        return (
            <div
                className={`relative flex items-center justify-center ${className}`}
                aria-label="The Space-Time Window — Dimensional Aperture Fallback"
            >
                <svg
                    viewBox="0 0 500 500"
                    className="h-full w-full"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <radialGradient
                            id="voidGrad"
                            cx="50%"
                            cy="50%"
                            r="50%"
                        >
                            <stop offset="0%" stopColor="#080a08" />
                            <stop offset="85%" stopColor="#0e1310" />
                            <stop offset="100%" stopColor="#f15a24" />
                        </radialGradient>
                        <linearGradient
                            id="manifoldGrad"
                            x1="20%"
                            y1="10%"
                            x2="80%"
                            y2="90%"
                        >
                            <stop offset="0%" stopColor="#173c32" stopOpacity="0.8" />
                            <stop offset="50%" stopColor="#131d17" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#f15a24" stopOpacity="0.4" />
                        </linearGradient>
                    </defs>

                    {/* Outer Aperture Manifold Saddle Contour */}
                    <path
                        d="M250,50 C380,50 450,150 450,250 C450,380 350,450 250,450 C120,450 50,350 50,250 C50,120 150,50 250,50 Z"
                        fill="url(#manifoldGrad)"
                        stroke="#f15a24"
                        strokeWidth="1.5"
                        strokeOpacity="0.6"
                    />

                    {/* Concentric Warped Geodesic Contours */}
                    <ellipse
                        cx="250"
                        cy="250"
                        rx="160"
                        ry="140"
                        stroke="#173c32"
                        strokeWidth="1.2"
                        strokeOpacity="0.7"
                        transform="rotate(-15 250 250)"
                    />
                    <ellipse
                        cx="250"
                        cy="250"
                        rx="120"
                        ry="105"
                        stroke="#f15a24"
                        strokeWidth="1.5"
                        strokeOpacity="0.8"
                        transform="rotate(-12 250 250)"
                    />
                    <ellipse
                        cx="250"
                        cy="250"
                        rx="80"
                        ry="70"
                        stroke="#d5f34a"
                        strokeWidth="1.2"
                        strokeOpacity="0.9"
                        transform="rotate(-8 250 250)"
                    />

                    {/* Central Event Horizon Void */}
                    <circle
                        cx="250"
                        cy="250"
                        r="55"
                        fill="url(#voidGrad)"
                        stroke="#f15a24"
                        strokeWidth="2.5"
                    />

                    {/* Architectural Datum Ticks */}
                    <line x1="250" y1="35" x2="250" y2="65" stroke="#f15a24" strokeWidth="2" />
                    <line x1="250" y1="435" x2="250" y2="465" stroke="#f15a24" strokeWidth="2" />
                    <line x1="35" y1="250" x2="65" y2="250" stroke="#f15a24" strokeWidth="2" />
                    <line x1="435" y1="250" x2="465" y2="250" stroke="#f15a24" strokeWidth="2" />
                </svg>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            aria-label="The Space-Time Window — Dimensional Deep Space Artwork"
            className={`pointer-events-auto relative flex items-center justify-center transition-transform duration-700 ease-out select-none ${className}`}
            style={{ willChange: 'transform' }}
        >
            {/* Subtle, Directional Atmospheric Depth Aura (Restrained & Architectural) */}
            <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-[-6%] rounded-full bg-[var(--forest)] ${
                    isDark ? 'opacity-20' : 'opacity-6'
                } blur-[65px] transition-opacity duration-1000`}
            />
            <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-[18%] rounded-full bg-[var(--primary)] ${
                    isDark ? 'opacity-10' : 'opacity-4'
                } blur-[45px] transition-opacity duration-1000`}
            />
        </div>
    );
}
