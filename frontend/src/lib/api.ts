export const defaultOrigin = "http://localhost:3000";

export function normalizeOrigin(value: string): string {
  const url = new URL(value);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password
  )
    throw new Error("Adresse HTTP(S) invalide.");
  return url.origin;
}

export function asset(origin: string, logo: string): string {
  const url = new URL(logo.replace(/^\/+/, ""), origin + "/");
  return ["http:", "https:"].includes(url.protocol) ? url.href : "";
}
