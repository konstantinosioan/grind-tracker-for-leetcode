import { todayKey } from "./streak.js";

/**
 * Adds change to today's solved count, never dropping below zero
 *
 * @param {number} change - how much to add
 * @returns {Promise<void>}
 */
export async function adjustToday(change) {
  const { days = {} } = await chrome.storage.local.get("days");

  const key = todayKey(new Date());
  days[key] = Math.max((days[key] || 0) + change, 0);

  await chrome.storage.local.set({ days });
}

/**
 * Bumps the tally for a solved problem's difficulty. Ignores an
 * invalid difficulty
 *
 * @param {string} level - the difficulty: "easy", "medium" or "hard"
 * @returns {Promise<void>}
 */
export async function recordDifficulty(level) {
  if (!["easy", "medium", "hard"].includes(level)) return;

  const { difficulties = {} } = await chrome.storage.local.get("difficulties");
  difficulties[level] = (difficulties[level] || 0) + 1;
  await chrome.storage.local.set({ difficulties });
}
