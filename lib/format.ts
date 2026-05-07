// Centralised date/time formatting so every page uses the same look.
// "3 hours ago" for recent (< 7 days), "May 6" for this year, "May 6, 2025"
// for older.

const RELATIVE = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const SHORT = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" });
const LONG = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" });
const DATETIME = new Intl.DateTimeFormat("en", {
  month: "short", day: "numeric", year: "numeric",
  hour: "numeric", minute: "2-digit",
});

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

export function formatRelative(input: Date | string): string {
  const date = typeof input === "string" ? new Date(input) : input;
  const diff = Date.now() - date.getTime();
  if (diff < MINUTE) return "just now";
  if (diff < HOUR) return RELATIVE.format(-Math.round(diff / MINUTE), "minute");
  if (diff < DAY) return RELATIVE.format(-Math.round(diff / HOUR), "hour");
  if (diff < WEEK) return RELATIVE.format(-Math.round(diff / DAY), "day");
  // After a week, switch to absolute date — relative starts to feel vague.
  return formatDateShort(date);
}

export function formatDateShort(input: Date | string): string {
  const date = typeof input === "string" ? new Date(input) : input;
  if (date.getFullYear() === new Date().getFullYear()) return SHORT.format(date);
  return LONG.format(date);
}

export function formatDateTime(input: Date | string): string {
  const date = typeof input === "string" ? new Date(input) : input;
  return DATETIME.format(date);
}
