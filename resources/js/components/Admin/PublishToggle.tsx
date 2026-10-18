interface PublishToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
    showStatusText?: boolean;
}

export default function PublishToggle({
    checked,
    onChange,
    label,
    disabled = false,
    showStatusText = true,
}: PublishToggleProps) {
    return (
        <div className="flex items-center gap-3">
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => !disabled && onChange(!checked)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-[var(--secondary)] focus:ring-offset-2 focus:ring-offset-[var(--bg)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                    checked
                        ? 'bg-[var(--success)]'
                        : 'bg-[var(--surface-border)]'
                }`}
            >
                <span className="sr-only">
                    {label || 'Toggle published status'}
                </span>
                <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        checked ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
            </button>

            {showStatusText && (
                <span
                    className={`font-['JetBrains_Mono',monospace] text-xs font-semibold tracking-wider uppercase ${
                        checked
                            ? 'text-[var(--success)]'
                            : 'text-[var(--text-muted)]'
                    }`}
                >
                    {checked ? 'Published' : 'Draft'}
                </span>
            )}
        </div>
    );
}
