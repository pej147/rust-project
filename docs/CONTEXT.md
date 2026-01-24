# CONTEXT.md — Project Voortgang & Beslissingen

> **Dit bestand wordt door Claude Code bijgehouden.**
> Het bevat alle context die nodig is om het project voort te zetten.

---

## 📊 PROJECT STATUS

| Aspect | Status |
|--------|--------|
| **Huidige fase** | FASE 1: Project Setup |
| **Laatste update** | [DATUM] |
| **Volgende taak** | 1.1 - Maak GitHub repository |
| **Blokkades** | Geen |

---

## ✅ VOLTOOIDE TAKEN

### FASE 1: Project Setup
- [ ] 1.1 - GitHub repository aangemaakt
- [ ] 1.2 - Repository gecloned
- [ ] 1.3 - Next.js project geïnitialiseerd
- [ ] 1.4 - Dependencies geïnstalleerd
- [ ] 1.5 - Prisma + SQLite setup
- [ ] 1.6 - Mappenstructuur aangemaakt
- [ ] 1.7 - ESLint + Prettier geconfigureerd
- [ ] 1.8 - Eerste commit gemaakt

### FASE 2: Authenticatie
- [ ] 2.1 - NextAuth.js setup
- [ ] 2.2 - Register pagina
- [ ] 2.3 - Login pagina
- [ ] 2.4 - Auth middleware
- [ ] 2.5 - Profiel pagina
- [ ] 2.6 - Auth flow getest
- [ ] 2.7 - Commit gemaakt

*(Verdere fases worden toegevoegd als ze beginnen)*

---

## 🔄 HUIDIGE SESSIE

### Wat er deze sessie is gedaan:
- [Lijst van acties]

### Wat er nog moet gebeuren deze sessie:
- [Lijst van taken]

### Open vragen voor Damian:
- [Vragen die beantwoord moeten worden]

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
| *Nog geen* | - | - | - |

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
