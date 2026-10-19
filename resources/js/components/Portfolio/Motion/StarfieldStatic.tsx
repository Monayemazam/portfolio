import React from 'react';

interface StarfieldStaticProps {
    isDark?: boolean;
}

export default function StarfieldStatic({
    isDark = true,
}: StarfieldStaticProps) {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
            style={{
                backgroundColor: 'var(--bg)',
                backgroundImage: isDark
                    ? `radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)),
                       radial-gradient(1.5px 1.5px at 100px 150px, #ffffff, rgba(0,0,0,0)),
                       radial-gradient(1px 1px at 240px 80px, #ffffff, rgba(0,0,0,0)),
                       radial-gradient(2px 2px at 320px 220px, var(--secondary), rgba(0,0,0,0)),
                       radial-gradient(1px 1px at 450px 120px, #ffffff, rgba(0,0,0,0)),
                       radial-gradient(1.5px 1.5px at 580px 290px, var(--primary), rgba(0,0,0,0)),
                       radial-gradient(circle at 80% 20%, rgba(124, 58, 237, 0.08) 0%, transparent 40%),
                       radial-gradient(circle at 20% 80%, rgba(34, 211, 238, 0.05) 0%, transparent 50%)`
                    : `radial-gradient(1.5px 1.5px at 40px 60px, var(--star), rgba(0,0,0,0)),
                       radial-gradient(1.5px 1.5px at 160px 180px, var(--star), rgba(0,0,0,0)),
                       radial-gradient(2px 2px at 280px 100px, var(--secondary), rgba(0,0,0,0)),
                       radial-gradient(1.5px 1.5px at 420px 240px, var(--star), rgba(0,0,0,0)),
                       radial-gradient(circle at 85% 15%, rgba(109, 40, 217, 0.06) 0%, transparent 45%)`,
                backgroundSize:
                    '650px 650px, 650px 650px, 650px 650px, 650px 650px, 650px 650px, 650px 650px, 100% 100%, 100% 100%',
            }}
        />
    );
}
