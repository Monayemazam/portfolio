import { ReactNode, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { useAppearance } from '@/hooks/use-appearance';
import { Toaster } from '@/components/ui/sonner';
import {
    LayoutDashboard,
    Image as ImageIcon,
    Sliders,
    Layers,
    Sparkles,
    User as UserIcon,
    Code2,
    FolderGit2,
    Wrench,
    Briefcase,
    GitMerge,
    MessageSquareQuote,
    Mail,
    ExternalLink,
    Moon,
    Sun,
    LogOut,
    Menu,
    X,
    Globe,
} from 'lucide-react';
import type { BreadcrumbItem } from '@/types/navigation';

interface AdminLayoutProps {
    title: string;
    breadcrumbs?: BreadcrumbItem[];
    children: ReactNode;
}

export default function AdminLayout({
    title,
    breadcrumbs = [],
    children,
}: AdminLayoutProps) {
    const page = usePage();
    const { auth } = page.props as {
        auth: { user: { name: string; email: string } };
    };
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isCurrentUrl = (path: string) => {
        const url = page.url.split('?')[0];
        if (path === '/admin') {
            return url === '/admin' || url === '/admin/';
        }
        return url.startsWith(path);
    };

    const navItems = [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
        { label: 'Site Settings', href: '/admin/settings', icon: Sliders },
        { label: 'Sections', href: '/admin/sections', icon: Layers },
        { label: 'Hero Content', href: '/admin/hero', icon: Sparkles },
        { label: 'About & Facts', href: '/admin/about', icon: UserIcon },
        { label: 'Skills', href: '/admin/skills', icon: Code2 },
        { label: 'Projects', href: '/admin/projects', icon: FolderGit2 },
        { label: 'Services', href: '/admin/services', icon: Wrench },
        { label: 'Experience', href: '/admin/experience', icon: Briefcase },
        { label: 'Process Steps', href: '/admin/process', icon: GitMerge },
        {
            label: 'Testimonials',
            href: '/admin/testimonials',
            icon: MessageSquareQuote,
        },
        { label: 'SEO & Meta', href: '/admin/seo', icon: Globe },
        { label: 'Messages', href: '/admin/messages', icon: Mail },
    ];

    const toggleTheme = () => {
        const next = resolvedAppearance === 'dark' ? 'light' : 'dark';
        updateAppearance(next);
    };

    return (
        <div className="admin-bg-quiet flex min-h-screen w-full flex-col font-['Inter',sans-serif] text-[var(--text)] antialiased md:flex-row">
            <Head title={`${title} - Mission Control`} />
            <Toaster />

            {/* Mobile Top Header */}
            <header className="flex h-16 w-full items-center justify-between border-b border-[var(--surface-border)] bg-[var(--bg-elevated)]/90 px-4 backdrop-blur-xl md:hidden">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] text-white shadow-sm">
                        <span className="font-['Orbitron',sans-serif] text-xs font-bold">
                            M
                        </span>
                    </div>
                    <span className="font-['Orbitron',sans-serif] text-sm font-bold tracking-wider text-[var(--text)]">
                        MISSION CONTROL
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text)]"
                    >
                        {resolvedAppearance === 'dark' ? (
                            <Sun className="h-4 w-4" />
                        ) : (
                            <Moon className="h-4 w-4" />
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle navigation menu"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text)]"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </header>

            {/* Sidebar (Desktop and Mobile Drawer) */}
            <aside
                aria-label="Sidebar navigation"
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[var(--surface-border)] bg-[var(--bg-elevated)]/95 backdrop-blur-2xl transition-transform duration-300 md:static md:translate-x-0 ${
                    mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Brand Logo */}
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--surface-border)] px-6">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] text-white shadow-[var(--primary)]/20 shadow-md">
                            <span className="font-['Orbitron',sans-serif] text-sm font-black">
                                MA
                            </span>
                        </div>
                        <div>
                            <p className="font-['Orbitron',sans-serif] text-xs font-bold tracking-wider text-[var(--text)]">
                                MONAYEM AZAM
                            </p>
                            <p className="font-['JetBrains_Mono',monospace] text-[10px] font-semibold tracking-widest text-[var(--secondary)]">
                                MISSION CONTROL
                            </p>
                        </div>
                    </Link>
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(false)}
                        aria-label="Close menu"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] md:hidden"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Nav Links */}
                <div className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
                    <p className="px-3 py-1 font-['JetBrains_Mono',monospace] text-[10px] font-semibold tracking-widest text-[var(--text-muted)] uppercase">
                        Modules
                    </p>
                    {navItems.map((item) => {
                        const active = isCurrentUrl(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                                    active
                                        ? 'border border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary)]/20 to-[var(--secondary)]/10 text-[var(--text)] shadow-sm'
                                        : 'text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]'
                                }`}
                            >
                                <Icon
                                    className={`h-4 w-4 transition-colors ${
                                        active
                                            ? 'text-[var(--secondary)]'
                                            : 'text-[var(--text-muted)] group-hover:text-[var(--text)]'
                                    }`}
                                />
                                <span>{item.label}</span>
                                {item.label === 'Messages' &&
                                Boolean(
                                    (
                                        page.props as {
                                            unread_messages_count?: number;
                                        }
                                    ).unread_messages_count,
                                ) ? (
                                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--danger)] px-1.5 font-['JetBrains_Mono',monospace] text-[10px] font-bold text-white shadow-sm">
                                        {
                                            (
                                                page.props as {
                                                    unread_messages_count?: number;
                                                }
                                            ).unread_messages_count
                                        }
                                    </span>
                                ) : active ? (
                                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--secondary)] shadow-[var(--secondary)] shadow-sm" />
                                ) : null}
                            </Link>
                        );
                    })}

                    <div className="pt-4">
                        <p className="px-3 py-1 font-['JetBrains_Mono',monospace] text-[10px] font-semibold tracking-widest text-[var(--text-muted)] uppercase">
                            Public Page
                        </p>
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text)]"
                        >
                            <span className="flex items-center gap-3">
                                <ExternalLink className="h-4 w-4 text-[var(--text-muted)]" />
                                View Live Portfolio
                            </span>
                            <span className="font-['JetBrains_Mono',monospace] text-[10px] text-[var(--secondary)]">
                                ↗
                            </span>
                        </a>
                    </div>
                </div>

                {/* Footer User Info & Controls */}
                <div className="border-t border-[var(--surface-border)] bg-[var(--surface)]/30 p-4">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1 pr-2">
                            <p className="truncate text-xs font-semibold text-[var(--text)]">
                                {auth?.user?.name || 'Owner'}
                            </p>
                            <p className="truncate font-['JetBrains_Mono',monospace] text-[10px] text-[var(--text-muted)]">
                                {auth?.user?.email}
                            </p>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text)]"
                                title={`Switch to ${resolvedAppearance === 'dark' ? 'Light' : 'Dark'} theme`}
                            >
                                {resolvedAppearance === 'dark' ? (
                                    <Sun className="h-4 w-4 text-[var(--accent)]" />
                                ) : (
                                    <Moon className="h-4 w-4 text-[var(--primary)]" />
                                )}
                            </button>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]"
                                title="Log out"
                            >
                                <LogOut className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile backdrop */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top Desktop Bar */}
                <header className="hidden h-16 items-center justify-between border-b border-[var(--surface-border)] bg-[var(--bg-elevated)]/60 px-8 backdrop-blur-xl md:flex">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-xs">
                        <Link
                            href="/admin"
                            className="font-['JetBrains_Mono',monospace] text-[var(--text-muted)] hover:text-[var(--text)]"
                        >
                            ADMIN
                        </Link>
                        {breadcrumbs.map((crumb, idx) => (
                            <span key={idx} className="flex items-center gap-2">
                                <span className="text-[var(--surface-border)]">
                                    /
                                </span>
                                {crumb.href ? (
                                    <Link
                                        href={crumb.href}
                                        className="font-['JetBrains_Mono',monospace] text-[var(--text-muted)] hover:text-[var(--text)]"
                                    >
                                        {crumb.title.toUpperCase()}
                                    </Link>
                                ) : (
                                    <span className="font-['JetBrains_Mono',monospace] font-semibold text-[var(--secondary)]">
                                        {crumb.title.toUpperCase()}
                                    </span>
                                )}
                            </span>
                        ))}
                    </nav>

                    {/* Top Right Quick Actions */}
                    <div className="flex items-center gap-4">
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--secondary)]/60 hover:text-[var(--text)]"
                        >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span>Live Page</span>
                        </a>

                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text)] transition-colors hover:border-[var(--secondary)]"
                            title={`Switch to ${resolvedAppearance === 'dark' ? 'Light' : 'Dark'} theme`}
                        >
                            {resolvedAppearance === 'dark' ? (
                                <Sun className="h-4 w-4 text-[var(--accent)]" />
                            ) : (
                                <Moon className="h-4 w-4 text-[var(--primary)]" />
                            )}
                        </button>
                    </div>
                </header>

                {/* Main Content Body */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
