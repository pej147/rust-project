import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-rust-bg text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-rust-bg/80 backdrop-blur-xl border-b border-rust-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🗺️</span>
            <span className="font-bold text-lg">Rust Intel Map</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/wiki"
              className="text-rust-text-secondary hover:text-white transition-colors text-sm"
            >
              Wiki
            </Link>
            {session ? (
              <Link
                href="/map"
                className="text-rust-text-secondary hover:text-white transition-colors text-sm"
              >
                My Map
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-rust-text-secondary hover:text-white transition-colors text-sm"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-16">
        <section className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold uppercase mb-6 bg-gradient-to-r from-rust-primary via-[#a0b050] to-rust-primary bg-clip-text text-transparent">
              Rust Console Intel Map
            </h1>
            <p className="text-xl md:text-2xl text-rust-text-secondary mb-8 max-w-2xl mx-auto">
              Track enemies, share markers with your team, and dominate the server with shared intel.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/map"
                className="inline-flex items-center justify-center gap-2 bg-rust-primary hover:bg-rust-primary-hover text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
              >
                <span>🗺️</span>
                View Map
              </Link>
              <Link
                href="/wiki"
                className="inline-flex items-center justify-center gap-2 bg-rust-surface-elevated hover:brightness-125 text-white font-semibold uppercase tracking-wide px-8 py-4 rounded-lg text-lg transition-colors"
              >
                <span>📚</span>
                View Wiki
              </Link>
            </div>

            <p className="mt-6 text-rust-text-muted text-sm">
              No account needed to get started
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-rust-surface/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Everything you need
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1: Map */}
              <div className="bg-rust-surface/50 rounded-lg p-8 border border-rust-border/50">
                <div className="text-4xl mb-4">🗺️</div>
                <h3 className="text-xl font-bold mb-3">Interactive Map</h3>
                <p className="text-rust-text-secondary">
                  Upload your server seed and place markers for enemies, bases, loot spots, and more.
                  Fully rotatable and zoomable.
                </p>
              </div>

              {/* Feature 2: Teams */}
              <div className="bg-rust-surface/50 rounded-lg p-8 border border-rust-border/50">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-bold mb-3">Team Sharing</h3>
                <p className="text-rust-text-secondary">
                  Share markers with your team in real-time.
                  Everyone sees the same intel and can contribute.
                </p>
              </div>

              {/* Feature 3: Wiki */}
              <div className="bg-rust-surface/50 rounded-lg p-8 border border-rust-border/50">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-bold mb-3">Rust Wiki</h3>
                <p className="text-rust-text-secondary">
                  Everything about monuments, weapons, raiding, and more.
                  Console-specific tips and strategies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to dominate?
            </h2>
            <p className="text-rust-text-secondary mb-8">
              Start tracking your server right away. Create an account later to sync your markers.
            </p>
            <Link
              href="/map"
              className="inline-flex items-center justify-center gap-2 bg-rust-primary hover:bg-rust-primary-hover text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
            >
              Start Now
              <span>→</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-rust-border py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-rust-text-muted">
            <span>🗺️</span>
            <span>Rust Console Intel Map</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-rust-text-muted">
            <Link href="/wiki" className="hover:text-white transition-colors">
              Wiki
            </Link>
            <Link href="/map" className="hover:text-white transition-colors">
              Map
            </Link>
            {!session && (
              <Link href="/register" className="hover:text-white transition-colors">
                Create Account
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
