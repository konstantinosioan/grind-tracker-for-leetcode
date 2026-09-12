const DEFAULT_GOAL = 3;

const goalInput = document.querySelector("#goal");
const statusMessage = document.querySelector("#status");

async function load() {
  const { goal = DEFAULT_GOAL } = await chrome.storage.local.get("goal");

  goalInput.value = goal;
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
  return true;
}

document.querySelector("#save").addEventListener("click", saveGoal);
document.querySelector("#done").addEventListener("click", async () => {
  if (await saveGoal()) {
    window.close();
  }
});
