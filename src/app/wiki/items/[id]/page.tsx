import Link from "next/link";
import { notFound } from "next/navigation";
import { wikiItems, getItemById, itemCategories } from "@/data/wiki-items";

// Generate static params for all items
export function generateStaticParams() {
  return wikiItems.map((item) => ({
    id: item.id,
  }));
}

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getItemById(id);

  if (!item) {
    notFound();
  }

  const categoryInfo = itemCategories[item.category];

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
            <Link href="/wiki/items" className="hover:text-rust-text">Items</Link>
            <span>/</span>
            <span className="text-rust-text">{item.name}</span>
          </div>

          {/* Item Header */}
          <div className="flex items-start gap-4 mb-8">
            <div className="w-20 h-20 bg-rust-surface rounded-lg border border-rust-border flex items-center justify-center text-4xl">
              {categoryInfo.emoji}
            </div>
            <div>
              <span className="text-xs bg-rust-surface-elevated text-rust-text-secondary px-2 py-1 rounded-full">
                {categoryInfo.emoji} {categoryInfo.name}
              </span>
              <h1 className="text-3xl font-bold mt-2">{item.name}</h1>
              <p className="text-rust-text-secondary mt-1">Stack size: {item.stackSize}</p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-rust-surface rounded-lg p-6 border border-rust-border mb-6">
            <p className="text-rust-text leading-relaxed">{item.description}</p>
          </div>

          {/* Info Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Sources */}
            <div className="bg-rust-surface rounded-lg p-6 border border-rust-border">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>📍</span> Where to Find
              </h2>
              <ul className="space-y-2">
                {item.sources.map((source, i) => (
                  <li key={i} className="flex items-start gap-2 text-rust-text">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{source}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Crafting */}
            {item.crafting && (
              <div className="bg-rust-surface rounded-lg p-6 border border-rust-border">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span>🔨</span> Crafting
                </h2>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-rust-text-muted uppercase mb-1">Ingredients</div>
                    {item.crafting.ingredients.map((ing, i) => (
                      <div key={i} className="text-rust-text">
                        {ing.amount}x {ing.item}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-xs text-rust-text-muted uppercase mb-1">Output</div>
                    <div className="text-rust-text">{item.crafting.output}x {item.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-rust-text-muted uppercase mb-1">Time</div>
                    <div className="text-rust-text">{item.crafting.time} seconds</div>
                  </div>
                  {item.crafting.workbench !== undefined && (
                    <div>
                      <div className="text-xs text-rust-text-muted uppercase mb-1">Workbench</div>
                      <div className="text-rust-text">
                        {item.crafting.workbench === 0 ? "None required" : `Level ${item.crafting.workbench}`}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Smelting */}
            {item.smelting && (
              <div className="bg-rust-surface rounded-lg p-6 border border-rust-border">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span>🔥</span> Smelting
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-xs text-rust-text-muted uppercase mb-1">Input</div>
                      <div className="text-rust-text">{item.smelting.input}x {item.name}</div>
                    </div>
                    <div className="text-rust-text-muted">→</div>
                    <div>
                      <div className="text-xs text-rust-text-muted uppercase mb-1">Output</div>
                      <div className="text-rust-text">
                        {item.smelting.output.amount}x {item.smelting.output.item}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-rust-text-muted uppercase mb-1">Fuel</div>
                    <div className="text-rust-text">{item.smelting.fuel}</div>
                  </div>
                  <div>
                    <div className="text-xs text-rust-text-muted uppercase mb-1">Time per unit</div>
                    <div className="text-rust-text">{item.smelting.time} seconds</div>
                  </div>
                </div>
              </div>
            )}

            {/* Recycling */}
            {item.recycling && (
              <div className="bg-rust-surface rounded-lg p-6 border border-rust-border">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span>♻️</span> Recycling Output
                </h2>
                <div className="space-y-2">
                  <div className="text-xs text-rust-text-muted uppercase mb-2">
                    Per {item.recycling.input} {item.name}
                  </div>
                  {item.recycling.output.map((out, i) => (
                    <div key={i} className="flex items-center justify-between bg-rust-surface-elevated rounded-lg px-4 py-2">
                      <span className="text-rust-text">{out.item}</span>
                      <span className="font-mono text-green-500">+{out.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tips */}
          {item.tips && item.tips.length > 0 && (
            <div className="bg-rust-surface rounded-lg p-6 border border-rust-border mt-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>💡</span> Tips
              </h2>
              <ul className="space-y-3">
                {item.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-rust-text">
                    <span className="text-yellow-500 text-sm mt-0.5">💡</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-8">
            <Link
              href="/wiki/items"
              className="inline-flex items-center gap-2 text-rust-text-secondary hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Items
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
