# CONTEXT.md — Project Voortgang & Beslissingen

> **Dit bestand wordt door Claude Code bijgehouden.**
> Het bevat alle context die nodig is om het project voort te zetten.

---

## 📊 PROJECT STATUS

| Aspect | Status |
|--------|--------|
| **Huidige fase** | FASE C: Wiki (data structuur bepalen) |
| **Laatste update** | 2026-01-25 |
| **Volgende taak** | Wiki database schema + pagina's bouwen |
| **Blokkades** | Geen |
| **CEO Dashboard** | ✅ Actief in alle sessies |

---

## ✅ VOLTOOIDE TAKEN

### FASE 1: Project Setup ✅ COMPLEET
- [x] 1.1 - GitHub repository aangemaakt
- [x] 1.2 - Repository gecloned
- [x] 1.3 - Next.js project geïnitialiseerd
- [x] 1.4 - Dependencies geïnstalleerd
- [x] 1.5 - Prisma + SQLite setup
- [x] 1.6 - Mappenstructuur aangemaakt
- [x] 1.7 - ESLint + Prettier geconfigureerd
- [x] 1.8 - Eerste commit gemaakt

### FASE 2: Authenticatie ✅ COMPLEET
- [x] 2.1 - NextAuth.js setup (met credentials provider)
- [x] 2.2 - Register pagina + API endpoint
- [x] 2.3 - Login pagina
- [x] 2.4 - Auth middleware (route protection)
- [x] 2.5 - Profiel pagina
- [x] 2.6 - Auth flow getest (build succesvol)
- [x] 2.7 - Commit gemaakt

### FASE 3: Basis UI ✅ COMPLEET
- [x] 3.1 - Layout component met iOS-style header
- [x] 3.2 - Bottom navigation (Map, Teams, Profile)
- [x] 3.3 - Basis UI componenten (Button, Input, Card)
- [x] 3.4 - Dark mode (standaard dark theme geïmplementeerd)
- [x] 3.5 - Commit gemaakt

### FASE 4: Map Sessies ✅ COMPLEET
- [x] 4.1 - "Nieuwe Map" pagina (seed invoeren)
- [x] 4.2 - API endpoint voor map sessions CRUD
- [x] 4.3 - Map sessie lijst pagina
- [x] 4.4 - Map detail pagina met afbeelding
- [x] 4.5 - Commit gemaakt

### FASE 5: Interactieve Map ✅ COMPLEET
- [x] 5.1 - Integreer Leaflet.js
- [x] 5.2 - Custom RustMap component met seed afbeelding
- [x] 5.3 - Pan/zoom functionaliteit
- [x] 5.4 - Coördinaten display (linksonder)
- [x] 5.5 - Commit gemaakt

### FASE 6: Markers CRUD ✅ COMPLEET
- [x] 6.1 - API endpoints voor markers ✅
- [x] 6.2 - "Add Marker" form (bottom sheet) ✅
- [x] 6.3 - Markers op de map tonen ✅
- [x] 6.4 - Marker detail view ✅
- [x] 6.5 - Edit/delete marker functionaliteit ✅
- [x] 6.6 - Filter markers op type ✅
- [x] 6.7 - Test en commit ✅

### FASE A: Landing Page ✅ COMPLEET
- [x] A.1 - Hero sectie met gradient title
- [x] A.2 - Features uitleg (Map, Teams, Wiki)
- [x] A.3 - CTA buttons naar /map en /wiki
- [x] A.4 - Commit gemaakt en gepusht

### FASE B: Guest Mode ✅ COMPLEET
- [x] B.1 - `useGuestMarkers` hook (localStorage)
- [x] B.2 - Guest map pagina (`/map/guest/[seed]`)
- [x] B.3 - Guest add marker form
- [x] B.4 - Guest marker detail sheet (view/edit/delete)
- [x] B.5 - Map pagina dual mode (guest/logged-in)
- [x] B.6 - Proxy.ts updated voor publieke routes
- [x] B.7 - Commit gemaakt en gepusht

### FASE C: Wiki ✅ COMPLEET (Raiding)
- [x] C.1 - Wiki data schema bepalen (items.ts + raid-costs.json)
- [x] C.2 - Raid costs data structuur
- [x] C.3 - Wiki Raiding pagina bouwen (/wiki/raiding)
- [x] C.4 - Item detail pagina's (/wiki/raiding/[id])
- [x] C.5 - Raid data voor 13 items (6 doors, 3 walls, 4 deployables)

### FASE 7: Teams (UITGESTELD)
- [ ] 7.1 - Team aanmaken pagina
- [ ] 7.2 - Team join met code
- [ ] 7.3 - Team members overzicht
- [ ] 7.4 - Marker visibility (private/team/public)
- [ ] 7.5 - Test en commit

*(Teams is uitgesteld, focus ligt nu op Guest Mode + Wiki)*

---

## 🔄 HUIDIGE SESSIE

### Wat er deze sessie is gedaan (2026-01-26):

#### Wiki Raiding UI gebouwd
- `/wiki/raiding` - Raid cost chart pagina met tabel
- `/wiki/raiding/[id]` - Detail pagina per item
- `src/data/items.ts` - Item details (crafting, upkeep, tips)
- `report.md` gebruikt als format voorbeeld

#### Raid Data toegevoegd (13 items totaal):

**Doors (6):**
| Item | HP | Cheapest Method | Sulfur |
|------|-----|-----------------|--------|
| Wooden Door | 200 | Explo Ammo (28) | 700 |
| Sheet Metal Door | 250 | Explo Ammo (63) | 1,575 |
| Double Sheet Metal | 250 | Explo Ammo (63) | 1,575 |
| Garage Door | 600 | Explo Ammo (150) | 3,750 |
| Armored Door | 800 | C4 (2) | 4,400 |
| Ladder Hatch | 250 | Explo Ammo (63) | 1,575 |

**Walls (3):**
| Item | HP | Cheapest Method | Sulfur |
|------|-----|-----------------|--------|
| Stone Wall | 500 | C4 (2) | 4,400 |
| Sheet Metal Wall | 1000 | C4 (4) | 8,800 |
| Armored Wall | 2000 | C4 (8) | 17,600 |

**Deployables (4):**
| Item | HP | Cheapest Method | Sulfur |
|------|-----|-----------------|--------|
| Tool Cupboard | 250 | Explo Ammo (63) | 1,575 |
| Auto Turret | 1000 | Explo Ammo (100) | 2,500 |
| High External Wood | 500 | Explo Ammo (50) | 1,250 |
| High External Stone | 500 | Satchels (4) | 1,920 |

#### Commits:
- `dfa3aa5` - feat: Add Wiki Raiding page with raid cost chart
- `e6e7848` - docs: Update CONTEXT.md with wiki raiding progress
- `faaf206` - feat: Add raid cost data for doors, walls, and deployables

### Eerdere sessies:
- FASE 1-6 compleet
- FASE A (Landing Page) compleet
- FASE B (Guest Mode) compleet
- CEO Dashboard actief

### Wat er nog moet gebeuren:
1. **FASE C:** Meer wiki categorieën (Monuments, Weapons, Items)
2. **Later:** Teams functionaliteit

### Volgende stap:
Wiki verder uitbreiden met andere categorieën of meer raid items toevoegen.

---

## 🚀 NIEUWE FEATURES GEPLAND (2026-01-25)

### Richting wijziging
Het project krijgt een nieuwe focus:
1. **Site bruikbaar zonder login** (zoals reddead.gg)
2. **Login meer verborgen** - niet prominent op homepage
3. **Rust Wiki toevoegen** - eigen content, geen externe links

### Geplande features:

#### 1. Landing Page (`/`)
- Hero sectie met titel "Rust Console Intel Map"
- Features uitleg (Map, Teams, Wiki)
- "Bekijk Map" knop (werkt zonder login)
- "Bekijk Wiki" knop
- Kleine "Login" link in de header (niet prominent)

#### 2. Guest Mode (Map zonder login)
- Iedereen kan de map bekijken
- Guest markers opgeslagen in localStorage (browser)
- Pas bij login worden markers gesynchroniseerd naar account
- Visual indicator dat je als guest werkt

#### 3. Rust Wiki (`/wiki`)
- Eigen wiki pagina's (zelf beheerd)
- Categorieën:
  - 🏛️ Monuments - Alle monuments met loot info
  - 🔫 Weapons - Wapens, damage, crafting
  - 🏠 Building - Base designs, upkeep, materials
  - 💣 Raiding - Raid costs, explosives, strategies
  - 🎒 Items - Alle items in het spel
  - 🗺️ Map Tips - Console-specifieke tips
- Admin kan wiki content bewerken

### Inspiratie:
- **wiki.rustclash.com** - Fijne wiki layout (zonder de goksite)
- **reddead.gg** - Goede UX, site bruikbaar zonder login

---

## 📊 WIKI DATA EXTRACTIE STATUS

### RustClash Wiki Data (`wiki.rustclash.com`)

| Categorie | Entries | Status | Bron Pagina |
|-----------|---------|--------|-------------|
| Explosive Sulfur Costs | 8 | `pending_browser_extract` | `/item/*` |
| Building Raid Costs | 30 | `pending_browser_extract` | `/raid-chart` |
| Door Raid Costs | 11 | `pending_browser_extract` | `/raid-chart` |
| Deployable Raid Costs | 11 | `pending_browser_extract` | `/raid-chart` |
| Building HP/Upkeep | — | `pending_manual_fill` | `/building` |
| Weapons | — | `pending_manual_fill` | `/weapons` |
| Items | — | `pending_manual_fill` | `/items` |

### Velden per Raid Entry:
```
hp, rockets, c4, satchels, explosive_ammo, cheapest_sulfur, cheapest_method
```

### Extractie Workflow:
1. Open `wiki.rustclash.com/raid-chart` in browser
2. Lees de tabel data af
3. Vul in `src/data/raid-costs.json`
4. Update `meta.status` naar `verified`
5. Commit en push

Zie `docs/WIKI-EXTRACTION-PLAN.md` voor volledige instructies.

---

## 🐛 BEKENDE ISSUES

| Issue | Prioriteit | Status | Notities |
|-------|------------|--------|----------|
| Wiki 403 block | Medium | Workaround | Handmatige browser extractie nodig |

---

## 🖥️ STATUSLINE CONFIGURATIE ✅ COMPLEET

**Laatste update:** 2026-01-25

### Bestanden:
- **Settings:** `C:\Users\Damian\.claude\settings.json`
- **Script:** `C:\Users\Damian\.claude\statusline.ps1`

### Wat de statusline toont:
```
🤖 Claude Opus 4 | 📁 rust-project | 🌿 main +2 ~1 ?3 | [████████░░░░] 45% (90K/200K) | ⏰ 14:35
```

| Onderdeel | Beschrijving | Kleur |
|-----------|--------------|-------|
| 🤖 Model | Claude model naam | wit |
| 📁 Directory | Huidige map (alleen folder naam) | blauw |
| 🌿 Git branch | Branch naam | groen |
| +N | Staged files | geel |
| ~N | Modified/unstaged files | rood |
| ?N | Untracked files | grijs |
| Progress bar | Context window gebruik | groen→geel→rood |
| Percentage | Token gebruik (gebruikt/totaal) | past bij bar |
| ⏰ Tijd | Huidige tijd HH:MM | cyaan |

### Settings.json configuratie:
```json
{
  "statusLine": {
    "type": "command",
    "command": "powershell -NoProfile -ExecutionPolicy Bypass -File C:\\Users\\Damian\\.claude\\statusline.ps1"
  }
}
```

### Git status betekenis:
- **+N** = N bestanden staged (klaar voor commit)
- **~N** = N bestanden gewijzigd maar niet staged
- **?N** = N nieuwe bestanden (untracked)

---

## 📝 BELANGRIJKE BESLISSINGEN

### [DATUM] — Database keuze
**Beslissing:** SQLite voor development, PostgreSQL voor productie  
**Reden:** Geen extra setup nodig om te starten  
**Impact:** Makkelijker lokaal testen, later migreren naar hosted DB

### [DATUM] — Map library
**Beslissing:** Leaflet.js in plaats van MapLibre  
**Reden:** Simpeler, meer tutorials, voldoende voor onze needs  
**Impact:** Minder geavanceerde features, maar sneller development

*(Nieuwe beslissingen worden hier toegevoegd)*

---

## 🗺 MAP SEED INFORMATIE

### Hoe seeds werken:
- Rust Console gebruikt procedureel gegenereerde maps
- Elke map heeft een unieke "seed" (nummer/string)
- Map afbeeldingen moeten handmatig worden toegevoegd aan `public/maps/[seed].png`

### Bekende seeds:
| Seed | Server | Map Size | Notities |
|------|--------|----------|----------|
| 10358 | - | 4000 | Eerste test map, afbeelding via Discord |

---

## 🔧 TECHNISCHE NOTITIES

### Environment Variables (.env.local)
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="[random-string]"
NEXTAUTH_URL="http://localhost:3000"
```

### NPM Scripts
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "type-check": "tsc --noEmit",
  "db:push": "prisma db push",
  "db:studio": "prisma studio",
  "db:backup": "ts-node scripts/backup.ts"
}
```

### Belangrijke paden:
- Database: `prisma/dev.db`
- Backups: `backups/`
- Map afbeeldingen: `public/maps/`
- API routes: `src/app/api/`

---

## 📦 GEÏNSTALLEERDE PACKAGES

### Dependencies:
```
next
react
react-dom
@prisma/client
next-auth
leaflet
react-leaflet
zod
tailwindcss
@radix-ui/react-*
```

### Dev Dependencies:
```
typescript
@types/node
@types/react
@types/leaflet
prisma
eslint
prettier
```

---

## 🔙 BACKUP LOG

| Datum | Bestand | Grootte | Trigger |
|-------|---------|---------|---------|
| *Nog geen backups* | - | - | - |

---

## 📞 CONTACT & LINKS

- **GitHub:** github.com/Pej147/rust-project
- **Lokaal:** C:\Users\...\Documents\rust-project
- **Dev server:** http://localhost:3000

---

## 📋 VOLGENDE SESSIE STARTEN

Wanneer je een nieuwe sessie start met Claude Code, stuur dit bericht:

```
Lees docs/CONTEXT.md en ga verder waar we gebleven waren.
De laatste voltooide taak was: [TAAK]
De volgende taak is: [TAAK]
```

---

*Laatste update: 2026-01-25 — FASE A (Landing Page) + FASE B (Guest Mode) COMPLEET, statusline bugfix*
