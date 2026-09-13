/**
 * Turns a Date into a "YYYY-MM-DD" key using local time, so a day lines
 * up with the user's own midnight
 *
 * @param {Date} date - the date to format
 * @returns {string} the day key in "YYYY-MM-DD" format
 */
export function todayKey(date) {
  const year = date.getFullYear();
  // + 1 since getMonth() returns a zero-based value
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Counts the run of consecutive days up to today where the goal was met. Today
 * adds to the streak only once the goal is met but a today that's short of the
 * goal doesn't break it; the run just counts up to yesterday
 *
 * @param {Record<string, number>} days - solved counts keyed by "YYYY-MM-DD"
 * @param {number} goal - the daily goal a day must reach to count
 * @param {Date} today - the day to count back from
 * @returns {number} how many days in a row hit the goal
 */
export function currentStreak(days, goal, today) {
  let streak = 0;
  const day = new Date(today);

  if ((days[todayKey(day)] || 0) >= goal) {
    streak++;
  }

  day.setDate(day.getDate() - 1);

  while ((days[todayKey(day)] || 0) >= goal) {
    streak++;
    day.setDate(day.getDate() - 1);
  }

  return streak;
}

/**
 * Checks whether currKey is the calendar day right after prevKey, so a run
 * can tell consecutive days from a gap (handles month and year boundaries)
 *
 * @param {string} prevKey - the earlier day key
 * @param {string} currKey - the day key to test against it
 * @returns {boolean} true if currKey is exactly one day after prevKey
 */
function isNextDay(prevKey, currKey) {
  const [year, month, day] = prevKey.split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  date.setDate(date.getDate() + 1);

  return todayKey(date) === currKey;
}

/**
 * Finds the longest run of consecutive days the goal was met, anywhere in the
 * history. Sorts those days by date and walks them, counting consecutive runs
 * and keeping the best
 *
 * @param {Record<string, number>} days - solved counts keyed by "YYYY-MM-DD"
 * @param {number} goal - the daily goal a day must reach to count
 * @returns {number} the length of the longest streak
 */
export function longestStreak(days, goal) {
  const sortedProductiveDays = Object.keys(days)
    .filter((key) => days[key] >= goal)
    .sort();
  let run = 0;
  let best = 0;
  let prevKey = null;

  for (const key of sortedProductiveDays) {
    if (prevKey !== null && isNextDay(prevKey, key)) {
      run++;
    } else {
      run = 1;
    }

    best = Math.max(best, run);
    prevKey = key;
  }

  return best;
}

/**
 * Lists the last numDays days ending today, newest first, filling in zero
 * for any day with nothing logged
 *
 * @param {Record<string, number>} days - solved counts keyed by "YYYY-MM-DD"
 * @param {Date} today - the most recent day in the list
 * @param {number} numDays - how many days to include
 * @returns {Array<{ date: string, count: number }>} one entry per day, newest first
 */
export function recentDays(days, today, numDays) {
  const result = [];
  const day = new Date(today);

  for (let i = 0; i < numDays; i++) {
    const key = todayKey(day);
    result.push({ date: key, count: days[key] || 0 });
    day.setDate(day.getDate() - 1);
  }

  return result;
}
