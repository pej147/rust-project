# CONTEXT.md — Project Voortgang & Beslissingen

> **Dit bestand wordt door Claude Code bijgehouden.**
> Het bevat alle context die nodig is om het project voort te zetten.

---

## 📊 PROJECT STATUS

| Aspect | Status |
|--------|--------|
| **Huidige fase** | FASE 6: Markers CRUD |
| **Laatste update** | 2026-01-25 |
| **Volgende taak** | 6.7 - Test en commit |
| **Blokkades** | Geen |

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

### FASE 6: Markers CRUD
- [x] 6.1 - API endpoints voor markers ✅
- [x] 6.2 - "Add Marker" form (bottom sheet) ✅
- [x] 6.3 - Markers op de map tonen ✅
- [x] 6.4 - Marker detail view ✅
- [x] 6.5 - Edit/delete marker functionaliteit ✅
- [x] 6.6 - Filter markers op type ✅
- [ ] 6.4 - Marker detail view
- [ ] 6.5 - Edit/delete marker functionaliteit
- [ ] 6.6 - Filter markers op type
- [ ] 6.7 - Test en commit

*(Verdere fases worden toegevoegd als ze beginnen)*

---

## 🔄 HUIDIGE SESSIE

### Wat er deze sessie is gedaan (2026-01-25):
- **Taak 6.1 VOLTOOID:** API endpoints voor markers aangemaakt
  - `src/app/api/markers/route.ts` - GET (lijst) en POST (create)
  - `src/app/api/markers/[id]/route.ts` - GET, PATCH, DELETE
  - Inclusief visibility filtering (PRIVATE/TEAM/PUBLIC)
  - Inclusief team membership checks
  - Type check en build succesvol

- **Taak 6.2 VOLTOOID:** "Add Marker" form met bottom sheet
  - `src/components/ui/bottom-sheet.tsx` - iOS-style slide-up panel
  - `src/components/ui/select.tsx` - Herbruikbare select component
  - `src/components/map/add-marker-form.tsx` - Formulier met:
    - Titel (verplicht)
    - Type selectie (Enemy, Team Base, Loot, etc.)
    - Kleurkiezer (met standaard per type)
    - Beschrijving (optioneel)
    - Zichtbaarheid (Team/Privé/Publiek)
  - Map detail pagina aangepast:
    - Klik op map opent formulier met coördinaten
    - FAB knop werkt nu ook
    - Tip tekst toegevoegd
  - Build + lint succesvol

- **Taak 6.3 VOLTOOID:** Markers op de map tonen
  - Verbeterde marker iconen met emoji per type
  - Type-specifieke configuratie (ENEMY=👤, TEAM_BASE=🏠, etc.)
  - Dark theme popup met:
    - Titel + icoon
    - Type label met kleur indicator
    - Beschrijving (indien aanwezig)
    - Coördinaten + maker naam
  - Custom CSS styling voor popups
  - Hover effect op markers
  - `onMarkerClick` callback toegevoegd

- **Taak 6.4 + 6.5 VOLTOOID:** Marker detail view met edit/delete
  - `src/components/map/marker-detail-sheet.tsx` - Nieuw component:
    - View mode: toont alle marker details
    - Edit mode: inline bewerken van alle velden
    - Delete functionaliteit
    - Alleen eigenaar kan bewerken/verwijderen
  - Geïntegreerd in map detail pagina
  - Klik op marker → detail sheet opent
  - Na edit/delete → map herlaadt automatisch

- **Taak 6.6 VOLTOOID:** Filter markers op type
  - `src/components/map/marker-filter.tsx` - Filter component:
    - Collapsed state: compact knop met marker telling
    - Expanded state: volledige filter panel
    - Per-type toggle met icoon en count
    - "Alles" en "Geen" quick actions
    - Toont aantal zichtbare vs totale markers
  - Geïntegreerd in map detail pagina (linksboven)
  - Markers worden real-time gefilterd

### Wat er nog moet gebeuren:
- **6.7** - Test en commit
- **6.4** - Marker detail view
- **6.5** - Edit/delete marker functionaliteit
- **6.6** - Filter markers op type
- **6.7** - Test en commit

### Open vragen voor Damian:
- Geen

---

## 🐛 BEKENDE ISSUES

| Issue | Prioriteit | Status | Notities |
|-------|------------|--------|----------|
| Statusline token display | Laag | In onderzoek | Zie hieronder |

### Statusline configuratie (2026-01-25)

**Doel:** Token-verbruik tonen in de Claude Code statusline.

**Wat geprobeerd is:**
1. Eerst bash commando → werkt niet op Windows
2. Daarna PowerShell commando → moet nog getest worden na herstart

**Huidige configuratie in `C:\Users\Damian\.claude\settings.json`:**
```json
"statusLine": {
  "type": "command",
  "command": "powershell -NoProfile -Command \"$j = [Console]::In.ReadToEnd() | ConvertFrom-Json; $m = $j.model.display_name; $i = $j.context_window.total_input_tokens; $o = $j.context_window.total_output_tokens; $c = [math]::Round($j.context_window.used_percentage, 1); Write-Host \\\"$m | Tokens: $i in / $o out | Context: $c%\\\"\""
}
```

**Volgende stappen als het niet werkt:**
1. Controleer of PowerShell correct is geïnstalleerd
2. Test het commando handmatig in terminal
3. Probeer alternatief: `pwsh` in plaats van `powershell`
4. Of gebruik `/cost` commando als workaround

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

*Laatste update: 2026-01-25 — Taak 6.1 voltooid, klaar voor 6.2*
