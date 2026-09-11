import { todayKey, currentStreak } from "./streak.js";

async function incrementToday() {
  const { days = {} } = await chrome.storage.local.get("days");

  const key = todayKey(new Date());
  days[key] = (days[key] || 0) + 1;

  await chrome.storage.local.set({ days });
}

async function render() {
  const { days = {} } = await chrome.storage.local.get("days");
  const count = days[todayKey(new Date())] || 0;
  const { goal = 3 } = await chrome.storage.local.get("goal");
  const progress =
    count >= goal ? `Goal reached - ${count} solved` : `${count} / ${goal}`;

  document.querySelector("#progress").textContent = progress;

  document.querySelector("#streak").textContent =
    `Streak: ${currentStreak(days, goal, new Date())}`;
}

render();

document.querySelector("#add").addEventListener("click", async () => {
  await incrementToday();
  await render();
});
