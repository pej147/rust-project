import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🗺️</span>
            <span className="font-bold text-lg">Rust Intel Map</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/wiki"
              className="text-zinc-400 hover:text-white transition-colors text-sm"
            >
              Wiki
            </Link>
            {session ? (
              <Link
                href="/map"
                className="text-zinc-400 hover:text-white transition-colors text-sm"
              >
                Mijn Map
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-zinc-400 hover:text-white transition-colors text-sm"
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
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent">
              Rust Console Intel Map
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 mb-8 max-w-2xl mx-auto">
              Track vijanden, deel markers met je team, en domineer de server met gedeelde intel.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/map"
                className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-colors"
              >
                <span>🗺️</span>
                Bekijk Map
              </Link>
              <Link
                href="/wiki"
                className="inline-flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-colors"
              >
                <span>📚</span>
                Bekijk Wiki
              </Link>
            </div>

            <p className="mt-6 text-zinc-500 text-sm">
              Geen account nodig om te beginnen
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-zinc-900/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Alles wat je nodig hebt
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1: Map */}
              <div className="bg-zinc-800/50 rounded-3xl p-8 border border-zinc-700/50">
                <div className="text-4xl mb-4">🗺️</div>
                <h3 className="text-xl font-bold mb-3">Interactieve Map</h3>
                <p className="text-zinc-400">
                  Upload je server seed en plaats markers voor vijanden, bases, loot spots, en meer.
                  Volledig draaibaar en zoombaar.
                </p>
              </div>

              {/* Feature 2: Teams */}
              <div className="bg-zinc-800/50 rounded-3xl p-8 border border-zinc-700/50">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-bold mb-3">Team Sharing</h3>
                <p className="text-zinc-400">
                  Deel markers met je team in real-time.
                  Iedereen ziet dezelfde intel en kan bijdragen.
                </p>
              </div>

              {/* Feature 3: Wiki */}
              <div className="bg-zinc-800/50 rounded-3xl p-8 border border-zinc-700/50">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-bold mb-3">Rust Wiki</h3>
                <p className="text-zinc-400">
                  Alles over monuments, wapens, raiding, en meer.
                  Console-specifieke tips en strategieen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Klaar om te domineren?
            </h2>
            <p className="text-zinc-400 mb-8">
              Begin direct met het tracken van je server. Maak later een account aan om je markers te synchroniseren.
            </p>
            <Link
              href="/map"
              className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-colors"
            >
              Start Nu
              <span>→</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-zinc-500">
            <span>🗺️</span>
            <span>Rust Console Intel Map</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <Link href="/wiki" className="hover:text-white transition-colors">
              Wiki
            </Link>
            <Link href="/map" className="hover:text-white transition-colors">
              Map
            </Link>
            {!session && (
              <Link href="/register" className="hover:text-white transition-colors">
                Account maken
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
