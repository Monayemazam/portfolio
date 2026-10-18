import React from 'react';

interface SectionHeadingProps {
    eyebrow?: string | null;
    title?: string | null;
    subtitle?: string | null;
    highlightWord?: string | null;
    align?: 'left' | 'center';
    className?: string;
}

export default function SectionHeading({
    eyebrow,
    title,
    subtitle,
    highlightWord,
    align = 'left',
    className = '',
}: SectionHeadingProps) {
    if (!eyebrow && !title && !subtitle) {
        return null;
    }

    const alignmentClass =
        align === 'center'
            ? 'text-center items-center mx-auto'
            : 'text-left items-start';

    // Highlight one keyword with text-gradient
    const renderTitleWithHighlight = () => {
        if (!title) return null;
        if (!highlightWord) return title;

        const parts = title.split(new RegExp(`(${highlightWord})`, 'gi'));
        return parts.map((part, index) => {
            if (part.toLowerCase() === highlightWord.toLowerCase()) {
                return (
                    <span
                        key={index}
                        className="text-gradient inline-block font-extrabold"
                    >
                        {part}
                    </span>
                );
            }
            return <React.Fragment key={index}>{part}</React.Fragment>;
        });
    };

    return (
        <div
            className={`mb-12 flex flex-col md:mb-16 ${alignmentClass} ${className}`}
        >
            {eyebrow && (
                <div className="mb-3 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--secondary)]" />
                    <span className="font-mono text-xs font-medium tracking-[0.14em] text-[var(--secondary)] uppercase">
                        {eyebrow}
                    </span>
                </div>
            )}

            {title && (
                <h2 className="max-w-4xl font-display text-[clamp(1.875rem,4vw,3rem)] leading-[1.15] font-bold tracking-tight text-[var(--text)]">
                    {renderTitleWithHighlight()}
                </h2>
            )}

            {subtitle && (
                <p className="mt-4 max-w-2xl font-sans text-[clamp(1.0625rem,1.8vw,1.375rem)] leading-relaxed font-normal text-[var(--text-muted)]">
                    {subtitle}
                </p>
            )}
        </div>
    );
}
