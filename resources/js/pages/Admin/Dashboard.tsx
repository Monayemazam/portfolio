import { Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import {
    FolderGit2,
    Mail,
    Code2,
    Image as ImageIcon,
    ArrowUpRight,
    Sparkles,
    Sliders,
    Layers,
    Cpu,
    CheckCircle2,
} from 'lucide-react';
import type {
    DashboardCounts,
    RecentMessage,
    RecentProject,
    SystemTelemetry,
} from '@/types/admin';

interface DashboardProps {
    counts: DashboardCounts;
    recent_messages: RecentMessage[];
    recent_projects: RecentProject[];
    system: SystemTelemetry;
}

export default function Dashboard({
    counts,
    recent_messages,
    recent_projects,
    system,
}: DashboardProps) {
    const countCards = [
        {
            title: 'Published Projects',
            count: counts.published_projects,
            total: counts.total_projects,
            sub: `${counts.published_projects} of ${counts.total_projects} published`,
            icon: FolderGit2,
            href: '/admin/projects',
            accent: 'text-[var(--secondary)]',
            border: 'hover:border-[var(--secondary)]',
        },
        {
            title: 'Unread Messages',
            count: counts.unread_messages,
            total: counts.total_messages,
            sub:
                counts.unread_messages > 0
                    ? 'Requires attention'
                    : 'Inbox clear',
            icon: Mail,
            href: '/admin/messages',
            accent:
                counts.unread_messages > 0
                    ? 'text-[var(--accent)]'
                    : 'text-[var(--success)]',
            border:
                counts.unread_messages > 0
                    ? 'border-[var(--accent)]/50'
                    : 'hover:border-[var(--success)]',
        },
        {
            title: 'Technical Skills',
            count: counts.skills,
            sub: 'Across all categories',
            icon: Code2,
            href: '/admin/skills',
            accent: 'text-[var(--primary)]',
            border: 'hover:border-[var(--primary)]',
        },
        {
            title: 'Media Assets',
            count: counts.media,
            sub: 'Images, videos & docs',
            icon: ImageIcon,
            href: '/admin/media',
            accent: 'text-[var(--secondary)]',
            border: 'hover:border-[var(--secondary)]',
        },
    ];

    const quickLinks = [
        {
            title: 'Upload Media',
            desc: 'Add screenshots, resume or photos',
            href: '/admin/media',
            icon: ImageIcon,
        },
        {
            title: 'Hero Section',
            desc: 'Edit introduction and rotating titles',
            href: '/admin/hero',
            icon: Sparkles,
        },
        {
            title: 'Projects',
            desc: 'Manage solar system planets & details',
            href: '/admin/projects',
            icon: FolderGit2,
        },
        {
            title: 'Page Sections',
            desc: 'Reorder or hide portfolio sections',
            href: '/admin/sections',
            icon: Layers,
        },
        {
            title: 'Site Settings',
            desc: 'Theme colors, contacts, social URLs',
            href: '/admin/settings',
            icon: Sliders,
        },
    ];

    return (
        <AdminLayout
            title="Dashboard"
            breadcrumbs={[{ title: 'Dashboard', href: '/admin' }]}
        >
            {/* Header Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 backdrop-blur-xl sm:p-8">
                <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center rounded-full bg-[var(--success)]/10 px-2.5 py-0.5 font-['JetBrains_Mono',monospace] text-[10px] font-bold tracking-wider text-[var(--success)] uppercase">
                                <CheckCircle2 className="mr-1 h-3 w-3" /> System
                                Operational
                            </span>
                            <span className="font-['JetBrains_Mono',monospace] text-xs text-[var(--text-muted)]">
                                Mission Time:{' '}
                                {new Date(
                                    system.server_time,
                                ).toLocaleDateString()}
                            </span>
                        </div>
                        <h1 className="mt-2 font-['Orbitron',sans-serif] text-2xl font-black tracking-tight text-[var(--text)] sm:text-3xl">
                            MISSION CONTROL
                        </h1>
                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                            Single command center for your high-performance
                            space portfolio.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/media"
                            className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-5 text-xs font-semibold text-white shadow-[var(--primary)]/20 shadow-lg transition-all hover:opacity-90"
                        >
                            Open Media Library
                        </Link>
                    </div>
                </div>
            </div>

            {/* Count Cards Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {countCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link
                            key={card.title}
                            href={card.href}
                            className={`group relative overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-5 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-[var(--primary)]/5 hover:shadow-xl ${card.border}`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-['JetBrains_Mono',monospace] text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                                    {card.title}
                                </span>
                                <div
                                    className={`flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--bg-elevated)] ${card.accent} shadow-sm`}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>
                            </div>

                            <div className="mt-4 flex items-baseline gap-2">
                                <span className="font-['Orbitron',sans-serif] text-3xl font-extrabold text-[var(--text)]">
                                    {card.count}
                                </span>
                            </div>

                            <div className="mt-2 flex items-center justify-between text-xs text-[var(--text-muted)]">
                                <span>{card.sub}</span>
                                <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Two-Column Area: Quick Links + Recent Messages / Projects */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Quick Launchpad (1 col) */}
                <div className="space-y-4">
                    <h2 className="font-['Orbitron',sans-serif] text-sm font-bold tracking-wider text-[var(--text)] uppercase">
                        Launchpad Quick Links
                    </h2>
                    <div className="space-y-2.5">
                        {quickLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.title}
                                    href={link.href}
                                    className="group flex items-center justify-between rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-4 backdrop-blur-xl transition-all hover:border-[var(--secondary)]/60 hover:bg-[var(--surface)]/90"
                                >
                                    <div className="flex items-center gap-3.5">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-elevated)] text-[var(--secondary)] shadow-sm">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-[var(--text)] group-hover:text-[var(--secondary)]">
                                                {link.title}
                                            </p>
                                            <p className="text-[11px] text-[var(--text-muted)]">
                                                {link.desc}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="font-['JetBrains_Mono',monospace] text-xs text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5">
                                        →
                                    </span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Telemetry Card */}
                    <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-4 backdrop-blur-xl">
                        <div className="flex items-center gap-2 text-[var(--text-muted)]">
                            <Cpu className="h-4 w-4 text-[var(--secondary)]" />
                            <span className="font-['JetBrains_Mono',monospace] text-xs font-semibold tracking-wider text-[var(--text)] uppercase">
                                Telemetry
                            </span>
                        </div>
                        <div className="mt-3 space-y-1.5 font-['JetBrains_Mono',monospace] text-[11px] text-[var(--text-muted)]">
                            <div className="flex justify-between">
                                <span>PHP Engine:</span>
                                <span className="text-[var(--text)]">
                                    {system.php_version}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Framework:</span>
                                <span className="text-[var(--text)]">
                                    Laravel {system.laravel_version}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Environment:</span>
                                <span className="text-[var(--success)]">
                                    {system.environment}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Inquiries & Projects (2 cols) */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Recent Contact Form Messages */}
                    <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 backdrop-blur-xl">
                        <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-4">
                            <div>
                                <h3 className="font-['Orbitron',sans-serif] text-sm font-bold text-[var(--text)]">
                                    Recent Inquiries
                                </h3>
                                <p className="text-xs text-[var(--text-muted)]">
                                    Submissions from public contact channel
                                </p>
                            </div>
                            <Link
                                href="/admin/messages"
                                className="font-['JetBrains_Mono',monospace] text-xs text-[var(--secondary)] hover:underline"
                            >
                                View all ({counts.total_messages}) →
                            </Link>
                        </div>

                        {recent_messages.length === 0 ? (
                            <div className="py-8 text-center text-xs text-[var(--text-muted)]">
                                No contact submissions yet. Inbox is clean.
                            </div>
                        ) : (
                            <div className="divide-y divide-[var(--surface-border)]">
                                {recent_messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className="flex items-center justify-between py-3.5"
                                    >
                                        <div className="min-w-0 flex-1 pr-4">
                                            <div className="flex items-center gap-2">
                                                {!msg.read_at && (
                                                    <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[var(--accent)] shadow-sm" />
                                                )}
                                                <p className="truncate text-xs font-semibold text-[var(--text)]">
                                                    {msg.name}
                                                </p>
                                                <span className="font-['JetBrains_Mono',monospace] text-[10px] text-[var(--text-muted)]">
                                                    ({msg.email})
                                                </span>
                                            </div>
                                            <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">
                                                {msg.subject || '(No subject)'}
                                            </p>
                                        </div>
                                        <span className="font-['JetBrains_Mono',monospace] text-[10px] text-[var(--text-muted)]">
                                            {new Date(
                                                msg.created_at,
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Solar System Projects Overview */}
                    <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 backdrop-blur-xl">
                        <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-4">
                            <div>
                                <h3 className="font-['Orbitron',sans-serif] text-sm font-bold text-[var(--text)]">
                                    Solar System Projects
                                </h3>
                                <p className="text-xs text-[var(--text-muted)]">
                                    Active portfolio planets
                                </p>
                            </div>
                            <Link
                                href="/admin/projects"
                                className="font-['JetBrains_Mono',monospace] text-xs text-[var(--secondary)] hover:underline"
                            >
                                Manage all ({counts.total_projects}) →
                            </Link>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {recent_projects.map((proj) => (
                                <div
                                    key={proj.id}
                                    className="flex items-center justify-between rounded-xl border border-[var(--surface-border)] bg-[var(--bg-elevated)]/60 p-3.5"
                                >
                                    <div>
                                        <p className="font-['Orbitron',sans-serif] text-xs font-bold text-[var(--text)]">
                                            {proj.title}
                                        </p>
                                        <p className="font-['JetBrains_Mono',monospace] text-[10px] text-[var(--secondary)]">
                                            Planet: {proj.planet_style}
                                        </p>
                                    </div>
                                    <span
                                        className={`rounded px-1.5 py-0.5 font-['JetBrains_Mono',monospace] text-[9px] font-bold tracking-wider uppercase ${
                                            proj.is_published
                                                ? 'bg-[var(--success)]/10 text-[var(--success)]'
                                                : 'bg-[var(--surface-border)] text-[var(--text-muted)]'
                                        }`}
                                    >
                                        {proj.is_published
                                            ? 'Published'
                                            : 'Draft'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
