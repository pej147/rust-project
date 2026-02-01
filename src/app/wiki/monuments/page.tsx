import Link from "next/link";
import { monuments, monumentTiers, type MonumentTier } from "@/data/monuments";

export default function WikiMonumentsPage() {
  const tier1 = monuments.filter(m => m.tier === "tier1");
  const tier2 = monuments.filter(m => m.tier === "tier2");
  const tier3 = monuments.filter(m => m.tier === "tier3");
  const safeZones = monuments.filter(m => m.tier === "safe");

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
            <Link
              href="/map"
              className="text-rust-text-secondary hover:text-white transition-colors text-sm"
            >
              Map
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-rust-text-muted mb-6">
            <Link href="/wiki" className="hover:text-rust-text">Wiki</Link>
            <span>/</span>
            <span className="text-rust-text">Monuments</span>
          </div>

          <h1 className="text-4xl font-bold mb-4">🏛️ Monuments</h1>
          <p className="text-rust-text-secondary mb-8">
            Alle monuments in Rust Console met loot, puzzles en tips.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            <div className="bg-rust-surface rounded-lg p-4 border border-rust-border">
              <div className="text-3xl font-bold text-green-500">{tier1.length}</div>
              <div className="text-rust-text-secondary text-sm">Tier 1 (Green)</div>
            </div>
            <div className="bg-rust-surface rounded-lg p-4 border border-rust-border">
              <div className="text-3xl font-bold text-blue-500">{tier2.length}</div>
              <div className="text-rust-text-secondary text-sm">Tier 2 (Blue)</div>
            </div>
            <div className="bg-rust-surface rounded-lg p-4 border border-rust-border">
              <div className="text-3xl font-bold text-red-500">{tier3.length}</div>
              <div className="text-rust-text-secondary text-sm">Tier 3 (Red)</div>
            </div>
            <div className="bg-rust-surface rounded-lg p-4 border border-rust-border">
              <div className="text-3xl font-bold text-emerald-500">{safeZones.length}</div>
              <div className="text-rust-text-secondary text-sm">Safe Zones</div>
            </div>
          </div>

          {/* Keycard Progression Info */}
          <div className="bg-rust-surface rounded-lg p-6 border border-rust-border mb-12">
            <h2 className="text-lg font-bold mb-4">🔑 Keycard Progression</h2>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                Green Card
              </span>
              <span className="text-rust-text-muted">→</span>
              <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">
                Blue Card
              </span>
              <span className="text-rust-text-muted">→</span>
              <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full">
                Red Card
              </span>
            </div>
            <p className="text-rust-text-muted text-sm mt-3">
              Green cards spawn at Tier 1 monuments. Complete green puzzles to find blue cards, then blue puzzles for red cards.
            </p>
          </div>

          {/* Tier 1 Section */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <h2 className="text-2xl font-bold">Tier 1 - Green Card</h2>
            </div>
            <p className="text-rust-text-secondary text-sm mb-6">
              Low difficulty monuments. Safe for beginners with basic loot.
            </p>

            <div className="grid gap-3">
              {tier1.map(monument => (
                <MonumentRow key={monument.id} monument={monument} />
              ))}
            </div>
          </section>

          {/* Tier 2 Section */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <h2 className="text-2xl font-bold">Tier 2 - Blue Card</h2>
            </div>
            <p className="text-rust-text-secondary text-sm mb-6">
              Medium difficulty. Better loot and more complex puzzles.
            </p>

            <div className="grid gap-3">
              {tier2.map(monument => (
                <MonumentRow key={monument.id} monument={monument} />
              ))}
            </div>
          </section>

          {/* Tier 3 Section */}
          {tier3.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <h2 className="text-2xl font-bold">Tier 3 - Red Card</h2>
              </div>
              <p className="text-rust-text-secondary text-sm mb-6">
                High difficulty. Best loot in the game but dangerous.
              </p>

              <div className="grid gap-3">
                {tier3.map(monument => (
                  <MonumentRow key={monument.id} monument={monument} />
                ))}
              </div>
            </section>
          )}

          {/* Coming Soon for Tier 3 if empty */}
          {tier3.length === 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <h2 className="text-2xl font-bold">Tier 3 - Red Card</h2>
              </div>
              <div className="bg-rust-surface rounded-lg p-6 border border-rust-border text-center">
                <p className="text-rust-text-muted">Coming soon: Launch Site, Military Tunnels, Oil Rig, Labs</p>
              </div>
            </section>
          )}

          {/* Safe Zones */}
          {safeZones.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <h2 className="text-2xl font-bold">Safe Zones</h2>
              </div>
              <p className="text-rust-text-secondary text-sm mb-6">
                No PvP allowed. Trading, recycling, and shopping.
              </p>

              <div className="grid gap-3">
                {safeZones.map(monument => (
                  <MonumentRow key={monument.id} monument={monument} />
                ))}
              </div>
            </section>
          )}

          {/* Coming Soon for Safe Zones if empty */}
          {safeZones.length === 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <h2 className="text-2xl font-bold">Safe Zones</h2>
              </div>
              <div className="bg-rust-surface rounded-lg p-6 border border-rust-border text-center">
                <p className="text-rust-text-muted">Coming soon: Outpost, Bandit Camp</p>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function MonumentRow({ monument }: { monument: typeof monuments[0] }) {
  const tierColor = {
    safe: "bg-emerald-500",
    tier1: "bg-green-500",
    tier2: "bg-blue-500",
    tier3: "bg-red-500",
  }[monument.tier];

  const radiationBadge = {
    none: null,
    low: <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">Low Rad</span>,
    medium: <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded">Med Rad</span>,
    high: <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">High Rad</span>,
  }[monument.radiation];

  return (
    <Link href={`/wiki/monuments/${monument.id}`}>
      <div className="bg-rust-surface rounded-lg p-4 border border-rust-border hover:border-rust-border transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`w-2 h-2 rounded-full ${tierColor} mt-2`}></div>
            <div>
              <div className="font-medium flex items-center gap-2">
                {monument.name}
                {monument.scientists && (
                  <span className="text-xs bg-rust-surface-elevated text-rust-text px-2 py-0.5 rounded">Scientists</span>
                )}
                {radiationBadge}
              </div>
              <div className="text-rust-text-muted text-sm mt-1 line-clamp-1">
                {monument.puzzle ? `${monument.puzzle.keycard.charAt(0).toUpperCase() + monument.puzzle.keycard.slice(1)} Card Puzzle` : "No puzzle required"}
                {monument.loot.crates.includes("elite") && " • Elite Crates"}
              </div>
            </div>
          </div>
          <div className="text-rust-text-muted">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
