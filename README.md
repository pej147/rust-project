# Rust Console Intel Map

A multi-user intel platform for Rust Console players. Track enemies, bases, monuments, and share intel with your team on an interactive map.

## Features

- **Interactive Map** - Pan, zoom, and place markers on Rust Console maps
- **Multiple Marker Types** - Enemy bases, team bases, loot, monuments, danger zones, notes, raids
- **Team Collaboration** - Create teams, share intel, sync markers in real-time
- **Guest Mode** - Use the map without an account (markers saved locally)
- **Command Bar** - Quick commands like `M18` to place markers, `/goto A0` to navigate
- **Admin Dashboard** - Manage users, maps, and view audit logs
- **Rust Wiki** - Built-in wiki with monuments, weapons, ammo, raiding costs

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | SQLite (Prisma) |
| Auth | NextAuth.js |
| Map | Leaflet.js |
| UI | Radix UI |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pej147/rust-project.git
   cd rust-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and set:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize the database**
   ```bash
   npm run db:push
   ```

5. **Create an admin user** (optional)
   ```bash
   npx ts-node scripts/seed-admin.ts
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

## Adding Map Images

Map images should be placed in `public/maps/` with the seed as filename:

```
public/maps/12345.png
public/maps/67890.png
```

The map image should be square (e.g., 2048x2048 or 4096x4096 pixels).

## NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type checking |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:backup` | Create database backup |
| `npm run db:restore` | Restore from backup |
| `npm run db:backups` | List available backups |

## Command Bar

Press `/` on the map to open the command bar. Available commands:

| Command | Example | Description |
|---------|---------|-------------|
| Grid reference | `M18` | Add enemy marker at grid M18 |
| With offset | `M18+3` | Add marker 3 cells down |
| Named enemy | `/enemy Nakeds M18` | Add named enemy at grid |
| Any marker | `/marker loot K12` | Add loot marker at K12 |
| Navigate | `/goto A0` | Pan map to grid A0 |

## Project Structure

```
rust-project/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── dev.db           # SQLite database
├── public/
│   ├── maps/            # Map images (seed.png)
│   └── icons/           # UI icons
├── scripts/
│   ├── backup.ts        # Database backup script
│   └── seed-admin.ts    # Create admin user
├── src/
│   ├── app/             # Next.js pages
│   │   ├── (auth)/      # Login, register
│   │   ├── (dashboard)/ # Map, teams, profile, admin
│   │   ├── api/         # API routes
│   │   └── wiki/        # Wiki pages
│   ├── components/      # React components
│   │   ├── command-bar/ # Command bar
│   │   ├── map/         # Map components
│   │   ├── ui/          # UI components
│   │   └── layout/      # Layout components
│   ├── data/            # Static data (wiki)
│   ├── hooks/           # Custom hooks
│   └── lib/             # Utilities
└── docs/
    └── CONTEXT.md       # Development context
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Maps
- `GET /api/maps` - List user's maps
- `POST /api/maps` - Create new map
- `GET /api/maps/[id]` - Get map with markers
- `DELETE /api/maps/[id]` - Delete map

### Markers
- `GET /api/markers` - List markers
- `POST /api/markers` - Create marker
- `PATCH /api/markers/[id]` - Update marker
- `DELETE /api/markers/[id]` - Delete marker

### Teams
- `GET /api/teams` - List user's teams
- `POST /api/teams` - Create team
- `POST /api/teams/join` - Join team by code
- `POST /api/teams/guest` - Create guest team

### Admin
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/users` - List users
- `GET /api/admin/audit` - Audit logs

## Database Backups

```bash
# Create backup
npm run db:backup

# List backups
npm run db:backups

# Restore from backup
npm run db:restore backup-2024-01-15_10-30-00.db
```

Backups are stored in `backups/` directory. Maximum 10 backups are kept.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is for personal use.

---

Built with Next.js, TypeScript, and Tailwind CSS.
