import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-semibold uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-rust-bg disabled:cursor-not-allowed disabled:opacity-50",
          {
            // Variants — Rust Console style
            "bg-rust-primary text-white hover:bg-rust-primary-hover focus:ring-rust-primary":
              variant === "primary",
            "bg-rust-surface-elevated text-rust-text hover:brightness-125 focus:ring-rust-border":
              variant === "secondary",
            "bg-rust-danger text-white hover:brightness-125 focus:ring-rust-danger":
              variant === "danger",
            "bg-transparent text-rust-text-secondary hover:bg-rust-surface-elevated hover:text-rust-text focus:ring-rust-border":
              variant === "ghost",
            // Sizes
            "px-3 py-1.5 text-sm": size === "sm",
            "px-4 py-2.5 text-base": size === "md",
            "px-6 py-3 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
