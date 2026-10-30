/**
 * Centralized Gravitational Physics & Interactive Repulsion Engine
 * 
 * Provides:
 * - Distance-based gravitational attraction toward the cursor
 * - Tactile push-back (slingshot repulsion) on click / pointerdown
 * - Damped harmonic spring physics returning elements to layout anchor
 * - Single global requestAnimationFrame loop that sleeps when elements are at rest
 * - Zero React re-renders (direct DOM transform mutation)
 * - Viewport culling via IntersectionObserver
 * - Full prefers-reduced-motion and touch device safety
 */

export interface GravityOptions {
    strength?: number;   // Attraction force multiplier (default: 0.25)
    maxPull?: number;    // Maximum displacement in pixels (default: 10)
    radius?: number;     // Interaction radius around element center in px (default: 160)
    pushForce?: number;  // Repulsive impulse on click in pixels (default: 8)
    stiffness?: number;  // Spring tension k (default: 0.14)
    damping?: number;    // Damping factor (default: 0.82)
    disabled?: boolean;
}

interface RegisteredItem {
    element: HTMLElement;
    options: GravityOptions;
    currentX: number;
    currentY: number;
    targetX: number;
    targetY: number;
    vx: number;
    vy: number;
    rect: DOMRect | null;
    rectDirty: boolean;
    isVisible: boolean;
}

class GravityEngine {
    private items: Map<HTMLElement, RegisteredItem> = new Map();
    private cursorX = -9999;
    private cursorY = -9999;
    private lastMouseMoveTime = 0;
    private isRunning = false;
    private rafId: number | null = null;
    private isScrolling = false;
    private scrollTimer: number | null = null;
    private intersectionObserver: IntersectionObserver | null = null;
    private isReduced = false;
    private isCoarsePointer = false;
    private initialized = false;

    constructor() {
        if (typeof window === 'undefined') return;
        this.init();
    }

    private init() {
        if (this.initialized) return;
        this.initialized = true;

        // Check reduced motion & touch capability
        this.checkPreferences();

        // Single shared IntersectionObserver for viewport visibility
        if (typeof IntersectionObserver !== 'undefined') {
            this.intersectionObserver = new IntersectionObserver(
                (entries) => {
                    for (const entry of entries) {
                        const item = this.items.get(entry.target as HTMLElement);
                        if (item) {
                            item.isVisible = entry.isIntersecting;
                            item.rectDirty = true;
                            if (entry.isIntersecting) {
                                this.wakeUp();
                            }
                        }
                    }
                },
                { threshold: 0.05, rootMargin: '40px' }
            );
        }

        // Global passive cursor listener
        window.addEventListener('mousemove', this.handleMouseMove, { passive: true });
        window.addEventListener('mouseleave', this.handleMouseLeave, { passive: true });
        window.addEventListener('blur', this.handleMouseLeave, { passive: true });

        // Passive scroll handling: damp during active scroll to ensure 120fps native scroll
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        window.addEventListener('resize', this.handleResize, { passive: true });
        document.addEventListener('visibilitychange', this.handleVisibilityChange);

        // Global click / pointerdown for tactile push-back
        window.addEventListener('pointerdown', this.handlePointerDown, { passive: true });
    }

    private checkPreferences() {
        if (typeof window === 'undefined') return;
        this.isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.isCoarsePointer = window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(hover: hover)').matches;

        // Listen for user preference changes
        try {
            window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
                this.isReduced = e.matches;
                if (this.isReduced) {
                    this.resetAll();
                }
            });
        } catch (_) {
            // Older browser fallback
        }
    }

    public register(element: HTMLElement, options: GravityOptions = {}): () => void {
        if (typeof window === 'undefined' || !element) {
            return () => {};
        }

        const item: RegisteredItem = {
            element,
            options,
            currentX: 0,
            currentY: 0,
            targetX: 0,
            targetY: 0,
            vx: 0,
            vy: 0,
            rect: null,
            rectDirty: true,
            isVisible: true,
        };

        this.items.set(element, item);
        if (this.intersectionObserver) {
            this.intersectionObserver.observe(element);
        }

        // Element-level push-back on click
        const onElementPointerDown = (e: PointerEvent) => {
            if (this.isReduced || options.disabled) return;
            const push = options.pushForce ?? 8;
            // Impulse directed slightly away from click point
            const rect = element.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) || (Math.random() - 0.5);
            const dy = (e.clientY - cy) || (Math.random() - 0.5);
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;

            // Push backward along the vector
            item.vx -= (dx / dist) * push;
            item.vy -= (dy / dist) * push;
            this.wakeUp();
        };

        element.addEventListener('pointerdown', onElementPointerDown, { passive: true });

        return () => {
            element.removeEventListener('pointerdown', onElementPointerDown);
            if (this.intersectionObserver) {
                this.intersectionObserver.unobserve(element);
            }
            if (item.currentX !== 0 || item.currentY !== 0) {
                element.style.transform = '';
            }
            this.items.delete(element);
        };
    }

    public update(element: HTMLElement, options: Partial<GravityOptions>) {
        const item = this.items.get(element);
        if (item) {
            item.options = { ...item.options, ...options };
            if (item.options.disabled) {
                item.currentX = 0;
                item.currentY = 0;
                item.vx = 0;
                item.vy = 0;
                element.style.transform = '';
            }
        }
    }

    public applyImpulse(element: HTMLElement, forceX: number, forceY: number) {
        const item = this.items.get(element);
        if (item && !this.isReduced && !item.options.disabled) {
            item.vx += forceX;
            item.vy += forceY;
            this.wakeUp();
        }
    }

    private handleMouseMove = (e: MouseEvent) => {
        if (this.isReduced || this.isCoarsePointer) return;
        this.cursorX = e.clientX;
        this.cursorY = e.clientY;
        this.lastMouseMoveTime = performance.now();
        this.wakeUp();
    };

    private handleMouseLeave = () => {
        this.cursorX = -9999;
        this.cursorY = -9999;
        this.wakeUp();
    };

    private handleScroll = () => {
        this.isScrolling = true;
        // Mark rects dirty
        for (const item of this.items.values()) {
            item.rectDirty = true;
        }

        if (this.scrollTimer !== null) {
            window.clearTimeout(this.scrollTimer);
        }
        this.scrollTimer = window.setTimeout(() => {
            this.isScrolling = false;
            this.scrollTimer = null;
            this.wakeUp();
        }, 100);
    };

    private handleResize = () => {
        for (const item of this.items.values()) {
            item.rectDirty = true;
        }
        this.wakeUp();
    };

    private handleVisibilityChange = () => {
        if (document.hidden) {
            this.stopLoop();
        } else {
            this.wakeUp();
        }
    };

    private handlePointerDown = (e: PointerEvent) => {
        if (this.isReduced) return;
        // Find if any registered item is under or very close to click
        const px = e.clientX;
        const py = e.clientY;

        for (const item of this.items.values()) {
            if (!item.isVisible || item.options.disabled) continue;
            if (!item.rect || item.rectDirty) {
                item.rect = item.element.getBoundingClientRect();
                item.rectDirty = false;
            }
            const r = item.rect;
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            const dx = px - cx;
            const dy = py - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Within close vicinity or direct hit
            if (dist < Math.max(r.width, r.height) * 0.8) {
                const push = item.options.pushForce ?? 8;
                const dSafe = dist || 1;
                item.vx -= (dx / dSafe) * push;
                item.vy -= (dy / dSafe) * push;
                this.wakeUp();
            }
        }
    };

    private wakeUp() {
        if (!this.isRunning && !this.isReduced && !document.hidden) {
            this.isRunning = true;
            this.rafId = requestAnimationFrame(this.step);
        }
    }

    private stopLoop() {
        this.isRunning = false;
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    private resetAll() {
        this.stopLoop();
        for (const item of this.items.values()) {
            item.currentX = 0;
            item.currentY = 0;
            item.vx = 0;
            item.vy = 0;
            item.element.style.transform = '';
        }
    }

    private step = () => {
        if (!this.isRunning) return;

        let hasActiveMotion = false;
        const now = performance.now();
        const mouseIdle = now - this.lastMouseMoveTime > 600 || this.cursorX < -5000;

        for (const item of this.items.values()) {
            if (!item.isVisible || item.options.disabled || this.isReduced) {
                if (item.currentX !== 0 || item.currentY !== 0) {
                    item.currentX = 0;
                    item.currentY = 0;
                    item.vx = 0;
                    item.vy = 0;
                    item.element.style.transform = '';
                }
                continue;
            }

            // Update rect if dirty
            if (item.rectDirty || !item.rect) {
                item.rect = item.element.getBoundingClientRect();
                item.rectDirty = false;
            }

            const rect = item.rect;
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const dx = this.cursorX - centerX;
            const dy = this.cursorY - centerY;
            const distSq = dx * dx + dy * dy;
            const radius = item.options.radius ?? 160;
            const radiusSq = radius * radius;

            let targetX = 0;
            let targetY = 0;

            // Only attract if mouse is active and within gravitational radius
            if (distSq < radiusSq && !mouseIdle && !this.isScrolling) {
                const dist = Math.sqrt(distSq);
                // Inverse-distance inspired falloff: closer = exponentially stronger pull
                const proximity = 1.0 - (dist / radius);
                const strength = item.options.strength ?? 0.25;
                const force = proximity * proximity * strength;
                const maxPull = item.options.maxPull ?? 10;

                if (dist > 0.001) {
                    targetX = (dx / dist) * Math.min(dist * force, maxPull);
                    targetY = (dy / dist) * Math.min(dist * force, maxPull);
                }
            }

            // Damped harmonic spring physics integration
            const stiffness = item.options.stiffness ?? 0.14;
            const damping = item.options.damping ?? 0.82;

            const ax = (targetX - item.currentX) * stiffness;
            const ay = (targetY - item.currentY) * stiffness;

            item.vx = (item.vx + ax) * damping;
            item.vy = (item.vy + ay) * damping;

            item.currentX += item.vx;
            item.currentY += item.vy;

            // Rest detection
            const speedSq = item.vx * item.vx + item.vy * item.vy;
            const distFromRestSq = item.currentX * item.currentX + item.currentY * item.currentY;

            if (targetX === 0 && targetY === 0 && speedSq < 0.0004 && distFromRestSq < 0.01) {
                if (item.currentX !== 0 || item.currentY !== 0) {
                    item.currentX = 0;
                    item.currentY = 0;
                    item.vx = 0;
                    item.vy = 0;
                    item.element.style.transform = '';
                }
            } else {
                hasActiveMotion = true;
                item.element.style.transform = `translate3d(${item.currentX.toFixed(2)}px, ${item.currentY.toFixed(2)}px, 0)`;
            }
        }

        if (hasActiveMotion) {
            this.rafId = requestAnimationFrame(this.step);
        } else {
            this.isRunning = false;
            this.rafId = null;
        }
    };
}

// Global Singleton Instance
export const gravityEngine = new GravityEngine();

export function registerGravityElement(element: HTMLElement, options?: GravityOptions) {
    return gravityEngine.register(element, options);
}

export function updateGravityElement(element: HTMLElement, options: Partial<GravityOptions>) {
    gravityEngine.update(element, options);
}

export function applyGravityImpulse(element: HTMLElement, forceX: number, forceY: number) {
    gravityEngine.applyImpulse(element, forceX, forceY);
}

