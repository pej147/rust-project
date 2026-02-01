import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
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
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-lg border bg-rust-surface-elevated px-4 py-3 text-rust-text placeholder-rust-text-muted transition-colors focus:outline-none focus:ring-1",
            error
              ? "border-rust-danger focus:border-rust-danger focus:ring-rust-danger"
              : "border-rust-border focus:border-rust-primary focus:ring-rust-primary",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-rust-danger">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
