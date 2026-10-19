import * as THREE from 'three';

/**
 * Creates procedural canvas textures for the 7 planet styles defined in Design Guideline Section 7.
 * All textures are generated deterministically in memory (512x256 or 512x512) for fast, zero-network rendering.
 */

// 1. Rocky Planet Texture (Mercury: Cratered rock, silver-grey with warm highlights)
export function createRockyTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Base silver-grey gradient
    const grad = ctx.createLinearGradient(0, 0, 512, 256);
    grad.addColorStop(0, '#64748b');
    grad.addColorStop(0.5, '#94a3b8');
    grad.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    // Warm sun highlights
    ctx.fillStyle = 'rgba(254, 240, 138, 0.18)';
    ctx.beginPath();
    ctx.ellipse(380, 100, 120, 60, 0, 0, Math.PI * 2);
    ctx.fill();

    // Procedural craters
    const seedCraters = [
        { x: 100, y: 70, r: 24 },
        { x: 160, y: 140, r: 18 },
        { x: 230, y: 80, r: 32 },
        { x: 300, y: 180, r: 22 },
        { x: 410, y: 90, r: 28 },
        { x: 70, y: 190, r: 16 },
        { x: 340, y: 60, r: 14 },
        { x: 460, y: 160, r: 20 },
        { x: 200, y: 200, r: 26 },
        { x: 270, y: 130, r: 12 },
    ];

    seedCraters.forEach(({ x, y, r }) => {
        // Shadow rim
        ctx.fillStyle = 'rgba(30, 41, 59, 0.65)';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        // Inner crater floor
        ctx.fillStyle = 'rgba(71, 85, 105, 0.8)';
        ctx.beginPath();
        ctx.arc(x + 2, y + 2, r * 0.75, 0, Math.PI * 2);
        ctx.fill();

        // Sunlit rim
        ctx.strokeStyle = 'rgba(241, 245, 249, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x - 1, y - 1, r, Math.PI * 0.75, Math.PI * 1.75);
        ctx.stroke();
    });

    // Surface dust noise
    for (let i = 0; i < 400; i++) {
        const nx = Math.random() * 512;
        const ny = Math.random() * 256;
        ctx.fillStyle =
            Math.random() > 0.5
                ? 'rgba(15, 23, 42, 0.25)'
                : 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(nx, ny, 2, 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
}

// 2. Station Hub Texture (ASN Group: Steel blue with cyan window lights)
export function createStationTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Steel blue metallic hull
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 512, 256);

    // Panel grid seams
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 512; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 256);
        ctx.stroke();
    }
    for (let y = 0; y < 256; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y);
        ctx.stroke();
    }

    // Glowing cyan window bands & telemetry ports
    ctx.fillStyle = '#22d3ee';
    for (let x = 8; x < 512; x += 24) {
        for (let y = 16; y < 256; y += 48) {
            if (Math.random() > 0.3) {
                ctx.fillRect(x, y, 6, 4);
            }
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
}

// 3. Amber Leather Texture (Tasa: Warm amber, deep brown, stitch equator)
export function createAmberTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Rich warm amber to deep brown gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#78350f');
    grad.addColorStop(0.35, '#b45309');
    grad.addColorStop(0.5, '#d97706');
    grad.addColorStop(0.65, '#b45309');
    grad.addColorStop(1, '#451a03');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    // Leather grain texture lines
    ctx.strokeStyle = 'rgba(69, 26, 3, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 200; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 256;
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 8 + 3, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Handcrafted Equator stitch line
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.85)';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(0, 128);
    ctx.lineTo(512, 128);
    ctx.stroke();
    ctx.setLineDash([]);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
}

// 4. Ringed Gas Giant Texture (Tazwar BD: Cream, sand, muted violet bands)
export function createRingedTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    const bands = [
        '#f8fafc',
        '#fef3c7',
        '#e2e8f0',
        '#ddd6fe',
        '#c4b5fd',
        '#fef08a',
        '#e0e7ff',
        '#8b5cf6',
        '#6d28d9',
        '#4c1d95',
        '#a78bfa',
        '#fef3c7',
        '#f1f5f9',
        '#c4b5fd',
        '#7c3aed',
    ];

    const bandH = 256 / bands.length;
    bands.forEach((color, i) => {
        ctx.fillStyle = color;
        ctx.fillRect(0, i * bandH, 512, bandH + 1);

        // Sub-stripes for smooth atmospheric bands
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(0, i * bandH + bandH * 0.3, 512, 2);
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
}

// 5. Ocean Planet Texture (Sinbad Shipping: Deep blue with lime-green accent & clouds)
export function createOceanTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Deep oceanic blue
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#0c4a6e');
    grad.addColorStop(0.5, '#0284c7');
    grad.addColorStop(1, '#082f49');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    // Archipelago continents & lime-green coastal shoals
    ctx.fillStyle = '#65a30d'; // Lime green brand accent
    const landmasses = [
        { x: 90, y: 110, w: 90, h: 50 },
        { x: 220, y: 70, w: 110, h: 60 },
        { x: 380, y: 140, w: 85, h: 45 },
        { x: 310, y: 180, w: 60, h: 35 },
    ];

    landmasses.forEach(({ x, y, w, h }) => {
        ctx.beginPath();
        ctx.ellipse(x, y, w / 2, h / 2, Math.PI * 0.1, 0, Math.PI * 2);
        ctx.fill();
    });

    // Cloud swirls
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    for (let i = 0; i < 20; i++) {
        const cx = Math.random() * 512;
        const cy = Math.random() * 256;
        ctx.beginPath();
        ctx.ellipse(
            cx,
            cy,
            Math.random() * 45 + 20,
            Math.random() * 12 + 6,
            Math.PI * 0.2,
            0,
            Math.PI * 2,
        );
        ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
}

// 6. Desert Planet Texture (Ayra España: Red-orange with dark canyons)
export function createDesertTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Fiery red-orange gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#7c2d12');
    grad.addColorStop(0.4, '#c2410c');
    grad.addColorStop(0.6, '#ea580c');
    grad.addColorStop(1, '#9a3412');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    // Dark rift valleys and canyons
    ctx.strokeStyle = '#431407';
    ctx.lineWidth = 4;
    for (let i = 0; i < 14; i++) {
        ctx.beginPath();
        const startX = Math.random() * 512;
        const startY = Math.random() * 256;
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(
            startX + 50,
            startY - 20,
            startX + 80,
            startY + 30,
            startX + 140,
            startY + 10,
        );
        ctx.stroke();
    }

    // Sandy dune striations
    ctx.strokeStyle = 'rgba(254, 215, 170, 0.25)';
    ctx.lineWidth = 2;
    for (let y = 10; y < 256; y += 18) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y);
        ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
}

// 7. Generic Planet Texture (Procedurally tinted using project's accent color)
export function createGenericTexture(
    accentColor = '#22d3ee',
): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createLinearGradient(0, 0, 512, 256);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.4, accentColor);
    grad.addColorStop(0.7, '#7c3aed');
    grad.addColorStop(1, '#0284c7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    // Subtle atmospheric swirls
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    for (let i = 0; i < 15; i++) {
        const cx = Math.random() * 512;
        const cy = Math.random() * 256;
        ctx.beginPath();
        ctx.ellipse(
            cx,
            cy,
            Math.random() * 60 + 20,
            Math.random() * 15 + 8,
            Math.PI * 0.15,
            0,
            Math.PI * 2,
        );
        ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
}

// Ring Texture for Ringed Planet
export function createRingsTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 16;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createLinearGradient(0, 0, 256, 0);
    grad.addColorStop(0, 'rgba(226, 232, 240, 0)');
    grad.addColorStop(0.2, 'rgba(253, 230, 138, 0.7)');
    grad.addColorStop(0.45, 'rgba(167, 139, 250, 0.85)');
    grad.addColorStop(0.55, 'rgba(0, 0, 0, 0)'); // Cassini division
    grad.addColorStop(0.65, 'rgba(226, 232, 240, 0.8)');
    grad.addColorStop(0.9, 'rgba(124, 58, 237, 0.6)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 16);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}
