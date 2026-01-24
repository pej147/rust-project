# Rust Console Intel Map

Multi-user intel platform voor Rust Console spelers.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Taal:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** SQLite (via Prisma) - later PostgreSQL
- **Auth:** NextAuth.js
- **Map:** Leaflet.js

## Development

```bash
# Installeer dependencies
npm install

# Start development server
npm run dev

# Build voor productie
npm run build

# Start productie server
npm start
```

## Project Structuur

```
src/
├── app/           # Next.js App Router pagina's
├── components/    # React componenten
├── lib/           # Utilities en configuratie
├── hooks/         # Custom React hooks
└── types/         # TypeScript types
```

## Status

- [x] Project setup
- [ ] Authenticatie
- [ ] Basis UI
- [ ] Map functionaliteit
- [ ] Markers
- [ ] Teams
