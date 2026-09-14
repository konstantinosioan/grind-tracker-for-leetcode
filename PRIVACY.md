# Privacy Policy

**Grind Tracker for LeetCode**

This extension does not collect, transmit, or share any personal data. There is
no account, no server, and no network request anywhere in the extension.

## What it stores

Everything is kept locally in your browser through `chrome.storage.local`:

- your daily solved counts, by date
- your daily goal
- a running tally of easy, medium and hard solves

This data never leaves your machine. It is not sent to me, to LeetCode, or to
any third party. Uninstalling the extension removes it.

## What it reads

On `leetcode.com`, the extension watches for the result of a submission you
make. When a submission is Accepted, it reads two things off the page you are
already viewing: the word "Accepted" and the problem's difficulty. It records a
count and a difficulty tally, nothing else. It never reads your username, your
solution code, or your submission history, and it never contacts LeetCode's
servers or API.

## Permissions

- **storage**: save your counts, goal and streak locally.
- **alarms**: reset the toolbar badge at local midnight.
- **leetcode.com access**: detect an Accepted submission on the page you are
  solving.

_Not affiliated with or endorsed by LeetCode._
