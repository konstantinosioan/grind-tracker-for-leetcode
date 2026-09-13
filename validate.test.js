import { test } from "node:test";
import assert from "node:assert/strict";
import { validateImport } from "./validate.js";

test("keeps the valid fields and drops anything not recognized", () => {
  const file = {
    version: 1,
    days: { "2026-09-13": 4 },
    goal: 7,
    difficulties: { easy: 4, medium: 11, hard: 3 },
    startDate: "2026-09-06",
    junk: "invalid",
  };

  const result = validateImport(file);

  assert.deepEqual(result, {
    days: { "2026-09-13": 4 },
    goal: 7,
    difficulties: { easy: 4, medium: 11, hard: 3 },
    startDate: "2026-09-06",
  });
});

test("rejects a file that isn't an object", () => {
  assert.throws(() => validateImport([]), /Unrecognized file format\./);
});

test("rejects an unsupported version", () => {
  const file = {
    version: 2,
    days: { "2026-09-13": 4 },
  };

  assert.throws(() => validateImport(file), /Unsupported file version\./);
});

test("rejects days with a broken date or negative count", () => {
  const file1 = { version: 1, days: { "2026-9-1": 3 } };
  const file2 = { version: 1, days: { "2026-09-13": -1 } };

  assert.throws(() => validateImport(file1), /Invalid day data\./);
  assert.throws(() => validateImport(file2), /Invalid day data\./);
});

test("rejects a goal of zero or less", () => {
  const file = {
    version: 1,
    goal: 0,
  };

  assert.throws(() => validateImport(file), /Invalid goal\./);
});

test("rejects an invalid difficulty", () => {
  const file = {
    version: 1,
    difficulties: { insane: 3 },
  };

  assert.throws(() => validateImport(file), /Invalid difficulty data\./);
});

test("rejects a file with nothing to import", () => {
  const file = { version: 1 };

  assert.throws(() => validateImport(file), /No importable data found\./);
});
