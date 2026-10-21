import { SkillItem } from '@/types/portfolio';

export interface ConstellationNode extends SkillItem {
    x: number;
    y: number;
    labelAnchor: 'left' | 'right' | 'top' | 'bottom';
    isLeader: boolean;
    starDesignation: string;
}

export interface ConstellationEdge {
    id: string;
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    category: string;
    isHighway?: boolean;
}

export interface SectorMeta {
    category: string;
    sectorCode: string;
    celestialName: string;
    coordinates: string;
    centerX: number;
    centerY: number;
    accentVar: string;
}

const GREEK_DESIGNATIONS = [
    'Alpha',
    'Beta',
    'Gamma',
    'Delta',
    'Epsilon',
    'Zeta',
    'Eta',
    'Theta',
    'Iota',
    'Kappa',
];

const SECTOR_DEFAULTS: Record<
    string,
    {
        sectorCode: string;
        celestialName: string;
        coordinates: string;
        centerX: number;
        centerY: number;
        accentVar: string;
    }
> = {
    Backend: {
        sectorCode: 'SEC-ALPHA',
        celestialName: 'ORION ARCHITECTURE',
        coordinates: 'RA 05h 35m // DEC +09°56′',
        centerX: 240,
        centerY: 310,
        accentVar: 'var(--signal-orange)',
    },
    Frontend: {
        sectorCode: 'SEC-BETA',
        celestialName: 'CYGNUS INTERFACE',
        coordinates: 'RA 20h 42m // DEC +45°16′',
        centerX: 600,
        centerY: 290,
        accentVar: 'var(--acid-lime)',
    },
    Platforms: {
        sectorCode: 'SEC-GAMMA',
        celestialName: 'PEGASUS DELIVERY',
        coordinates: 'RA 22h 57m // DEC +20°46′',
        centerX: 960,
        centerY: 330,
        accentVar: 'var(--sand)',
    },
};

/**
 * Computes deterministic celestial layout for any set of CMS-managed skills.
 */
export function buildConstellationGraph(
    skills: SkillItem[],
    categories: string[],
): {
    nodes: ConstellationNode[];
    edges: ConstellationEdge[];
    sectors: SectorMeta[];
} {
    const publishedSkills = skills.filter((s) => s.is_published);
    const nodes: ConstellationNode[] = [];
    const edges: ConstellationEdge[] = [];
    const sectors: SectorMeta[] = [];

    // Group skills by category
    const grouped: Record<string, SkillItem[]> = {};
    categories.forEach((cat) => {
        grouped[cat] = [];
    });
    publishedSkills.forEach((skill) => {
        const cat = skill.category || 'Core';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(skill);
    });

    const isDefaultSeed =
        categories.length === 3 &&
        categories.includes('Backend') &&
        categories.includes('Frontend') &&
        categories.includes('Platforms') &&
        publishedSkills.length === 10;

    // Build Sector Metas
    categories.forEach((cat, idx) => {
        const def = SECTOR_DEFAULTS[cat];
        if (def && isDefaultSeed) {
            sectors.push({
                category: cat,
                ...def,
            });
        } else {
            const step = 1000 / (categories.length + 1);
            const cx = 100 + (idx + 1) * step;
            const cy = idx % 2 === 0 ? 290 : 340;
            const roman = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'EPSILON'][idx] || `SECTOR-${idx + 1}`;
            sectors.push({
                category: cat,
                sectorCode: `SEC-${roman}`,
                celestialName: `${cat.toUpperCase()} VECTOR`,
                coordinates: `RA ${((idx * 4 + 5) % 24).toString().padStart(2, '0')}h // DEC +${(idx * 15 + 10)}°`,
                centerX: Math.round(cx),
                centerY: Math.round(cy),
                accentVar: idx % 2 === 0 ? 'var(--signal-orange)' : 'var(--acid-lime)',
            });
        }
    });

    // Default Seed Coordinates
    const defaultCoords: Record<string, { x: number; y: number; anchor: 'left' | 'right' }> = {
        Laravel: { x: 230, y: 170, anchor: 'right' },
        PHP: { x: 130, y: 320, anchor: 'right' },
        MySQL: { x: 330, y: 440, anchor: 'right' },
        'Vue.js': { x: 520, y: 160, anchor: 'right' },
        React: { x: 720, y: 210, anchor: 'right' },
        TypeScript: { x: 480, y: 380, anchor: 'right' },
        'UI/UX design': { x: 690, y: 470, anchor: 'right' },
        WordPress: { x: 930, y: 170, anchor: 'right' },
        Ecommerce: { x: 1060, y: 330, anchor: 'left' },
        GitHub: { x: 880, y: 470, anchor: 'right' },
    };

    // Build Nodes
    sectors.forEach((sec) => {
        const catSkills = grouped[sec.category] || [];
        const count = catSkills.length;

        catSkills.forEach((skill, sIdx) => {
            let x = sec.centerX;
            let y = sec.centerY;
            let anchor: 'left' | 'right' = 'right';

            if (isDefaultSeed && defaultCoords[skill.name]) {
                x = defaultCoords[skill.name].x;
                y = defaultCoords[skill.name].y;
                anchor = defaultCoords[skill.name].anchor;
            } else {
                // Procedural celestial orbit placement for custom CMS skills
                const angle = (sIdx / Math.max(count, 1)) * Math.PI * 2 - Math.PI / 2;
                const radiusX = Math.min(130, 70 + count * 15);
                const radiusY = Math.min(120, 60 + count * 12);
                x = Math.round(sec.centerX + Math.cos(angle) * radiusX);
                y = Math.round(sec.centerY + Math.sin(angle) * radiusY);
                anchor = Math.cos(angle) >= 0 ? 'right' : 'left';
            }

            const isLeader = skill.level >= 90 || sIdx === 0;
            const starDesignation =
                GREEK_DESIGNATIONS[sIdx] || `Star-${sIdx + 1}`;

            nodes.push({
                ...skill,
                x,
                y,
                labelAnchor: anchor,
                isLeader,
                starDesignation,
            });
        });
    });

    // Build Intra-Constellation Edges
    sectors.forEach((sec) => {
        const catNodes = nodes.filter((n) => n.category === sec.category);
        const count = catNodes.length;

        if (count === 2) {
            edges.push({
                id: `edge-${catNodes[0].id}-${catNodes[1].id}`,
                fromX: catNodes[0].x,
                fromY: catNodes[0].y,
                toX: catNodes[1].x,
                toY: catNodes[1].y,
                category: sec.category,
            });
        } else if (count >= 3) {
            // Connect in cyclic chain
            for (let i = 0; i < count; i++) {
                const current = catNodes[i];
                const next = catNodes[(i + 1) % count];
                edges.push({
                    id: `edge-${current.id}-${next.id}`,
                    fromX: current.x,
                    fromY: current.y,
                    toX: next.x,
                    toY: next.y,
                    category: sec.category,
                });
            }

            // Cross struts for constellations with 4 or more stars
            if (count === 4) {
                edges.push({
                    id: `edge-${catNodes[0].id}-${catNodes[2].id}`,
                    fromX: catNodes[0].x,
                    fromY: catNodes[0].y,
                    toX: catNodes[2].x,
                    toY: catNodes[2].y,
                    category: sec.category,
                });
                edges.push({
                    id: `edge-${catNodes[1].id}-${catNodes[3].id}`,
                    fromX: catNodes[1].x,
                    fromY: catNodes[1].y,
                    toX: catNodes[3].x,
                    toY: catNodes[3].y,
                    category: sec.category,
                });
            }
        }
    });

    // Inter-Constellation Highways (Connecting adjacent constellations in ALL view)
    if (sectors.length >= 2) {
        for (let i = 0; i < sectors.length - 1; i++) {
            const currentSecNodes = nodes.filter(
                (n) => n.category === sectors[i].category,
            );
            const nextSecNodes = nodes.filter(
                (n) => n.category === sectors[i + 1].category,
            );

            if (currentSecNodes.length > 0 && nextSecNodes.length > 0) {
                // Connect highest level skills across adjacent sectors
                const n1 = currentSecNodes[0];
                const n2 = nextSecNodes[0];
                edges.push({
                    id: `highway-${n1.id}-${n2.id}`,
                    fromX: n1.x,
                    fromY: n1.y,
                    toX: n2.x,
                    toY: n2.y,
                    category: 'ALL',
                    isHighway: true,
                });

                // Secondary bottom highway if available
                if (currentSecNodes.length > 1 && nextSecNodes.length > 1) {
                    const b1 = currentSecNodes[currentSecNodes.length - 1];
                    const b2 = nextSecNodes[nextSecNodes.length - 1];
                    edges.push({
                        id: `highway-${b1.id}-${b2.id}`,
                        fromX: b1.x,
                        fromY: b1.y,
                        toX: b2.x,
                        toY: b2.y,
                        category: 'ALL',
                        isHighway: true,
                    });
                }
            }
        }
    }

    return { nodes, edges, sectors };
}
