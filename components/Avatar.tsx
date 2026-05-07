// Initials avatar — deterministic accent-tinted background based on the
// hashed display string so the same user always gets the same color
// without a DB column.

const TINTS = [
  "bg-accent/20 text-accent",
  "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300",
];

function hashIndex(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % TINTS.length;
}

function initials(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  // Fall back to first 2 chars of the username portion of an email
  const before = trimmed.split("@")[0];
  return before.slice(0, 2).toUpperCase();
}

export function Avatar({
  name,
  email,
  size = "md",
  className = "",
}: {
  name?: string | null;
  email: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const display = (name && name.trim()) || email;
  const tint = TINTS[hashIndex(display)];
  const sizeClasses = size === "lg" ? "w-10 h-10 text-sm" : size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs";
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center rounded-full font-semibold tracking-wide shrink-0 ${sizeClasses} ${tint} ${className}`}
    >
      {initials(display)}
    </span>
  );
}
