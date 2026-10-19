import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface UseScrollStoryOptions {
    enabled?: boolean;
    sectionKeys?: string[];
}

export function useScrollStory({
    enabled = true,
    sectionKeys = [],
}: UseScrollStoryOptions = {}) {
    const [progress, setProgress] = useState(0);
    const [distanceKm, setDistanceKm] = useState(0);
    const [currentSection, setCurrentSection] = useState<string>('hero');

    useEffect(() => {
        // Track overall scroll progress for the top progress bar and distance telemetry
        const updateScrollProgress = () => {
            const scrollY = window.scrollY;
            const maxScroll =
                document.documentElement.scrollHeight - window.innerHeight;
            const currentProgress =
                maxScroll > 0
                    ? Math.min(1, Math.max(0, scrollY / maxScroll))
                    : 0;

            setProgress(currentProgress);
            // Lunar voyage distance metaphor: 0 to 384,400 KM
            setDistanceKm(Math.floor(currentProgress * 384400));
        };

        window.addEventListener('scroll', updateScrollProgress, {
            passive: true,
        });
        updateScrollProgress();

        if (!enabled) {
            // Clean up any existing ScrollTriggers
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
            return () =>
                window.removeEventListener('scroll', updateScrollProgress);
        }

        // Initialize GSAP ScrollTrigger reveals
        const triggers: ScrollTrigger[] = [];
        const sectionList = sectionKeys.filter(Boolean);

        sectionList.forEach((key, index) => {
            const sectionEl = document.getElementById(key);
            if (!sectionEl) return;

            // Shared section-enter event trigger
            const enterTrigger = ScrollTrigger.create({
                trigger: sectionEl,
                start: 'top 50%',
                end: 'bottom 50%',
                onEnter: () => {
                    setCurrentSection(key);
                    window.dispatchEvent(
                        new CustomEvent('section-enter', {
                            detail: { sectionKey: key, index },
                        }),
                    );
                },
                onEnterBack: () => {
                    setCurrentSection(key);
                    window.dispatchEvent(
                        new CustomEvent('section-enter', {
                            detail: { sectionKey: key, index },
                        }),
                    );
                },
            });
            triggers.push(enterTrigger);

            // Section entrance reveal: fade & rise 32px, children staggered by 80ms, once only
            // Design Guideline Section 8: Reveal 600 to 800 ms, cubic-bezier(0.16, 1, 0.3, 1)
            const revealTargets = sectionEl.querySelectorAll('.section-reveal');
            if (revealTargets.length > 0) {
                if (key === 'hero') {
                    // Hero is already in viewport on landing; animate immediately without waiting for scroll
                    gsap.fromTo(
                        revealTargets,
                        {
                            opacity: 0,
                            y: 32,
                        },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            stagger: 0.08,
                            ease: 'power2.out',
                            delay: 0.2,
                        },
                    );
                } else {
                    const tween = gsap.fromTo(
                        revealTargets,
                        {
                            opacity: 0,
                            y: 32,
                        },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.7,
                            stagger: 0.08,
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: sectionEl,
                                start: 'top 85%',
                                toggleActions: 'play none none none',
                                once: true,
                            },
                        },
                    );
                    if (tween.scrollTrigger) {
                        triggers.push(tween.scrollTrigger);
                    }
                }
            }
        });

        const refreshTimer1 = setTimeout(() => ScrollTrigger.refresh(), 200);
        const refreshTimer2 = setTimeout(() => ScrollTrigger.refresh(), 800);

        return () => {
            clearTimeout(refreshTimer1);
            clearTimeout(refreshTimer2);
            window.removeEventListener('scroll', updateScrollProgress);
            triggers.forEach((t) => t.kill());
        };
    }, [enabled, sectionKeys.join(',')]);

    return {
        progress,
        distanceKm,
        currentSection,
    };
}
