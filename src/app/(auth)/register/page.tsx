"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validatie
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, displayName }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      // Redirect naar login met success message
      router.push("/login?registered=true");
    } catch {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-rust-border bg-rust-surface p-8 shadow-xl">
      <h1 className="mb-2 text-center text-3xl font-bold text-white">
        Create Account
      </h1>
      <p className="mb-8 text-center text-rust-text-secondary">
        Start tracking your Rust intel
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-rust-danger/10 p-4 text-sm text-rust-danger">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="displayName"
            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-rust-text-secondary"
          >
            Display Name
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            minLength={2}
            maxLength={50}
            className="w-full rounded-lg border border-rust-border bg-rust-surface-elevated px-4 py-3 text-rust-text placeholder-rust-text-muted transition-colors focus:border-rust-primary focus:outline-none focus:ring-1 focus:ring-rust-primary"
            placeholder="Your gamer tag"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-rust-text-secondary"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-rust-border bg-rust-surface-elevated px-4 py-3 text-rust-text placeholder-rust-text-muted transition-colors focus:border-rust-primary focus:outline-none focus:ring-1 focus:ring-rust-primary"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-rust-text-secondary"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full rounded-lg border border-rust-border bg-rust-surface-elevated px-4 py-3 text-rust-text placeholder-rust-text-muted transition-colors focus:border-rust-primary focus:outline-none focus:ring-1 focus:ring-rust-primary"
            placeholder="Minimum 8 characters"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-rust-text-secondary"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-rust-border bg-rust-surface-elevated px-4 py-3 text-rust-text placeholder-rust-text-muted transition-colors focus:border-rust-primary focus:outline-none focus:ring-1 focus:ring-rust-primary"
            placeholder="Repeat your password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-rust-primary py-3 font-semibold uppercase tracking-wide text-white transition-colors hover:bg-rust-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Create Account..." : "Register"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-rust-text-secondary">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-rust-primary hover:text-rust-primary-hover"
        >
          Log in here
        </Link>
      </p>
    </div>
  );
}
