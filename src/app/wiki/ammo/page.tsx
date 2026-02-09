import Link from "next/link";
import { ammo } from "@/data/ammo";

export default function WikiAmmoPage() {
  const pistolAmmo = ammo.filter(a => a.category === "pistol");
  const rifleAmmo = ammo.filter(a => a.category === "rifle");
  const shotgunAmmo = ammo.filter(a => a.category === "shotgun");
  const rocketAmmo = ammo.filter(a => a.category === "rocket");
  const throwables = ammo.filter(a => a.category === "throwable");
  const explosives = ammo.filter(a => a.category === "explosive");

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
            <span className="text-rust-text">Ammo</span>
          </div>

          <h1 className="text-4xl font-bold mb-4">🎯 Ammunition</h1>
          <p className="text-rust-text-secondary mb-8">
            All ammo types in Rust Console with crafting info and tips.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            <div className="bg-rust-surface rounded-lg p-4 border border-rust-border">
              <div className="text-3xl font-bold text-rust-primary">{pistolAmmo.length}</div>
              <div className="text-rust-text-secondary text-sm">Pistol</div>
            </div>
            <div className="bg-rust-surface rounded-lg p-4 border border-rust-border">
              <div className="text-3xl font-bold text-green-500">{rifleAmmo.length}</div>
              <div className="text-rust-text-secondary text-sm">Rifle</div>
            </div>
            <div className="bg-rust-surface rounded-lg p-4 border border-rust-border">
              <div className="text-3xl font-bold text-yellow-500">{shotgunAmmo.length}</div>
              <div className="text-rust-text-secondary text-sm">Shotgun</div>
            </div>
            <div className="bg-rust-surface rounded-lg p-4 border border-rust-border">
              <div className="text-3xl font-bold text-red-500">{rocketAmmo.length}</div>
              <div className="text-rust-text-secondary text-sm">Rockets</div>
            </div>
            <div className="bg-rust-surface rounded-lg p-4 border border-rust-border">
              <div className="text-3xl font-bold text-rust-primary">{throwables.length}</div>
              <div className="text-rust-text-secondary text-sm">Throwables</div>
            </div>
            <div className="bg-rust-surface rounded-lg p-4 border border-rust-border">
              <div className="text-3xl font-bold text-purple-500">{explosives.length}</div>
              <div className="text-rust-text-secondary text-sm">Explosives</div>
            </div>
          </div>

          {/* Pistol Ammo Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>🔫</span> Pistol Ammo
            </h2>
            <p className="text-rust-text-secondary text-sm mb-6">
              Ammunition for pistols and SMGs
            </p>
            <div className="grid gap-2">
              {pistolAmmo.map(item => (
                <AmmoRow key={item.id} item={item} />
              ))}
            </div>
          </section>

          {/* Rifle Ammo Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>🎯</span> Rifle Ammo
            </h2>
            <p className="text-rust-text-secondary text-sm mb-6">
              Ammunition for all rifles - 5.56 caliber
            </p>
            <div className="grid gap-2">
              {rifleAmmo.map(item => (
                <AmmoRow key={item.id} item={item} />
              ))}
            </div>
          </section>

          {/* Shotgun Ammo Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>💥</span> Shotgun Ammo
            </h2>
            <p className="text-rust-text-secondary text-sm mb-6">
              12 Gauge shells and handmade ammunition
            </p>
            <div className="grid gap-2">
              {shotgunAmmo.map(item => (
                <AmmoRow key={item.id} item={item} />
              ))}
            </div>
          </section>

          {/* Rockets Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>🚀</span> Rockets
            </h2>
            <p className="text-rust-text-secondary text-sm mb-6">
              Rockets for the Rocket Launcher - main raiding tool
            </p>
            <div className="grid gap-2">
              {rocketAmmo.map(item => (
                <AmmoRow key={item.id} item={item} />
              ))}
            </div>
          </section>

          {/* Throwables Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>💣</span> Throwables
            </h2>
            <p className="text-rust-text-secondary text-sm mb-6">
              Grenades and throwable items for combat
            </p>
            <div className="grid gap-2">
              {throwables.map(item => (
                <AmmoRow key={item.id} item={item} />
              ))}
            </div>
          </section>

          {/* Explosives Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>🧨</span> Explosives
            </h2>
            <p className="text-rust-text-secondary text-sm mb-6">
              Raiding explosives and crafting components
            </p>
            <div className="grid gap-2">
              {explosives.map(item => (
                <AmmoRow key={item.id} item={item} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function AmmoRow({ item }: { item: typeof ammo[0] }) {
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
    <Link href={`/wiki/ammo/${item.id}`}>
      <div className="bg-rust-surface rounded-lg p-4 border border-rust-border hover:border-rust-border transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-rust-surface-elevated rounded-lg flex items-center justify-center text-xl">
              {getCategoryEmoji(item.category)}
            </div>
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-rust-text-muted text-sm mt-1 flex items-center gap-3 flex-wrap">
                {item.crafting.output > 1 && (
                  <span className="text-green-400">x{item.crafting.output}</span>
                )}
                <span>WB{item.crafting.workbench}</span>
                {item.crafting.blueprint && (
                  <span className="text-rust-primary">BP</span>
                )}
                {item.effects && item.effects.length > 0 && (
                  <span className="text-rust-primary">{item.effects[0]}</span>
                )}
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
