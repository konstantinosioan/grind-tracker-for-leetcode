function todayKey(date) {
  const year = date.getFullYear();
  // + 1 since getMonth() returns a zero-based value
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return year + "-" + month + "-" + day;
}

async function incrementToday() {
  const { days = {} } = await chrome.storage.local.get("days");

  const key = todayKey(new Date());
  days[key] = (days[key] || 0) + 1;

  await chrome.storage.local.set({ days });
}

async function render() {
  const { days = {} } = await chrome.storage.local.get("days");

  document.querySelector("#count").textContent =
    days[todayKey(new Date())] || 0;
}

render();

document.querySelector("#add").addEventListener("click", async () => {
  await incrementToday();
  await render();
});
