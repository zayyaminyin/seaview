/**
 * Simple cn utility - concatenate class names, filtering out falsy values
 */
export function cn(
  ...classes: (string | undefined | null | false)[]
): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format large numbers with commas (e.g., 1234567 -> "1,234,567")
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Format numbers with abbreviation (e.g., 1200 -> "1.2K", 3400000 -> "3.4M")
 */
export function abbreviateNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 1_000_000) return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  if (num < 1_000_000_000)
    return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (num < 1_000_000_000_000)
    return `${(num / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
  return `${(num / 1_000_000_000_000).toFixed(1).replace(/\.0$/, "")}T`;
}

/**
 * Get a random subset of an array without modifying the original
 */
export function getRandomSubset<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, arr.length));
}

/**
 * Debounce a function - delays execution until after ms milliseconds of inactivity
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms: number
): T {
  let timeoutId: ReturnType<typeof setTimeout>;
  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
  return debounced as T;
}

/**
 * Throttle a function - limits execution to at most once per ms milliseconds (leading edge)
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms: number
): T {
  let lastCall = 0;
  const throttled = (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= ms) {
      lastCall = now;
      fn(...args);
    }
  };
  return throttled as T;
}
