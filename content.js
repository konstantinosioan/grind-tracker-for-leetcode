// Auto-log a successful submission only when a 'verdict' appears after the
// user submits and not when browsing old accepted submissions
let awaitingVerdict = false;
let verdictTimer = null;
let pendingDifficulty = "unknown";

function expectVerdict() {
  clearTimeout(verdictTimer);
  awaitingVerdict = true;

  const el = document.querySelector('[class*="text-difficulty-"]');
  const match = el
    ?.getAttribute("class")
    ?.match(/text-difficulty-(easy|medium|hard)/);
  pendingDifficulty = match ? match[1] : "unknown";

  // If no verdict came, stop waiting so that if user browses submission
  // history after, it won't be miscounted
  verdictTimer = setTimeout(() => {
    awaitingVerdict = false;
  }, 20000);
}

// Listen on document and not the button: the app re-renders it dynamically, so
// a direct listener wouldn't work
document.addEventListener(
  "click",
  (event) => {
    if (event.target.closest('[data-e2e-locator="console-submit-button"]'))
      expectVerdict();
  },
  true,
);

// Listens for Leetcode's submit shortcut
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter")
    expectVerdict();
});

const mutationObserver = new MutationObserver(() => {
  if (!awaitingVerdict) return;

  const el = document.querySelector('[data-e2e-locator="submission-result"]');

  if (!el) return;

  // The observer fires repeatedly per result, so this keeps a single submit
  // to a single count by stopping at the first verdict
  awaitingVerdict = false;
  clearTimeout(verdictTimer);

  if (el.textContent.trim() === "Accepted") {
    try {
      chrome.runtime.sendMessage({
        type: "accepted",
        difficulty: pendingDifficulty,
      });
    } catch {
      // nothing to do here: occurs when the extension is reloaded in production
      // but the leetcode tab isn't reloaded so this script's context is dead
    }
  }
});

mutationObserver.observe(document.body, {
  childList: true,
  subtree: true,
});
