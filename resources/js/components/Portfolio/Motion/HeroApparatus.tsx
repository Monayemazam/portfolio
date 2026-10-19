import React, { useEffect, useRef, useState } from 'react';

interface HeroApparatusProps {
    isOff?: boolean;
}

export default function HeroApparatus({ isOff = false }: HeroApparatusProps) {
    const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
    const [angle, setAngle] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOff) return;

        let frameId: number;
        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            targetX = (e.clientX / innerWidth - 0.5) * 30;
            targetY = (e.clientY / innerHeight - 0.5) * 30;
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        const loop = () => {
            currentX += (targetX - currentX) * 0.08;
            currentY += (targetY - currentY) * 0.08;
            setMouseOffset({ x: currentX, y: currentY });
            setAngle((prev) => (prev + 0.15) % 360);
            frameId = requestAnimationFrame(loop);
        };

        loop();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(frameId);
        };
    }, [isOff]);

    return (
        <div
            ref={containerRef}
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-[340px] sm:w-[480px] md:w-[620px] lg:w-[720px] aspect-square select-none overflow-hidden opacity-90 transition-transform duration-100 ease-out"
            style={{
                transform: `translate3d(${mouseOffset.x}px, calc(-50% + ${mouseOffset.y}px), 0)`,
            }}
        >
            <svg
                viewBox="0 0 800 800"
                className="w-full h-full text-foreground/40 dark:text-foreground/30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Outermost index ring with degree ticks */}
                <circle
                    cx="400"
                    cy="400"
                    r="380"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 8"
                />
                <circle
                    cx="400"
                    cy="400"
                    r="340"
                    stroke="currentColor"
                    strokeWidth="1"
                />

                {/* Rotating Azimuth Scale */}
                <g
                    transform={`rotate(${angle} 400 400)`}
                    className="origin-center"
                >
                    <circle
                        cx="400"
                        cy="400"
                        r="290"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    />

                    {/* Degree marks */}
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
                        (deg) => (
                            <line
                                key={deg}
                                x1="400"
                                y1="100"
                                x2="400"
                                y2="120"
                                stroke="currentColor"
                                strokeWidth={deg % 90 === 0 ? "2" : "1"}
                                transform={`rotate(${deg} 400 400)`}
                            />
                        )
                    )}

                    {/* Cardinal markers */}
                    <text
                        x="400"
                        y="85"
                        fill="currentColor"
                        fontFamily="var(--font-mono)"
                        fontSize="12"
                        textAnchor="middle"
                        letterSpacing="0.1em"
                    >
                        N // 000°
                    </text>
                    <text
                        x="725"
                        y="405"
                        fill="currentColor"
                        fontFamily="var(--font-mono)"
                        fontSize="12"
                        textAnchor="middle"
                        letterSpacing="0.1em"
                    >
                        E // 090°
                    </text>
                    <text
                        x="400"
                        y="730"
                        fill="currentColor"
                        fontFamily="var(--font-mono)"
                        fontSize="12"
                        textAnchor="middle"
                        letterSpacing="0.1em"
                    >
                        S // 180°
                    </text>
                    <text
                        x="75"
                        y="405"
                        fill="currentColor"
                        fontFamily="var(--font-mono)"
                        fontSize="12"
                        textAnchor="middle"
                        letterSpacing="0.1em"
                    >
                        W // 270°
                    </text>

                    {/* Geometric Signal Orange Sector */}
                    <path
                        d="M 400 400 L 605 195 A 290 290 0 0 1 690 400 Z"
                        fill="var(--signal-orange)"
                        fillOpacity="0.15"
                        stroke="var(--signal-orange)"
                        strokeWidth="1.5"
                    />
                </g>

                {/* Counter-rotating inner technical orbital disc */}
                <g
                    transform={`rotate(${-angle * 1.5} 400 400)`}
                    className="origin-center"
                >
                    <circle
                        cx="400"
                        cy="400"
                        r="220"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeDasharray="2 6"
                    />

                    {/* Eccentric orbit circle */}
                    <circle
                        cx="450"
                        cy="400"
                        r="160"
                        stroke="var(--signal-orange)"
                        strokeWidth="1"
                        strokeOpacity="0.6"
                    />

                    {/* Orbital node point */}
                    <circle
                        cx="610"
                        cy="400"
                        r="5"
                        fill="var(--signal-orange)"
                    />
                    <circle
                        cx="290"
                        cy="400"
                        r="3"
                        fill="var(--acid-lime)"
                    />
                </g>

                {/* Static drafting crosshair & coordinate caliper */}
                <line
                    x1="400"
                    y1="40"
                    x2="400"
                    y2="760"
                    stroke="currentColor"
                    strokeWidth="0.75"
                    strokeDasharray="6 6"
                />
                <line
                    x1="40"
                    y1="400"
                    x2="760"
                    y2="400"
                    stroke="currentColor"
                    strokeWidth="0.75"
                    strokeDasharray="6 6"
                />

                {/* Center Core Plate */}
                <circle
                    cx="400"
                    cy="400"
                    r="80"
                    fill="var(--bg)"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <circle
                    cx="400"
                    cy="400"
                    r="60"
                    stroke="var(--signal-orange)"
                    strokeWidth="1.5"
                />
                <circle
                    cx="400"
                    cy="400"
                    r="12"
                    fill="var(--signal-orange)"
                />

                {/* Technical Dimension Label */}
                <rect
                    x="320"
                    y="388"
                    width="160"
                    height="24"
                    fill="var(--bg)"
                    stroke="var(--border)"
                    strokeWidth="1"
                />
                <text
                    x="400"
                    y="404"
                    fill="var(--text)"
                    fontFamily="var(--font-mono)"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    letterSpacing="0.12em"
                >
                    REF: 23°48'N 90°24'E
                </text>

                {/* Acid lime technical stamp */}
                <g transform="translate(480, 560)">
                    <rect
                        x="0"
                        y="0"
                        width="150"
                        height="30"
                        fill="var(--acid-lime)"
                        stroke="#171914"
                        strokeWidth="1.5"
                    />
                    <text
                        x="75"
                        y="19"
                        fill="#171914"
                        fontFamily="var(--font-mono)"
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="middle"
                        letterSpacing="0.1em"
                    >
                        ARCHITECTURAL CODE
                    </text>
                </g>
            </svg>
        </div>
    );
}
