// Auto-log a successful submission only when a 'verdict' appears after the
// user submits and not when browsing old accepted submissions
let awaitingVerdict = false;
let verdictTimer = null;
let pendingDifficulty = "unknown";

/**
 * Called when the user submits. Starts watching for a verdict, reads the
 * problem's difficulty off the page and stops watching after 20 seconds
 * so that a later visit to old submissions isn't counted
 */
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

// Listens for LeetCode's submit shortcut
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter")
    expectVerdict();
});

// Watches the page for the submission result. Once it shows up while waiting,
// stop watching and count it if it's Accepted.
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
      // but the LeetCode tab isn't reloaded so this script's context is dead
    }
  }
});

mutationObserver.observe(document.body, {
  childList: true,
  subtree: true,
});
