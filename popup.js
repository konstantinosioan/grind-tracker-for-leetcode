import { todayKey, currentStreak, recentDays } from "./streak.js";

const DEFAULT_GOAL = 3;
const RECENT_DAYS = 7;

async function incrementToday() {
  const { days = {} } = await chrome.storage.local.get("days");

  const key = todayKey(new Date());
  days[key] = (days[key] || 0) + 1;

  await chrome.storage.local.set({ days });
}

function renderHistory(history) {
  const ul = document.querySelector("#history");
  ul.replaceChildren(); // clear to build fresh

  for (const { date, count } of history) {
    const li = document.createElement("li");
    li.textContent = `${date}: ${count}`;
    ul.appendChild(li);
  }
}

async function render() {
  const now = new Date();
  const stored = await chrome.storage.local.get([
    "days",
    "goal",
    "bestStreak",
    "startDate",
  ]);
  const { days = {}, goal = DEFAULT_GOAL } = stored;
  let { bestStreak = 0, startDate } = stored;
  const count = days[todayKey(now)] || 0;
  const progress =
    count >= goal ? `Goal reached - ${count} solved` : `${count} / ${goal}`;

  document.querySelector("#progress").textContent = progress;

  const streak = currentStreak(days, goal, now);

  if (streak > bestStreak) {
    bestStreak = streak;
    await chrome.storage.local.set({ bestStreak });
  }

  document.querySelector("#streak").textContent =
    `Streak: ${streak} · Best: ${bestStreak}`;

  if (!startDate) {
    startDate = todayKey(now);
    await chrome.storage.local.set({ startDate });
  }

  const history = recentDays(days, now, RECENT_DAYS).filter(
    (d) => d.date >= startDate,
  );

  renderHistory(history);

  const counts = Object.values(days);
  const total = counts.reduce((sum, n) => sum + n, 0);
  const bestDay = counts.length ? Math.max(...counts) : 0;

  document.querySelector("#total").textContent = `Total solved: ${total}`;
  document.querySelector("#bestDay").textContent = `Best day: ${bestDay}`;
}

render();

document.querySelector("#add").addEventListener("click", async () => {
  await incrementToday();
  await render();
});
