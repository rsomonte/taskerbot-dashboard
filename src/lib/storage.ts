import { openDB, DBSchema } from 'idb';

interface TaskerBotDB extends DBSchema {
  submissions: {
    key: string;
    value: {
      id: string;
      objectiveName: string;
      timestamp: number;
      image: string; // Base64 string
    };
  };
}

const DB_NAME = 'taskerbot-db';
const STORE_NAME = 'submissions';

export async function initDB() {
  return openDB<TaskerBotDB>(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

export async function saveSubmission(submission: { id: string; objectiveName: string; timestamp: number; image: string }) {
  const db = await initDB();
  await db.put(STORE_NAME, submission);
}

export async function getSubmissions() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}
