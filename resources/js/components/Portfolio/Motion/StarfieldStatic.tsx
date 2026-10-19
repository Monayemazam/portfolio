import React from 'react';

interface StarfieldStaticProps {
    isDark?: boolean;
}

export default function StarfieldStatic({
    isDark = false,
}: StarfieldStaticProps) {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
            style={{
                backgroundColor: 'var(--bg)',
                backgroundImage: isDark
                    ? `radial-gradient(1px 1px at 30px 40px, rgba(242, 239, 230, 0.25), transparent 100%),
                       radial-gradient(1px 1px at 180px 220px, rgba(241, 90, 36, 0.3), transparent 100%),
                       radial-gradient(1px 1px at 340px 110px, rgba(213, 243, 74, 0.25), transparent 100%),
                       radial-gradient(1px 1px at 520px 380px, rgba(242, 239, 230, 0.2), transparent 100%)`
                    : `radial-gradient(1px 1px at 40px 40px, rgba(23, 25, 20, 0.08), transparent 100%),
                       radial-gradient(1px 1px at 200px 200px, rgba(241, 90, 36, 0.12), transparent 100%),
                       radial-gradient(1px 1px at 360px 120px, rgba(23, 25, 20, 0.06), transparent 100%),
                       radial-gradient(1px 1px at 540px 420px, rgba(23, 60, 50, 0.08), transparent 100%)`,
                backgroundSize: '400px 400px, 400px 400px, 400px 400px, 400px 400px',
            }}
        >
            {/* Subtle architectural grid lines */}
            <div
                className="absolute inset-0 opacity-40 dark:opacity-20"
                style={{
                    backgroundImage: `linear-gradient(to right, var(--border) 1px, transparent 1px),
                                      linear-gradient(to bottom, var(--border) 1px, transparent 1px)`,
                    backgroundSize: '120px 120px',
                }}
            />
        </div>
    );
}
