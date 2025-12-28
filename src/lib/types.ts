export interface Objective {
  userId: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  lastSubmitted: number | null;
  streak: number;
  lastStreakDay: string | null;
  lastReminded: number | null;
}

export interface UserSettings {
  userId: string;
  visibility: 'ephemeral' | 'public';
}
