import 'server-only';
import { createClient } from '@libsql/client';
import { Objective } from './types';

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  throw new Error("TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set");
}

const client = createClient({
  url,
  authToken,
});

export interface SettingDefinition {
  key: string;
  label: string;
  description: string;
  type: 'select' | 'boolean' | 'text';
  options?: string; // JSON string from DB
  defaultValue: string;
}

let initialized = false;

async function ensureInitialized() {
  if (initialized) return;

  try {
    await client.executeMultiple(`
      CREATE TABLE IF NOT EXISTS objectives (
        userId TEXT NOT NULL,
        name TEXT NOT NULL,
        frequency TEXT NOT NULL,
        lastSubmitted INTEGER,
        streak INTEGER,
        lastStreakDay TEXT,
        lastReminded INTEGER,
        PRIMARY KEY (userId, name)
      );

      CREATE TABLE IF NOT EXISTS setting_definitions (
        key TEXT PRIMARY KEY,
        label TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL, -- 'select', 'boolean', 'text'
        options TEXT, -- JSON string for select options
        defaultValue TEXT
      );

      CREATE TABLE IF NOT EXISTS user_settings (
        userId TEXT NOT NULL,
        key TEXT NOT NULL,
        value TEXT,
        PRIMARY KEY (userId, key),
        FOREIGN KEY (key) REFERENCES setting_definitions(key)
      );
    `);

    // Seed default settings
    const result = await client.execute({
      sql: 'SELECT 1 FROM setting_definitions WHERE key = ?',
      args: ['visibility']
    });

    if (result.rows.length === 0) {
      await client.execute({
        sql: `
          INSERT INTO setting_definitions (key, label, description, type, options, defaultValue)
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        args: [
          'visibility',
          'Message Visibility',
          "Choose whether the bot's responses to your commands are visible only to you (Ephemeral) or to everyone in the channel (Public).",
          'select',
          JSON.stringify([
            { label: 'Ephemeral (Private)', value: 'ephemeral', description: "Only you can see the bot's responses." },
            { label: 'Public', value: 'public', description: "Everyone in the channel can see the bot's responses." }
          ]),
          'ephemeral'
        ]
      });
    }

    initialized = true;
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
}

// --- Objectives ---

export async function getObjectives(userId: string): Promise<Objective[]> {
  await ensureInitialized();
  const result = await client.execute({
    sql: 'SELECT * FROM objectives WHERE userId = ?',
    args: [userId]
  });
  return result.rows as unknown as Objective[];
}

export async function createObjective(obj: Omit<Objective, 'lastSubmitted' | 'streak' | 'lastStreakDay' | 'lastReminded'>) {
  await ensureInitialized();
  await client.execute({
    sql: `
      INSERT INTO objectives (userId, name, frequency, lastSubmitted, streak, lastStreakDay, lastReminded)
      VALUES (:userId, :name, :frequency, NULL, 0, NULL, NULL)
    `,
    args: obj as any
  });
}

export async function deleteObjective(userId: string, name: string) {
  await ensureInitialized();
  await client.execute({
    sql: 'DELETE FROM objectives WHERE userId = ? AND name = ?',
    args: [userId, name]
  });
}

export async function renameObjective(userId: string, currentName: string, newName: string) {
  await ensureInitialized();
  await client.execute({
    sql: 'UPDATE objectives SET name = ? WHERE userId = ? AND name = ?',
    args: [newName, userId, currentName]
  });
}

export async function getObjective(userId: string, name: string): Promise<Objective | undefined> {
  await ensureInitialized();
  const result = await client.execute({
    sql: 'SELECT * FROM objectives WHERE userId = ? AND name = ?',
    args: [userId, name]
  });
  return result.rows[0] as unknown as Objective | undefined;
}

export async function updateObjective(obj: Objective) {
  await ensureInitialized();
  await client.execute({
    sql: `
      INSERT INTO objectives (userId, name, frequency, lastSubmitted, streak, lastStreakDay, lastReminded)
      VALUES (:userId, :name, :frequency, :lastSubmitted, :streak, :lastStreakDay, :lastReminded)
      ON CONFLICT(userId, name) DO UPDATE SET
        frequency=excluded.frequency,
        lastSubmitted=excluded.lastSubmitted,
        streak=excluded.streak,
        lastStreakDay=excluded.lastStreakDay,
        lastReminded=excluded.lastReminded
    `,
    args: obj as any
  });
}

// --- Settings ---

export async function getSettingDefinitions(): Promise<SettingDefinition[]> {
  await ensureInitialized();
  const result = await client.execute('SELECT * FROM setting_definitions');
  return result.rows as unknown as SettingDefinition[];
}

export async function getUserSettings(userId: string): Promise<Record<string, string>> {
  await ensureInitialized();
  const result = await client.execute({
    sql: 'SELECT key, value FROM user_settings WHERE userId = ?',
    args: [userId]
  });
  const settings: Record<string, string> = {};
  result.rows.forEach((row: any) => {
    settings[row.key] = row.value;
  });
  return settings;
}

export async function setUserSetting(userId: string, key: string, value: string) {
  await ensureInitialized();
  await client.execute({
    sql: `
      INSERT INTO user_settings (userId, key, value)
      VALUES (?, ?, ?)
      ON CONFLICT(userId, key) DO UPDATE SET value = excluded.value
    `,
    args: [userId, key, value]
  });
}
