import React from 'react';
import CelestialBackground from './CelestialBackground';

interface StarfieldContainerProps {
    effectiveLevel?: string;
    isDark?: boolean;
}

export default function StarfieldContainer({
    effectiveLevel,
    isDark = true,
}: StarfieldContainerProps) {
    const isReduced = effectiveLevel === 'off';
    return <CelestialBackground isDark={isDark} isReducedMotion={isReduced} />;
}
