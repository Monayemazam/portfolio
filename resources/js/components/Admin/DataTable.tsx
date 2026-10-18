import React, { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import EmptyState from './EmptyState';
import { Button } from '@/components/ui/button';

export interface Column<T> {
    key: string;
    header: string;
    render?: (item: T) => ReactNode;
    className?: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links?: PaginationLink[];
    from?: number | null;
    to?: number | null;
    total?: number;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    pagination?: PaginationProps;
    search?: string;
    onSearchChange?: (query: string) => void;
    searchPlaceholder?: string;
    primaryAction?: {
        label: string;
        href?: string;
        onClick?: () => void;
    };
    emptyState?: {
        title: string;
        description: string;
        actionLabel?: string;
        actionHref?: string;
        onAction?: () => void;
    };
    keyExtractor: (item: T) => string | number;
    actionsHeader?: string;
}

export default function DataTable<T>({
    data,
    columns,
    pagination,
    search,
    onSearchChange,
    searchPlaceholder = 'Search records...',
    primaryAction,
    emptyState = {
        title: 'No records found',
        description: 'There are no items to display yet.',
    },
    keyExtractor,
}: DataTableProps<T>) {
    return (
        <div className="space-y-4">
            {/* Top Bar with Search & Action */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {onSearchChange !== undefined && (
                    <div className="relative w-full max-w-sm">
                        <input
                            type="search"
                            value={search ?? ''}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="h-10 w-full rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] pr-4 pl-10 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:ring-2 focus:ring-[var(--secondary)] focus:outline-none"
                        />
                        <svg
                            className="absolute top-3 left-3.5 h-4 w-4 text-[var(--text-muted)]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                )}

                {primaryAction && (
                    <div className="sm:ml-auto">
                        {primaryAction.href ? (
                            <Button
                                asChild
                                className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] font-medium text-white shadow-md hover:opacity-90"
                            >
                                <Link href={primaryAction.href}>
                                    {primaryAction.label}
                                </Link>
                            </Button>
                        ) : (
                            <Button
                                onClick={primaryAction.onClick}
                                className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] font-medium text-white shadow-md hover:opacity-90"
                            >
                                {primaryAction.label}
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Table or Empty State */}
            {data.length === 0 ? (
                <EmptyState
                    title={emptyState.title}
                    description={emptyState.description}
                    actionLabel={emptyState.actionLabel ?? primaryAction?.label}
                    actionHref={emptyState.actionHref ?? primaryAction?.href}
                    onAction={emptyState.onAction ?? primaryAction?.onClick}
                />
            ) : (
                <div className="overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] shadow-lg backdrop-blur-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-[var(--surface-border)] bg-[var(--bg-elevated)]/60 text-xs tracking-wider text-[var(--text-muted)] uppercase">
                                <tr>
                                    {columns.map((col) => (
                                        <th
                                            key={col.key}
                                            className={`px-6 py-4 font-['JetBrains_Mono',monospace] font-semibold ${
                                                col.className ?? ''
                                            }`}
                                        >
                                            {col.header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--surface-border)]">
                                {data.map((item) => (
                                    <tr
                                        key={keyExtractor(item)}
                                        className="transition-colors hover:bg-[var(--surface)]/80"
                                    >
                                        {columns.map((col) => (
                                            <td
                                                key={col.key}
                                                className={`px-6 py-4 text-[var(--text)] ${
                                                    col.className ?? ''
                                                }`}
                                            >
                                                {col.render
                                                    ? col.render(item)
                                                    : ((
                                                          item as Record<
                                                              string,
                                                              unknown
                                                          >
                                                      )[col.key] as ReactNode)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination &&
                        pagination.links &&
                        pagination.links.length > 3 && (
                            <div className="flex flex-col items-center justify-between gap-3 border-t border-[var(--surface-border)] px-6 py-4 sm:flex-row">
                                <div className="font-['JetBrains_Mono',monospace] text-xs text-[var(--text-muted)]">
                                    Showing {pagination.from ?? 0} to{' '}
                                    {pagination.to ?? 0} of{' '}
                                    {pagination.total ?? 0} entries
                                </div>
                                <div className="flex flex-wrap items-center gap-1">
                                    {pagination.links.map((link, idx) => {
                                        if (!link.url) {
                                            return (
                                                <span
                                                    key={idx}
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                    className="inline-flex h-8 items-center justify-center rounded-lg px-3 text-xs text-[var(--text-muted)]/50"
                                                />
                                            );
                                        }

                                        return (
                                            <Link
                                                key={idx}
                                                href={link.url}
                                                preserveState
                                                preserveScroll
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                                className={`inline-flex h-8 items-center justify-center rounded-lg px-3 text-xs font-medium transition-colors ${
                                                    link.active
                                                        ? 'bg-[var(--primary)] text-white shadow-sm'
                                                        : 'border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-border)]'
                                                }`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                </div>
            )}
        </div>
    );
}
