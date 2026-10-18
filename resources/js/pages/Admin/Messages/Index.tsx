import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { DeleteDialog, EmptyState } from '@/components/Admin';
import { Button } from '@/components/ui/button';
import type { MessageItem } from '@/types/admin';
import {
    Mail,
    MailOpen,
    MailCheck,
    Search,
    Trash2,
    Reply,
    CheckCircle2,
    Clock,
    Inbox,
} from 'lucide-react';

interface Props {
    messages: MessageItem[];
    filter: 'all' | 'unread' | 'read';
    search: string;
    counts: {
        all: number;
        unread: number;
        read: number;
    };
    selectedId: number | null;
}

export default function MessagesIndex({
    messages,
    filter,
    search: initialSearch,
    counts,
    selectedId: initialSelectedId,
}: Props) {
    const [search, setSearch] = useState(initialSearch);
    const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(
        () => {
            if (initialSelectedId) {
                return (
                    messages.find((m) => m.id === initialSelectedId) ||
                    messages[0] ||
                    null
                );
            }
            return messages[0] || null;
        },
    );

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState<MessageItem | null>(
        null,
    );

    // Keep selected message in sync if messages update
    React.useEffect(() => {
        if (selectedMessage) {
            const fresh = messages.find((m) => m.id === selectedMessage.id);
            if (fresh) setSelectedMessage(fresh);
            else setSelectedMessage(messages[0] || null);
        } else if (messages.length > 0) {
            setSelectedMessage(messages[0]);
        }
    }, [messages]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/messages',
            { filter, q: search.trim() || undefined },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleFilterChange = (newFilter: 'all' | 'unread' | 'read') => {
        router.get(
            '/admin/messages',
            { filter: newFilter, q: search.trim() || undefined },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleSelectMessage = (msg: MessageItem) => {
        setSelectedMessage(msg);
        // Automatically mark as read if unread
        if (!msg.read_at) {
            router.patch(
                `/admin/messages/${msg.id}/read`,
                {},
                { preserveScroll: true, preserveState: true },
            );
        }
    };

    const handleToggleReadStatus = (msg: MessageItem) => {
        const endpoint = msg.read_at
            ? `/admin/messages/${msg.id}/unread`
            : `/admin/messages/${msg.id}/read`;

        router.patch(
            endpoint,
            {},
            { preserveScroll: true, preserveState: true },
        );
    };

    const confirmDelete = (msg: MessageItem) => {
        setMessageToDelete(msg);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!messageToDelete) return;
        router.delete(`/admin/messages/${messageToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteModalOpen(false);
                setMessageToDelete(null);
            },
        });
    };

    const formatTimestamp = (dateString: string) => {
        try {
            const d = new Date(dateString);
            return d.toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return dateString;
        }
    };

    return (
        <AdminLayout
            title="Messages"
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin' },
                { title: 'Messages Inbox' },
            ]}
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-['Orbitron',sans-serif] text-2xl font-bold tracking-wider text-[var(--text)] sm:text-3xl">
                            COMMUNICATION INBOX (TRANSMISSIONS)
                        </h1>
                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                            Incoming communications and inquiries received via
                            the portfolio contact terminal.
                        </p>
                    </div>
                </div>

                {/* Filter Tabs & Search Bar */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Status filter tabs */}
                    <div className="flex items-center gap-1 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] p-1 backdrop-blur-md">
                        <button
                            type="button"
                            onClick={() => handleFilterChange('all')}
                            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                                filter === 'all'
                                    ? 'bg-[var(--bg-elevated)] text-[var(--secondary)] shadow-sm'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                            }`}
                        >
                            <span>All Transmissions</span>
                            <span className="rounded-md bg-[var(--surface-border)] px-1.5 py-0.5 font-['JetBrains_Mono',monospace] text-[10px]">
                                {counts.all}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleFilterChange('unread')}
                            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                                filter === 'unread'
                                    ? 'bg-[var(--bg-elevated)] text-[var(--danger)] shadow-sm'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                            }`}
                        >
                            <span className="h-2 w-2 rounded-full bg-[var(--danger)]" />
                            <span>Unread</span>
                            <span className="rounded-md bg-[var(--surface-border)] px-1.5 py-0.5 font-['JetBrains_Mono',monospace] text-[10px]">
                                {counts.unread}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleFilterChange('read')}
                            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                                filter === 'read'
                                    ? 'bg-[var(--bg-elevated)] text-[var(--success)] shadow-sm'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                            }`}
                        >
                            <MailOpen className="h-3.5 w-3.5" />
                            <span>Read</span>
                            <span className="rounded-md bg-[var(--surface-border)] px-1.5 py-0.5 font-['JetBrains_Mono',monospace] text-[10px]">
                                {counts.read}
                            </span>
                        </button>
                    </div>

                    {/* Search Bar */}
                    <form
                        onSubmit={handleSearchSubmit}
                        className="relative max-w-md flex-1"
                    >
                        <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search sender, email, subject, body..."
                            className="w-full rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] py-2 pr-4 pl-10 text-xs text-[var(--text)] placeholder-[var(--text-muted)] transition-colors focus:border-[var(--secondary)] focus:outline-none"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    router.get(
                                        '/admin/messages',
                                        { filter },
                                        { preserveState: true },
                                    );
                                }}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-[var(--text-muted)] hover:text-[var(--text)]"
                            >
                                Clear
                            </button>
                        )}
                    </form>
                </div>

                {/* Two-Pane Inbox Layout */}
                {messages.length === 0 ? (
                    <EmptyState
                        title="No messages found"
                        description={
                            search
                                ? `No transmissions match "${search}".`
                                : filter === 'unread'
                                  ? 'All caught up! There are no unread inquiries.'
                                  : 'No contact transmissions in the inbox.'
                        }
                    />
                ) : (
                    <div className="grid min-h-[580px] grid-cols-1 gap-6 lg:grid-cols-12">
                        {/* Left Pane: Message List (5 cols) */}
                        <div className="flex max-h-[750px] flex-col overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] backdrop-blur-md lg:col-span-5">
                            <div className="flex items-center justify-between border-b border-[var(--surface-border)] bg-[var(--bg-elevated)]/60 p-3.5">
                                <span className="font-['Orbitron',sans-serif] text-xs font-bold text-[var(--text)]">
                                    INCOMING TRANSMISSIONS ({messages.length})
                                </span>
                            </div>

                            <div className="flex-1 space-y-1 divide-y divide-[var(--surface-border)] overflow-y-auto p-2">
                                {messages.map((msg) => {
                                    const isSelected =
                                        selectedMessage?.id === msg.id;
                                    const isUnread = !msg.read_at;

                                    return (
                                        <div
                                            key={msg.id}
                                            onClick={() =>
                                                handleSelectMessage(msg)
                                            }
                                            className={`group relative flex cursor-pointer flex-col gap-1 rounded-xl p-3.5 transition-all duration-150 ${
                                                isSelected
                                                    ? 'border border-[var(--secondary)]/60 bg-[var(--surface-active)] shadow-sm'
                                                    : 'border border-transparent hover:bg-[var(--surface-hover)]'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex min-w-0 items-center gap-2">
                                                    {isUnread && (
                                                        <span
                                                            className="h-2 w-2 shrink-0 rounded-full bg-[var(--secondary)]"
                                                            title="Unread"
                                                        />
                                                    )}
                                                    <span
                                                        className={`truncate text-xs ${
                                                            isUnread
                                                                ? 'font-bold text-[var(--text)]'
                                                                : 'font-medium text-[var(--text-muted)]'
                                                        }`}
                                                    >
                                                        {msg.name}
                                                    </span>
                                                </div>

                                                <span className="shrink-0 font-['JetBrains_Mono',monospace] text-[10px] text-[var(--text-muted)]">
                                                    {msg.created_at.slice(
                                                        5,
                                                        10,
                                                    )}
                                                </span>
                                            </div>

                                            <h4
                                                className={`truncate text-xs ${
                                                    isUnread
                                                        ? 'font-semibold text-[var(--secondary)]'
                                                        : 'text-[var(--text)]'
                                                }`}
                                            >
                                                {msg.subject || '(No Subject)'}
                                            </h4>

                                            <p className="line-clamp-2 text-[11px] text-[var(--text-muted)]">
                                                {msg.body}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Pane: Message Detail View (7 cols) */}
                        <div className="flex min-h-[500px] flex-col overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] backdrop-blur-md lg:col-span-7">
                            {selectedMessage ? (
                                <div className="flex h-full flex-col">
                                    {/* Detail Header */}
                                    <div className="space-y-4 border-b border-[var(--surface-border)] bg-[var(--bg-elevated)]/60 p-6">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <h3 className="font-['Orbitron',sans-serif] text-base font-bold text-[var(--text)]">
                                                    {selectedMessage.subject ||
                                                        '(No Subject Provided)'}
                                                </h3>
                                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                                    <span className="text-xs font-semibold text-[var(--secondary)]">
                                                        {selectedMessage.name}
                                                    </span>
                                                    <span className="text-xs text-[var(--text-muted)]">
                                                        &lt;
                                                        {selectedMessage.email}
                                                        &gt;
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2">
                                                {/* Reply via mailto: */}
                                                <a
                                                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                                                        selectedMessage.subject ||
                                                            'Portfolio Inquiry',
                                                    )}`}
                                                    className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--secondary)] px-3 py-1.5 font-['Orbitron',sans-serif] text-xs font-bold text-black transition-colors hover:bg-[var(--secondary)]/90"
                                                    title="Reply to message"
                                                >
                                                    <Reply className="h-3.5 w-3.5" />
                                                    REPLY
                                                </a>

                                                {/* Mark read / unread */}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleToggleReadStatus(
                                                            selectedMessage,
                                                        )
                                                    }
                                                    className="h-8 border-[var(--surface-border)] text-xs text-[var(--text)] hover:bg-[var(--surface-border)]"
                                                    title={
                                                        selectedMessage.read_at
                                                            ? 'Mark as unread'
                                                            : 'Mark as read'
                                                    }
                                                >
                                                    {selectedMessage.read_at ? (
                                                        <>
                                                            <Mail className="mr-1.5 h-3.5 w-3.5" />
                                                            Mark Unread
                                                        </>
                                                    ) : (
                                                        <>
                                                            <MailCheck className="mr-1.5 h-3.5 w-3.5" />
                                                            Mark Read
                                                        </>
                                                    )}
                                                </Button>

                                                {/* Delete message */}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        confirmDelete(
                                                            selectedMessage,
                                                        )
                                                    }
                                                    className="h-8 text-xs text-[var(--danger)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]"
                                                    title="Delete transmission"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Telemetry info (timestamp, IP address) */}
                                        <div className="flex flex-wrap items-center gap-4 pt-1 font-['JetBrains_Mono',monospace] text-[10px] text-[var(--text-muted)]">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                Received:{' '}
                                                {formatTimestamp(
                                                    selectedMessage.created_at,
                                                )}
                                            </span>
                                            {selectedMessage.read_at && (
                                                <span className="flex items-center gap-1 text-[var(--success)]">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Read:{' '}
                                                    {formatTimestamp(
                                                        selectedMessage.read_at,
                                                    )}
                                                </span>
                                            )}
                                            {selectedMessage.ip_address && (
                                                <span>
                                                    IP:{' '}
                                                    {selectedMessage.ip_address}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Detail Body */}
                                    <div className="flex-1 overflow-y-auto p-6">
                                        <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] p-5">
                                            <p className="font-sans text-sm leading-relaxed whitespace-pre-wrap text-[var(--text)]">
                                                {selectedMessage.body}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center space-y-2 p-12 text-center text-[var(--text-muted)]">
                                    <Inbox className="h-10 w-10 text-[var(--text-muted)]/50" />
                                    <p className="font-['Orbitron',sans-serif] text-sm font-bold">
                                        NO TRANSMISSION SELECTED
                                    </p>
                                    <p className="text-xs">
                                        Select a message from the list to view
                                        its contents and reply.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Dialog */}
            <DeleteDialog
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onConfirm={handleDeleteConfirm}
                title="Delete Transmission?"
                description={
                    messageToDelete
                        ? `Are you sure you want to delete the message from "${messageToDelete.name}"?`
                        : ''
                }
            />
        </AdminLayout>
    );
}
