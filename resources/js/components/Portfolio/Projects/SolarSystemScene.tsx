import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowLeft, ArrowRight, StarFat } from '../Shared/Icons';
import { ProjectItem } from '@/types/portfolio';
import {
    createAmberTexture,
    createDesertTexture,
    createGenericTexture,
    createOceanTexture,
    createRingedTexture,
    createRingsTexture,
    createRockyTexture,
    createStationTexture,
} from './PlanetProcedural';

interface SolarSystemSceneProps {
    projects: ProjectItem[];
    onSelectProject: (project: ProjectItem, element?: HTMLElement) => void;
    activeProject: ProjectItem | null;
    isDark?: boolean;
    isOff?: boolean;
}

export default function SolarSystemScene({
    projects,
    onSelectProject,
    activeProject,
    isDark = true,
    isOff = false,
}: SolarSystemSceneProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    const activeProjectRef = useRef<ProjectItem | null>(activeProject);
    const hoveredIndexRef = useRef<number | null>(hoveredIndex);
    const focusedIndexRef = useRef<number | null>(focusedIndex);
    const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        activeProjectRef.current = activeProject;
    }, [activeProject]);

    useEffect(() => {
        hoveredIndexRef.current = hoveredIndex;
    }, [hoveredIndex]);

    useEffect(() => {
        focusedIndexRef.current = focusedIndex;
    }, [focusedIndex]);

    const targetCameraXRef = useRef<number>(0);
    const currentCameraXRef = useRef<number>(0);
    const targetCameraZRef = useRef<number>(155);
    const currentCameraZRef = useRef<number>(155);

    const PLANET_SPACING = 270;

    // Focus / hop to active project when opened or deep-linked
    useEffect(() => {
        if (!activeProject) {
            targetCameraZRef.current = 155;
            return;
        }
        const idx = projects.findIndex((p) => p.id === activeProject.id);
        if (idx >= 0) {
            targetCameraXRef.current = idx * PLANET_SPACING;
            targetCameraZRef.current = 75; // Fly-in closer for detail view
        }
    }, [activeProject, projects]);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas || projects.length === 0) return;

        let width = container.clientWidth;
        let height = container.clientHeight || 520;

        // Scene, Camera, Renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            50,
            width / height,
            0.1,
            2000,
        );
        camera.position.set(0, 0, currentCameraZRef.current);

        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

        // Shared Sun Light from top right (Design Guideline section 7)
        const sunLight = new THREE.DirectionalLight(
            0xfff7ed,
            isDark ? 2.2 : 2.6,
        );
        sunLight.position.set(350, 400, 350);
        scene.add(sunLight);

        const ambientLight = new THREE.AmbientLight(
            0xffffff,
            isDark ? 0.75 : 0.95,
        );
        scene.add(ambientLight);

        // Group holding all planets and orbits
        const solarGroup = new THREE.Group();
        scene.add(solarGroup);

        // Thin Orbit Line connecting planets in sequence
        const totalOrbitWidth = (projects.length - 1) * PLANET_SPACING;
        const linePoints: THREE.Vector3[] = [
            new THREE.Vector3(-140, 0, 0),
            new THREE.Vector3(totalOrbitWidth + 140, 0, 0),
        ];
        const orbitGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
        const orbitMat = new THREE.LineBasicMaterial({
            color: isDark ? 0x22d3ee : 0x0e7490,
            transparent: true,
            opacity: 0.35,
        });
        const orbitLine = new THREE.Line(orbitGeo, orbitMat);
        solarGroup.add(orbitLine);

        // Moving Photon / Light traveling along the orbit line
        const photonGeo = new THREE.SphereGeometry(3, 16, 16);
        const photonMat = new THREE.MeshBasicMaterial({
            color: 0x22d3ee,
            transparent: true,
            opacity: 0.95,
        });
        const photonMesh = new THREE.Mesh(photonGeo, photonMat);
        solarGroup.add(photonMesh);
        let photonProgress = 0;

        // Construct 3D Planet Meshes according to the 7 styles
        const planetMeshes: Array<{
            group: THREE.Group;
            body: THREE.Object3D;
            update: (time: number, isHovered: boolean, delta: number) => void;
            project: ProjectItem;
        }> = [];

        projects.forEach((proj, idx) => {
            const planetGroup = new THREE.Group();
            planetGroup.position.set(idx * PLANET_SPACING, 0, 0);

            // Size: featured 200px equivalent (radius 38), normal 140px equivalent (radius 27)
            const radius = proj.is_featured ? 38 : 27;
            const accentHex = proj.accent_color
                ? parseInt(proj.accent_color.replace('#', ''), 16)
                : isDark
                  ? 0x22d3ee
                  : 0x0e7490;

            let bodyMesh: THREE.Object3D;
            let updateFn: (
                time: number,
                isHovered: boolean,
                delta: number,
            ) => void;

            switch (proj.planet_style) {
                case 'rocky': {
                    // Cratered rock, silver-grey, fast spin 12s (2x on hover), comet trail
                    const geo = new THREE.SphereGeometry(radius, 36, 36);
                    const mat = new THREE.MeshStandardMaterial({
                        map: createRockyTexture(),
                        roughness: 0.85,
                        metalness: 0.15,
                    });
                    const sphere = new THREE.Mesh(geo, mat);
                    planetGroup.add(sphere);
                    bodyMesh = sphere;

                    // Comet particle trail
                    const trailCount = 35;
                    const trailGeo = new THREE.BufferGeometry();
                    const trailPos = new Float32Array(trailCount * 3);
                    for (let i = 0; i < trailCount * 3; i += 3) {
                        trailPos[i] = -radius - Math.random() * 45;
                        trailPos[i + 1] =
                            (Math.random() - 0.5) * (radius * 0.7);
                        trailPos[i + 2] =
                            (Math.random() - 0.5) * (radius * 0.7);
                    }
                    trailGeo.setAttribute(
                        'position',
                        new THREE.BufferAttribute(trailPos, 3),
                    );
                    const trailMat = new THREE.PointsMaterial({
                        color: 0xfef08a,
                        size: 2.5,
                        transparent: true,
                        opacity: 0.6,
                    });
                    const trail = new THREE.Points(trailGeo, trailMat);
                    planetGroup.add(trail);

                    updateFn = (_time, isHovered, delta) => {
                        const spinSpeed = isHovered
                            ? (Math.PI * 2) / 6
                            : (Math.PI * 2) / 12;
                        sphere.rotation.y += spinSpeed * delta;
                        trail.scale.x = isHovered ? 1.7 : 1.0;
                    };
                    break;
                }

                case 'station': {
                    // Torus station, 4 docking arms, blinking cyan lights, docking ship
                    const stationContainer = new THREE.Group();
                    const hubGeo = new THREE.SphereGeometry(
                        radius * 0.45,
                        24,
                        24,
                    );
                    const hubMat = new THREE.MeshStandardMaterial({
                        map: createStationTexture(),
                        roughness: 0.4,
                        metalness: 0.7,
                    });
                    const hub = new THREE.Mesh(hubGeo, hubMat);
                    stationContainer.add(hub);

                    // Outer Torus Ring
                    const ringGeo = new THREE.TorusGeometry(
                        radius * 1.35,
                        radius * 0.12,
                        16,
                        48,
                    );
                    const ringMat = new THREE.MeshStandardMaterial({
                        color: 0x0f172a,
                        roughness: 0.35,
                        metalness: 0.8,
                    });
                    const stationRing = new THREE.Mesh(ringGeo, ringMat);
                    stationRing.rotation.x = Math.PI * 0.45;
                    stationContainer.add(stationRing);

                    // 4 Docking Arms
                    for (let arm = 0; arm < 4; arm++) {
                        const armGeo = new THREE.CylinderGeometry(
                            radius * 0.05,
                            radius * 0.05,
                            radius * 1.35,
                        );
                        const armMat = new THREE.MeshStandardMaterial({
                            color: 0x38bdf8,
                            metalness: 0.6,
                        });
                        const armMesh = new THREE.Mesh(armGeo, armMat);
                        armMesh.rotation.z = (Math.PI / 2) * arm;
                        stationContainer.add(armMesh);
                    }

                    // Freight ship that docks on hover
                    const shipGeo = new THREE.ConeGeometry(
                        radius * 0.14,
                        radius * 0.35,
                        8,
                    );
                    const shipMat = new THREE.MeshBasicMaterial({
                        color: 0x22d3ee,
                    });
                    const freightShip = new THREE.Mesh(shipGeo, shipMat);
                    freightShip.position.set(radius * 2.2, 0, 0);
                    stationContainer.add(freightShip);

                    planetGroup.add(stationContainer);
                    bodyMesh = stationContainer;

                    updateFn = (time, isHovered, delta) => {
                        stationContainer.rotation.y +=
                            ((Math.PI * 2) / 40) * delta;
                        hubMat.emissive = new THREE.Color(
                            Math.sin(time * 3) > 0 ? 0x0e7490 : 0x0284c7,
                        );
                        hubMat.emissiveIntensity = 0.4;

                        // Docking ship glide
                        const targetShipX = isHovered
                            ? radius * 1.35
                            : radius * 2.3;
                        freightShip.position.x +=
                            (targetShipX - freightShip.position.x) * 0.08;
                    };
                    break;
                }

                case 'amber': {
                    // Warm amber, leather grain bump, golden stitch equator, slow drift, zoom on hover
                    const geo = new THREE.SphereGeometry(radius, 36, 36);
                    const mat = new THREE.MeshStandardMaterial({
                        map: createAmberTexture(),
                        roughness: 0.65,
                        metalness: 0.1,
                    });
                    const sphere = new THREE.Mesh(geo, mat);
                    planetGroup.add(sphere);

                    // Golden equator stitch ring
                    const stitchGeo = new THREE.TorusGeometry(
                        radius * 1.015,
                        1.2,
                        8,
                        54,
                    );
                    const stitchMat = new THREE.MeshBasicMaterial({
                        color: 0xfef08a,
                    });
                    const stitch = new THREE.Mesh(stitchGeo, stitchMat);
                    stitch.rotation.x = Math.PI / 2;
                    planetGroup.add(stitch);
                    bodyMesh = sphere;

                    updateFn = (_time, isHovered, delta) => {
                        sphere.rotation.y += ((Math.PI * 2) / 45) * delta;
                        const targetScale = isHovered ? 1.15 : 1.0;
                        sphere.scale.lerp(
                            new THREE.Vector3(
                                targetScale,
                                targetScale,
                                targetScale,
                            ),
                            0.08,
                        );
                    };
                    break;
                }

                case 'ringed': {
                    // Cream, sand, violet gas bands, two tilted rings, ring wobble, tilts on hover
                    const gasGeo = new THREE.SphereGeometry(radius, 36, 36);
                    const gasMat = new THREE.MeshStandardMaterial({
                        map: createRingedTexture(),
                        roughness: 0.9,
                    });
                    const sphere = new THREE.Mesh(gasGeo, gasMat);
                    planetGroup.add(sphere);

                    // Concentric Tilted Rings
                    const ringGeo = new THREE.RingGeometry(
                        radius * 1.35,
                        radius * 2.2,
                        64,
                    );
                    const ringMat = new THREE.MeshBasicMaterial({
                        map: createRingsTexture(),
                        side: THREE.DoubleSide,
                        transparent: true,
                        opacity: 0.85,
                    });
                    const rings = new THREE.Mesh(ringGeo, ringMat);
                    rings.rotation.x = Math.PI * 0.42;
                    rings.rotation.y = Math.PI * 0.12;
                    planetGroup.add(rings);
                    bodyMesh = sphere;

                    updateFn = (time, isHovered, delta) => {
                        sphere.rotation.y += ((Math.PI * 2) / 30) * delta;
                        // Ring wobble
                        rings.rotation.z = Math.sin(time * 0.8) * 0.08;
                        if (isHovered) {
                            rings.rotation.x = Math.PI * 0.35;
                        } else {
                            rings.rotation.x = Math.PI * 0.42;
                        }
                    };
                    break;
                }

                case 'ocean': {
                    // Deep ocean blue, lime green brand accent, starship sailing loop in 18s
                    const geo = new THREE.SphereGeometry(radius, 36, 36);
                    const mat = new THREE.MeshStandardMaterial({
                        map: createOceanTexture(),
                        roughness: 0.4,
                        metalness: 0.2,
                    });
                    const sphere = new THREE.Mesh(geo, mat);
                    planetGroup.add(sphere);

                    // Route line circling globe
                    const routeGeo = new THREE.BufferGeometry().setFromPoints(
                        new THREE.EllipseCurve(
                            0,
                            0,
                            radius * 1.12,
                            radius * 1.12,
                            0,
                            Math.PI * 2,
                            false,
                            0,
                        ).getPoints(64),
                    );
                    const routeMat = new THREE.LineBasicMaterial({
                        color: 0x84cc16, // Lime green from Sinbad brand
                        transparent: true,
                        opacity: 0.4,
                    });
                    const routeLine = new THREE.Line(routeGeo, routeMat);
                    routeLine.rotation.x = Math.PI / 2;
                    planetGroup.add(routeLine);

                    // Starship sailing along route
                    const shipGeo = new THREE.ConeGeometry(
                        radius * 0.12,
                        radius * 0.28,
                        6,
                    );
                    const shipMat = new THREE.MeshBasicMaterial({
                        color: 0x84cc16,
                    });
                    const starship = new THREE.Mesh(shipGeo, shipMat);
                    planetGroup.add(starship);
                    bodyMesh = sphere;

                    let shipAngle = 0;
                    updateFn = (_time, isHovered, delta) => {
                        sphere.rotation.y += ((Math.PI * 2) / 32) * delta;
                        if (!isHovered) {
                            shipAngle += ((Math.PI * 2) / 18) * delta;
                            starship.position.set(
                                Math.cos(shipAngle) * radius * 1.12,
                                0,
                                Math.sin(shipAngle) * radius * 1.12,
                            );
                            starship.rotation.y = -shipAngle + Math.PI / 2;
                        }
                    };
                    break;
                }

                case 'desert': {
                    // Red-orange with dark canyons, orbiting grey moon, splits open on hover
                    const upperGeo = new THREE.SphereGeometry(
                        radius,
                        36,
                        18,
                        0,
                        Math.PI * 2,
                        0,
                        Math.PI / 2,
                    );
                    const lowerGeo = new THREE.SphereGeometry(
                        radius,
                        36,
                        18,
                        0,
                        Math.PI * 2,
                        Math.PI / 2,
                        Math.PI / 2,
                    );
                    const mat = new THREE.MeshStandardMaterial({
                        map: createDesertTexture(),
                        roughness: 0.8,
                    });
                    const upperHalf = new THREE.Mesh(upperGeo, mat);
                    const lowerHalf = new THREE.Mesh(lowerGeo, mat);
                    planetGroup.add(upperHalf);
                    planetGroup.add(lowerHalf);

                    // Glowing screenshot / data core inside
                    const coreGeo = new THREE.SphereGeometry(
                        radius * 0.65,
                        24,
                        24,
                    );
                    const coreMat = new THREE.MeshStandardMaterial({
                        color: 0xf97316,
                        emissive: 0xf97316,
                        emissiveIntensity: 0.8,
                    });
                    const core = new THREE.Mesh(coreGeo, coreMat);
                    planetGroup.add(core);

                    // Orbiting Grey Moon (15s orbit loop)
                    const moonGeo = new THREE.SphereGeometry(
                        radius * 0.26,
                        16,
                        16,
                    );
                    const moonMat = new THREE.MeshStandardMaterial({
                        color: 0x94a3b8,
                        roughness: 0.9,
                    });
                    const moon = new THREE.Mesh(moonGeo, moonMat);
                    planetGroup.add(moon);
                    bodyMesh = upperHalf;

                    let moonAngle = 0;
                    updateFn = (_time, isHovered, delta) => {
                        upperHalf.rotation.y += ((Math.PI * 2) / 28) * delta;
                        lowerHalf.rotation.y += ((Math.PI * 2) / 28) * delta;

                        // Orbiting moon
                        moonAngle += ((Math.PI * 2) / 15) * delta;
                        moon.position.set(
                            Math.cos(moonAngle) * radius * 1.9,
                            Math.sin(moonAngle) * radius * 0.6,
                            Math.sin(moonAngle) * radius * 1.9,
                        );

                        // Hemispheres split open on hover
                        const targetSplitY = isHovered ? 12 : 0;
                        upperHalf.position.y +=
                            (targetSplitY - upperHalf.position.y) * 0.1;
                        lowerHalf.position.y +=
                            (-targetSplitY - lowerHalf.position.y) * 0.1;
                    };
                    break;
                }

                case 'generic':
                default: {
                    // Smooth sphere tinted with accent color, soft atmosphere glow, scale on hover
                    const geo = new THREE.SphereGeometry(radius, 36, 36);
                    const mat = new THREE.MeshStandardMaterial({
                        map: createGenericTexture(
                            proj.accent_color || '#22d3ee',
                        ),
                        roughness: 0.6,
                        metalness: 0.1,
                    });
                    const sphere = new THREE.Mesh(geo, mat);
                    planetGroup.add(sphere);

                    // Soft atmosphere glow ring
                    const atmoGeo = new THREE.RingGeometry(
                        radius * 1.05,
                        radius * 1.25,
                        48,
                    );
                    const atmoMat = new THREE.MeshBasicMaterial({
                        color: accentHex,
                        side: THREE.DoubleSide,
                        transparent: true,
                        opacity: 0.35,
                    });
                    const atmo = new THREE.Mesh(atmoGeo, atmoMat);
                    planetGroup.add(atmo);
                    bodyMesh = sphere;

                    updateFn = (_time, isHovered, delta) => {
                        sphere.rotation.y += ((Math.PI * 2) / 25) * delta;
                        atmo.lookAt(camera.position);
                        const targetScale = isHovered ? 1.1 : 1.0;
                        sphere.scale.lerp(
                            new THREE.Vector3(
                                targetScale,
                                targetScale,
                                targetScale,
                            ),
                            0.1,
                        );
                        atmoMat.opacity = isHovered ? 0.7 : 0.35;
                    };
                    break;
                }
            }

            solarGroup.add(planetGroup);
            planetMeshes.push({
                group: planetGroup,
                body: bodyMesh,
                update: updateFn,
                project: proj,
            });
        });

        // Pointer Drag & Navigation Controls
        let isDragging = false;
        let dragStartX = 0;
        let dragStartCamX = 0;

        const handlePointerDown = (e: PointerEvent) => {
            isDragging = true;
            dragStartX = e.clientX;
            dragStartCamX = targetCameraXRef.current;
        };

        const handlePointerMove = (e: PointerEvent) => {
            if (isDragging) {
                const diff = (e.clientX - dragStartX) * 0.75;
                targetCameraXRef.current = Math.max(
                    -60,
                    Math.min(
                        (projects.length - 1) * PLANET_SPACING + 60,
                        dragStartCamX - diff,
                    ),
                );
            }

            // Raycasting for planet hover
            const rect = canvas.getBoundingClientRect();
            const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);

            let hitIndex: number | null = null;
            for (let i = 0; i < planetMeshes.length; i++) {
                const meshObj = planetMeshes[i];
                if (!meshObj) continue;
                const intersects = raycaster.intersectObjects(
                    meshObj.group.children,
                    true,
                );
                if (intersects.length > 0) {
                    hitIndex = i;
                    break;
                }
            }

            setHoveredIndex(hitIndex);
            canvas.style.cursor = hitIndex !== null ? 'pointer' : 'grab';
        };

        const handlePointerUp = (e: PointerEvent) => {
            const dragDistance = Math.abs(e.clientX - dragStartX);
            isDragging = false;

            // Only trigger click selection if user didn't drag
            if (dragDistance < 6) {
                const rect = canvas.getBoundingClientRect();
                const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

                const raycaster = new THREE.Raycaster();
                raycaster.setFromCamera(
                    new THREE.Vector2(mouseX, mouseY),
                    camera,
                );

                for (let i = 0; i < planetMeshes.length; i++) {
                    const meshObj = planetMeshes[i];
                    if (!meshObj) continue;
                    const intersects = raycaster.intersectObjects(
                        meshObj.group.children,
                        true,
                    );
                    if (intersects.length > 0) {
                        targetCameraXRef.current = i * PLANET_SPACING;
                        targetCameraZRef.current = 75; // Zoom in
                        onSelectProject(meshObj.project);
                        break;
                    }
                }
            }
        };

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const delta =
                Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            targetCameraXRef.current = Math.max(
                -60,
                Math.min(
                    (projects.length - 1) * PLANET_SPACING + 60,
                    targetCameraXRef.current + delta * 0.8,
                ),
            );
        };

        canvas.addEventListener('pointerdown', handlePointerDown);
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        canvas.addEventListener('wheel', handleWheel, { passive: false });

        // Resize observer
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const cr = entry.contentRect;
                if (cr.width > 0 && cr.height > 0) {
                    width = cr.width;
                    height = cr.height;
                    camera.aspect = width / height;
                    camera.updateProjectionMatrix();
                    renderer.setSize(width, height);
                }
            }
        });
        resizeObserver.observe(container);

        // Animation Loop
        let animationFrameId: number;
        let lastTime = performance.now();

        const animate = (now: number) => {
            const delta = Math.min(0.05, (now - lastTime) / 1000);
            lastTime = now;

            // Smooth camera lerp
            currentCameraXRef.current +=
                (targetCameraXRef.current - currentCameraXRef.current) * 0.08;
            currentCameraZRef.current +=
                (targetCameraZRef.current - currentCameraZRef.current) * 0.08;
            camera.position.x = currentCameraXRef.current;
            camera.position.z = currentCameraZRef.current;

            // Update moving photon along orbit
            photonProgress = (photonProgress + delta * 0.12) % 1.0;
            const photonX = -140 + photonProgress * (totalOrbitWidth + 280);
            photonMesh.position.set(photonX, 0, 0);

            // Update individual planet motions and direct DOM labels
            planetMeshes.forEach((pMesh, i) => {
                const isHovered =
                    hoveredIndexRef.current === i ||
                    focusedIndexRef.current === i;
                pMesh.update(now / 1000, isHovered, delta);

                // Dim / blur inactive planets when detail panel is active
                if (activeProjectRef.current) {
                    const isActive =
                        pMesh.project.id === activeProjectRef.current.id;
                    pMesh.group.position.y = isActive ? 0 : -8;
                } else {
                    pMesh.group.position.y = 0;
                }

                // Project 3D planet positions to 2D screen coordinates for accessible labels
                const tempVec = new THREE.Vector3();
                pMesh.group.getWorldPosition(tempVec);
                tempVec.y -= pMesh.project.is_featured ? 44 : 33; // Place label beneath planet sphere
                tempVec.project(camera);

                const screenX = ((tempVec.x + 1) / 2) * width;
                const screenY = ((-tempVec.y + 1) / 2) * height;
                const visible =
                    tempVec.z < 1 && screenX >= -140 && screenX <= width + 140;

                const labelEl = labelRefs.current[i];
                if (labelEl) {
                    labelEl.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) translate(-50%, 0)`;
                    labelEl.style.display = visible ? 'flex' : 'none';
                }
            });

            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
            canvas.removeEventListener('pointerdown', handlePointerDown);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            canvas.removeEventListener('wheel', handleWheel);

            renderer.dispose();
            scene.traverse((obj) => {
                if (
                    obj instanceof THREE.Mesh ||
                    obj instanceof THREE.Points ||
                    obj instanceof THREE.Line
                ) {
                    obj.geometry.dispose();
                    if (Array.isArray(obj.material)) {
                        obj.material.forEach((m) => m.dispose());
                    } else {
                        obj.material.dispose();
                    }
                }
            });
        };
    }, [projects, isDark, isOff]);

    const activeIndex = Math.round(targetCameraXRef.current / PLANET_SPACING);

    const handleJumpToPlanet = (index: number) => {
        const target = Math.max(0, Math.min(projects.length - 1, index));
        targetCameraXRef.current = target * PLANET_SPACING;
    };

    return (
        <div
            ref={containerRef}
            className="relative flex h-[540px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--bg-elevated)]/40 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-md select-none sm:h-[580px]"
            tabIndex={0}
            role="region"
            aria-label="Interactive 3D Solar System Fly-through. Use Arrow keys to navigate planets."
            onKeyDown={(e) => {
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    handleJumpToPlanet(activeIndex + 1);
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    handleJumpToPlanet(activeIndex - 1);
                }
            }}
        >
            {/* Top Navigation Bar: Telemetry Instructions & Prev/Next Arrow Buttons */}
            <div className="pointer-events-none absolute top-4 right-4 left-4 z-20 flex items-center justify-between">
                <div className="flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-3.5 py-1 font-mono text-[11px] text-[var(--secondary)] uppercase backdrop-blur-md">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--secondary)]" />
                    <span>FLY-THROUGH / DRAG OR SCROLL</span>
                </div>

                <div className="pointer-events-auto flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => handleJumpToPlanet(activeIndex - 1)}
                        disabled={activeIndex <= 0}
                        aria-label="Previous Planet"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text-muted)] transition-all hover:border-[var(--secondary)] hover:text-[var(--secondary)] focus-visible:ring-2 focus-visible:ring-[var(--secondary)] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-30"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                        {Math.max(
                            1,
                            Math.min(projects.length, activeIndex + 1),
                        )}{' '}
                        / {projects.length}
                    </span>
                    <button
                        type="button"
                        onClick={() => handleJumpToPlanet(activeIndex + 1)}
                        disabled={activeIndex >= projects.length - 1}
                        aria-label="Next Planet"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text-muted)] transition-all hover:border-[var(--secondary)] hover:text-[var(--secondary)] focus-visible:ring-2 focus-visible:ring-[var(--secondary)] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-30"
                    >
                        <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            {/* Three.js WebGL Canvas */}
            <canvas ref={canvasRef} className="h-full w-full touch-none" />

            {/* Projected Accessible 2D Labels under each Planet */}
            {projects.map((project, idx) => {
                const isHovered = hoveredIndex === idx;
                const isFocused = focusedIndex === idx;
                const isActive = isHovered || isFocused;

                const firstTags = (project.tags || [])
                    .slice(0, 2)
                    .map((t) => t.name)
                    .join(' • ');

                return (
                    <div
                        key={project.id}
                        ref={(el) => {
                            labelRefs.current[idx] = el;
                        }}
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            display: 'none',
                            willChange: 'transform',
                        }}
                        className="pointer-events-auto z-10"
                    >
                        <button
                            type="button"
                            onClick={(e) => {
                                targetCameraXRef.current = idx * PLANET_SPACING;
                                targetCameraZRef.current = 75;
                                onSelectProject(project, e.currentTarget);
                            }}
                            onFocus={() => setFocusedIndex(idx)}
                            onBlur={() => setFocusedIndex(null)}
                            onMouseEnter={() => setHoveredIndex(idx)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            aria-label={`Open mission briefing for ${project.title}`}
                            className={`group flex flex-col items-center rounded-xl border px-3.5 py-1.5 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[var(--secondary)] focus-visible:outline-none ${
                                isActive
                                    ? 'scale-105 border-[var(--secondary)] bg-[var(--surface)] shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                                    : 'border-[var(--surface-border)]/60 bg-[var(--surface)]/80 hover:border-[var(--secondary)]'
                            }`}
                        >
                            {/* Project Name (Display Font) */}
                            <div className="flex items-center gap-1.5">
                                <span className="font-display text-sm font-bold tracking-wide text-[var(--text)] group-hover:text-[var(--secondary)] sm:text-base">
                                    {project.title}
                                </span>
                                {project.is_featured && (
                                    <StarFat className="h-3 w-3 text-[var(--accent)]" />
                                )}
                            </div>

                            {/* Sub-label (Year & Tags in Mono Font) */}
                            <div className="font-mono text-[10px] text-[var(--text-muted)] group-hover:text-[var(--text)]">
                                {project.year ? `${project.year} ` : ''}
                                {firstTags ? `• ${firstTags}` : ''}
                            </div>
                        </button>
                    </div>
                );
            })}

            {/* Bottom Status Telemetry Line */}
            <div className="pointer-events-none absolute right-6 bottom-3 left-6 z-20 flex items-center justify-between border-t border-[var(--surface-border)]/50 pt-2 font-mono text-[10px] text-[var(--text-muted)]">
                <span>ORBITAL TRAJECTORY / ALIGNED</span>
                <span className="text-[var(--secondary)]">
                    ★ CLICK OR PRESS ENTER TO DOCK
                </span>
            </div>
        </div>
    );
}
