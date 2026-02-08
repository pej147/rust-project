/**
 * Database Backup Script
 * Creates a timestamped backup of the SQLite database
 *
 * Usage: npx ts-node scripts/backup.ts
 * Or: npm run db:backup
 */

import * as fs from "fs";
import * as path from "path";

const DB_PATH = path.join(__dirname, "..", "prisma", "dev.db");
const BACKUP_DIR = path.join(__dirname, "..", "backups");
const MAX_BACKUPS = 10;

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

function getBackupFiles(): string[] {
  if (!fs.existsSync(BACKUP_DIR)) {
    return [];
  }
  return fs
    .readdirSync(BACKUP_DIR)
    .filter((file) => file.startsWith("backup-") && file.endsWith(".db"))
    .sort();
}

function cleanupOldBackups(): void {
  const backups = getBackupFiles();
  const toDelete = backups.slice(0, Math.max(0, backups.length - MAX_BACKUPS + 1));

  for (const file of toDelete) {
    const filePath = path.join(BACKUP_DIR, file);
    fs.unlinkSync(filePath);
    console.log(`Deleted old backup: ${file}`);
  }
}

function createBackup(): void {
  // Check if database exists
  if (!fs.existsSync(DB_PATH)) {
    console.error("Error: Database file not found at", DB_PATH);
    console.log("Run 'npm run db:push' first to create the database.");
    process.exit(1);
  }

  // Create backup directory if it doesn't exist
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log("Created backup directory:", BACKUP_DIR);
  }

  // Create backup filename with timestamp
  const timestamp = formatDate(new Date());
  const backupFilename = `backup-${timestamp}.db`;
  const backupPath = path.join(BACKUP_DIR, backupFilename);

  // Copy database file
  fs.copyFileSync(DB_PATH, backupPath);

  // Get file size
  const stats = fs.statSync(backupPath);
  const sizeKB = (stats.size / 1024).toFixed(2);

  console.log(`\n✅ Backup created successfully!`);
  console.log(`   File: ${backupFilename}`);
  console.log(`   Size: ${sizeKB} KB`);
  console.log(`   Path: ${backupPath}`);

  // Cleanup old backups
  cleanupOldBackups();

  // Show remaining backups
  const remaining = getBackupFiles();
  console.log(`\n📦 Total backups: ${remaining.length}/${MAX_BACKUPS}`);
}

function restoreBackup(filename: string): void {
  const backupPath = path.join(BACKUP_DIR, filename);

  if (!fs.existsSync(backupPath)) {
    console.error("Error: Backup file not found:", backupPath);
    console.log("\nAvailable backups:");
    const backups = getBackupFiles();
    if (backups.length === 0) {
      console.log("  (no backups found)");
    } else {
      backups.forEach((b) => console.log(`  - ${b}`));
    }
    process.exit(1);
  }

  // Create a backup of current database before restoring
  if (fs.existsSync(DB_PATH)) {
    const preRestoreBackup = path.join(BACKUP_DIR, `pre-restore-${formatDate(new Date())}.db`);
    fs.copyFileSync(DB_PATH, preRestoreBackup);
    console.log(`Created pre-restore backup: ${path.basename(preRestoreBackup)}`);
  }

  // Restore the backup
  fs.copyFileSync(backupPath, DB_PATH);
  console.log(`\n✅ Database restored from: ${filename}`);
}

function listBackups(): void {
  const backups = getBackupFiles();
  console.log("\n📦 Available backups:");
  if (backups.length === 0) {
    console.log("  (no backups found)");
  } else {
    backups.forEach((file) => {
      const filePath = path.join(BACKUP_DIR, file);
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`  - ${file} (${sizeKB} KB)`);
    });
  }
}

// CLI handling
const args = process.argv.slice(2);
const command = args[0] || "create";

switch (command) {
  case "create":
    createBackup();
    break;
  case "restore":
    if (!args[1]) {
      console.error("Usage: npx ts-node scripts/backup.ts restore <filename>");
      listBackups();
      process.exit(1);
    }
    restoreBackup(args[1]);
    break;
  case "list":
    listBackups();
    break;
  default:
    console.log(`
Database Backup Script

Usage:
  npx ts-node scripts/backup.ts [command]

Commands:
  create              Create a new backup (default)
  restore <filename>  Restore from a backup
  list                List available backups

Examples:
  npx ts-node scripts/backup.ts
  npx ts-node scripts/backup.ts create
  npx ts-node scripts/backup.ts restore backup-2024-01-15_10-30-00.db
  npx ts-node scripts/backup.ts list
`);
}
