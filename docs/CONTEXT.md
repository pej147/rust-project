# CONTEXT.md — Project Voortgang & Beslissingen

> **Dit bestand wordt door Claude Code bijgehouden.**
> Het bevat alle context die nodig is om het project voort te zetten.

---

## 📊 PROJECT STATUS

| Aspect | Status |
|--------|--------|
| **Huidige fase** | Marker Visibility + Map Polish |
| **Laatste update** | 2026-02-01 |
| **Volgende taak** | FASE 9: Command Bar of FASE 10: Polish |
| **Blokkades** | Geen |
| **CEO Dashboard** | ✅ Actief in alle sessies |
| **Totaal Wiki Pagina's** | 208 |
| **Taal** | English (UI) / Dutch (Wiki - to be translated) |

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

### FASE C: Wiki ✅ VOLLEDIG COMPLEET
- [x] C.1 - Wiki data schema bepalen (items.ts + raid-costs.json)
- [x] C.2 - Raid costs data structuur
- [x] C.3 - Wiki Raiding pagina bouwen (/wiki/raiding)
- [x] C.4 - Item detail pagina's (/wiki/raiding/[id])
- [x] C.5 - Raid data voor 13 items (6 doors, 3 walls, 4 deployables)
- [x] C.6 - ALLE raid data ingevuld (52 items totaal)
- [x] C.7 - Wiki Items (58 items: resources, components, tools, medical)
- [x] C.8 - Wiki Monuments (24 monuments: T1, T2, T3, Safe Zones)
- [x] C.9 - Wiki Weapons (19 items: melee, bows, arrows)

### FASE 7: Teams ✅ COMPLEET
- [x] 7.1 - Team create page + API ✅
- [x] 7.2 - Team join with code ✅
- [x] 7.3 - Team members overview ✅
- [x] 7.4 - Role management (Owner/Admin/Member) ✅
- [x] 7.5 - Build tested and committed ✅

**Implemented features:**
- Create team (generates unique 6-char code)
- Join team by code
- View team members with roles
- Owner can: promote/demote, kick anyone, delete team
- Admin can: kick members
- Member can: leave team
- All UI in English

### FASE 8: Admin Dashboard ✅ COMPLEET
- [x] 8.1 - Admin-only route guard (`requireAdmin` helper) ✅
- [x] 8.2 - Users management (list, create, update role, delete) ✅
- [x] 8.3 - Map sessions overview (list, delete) ✅
- [x] 8.4 - Add/remove user functionality ✅
- [x] 8.5 - Audit log viewer with pagination ✅
- [x] 8.6 - Build tested and committed ✅

**API Routes created:**
- `GET /api/admin/stats` - Dashboard statistics
- `GET/POST /api/admin/users` - List and create users
- `GET/PATCH/DELETE /api/admin/users/[id]` - User management
- `GET /api/admin/maps` - List all map sessions
- `DELETE /api/admin/maps/[id]` - Delete map session
- `GET /api/admin/audit` - Audit logs with pagination

**Frontend pages:**
- `/admin` - Dashboard with stats and quick links
- `/admin/users` - User management table
- `/admin/maps` - Map sessions grid
- `/admin/audit` - Audit log viewer

**Features:**
- Admin nav item in bottom navigation (only for admins)
- Stats overview (users, maps, markers, teams)
- User role distribution chart
- Marker type distribution
- Create new users
- Change user roles (cannot demote yourself)
- Delete users (cannot delete yourself)
- View and delete map sessions
- Paginated audit logs with action colors
- All actions are logged to AuditLog

---

## 🔄 HUIDIGE SESSIE

### Wat er deze sessie is gedaan (2026-02-01):

#### Marker Visibility — Visuele Feedback ✅ COMPLEET
- [x] Visibility badge op map markers (🔒 Private, 👥 Team, 🌐 Public)
- [x] Visibility label in Leaflet popups (non-enemy markers)
- [x] Visibility badge in enemy popup header
- [x] Visibility filter sectie in filter panel (3 chips met counts)
- [x] Filter logica: markers filteren op zowel type ALS visibility

**Files modified:**
- `src/components/map/rust-map.tsx` — badge op markers + visibility in popup
- `src/components/map/enemy-marker-popup.tsx` — visibility badge in header
- `src/components/map/marker-filter.tsx` — visibility filter sectie
- `src/app/(dashboard)/map/[id]/page.tsx` — visibility filter state + logica

#### Enemy Popup Fix — Leaflet Popup ✅ COMPLEET
- **Issue:** Custom React popup (position: fixed) bleef op oude screen-positie staan bij map pan/zoom
- **Fix:** Vervangen door Leaflet's ingebouwde popup systeem — popup beweegt nu automatisch mee
- **Bonus:** Popup werkt nu in zowel guest mode als logged-in mode
  - Guest mode: leest residents direct van marker object (localStorage)
  - Logged-in mode: haalt residents op via API
- **Settings knop:** Opent de detail bottom sheet vanuit de Leaflet popup

**Files modified:**
- `src/components/map/rust-map.tsx` — Leaflet popup voor enemy markers, residents laden
- `src/app/(dashboard)/map/[id]/page.tsx` — verwijderd: EnemyMarkerPopup, vereenvoudigd marker click
- `src/app/(dashboard)/map/guest/[seed]/page.tsx` — verwijderd: GuestEnemyMarkerPopup

#### Map Achtergrond Fix ✅ COMPLEET
- **Issue:** Lege ruimte (zwart) zichtbaar rond de kaart bij pannen/zoomen
- **Eerste poging:** CSS background-image — veroorzaakte dubbel-beeld effect
- **Definitieve fix:** maxBounds strakker (geen padding), minZoom -2 → -1
- **Resultaat:** Kaart vult het scherm, geen lege randen meer

**Files modified:**
- `src/components/map/rust-map.tsx` — bounds en zoom limieten
- `src/components/map/map-styles.css` — donkere achtergrond voor Leaflet container

---

### Wat er vorige sessie is gedaan (2026-01-27):

#### Enemy Marker Click Fix ✅ FIXED
- **Issue:** Clicking ENEMY marker didn't show player names (residents)
- **Root cause:** Click event was propagating to the map, opening Add Marker sheet instead
- **Fix:** Used ref flag to prevent map click after marker click
- **Status:** ✅ Fixed and pushed to GitHub

**Files modified:**
- `src/components/map/rust-map.tsx` - added markerClickedRef to block map click after marker click

#### Guest Mode Enemy Sheet ✅ IMPLEMENTED
- **Added:** `GuestEnemyMarkerSheet` component for guest mode
- **Added:** `residents` field to GuestMarker interface
- **Added:** Guest mode now shows Enemy Base sheet for ENEMY markers
- **Changed:** All `/map` routes are now public (login optional)

**Files created/modified:**
- `src/components/map/guest-enemy-marker-sheet.tsx` - NEW
- `src/app/(dashboard)/map/guest/[seed]/page.tsx` - added enemy sheet
- `src/hooks/use-guest-markers.ts` - added GuestResident interface
- `src/proxy.ts` - made all /map routes public

#### Interactive Popup Menu ✅ IMPLEMENTED
- **Request:** User wanted interactive menu that stays over the map (not bottom sheet)
- **Solution:** Created popup/tooltip style menu near the marker

**New components:**
- `src/components/map/enemy-marker-popup.tsx` - For logged-in users
- `src/components/map/guest-enemy-marker-popup.tsx` - For guest mode

**Features:**
- Popup appears near the clicked marker (not at bottom)
- Auto-positions left/right based on screen edge
- Arrow pointer points to the marker
- Shows residents list with threat levels
- Add/remove players (with form)
- ⚙️ Settings button opens MarkerDetailSheet
- Click outside closes popup
- Smooth animation on open

**Technical changes:**
- `rust-map.tsx` - Pass screen coordinates from marker click event
- `[id]/page.tsx` - Use popup instead of bottom sheet
- `guest/[seed]/page.tsx` - Use guest popup instead of bottom sheet

#### UI Translation Dutch → English ✅
- **Translated 10 files** from Dutch to English
- **Auth pages:** login, register (labels, placeholders, errors)
- **Profile page:** title, logout button
- **Landing page:** all hero, features, CTA sections
- **Map pages:** main, new, guest mode (error messages, placeholders)
- **Marker components:** add-marker-form, marker-detail-sheet (all text)
- **Rust map:** error messages, comments, tooltips
- **Wiki pages:** Left in Dutch (to be translated later)

**Files changed:**
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/page.tsx`
- `src/app/(dashboard)/profile/page.tsx`
- `src/app/(dashboard)/map/page.tsx`
- `src/app/(dashboard)/map/new/page.tsx`
- `src/app/(dashboard)/map/guest/[seed]/page.tsx`
- `src/app/page.tsx`
- `src/components/map/add-marker-form.tsx`
- `src/components/map/marker-detail-sheet.tsx`
- `src/components/map/rust-map.tsx`

#### Enemy Marker Residents Feature ✅
- **Database:** Added `MarkerResident` model for many-to-many relation
  - A marker can now have multiple enemy profiles (residents)
  - Each resident has a threat level (1-5 skulls)
- **API Endpoints:**
  - `GET/POST /api/enemies` - Search and create enemy profiles
  - `GET/POST/DELETE /api/markers/[id]/residents` - Manage residents
- **Frontend:**
  - `EnemyMarkerSheet` component - shows residents when clicking ENEMY marker
  - Add player form with name, clan tag, threat level
  - Remove player button for marker owners
  - Settings button → opens normal MarkerDetailSheet
- **Flow:** Click ENEMY marker → See residents → Settings for edit/delete

#### Previous: FASE 8: Admin Dashboard Implemented
- **Admin guard:** Server-side `requireAdmin()` function
- **Client-side:** `isAdmin()` helper in separate file (for client components)
- **Hooks:** `useAdminStats`, `useAdminUsers`, `useAdminMaps`, `useAuditLogs`
- **Stats API:** Totals, recent activity, distributions
- **Full CRUD:** Users and maps management
- **Audit logging:** All admin actions are logged
- **Bottom nav:** Admin link only shown for admin users

#### Previous: FASE 7: Teams Implemented
- **API Routes created:**
  - `POST /api/teams` - Create team
  - `GET /api/teams` - List user's teams
  - `POST /api/teams/join` - Join team by code
  - `GET /api/teams/[id]` - Team details
  - `PATCH /api/teams/[id]` - Update team
  - `DELETE /api/teams/[id]` - Delete team
  - `GET /api/teams/[id]/members` - List members
  - `POST /api/teams/[id]/members` - Member actions (leave/remove/update role)

- **Frontend components:**
  - `useTeams` hook for state management
  - TeamCard component
  - CreateTeamSheet (bottom sheet)
  - JoinTeamSheet (bottom sheet)
  - TeamDetailSheet with member management
  - RoleBadge component (Owner/Admin/Member)

- **Features:**
  - 6-character unique team codes
  - Role-based permissions (OWNER > ADMIN > MEMBER)
  - Copy team code to clipboard
  - Promote/demote members
  - Kick members (respects role hierarchy)
  - Leave team / Delete team

- **UI translated to English** (site is for English users)

#### Previous: Wiki Items Toegevoegd (58 items)
- **Resources (17):** Wood, Stone, Metal Ore, Sulfur, HQM, etc.
- **Components (18):** Gears, Springs, Pipes, Weapon Bodies, etc.
- **Tools (14):** Rock → Stone → Metal → Salvaged → Power tools
- **Medical (9):** Bandages, Syringes, Med Kits, Teas

#### Previous: Wiki Monuments Toegevoegd (24 monuments)
- **Tier 1 Green (10):** Lighthouse, Supermarket, Harbor, Satellite, etc.
- **Tier 2 Blue (7):** Train Yard, Water Treatment, Power Plant, Airfield, Dome, etc.
- **Tier 3 Red (5):** Launch Site, Military Tunnels, Oil Rigs, Underwater Labs
- **Safe Zones (2):** Outpost, Bandit Camp

#### Wiki Weapons Toegevoegd (37 items)
- **Melee Primitive (5):** Rock, Spears, Bone Club, Bone Knife
- **Melee Salvaged (3):** Salvaged Sword, Cleaver, Machete
- **Melee Military (3):** Longsword, Mace, Combat Knife
- **Bows (4):** Hunting Bow, Crossbow, Compound Bow, Nail Gun
- **Arrows (4):** Wooden, High Velocity, Bone, Fire
- **Pistols (5):** Eoka, Revolver, Semi-Auto Pistol, Python, M92
- **SMGs (3):** Custom SMG, Thompson, MP5A4
- **Rifles (6):** Semi-Auto Rifle, AK-47, LR-300, Bolt Action, L96, M39
- **Shotguns (4):** Waterpipe, Double Barrel, Pump, Spas-12

#### Wiki Ammo Toegevoegd (20 items)
- **Pistol Ammo (3):** Pistol Bullet, HV Pistol, Incendiary Pistol
- **Rifle Ammo (4):** 5.56, HV 5.56, Incendiary 5.56, Explosive 5.56
- **Shotgun Ammo (4):** Handmade Shell, Buckshot, Slug, Incendiary Shell
- **Rockets (3):** Rocket, HV Rocket, Incendiary Rocket
- **Throwables (4):** F1 Grenade, Beancan, Smoke, Flashbang
- **Explosives (4):** C4, Satchel, Explosives component, Gunpowder

### Wiki Totaal Overzicht:
| Categorie | Items | Status |
|-----------|-------|--------|
| 💣 Raiding | 52 | ✅ Compleet |
| 🎒 Items | 58 | ✅ Compleet |
| 🏛️ Monuments | 24 | ✅ Compleet |
| 🔫 Weapons | 37 | ✅ Compleet |
| 🎯 Ammo | 20 | ✅ Compleet |
| **Totaal** | **191 entries** | |
| **Pagina's** | **208** | |

### Wat er nog kan:
1. **FASE 9: Command Bar** - Floating input voor snelle marker commands
2. **FASE 10: Polish & Extras** - Backup script, error handling, responsive check
3. **Building wiki:** Base designs, upkeep
4. **Wiki Translation:** Translate wiki pages from Dutch to English
5. ~~**Marker team visibility:** Markers delen met team (private/team/public)~~ ✅ Visuele feedback toegevoegd

### Volgende stap:
User can choose: Command Bar (FASE 9), Polish (FASE 10), Building wiki, or Wiki translation.

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
| ~~Enemy marker click~~ | ~~High~~ | ✅ Fixed | Event propagation fix applied |
| ~~Enemy popup positie~~ | ~~High~~ | ✅ Fixed | Replaced with Leaflet popup |
| ~~Map lege randen~~ | ~~Medium~~ | ✅ Fixed | Tighter bounds + higher minZoom |
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
| 10445 | - | 4000 | Toegevoegd via Imgur, alle monuments gelabeld |

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

*Laatste update: 2026-02-01 — Marker Visibility + Map Polish*
