import Link from "next/link";
import { notFound } from "next/navigation";
import { ammo, ammoCategories } from "@/data/ammo";

export function generateStaticParams() {
  return ammo.map((item) => ({
    id: item.id,
  }));
}

export default async function AmmoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = ammo.find((a) => a.id === id);

  if (!item) {
    notFound();
  }

  const categoryInfo = ammoCategories[item.category];

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case "pistol": return "🔫";
      case "rifle": return "🎯";
      case "shotgun": return "💥";
      case "rocket": return "🚀";
      case "throwable": return "💣";
      case "explosive": return "🧨";
      default: return "📦";
    }
  };

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
            <Link href="/wiki/ammo" className="hover:text-rust-text">Ammo</Link>
            <span>/</span>
            <span className="text-rust-text">{item.name}</span>
          </div>

          {/* Header Card */}
          <div className="bg-rust-surface rounded-lg p-6 border border-rust-border mb-8">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-rust-surface-elevated rounded-lg flex items-center justify-center text-3xl">
                {getCategoryEmoji(item.category)}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
                <div className="flex items-center gap-3 text-sm">
                  <span className="bg-rust-surface-elevated px-3 py-1 rounded-full">
                    {categoryInfo.emoji} {categoryInfo.name}
                  </span>
                  {item.subcategory && (
                    <span className="bg-rust-surface-elevated px-3 py-1 rounded-full capitalize">
                      {item.subcategory}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-rust-text-secondary mt-4">{item.description}</p>
          </div>

          {/* Stats */}
          {(item.damage || item.velocity) && (
            <div className="bg-rust-surface rounded-lg p-6 border border-rust-border mb-8">
              <h2 className="text-xl font-bold mb-4">Stats</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {item.damage !== undefined && item.damage > 0 && (
                  <div>
                    <div className="text-rust-text-muted text-sm">Damage Modifier</div>
                    <div className="text-2xl font-bold text-red-400">
                      {item.damage === 1 ? "Normal" : item.damage > 1 ? `${item.damage}x` : `${item.damage}x`}
                    </div>
                  </div>
                )}
                {item.velocity && (
                  <div>
                    <div className="text-rust-text-muted text-sm">Velocity</div>
                    <div className="text-2xl font-bold text-rust-primary">{item.velocity} m/s</div>
                  </div>
                )}
                <div>
                  <div className="text-rust-text-muted text-sm">Craft Output</div>
                  <div className="text-2xl font-bold text-green-400">x{item.crafting.output}</div>
                </div>
              </div>
            </div>
          )}

          {/* Effects */}
          {item.effects && item.effects.length > 0 && (
            <div className="bg-rust-surface rounded-lg p-6 border border-rust-border mb-8">
              <h2 className="text-xl font-bold mb-4">Special Effects</h2>
              <div className="flex flex-wrap gap-2">
                {item.effects.map((effect, index) => (
                  <span
                    key={index}
                    className="bg-rust-primary/20 text-rust-primary px-3 py-1 rounded-full text-sm"
                  >
                    {effect}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Crafting */}
          <div className="bg-rust-surface rounded-lg p-6 border border-rust-border mb-8">
            <h2 className="text-xl font-bold mb-4">Crafting</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div>
                <div className="text-rust-text-muted text-sm">Workbench</div>
                <div className="text-xl font-bold">Level {item.crafting.workbench}</div>
              </div>
              <div>
                <div className="text-rust-text-muted text-sm">Craft Time</div>
                <div className="text-xl font-bold">{item.crafting.time}s</div>
              </div>
              <div>
                <div className="text-rust-text-muted text-sm">Output</div>
                <div className="text-xl font-bold text-green-400">x{item.crafting.output}</div>
              </div>
              <div>
                <div className="text-rust-text-muted text-sm">Blueprint</div>
                <div className="text-xl font-bold">
                  {item.crafting.blueprint ? (
                    <span className="text-rust-primary">Required</span>
                  ) : (
                    <span className="text-green-400">Default</span>
                  )}
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
            <div className="space-y-2">
              {item.crafting.ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-rust-surface-elevated rounded-lg px-4 py-3"
                >
                  <span>{ingredient.item}</span>
                  <span className="text-yellow-400 font-bold">x{ingredient.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Used By */}
          {item.usedBy && item.usedBy.length > 0 && (
            <div className="bg-rust-surface rounded-lg p-6 border border-rust-border mb-8">
              <h2 className="text-xl font-bold mb-4">Used By</h2>
              <div className="flex flex-wrap gap-2">
                {item.usedBy.map((weapon, index) => (
                  <span
                    key={index}
                    className="bg-rust-surface-elevated px-3 py-2 rounded-lg text-sm"
                  >
                    {weapon}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {item.tips && item.tips.length > 0 && (
            <div className="bg-rust-surface rounded-lg p-6 border border-rust-border mb-8">
              <h2 className="text-xl font-bold mb-4">Tips</h2>
              <ul className="space-y-2">
                {item.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-rust-text">
                    <span className="text-green-400 mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Back Button */}
          <Link
            href="/wiki/ammo"
            className="inline-flex items-center gap-2 text-rust-text-secondary hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Ammo
          </Link>
        </div>
      </main>
    </div>
  );
}
