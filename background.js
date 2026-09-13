import { todayKey } from "./streak.js";
import { adjustToday, recordDifficulty } from "./storage.js";

const DEFAULT_GOAL = 3;

/**
 * Draws today's solved count as a badge on the toolbar icon. It turns green
 * once the goal's reached, stays grey until then, and clears when count is zero
 *
 * @returns {Promise<void>}
 */
async function paintBadge() {
  const { days = {}, goal = DEFAULT_GOAL } = await chrome.storage.local.get([
    "days",
    "goal",
  ]);
  const count = days[todayKey(new Date())] || 0;

  chrome.action.setBadgeText({ text: count ? String(count) : "" });
  chrome.action.setBadgeBackgroundColor({
    color: count >= goal ? "#15803D" : "#777C82",
  });
}

// On install and each browser start, redraw the badge and set the midnight alarm
chrome.runtime.onInstalled.addListener(() => {
  paintBadge();
  scheduleRollover();
});

chrome.runtime.onStartup.addListener(() => {
  paintBadge();
  scheduleRollover();
});

// Only repaint when the solved count or the goal changes
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && (changes.days || changes.goal)) {
    paintBadge();
  }
});

// If an accepted submission is recorded, count it and record difficulty
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "accepted") {
    adjustToday(1);
    recordDifficulty(message.difficulty);
  }
});

/**
 * Sets a one-time alarm for the next midnight so the badge gets redrawn when
 * the day rolls over. Does nothing if that alarm is already set
 *
 * @returns {Promise<void>}
 */
async function scheduleRollover() {
  if (await chrome.alarms.get("dayRollover")) return;

  const now = new Date();
  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  );

  chrome.alarms.create("dayRollover", {
    when: midnight.getTime(),
    persistAcrossSessions: false,
  });
}

// At midnight, redraw the badge for the new day and line up tomorrow's alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "dayRollover") {
    paintBadge();
    scheduleRollover();
  }
});
