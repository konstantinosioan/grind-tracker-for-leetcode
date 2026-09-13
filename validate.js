const DATE_RE = /^\d{4}-\d{2}-\d{2}$/; // matches YYYY-MM-DD

/**
 * Checks for a plain object (not null and not an array)
 *
 * @param {unknown} x - the value to check
 * @returns {boolean}
 */
const isPlainObject = (x) =>
  typeof x === "object" && x !== null && !Array.isArray(x);

/**
 * Checks for a non-negative whole number (a valid solved count)
 *
 * @param {unknown} v - the value to check
 * @returns {boolean}
 */
const isCount = (v) => Number.isInteger(v) && v >= 0;

/**
 * Checks a parsed import file and returns a clean object with only the
 * recognized keys (days, goal, difficulties, start date). Throws if the
 * file is the wrong shape or version, if any field is invalid or if there's
 * nothing to import
 *
 * @param {unknown} parsed - the result of JSON.parse on the import file
 * @returns {object} the validated data, safe to save
 * @throws {Error} with a short message describing what's wrong
 */
export function validateImport(parsed) {
  if (!isPlainObject(parsed)) throw new Error("Unrecognized file format.");
  if (parsed.version !== 1) throw new Error("Unsupported file version.");

  // builds a fresh object so only known keys survive
  const clean = {};

  if ("days" in parsed) {
    if (!isPlainObject(parsed.days)) throw new Error("Invalid day data.");

    const days = {};

    for (const [key, value] of Object.entries(parsed.days)) {
      if (!DATE_RE.test(key) || !isCount(value)) {
        throw new Error("Invalid day data.");
      }
      days[key] = value;
    }

    clean.days = days;
  }

  if ("goal" in parsed) {
    if (!Number.isInteger(parsed.goal) || parsed.goal < 1) {
      throw new Error("Invalid goal.");
    }
    clean.goal = parsed.goal;
  }

  if ("difficulties" in parsed) {
    if (!isPlainObject(parsed.difficulties)) {
      throw new Error("Invalid difficulty data.");
    }

    const difficulties = {};

    for (const [key, value] of Object.entries(parsed.difficulties)) {
      if (!["easy", "medium", "hard"].includes(key) || !isCount(value)) {
        throw new Error("Invalid difficulty data.");
      }
      difficulties[key] = value;
    }
    clean.difficulties = difficulties;
  }

  if ("startDate" in parsed) {
    if (
      typeof parsed.startDate !== "string" ||
      !DATE_RE.test(parsed.startDate)
    ) {
      throw new Error("Invalid start date.");
    }

    clean.startDate = parsed.startDate;
  }

  if (Object.keys(clean).length === 0) {
    throw new Error("No importable data found.");
  }

  return clean;
}
