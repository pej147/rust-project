"use client";

import { useEffect, useCallback, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  className,
}: BottomSheetProps) {
  // Sluit bij Escape toets
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Voorkom scrollen van achtergrond
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[1001] bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[1002] max-h-[90vh] overflow-y-auto rounded-t-2xl border-t border-rust-border bg-rust-surface shadow-xl",
          "animate-in slide-in-from-bottom duration-300",
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "bottom-sheet-title" : undefined}
      >
        {/* Handle bar */}
        <div className="sticky top-0 flex justify-center bg-rust-surface pb-2 pt-3">
          <div className="h-1.5 w-12 rounded-full bg-rust-border" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between border-b border-rust-border px-4 pb-4">
            <h2
              id="bottom-sheet-title"
              className="text-xl font-bold uppercase tracking-wide text-rust-text"
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-rust-text-secondary hover:bg-rust-surface-elevated hover:text-rust-text"
              aria-label="Sluiten"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-4">{children}</div>
      </div>
    </>
  );
}
