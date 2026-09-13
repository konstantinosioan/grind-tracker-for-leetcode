## Functions

<dl>
<dt><a href="#paintBadge">paintBadge()</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Draws today&#39;s solved count as a badge on the toolbar icon. It turns green
once the goal&#39;s reached, stays grey until then, and clears when count is zero</p>
</dd>
<dt><a href="#scheduleRollover">scheduleRollover()</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Sets a one-time alarm for the next midnight so the badge gets redrawn when
the day rolls over. Does nothing if that alarm is already set</p>
</dd>
<dt><a href="#expectVerdict">expectVerdict()</a></dt>
<dd><p>Called when the user submits. Starts watching for a verdict, reads the
problem&#39;s difficulty off the page and stops watching after 20 seconds
so that a later visit to old submissions isn&#39;t counted</p>
</dd>
<dt><a href="#load">load()</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Loads the saved goal, day counts and difficulty tallies, then fills the
goal box and draws the heatmap and difficulty breakdown. Runs on page open
and again after an import</p>
</dd>
<dt><a href="#saveGoal">saveGoal()</a> ⇒ <code>Promise.&lt;boolean&gt;</code></dt>
<dd><p>Saves the goal if valid, then redraws the heatmap so the shading
matches the new goal</p>
</dd>
<dt><a href="#heatLevel">heatLevel(count, goal)</a> ⇒ <code>number</code></dt>
<dd><p>Picks a heatmap shade from 0 to 4 for a day, based on its count against
the goal: 0 for nothing, up to 4 for more than double the goal</p>
</dd>
<dt><a href="#renderHeatmap">renderHeatmap(days, goal, today)</a></dt>
<dd><p>Draws the activity heatmap: 26 weeks of days ending today, each cell
shaded by that day&#39;s count against the goal, with the month range below it</p>
</dd>
<dt><a href="#renderDifficulty">renderDifficulty(difficulties)</a></dt>
<dd><p>Draws the difficulty breakdown as bars sized by each one&#39;s share of the
total, or a short message when nothing&#39;s been recorded yet</p>
</dd>
<dt><a href="#exportData">exportData()</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Saves the current data (days, goal, difficulties, start date) to a JSON
file the browser downloads, named with today&#39;s date and time</p>
</dd>
<dt><a href="#handleImport">handleImport(event)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Reads the file the user picked, checks if it&#39;s a valid export, and after
confirming, replaces the stored data with it and redraws the page. Anything
that goes wrong shows up in the status line</p>
</dd>
<dt><a href="#formatDate">formatDate(key)</a> ⇒ <code>string</code></dt>
<dd><p>Turns a &quot;YYYY-MM-DD&quot; key into a short readable date like &quot;Fri, Sep 12&quot;</p>
</dd>
<dt><a href="#renderHistory">renderHistory(history)</a></dt>
<dd><p>Fills the recent-history list with one row per day (date and count), or
a short message when there&#39;s nothing to show yet</p>
</dd>
<dt><a href="#render">render()</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Draws the whole popup from storage: today&#39;s progress and bar, the streak
and best streak, the recent-history list, and the all-time total and best day.
Runs on open and after each +1 / -1</p>
</dd>
<dt><a href="#adjustToday">adjustToday(change)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Adds change to today&#39;s solved count, never dropping below zero</p>
</dd>
<dt><a href="#recordDifficulty">recordDifficulty(level)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Bumps the tally for a solved problem&#39;s difficulty. Ignores an
invalid difficulty</p>
</dd>
<dt><a href="#todayKey">todayKey(date)</a> ⇒ <code>string</code></dt>
<dd><p>Turns a Date into a &quot;YYYY-MM-DD&quot; key using local time, so a day lines
up with the user&#39;s own midnight</p>
</dd>
<dt><a href="#currentStreak">currentStreak(days, goal, today)</a> ⇒ <code>number</code></dt>
<dd><p>Counts the run of consecutive days up to today where the goal was met. Today
adds to the streak only once the goal is met but a today that&#39;s short of the
goal doesn&#39;t break it; the run just counts up to yesterday</p>
</dd>
<dt><a href="#isNextDay">isNextDay(prevKey, currKey)</a> ⇒ <code>boolean</code></dt>
<dd><p>Checks whether currKey is the calendar day right after prevKey, so a run
can tell consecutive days from a gap (handles month and year boundaries)</p>
</dd>
<dt><a href="#longestStreak">longestStreak(days, goal)</a> ⇒ <code>number</code></dt>
<dd><p>Finds the longest run of consecutive days the goal was met, anywhere in the
history. Sorts those days by date and walks them, counting consecutive runs
and keeping the best</p>
</dd>
<dt><a href="#recentDays">recentDays(days, today, numDays)</a> ⇒ <code>Array.&lt;{date: string, count: number}&gt;</code></dt>
<dd><p>Lists the last numDays days ending today, newest first, filling in zero
for any day with nothing logged</p>
</dd>
<dt><a href="#isPlainObject">isPlainObject(x)</a> ⇒ <code>boolean</code></dt>
<dd><p>Checks for a plain object (not null and not an array)</p>
</dd>
<dt><a href="#isCount">isCount(v)</a> ⇒ <code>boolean</code></dt>
<dd><p>Checks for a non-negative whole number (a valid solved count)</p>
</dd>
<dt><a href="#validateImport">validateImport(parsed)</a> ⇒ <code>object</code></dt>
<dd><p>Checks a parsed import file and returns a clean object with only the
recognized keys (days, goal, difficulties, start date). Throws if the
file is the wrong shape or version, if any field is invalid or if there&#39;s
nothing to import</p>
</dd>
</dl>

<a name="paintBadge"></a>

## paintBadge() ⇒ <code>Promise.&lt;void&gt;</code>
Draws today's solved count as a badge on the toolbar icon. It turns green
once the goal's reached, stays grey until then, and clears when count is zero

**Kind**: global function  
<a name="scheduleRollover"></a>

## scheduleRollover() ⇒ <code>Promise.&lt;void&gt;</code>
Sets a one-time alarm for the next midnight so the badge gets redrawn when
the day rolls over. Does nothing if that alarm is already set

**Kind**: global function  
<a name="expectVerdict"></a>

## expectVerdict()
Called when the user submits. Starts watching for a verdict, reads the
problem's difficulty off the page and stops watching after 20 seconds
so that a later visit to old submissions isn't counted

**Kind**: global function  
<a name="load"></a>

## load() ⇒ <code>Promise.&lt;void&gt;</code>
Loads the saved goal, day counts and difficulty tallies, then fills the
goal box and draws the heatmap and difficulty breakdown. Runs on page open
and again after an import

**Kind**: global function  
<a name="saveGoal"></a>

## saveGoal() ⇒ <code>Promise.&lt;boolean&gt;</code>
Saves the goal if valid, then redraws the heatmap so the shading
matches the new goal

**Kind**: global function  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - whether the goal was valid and saved - the
 Done button uses it to decide whether to close the page  
<a name="heatLevel"></a>

## heatLevel(count, goal) ⇒ <code>number</code>
Picks a heatmap shade from 0 to 4 for a day, based on its count against
the goal: 0 for nothing, up to 4 for more than double the goal

**Kind**: global function  
**Returns**: <code>number</code> - a shade level from 0 to 4  

| Param | Type | Description |
| --- | --- | --- |
| count | <code>number</code> | problems solved that day |
| goal | <code>number</code> | the daily goal to measure against |

<a name="renderHeatmap"></a>

## renderHeatmap(days, goal, today)
Draws the activity heatmap: 26 weeks of days ending today, each cell
shaded by that day's count against the goal, with the month range below it

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| days | <code>Record.&lt;string, number&gt;</code> | solved counts keyed by "YYYY-MM-DD" |
| goal | <code>number</code> | the daily goal, used to shade each cell |
| today | <code>Date</code> | the most recent day shown; grid ends here |

<a name="renderDifficulty"></a>

## renderDifficulty(difficulties)
Draws the difficulty breakdown as bars sized by each one's share of the
total, or a short message when nothing's been recorded yet

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| difficulties | <code>Record.&lt;string, number&gt;</code> | solved counts per difficulty |

<a name="exportData"></a>

## exportData() ⇒ <code>Promise.&lt;void&gt;</code>
Saves the current data (days, goal, difficulties, start date) to a JSON
file the browser downloads, named with today's date and time

**Kind**: global function  
<a name="handleImport"></a>

## handleImport(event) ⇒ <code>Promise.&lt;void&gt;</code>
Reads the file the user picked, checks if it's a valid export, and after
confirming, replaces the stored data with it and redraws the page. Anything
that goes wrong shows up in the status line

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Event</code> | the change event from the hidden file input |

<a name="formatDate"></a>

## formatDate(key) ⇒ <code>string</code>
Turns a "YYYY-MM-DD" key into a short readable date like "Fri, Sep 12"

**Kind**: global function  
**Returns**: <code>string</code> - the date formatted for display  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | a day key in "YYYY-MM-DD" format |

<a name="renderHistory"></a>

## renderHistory(history)
Fills the recent-history list with one row per day (date and count), or
a short message when there's nothing to show yet

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| history | <code>Array.&lt;{date: string, count: number}&gt;</code> | the recent days to show, newest first |

<a name="render"></a>

## render() ⇒ <code>Promise.&lt;void&gt;</code>
Draws the whole popup from storage: today's progress and bar, the streak
and best streak, the recent-history list, and the all-time total and best day.
Runs on open and after each +1 / -1

**Kind**: global function  
<a name="adjustToday"></a>

## adjustToday(change) ⇒ <code>Promise.&lt;void&gt;</code>
Adds change to today's solved count, never dropping below zero

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| change | <code>number</code> | how much to add |

<a name="recordDifficulty"></a>

## recordDifficulty(level) ⇒ <code>Promise.&lt;void&gt;</code>
Bumps the tally for a solved problem's difficulty. Ignores an
invalid difficulty

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| level | <code>string</code> | the difficulty: "easy", "medium" or "hard" |

<a name="todayKey"></a>

## todayKey(date) ⇒ <code>string</code>
Turns a Date into a "YYYY-MM-DD" key using local time, so a day lines
up with the user's own midnight

**Kind**: global function  
**Returns**: <code>string</code> - the day key in "YYYY-MM-DD" format  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>Date</code> | the date to format |

<a name="currentStreak"></a>

## currentStreak(days, goal, today) ⇒ <code>number</code>
Counts the run of consecutive days up to today where the goal was met. Today
adds to the streak only once the goal is met but a today that's short of the
goal doesn't break it; the run just counts up to yesterday

**Kind**: global function  
**Returns**: <code>number</code> - how many days in a row hit the goal  

| Param | Type | Description |
| --- | --- | --- |
| days | <code>Record.&lt;string, number&gt;</code> | solved counts keyed by "YYYY-MM-DD" |
| goal | <code>number</code> | the daily goal a day must reach to count |
| today | <code>Date</code> | the day to count back from |

<a name="isNextDay"></a>

## isNextDay(prevKey, currKey) ⇒ <code>boolean</code>
Checks whether currKey is the calendar day right after prevKey, so a run
can tell consecutive days from a gap (handles month and year boundaries)

**Kind**: global function  
**Returns**: <code>boolean</code> - true if currKey is exactly one day after prevKey  

| Param | Type | Description |
| --- | --- | --- |
| prevKey | <code>string</code> | the earlier day key |
| currKey | <code>string</code> | the day key to test against it |

<a name="longestStreak"></a>

## longestStreak(days, goal) ⇒ <code>number</code>
Finds the longest run of consecutive days the goal was met, anywhere in the
history. Sorts those days by date and walks them, counting consecutive runs
and keeping the best

**Kind**: global function  
**Returns**: <code>number</code> - the length of the longest streak  

| Param | Type | Description |
| --- | --- | --- |
| days | <code>Record.&lt;string, number&gt;</code> | solved counts keyed by "YYYY-MM-DD" |
| goal | <code>number</code> | the daily goal a day must reach to count |

<a name="recentDays"></a>

## recentDays(days, today, numDays) ⇒ <code>Array.&lt;{date: string, count: number}&gt;</code>
Lists the last numDays days ending today, newest first, filling in zero
for any day with nothing logged

**Kind**: global function  
**Returns**: <code>Array.&lt;{date: string, count: number}&gt;</code> - one entry per day, newest first  

| Param | Type | Description |
| --- | --- | --- |
| days | <code>Record.&lt;string, number&gt;</code> | solved counts keyed by "YYYY-MM-DD" |
| today | <code>Date</code> | the most recent day in the list |
| numDays | <code>number</code> | how many days to include |

<a name="isPlainObject"></a>

## isPlainObject(x) ⇒ <code>boolean</code>
Checks for a plain object (not null and not an array)

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>unknown</code> | the value to check |

<a name="isCount"></a>

## isCount(v) ⇒ <code>boolean</code>
Checks for a non-negative whole number (a valid solved count)

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>unknown</code> | the value to check |

<a name="validateImport"></a>

## validateImport(parsed) ⇒ <code>object</code>
Checks a parsed import file and returns a clean object with only the
recognized keys (days, goal, difficulties, start date). Throws if the
file is the wrong shape or version, if any field is invalid or if there's
nothing to import

**Kind**: global function  
**Returns**: <code>object</code> - the validated data, safe to save  
**Throws**:

- <code>Error</code> with a short message describing what's wrong


| Param | Type | Description |
| --- | --- | --- |
| parsed | <code>unknown</code> | the result of JSON.parse on the import file |

