import React, { useEffect, useState } from 'react';
import { Globe1, Layers1 } from '../Shared/Icons';
import { PortfolioSection, ProjectItem } from '@/types/portfolio';
import SectionHeading from '../Shared/SectionHeading';
import SolarSystemScene from '../Projects/SolarSystemScene';
import ProjectCardFallback from '../Projects/ProjectCardFallback';
import ProjectDetailPanel from '../Projects/ProjectDetailPanel';

interface ProjectsSectionProps {
    section: PortfolioSection;
    projects: ProjectItem[];
    isOff?: boolean;
    isDark?: boolean;
}

export default function ProjectsSection({
    section,
    projects,
    isOff = false,
    isDark = true,
}: ProjectsSectionProps) {
    const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
        null,
    );
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [originElement, setOriginElement] = useState<HTMLElement | null>(
        null,
    );
    const [isMobile, setIsMobile] = useState(false);
    const [hasWebGL, setHasWebGL] = useState(true);
    const [viewMode, setViewMode] = useState<'system' | 'list'>('system');

    // Detect mobile viewport and WebGL support
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Check WebGL availability
        try {
            const canvas = document.createElement('canvas');
            const gl =
                canvas.getContext('webgl') ||
                canvas.getContext('experimental-webgl');
            setHasWebGL(Boolean(gl));
        } catch {
            setHasWebGL(false);
        }

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Deep Linking: Support /#project-slug (e.g. /#asn-group)
    useEffect(() => {
        const handleHashChange = () => {
            if (typeof window === 'undefined') return;
            const hash = window.location.hash.replace(/^#/, '').trim();
            if (!hash || hash === 'projects') return;

            const matched = projects.find((p) => p.slug === hash);
            if (matched) {
                setSelectedProject(matched);
                setIsPanelOpen(true);
            }
        };

        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [projects]);

    const handleOpenProject = (project: ProjectItem, element?: HTMLElement) => {
        setSelectedProject(project);
        setIsPanelOpen(true);
        if (element) {
            setOriginElement(element);
        }
        // Update URL hash for sharing without triggering jump
        if (typeof window !== 'undefined' && window.history?.replaceState) {
            window.history.replaceState(null, '', `#${project.slug}`);
        }
    };

    const handleClosePanel = () => {
        setIsPanelOpen(false);
        // Clear deep link hash back to #projects
        if (typeof window !== 'undefined' && window.history?.replaceState) {
            window.history.replaceState(null, '', '#projects');
        }
    };

    if (!projects || projects.length === 0) return null;

    const useFallback = isMobile || isOff || !hasWebGL || viewMode === 'list';

    return (
        <section
            id="projects"
            aria-label="Projects Solar System"
            className="w-full px-4 py-16 md:px-8 md:py-24 lg:px-16"
        >
            <div className="mx-auto max-w-6xl">
                {/* Section Header */}
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
                    <SectionHeading
                        eyebrow={section.eyebrow || 'MISSION 04 / SOLAR SYSTEM'}
                        title={
                            section.title || 'Featured Planetary Expeditions'
                        }
                        subtitle={
                            section.subtitle ||
                            'A planetary system of full-stack web applications, architectures, and e-commerce platforms.'
                        }
                        highlightWord="Expeditions"
                        className="!mb-0"
                    />

                    {/* Desktop View Switcher (3D Orbit vs List) */}
                    {!isMobile && hasWebGL && !isOff && (
                        <div className="mb-8 inline-flex items-center gap-1 rounded-full border border-[var(--surface-border)] bg-[var(--surface)] p-1 backdrop-blur-md">
                            <button
                                type="button"
                                onClick={() => setViewMode('system')}
                                aria-label="3D Solar System View"
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-semibold transition-all ${
                                    viewMode === 'system'
                                        ? 'bg-[var(--secondary)] text-white shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                                        : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                                }`}
                            >
                                <Globe1 className="h-3.5 w-3.5" />
                                <span>3D Orbit</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('list')}
                                aria-label="Planet List View"
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-semibold transition-all ${
                                    viewMode === 'list'
                                        ? 'bg-[var(--primary)] text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]'
                                        : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                                }`}
                            >
                                <Layers1 className="h-3.5 w-3.5" />
                                <span>List View</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Main Showcase Container */}
                <div className="mt-8">
                    {useFallback ? (
                        <ProjectCardFallback
                            projects={projects}
                            onSelectProject={handleOpenProject}
                        />
                    ) : (
                        <SolarSystemScene
                            projects={projects}
                            onSelectProject={handleOpenProject}
                            activeProject={selectedProject}
                            isDark={isDark}
                            isOff={isOff}
                        />
                    )}
                </div>
            </div>

            {/* Modal Glass Detail Panel */}
            <ProjectDetailPanel
                project={selectedProject}
                projects={projects}
                isOpen={isPanelOpen}
                onClose={handleClosePanel}
                onSelectProject={(nextProj) => {
                    setSelectedProject(nextProj);
                    if (
                        typeof window !== 'undefined' &&
                        window.history?.replaceState
                    ) {
                        window.history.replaceState(
                            null,
                            '',
                            `#${nextProj.slug}`,
                        );
                    }
                }}
                originElement={originElement}
            />
        </section>
    );
}
