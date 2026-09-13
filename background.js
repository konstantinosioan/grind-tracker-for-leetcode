import { todayKey } from "./streak.js";
import { adjustToday, recordDifficulty } from "./storage.js";

const DEFAULT_GOAL = 3;

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

chrome.runtime.onInstalled.addListener(() => {
  paintBadge();
});

chrome.runtime.onStartup.addListener(() => {
  paintBadge();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && (changes.days || changes.goal)) {
    paintBadge();
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "accepted") {
    adjustToday(1);
    recordDifficulty(message.difficulty);
  }
});
