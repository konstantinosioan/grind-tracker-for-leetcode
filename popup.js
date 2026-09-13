import {
  todayKey,
  currentStreak,
  recentDays,
  longestStreak,
} from "./streak.js";
import { adjustToday } from "./storage.js";

const DEFAULT_GOAL = 3;
const RECENT_DAYS = 7;

/**
 * Turns a "YYYY-MM-DD" key into a short readable date like "Fri, Sep 12"
 *
 * @param {string} key - a day key in "YYYY-MM-DD" format
 * @returns {string} the date formatted for display
 */
function formatDate(key) {
  const [year, month, day] = key.split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/**
 * Fills the recent-history list with one row per day (date and count), or
 * a short message when there's nothing to show yet
 *
 * @param {Array<{ date: string, count: number }>} history - the recent days to
 * show, newest first
 */
function renderHistory(history) {
  const ul = document.querySelector("#history");
  ul.replaceChildren(); // clear to build fresh

  if (history.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "No problems logged yet.";
    ul.appendChild(li);
    return;
  }

  for (const { date, count } of history) {
    const dateSpan = document.createElement("span");
    dateSpan.textContent = formatDate(date);
    const countSpan = document.createElement("span");
    countSpan.textContent = `${count}`;
    const li = document.createElement("li");
    li.append(dateSpan, countSpan);
    ul.appendChild(li);
  }
}

/**
 * Draws the whole popup from storage: today's progress and bar, the streak
 * and best streak, the recent-history list, and the all-time total and best day.
 * Runs on open and after each +1 / -1
 *
 * @returns {Promise<void>}
 */
async function render() {
  const now = new Date();
  const stored = await chrome.storage.local.get(["days", "goal", "startDate"]);
  const { days = {}, goal = DEFAULT_GOAL } = stored;
  let { startDate } = stored;
  const count = days[todayKey(now)] || 0;
  const progress =
    count >= goal ? `Goal reached · ${count} solved` : `${count} / ${goal}`;

  const progressEl = document.querySelector("#progress");
  progressEl.textContent = progress;
  progressEl.classList.toggle("met", count >= goal);

  const percent = Math.min(count / goal, 1) * 100;
  document.querySelector("#barFill").style.width = `${percent}%`;

  const streak = currentStreak(days, goal, now);
  const bestStreak = longestStreak(days, goal);

  document.querySelector("#streak").textContent =
    `Streak: ${streak} · Best: ${bestStreak}`;

  // on first open, pin the start to today so history skips days before they began
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
  await adjustToday(1);
  await render();
});

document.querySelector("#subtract").addEventListener("click", async () => {
  await adjustToday(-1);
  await render();
});

document.querySelector("#settings").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});
