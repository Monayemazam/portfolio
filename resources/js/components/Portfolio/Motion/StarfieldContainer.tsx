import React from 'react';
import StarfieldStatic from './StarfieldStatic';

interface StarfieldContainerProps {
    effectiveLevel?: string;
    isDark?: boolean;
}

export default function StarfieldContainer({
    isDark = true,
}: StarfieldContainerProps) {
    return <StarfieldStatic isDark={isDark} />;
}
