import { todayKey } from "./streak.js";

async function paintBadge() {
  const { days = {} } = await chrome.storage.local.get("days");
  const count = days[todayKey(new Date())] || 0;

  chrome.action.setBadgeText({ text: count ? String(count) : "" });
}

chrome.runtime.onInstalled.addListener(() => {
  paintBadge();
});

chrome.runtime.onStartup.addListener(() => {
  paintBadge();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.days) {
    paintBadge();
  }
});
