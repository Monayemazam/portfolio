import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: ReactNode;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
}

export default function EmptyState({
    title,
    description,
    icon,
    actionLabel,
    actionHref,
    onAction,
}: EmptyStateProps) {
    return (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-8 text-center backdrop-blur-md">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] text-[var(--secondary)] shadow-[var(--primary)]/10 shadow-lg">
                {icon || (
                    <svg
                        className="h-8 w-8 stroke-[1.5]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                        />
                    </svg>
                )}
            </div>

            <h3 className="font-['Orbitron',sans-serif] text-lg font-semibold tracking-wide text-[var(--text)]">
                {title}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-[var(--text-muted)]">
                {description}
            </p>

            {actionLabel && (actionHref || onAction) && (
                <div className="mt-6">
                    {actionHref ? (
                        <Button
                            asChild
                            className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-md hover:opacity-90"
                        >
                            <Link href={actionHref}>{actionLabel}</Link>
                        </Button>
                    ) : (
                        <Button
                            onClick={onAction}
                            className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-md hover:opacity-90"
                        >
                            {actionLabel}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
