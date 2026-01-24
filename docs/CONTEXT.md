# CONTEXT.md — Project Voortgang & Beslissingen

> **Dit bestand wordt door Claude Code bijgehouden.**
> Het bevat alle context die nodig is om het project voort te zetten.

---

## 📊 PROJECT STATUS

| Aspect | Status |
|--------|--------|
| **Huidige fase** | FASE 5: Interactieve Map |
| **Laatste update** | 2026-01-24 |
| **Volgende taak** | 5.1 - Integreer Leaflet.js |
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

### FASE 5: Interactieve Map
- [ ] 5.1 - Integreer Leaflet.js
- [ ] 5.2 - Custom map component met seed afbeelding
- [ ] 5.3 - Pan/zoom functionaliteit
- [ ] 5.4 - Grid overlay met coördinaten
- [ ] 5.5 - Test en commit

*(Verdere fases worden toegevoegd als ze beginnen)*

---

## 🔄 HUIDIGE SESSIE

### Wat er deze sessie is gedaan:
- FASE 1 afgerond en gecommit
- FASE 2: Complete authenticatie systeem
- FASE 3: Basis UI componenten
- FASE 4: Map Sessies geïmplementeerd
  - API endpoints voor CRUD operaties
  - Nieuwe map pagina met form
  - Map sessie lijst overzicht
  - Map detail pagina met afbeelding weergave
  - Map afbeelding voor seed 10358 gedownload

### Wat er nog moet gebeuren:
- FASE 5: Interactieve Map met Leaflet.js

### Open vragen voor Damian:
- Geen

---

## 🐛 BEKENDE ISSUES

| Issue | Prioriteit | Status | Notities |
|-------|------------|--------|----------|
| *Geen issues* | - | - | - |

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

*Laatste update: [DATUM + TIJD]*
