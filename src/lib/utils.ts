import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts HTTP URLs to HTTPS and provides placeholder for undefined
 * Prevents mixed content warnings
 */
export function toHttps(url: string | undefined): string {
  if (!url) return "https://placehold.co/400x600?text=Sem+Capa";
  if (url.startsWith("https://")) return url;
  return url.replace("http://", "https://");
}

/**
 * Formats Firestore Timestamp for datetime-local input
 * Adjusts timezone offset to maintain visual time consistency
 */
export function formatForInput(timestamp: any): string {
  if (!timestamp || !timestamp.toDate) return "";

  const date = timestamp.toDate();
  // Adjust offset to keep the time visually the same as saved
  const offset = date.getTimezoneOffset() * 60000;
  const localISOTime = new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, 16);

  return localISOTime;
}

/**
 * Converts datetime-local input value to Date object
 * Handles timezone properly for Firestore storage
 */
export function parseInputDate(dateTimeString: string): Date {
  if (!dateTimeString) return new Date();
  return new Date(dateTimeString);
}
