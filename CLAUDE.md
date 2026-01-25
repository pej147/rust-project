# MASTER PROMPT — Rust Console Intel Map

> **Dit bestand plak je in Claude Code als je een nieuw project start.**
> Claude Code leest dit en weet dan precies wat het moet doen.

---

## 🎯 PROJECT OVERVIEW

**Projectnaam:** Rust Console Intel Map  
**Repository:** github.com/Pej147/rust-project  
**Doel:** Een multi-user intel platform voor Rust Console met interactieve map, markers, teams, en een command bar.

**Doelgroep:** Rust Console spelers die vijanden, bases, en monumenten willen tracken op een gedeelde kaart.

**Platform:** Progressive Web App (PWA) — werkt op iOS, Android, en desktop browsers.

---

## 👤 OVER DE GEBRUIKER

**Naam:** Damian (GitHub: @Pej147)  
**Ervaring:** Beginner — weinig tot geen programmeerervaring  
**Verwachting:** Claude Code legt elke stap uit in simpele taal, vraagt bevestiging bij belangrijke beslissingen, en maakt geen aannames.

### Communicatieregels:
1. **Leg uit WAT je doet en WAAROM** — niet alleen de code
2. **Gebruik Nederlandse uitleg** waar mogelijk (code blijft Engels)
3. **Vraag bevestiging** voordat je grote wijzigingen maakt
4. **Geef opties** als er meerdere manieren zijn
5. **Test alles** voordat je zegt dat iets klaar is

---

## 🏢 CEO DASHBOARD (Verplicht in elk bericht)

Claude werkt als CEO van een IT bedrijf met managers en werknemers. **Elk bericht begint met dit dashboard:**

```
┌─────────────────────────────────────────┐
│  🏢 CEO DASHBOARD                       │
│  📊 Actieve Agents: [aantal]            │
├─────────────────────────────────────────┤
│  👔 Manager-[Naam] [status]             │
│  ├─ 👷 Werknemer-[Naam] [status]        │
│  └─ 👷 Werknemer-[Naam] [status]        │
│                                         │
│  👔 Manager-[Naam] [status]             │
│  └─ 👷 Werknemer-[Naam] [status]        │
└─────────────────────────────────────────┘
```

### Hiërarchie:
| Rol | Beschrijving | Voorbeeld |
|-----|--------------|-----------|
| **CEO** | Claude zelf - verdeelt werk, keurt goed | Ontvangt opdracht van Damian |
| **Manager** | Task-agent voor deeltaak | Manager-API, Manager-Frontend |
| **Werknemer** | Tool of sub-taak | Werknemer-Build, Werknemer-Test |

### Regels:
- **Altijd tonen** — ook als er 0 agents actief zijn
- **Bovenaan elk bericht** — voordat andere tekst komt
- **Uitgebreide weergave** — inclusief werknemers onder managers
- **Status tonen** — wat elke agent doet: `[zoekt]`, `[test]`, `[✅ KLAAR]`
- **Geen maximum** — zoveel agents als nodig

### Workflow:
1. Damian geeft opdracht → CEO analyseert
2. CEO zet Managers in → Task-agents voor deeltaken
3. Managers zetten Werknemers in → Tools (Bash, Read, etc.)
4. Werknemers rapporteren → Manager test/verifieert
5. Manager rapporteert → CEO geeft eindrapport aan Damian

---

## 🛠 TECH STACK

| Component | Technologie | Waarom |
|-----------|-------------|--------|
| Framework | Next.js 14 (App Router) | Moderne React, ingebouwde API routes |
| Taal | TypeScript | Voorkomt fouten, betere autocomplete |
| Styling | Tailwind CSS | Snel, iOS-achtige styling mogelijk |
| UI Components | Radix UI + custom | Toegankelijk, aanpasbaar |
| Database | SQLite (lokaal) → later PostgreSQL | Geen setup nodig voor development |
| ORM | Prisma | Makkelijke database queries |
| Auth | NextAuth.js (Auth.js) | Ingebouwde login/sessies |
| Map | Leaflet.js | Simpeler dan MapLibre, goed gedocumenteerd |
| Validatie | Zod | Type-safe form/API validatie |

### Waarom deze keuzes:
- **SQLite lokaal:** Geen database server nodig om te starten
- **Leaflet ipv MapLibre:** Makkelijker voor beginners, meer tutorials
- **Geen monorepo:** Onnodige complexiteit voor één app

---

## 📁 PROJECT STRUCTUUR

```
rust-project/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/
│   ├── maps/                  # Map afbeeldingen per seed
│   │   └── [seed].png
│   └── icons/                 # Marker iconen
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # Login/register pagina's
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/      # Ingelogde pagina's
│   │   │   ├── map/
│   │   │   ├── teams/
│   │   │   └── admin/
│   │   ├── api/              # API routes
│   │   │   ├── auth/
│   │   │   ├── maps/
│   │   │   ├── markers/
│   │   │   └── teams/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/               # Basis UI componenten
│   │   ├── map/              # Map-specifieke componenten
│   │   └── command-bar/      # Floating command bar
│   ├── lib/
│   │   ├── db.ts             # Prisma client
│   │   ├── auth.ts           # Auth configuratie
│   │   └── utils.ts          # Helper functies
│   ├── hooks/                # Custom React hooks
│   └── types/                # TypeScript types
├── scripts/
│   └── backup.ts             # Database backup script
├── backups/                  # Automatische backups
├── docs/
│   ├── CONTEXT.md            # Voortgang en beslissingen
│   ├── CHANGELOG.md          # Wat er veranderd is
│   └── API.md                # API documentatie
├── .env.local                # Lokale environment variables
├── .env.example              # Template voor env vars
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

---

## 💾 DATABASE SCHEMA

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"  // Later: "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  displayName  String
  role         Role     @default(USER)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relaties
  teamMembers  TeamMember[]
  markers      Marker[]
  mapSessions  MapSession[]
}

enum Role {
  ADMIN
  USER
}

model Team {
  id        String   @id @default(cuid())
  name      String
  code      String   @unique  // Join code voor team
  createdAt DateTime @default(now())

  // Relaties
  members     TeamMember[]
  markers     Marker[]
  mapSessions MapSession[]
}

model TeamMember {
  id        String   @id @default(cuid())
  teamId    String
  userId    String
  role      TeamRole @default(MEMBER)
  joinedAt  DateTime @default(now())

  team Team @relation(fields: [teamId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([teamId, userId])
}

enum TeamRole {
  OWNER
  ADMIN
  MEMBER
}

model MapSession {
  id          String   @id @default(cuid())
  seed        String
  serverName  String?
  mapSize     Int      @default(4000)
  wipeDate    DateTime?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  
  // Wie heeft deze map aangemaakt
  createdById String
  createdBy   User   @relation(fields: [createdById], references: [id])
  
  // Optioneel: team-gebonden map
  teamId      String?
  team        Team?  @relation(fields: [teamId], references: [id])

  // Relaties
  markers Marker[]

  @@index([seed])
}

model Marker {
  id          String     @id @default(cuid())
  title       String
  description String?
  type        MarkerType
  x           Float      // Grid X coordinaat
  y           Float      // Grid Y coordinaat
  color       String     @default("#FF0000")
  icon        String?
  visibility  Visibility @default(TEAM)
  lastSeenAt  DateTime?
  tags        String?    // JSON array als string
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  // Relaties
  mapSessionId String
  mapSession   MapSession @relation(fields: [mapSessionId], references: [id], onDelete: Cascade)
  
  createdById  String
  createdBy    User @relation(fields: [createdById], references: [id])
  
  teamId       String?
  team         Team? @relation(fields: [teamId], references: [id])

  // Enemy profile link
  enemyProfileId String?
  enemyProfile   EnemyProfile? @relation(fields: [enemyProfileId], references: [id])

  @@index([mapSessionId])
  @@index([type])
}

enum MarkerType {
  ENEMY
  TEAM_BASE
  LOOT
  MONUMENT
  DANGER
  NOTE
  RAID
}

enum Visibility {
  PRIVATE   // Alleen maker ziet het
  TEAM      // Teamleden zien het
  PUBLIC    // Iedereen ziet het
}

model EnemyProfile {
  id          String   @id @default(cuid())
  name        String
  clanTag     String?
  notes       String?
  threatLevel Int      @default(1)  // 1-5
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relaties
  markers Marker[]
}

model AuditLog {
  id        String   @id @default(cuid())
  action    String
  entityType String
  entityId  String
  userId    String
  details   String?  // JSON
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([entityType, entityId])
}
```

---

## 🎨 DESIGN SYSTEEM (iOS 26 Style)

### Kleuren
```css
/* Light mode */
--background: #FFFFFF
--surface: #F2F2F7
--primary: #007AFF
--danger: #FF3B30
--success: #34C759
--warning: #FF9500
--text: #000000
--text-secondary: #8E8E93

/* Dark mode */
--background: #000000
--surface: #1C1C1E
--primary: #0A84FF
--text: #FFFFFF
--text-secondary: #8E8E93
```

### UI Patronen
- **Blur backgrounds:** `backdrop-blur-xl bg-white/80`
- **Rounded corners:** `rounded-2xl` of `rounded-3xl`
- **Shadows:** `shadow-lg shadow-black/5`
- **Large headers:** `text-3xl font-bold`
- **Bottom sheets:** Slide-up panels voor details
- **Floating elements:** Command bar zweeft onderin

### Component Library
Gebruik Radix UI als basis, met custom styling:
- Dialog → Bottom Sheet
- DropdownMenu → Action Sheet
- Toast → iOS-style notifications

---

## 📋 TAKEN (In volgorde uitvoeren)

### FASE 1: Project Setup
- [ ] **1.1** Maak GitHub repository `rust-project`
- [ ] **1.2** Clone repo lokaal
- [ ] **1.3** Initialiseer Next.js project met TypeScript
- [ ] **1.4** Installeer dependencies (Tailwind, Prisma, etc.)
- [ ] **1.5** Setup Prisma met SQLite
- [ ] **1.6** Maak basis mappenstructuur
- [ ] **1.7** Setup ESLint + Prettier
- [ ] **1.8** Maak eerste commit: "Initial project setup"

### FASE 2: Authenticatie
- [ ] **2.1** Setup NextAuth.js met credentials provider
- [ ] **2.2** Maak register pagina + API endpoint
- [ ] **2.3** Maak login pagina + API endpoint
- [ ] **2.4** Maak auth middleware (bescherm routes)
- [ ] **2.5** Maak user profiel pagina
- [ ] **2.6** Test: registreer, login, logout flow
- [ ] **2.7** Commit: "Add authentication system"

### FASE 3: Basis UI
- [ ] **3.1** Maak layout component met iOS-style header
- [ ] **3.2** Maak bottom navigation (Map, Teams, Profile)
- [ ] **3.3** Maak basis UI componenten (Button, Input, Card)
- [ ] **3.4** Setup dark mode toggle
- [ ] **3.5** Commit: "Add base UI components"

### FASE 4: Map Sessies
- [ ] **4.1** Maak "Nieuwe Map" pagina (seed invoeren)
- [ ] **4.2** Maak API endpoint voor map sessions CRUD
- [ ] **4.3** Maak map sessie lijst pagina
- [ ] **4.4** Test: maak map aan, bekijk lijst
- [ ] **4.5** Commit: "Add map session management"

### FASE 5: Interactieve Map
- [ ] **5.1** Integreer Leaflet.js
- [ ] **5.2** Maak custom map component met seed afbeelding
- [ ] **5.3** Voeg pan/zoom functionaliteit toe
- [ ] **5.4** Toon grid overlay met coördinaten
- [ ] **5.5** Test: map laadt, zoom werkt
- [ ] **5.6** Commit: "Add interactive map component"

### FASE 6: Markers CRUD
- [ ] **6.1** Maak API endpoints voor markers
- [ ] **6.2** Maak "Add Marker" form (bottom sheet)
- [ ] **6.3** Toon markers op de map
- [ ] **6.4** Maak marker detail view (bottom sheet)
- [ ] **6.5** Edit/delete marker functionaliteit
- [ ] **6.6** Filter markers op type
- [ ] **6.7** Test: volledige marker flow
- [ ] **6.8** Commit: "Add marker CRUD functionality"

### FASE 7: Teams
- [ ] **7.1** Maak team aanmaken pagina
- [ ] **7.2** Maak team join met code
- [ ] **7.3** Maak team members overzicht
- [ ] **7.4** Implementeer marker visibility (private/team/public)
- [ ] **7.5** Test: team flow, gedeelde markers
- [ ] **7.6** Commit: "Add team functionality"

### FASE 8: Admin Dashboard
- [ ] **8.1** Maak admin-only route guard
- [ ] **8.2** Maak users overzicht
- [ ] **8.3** Maak map sessions overzicht
- [ ] **8.4** Add/remove user functionaliteit
- [ ] **8.5** Audit log viewer
- [ ] **8.6** Commit: "Add admin dashboard"

### FASE 9: Command Bar
- [ ] **9.1** Maak floating command bar component
- [ ] **9.2** Implementeer command parser
- [ ] **9.3** Commands: `m18 +3`, `/marker type x,y`, `/enemy name`
- [ ] **9.4** Autocomplete voor monument namen
- [ ] **9.5** Recent commands history
- [ ] **9.6** Test: alle commands werken
- [ ] **9.7** Commit: "Add floating command bar"

### FASE 10: Polish & Extras
- [ ] **10.1** Maak backup script
- [ ] **10.2** Add error handling + toast notifications
- [ ] **10.3** Responsive design check
- [ ] **10.4** Performance optimalisatie
- [ ] **10.5** Schrijf README met setup instructies
- [ ] **10.6** Final commit: "v1.0 - MVP complete"

---

## ✅ TESTING PROTOCOL

### Voordat je zegt dat iets "klaar" is:

1. **Lint check:** `npm run lint` — geen errors
2. **Type check:** `npm run type-check` — geen errors
3. **Build check:** `npm run build` — succesvol
4. **Functionele test:** Handmatig testen of de feature werkt

### Test scenario's per feature:

**Auth:**
- [ ] Kan registreren met email/wachtwoord
- [ ] Kan inloggen
- [ ] Kan uitloggen
- [ ] Foutmelding bij verkeerd wachtwoord
- [ ] Redirect naar login als niet ingelogd

**Map:**
- [ ] Map laadt correct
- [ ] Kan zoomen in/uit
- [ ] Kan pannen
- [ ] Grid is zichtbaar
- [ ] Coördinaten updaten bij muisbeweging

**Markers:**
- [ ] Kan marker toevoegen
- [ ] Marker verschijnt op map
- [ ] Kan marker details bekijken
- [ ] Kan marker bewerken
- [ ] Kan marker verwijderen
- [ ] Filter werkt

---

## 💾 BACKUP PROTOCOL

### Automatische backups:

1. **Bij elke commit:** Database wordt gebackupt naar `backups/`
2. **Bestandsnaam:** `backup-[datum]-[tijd].db`
3. **Behoud:** Laatste 10 backups, oudere worden verwijderd

### Backup script (scripts/backup.ts):
```typescript
// Dit script wordt aangeroepen voor elke commit
// Kopieert prisma/dev.db naar backups/ met timestamp
```

### Restore commando:
```bash
npm run db:restore [backup-bestand]
```

---

## 📝 GITHUB WORKFLOW

### Branch strategie:
- `main` — productie-ready code
- `dev` — development branch
- Feature branches: `feature/[naam]`

### Commit messages:
```
[type]: korte beschrijving

Types:
- feat: nieuwe feature
- fix: bug fix
- docs: documentatie
- style: formatting
- refactor: code refactoring
- test: tests toevoegen
- chore: maintenance
```

### Voor elke commit:
1. Run tests
2. Update CONTEXT.md met voortgang
3. Update CHANGELOG.md als nodig
4. Maak backup
5. Commit met duidelijke message
6. Push naar GitHub

---

## 📄 CONTEXT.md BIJHOUDEN

Claude Code moet na elke sessie `docs/CONTEXT.md` updaten met:

1. **Wat is er gedaan** — lijst van voltooide taken
2. **Huidige status** — waar zijn we nu
3. **Volgende stappen** — wat moet er nog gebeuren
4. **Bekende issues** — bugs of problemen
5. **Beslissingen** — waarom bepaalde keuzes gemaakt zijn

Dit zorgt ervoor dat context behouden blijft tussen sessies.

---

## ⚠️ BELANGRIJKE REGELS

1. **NOOIT bestaande werkende code verwijderen** zonder expliciete toestemming
2. **ALTIJD testen** voordat je zegt dat iets klaar is
3. **ALTIJD backup maken** voordat je database wijzigingen doet
4. **ALTIJD CONTEXT.md updaten** na significante wijzigingen
5. **ALTIJD uitleggen** wat je doet en waarom
6. **NOOIT grote refactors** zonder eerst te vragen
7. **BIJ TWIJFEL:** Vraag Damian om bevestiging
8. **ALTIJD direct committen en pushen** na elke code-wijziging (voor sync met Claude Web)

### 🔴 Git Sync Protocol (VERPLICHT)

Omdat Damian wisselt tussen Claude Code CLI en Claude Web, moet GitHub ALTIJD up-to-date zijn.

**Na ELKE code-wijziging:**
1. `git add` de gewijzigde bestanden
2. `git commit` met duidelijke message
3. `git push` naar GitHub
4. Toon bevestiging: `🔴 PUSHED → [commit message]`

Dit zorgt ervoor dat Claude Web altijd de laatste code heeft.

---

## 🚀 START INSTRUCTIE

Begin met **FASE 1: Project Setup**. 

Eerste stap: Maak de GitHub repository aan en clone deze lokaal. Leg elke stap uit die je doet.

Als je klaar bent met een fase, update CONTEXT.md en vraag of je door mag naar de volgende fase.
