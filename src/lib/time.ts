export const MIN = 60 * 1000;
export const HR = 60 * MIN;

export function fmtTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function fmtDay(ts: number): string {
  return new Date(ts).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

export function dayKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function isSameDay(a: number, b: number): boolean {
  return dayKey(a) === dayKey(b);
}

export function minsAgo(ts: number, now = Date.now()): string {
  const m = Math.round((now - ts) / MIN);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m ago`;
}

export function fmtDuration(ms: number): string {
  if (ms <= 0) return "any moment";
  const m = Math.round(ms / MIN);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

export function fmtMins(m: number): string {
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem ? `${h}h ${rem}m` : `${h}h`;
}

export function toDateTimeLocalValue(ts: number): string {
  const date = new Date(ts);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * MIN);
  return localDate.toISOString().slice(0, 16);
}

export function fromDateTimeLocalValue(value: string, fallback: number = Date.now()): number {
  if (!value) return fallback;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? fallback : parsed;
}
