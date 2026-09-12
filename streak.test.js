import { test } from "node:test";
import assert from "node:assert/strict";
import { currentStreak, recentDays, longestStreak } from "./streak.js";

test("streak 0 when no days logged", () => {
  const days = {};
  const today = new Date(2026, 7, 7);

  const result = currentStreak(days, 3, today);

  assert.equal(result, 0);
});

test("streak spans month boundary", () => {
  const days = {
    "2026-09-01": 5,
    "2026-08-31": 5,
  };
  const today = new Date(2026, 8, 1);

  const result = currentStreak(days, 3, today);

  assert.equal(result, 2);
});

test("today's goal not yet reached doesn't break streak", () => {
  const days = {
    "2026-09-11": 2, // not yet reached
    "2026-09-10": 3,
  };
  const today = new Date(2026, 8, 11);

  const result = currentStreak(days, 3, today);

  assert.equal(result, 1);
});

test("past missed day breaks streak", () => {
  const days = {
    "2026-09-11": 3,
    "2026-09-10": 4,
    "2026-09-09": 2, // missed
    "2026-09-08": 5,
  };
  const today = new Date(2026, 8, 11);

  const result = currentStreak(days, 3, today);

  assert.equal(result, 2);
});

test("returns one entry per day, newest first, with gaps as 0", () => {
  const days = {
    "2026-09-11": 3,
    "2026-09-09": 5,
  };
  const today = new Date(2026, 8, 11);

  const result = recentDays(days, today, 3);

  assert.deepEqual(result, [
    { date: "2026-09-11", count: 3 },
    { date: "2026-09-10", count: 0 },
    { date: "2026-09-09", count: 5 },
  ]);
});

test("longest streak 0 when no days logged", () => {
  const days = {};

  const result = longestStreak(days, 3);

  assert.equal(result, 0);
});

test("longest streak is the longest run across gaps and month boundaries", () => {
  const days = {
    "2026-08-30": 3,
    "2026-08-31": 3,
    "2026-09-01": 3,
    "2026-09-03": 3, // gap on 09-02
  };

  const result = longestStreak(days, 3);

  assert.equal(result, 3);
});

test("longest streak breaks on a missed day", () => {
  const days = {
    "2026-09-10": 3,
    "2026-09-11": 3,
    "2026-09-12": 1, // no gap but under goal
    "2026-09-13": 3,
  };

  const result = longestStreak(days, 3);

  assert.equal(result, 2);
});
