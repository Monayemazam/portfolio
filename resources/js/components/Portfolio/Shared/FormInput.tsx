import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    success?: boolean;
    helperText?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
    (
        { label, error, success, helperText, className = '', id, ...props },
        ref,
    ) => {
        const inputId =
            id ||
            (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="mb-1.5 block font-mono text-xs tracking-wider text-[var(--text-muted)] uppercase"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        ref={ref}
                        id={inputId}
                        className={`h-12 w-full rounded-lg border bg-[var(--surface)] px-4 text-sm text-[var(--text)] placeholder-[var(--text-muted)]/60 backdrop-blur-sm transition-all duration-200 outline-none ${
                            error
                                ? 'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-2 focus:ring-[var(--danger)]/30'
                                : success
                                  ? 'border-[var(--success)] focus:border-[var(--success)] focus:ring-2 focus:ring-[var(--success)]/30'
                                  : 'border-[var(--surface-border)] focus:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)]/30'
                        } ${className}`}
                        {...props}
                    />
                    {success && (
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[var(--success)]">
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    )}
                </div>
                {error && (
                    <p className="mt-1.5 font-mono text-xs text-[var(--danger)]">
                        {error}
                    </p>
                )}
                {!error && helperText && (
                    <p className="mt-1.5 text-xs text-[var(--text-muted)]">
                        {helperText}
                    </p>
                )}
            </div>
        );
    },
);

FormInput.displayName = 'FormInput';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const FormTextarea = React.forwardRef<
    HTMLTextAreaElement,
    FormTextareaProps
>(
    (
        { label, error, helperText, className = '', id, rows = 4, ...props },
        ref,
    ) => {
        const inputId =
            id ||
            (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="mb-1.5 block font-mono text-xs tracking-wider text-[var(--text-muted)] uppercase"
                    >
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={inputId}
                    rows={rows}
                    className={`w-full rounded-lg border bg-[var(--surface)] p-4 text-sm text-[var(--text)] placeholder-[var(--text-muted)]/60 backdrop-blur-sm transition-all duration-200 outline-none ${
                        error
                            ? 'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-2 focus:ring-[var(--danger)]/30'
                            : 'border-[var(--surface-border)] focus:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)]/30'
                    } ${className}`}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 font-mono text-xs text-[var(--danger)]">
                        {error}
                    </p>
                )}
                {!error && helperText && (
                    <p className="mt-1.5 text-xs text-[var(--text-muted)]">
                        {helperText}
                    </p>
                )}
            </div>
        );
    },
);

FormTextarea.displayName = 'FormTextarea';
