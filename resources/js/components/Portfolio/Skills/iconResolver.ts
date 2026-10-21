import React from 'react';
import * as LineIcons from 'lineicons-react';

const iconMap = LineIcons as unknown as Record<
    string,
    React.ComponentType<{ className?: string }>
>;

/**
 * Normalised mapping from database Lineicon names to lineicons-react export names.
 */
const ICON_ALIASES: Record<string, string> = {
    database: 'Database2',
    'code-alt': 'Code1',
    code: 'Code1',
    layout: 'Layout9',
    cart: 'Cart1',
    'github-original': 'Github',
    github: 'Github',
    vuejs: 'Vuejs',
    vue: 'Vuejs',
    react: 'React',
    laravel: 'Laravel',
    php: 'Php',
    wordpress: 'Wordpress',
    server: 'Globe1',
    'cloud-network': 'Cloud2',
    'stats-up': 'BarChart4',
    website: 'Globe1',
    brush: 'Brush2',
    pen: 'Pencil1',
    video: 'CameraMovie1',
    bullhorn: 'TowerBroadcast1',
    facebook: 'Facebook',
};

export function resolveSkillIcon(
    iconName?: string | null,
): React.ComponentType<{ className?: string }> | null {
    if (!iconName) return null;

    // 1. Direct match on exact name
    if (iconMap[iconName]) return iconMap[iconName];

    // 2. Clean prefix
    const clean = iconName.replace(/^lni[- ]/i, '').toLowerCase().trim();

    // 3. Known alias
    if (ICON_ALIASES[clean] && iconMap[ICON_ALIASES[clean]]) {
        return iconMap[ICON_ALIASES[clean]];
    }

    // 4. PascalCase conversion
    const pascal = clean
        .split(/[-_ ]/)
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join('');

    if (iconMap[pascal]) return iconMap[pascal];
    if (iconMap[`Lni${pascal}`]) return iconMap[`Lni${pascal}`];

    // 5. Case-insensitive key lookup
    const matchKey = Object.keys(iconMap).find(
        (k) => k.toLowerCase() === clean || k.toLowerCase() === `lni${clean}`,
    );
    if (matchKey && iconMap[matchKey]) return iconMap[matchKey];

    return null;
}
