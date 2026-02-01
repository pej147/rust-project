import Link from "next/link";
import raidData from "@/data/raid-costs.json";

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

export default function RaidingPage() {
  const allItems: RaidTarget[] = [
    ...raidData.doors,
    ...raidData.deployables,
  ] as RaidTarget[];

  // Filter items with at least some data
  const itemsWithData = allItems.filter((item) => item.hp !== null);
  const itemsWithoutData = allItems.filter((item) => item.hp === null);

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
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-rust-text-secondary mb-6">
            <Link href="/wiki" className="hover:text-white">
              Wiki
            </Link>
            <span>/</span>
            <span className="text-white">Raiding</span>
          </div>

          <h1 className="text-4xl font-bold mb-4">Raid Cost Chart</h1>
          <p className="text-rust-text-secondary mb-8 max-w-2xl">
            Hoeveel explosives heb je nodig om doors, walls en deployables te
            raiden? Bekijk de sulfur kosten en kies de goedkoopste methode.
          </p>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-8 p-4 bg-rust-surface rounded-lg border border-rust-border">
            <div className="flex items-center gap-2">
              <span className="text-xl">🚀</span>
              <span className="text-sm text-rust-text-secondary">Rockets</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">💣</span>
              <span className="text-sm text-rust-text-secondary">C4</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎒</span>
              <span className="text-sm text-rust-text-secondary">Satchels</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🔫</span>
              <span className="text-sm text-rust-text-secondary">Explosive Ammo</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-sm text-rust-text-secondary">Cheapest method</span>
            </div>
          </div>

          {/* Doors Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>🚪</span> Doors
            </h2>
            <RaidTable items={raidData.doors as RaidTarget[]} />
          </section>

          {/* Deployables Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>📦</span> Deployables
            </h2>
            <RaidTable items={raidData.deployables as RaidTarget[]} />
          </section>

          {/* Buildings Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>🏠</span> Building Blocks
            </h2>
            <p className="text-rust-text-secondary mb-4 text-sm">
              Note: Building blocks have different HP for soft side vs hard
              side.
            </p>
            <RaidTable
              items={raidData.buildings.slice(0, 10) as RaidTarget[]}
            />
            <p className="text-rust-text-muted text-sm mt-4">
              Showing first 10 building blocks. More coming soon.
            </p>
          </section>

          {/* Data Status */}
          <div className="mt-12 p-4 bg-rust-surface/50 rounded-lg border border-rust-border">
            <h3 className="font-bold mb-2">Data Status</h3>
            <p className="text-rust-text-secondary text-sm">
              Items with data: {itemsWithData.length} | Pending:{" "}
              {itemsWithoutData.length}
            </p>
            <p className="text-rust-text-muted text-sm mt-1">
              Source: wiki.rustclash.com | Last updated: 2026-01-26
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function RaidTable({ items }: { items: RaidTarget[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-rust-border">
            <th className="text-left py-3 px-4 text-sm font-medium text-rust-text-secondary">
              Target
            </th>
            <th className="text-center py-3 px-2 text-sm font-medium text-rust-text-secondary">
              HP
            </th>
            <th className="text-center py-3 px-2 text-sm font-medium text-rust-text-secondary">
              🚀 Rockets
            </th>
            <th className="text-center py-3 px-2 text-sm font-medium text-rust-text-secondary">
              💣 C4
            </th>
            <th className="text-center py-3 px-2 text-sm font-medium text-rust-text-secondary">
              🎒 Satchels
            </th>
            <th className="text-center py-3 px-2 text-sm font-medium text-rust-text-secondary">
              🔫 Exp. Ammo
            </th>
            <th className="text-center py-3 px-2 text-sm font-medium text-rust-text-secondary">
              Cheapest
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <RaidRow key={item.id} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RaidRow({ item }: { item: RaidTarget }) {
  const hasData = item.hp !== null;
  const cheapest = item.cheapest_method;

  const getCellClass = (method: string) => {
    if (!hasData) return "text-rust-text-muted";
    if (cheapest === method) return "text-green-400 font-bold";
    return "text-rust-text";
  };

  const formatCell = (
    data: { quantity: number | null; sulfur_cost: number | null },
    method: string
  ) => {
    if (data.quantity === null) return "—";
    return (
      <div className={getCellClass(method)}>
        <div className="font-mono">{data.quantity}</div>
        <div className="text-xs text-rust-text-muted">
          {data.sulfur_cost?.toLocaleString()}S
        </div>
      </div>
    );
  };

  return (
    <tr className="border-b border-rust-border/50 hover:bg-rust-surface/50 transition-colors">
      <td className="py-3 px-4">
        <Link
          href={`/wiki/raiding/${item.id}`}
          className="hover:text-rust-primary transition-colors flex items-center gap-2"
        >
          <span className="font-medium">{item.target_name}</span>
          {hasData && (
            <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">
              ✓
            </span>
          )}
        </Link>
      </td>
      <td className="text-center py-3 px-2 font-mono text-rust-text-secondary">
        {item.hp ?? "—"}
      </td>
      <td className="text-center py-3 px-2">
        {formatCell(item.rockets, "rockets")}
      </td>
      <td className="text-center py-3 px-2">{formatCell(item.c4, "c4")}</td>
      <td className="text-center py-3 px-2">
        {formatCell(item.satchels, "satchels")}
      </td>
      <td className="text-center py-3 px-2">
        {formatCell(item.explosive_ammo, "explosive_ammo")}
      </td>
      <td className="text-center py-3 px-2">
        {item.cheapest_sulfur !== null ? (
          <div className="text-green-400 font-bold">
            <div className="font-mono">
              {item.cheapest_sulfur.toLocaleString()}
            </div>
            <div className="text-xs text-rust-text-muted">sulfur</div>
          </div>
        ) : (
          "—"
        )}
      </td>
    </tr>
  );
}
