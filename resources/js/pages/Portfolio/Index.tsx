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
import OrbitNav from '@/components/Portfolio/Shared/OrbitNav';
import MobileMenu from '@/components/Portfolio/Shared/MobileMenu';
import HeroSection from '@/components/Portfolio/Sections/HeroSection';
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
        'Monayem Azam - Full-Stack Developer';
    const pageDescription =
        seo?.meta_description ||
        settings.site_tagline ||
        'Monayem Azam Portfolio - Space-themed mission control showcases full-stack web applications, Laravel, React, and architectures.';
    const canonicalUrl = seo?.canonical_url || window?.location?.href;
    const ogImageUrl = seo?.og_image?.url || settings.photo_media?.url;
    const robots = seo?.robots || 'index, follow';

    // Structured Data JSON-LD
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: hero?.name || settings.site_title || 'Monayem Azam',
        jobTitle: seo?.person_job_title || 'Full-Stack Developer',
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
        <div className="relative min-h-screen w-full bg-[var(--bg)] text-[var(--text)] transition-colors duration-300 selection:bg-[var(--primary)] selection:text-white">
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

            {/* Orbit Navigation (Desktop) */}
            <OrbitNav sections={sections} activeSection={activeSection} />

            {/* Mobile Menu Overlay */}
            <MobileMenu sections={sections} activeSection={activeSection} />

            {/* Main Sections Stream in Database sort_order */}
            <main className="flex w-full flex-col">
                {sections.map((section) => {
                    switch (section.key) {
                        case 'hero':
                            return (
                                <HeroSection
                                    key={section.key}
                                    section={section}
                                    hero={hero}
                                    settings={settings}
                                />
                            );
                        case 'about':
                            return (
                                <AboutSection
                                    key={section.key}
                                    section={section}
                                    about={about}
                                    settings={settings}
                                />
                            );
                        case 'skills':
                            return (
                                <SkillsSection
                                    key={section.key}
                                    section={section}
                                    skills={skills}
                                />
                            );
                        case 'projects':
                            return (
                                <ProjectsSection
                                    key={section.key}
                                    section={section}
                                    projects={projects}
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
