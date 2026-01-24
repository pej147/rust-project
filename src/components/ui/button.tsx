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
          "inline-flex items-center justify-center rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          {
            // Variants
            "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500":
              variant === "primary",
            "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 focus:ring-zinc-500":
              variant === "secondary",
            "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500":
              variant === "danger",
            "bg-transparent text-zinc-300 hover:bg-zinc-800 focus:ring-zinc-500":
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
