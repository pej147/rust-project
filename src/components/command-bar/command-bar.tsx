"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  parseCommand,
  getCommandSuggestions,
  ParsedCommand,
  MarkerType,
} from "@/lib/command-parser";

interface CommandBarProps {
  mapSize: number;
  onAddMarker: (type: MarkerType, x: number, y: number, name?: string) => void;
  onGoto: (x: number, y: number) => void;
  onClose?: () => void;
}

const HISTORY_KEY = "rust-command-history";
const MAX_HISTORY = 20;

export function CommandBar({ mapSize, onAddMarker, onGoto, onClose }: CommandBarProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore localStorage errors
    }
    return [];
  });
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => getCommandSuggestions(input), [input]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Save to history
  const saveToHistory = useCallback((command: string) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h !== command);
      const updated = [command, ...filtered].slice(0, MAX_HISTORY);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch {
        // Ignore localStorage errors
      }
      return updated;
    });
  }, []);

  // Execute a parsed command
  const executeCommand = useCallback(
    (parsed: ParsedCommand) => {
      setError(null);
      setSuccess(null);

      switch (parsed.type) {
        case "marker":
          if (parsed.position && parsed.markerType) {
            onAddMarker(parsed.markerType, parsed.position.x, parsed.position.y, parsed.name);
            const gridInfo = parsed.gridRef ? ` at ${parsed.gridRef}` : "";
            const offsetInfo = parsed.offset
              ? ` (offset: ${parsed.offset.y >= 0 ? "+" : ""}${parsed.offset.y}, ${parsed.offset.x >= 0 ? "+" : ""}${parsed.offset.x})`
              : "";
            setSuccess(`Added ${parsed.markerType} marker${gridInfo}${offsetInfo}`);
            saveToHistory(parsed.raw);
            setInput("");
          } else {
            setError("Invalid grid reference");
          }
          break;

        case "enemy":
          if (parsed.position) {
            onAddMarker("ENEMY", parsed.position.x, parsed.position.y, parsed.name);
            setSuccess(`Added enemy "${parsed.name || "Unknown"}" at ${parsed.gridRef}`);
            saveToHistory(parsed.raw);
            setInput("");
          } else if (parsed.name) {
            // Enemy without position - show error
            setError("Grid position required. Example: /enemy PlayerName M18");
          } else {
            setError("Invalid enemy command. Example: /enemy PlayerName M18");
          }
          break;

        case "goto":
          if (parsed.position) {
            onGoto(parsed.position.x, parsed.position.y);
            setSuccess(`Moved to ${parsed.gridRef}`);
            saveToHistory(parsed.raw);
            setInput("");
          } else {
            setError("Invalid grid reference");
          }
          break;

        case "unknown":
          setError("Unknown command. Type / for help.");
          break;
      }
    },
    [onAddMarker, onGoto, saveToHistory]
  );

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const parsed = parseCommand(input, mapSize);
    executeCommand(parsed);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Escape - close command bar
    if (e.key === "Escape") {
      onClose?.();
      return;
    }

    // Arrow up - previous history
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = Math.min(historyIndex + 1, history.length - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
      return;
    }

    // Arrow down - next history or clear
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
      return;
    }

    // Tab - autocomplete first suggestion
    if (e.key === "Tab" && suggestions.length > 0) {
      e.preventDefault();
      // Extract the command part from suggestion
      const suggestion = suggestions[0];
      const commandMatch = suggestion.match(/^(\/\w+\s*\w*)/);
      if (commandMatch) {
        setInput(commandMatch[1] + " ");
      }
    }
  };

  // Clear messages after delay
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="absolute bottom-4 left-2 right-2 z-[1001] sm:left-4 sm:right-4">
      {/* Suggestions */}
      {suggestions.length > 0 && input && (
        <div className="mb-2 rounded-lg border border-rust-border bg-rust-surface/95 p-2 backdrop-blur-sm">
          <div className="text-xs uppercase text-rust-text-secondary mb-1">Suggestions</div>
          <ul className="space-y-1">
            {suggestions.map((suggestion, i) => (
              <li
                key={i}
                className="text-sm text-rust-text font-mono cursor-pointer hover:text-rust-primary"
                onClick={() => {
                  const commandMatch = suggestion.match(/^(\/\w+\s*\w*)/);
                  if (commandMatch) {
                    setInput(commandMatch[1] + " ");
                    inputRef.current?.focus();
                  }
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Error/Success message */}
      {(error || success) && (
        <div
          className={`mb-2 rounded-lg border px-3 py-2 text-sm ${
            error
              ? "border-rust-danger/50 bg-rust-danger/10 text-rust-danger"
              : "border-green-500/50 bg-green-500/10 text-green-400"
          }`}
        >
          {error || success}
        </div>
      )}

      {/* Command input */}
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 rounded-lg border border-rust-border bg-rust-surface/95 px-3 py-2 backdrop-blur-sm">
          <span className="text-rust-primary font-mono">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setHistoryIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command... (/ for help, ↑ for history)"
            className="flex-1 bg-transparent font-mono text-sm text-rust-text placeholder:text-rust-text-secondary outline-none"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <button
            type="submit"
            className="rounded bg-rust-primary px-3 py-1 text-xs font-medium uppercase text-white hover:bg-rust-primary/80 transition-colors"
          >
            Run
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-rust-text-secondary hover:text-rust-text transition-colors"
          >
            ✕
          </button>
        </div>
      </form>

      {/* Help hint */}
      {!input && (
        <div className="mt-2 text-center text-xs text-rust-text-secondary">
          Quick: <span className="font-mono text-rust-text">M18</span> adds enemy marker •
          Press <span className="font-mono text-rust-text">↑</span> for history •
          Press <span className="font-mono text-rust-text">ESC</span> to close
        </div>
      )}
    </div>
  );
}
