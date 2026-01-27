import Link from "next/link";
import { notFound } from "next/navigation";
import { weapons, getWeaponById, weaponCategories } from "@/data/weapons";

// Generate static params for all weapons
export function generateStaticParams() {
  return weapons.map((weapon) => ({
    id: weapon.id,
  }));
}

export default async function WeaponDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const weapon = getWeaponById(id);

  if (!weapon) {
    notFound();
  }

  const categoryInfo = weaponCategories[weapon.category];
  const isAmmo = weapon.subcategory === "ammo";

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
            <Link href="/wiki/weapons" className="hover:text-zinc-300">Weapons</Link>
            <span>/</span>
            <span className="text-zinc-300">{weapon.name}</span>
          </div>

          {/* Weapon Header */}
          <div className="flex items-start gap-4 mb-8">
            <div className="w-16 h-16 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center text-3xl">
              {categoryInfo.emoji}
            </div>
            <div>
              <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded-full">
                {categoryInfo.emoji} {categoryInfo.name}
              </span>
              <h1 className="text-3xl font-bold mt-2">{weapon.name}</h1>
              {!isAmmo && (
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-red-400 font-bold">{weapon.damage} DMG</span>
                  {weapon.range && (
                    <span className="text-zinc-400">{weapon.range}</span>
                  )}
                  {weapon.rateOfFire && (
                    <span className="text-zinc-400">{weapon.rateOfFire} RPM</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 mb-6">
            <p className="text-zinc-300 leading-relaxed">{weapon.description}</p>
          </div>

          {/* Info Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Stats */}
            {!isAmmo && (
              <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span>📊</span> Stats
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Damage</span>
                    <span className="text-red-400 font-bold">{weapon.damage}</span>
                  </div>
                  {weapon.rateOfFire && (
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Rate of Fire</span>
                      <span className="text-white">{weapon.rateOfFire} RPM</span>
                    </div>
                  )}
                  {weapon.range && (
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Range</span>
                      <span className="text-white">{weapon.range}</span>
                    </div>
                  )}
                  {weapon.ammo && (
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Ammo Type</span>
                      <span className="text-white">{weapon.ammo}</span>
                    </div>
                  )}
                  {weapon.magazineSize && (
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Magazine</span>
                      <span className="text-white">{weapon.magazineSize}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Crafting */}
            {weapon.crafting && (
              <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span>🔨</span> Crafting
                </h2>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-zinc-500 uppercase mb-2">Ingredients</div>
                    {weapon.crafting.ingredients.map((ing, i) => (
                      <div key={i} className="text-zinc-300 flex justify-between">
                        <span>{ing.item}</span>
                        <span className="text-zinc-500">x{ing.amount}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-zinc-800">
                    <span className="text-zinc-400">Workbench</span>
                    <span className="text-white">
                      {weapon.crafting.workbench === 0 ? "None" : `Level ${weapon.crafting.workbench}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Blueprint</span>
                    <span className={weapon.crafting.blueprint ? "text-yellow-400" : "text-green-400"}>
                      {weapon.crafting.blueprint ? "Required" : "Default"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Craft Time</span>
                    <span className="text-white">{weapon.crafting.time}s</span>
                  </div>
                </div>
              </div>
            )}

            {/* Attachments */}
            {weapon.attachments && weapon.attachments.length > 0 && (
              <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span>🔧</span> Attachments
                </h2>
                <div className="flex flex-wrap gap-2">
                  {weapon.attachments.map((att, i) => (
                    <span key={i} className="text-sm bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full">
                      {att}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tips */}
          {weapon.tips.length > 0 && (
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 mt-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>💡</span> Tips
              </h2>
              <ul className="space-y-3">
                {weapon.tips.map((tip, i) => (
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
              href="/wiki/weapons"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Weapons
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
