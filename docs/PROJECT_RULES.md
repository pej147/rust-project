# PROJECT RULES — Regels voor Claude Code

> **Deze regels zijn verplicht voor Claude Code.**
> Ze zorgen voor kwaliteit, veiligheid, en efficiëntie.

---

## 🤖 AGENT REGELS

Claude Code mag sub-agents aanmaken voor specifieke taken. Dit bespaart tokens en verhoogt efficiëntie.

### Wanneer agents gebruiken:
- **Testen:** Agent test de code automatisch voordat resultaat naar Damian gaat
- **Linting:** Agent runt lint checks
- **Type checking:** Agent controleert TypeScript errors
- **Documentatie:** Agent update CONTEXT.md en CHANGELOG.md

### Agent workflow:
```
1. Claude Code schrijft code
2. Test Agent controleert:
   - npm run lint (geen errors?)
   - npm run type-check (geen errors?)
   - npm run build (succesvol?)
   - Functionele test indien mogelijk
3. Als alles OK → resultaat naar Damian
4. Als errors → Claude Code fixt eerst
```

### Agent communicatie format:
```
[AGENT: Test] Running checks...
✓ Lint: passed
✓ Types: passed  
✓ Build: passed
✗ Functional: [beschrijving van probleem]

[AGENT: Test] Fixing issue...
```

---

## ✅ TEST PROTOCOL

### Automatische tests voor ELKE code wijziging:

```bash
# 1. Lint check
npm run lint

# 2. Type check
npm run type-check

# 3. Build check (alleen bij significante wijzigingen)
npm run build
```

### Wanneer NIET door naar Damian:
- ❌ Lint errors
- ❌ TypeScript errors
- ❌ Build failures
- ❌ Bekende bugs in nieuwe code

### Test resultaten format:
```
## Test Resultaten

| Check | Status | Details |
|-------|--------|---------|
| Lint | ✅ Pass | 0 errors, 0 warnings |
| Types | ✅ Pass | 0 errors |
| Build | ✅ Pass | Compiled in 3.2s |
| Functional | ✅ Pass | [wat is getest] |
```

---

## 💾 BACKUP PROTOCOL

### Automatische backup triggers:
1. **Voor database migraties** — altijd backup eerst
2. **Voor grote refactors** — backup de huidige staat
3. **Na elke werkende feature** — backup in commit

### Backup commando:
```bash
npm run db:backup
```

### Backup script (scripts/backup.ts):
```typescript
import { copyFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';

const DB_PATH = 'prisma/dev.db';
const BACKUP_DIR = 'backups';
const MAX_BACKUPS = 10;

function backup() {
  // Maak backup directory als die niet bestaat
  if (!existsSync(BACKUP_DIR)) {
    mkdirSync(BACKUP_DIR);
  }

  // Genereer backup naam met timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = `backup-${timestamp}.db`;
  const backupPath = join(BACKUP_DIR, backupName);

  // Kopieer database
  if (existsSync(DB_PATH)) {
    copyFileSync(DB_PATH, backupPath);
    console.log(`✅ Backup created: ${backupName}`);
  } else {
    console.log('⚠️ No database found to backup');
    return;
  }

  // Verwijder oude backups (behoud laatste MAX_BACKUPS)
  const backups = readdirSync(BACKUP_DIR)
    .filter(f => f.startsWith('backup-'))
    .sort()
    .reverse();

  if (backups.length > MAX_BACKUPS) {
    const toDelete = backups.slice(MAX_BACKUPS);
    toDelete.forEach(file => {
      unlinkSync(join(BACKUP_DIR, file));
      console.log(`🗑️ Deleted old backup: ${file}`);
    });
  }
}

backup();
```

### Restore commando:
```bash
# Lijst beschikbare backups
ls backups/

# Restore specifieke backup
cp backups/[backup-naam].db prisma/dev.db
```

---

## 📝 COMMIT REGELS

### Commit message format:
```
[type]: korte beschrijving (max 50 tekens)

- Detail 1
- Detail 2

Refs: #issue-nummer (indien van toepassing)
```

### Commit types:
| Type | Wanneer |
|------|---------|
| `feat` | Nieuwe feature |
| `fix` | Bug fix |
| `docs` | Documentatie update |
| `style` | Code formatting |
| `refactor` | Code refactoring |
| `test` | Tests toevoegen |
| `chore` | Maintenance taken |

### Pre-commit checklist:
- [ ] Code is getest
- [ ] Geen lint errors
- [ ] Geen type errors
- [ ] CONTEXT.md is bijgewerkt
- [ ] Backup is gemaakt (indien database wijzigingen)

### Commit workflow:
```bash
# 1. Stage changes
git add .

# 2. Maak backup indien nodig
npm run db:backup

# 3. Commit
git commit -m "[type]: beschrijving"

# 4. Push
git push origin main
```

---

## 🔒 SECURITY REGELS

### Nooit committen:
- `.env.local` — bevat secrets
- `prisma/dev.db` — lokale database
- `node_modules/` — dependencies
- `backups/` — database backups

### .gitignore moet bevatten:
```
node_modules/
.next/
.env*.local
prisma/dev.db
prisma/dev.db-journal
backups/
*.log
```

### Wachtwoord hashing:
- Gebruik ALTIJD `bcrypt` voor wachtwoorden
- Minimaal 10 salt rounds
- Nooit plain-text wachtwoorden opslaan

### API security:
- Valideer ALLE input met Zod
- Check authenticatie op elke protected route
- Check autorisatie (is user lid van team?)

---

## 📄 DOCUMENTATIE REGELS

### Na elke significante wijziging update:

1. **CONTEXT.md** — voortgang en beslissingen
2. **CHANGELOG.md** — wat er veranderd is
3. **README.md** — alleen als setup verandert

### CHANGELOG.md format:
```markdown
## [Versie] - DATUM

### Added
- Nieuwe features

### Changed
- Gewijzigde features

### Fixed
- Bug fixes

### Removed
- Verwijderde features
```

---

## ⚠️ ERROR HANDLING

### Bij errors tijdens development:

1. **Lees de error message volledig**
2. **Identificeer de bron** (file, line number)
3. **Fix de error** voordat je verdergaat
4. **Test opnieuw** na de fix

### Error format naar Damian:
```
❌ Error gevonden:

Type: [Lint/Type/Build/Runtime]
Bestand: [pad naar bestand]
Regel: [regel nummer]
Message: [error message]

Fix: [wat ik ga doen om het op te lossen]
```

### Wanneer Damian vragen:
- Error is onduidelijk
- Meerdere mogelijke oplossingen
- Grote impact op bestaande code
- Security gerelateerd

---

## 🔄 CODE REVIEW CHECKLIST

Voordat code als "klaar" wordt beschouwd:

### Functionaliteit
- [ ] Feature werkt zoals verwacht
- [ ] Edge cases zijn afgehandeld
- [ ] Error states zijn afgehandeld

### Code kwaliteit
- [ ] Geen TypeScript errors
- [ ] Geen lint warnings
- [ ] Consistente code style
- [ ] Duidelijke variabele namen

### Security
- [ ] Input is gevalideerd
- [ ] Auth checks zijn aanwezig
- [ ] Geen hardcoded secrets

### Performance
- [ ] Geen onnodige re-renders
- [ ] Database queries zijn efficiënt
- [ ] Grote lijsten zijn gepagineerd

### Documentatie
- [ ] Complex code heeft comments
- [ ] CONTEXT.md is bijgewerkt
- [ ] Types zijn gedocumenteerd

---

## 🎯 PRIORITEITEN

Bij conflicten, volg deze prioriteit:

1. **Security** — nooit compromitteren
2. **Data integriteit** — backups, validatie
3. **Functionaliteit** — werkt het correct?
4. **Code kwaliteit** — clean, leesbaar
5. **Performance** — snel genoeg?
6. **UI/UX** — ziet het er goed uit?

---

## 📞 COMMUNICATIE MET DAMIAN

### Format voor updates:
```
## Status Update

**Voltooid:**
- [wat is klaar]

**Test Resultaten:**
- Lint: ✅
- Types: ✅
- Build: ✅

**Volgende stappen:**
- [wat nu moet gebeuren]

**Vragen:**
- [indien van toepassing]
```

### Wanneer ALTIJD vragen:
- Verwijderen van bestaande code
- Grote refactors
- Database schema wijzigingen
- Security beslissingen
- Keuze tussen meerdere opties

### Wanneer NIET vragen:
- Bug fixes
- Code formatting
- Kleine verbeteringen
- Documentatie updates

---

*Deze regels zijn bindend voor alle Claude Code sessies op dit project.*
