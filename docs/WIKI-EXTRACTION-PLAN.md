# Wiki Extractie Plan — RustClash Data

> **Doel:** Handmatige extractie van game data van wiki.rustclash.com voor gebruik in de Rust Intel Map applicatie.

---

## Status Overzicht

| Bestand | Status | Items | Bron Pagina |
|---------|--------|-------|-------------|
| `src/data/raid-costs.json` | `pending_browser_extract` | 52 entries | `/raid-chart` |
| `src/data/explosives.json` | `pending_manual_fill` | — | `/item/*` |
| `src/data/buildings.json` | `pending_manual_fill` | — | `/building` |

---

## Extractie Instructies

### 1. Raid Costs (`wiki.rustclash.com/raid-chart`)

Open de pagina in je browser en zoek de raid chart tabel.

**Te extraheren per rij:**

| Veld | Beschrijving | Eenheid | Voorbeeld |
|------|--------------|---------|-----------|
| `hp` | Hit points van het target | integer | `500` |
| `rockets.quantity` | Aantal rockets nodig | integer | `4` |
| `c4.quantity` | Aantal C4 nodig | integer | `2` |
| `satchels.quantity` | Aantal satchels nodig | integer | `10` |
| `explosive_ammo.quantity` | Aantal 5.56 explo ammo | integer | `185` |

**Sulfur kosten worden automatisch berekend** op basis van:
- 1 Rocket = sulfur (extraheer van explosive page)
- 1 C4 = sulfur (extraheer van explosive page)
- 1 Satchel = sulfur (extraheer van explosive page)
- 1 Explosive Ammo = sulfur (extraheer van explosive page)

---

### 2. Explosive Sulfur Costs (`wiki.rustclash.com/item/*`)

Bezoek de item pagina's voor elk explosive type.

**Te extraheren:**

| Explosive | Wiki Page | Te Vinden |
|-----------|-----------|-----------|
| Rocket | `/item/rocket` | Sulfur in recipe |
| C4 (Timed Explosive) | `/item/timed-explosive-charge` | Sulfur in recipe |
| Satchel Charge | `/item/satchel-charge` | Sulfur in recipe |
| Explosive 5.56 | `/item/explosive-556-rifle-ammo` | Sulfur in recipe |

**Let op:** Bereken de TOTALE sulfur, inclusief tussenproducten:
- Gunpowder = 10 sulfur + 20 charcoal
- Explosives = 50 gunpowder + 3 sulfur + 10 metal frags + 3 cloth

---

### 3. Buildings HP & Costs (`wiki.rustclash.com/building`)

**Te extraheren per building type + tier:**

| Veld | Beschrijving | Voorbeeld |
|------|--------------|-----------|
| `hp` | Hit points | `500` |
| `build_cost.wood` | Hout nodig om te bouwen | `300` |
| `build_cost.stone` | Steen nodig | `0` |
| `upgrade_cost.*` | Kosten om te upgraden vanaf vorige tier | `...` |
| `upkeep_cost.*` | Upkeep per 24 uur | `...` |

---

## Workflow voor Data Invoer

### Optie A: Handmatig in JSON

1. Open `src/data/raid-costs.json`
2. Zoek de entry (bijv. `"id": "wall_stone"`)
3. Vul de `null` waarden in:
   ```json
   "hp": 500,
   "rockets": { "quantity": 4, "sulfur_cost": 5600 },
   ```
4. Update `meta.status` naar `"verified"`
5. Update `meta.last_updated` naar huidige datum

### Optie B: Browser Console Script (geavanceerd)

Als de wiki-data in een tabel staat, kun je een script draaien in de browser console om de data te extraheren:

```javascript
// Voorbeeld: Extract tabel data naar JSON
const rows = document.querySelectorAll('table.raid-chart tr');
const data = [];
rows.forEach(row => {
  const cells = row.querySelectorAll('td');
  if (cells.length > 0) {
    data.push({
      name: cells[0]?.innerText,
      hp: parseInt(cells[1]?.innerText),
      rockets: parseInt(cells[2]?.innerText),
      c4: parseInt(cells[3]?.innerText),
      // etc.
    });
  }
});
console.log(JSON.stringify(data, null, 2));
```

**Pas het script aan op de daadwerkelijke tabelstructuur van de wiki.**

---

## Validatie Checklist

Na het invullen van data, controleer:

- [ ] Alle `null` waarden zijn ingevuld
- [ ] HP waarden kloppen met in-game (steekproef)
- [ ] Sulfur costs = quantity × sulfur_per_unit
- [ ] Cheapest method is correct berekend
- [ ] `meta.status` is `"verified"`
- [ ] `meta.last_updated` is ingevuld

---

## RustClash Wiki Pagina's (Verwacht)

| Categorie | Verwachte URL | Data Type |
|-----------|---------------|-----------|
| Raid Chart | `wiki.rustclash.com/raid-chart` | Tabel met raid costs |
| Building | `wiki.rustclash.com/building` | HP, upkeep, build costs |
| Items | `wiki.rustclash.com/items` | Item lijst |
| Item Detail | `wiki.rustclash.com/item/{slug}` | Crafting recipe, stats |
| Weapons | `wiki.rustclash.com/weapons` | Weapon lijst |
| Weapon Detail | `wiki.rustclash.com/weapon/{slug}` | Damage, fire rate, etc. |

---

## Volgende Stappen

1. **Prioriteit 1:** Explosive sulfur costs (nodig voor berekeningen)
2. **Prioriteit 2:** Raid costs tabel (walls, doors, deployables)
3. **Prioriteit 3:** Building HP en construction costs
4. **Later:** Weapons, items, crafting recipes

---

## Contact

Als je vragen hebt over de data structuur of extractie, vraag Claude in de chat.
