"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-rust-danger/10 p-4 text-sm text-rust-danger">
          {error}
        </div>
      )}

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
          className="w-full rounded-lg border border-rust-border bg-rust-surface-elevated px-4 py-3 text-rust-text placeholder-rust-text-muted transition-colors focus:border-rust-primary focus:outline-none focus:ring-1 focus:ring-rust-primary"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-rust-primary py-3 font-semibold uppercase tracking-wide text-white transition-colors hover:bg-rust-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="rounded-lg border border-rust-border bg-rust-surface p-8 shadow-xl">
      <h1 className="mb-2 text-center text-3xl font-bold text-white">
        Welcome back
      </h1>
      <p className="mb-8 text-center text-rust-text-secondary">
        Log in to your Rust Intel account
      </p>

      <Suspense
        fallback={
          <div className="flex justify-center py-8">
            <div className="text-rust-text-secondary">Loading...</div>
          </div>
        }
      >
        <LoginForm />
      </Suspense>

      <p className="mt-6 text-center text-sm text-rust-text-secondary">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-rust-primary hover:text-rust-primary-hover"
        >
          Register here
        </Link>
      </p>
    </div>
  );
}
