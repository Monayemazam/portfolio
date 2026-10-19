import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import {
    ExperienceItem,
    PortfolioPageProps,
    PortfolioSection,
    ProcessStepItem,
    ProjectItem,
    ServiceItem,
    SkillItem,
    TestimonialItem,
} from '@/types/portfolio';
import { useTheme } from '@/hooks/use-theme';
import { useMotionLevel } from '@/hooks/use-motion-level';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';
import StarfieldContainer from '@/components/Portfolio/Motion/StarfieldContainer';
import SpaceLoader from '@/components/Portfolio/Motion/SpaceLoader';
import EditorialTracker from '@/components/Portfolio/Motion/EditorialTracker';
import ReduceEffectsToggle from '@/components/Portfolio/Motion/ReduceEffectsToggle';
import FloatingNav from '@/components/Portfolio/Shared/FloatingNav';
import HeroSection from '@/components/Portfolio/Sections/HeroSection';
import PortfolioIndexStrip from '@/components/Portfolio/Sections/PortfolioIndexStrip';
import AboutSection from '@/components/Portfolio/Sections/AboutSection';
import SkillsSection from '@/components/Portfolio/Sections/SkillsSection';
import ProjectsSection from '@/components/Portfolio/Sections/ProjectsSection';
import ServicesSection from '@/components/Portfolio/Sections/ServicesSection';
import ExperienceSection from '@/components/Portfolio/Sections/ExperienceSection';
import ProcessSection from '@/components/Portfolio/Sections/ProcessSection';
import TestimonialsSection from '@/components/Portfolio/Sections/TestimonialsSection';
import ContactSection from '@/components/Portfolio/Sections/ContactSection';
import FooterSection from '@/components/Portfolio/Sections/FooterSection';

export default function PortfolioIndex({
    sections: rawSections,
    hero,
    about,
    skills: rawSkills,
    projects: rawProjects,
    services: rawServices,
    experiences: rawExperiences,
    processSteps: rawProcessSteps,
    testimonials: rawTestimonials,
    settings,
    seo,
}: PortfolioPageProps) {
    const sections: PortfolioSection[] = Array.isArray(rawSections)
        ? rawSections
        : (Object.values(rawSections || {}) as PortfolioSection[]);
    const skills: SkillItem[] = Array.isArray(rawSkills)
        ? rawSkills
        : (Object.values(rawSkills || {}) as SkillItem[]);
    const projects: ProjectItem[] = Array.isArray(rawProjects)
        ? rawProjects
        : (Object.values(rawProjects || {}) as ProjectItem[]);
    const services: ServiceItem[] = Array.isArray(rawServices)
        ? rawServices
        : (Object.values(rawServices || {}) as ServiceItem[]);
    const experiences: ExperienceItem[] = Array.isArray(rawExperiences)
        ? rawExperiences
        : (Object.values(rawExperiences || {}) as ExperienceItem[]);
    const processSteps: ProcessStepItem[] = Array.isArray(rawProcessSteps)
        ? rawProcessSteps
        : (Object.values(rawProcessSteps || {}) as ProcessStepItem[]);
    const testimonials: TestimonialItem[] = Array.isArray(rawTestimonials)
        ? rawTestimonials
        : (Object.values(rawTestimonials || {}) as TestimonialItem[]);

    // Theme state
    const { isDark } = useTheme(settings.default_theme);

    // Motion and Effects hierarchy
    const {
        effectiveLevel,
        reduceEffects,
        toggleReduceEffects,
        isFull,
        isOff,
    } = useMotionLevel({ adminLevel: settings.animation_level });

    // Smooth Scrolling with Lenis
    useSmoothScroll({
        enabled: !isOff,
        lerp: 0.1,
    });

    const [activeSection, setActiveSection] = useState<string>(
        sections[0]?.key || 'hero',
    );

    // Active section scroll spy using IntersectionObserver
    useEffect(() => {
        const observerCallback: IntersectionObserverCallback = (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            }
        };

        const observerOptions: IntersectionObserverInit = {
            root: null,
            rootMargin: '-20% 0px -50% 0px',
            threshold: 0.1,
        };

        const observer = new IntersectionObserver(
            observerCallback,
            observerOptions,
        );

        sections.forEach((sec) => {
            const el = document.getElementById(sec.key);
            if (el) {
                observer.observe(el);
            }
        });

        return () => observer.disconnect();
    }, [sections]);

    // SEO Data extraction
    const pageTitle =
        seo?.meta_title ||
        settings.site_title ||
        'Monayem Azam | Independent Digital Builder';
    const pageDescription =
        seo?.meta_description ||
        settings.site_tagline ||
        'Monayem Azam — Digital Field Notes. Independent full-stack software engineer and creative technologist.';
    const canonicalUrl =
        seo?.canonical_url ||
        (typeof window !== 'undefined' ? window.location.href : '');
    const ogImageUrl = seo?.og_image?.url || settings.photo_media?.url;
    const robots = seo?.robots || 'index, follow';

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: hero?.name || settings.site_title || 'Monayem Azam',
        jobTitle: seo?.person_job_title || 'Independent Full-Stack Developer',
        url: canonicalUrl,
        sameAs:
            seo?.person_same_as ||
            [
                settings.github_url,
                settings.linkedin_url,
                settings.facebook_url,
                settings.x_url,
            ].filter(Boolean),
    };

    return (
        <div
            className={`relative min-h-screen w-full bg-[var(--bg)] text-[var(--text)] transition-colors duration-200 selection:bg-[var(--primary)] selection:text-white ${
                isOff ? 'reduced-motion' : ''
            }`}
        >
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta name="robots" content={robots} />
                {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                {ogImageUrl && (
                    <meta property="og:image" content={ogImageUrl} />
                )}
                {canonicalUrl && (
                    <meta property="og:url" content={canonicalUrl} />
                )}

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                {ogImageUrl && (
                    <meta name="twitter:image" content={ogImageUrl} />
                )}

                {/* Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </Head>

            {/* Tactile Architectural Background Grid */}
            <StarfieldContainer
                effectiveLevel={effectiveLevel}
                isDark={isDark}
            />

            {/* Quick Initial Loader */}
            <SpaceLoader reducedMotion={isOff} />

            {/* Publication Masthead Navigation */}
            <FloatingNav
                sections={sections}
                activeSection={activeSection}
                settings={settings}
            />

            {/* Corner Reduce Effects Toggle */}
            <ReduceEffectsToggle
                reduceEffects={reduceEffects}
                onToggle={toggleReduceEffects}
            />

            {/* Signature Interaction: Editorial Coordinate Crosshair Tracker */}
            <EditorialTracker enabled={!isOff} />

            {/* Main Content Stream in Database sort_order */}
            <main className="relative z-10 flex w-full flex-col">
                {sections.map((section) => {
                    switch (section.key) {
                        case 'hero':
                            return (
                                <React.Fragment key={section.key}>
                                    <HeroSection
                                        section={section}
                                        hero={hero}
                                        settings={settings}
                                        isFull={isFull}
                                        isOff={isOff}
                                        isDark={isDark}
                                    />
                                    {/* Section 6: Publication Visual Index Strip */}
                                    <PortfolioIndexStrip />
                                </React.Fragment>
                            );
                        case 'about':
                            return (
                                <AboutSection
                                    key={section.key}
                                    section={section}
                                    about={about}
                                    settings={settings}
                                    isOff={isOff}
                                />
                            );
                        case 'skills':
                            return (
                                <SkillsSection
                                    key={section.key}
                                    section={section}
                                    skills={skills}
                                    isOff={isOff}
                                    isDark={isDark}
                                />
                            );
                        case 'projects':
                            return (
                                <ProjectsSection
                                    key={section.key}
                                    section={section}
                                    projects={projects}
                                    isOff={isOff}
                                    isDark={isDark}
                                />
                            );
                        case 'services':
                            return (
                                <ServicesSection
                                    key={section.key}
                                    section={section}
                                    services={services}
                                />
                            );
                        case 'experience':
                            return (
                                <ExperienceSection
                                    key={section.key}
                                    section={section}
                                    experiences={experiences}
                                />
                            );
                        case 'process':
                            return (
                                <ProcessSection
                                    key={section.key}
                                    section={section}
                                    processSteps={processSteps}
                                />
                            );
                        case 'testimonials':
                            return (
                                <TestimonialsSection
                                    key={section.key}
                                    section={section}
                                    testimonials={testimonials}
                                />
                            );
                        case 'contact':
                            return (
                                <ContactSection
                                    key={section.key}
                                    section={section}
                                    settings={settings}
                                />
                            );
                        case 'footer':
                            return (
                                <FooterSection
                                    key={section.key}
                                    section={section}
                                    sections={sections}
                                    settings={settings}
                                />
                            );
                        default:
                            return null;
                    }
                })}
            </main>
        </div>
    );
}
