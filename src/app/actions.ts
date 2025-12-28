"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createObjective, deleteObjective, renameObjective, getObjective, updateObjective } from "@/lib/db";
import { setUserSetting } from "@/lib/settingsDb";
import { getNextAllowedTime } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function updateSetting(key: string, value: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  setUserSetting(session.user.id, key, value);
  revalidatePath("/settings");
}

export async function createNewObjective(name: string, frequency: 'daily' | 'weekly' | 'monthly') {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  if (getObjective(session.user.id, name)) {
    throw new Error("Objective already exists");
  }

  createObjective({
    userId: session.user.id,
    name,
    frequency
  });
  revalidatePath("/");
}

export async function deleteObjectives(names: string[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  for (const name of names) {
    deleteObjective(session.user.id, name);
  }
  revalidatePath("/");
}

export async function renameUserObjective(currentName: string, newName: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  if (getObjective(session.user.id, newName)) {
    throw new Error("Objective with new name already exists");
  }

  renameObjective(session.user.id, currentName, newName);
  revalidatePath("/");
}

export async function submitUserObjective(name: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const obj = getObjective(session.user.id, name);
  if (!obj) throw new Error("Objective not found");

  const now = Date.now();
  const nextAllowed = getNextAllowedTime(obj);

  if (obj.lastSubmitted && now < nextAllowed) {
    throw new Error(`You can't submit this objective yet.`);
  }

  // Mark as submitted
  obj.lastSubmitted = now;

  // Streak logic
  const today = new Date();
  const lastStreakDay = obj.lastStreakDay ? new Date(obj.lastStreakDay) : null;
  let isConsecutive = false;
  if (lastStreakDay) {
    if (obj.frequency === 'daily') {
      const diff = Math.floor((today.getTime() - lastStreakDay.getTime()) / (24 * 60 * 60 * 1000));
      isConsecutive = diff === 1;
    } else if (obj.frequency === 'weekly') {
      const diff = Math.floor((today.getTime() - lastStreakDay.getTime()) / (7 * 24 * 60 * 60 * 1000));
      isConsecutive = diff === 1;
    } else if (obj.frequency === 'monthly') {
      isConsecutive = (today.getMonth() === lastStreakDay.getMonth() + 1) &&
                      (today.getFullYear() === lastStreakDay.getFullYear());
    }
  }
 
  if (isConsecutive) {
    obj.streak = (obj.streak || 0) + 1;
  } else if (!lastStreakDay) {
    obj.streak = 1;
  } else {
    obj.streak = 1;
  }
  
  obj.lastStreakDay = today.toISOString().split('T')[0]; // Store as YYYY-MM-DD

  updateObjective(obj);
  revalidatePath("/");
}
