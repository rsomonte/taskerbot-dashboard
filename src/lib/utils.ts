import { Objective } from "./types";

export function getNextAllowedTime(obj: Objective): number {
  if (!obj.lastSubmitted) return Date.now(); // Window is open now if never submitted
  if (obj.frequency === 'daily') {
    return obj.lastSubmitted + 22 * 60 * 60 * 1000;
  }
  if (obj.frequency === 'weekly') {
    return obj.lastSubmitted + (7 * 24 - 6) * 60 * 60 * 1000;
  }
  if (obj.frequency === 'monthly') {
    return obj.lastSubmitted + (30 * 24 - 6) * 60 * 60 * 1000;
  }
  return Date.now();
}
