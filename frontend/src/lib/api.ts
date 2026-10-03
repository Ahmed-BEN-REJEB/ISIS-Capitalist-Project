import { print } from "graphql";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
export const defaultOrigin =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
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
export async function request<T, V extends Record<string, unknown>>(
  origin: string,
  document: TypedDocumentNode<T, V>,
  variables: V,
): Promise<T> {
  const response = await fetch(origin + "/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: print(document), variables }),
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok)
    throw new Error("Serveur indisponible (HTTP " + response.status + ").");
  const result = (await response.json()) as {
    data?: T;
    errors?: { message: string }[];
  };
  if (result.errors?.length)
    throw new Error(result.errors.map((e) => e.message).join(" "));
  if (!result.data) throw new Error("Réponse du serveur vide.");
  return result.data;
}
