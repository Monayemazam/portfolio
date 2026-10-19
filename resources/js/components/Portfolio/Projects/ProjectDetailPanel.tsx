import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
    ArrowAngularTopRight,
    ArrowLeft,
    ArrowRight,
    Check,
    Cross,
    Globe1,
    Layers1,
} from '../Shared/Icons';
import { ProjectFeatureItem, ProjectItem } from '@/types/portfolio';
import TagChip from '../Shared/TagChip';

interface ProjectDetailPanelProps {
    project: ProjectItem | null;
    projects?: ProjectItem[];
    isOpen: boolean;
    onClose: () => void;
    onSelectProject?: (project: ProjectItem) => void;
    originElement?: HTMLElement | null;
}

export default function ProjectDetailPanel({
    project,
    projects = [],
    isOpen,
    onClose,
    onSelectProject,
    originElement,
}: ProjectDetailPanelProps) {
    const titleId = useId();
    const panelRef = useRef<HTMLDivElement>(null);
    const [activeMediaIndex, setActiveMediaIndex] = useState(0);
    const [showIframe, setShowIframe] = useState(false);
    const [touchStartY, setTouchStartY] = useState<number | null>(null);

    useEffect(() => {
        setActiveMediaIndex(0);
        setShowIframe(false);
    }, [project?.id]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
                return;
            }

            if (e.key === 'Tab' && panelRef.current) {
                const focusable = panelRef.current.querySelectorAll<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
                );
                if (focusable.length === 0) return;

                const firstEl = focusable[0];
                const lastEl = focusable[focusable.length - 1];

                if (e.shiftKey && document.activeElement === firstEl) {
                    e.preventDefault();
                    lastEl?.focus();
                } else if (!e.shiftKey && document.activeElement === lastEl) {
                    e.preventDefault();
                    firstEl?.focus();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        const timer = setTimeout(() => {
            const closeBtn = panelRef.current?.querySelector<HTMLButtonElement>(
                'button[aria-label="Close project dossier"]',
            );
            if (closeBtn) {
                closeBtn.focus();
            } else {
                panelRef.current?.focus();
            }
        }, 80);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearTimeout(timer);
            if (originElement) {
                originElement.focus();
            }
        };
    }, [isOpen, onClose, originElement]);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartY(e.touches[0]?.clientY ?? null);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartY === null) return;
        const touchEndY = e.changedTouches[0]?.clientY ?? touchStartY;
        if (touchEndY - touchStartY > 90) {
            onClose();
        }
        setTouchStartY(null);
    };

    const groupedFeatures = useMemo(() => {
        if (!project?.features || project.features.length === 0) return {};

        const groups: Record<string, ProjectFeatureItem[]> = {};
        for (const feat of project.features) {
            const label = feat.group_label || 'Core Systems';
            if (!groups[label]) groups[label] = [];
            groups[label].push(feat);
        }

        Object.keys(groups).forEach((key) => {
            groups[key]?.sort((a, b) => a.sort_order - b.sort_order);
        });

        const sortedKeys = Object.keys(groups).sort((a, b) => {
            const minA = groups[a]?.[0]?.sort_order ?? 0;
            const minB = groups[b]?.[0]?.sort_order ?? 0;
            return minA - minB;
        });

        const sortedGroupMap: Record<string, ProjectFeatureItem[]> = {};
        sortedKeys.forEach((key) => {
            const items = groups[key];
            if (items) sortedGroupMap[key] = items;
        });

        return sortedGroupMap;
    }, [project?.features]);

    if (!isOpen || !project) return null;

    const mediaList =
        project.media && project.media.length > 0
            ? project.media
            : project.cover_media
              ? [project.cover_media]
              : [];

    const activeMedia = mediaList[activeMediaIndex] || project.cover_media;

    const currentIndex = projects.findIndex((p) => p.id === project.id);
    const nextProject =
        currentIndex >= 0 && projects.length > 1
            ? projects[(currentIndex + 1) % projects.length]
            : null;
    const prevProject =
        currentIndex >= 0 && projects.length > 1
            ? projects[(currentIndex - 1 + projects.length) % projects.length]
            : null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-black/80 p-3 sm:p-6 md:p-10 backdrop-blur-xs"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                ref={panelRef}
                tabIndex={-1}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="relative my-auto flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden border-2 border-foreground bg-[var(--bg)] shadow-2xl focus:outline-hidden"
            >
                {/* Top Dossier Masthead Header */}
                <div className="flex items-center justify-between border-b-2 border-foreground bg-surface px-5 py-3.5 sm:px-8">
                    <div className="flex items-center gap-3">
                        <span className="stamp-orange text-[10px]">
                            DOSSIER NO. {(currentIndex + 1).toString().padStart(2, '0')}
                        </span>
                        <span className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">
                            REF: {project.slug}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {project.live_url && (
                            <a
                                href={project.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden items-center gap-1.5 border border-border px-3 py-1 font-mono text-xs text-foreground hover:bg-foreground hover:text-background transition-colors sm:inline-flex uppercase font-bold"
                            >
                                <Globe1 className="h-3.5 w-3.5" />
                                <span>Live Site [↗]</span>
                            </a>
                        )}

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close project dossier"
                            className="flex h-8 w-8 items-center justify-center border border-foreground bg-background text-foreground transition-colors hover:bg-foreground hover:text-background"
                        >
                            <Cross className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Dossier Content */}
                <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8">
                    {/* Media Showcase / Live Preview */}
                    <div className="relative mb-6 border-2 border-foreground bg-muted overflow-hidden">
                        {project.show_live_preview && (
                            <div className="absolute top-3 right-3 z-20 flex items-center border border-border bg-background p-1">
                                <button
                                    type="button"
                                    onClick={() => setShowIframe(false)}
                                    className={`px-3 py-1 font-mono text-[10px] font-bold uppercase transition-colors ${
                                        !showIframe ? 'bg-[var(--primary)] text-white' : 'text-foreground'
                                    }`}
                                >
                                    Media
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowIframe(true)}
                                    className={`px-3 py-1 font-mono text-[10px] font-bold uppercase transition-colors ${
                                        showIframe ? 'bg-[var(--primary)] text-white' : 'text-foreground'
                                    }`}
                                >
                                    Live Preview
                                </button>
                            </div>
                        )}

                        {showIframe && project.live_url ? (
                            <div className="relative h-72 w-full sm:h-96">
                                <iframe
                                    src={project.live_url}
                                    title={`${project.title} live preview`}
                                    className="h-full w-full border-0 bg-white"
                                    sandbox="allow-scripts allow-same-origin allow-forms"
                                    loading="lazy"
                                />
                            </div>
                        ) : activeMedia ? (
                            <div className="relative flex h-64 w-full items-center justify-center bg-black/10 sm:h-80 md:h-96">
                                {activeMedia.type === 'video' ? (
                                    <video
                                        src={activeMedia.url}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        poster={activeMedia.thumb_url || project.cover_media?.url}
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <img
                                        src={activeMedia.webp_url || activeMedia.url}
                                        alt={activeMedia.alt_text || project.title}
                                        className="h-full w-full object-contain"
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="flex h-64 w-full flex-col items-center justify-center p-6 text-center">
                                <span className="font-display text-4xl font-black uppercase text-foreground/40">
                                    {project.title}
                                </span>
                                <span className="mt-2 font-mono text-xs text-muted-foreground uppercase">
                                    [ARCHIVAL EXHIBIT RECORD]
                                </span>
                            </div>
                        )}

                        {mediaList.length > 1 && !showIframe && (
                            <div className="flex gap-2 overflow-x-auto border-t border-border bg-background p-2">
                                {mediaList.map((m, idx) => (
                                    <button
                                        key={m.id || idx}
                                        type="button"
                                        onClick={() => setActiveMediaIndex(idx)}
                                        aria-label={`View media ${idx + 1}`}
                                        className={`relative h-12 w-20 flex-shrink-0 overflow-hidden border transition-all ${
                                            activeMediaIndex === idx
                                                ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]'
                                                : 'border-border opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img
                                            src={m.thumb_url || m.url}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Project Title & Classification Metadata */}
                    <div className="mb-6">
                        <div className="flex flex-wrap items-baseline justify-between gap-3">
                            <h2
                                id={titleId}
                                className="font-display text-3xl sm:text-4xl font-black tracking-tight text-foreground uppercase"
                            >
                                {project.title}
                            </h2>
                            {project.year && (
                                <span className="font-mono text-sm font-bold text-[var(--primary)]">
                                    YEAR // {project.year}
                                </span>
                            )}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-3 font-mono text-xs">
                            {project.role && (
                                <span className="border border-border bg-surface px-2.5 py-1">
                                    ROLE: <strong className="text-foreground">{project.role}</strong>
                                </span>
                            )}
                            {project.business_type && (
                                <span className="border border-border bg-surface px-2.5 py-1">
                                    SECTOR: <strong className="text-foreground">{project.business_type}</strong>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Summary & Description */}
                    <div className="mb-8 space-y-4 font-body text-base leading-relaxed text-foreground/90">
                        {project.summary && (
                            <p className="font-semibold text-foreground text-lg">
                                {project.summary}
                            </p>
                        )}
                        {project.description && (
                            <p className="whitespace-pre-line text-foreground/80">
                                {project.description}
                            </p>
                        )}
                    </div>

                    {/* Tech Stack */}
                    {project.tags && project.tags.length > 0 && (
                        <div className="mb-8 border-t border-border pt-6">
                            <div className="mb-3 font-mono text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                VERIFIED TECHNICAL STACK //
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <TagChip key={tag.id}>{tag.name}</TagChip>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Features Grouped Checklist */}
                    {Object.keys(groupedFeatures).length > 0 && (
                        <div className="mb-8 border-t border-border pt-6">
                            <div className="mb-4 flex items-center gap-2">
                                <Layers1 className="h-4 w-4 text-[var(--primary)]" />
                                <h3 className="font-mono text-xs font-bold tracking-widest text-foreground uppercase">
                                    ARCHITECTURE & SYSTEM CAPABILITIES DELIVERED
                                </h3>
                            </div>

                            <div className="space-y-4">
                                {Object.entries(groupedFeatures).map(([group, items]) => (
                                    <div
                                        key={group}
                                        className="border border-border bg-surface p-4 sm:p-5"
                                    >
                                        <div className="mb-3 flex items-center justify-between border-b border-border pb-2 font-mono text-xs font-bold text-foreground uppercase">
                                            <span>// {group}</span>
                                            <span className="text-[10px] text-muted-foreground">
                                                [{items.length} {items.length === 1 ? 'ITEM' : 'ITEMS'}]
                                            </span>
                                        </div>

                                        <ul className="space-y-2.5">
                                            {items.map((feat) => (
                                                <li
                                                    key={feat.id}
                                                    className="flex items-start gap-2.5 font-mono text-xs leading-relaxed text-foreground/80"
                                                >
                                                    <span className="font-bold text-[var(--primary)] select-none">
                                                        [✓]
                                                    </span>
                                                    <span>{feat.text || feat.title}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Navigation Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-foreground bg-surface px-5 py-4 sm:px-8 font-mono text-xs">
                    <div className="flex items-center gap-2">
                        {prevProject && onSelectProject && (
                            <button
                                type="button"
                                onClick={() => onSelectProject(prevProject)}
                                className="flex items-center gap-1.5 border border-border px-3 py-1.5 hover:bg-foreground hover:text-background uppercase transition-colors"
                            >
                                <ArrowLeft className="h-3.5 w-3.5" />
                                <span>PREV EXHIBIT</span>
                            </button>
                        )}
                        {nextProject && onSelectProject && (
                            <button
                                type="button"
                                onClick={() => onSelectProject(nextProject)}
                                className="flex items-center gap-1.5 border border-border px-3 py-1.5 hover:bg-foreground hover:text-background uppercase transition-colors"
                            >
                                <span>NEXT EXHIBIT</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {project.live_url && (
                            <a
                                href={project.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[var(--primary)] px-4 py-2 font-bold uppercase text-white hover:opacity-90 transition-opacity"
                            >
                                VISIT LIVE SITE [↗]
                            </a>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="border border-foreground px-4 py-2 font-bold uppercase text-foreground hover:bg-foreground hover:text-background transition-colors"
                        >
                            RETURN TO EXHIBITION
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
