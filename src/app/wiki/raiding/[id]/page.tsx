import Link from "next/link";
import { notFound } from "next/navigation";
import raidData from "@/data/raid-costs.json";
import { itemDetails } from "@/data/items";

type RaidTarget = {
  id: string;
  target_name: string;
  target_type: string;
  hp: number | null;
  rockets: { quantity: number | null; sulfur_cost: number | null };
  c4: { quantity: number | null; sulfur_cost: number | null };
  satchels: { quantity: number | null; sulfur_cost: number | null };
  explosive_ammo: { quantity: number | null; sulfur_cost: number | null };
  cheapest_sulfur: number | null;
  cheapest_method: string | null;
};

// Get all items for static generation
function getAllItems(): RaidTarget[] {
  return [
    ...raidData.doors,
    ...raidData.buildings,
    ...raidData.deployables,
  ] as RaidTarget[];
}

export function generateStaticParams() {
  const items = getAllItems();
  return items.map((item) => ({ id: item.id }));
}

export default async function ItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const allItems = getAllItems();
  const item = allItems.find((i) => i.id === id);

  if (!item) {
    notFound();
  }

  const details = itemDetails[id];
  const hasData = item.hp !== null;

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
          <div className="flex items-center gap-2 text-sm text-zinc-400 mb-6">
            <Link href="/wiki" className="hover:text-white">
              Wiki
            </Link>
            <span>/</span>
            <Link href="/wiki/raiding" className="hover:text-white">
              Raiding
            </Link>
            <span>/</span>
            <span className="text-white">{item.target_name}</span>
          </div>

          {/* Title Section */}
          <div className="flex items-start gap-6 mb-8">
            <div className="w-24 h-24 bg-zinc-900 rounded-xl flex items-center justify-center text-4xl border border-zinc-800">
              {item.target_type === "door" && "🚪"}
              {item.target_type === "building" && "🧱"}
              {item.target_type === "deployable" && "📦"}
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{item.target_name}</h1>
              {details?.description && (
                <p className="text-zinc-400 max-w-xl">{details.description}</p>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          {hasData && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <StatCard label="HP" value={item.hp?.toString() ?? "—"} />
              {details?.upkeep && (
                <>
                  <StatCard label="Upkeep" value={details.upkeep.cost} />
                  <StatCard label="Decay" value={details.upkeep.decay} />
                </>
              )}
              {item.cheapest_sulfur && (
                <StatCard
                  label="Cheapest Raid"
                  value={`${item.cheapest_sulfur.toLocaleString()} Sulfur`}
                  highlight
                />
              )}
            </div>
          )}

          {/* Raid Costs Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Raid Costs</h2>
            {hasData ? (
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">
                        Method
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-zinc-400">
                        Quantity
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-zinc-400">
                        Sulfur Cost
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-zinc-400">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <RaidMethodRow
                      icon="🚀"
                      name="Rockets"
                      quantity={item.rockets.quantity}
                      sulfur={item.rockets.sulfur_cost}
                      isCheapest={item.cheapest_method === "rockets"}
                    />
                    <RaidMethodRow
                      icon="💣"
                      name="C4"
                      quantity={item.c4.quantity}
                      sulfur={item.c4.sulfur_cost}
                      isCheapest={item.cheapest_method === "c4"}
                    />
                    <RaidMethodRow
                      icon="🎒"
                      name="Satchels"
                      quantity={item.satchels.quantity}
                      sulfur={item.satchels.sulfur_cost}
                      isCheapest={item.cheapest_method === "satchels"}
                    />
                    <RaidMethodRow
                      icon="🔫"
                      name="Explosive 5.56"
                      quantity={item.explosive_ammo.quantity}
                      sulfur={item.explosive_ammo.sulfur_cost}
                      isCheapest={item.cheapest_method === "explosive_ammo"}
                    />
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 text-center">
                <p className="text-zinc-400">
                  Data voor dit item is nog niet beschikbaar.
                </p>
                <p className="text-zinc-500 text-sm mt-2">
                  Help ons door de data toe te voegen!
                </p>
              </div>
            )}
          </section>

          {/* Crafting Section */}
          {details?.crafting && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Crafting</h2>
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
                <h3 className="font-medium mb-3">Ingredients</h3>
                <div className="flex flex-wrap gap-3 mb-4">
                  {details.crafting.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      className="bg-zinc-800 rounded-lg px-4 py-2 flex items-center gap-2"
                    >
                      <span className="font-mono text-blue-400">
                        x{ing.amount}
                      </span>
                      <span>{ing.item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-6 text-sm text-zinc-400">
                  <div>
                    <span className="text-zinc-500">Time:</span>{" "}
                    {details.crafting.time}
                  </div>
                  {details.crafting.workbench !== undefined && (
                    <div>
                      <span className="text-zinc-500">Workbench:</span>{" "}
                      {details.crafting.workbench === 0
                        ? "None"
                        : `Level ${details.crafting.workbench}`}
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Repair & Recycling */}
          {(details?.repair || details?.recycling) && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Repair & Recycling</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {details?.repair && (
                  <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
                    <h3 className="font-medium mb-3">Repair</h3>
                    <div className="text-sm text-zinc-400 space-y-2">
                      <p>Max cost: {details.repair.maxCost}</p>
                      <p>
                        Blueprint required:{" "}
                        {details.repair.requiresBlueprint ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                )}
                {details?.recycling && (
                  <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
                    <h3 className="font-medium mb-3">Recycling</h3>
                    <div className="text-sm text-zinc-400 space-y-2">
                      <p>Recycler: {details.recycling.output}</p>
                      {details.recycling.safeZoneOutput && (
                        <p>Safe Zone: {details.recycling.safeZoneOutput}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Tips Section */}
          {details?.tips && details.tips.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Tips</h2>
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
                <ul className="space-y-3">
                  {details.tips.map((tip, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-zinc-300"
                    >
                      <span className="text-green-400 mt-1">💡</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Back Link */}
          <Link
            href="/wiki/raiding"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← Back to Raid Chart
          </Link>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 border ${highlight ? "bg-green-500/10 border-green-500/30" : "bg-zinc-900 border-zinc-800"}`}
    >
      <div className="text-xs text-zinc-500 mb-1">{label}</div>
      <div
        className={`font-bold ${highlight ? "text-green-400" : "text-white"}`}
      >
        {value}
      </div>
    </div>
  );
}

function RaidMethodRow({
  icon,
  name,
  quantity,
  sulfur,
  isCheapest,
}: {
  icon: string;
  name: string;
  quantity: number | null;
  sulfur: number | null;
  isCheapest: boolean;
}) {
  return (
    <tr
      className={`border-b border-zinc-800/50 ${isCheapest ? "bg-green-500/5" : ""}`}
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <span>{icon}</span>
          <span className={isCheapest ? "text-green-400 font-medium" : ""}>
            {name}
          </span>
        </div>
      </td>
      <td className="text-center py-3 px-4 font-mono">
        {quantity !== null ? quantity : "—"}
      </td>
      <td className="text-center py-3 px-4 font-mono">
        {sulfur !== null ? sulfur.toLocaleString() : "—"}
      </td>
      <td className="text-center py-3 px-4">
        {isCheapest ? (
          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-medium">
            Cheapest
          </span>
        ) : quantity !== null ? (
          <span className="text-zinc-500 text-xs">—</span>
        ) : (
          <span className="text-zinc-600 text-xs">No data</span>
        )}
      </td>
    </tr>
  );
}
