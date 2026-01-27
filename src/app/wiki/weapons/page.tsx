import Link from "next/link";
import { weapons, weaponCategories } from "@/data/weapons";

export default function WikiWeaponsPage() {
  const meleeWeapons = weapons.filter(w => w.category === "melee");
  const bowWeapons = weapons.filter(w => w.category === "bow");
  const pistolWeapons = weapons.filter(w => w.category === "pistol");
  const smgWeapons = weapons.filter(w => w.category === "smg");
  const rifleWeapons = weapons.filter(w => w.category === "rifle");
  const shotgunWeapons = weapons.filter(w => w.category === "shotgun");

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
            <span className="text-zinc-300">Weapons</span>
          </div>

          <h1 className="text-4xl font-bold mb-4">🔫 Weapons</h1>
          <p className="text-zinc-400 mb-8">
            Alle wapens in Rust Console met damage stats en crafting info.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <div className="text-3xl font-bold text-orange-500">{meleeWeapons.length}</div>
              <div className="text-zinc-400 text-sm">Melee</div>
            </div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <div className="text-3xl font-bold text-green-500">{bowWeapons.length}</div>
              <div className="text-zinc-400 text-sm">Bows</div>
            </div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <div className="text-3xl font-bold text-blue-500">{pistolWeapons.length}</div>
              <div className="text-zinc-400 text-sm">Pistols</div>
            </div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <div className="text-3xl font-bold text-purple-500">{smgWeapons.length}</div>
              <div className="text-zinc-400 text-sm">SMGs</div>
            </div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <div className="text-3xl font-bold text-red-500">{rifleWeapons.length}</div>
              <div className="text-zinc-400 text-sm">Rifles</div>
            </div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <div className="text-3xl font-bold text-yellow-500">{shotgunWeapons.length}</div>
              <div className="text-zinc-400 text-sm">Shotguns</div>
            </div>
          </div>

          {/* Melee Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>🗡️</span> Melee Weapons
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              Close combat weapons - from rocks to longswords
            </p>

            <div className="space-y-6">
              {/* Primitive */}
              <div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-3">Primitive</h3>
                <div className="grid gap-2">
                  {meleeWeapons
                    .filter(w => w.subcategory === "primitive")
                    .map(weapon => (
                      <WeaponRow key={weapon.id} weapon={weapon} />
                    ))}
                </div>
              </div>

              {/* Salvaged */}
              <div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-3">Salvaged</h3>
                <div className="grid gap-2">
                  {meleeWeapons
                    .filter(w => w.subcategory === "salvaged")
                    .map(weapon => (
                      <WeaponRow key={weapon.id} weapon={weapon} />
                    ))}
                </div>
              </div>

              {/* Military */}
              <div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-3">Military</h3>
                <div className="grid gap-2">
                  {meleeWeapons
                    .filter(w => w.subcategory === "military")
                    .map(weapon => (
                      <WeaponRow key={weapon.id} weapon={weapon} />
                    ))}
                </div>
              </div>
            </div>
          </section>

          {/* Bows Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>🏹</span> Bows & Arrows
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              Silent ranged weapons - essential for early game
            </p>

            <div className="space-y-6">
              {/* Bows */}
              <div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-3">Bows</h3>
                <div className="grid gap-2">
                  {bowWeapons
                    .filter(w => w.subcategory === "primitive" || w.subcategory === "advanced" || w.subcategory === "tool")
                    .map(weapon => (
                      <WeaponRow key={weapon.id} weapon={weapon} />
                    ))}
                </div>
              </div>

              {/* Arrows */}
              <div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-3">Arrows</h3>
                <div className="grid gap-2">
                  {bowWeapons
                    .filter(w => w.subcategory === "ammo")
                    .map(weapon => (
                      <WeaponRow key={weapon.id} weapon={weapon} />
                    ))}
                </div>
              </div>
            </div>
          </section>

          {/* Pistols Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>🔫</span> Pistols
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              Sidearms and handguns - from Eoka to M92
            </p>

            <div className="space-y-6">
              {/* Primitive */}
              {pistolWeapons.filter(w => w.subcategory === "primitive").length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-zinc-300 mb-3">Primitive</h3>
                  <div className="grid gap-2">
                    {pistolWeapons
                      .filter(w => w.subcategory === "primitive")
                      .map(weapon => (
                        <WeaponRow key={weapon.id} weapon={weapon} />
                      ))}
                  </div>
                </div>
              )}

              {/* Craftable */}
              {pistolWeapons.filter(w => w.subcategory === "craftable").length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-zinc-300 mb-3">Craftable</h3>
                  <div className="grid gap-2">
                    {pistolWeapons
                      .filter(w => w.subcategory === "craftable")
                      .map(weapon => (
                        <WeaponRow key={weapon.id} weapon={weapon} />
                      ))}
                  </div>
                </div>
              )}

              {/* Military */}
              {pistolWeapons.filter(w => w.subcategory === "military").length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-zinc-300 mb-3">Military</h3>
                  <div className="grid gap-2">
                    {pistolWeapons
                      .filter(w => w.subcategory === "military")
                      .map(weapon => (
                        <WeaponRow key={weapon.id} weapon={weapon} />
                      ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* SMGs Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>🔫</span> SMGs
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              Submachine guns - fast fire rate, close to medium range
            </p>

            <div className="space-y-6">
              {/* Craftable */}
              {smgWeapons.filter(w => w.subcategory === "craftable").length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-zinc-300 mb-3">Craftable</h3>
                  <div className="grid gap-2">
                    {smgWeapons
                      .filter(w => w.subcategory === "craftable")
                      .map(weapon => (
                        <WeaponRow key={weapon.id} weapon={weapon} />
                      ))}
                  </div>
                </div>
              )}

              {/* Military */}
              {smgWeapons.filter(w => w.subcategory === "military").length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-zinc-300 mb-3">Military</h3>
                  <div className="grid gap-2">
                    {smgWeapons
                      .filter(w => w.subcategory === "military")
                      .map(weapon => (
                        <WeaponRow key={weapon.id} weapon={weapon} />
                      ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Rifles Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>🎯</span> Rifles
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              Assault rifles and sniper rifles - medium to long range dominance
            </p>

            <div className="space-y-6">
              {/* Craftable */}
              {rifleWeapons.filter(w => w.subcategory === "craftable").length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-zinc-300 mb-3">Craftable</h3>
                  <div className="grid gap-2">
                    {rifleWeapons
                      .filter(w => w.subcategory === "craftable")
                      .map(weapon => (
                        <WeaponRow key={weapon.id} weapon={weapon} />
                      ))}
                  </div>
                </div>
              )}

              {/* Military */}
              {rifleWeapons.filter(w => w.subcategory === "military").length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-zinc-300 mb-3">Military</h3>
                  <div className="grid gap-2">
                    {rifleWeapons
                      .filter(w => w.subcategory === "military")
                      .map(weapon => (
                        <WeaponRow key={weapon.id} weapon={weapon} />
                      ))}
                  </div>
                </div>
              )}

              {/* Snipers */}
              {rifleWeapons.filter(w => w.subcategory === "sniper").length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-zinc-300 mb-3">Sniper Rifles</h3>
                  <div className="grid gap-2">
                    {rifleWeapons
                      .filter(w => w.subcategory === "sniper")
                      .map(weapon => (
                        <WeaponRow key={weapon.id} weapon={weapon} />
                      ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Shotguns Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>💥</span> Shotguns
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              Close range devastation - from Waterpipe to Spas-12
            </p>

            <div className="space-y-6">
              {/* Primitive */}
              {shotgunWeapons.filter(w => w.subcategory === "primitive").length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-zinc-300 mb-3">Primitive</h3>
                  <div className="grid gap-2">
                    {shotgunWeapons
                      .filter(w => w.subcategory === "primitive")
                      .map(weapon => (
                        <WeaponRow key={weapon.id} weapon={weapon} />
                      ))}
                  </div>
                </div>
              )}

              {/* Craftable */}
              {shotgunWeapons.filter(w => w.subcategory === "craftable").length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-zinc-300 mb-3">Craftable</h3>
                  <div className="grid gap-2">
                    {shotgunWeapons
                      .filter(w => w.subcategory === "craftable")
                      .map(weapon => (
                        <WeaponRow key={weapon.id} weapon={weapon} />
                      ))}
                  </div>
                </div>
              )}

              {/* Military */}
              {shotgunWeapons.filter(w => w.subcategory === "military").length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-zinc-300 mb-3">Military</h3>
                  <div className="grid gap-2">
                    {shotgunWeapons
                      .filter(w => w.subcategory === "military")
                      .map(weapon => (
                        <WeaponRow key={weapon.id} weapon={weapon} />
                      ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function WeaponRow({ weapon }: { weapon: typeof weapons[0] }) {
  const isAmmo = weapon.subcategory === "ammo";

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case "melee": return "🗡️";
      case "bow": return "🏹";
      case "pistol": return "🔫";
      case "smg": return "🔫";
      case "rifle": return "🎯";
      case "shotgun": return "💥";
      default: return "🔫";
    }
  };

  return (
    <Link href={`/wiki/weapons/${weapon.id}`}>
      <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 hover:border-zinc-600 transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-xl">
              {getCategoryEmoji(weapon.category)}
            </div>
            <div>
              <div className="font-medium">{weapon.name}</div>
              <div className="text-zinc-500 text-sm mt-1 flex items-center gap-3 flex-wrap">
                {!isAmmo && (
                  <span className="text-red-400">{weapon.damage} DMG</span>
                )}
                {weapon.rateOfFire && (
                  <span className="text-blue-400">{weapon.rateOfFire} RPM</span>
                )}
                {weapon.magazineSize && (
                  <span className="text-green-400">{weapon.magazineSize} mag</span>
                )}
                {weapon.range && (
                  <span>{weapon.range}</span>
                )}
                {weapon.crafting && (
                  <span>WB{weapon.crafting.workbench}</span>
                )}
              </div>
            </div>
          </div>
          <div className="text-zinc-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
