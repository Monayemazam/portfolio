import React, { useMemo, useState } from 'react';
import * as LineIcons from 'lineicons-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface IconPickerProps {
    value?: string;
    onChange: (iconName: string) => void;
    label?: string;
    error?: string;
}

export default function IconPicker({
    value,
    onChange,
    label = 'Select icon',
    error,
}: IconPickerProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const iconList = useMemo(() => {
        return Object.keys(LineIcons)
            .filter((key) => {
                const item = (LineIcons as Record<string, unknown>)[key];
                return (
                    typeof item === 'function' ||
                    (typeof item === 'object' && item !== null)
                );
            })
            .sort();
    }, []);

    const filteredIcons = useMemo(() => {
        if (!search.trim()) {
            return iconList.slice(0, 120);
        }
        const query = search.toLowerCase();
        return iconList
            .filter((name) => name.toLowerCase().includes(query))
            .slice(0, 120);
    }, [iconList, search]);

    const iconMap = LineIcons as unknown as Record<
        string,
        React.ComponentType<{ className?: string }>
    >;
    const SelectedIconComponent = value ? iconMap[value] : null;

    return (
        <div>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex h-12 w-full items-center justify-between rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] px-4 text-sm text-[var(--text)] transition-colors hover:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)] focus:outline-none"
            >
                <div className="flex items-center gap-3">
                    {SelectedIconComponent ? (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--secondary)]">
                            <SelectedIconComponent className="h-5 w-5" />
                        </div>
                    ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-dashed border-[var(--surface-border)] text-xs text-[var(--text-muted)]">
                            ?
                        </div>
                    )}
                    <span className="font-['JetBrains_Mono',monospace] text-xs">
                        {value || label}
                    </span>
                </div>
                <span className="text-xs text-[var(--text-muted)]">Change</span>
            </button>

            {error && (
                <p className="font-['JetBrains_Mono',monospace] text-xs text-[var(--danger)]">
                    {error}
                </p>
            )}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-h-[85vh] border-[var(--surface-border)] bg-[var(--bg-elevated)] p-6 backdrop-blur-2xl sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-['Orbitron',sans-serif] text-base font-bold text-[var(--text)]">
                            Choose Lineicon (Outline)
                        </DialogTitle>
                    </DialogHeader>

                    <div className="my-2">
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search 600+ Lineicons (e.g. Code, Database, Rocket, Cloud)..."
                            className="h-11 w-full rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] px-4 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:ring-2 focus:ring-[var(--secondary)] focus:outline-none"
                        />
                    </div>

                    <div className="mt-2 grid max-h-[50vh] grid-cols-4 gap-2 overflow-y-auto p-1 sm:grid-cols-6">
                        {filteredIcons.map((name) => {
                            const IconCmp = iconMap[name];
                            if (!IconCmp) return null;
                            const isSelected = value === name;

                            return (
                                <button
                                    key={name}
                                    type="button"
                                    onClick={() => {
                                        onChange(name);
                                        setOpen(false);
                                    }}
                                    className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-2.5 transition-all ${
                                        isSelected
                                            ? 'border-[var(--secondary)] bg-[var(--primary)]/20 text-[var(--secondary)] shadow-sm'
                                            : 'border-[var(--surface-border)] bg-[var(--surface)]/50 text-[var(--text)] hover:border-[var(--secondary)]/60 hover:bg-[var(--surface)]'
                                    }`}
                                    title={name}
                                >
                                    <IconCmp className="h-6 w-6" />
                                    <span className="w-full truncate text-center font-['JetBrains_Mono',monospace] text-[10px] text-[var(--text-muted)]">
                                        {name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-[var(--surface-border)] pt-3 text-xs text-[var(--text-muted)]">
                        <span>
                            Showing {filteredIcons.length} of {iconList.length}{' '}
                            icons
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setOpen(false)}
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
