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
  if (!url) return "/placeholder-book.jpg";
  if (url.startsWith("https://")) return url;
  return url.replace("http://", "https://");
}
