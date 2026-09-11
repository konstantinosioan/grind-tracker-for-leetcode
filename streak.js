export function todayKey(date) {
  const year = date.getFullYear();
  // + 1 since getMonth() returns a zero-based value
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

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
