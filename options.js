import { todayKey } from "./streak.js";
import { validateImport } from "./validate.js";

const DEFAULT_GOAL = 3;
const WEEKS = 26;
const DAYS_IN_WEEK = 7;
const MAX_IMPORT_BYTES = 1_000_000; // 1MB

const goalInput = document.querySelector("#goal");
const statusMessage = document.querySelector("#status");
const dataStatus = document.querySelector("#dataStatus");
let days = {};

async function load() {
  const stored = await chrome.storage.local.get([
    "goal",
    "days",
    "difficulties",
  ]);
  days = stored.days || {};
  const { goal = DEFAULT_GOAL, difficulties = {} } = stored;

  goalInput.value = goal;
  renderHeatmap(days, goal, new Date());
  renderDifficulty(difficulties);
}

load();

async function saveGoal() {
  const value = Number(goalInput.value);

  if (!Number.isInteger(value) || value < 1) {
    statusMessage.textContent = "Enter an integer larger than 0.";
    return false;
  }

  await chrome.storage.local.set({ goal: value });
  statusMessage.textContent = "Saved";
  renderHeatmap(days, value, new Date());
  return true;
}

document.querySelector("#save").addEventListener("click", saveGoal);
document.querySelector("#done").addEventListener("click", async () => {
  if (await saveGoal()) {
    window.close();
  }
});

function heatLevel(count, goal) {
  if (count > 2 * goal) return 4;
  if (count > goal) return 3;
  if (count === goal) return 2;
  if (count > 0) return 1;
  return 0;
}

function renderHeatmap(days, goal, today) {
  const heatmap = document.querySelector("#heatmap");
  heatmap.replaceChildren();

  const start = new Date(today);
  // sets the start date back to the 1st Sunday within the heatmap timeframe
  start.setDate(start.getDate() - start.getDay() - (WEEKS - 1) * DAYS_IN_WEEK);

  const totalCells = (WEEKS - 1) * DAYS_IN_WEEK + today.getDay() + 1;
  const date = new Date(start);

  for (let i = 0; i < totalCells; i++) {
    const key = todayKey(date);
    const count = days[key] || 0;
    const level = heatLevel(count, goal);

    const div = document.createElement("div");
    div.className = `heatmap-cell lvl-${level}`;
    div.title = `${key}: ${count}`;
    heatmap.appendChild(div);

    date.setDate(date.getDate() + 1);
  }

  const range = document.querySelector("#heatmap-range");
  const format = (d) =>
    d.toLocaleDateString(undefined, { month: "short", year: "numeric" });
  range.textContent = `${format(start)} - ${format(today)}`;
}

function renderDifficulty(difficulties) {
  const difficulty = document.querySelector("#difficulty");
  difficulty.replaceChildren();

  const easy = difficulties.easy || 0;
  const medium = difficulties.medium || 0;
  const hard = difficulties.hard || 0;
  const total = easy + medium + hard;

  if (total === 0) {
    const p = document.createElement("p");
    p.className = "empty";
    p.textContent = "No difficulty data yet.";
    difficulty.appendChild(p);
    return;
  }

  for (const [label, count] of [
    ["Easy", easy],
    ["Medium", medium],
    ["Hard", hard],
  ]) {
    const share = (count / total) * 100;

    const labelSpan = document.createElement("span");
    labelSpan.className = "diff-label";
    labelSpan.textContent = label;

    const bar = document.createElement("div");
    bar.className = "bar";
    const barFill = document.createElement("div");
    barFill.className = "bar-fill";
    barFill.style.width = `${share}%`;
    bar.appendChild(barFill);

    const countSpan = document.createElement("span");
    countSpan.className = "diff-count";
    const percent = Math.round(share);
    countSpan.textContent = `${count} · ${percent}%`;

    const row = document.createElement("div");
    row.className = "diff-row";
    row.append(labelSpan, bar, countSpan);
    difficulty.appendChild(row);
  }
}

async function exportData() {
  const data = await chrome.storage.local.get([
    "days",
    "goal",
    "difficulties",
    "startDate",
  ]);
  const out = { version: 1, ...data };
  const json = JSON.stringify(out, null, 2);

  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;

  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  a.download = `grind-tracker-${todayKey(now)}_${hh}-${mm}.json`;

  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
  dataStatus.textContent = "Exported.";
}

document.querySelector("#export").addEventListener("click", exportData);

async function handleImport(event) {
  const input = event.target;
  const file = input.files[0];

  if (!file) return;

  try {
    if (file.size > MAX_IMPORT_BYTES) {
      throw new Error("File is too large.");
    }

    let text;
    try {
      text = await file.text();
    } catch {
      throw new Error("Couldn't read the file.");
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error("Not a valid JSON file.");
    }

    const clean = validateImport(parsed);

    // if the file has no start date, use the first imported day
    if (clean.days && clean.startDate === undefined) {
      const earliest = Object.keys(clean.days).sort()[0];
      if (earliest) clean.startDate = earliest;
    }

    if (!confirm("This will replace your current data. Continue?")) return;

    await chrome.storage.local.set(clean);
    await load();
    dataStatus.textContent = "Imported.";
  } catch (e) {
    dataStatus.textContent = e.message;
  } finally {
    input.value = "";
  }
}

document.querySelector("#import").addEventListener("click", () => {
  document.querySelector("#importFile").click();
});
document.querySelector("#importFile").addEventListener("change", handleImport);
