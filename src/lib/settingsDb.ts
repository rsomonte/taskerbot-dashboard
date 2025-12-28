import 'server-only';
import Database from 'better-sqlite3';

const dbPath = process.env.SETTINGS_DATABASE_PATH;

if (!dbPath) {
  throw new Error("SETTINGS_DATABASE_PATH environment variable is not set");
}

let db: Database.Database;

try {
  db = new Database(dbPath, { readonly: false, fileMustExist: false });
  db.pragma('journal_mode = WAL');
  
  // Initialize tables
  db.exec(`
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

  // Seed default settings if they don't exist
  const visibilityExists = db.prepare('SELECT 1 FROM setting_definitions WHERE key = ?').get('visibility');
  if (!visibilityExists) {
    db.prepare(`
      INSERT INTO setting_definitions (key, label, description, type, options, defaultValue)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      'visibility',
      'Message Visibility',
      "Choose whether the bot's responses to your commands are visible only to you (Ephemeral) or to everyone in the channel (Public).",
      'select',
      JSON.stringify([
        { label: 'Ephemeral (Private)', value: 'ephemeral', description: "Only you can see the bot's responses." },
        { label: 'Public', value: 'public', description: "Everyone in the channel can see the bot's responses." }
      ]),
      'ephemeral'
    );
  }

} catch (error) {
  console.error(`Failed to connect to settings database at ${dbPath}:`, error);
  throw error;
}

export interface SettingDefinition {
  key: string;
  label: string;
  description: string;
  type: 'select' | 'boolean' | 'text';
  options?: string; // JSON string from DB
  defaultValue: string;
}

export interface UserSetting {
  userId: string;
  key: string;
  value: string;
}

export function getSettingDefinitions(): SettingDefinition[] {
  return db.prepare('SELECT * FROM setting_definitions').all() as SettingDefinition[];
}

export function getUserSettings(userId: string): Record<string, string> {
  const rows = db.prepare('SELECT key, value FROM user_settings WHERE userId = ?').all(userId) as { key: string; value: string }[];
  const settings: Record<string, string> = {};
  rows.forEach(row => {
    settings[row.key] = row.value;
  });
  return settings;
}

export function setUserSetting(userId: string, key: string, value: string) {
  db.prepare(`
    INSERT INTO user_settings (userId, key, value)
    VALUES (?, ?, ?)
    ON CONFLICT(userId, key) DO UPDATE SET value = excluded.value
  `).run(userId, key, value);
}
