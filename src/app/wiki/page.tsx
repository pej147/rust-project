import Link from "next/link";

export default function WikiPage() {
  return (
    <div className="min-h-screen bg-rust-bg text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-rust-bg/80 backdrop-blur-xl border-b border-rust-border">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🗺️</span>
            <span className="font-bold text-lg">Rust Intel Map</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/wiki"
              className="text-white font-medium text-sm"
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
          <h1 className="text-4xl font-bold mb-4">Rust Wiki</h1>
          <p className="text-rust-text-secondary mb-12">
            Alles wat je moet weten over Rust Console.
          </p>

          {/* Categories */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/wiki/monuments">
              <WikiCard
                emoji="🏛️"
                title="Monuments"
                description="Alle monuments met loot tabellen en puzzels"
              />
            </Link>
            <Link href="/wiki/weapons">
              <WikiCard
                emoji="🔫"
                title="Wapens"
                description="Melee, bows, en meer - met damage stats"
              />
            </Link>
            <Link href="/wiki/ammo">
              <WikiCard
                emoji="🎯"
                title="Ammo"
                description="Alle ammo types met crafting en tips"
              />
            </Link>
            <Link href="/wiki/raiding">
              <WikiCard
                emoji="💣"
                title="Raiding"
                description="Raid costs, explosives, en strategieen"
              />
            </Link>
            <Link href="/wiki/items">
              <WikiCard
                emoji="🎒"
                title="Items"
                description="Resources, components, en meer"
              />
            </Link>
            <WikiCard
              emoji="🗺️"
              title="Map Tips"
              description="Console-specifieke tips en tricks"
              comingSoon
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function WikiCard({
  emoji,
  title,
  description,
  comingSoon = false,
}: {
  emoji: string;
  title: string;
  description: string;
  comingSoon?: boolean;
}) {
  return (
    <div className="bg-rust-surface rounded-lg p-6 border border-rust-border hover:border-rust-border transition-colors relative">
      {comingSoon && (
        <span className="absolute top-4 right-4 text-xs bg-rust-surface-elevated text-rust-text-secondary px-2 py-1 rounded-full">
          Binnenkort
        </span>
      )}
      <div className="text-3xl mb-3">{emoji}</div>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-rust-text-secondary text-sm">{description}</p>
    </div>
  );
}
