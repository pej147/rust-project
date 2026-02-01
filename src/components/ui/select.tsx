import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-rust-text-secondary"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(
            "w-full appearance-none rounded-lg border bg-rust-surface-elevated px-4 py-3 text-rust-text transition-colors focus:outline-none focus:ring-1",
            error
              ? "border-rust-danger focus:border-rust-danger focus:ring-rust-danger"
              : "border-rust-border focus:border-rust-primary focus:ring-rust-primary",
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1.5 text-sm text-rust-danger">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
