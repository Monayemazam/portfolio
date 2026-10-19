import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
    ArrowAngularTopRight,
    ArrowLeft,
    ArrowRight,
    Check,
    Cross,
    Globe1,
    Layers1,
    StarFat,
} from '../Shared/Icons';
import { ProjectFeatureItem, ProjectItem } from '@/types/portfolio';
import Button from '../Shared/Button';
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

    // Reset media index and iframe toggle on project change
    useEffect(() => {
        setActiveMediaIndex(0);
        setShowIframe(false);
    }, [project?.id]);

    // Keyboard focus trap & Escape key handler
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
                return;
            }

            if (e.key === 'Tab' && panelRef.current) {
                const focusable =
                    panelRef.current.querySelectorAll<HTMLElement>(
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

        // Focus the panel or close button upon open
        const timer = setTimeout(() => {
            const closeBtn = panelRef.current?.querySelector<HTMLButtonElement>(
                'button[aria-label="Close project mission briefing"]',
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
            // Return focus to originating element
            if (originElement) {
                originElement.focus();
            }
        };
    }, [isOpen, onClose, originElement]);

    // Touch swipe-down handler
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartY(e.touches[0]?.clientY ?? null);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartY === null) return;
        const touchEndY = e.changedTouches[0]?.clientY ?? touchStartY;
        const diff = touchEndY - touchStartY;
        // Swipe down threshold: 90px
        if (diff > 90) {
            onClose();
        }
        setTouchStartY(null);
    };

    // Group features by group_label, ordered by lowest sort_order in each group
    const groupedFeatures = useMemo(() => {
        if (!project?.features || project.features.length === 0) return {};

        const groups: Record<string, ProjectFeatureItem[]> = {};
        for (const feat of project.features) {
            const label = feat.group_label || 'General';
            if (!groups[label]) {
                groups[label] = [];
            }
            groups[label].push(feat);
        }

        // Sort items inside each group by sort_order
        Object.keys(groups).forEach((key) => {
            groups[key]?.sort((a, b) => a.sort_order - b.sort_order);
        });

        // Sort group keys by the lowest sort_order of their items
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

    const accent = project.accent_color || 'var(--secondary)';
    const mediaList =
        project.media && project.media.length > 0
            ? project.media
            : project.cover_media
              ? [project.cover_media]
              : [];

    const activeMedia = mediaList[activeMediaIndex] || project.cover_media;

    // Previous and Next project index calculations
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
            className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-md transition-all duration-300 sm:p-6 md:p-10"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                ref={panelRef}
                tabIndex={-1}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="relative my-auto flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--bg-elevated)]/95 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl focus:outline-none"
                style={{
                    boxShadow: `0 0 40px ${accent}25, 0 25px 50px -12px rgba(0, 0, 0, 0.7)`,
                }}
            >
                {/* Mobile Drag/Swipe Indicator Bar */}
                <div className="flex h-4 w-full items-center justify-center pt-2 sm:hidden">
                    <span className="h-1 w-12 rounded-full bg-[var(--surface-border)]" />
                </div>

                {/* Top Telemetry Header */}
                <div className="flex items-center justify-between border-b border-[var(--surface-border)] px-5 py-3 sm:px-8">
                    <div className="flex items-center gap-3">
                        <span
                            className="h-2.5 w-2.5 rounded-full shadow-md"
                            style={{
                                backgroundColor: accent,
                                boxShadow: `0 0 10px ${accent}`,
                            }}
                        />
                        <span className="font-mono text-xs font-bold tracking-widest text-[var(--secondary)] uppercase">
                            PLANET BRIEFING / {project.planet_style}
                        </span>
                        {project.is_featured && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent)]/90 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-950 uppercase shadow">
                                <StarFat className="h-3 w-3" />
                                FEATURED
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Live URL Direct Link */}
                        {project.live_url && (
                            <a
                                href={project.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden items-center gap-1.5 rounded-lg border border-[var(--surface-border)] px-3 py-1 font-mono text-xs text-[var(--text-muted)] transition-colors hover:border-[var(--secondary)] hover:text-[var(--secondary)] focus-visible:ring-2 focus-visible:ring-[var(--secondary)] focus-visible:outline-none sm:inline-flex"
                            >
                                <Globe1 className="h-3.5 w-3.5" />
                                <span>Live Site</span>
                            </a>
                        )}

                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close project mission briefing"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text-muted)] transition-colors hover:border-[var(--danger)] hover:bg-[var(--danger)]/15 hover:text-[var(--danger)] focus-visible:ring-2 focus-visible:ring-[var(--secondary)] focus-visible:outline-none"
                        >
                            <Cross className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Modal Body */}
                <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8">
                    {/* Media Showcase / Live Preview */}
                    <div className="relative mb-6 overflow-hidden rounded-xl border border-[var(--surface-border)] bg-[var(--bg)] shadow-inner">
                        {/* Live Preview Toggle Pill (when show_live_preview = 1) */}
                        {project.show_live_preview && (
                            <div className="absolute top-3 right-3 z-20 flex items-center gap-1 rounded-full border border-[var(--surface-border)] bg-[var(--surface)] p-1 backdrop-blur-md">
                                <button
                                    type="button"
                                    onClick={() => setShowIframe(false)}
                                    className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-bold transition-all ${
                                        !showIframe
                                            ? 'bg-[var(--primary)] text-white shadow'
                                            : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                                    }`}
                                >
                                    Media
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowIframe(true)}
                                    className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-bold transition-all ${
                                        showIframe
                                            ? 'bg-[var(--secondary)] text-white shadow'
                                            : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                                    }`}
                                >
                                    Live Preview
                                </button>
                            </div>
                        )}

                        {/* Content: Iframe or Media Gallery */}
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
                            <div className="relative flex h-64 w-full items-center justify-center bg-black/40 sm:h-80 md:h-96">
                                {activeMedia.type === 'video' ? (
                                    <video
                                        src={activeMedia.url}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        poster={
                                            activeMedia.thumb_url ||
                                            project.cover_media?.url
                                        }
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <img
                                        src={
                                            activeMedia.webp_url ||
                                            activeMedia.url
                                        }
                                        alt={
                                            activeMedia.alt_text ||
                                            project.title
                                        }
                                        className="h-full w-full object-contain"
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="flex h-64 w-full flex-col items-center justify-center gap-3 bg-[var(--bg-elevated)] p-6 text-center">
                                <div
                                    className="flex h-16 w-16 items-center justify-center rounded-full border-2 shadow-lg"
                                    style={{
                                        borderColor: accent,
                                        boxShadow: `0 0 25px ${accent}40`,
                                    }}
                                >
                                    <span className="font-mono text-xs font-bold text-[var(--secondary)] uppercase">
                                        {project.planet_style}
                                    </span>
                                </div>
                                <span className="font-mono text-xs text-[var(--text-muted)]">
                                    Orbital visual data telemetry online
                                </span>
                            </div>
                        )}

                        {/* Thumbnail selector strip if multiple media items exist */}
                        {mediaList.length > 1 && !showIframe && (
                            <div className="flex gap-2 overflow-x-auto border-t border-[var(--surface-border)] bg-[var(--surface)] p-2">
                                {mediaList.map((m, idx) => (
                                    <button
                                        key={m.id || idx}
                                        type="button"
                                        onClick={() => setActiveMediaIndex(idx)}
                                        aria-label={`View media ${idx + 1}`}
                                        className={`relative h-12 w-20 flex-shrink-0 overflow-hidden rounded-md border transition-all ${
                                            activeMediaIndex === idx
                                                ? 'border-[var(--secondary)] ring-2 ring-[var(--secondary)]'
                                                : 'border-[var(--surface-border)] opacity-60 hover:opacity-100'
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

                    {/* Project Title & Metadata Badges */}
                    <div className="mb-4">
                        <div className="flex flex-wrap items-baseline justify-between gap-3">
                            <h2
                                id={titleId}
                                className="font-display text-2xl font-extrabold tracking-tight text-[var(--text)] sm:text-3xl"
                            >
                                {project.title}
                            </h2>
                            {project.year && (
                                <span className="font-mono text-sm font-semibold text-[var(--secondary)]">
                                    EXPEDITION / {project.year}
                                </span>
                            )}
                        </div>

                        {/* Telemetry Pills */}
                        <div className="mt-2.5 flex flex-wrap gap-2 font-mono text-xs">
                            {project.role && (
                                <span className="rounded-md border border-[var(--surface-border)] bg-[var(--surface)] px-2.5 py-1 text-[var(--text-muted)]">
                                    Role:{' '}
                                    <strong className="text-[var(--text)]">
                                        {project.role}
                                    </strong>
                                </span>
                            )}
                            {project.business_type && (
                                <span className="rounded-md border border-[var(--surface-border)] bg-[var(--surface)] px-2.5 py-1 text-[var(--text-muted)]">
                                    Domain:{' '}
                                    <strong className="text-[var(--text)]">
                                        {project.business_type}
                                    </strong>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Summary & Description */}
                    <div className="mb-6 space-y-3">
                        <p className="font-sans text-base leading-relaxed font-medium text-[var(--text)]">
                            {project.summary}
                        </p>
                        {project.description && (
                            <p className="font-sans text-sm leading-relaxed whitespace-pre-line text-[var(--text-muted)]">
                                {project.description}
                            </p>
                        )}
                    </div>

                    {/* Tech Stack Tags */}
                    {project.tags && project.tags.length > 0 && (
                        <div className="mb-6">
                            <div className="mb-2 font-mono text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                                Engineering Arsenal & Stack
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <TagChip key={tag.id}>{tag.name}</TagChip>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Complete Grouped Feature List */}
                    {Object.keys(groupedFeatures).length > 0 && (
                        <div className="mb-6 border-t border-[var(--surface-border)] pt-5">
                            <div className="mb-4 flex items-center gap-2">
                                <Layers1 className="h-4 w-4 text-[var(--secondary)]" />
                                <h3 className="font-mono text-xs font-bold tracking-[0.14em] text-[var(--secondary)] uppercase">
                                    Architecture & Features Executed
                                </h3>
                            </div>

                            <div className="space-y-4">
                                {Object.entries(groupedFeatures).map(
                                    ([group, items]) => (
                                        <div
                                            key={group}
                                            className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface)]/60 p-4"
                                        >
                                            <div className="mb-3 flex items-center gap-2 border-b border-[var(--surface-border)] pb-2 font-mono text-xs font-bold tracking-wider text-[var(--text)] uppercase">
                                                <span className="h-1.5 w-1.5 rounded-full bg-[var(--secondary)]" />
                                                <span>{group}</span>
                                                <span className="ml-auto text-[10px] text-[var(--text-muted)]">
                                                    {items.length}{' '}
                                                    {items.length === 1
                                                        ? 'item'
                                                        : 'items'}
                                                </span>
                                            </div>

                                            <ul className="space-y-2">
                                                {items.map((feat) => (
                                                    <li
                                                        key={feat.id}
                                                        className="flex items-start gap-2.5 font-sans text-xs leading-relaxed text-[var(--text-muted)] sm:text-sm"
                                                    >
                                                        <span className="mt-1 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[var(--secondary)]/15 text-[var(--secondary)]">
                                                            <Check className="h-2.5 w-2.5" />
                                                        </span>
                                                        <span className="text-[var(--text)]">
                                                            {feat.text ||
                                                                feat.title}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Navigation & CTA Buttons */}
                <div className="flex flex-col gap-3 border-t border-[var(--surface-border)] bg-[var(--surface)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                    {/* Previous / Next Planet Quick Hop */}
                    <div className="flex items-center gap-2">
                        {prevProject && onSelectProject && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onSelectProject(prevProject)}
                                icon={<ArrowLeft className="h-3.5 w-3.5" />}
                                className="!px-3"
                                title={`Previous: ${prevProject.title}`}
                            >
                                <span className="hidden sm:inline">
                                    Prev Planet
                                </span>
                            </Button>
                        )}
                        {nextProject && onSelectProject && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onSelectProject(nextProject)}
                                icon={<ArrowRight className="h-3.5 w-3.5" />}
                                className="!px-3"
                                title={`Next: ${nextProject.title}`}
                            >
                                <span>Next Planet</span>
                            </Button>
                        )}
                    </div>

                    {/* Live Site & Close Actions */}
                    <div className="flex items-center gap-3">
                        {project.live_url && (
                            <Button
                                variant="primary"
                                size="md"
                                href={project.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                icon={
                                    <ArrowAngularTopRight className="h-4 w-4" />
                                }
                                className="flex-1 sm:flex-initial"
                            >
                                Visit Live Site
                            </Button>
                        )}
                        <Button
                            variant="secondary"
                            size="md"
                            onClick={onClose}
                            className="flex-1 sm:flex-initial"
                        >
                            Return to Orbit
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
