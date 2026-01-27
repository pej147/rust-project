import Link from "next/link";
import { notFound } from "next/navigation";
import { monuments, getMonumentById, monumentTiers } from "@/data/monuments";

// Generate static params for all monuments
export function generateStaticParams() {
  return monuments.map((monument) => ({
    id: monument.id,
  }));
}

export default async function MonumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const monument = getMonumentById(id);

  if (!monument) {
    notFound();
  }

  const tierInfo = monumentTiers[monument.tier];
  const tierColor = {
    safe: "bg-emerald-500",
    tier1: "bg-green-500",
    tier2: "bg-blue-500",
    tier3: "bg-red-500",
  }[monument.tier];

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
            <Link
              href="/map"
              className="text-zinc-400 hover:text-white transition-colors text-sm"
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
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
            <Link href="/wiki" className="hover:text-zinc-300">Wiki</Link>
            <span>/</span>
            <Link href="/wiki/monuments" className="hover:text-zinc-300">Monuments</Link>
            <span>/</span>
            <span className="text-zinc-300">{monument.name}</span>
          </div>

          {/* Monument Header */}
          <div className="flex items-start gap-4 mb-8">
            <div className="w-16 h-16 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center">
              <div className={`w-8 h-8 rounded-full ${tierColor}`}></div>
            </div>
            <div>
              <span className={`text-xs px-2 py-1 rounded-full ${tierInfo.color} bg-zinc-800`}>
                {tierInfo.name}
              </span>
              <h1 className="text-3xl font-bold mt-2">{monument.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                {monument.scientists && (
                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                    ⚔️ Scientists
                  </span>
                )}
                {monument.radiation !== "none" && (
                  <span className={`text-xs px-2 py-1 rounded ${
                    monument.radiation === "low" ? "bg-yellow-500/20 text-yellow-400" :
                    monument.radiation === "medium" ? "bg-orange-500/20 text-orange-400" :
                    "bg-red-500/20 text-red-400"
                  }`}>
                    ☢️ {monument.radiation.charAt(0).toUpperCase() + monument.radiation.slice(1)} Radiation
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 mb-6">
            <p className="text-zinc-300 leading-relaxed">{monument.description}</p>
          </div>

          {/* Info Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Puzzle Info */}
            {monument.puzzle && (
              <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 md:col-span-2">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span>🔐</span> Puzzle Guide
                </h2>
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      monument.puzzle.keycard === "green" ? "bg-green-500/20 text-green-400" :
                      monument.puzzle.keycard === "blue" ? "bg-blue-500/20 text-blue-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>
                      {monument.puzzle.keycard.charAt(0).toUpperCase() + monument.puzzle.keycard.slice(1)} Keycard Required
                    </span>
                    <span className="text-zinc-500 text-sm">
                      + {monument.puzzle.fuses} Electric Fuse{monument.puzzle.fuses > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  {monument.puzzle.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium">
                        {i + 1}
                      </span>
                      <span className="text-zinc-300">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Loot */}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>📦</span> Loot
              </h2>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-zinc-500 uppercase mb-2">Crate Types</div>
                  <div className="flex flex-wrap gap-2">
                    {monument.loot.crates.map(crate => (
                      <span key={crate} className={`text-xs px-2 py-1 rounded ${
                        crate === "elite" ? "bg-purple-500/20 text-purple-400" :
                        crate === "military" ? "bg-blue-500/20 text-blue-400" :
                        "bg-zinc-700 text-zinc-300"
                      }`}>
                        {crate.charAt(0).toUpperCase() + crate.slice(1)}
                      </span>
                    ))}
                    {monument.loot.barrels && (
                      <span className="text-xs px-2 py-1 rounded bg-zinc-700 text-zinc-300">
                        Barrels
                      </span>
                    )}
                  </div>
                </div>
                {monument.loot.specialLoot && (
                  <div>
                    <div className="text-xs text-zinc-500 uppercase mb-2">Special Loot</div>
                    <ul className="space-y-1">
                      {monument.loot.specialLoot.map((loot, i) => (
                        <li key={i} className="text-zinc-300 text-sm flex items-start gap-2">
                          <span className="text-yellow-500">★</span>
                          {loot}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>🏭</span> Features
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <FeatureItem label="Recycler" available={monument.features.recycler} />
                <FeatureItem label="Repair Bench" available={monument.features.repairBench} />
                <FeatureItem label="Research Table" available={monument.features.researchTable} />
                <FeatureItem label="Oil Refinery" available={monument.features.refinery} />
                <FeatureItem label="Vending Machines" available={monument.features.vendingMachines} />
                {monument.features.workbench && (
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-zinc-300 text-sm">Workbench L{monument.features.workbench}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Spawn Info */}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>🗺️</span> Map Info
              </h2>
              <p className="text-zinc-300">{monument.spawnInfo}</p>
            </div>

            {/* Danger Info */}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>⚠️</span> Dangers
              </h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={monument.scientists ? "text-red-500" : "text-zinc-600"}>
                    {monument.scientists ? "⚔️" : "○"}
                  </span>
                  <span className={monument.scientists ? "text-zinc-300" : "text-zinc-600"}>
                    Scientists: {monument.scientists ? "Yes - bring weapons!" : "None"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={monument.radiation !== "none" ? "text-yellow-500" : "text-zinc-600"}>
                    {monument.radiation !== "none" ? "☢️" : "○"}
                  </span>
                  <span className={monument.radiation !== "none" ? "text-zinc-300" : "text-zinc-600"}>
                    Radiation: {monument.radiation === "none" ? "None" :
                      monument.radiation === "low" ? "Low - minimal protection needed" :
                      monument.radiation === "medium" ? "Medium - bring hazmat or rad pills" :
                      "High - hazmat suit required!"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          {monument.tips.length > 0 && (
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 mt-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>💡</span> Tips
              </h2>
              <ul className="space-y-3">
                {monument.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-300">
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
              href="/wiki/monuments"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Monuments
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureItem({ label, available }: { label: string; available: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className={available ? "text-green-500" : "text-zinc-600"}>
        {available ? "✓" : "✗"}
      </span>
      <span className={available ? "text-zinc-300" : "text-zinc-600"} style={{ fontSize: "0.875rem" }}>
        {label}
      </span>
    </div>
  );
}
