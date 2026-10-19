import React, { Suspense, useEffect, useState } from 'react';
import { AnimationLevel } from '@/hooks/use-motion-level';
import StarfieldStatic from './StarfieldStatic';
import StarfieldCanvas2D from './StarfieldCanvas2D';

const Starfield3D = React.lazy(() => import('./Starfield3D'));

interface StarfieldContainerProps {
    effectiveLevel: AnimationLevel;
    isDark?: boolean;
}

export default function StarfieldContainer({
    effectiveLevel,
    isDark = true,
}: StarfieldContainerProps) {
    // Ensure 3D loads strictly AFTER first paint to safeguard the initial JavaScript budget
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsMounted(true);
        }, 50);
        return () => clearTimeout(timer);
    }, []);

    if (effectiveLevel === 'off') {
        return <StarfieldStatic isDark={isDark} />;
    }

    if (effectiveLevel === 'light') {
        return <StarfieldCanvas2D isDark={isDark} />;
    }

    // Full 3D mode
    return (
        <>
            <StarfieldStatic isDark={isDark} />
            {isMounted && (
                <Suspense fallback={null}>
                    <Starfield3D isDark={isDark} />
                </Suspense>
            )}
        </>
    );
}
