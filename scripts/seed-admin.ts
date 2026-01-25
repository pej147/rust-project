import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { hash } from "bcryptjs";
import path from "path";

async function main() {
  const dbPath = path.join(process.cwd(), "dev.db");
  const adapter = new PrismaBetterSqlite3({
    url: `file:${dbPath}`,
  });

  const prisma = new PrismaClient({ adapter });

  const passwordHash = await hash("admin", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: { passwordHash },
    create: {
      email: "admin@admin.com",
      passwordHash,
      displayName: "Admin",
      role: "ADMIN",
    },
  });

  console.log("Admin account aangemaakt:", admin.email);

  await prisma.$disconnect();
}

main().catch(console.error);
