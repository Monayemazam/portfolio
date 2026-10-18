import React, {
    InputHTMLAttributes,
    SelectHTMLAttributes,
    TextareaHTMLAttributes,
    forwardRef,
} from 'react';

interface FormFieldProps {
    label: string;
    htmlFor?: string;
    error?: string;
    hint?: string;
    required?: boolean;
    children: React.ReactNode;
    className?: string;
}

export function FormField({
    label,
    htmlFor,
    error,
    hint,
    required = false,
    children,
    className = '',
}: FormFieldProps) {
    return (
        <div className={`space-y-1.5 ${className}`}>
            <div className="flex items-center justify-between">
                <label
                    htmlFor={htmlFor}
                    className="font-['JetBrains_Mono',monospace] text-xs font-medium tracking-wider text-[var(--text-muted)] uppercase"
                >
                    {label}
                    {required && (
                        <span className="ml-1 text-[var(--danger)]">*</span>
                    )}
                </label>
                {hint && (
                    <span className="text-xs text-[var(--text-muted)]">
                        {hint}
                    </span>
                )}
            </div>

            {children}

            {error && (
                <p className="font-['JetBrains_Mono',monospace] text-xs text-[var(--danger)]">
                    {error}
                </p>
            )}
        </div>
    );
}

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    hasError?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ className = '', hasError = false, ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={`h-12 w-full rounded-xl border bg-[var(--surface)] px-4 text-sm text-[var(--text)] placeholder-[var(--text-muted)] backdrop-blur-md transition-all duration-200 focus:ring-2 focus:ring-[var(--secondary)] focus:ring-offset-1 focus:ring-offset-[var(--bg)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                    hasError
                        ? 'border-[var(--danger)] focus:ring-[var(--danger)]'
                        : 'border-[var(--surface-border)] hover:border-[var(--secondary)]/60'
                } ${className}`}
                {...props}
            />
        );
    },
);
FormInput.displayName = 'FormInput';

export interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    hasError?: boolean;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
    ({ className = '', hasError = false, rows = 4, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                rows={rows}
                className={`w-full rounded-xl border bg-[var(--surface)] p-4 text-sm text-[var(--text)] placeholder-[var(--text-muted)] backdrop-blur-md transition-all duration-200 focus:ring-2 focus:ring-[var(--secondary)] focus:ring-offset-1 focus:ring-offset-[var(--bg)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                    hasError
                        ? 'border-[var(--danger)] focus:ring-[var(--danger)]'
                        : 'border-[var(--surface-border)] hover:border-[var(--secondary)]/60'
                } ${className}`}
                {...props}
            />
        );
    },
);
FormTextarea.displayName = 'FormTextarea';

export interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    hasError?: boolean;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
    ({ className = '', hasError = false, children, ...props }, ref) => {
        return (
            <select
                ref={ref}
                className={`h-12 w-full rounded-xl border bg-[var(--surface)] px-4 text-sm text-[var(--text)] backdrop-blur-md transition-all duration-200 focus:ring-2 focus:ring-[var(--secondary)] focus:ring-offset-1 focus:ring-offset-[var(--bg)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                    hasError
                        ? 'border-[var(--danger)] focus:ring-[var(--danger)]'
                        : 'border-[var(--surface-border)] hover:border-[var(--secondary)]/60'
                } ${className}`}
                {...props}
            >
                {children}
            </select>
        );
    },
);
FormSelect.displayName = 'FormSelect';
