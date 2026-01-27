import Link from "next/link";
import { wikiItems, itemCategories, type ItemCategory } from "@/data/wiki-items";

export default function WikiItemsPage() {
  // Groepeer items per categorie
  const resourceItems = wikiItems.filter(i => i.category === "resources");
  const componentItems = wikiItems.filter(i => i.category === "components");
  const toolItems = wikiItems.filter(i => i.category === "tools");
  const medicalItems = wikiItems.filter(i => i.category === "medical");

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
            <span className="text-zinc-300">Items</span>
          </div>

          <h1 className="text-4xl font-bold mb-4">🎒 Items</h1>
          <p className="text-zinc-400 mb-8">
            Alle items in Rust Console - resources, components, tools en medical.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <div className="text-3xl font-bold text-amber-500">{resourceItems.length}</div>
              <div className="text-zinc-400 text-sm">Resources</div>
            </div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <div className="text-3xl font-bold text-blue-500">{componentItems.length}</div>
              <div className="text-zinc-400 text-sm">Components</div>
            </div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <div className="text-3xl font-bold text-green-500">{toolItems.length}</div>
              <div className="text-zinc-400 text-sm">Tools</div>
            </div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <div className="text-3xl font-bold text-red-500">{medicalItems.length}</div>
              <div className="text-zinc-400 text-sm">Medical</div>
            </div>
          </div>

          {/* Resources Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>🪨</span> Resources
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              Raw and refined materials for crafting and building
            </p>

            {/* Subcategories */}
            <div className="space-y-6">
              {/* Raw Resources */}
              <div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-3">Raw Materials</h3>
                <div className="grid gap-2">
                  {resourceItems
                    .filter(i => i.subcategory === "raw")
                    .map(item => (
                      <ItemRow key={item.id} item={item} />
                    ))}
                </div>
              </div>

              {/* Refined Resources */}
              <div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-3">Refined Materials</h3>
                <div className="grid gap-2">
                  {resourceItems
                    .filter(i => i.subcategory === "refined")
                    .map(item => (
                      <ItemRow key={item.id} item={item} />
                    ))}
                </div>
              </div>

              {/* Special */}
              <div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-3">Special</h3>
                <div className="grid gap-2">
                  {resourceItems
                    .filter(i => i.subcategory === "special")
                    .map(item => (
                      <ItemRow key={item.id} item={item} />
                    ))}
                </div>
              </div>
            </div>
          </section>

          {/* Components Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>⚙️</span> Components
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              Parts used for crafting weapons, tools, and electronics
            </p>

            <div className="grid gap-2">
              {componentItems.map(item => (
                <ItemRow key={item.id} item={item} />
              ))}
            </div>
          </section>

          {/* Tools Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>🛠️</span> Tools
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              Equipment for gathering resources and building bases
            </p>

            <div className="space-y-6">
              {/* Starter Tools */}
              <div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-3">Starter</h3>
                <div className="grid gap-2">
                  {toolItems
                    .filter(i => i.subcategory === "starter")
                    .map(item => (
                      <ItemRow key={item.id} item={item} />
                    ))}
                </div>
              </div>

              {/* Stone Tools */}
              <div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-3">Stone Tier</h3>
                <div className="grid gap-2">
                  {toolItems
                    .filter(i => i.subcategory === "stone")
                    .map(item => (
                      <ItemRow key={item.id} item={item} />
                    ))}
                </div>
              </div>

              {/* Metal Tools */}
              <div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-3">Metal Tier</h3>
                <div className="grid gap-2">
                  {toolItems
                    .filter(i => i.subcategory === "metal")
                    .map(item => (
                      <ItemRow key={item.id} item={item} />
                    ))}
                </div>
              </div>

              {/* Salvaged Tools */}
              <div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-3">Salvaged Tier</h3>
                <div className="grid gap-2">
                  {toolItems
                    .filter(i => i.subcategory === "salvaged")
                    .map(item => (
                      <ItemRow key={item.id} item={item} />
                    ))}
                </div>
              </div>

              {/* Power Tools */}
              <div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-3">Power Tools</h3>
                <div className="grid gap-2">
                  {toolItems
                    .filter(i => i.subcategory === "power")
                    .map(item => (
                      <ItemRow key={item.id} item={item} />
                    ))}
                </div>
              </div>

              {/* Building Tools */}
              <div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-3">Building</h3>
                <div className="grid gap-2">
                  {toolItems
                    .filter(i => i.subcategory === "building")
                    .map(item => (
                      <ItemRow key={item.id} item={item} />
                    ))}
                </div>
              </div>

              {/* Utility Tools */}
              <div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-3">Utility</h3>
                <div className="grid gap-2">
                  {toolItems
                    .filter(i => i.subcategory === "utility")
                    .map(item => (
                      <ItemRow key={item.id} item={item} />
                    ))}
                </div>
              </div>
            </div>
          </section>

          {/* Medical Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>💊</span> Medical
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              Healing items and medical supplies
            </p>

            <div className="space-y-6">
              {/* Basic Medical */}
              <div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-3">Basic</h3>
                <div className="grid gap-2">
                  {medicalItems
                    .filter(i => i.subcategory === "basic")
                    .map(item => (
                      <ItemRow key={item.id} item={item} />
                    ))}
                </div>
              </div>

              {/* Advanced Medical */}
              <div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-3">Advanced</h3>
                <div className="grid gap-2">
                  {medicalItems
                    .filter(i => i.subcategory === "advanced")
                    .map(item => (
                      <ItemRow key={item.id} item={item} />
                    ))}
                </div>
              </div>

              {/* Military Medical */}
              <div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-3">Military</h3>
                <div className="grid gap-2">
                  {medicalItems
                    .filter(i => i.subcategory === "military")
                    .map(item => (
                      <ItemRow key={item.id} item={item} />
                    ))}
                </div>
              </div>

              {/* Radiation */}
              <div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-3">Radiation</h3>
                <div className="grid gap-2">
                  {medicalItems
                    .filter(i => i.subcategory === "radiation")
                    .map(item => (
                      <ItemRow key={item.id} item={item} />
                    ))}
                </div>
              </div>

              {/* Teas */}
              <div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-3">Teas</h3>
                <div className="grid gap-2">
                  {medicalItems
                    .filter(i => i.subcategory === "tea")
                    .map(item => (
                      <ItemRow key={item.id} item={item} />
                    ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function ItemRow({ item }: { item: typeof wikiItems[0] }) {
  const getEmoji = (category: string) => {
    switch (category) {
      case "resources": return "📦";
      case "components": return "⚙️";
      case "tools": return "🛠️";
      case "medical": return "💊";
      default: return "📦";
    }
  };

  return (
    <Link href={`/wiki/items/${item.id}`}>
      <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 hover:border-zinc-600 transition-colors flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-xl">
            {getEmoji(item.category)}
          </div>
          <div>
            <div className="font-medium">{item.name}</div>
            <div className="text-zinc-500 text-sm">Stack: {item.stackSize}</div>
          </div>
        </div>
        <div className="text-zinc-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
