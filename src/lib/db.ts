import 'server-only';
import Database from 'better-sqlite3';
import { Objective, UserSettings } from './types';

// Use the path from environment variables
const dbPath = process.env.DATABASE_PATH;

if (!dbPath) {
  throw new Error("DATABASE_PATH environment variable is not set");
}

let db: Database.Database;

try {
  db = new Database(dbPath, { readonly: false, fileMustExist: false });
  // Enable WAL mode for better concurrency
  db.pragma('journal_mode = WAL');
} catch (error) {
  console.error(`Failed to connect to database at ${dbPath}:`, error);
  throw error;
}

export function getObjectives(userId: string): Objective[] {
  return db.prepare('SELECT * FROM objectives WHERE userId = ?').all(userId) as Objective[];
}

export function getUserSettings(userId: string): UserSettings | undefined {
  return db.prepare('SELECT * FROM user_settings WHERE userId = ?').get(userId) as UserSettings | undefined;
}

export function setUserVisibility(userId: string, visibility: 'ephemeral' | 'public') {
  db.prepare(`
    INSERT INTO user_settings (userId, visibility) 
    VALUES (?, ?) 
    ON CONFLICT(userId) DO UPDATE SET visibility=excluded.visibility
  `).run(userId, visibility);
}

export function createObjective(obj: Omit<Objective, 'lastSubmitted' | 'streak' | 'lastStreakDay' | 'lastReminded'>) {
  db.prepare(`
    INSERT INTO objectives (userId, name, frequency, lastSubmitted, streak, lastStreakDay, lastReminded)
    VALUES (@userId, @name, @frequency, NULL, 0, NULL, NULL)
  `).run(obj);
}

export function deleteObjective(userId: string, name: string) {
  db.prepare('DELETE FROM objectives WHERE userId = ? AND name = ?').run(userId, name);
}

export function renameObjective(userId: string, currentName: string, newName: string) {
  db.prepare('UPDATE objectives SET name = ? WHERE userId = ? AND name = ?').run(newName, userId, currentName);
}

export function getObjective(userId: string, name: string): Objective | undefined {
  return db.prepare('SELECT * FROM objectives WHERE userId = ? AND name = ?').get(userId, name) as Objective | undefined;
}

export function updateObjective(obj: Objective) {
  db.prepare(`
    INSERT INTO objectives (userId, name, frequency, lastSubmitted, streak, lastStreakDay, lastReminded)
    VALUES (@userId, @name, @frequency, @lastSubmitted, @streak, @lastStreakDay, @lastReminded)
    ON CONFLICT(userId, name) DO UPDATE SET
      frequency=excluded.frequency,
      lastSubmitted=excluded.lastSubmitted,
      streak=excluded.streak,
      lastStreakDay=excluded.lastStreakDay,
      lastReminded=excluded.lastReminded
  `).run(obj);
}
