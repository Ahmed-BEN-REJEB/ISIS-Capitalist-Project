"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AngelDocument,
  BuyDocument,
  CashDocument,
  GetWorldDocument,
  HireDocument,
  LaunchDocument,
  ResetDocument,
} from "./generated";
import { defaultOrigin, normalizeOrigin, request } from "./api";
import { projectWorld, type World } from "./engine";
export type Action =
  | { kind: "buy"; id: number; quantity: number }
  | { kind: "launch"; id: number }
  | { kind: "hire" | "cash" | "angel"; name: string }
  | { kind: "reset" };
type Session = { user: string; origin: string };
const message = (error: unknown) =>
  error instanceof Error ? error.message : "Une erreur est survenue.";
export function useGame() {
  const [session, setSession] = useState<Session | null>(null);
  const [world, setWorld] = useState<World | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const epoch = useRef(0);
  const locked = useRef(false);
  const baseline = useRef<{ world: World; at: number } | null>(null);
  const accept = useCallback((next: World) => {
    baseline.current = { world: next, at: performance.now() };
    setWorld(next);
  }, []);
  const connect = useCallback((user: string, origin: string) => {
    try {
      user = user.trim();
      if (!/^[\p{L}\p{N}._-]+$/u.test(user))
        throw new Error(
          "Utilisez uniquement lettres, chiffres, points, tirets ou underscores.",
        );
      origin = normalizeOrigin(origin);
      epoch.current++;
      locked.current = false;
      baseline.current = null;
      setWorld(null);
      setError("");
      setToast("");
      setBusy(false);
      setSession({ user, origin });
      try {
        localStorage.setItem(
          "kingdom-session",
          JSON.stringify({ user, origin }),
        );
      } catch {
        /* Private browsing may deny storage. */
      }
    } catch (e) {
      setError(message(e));
    }
  }, []);
  useEffect(() => {
    let saved: Partial<Session> = {};
    try {
      const parsed: unknown = JSON.parse(
        localStorage.getItem("kingdom-session") || "{}",
      );
      if (parsed && typeof parsed === "object")
        saved = parsed as Partial<Session>;
    } catch {
      /* Ignore corrupt preferences. */
    }
    connect(
      typeof saved.user === "string"
        ? saved.user
        : "Capitaine" + Math.floor(Math.random() * 100000),
      typeof saved.origin === "string" ? saved.origin : defaultOrigin,
    );
  }, [connect]);
  const refresh = useCallback(async () => {
    if (!session || locked.current) return;
    const generation = epoch.current;
    locked.current = true;
    setBusy(true);
    try {
      const result = await request(session.origin, GetWorldDocument, {
        user: session.user,
      });
      if (generation !== epoch.current) return;
      if (!result.getWorld) throw new Error("Monde introuvable.");
      accept(result.getWorld);
      setError("");
    } catch (e) {
      if (generation === epoch.current) setError(message(e));
    } finally {
      if (generation === epoch.current) {
        locked.current = false;
        setBusy(false);
      }
    }
  }, [session, accept]);
  useEffect(() => {
    void refresh();
    const timer = setInterval(() => {
      if (!document.hidden) void refresh();
    }, 5000);
    const visible = () => {
      if (!document.hidden) void refresh();
    };
    document.addEventListener("visibilitychange", visible);
    window.addEventListener("online", visible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", visible);
      window.removeEventListener("online", visible);
    };
  }, [refresh]);
  useEffect(() => {
    const timer = setInterval(() => {
      if (baseline.current && !error)
        setWorld(
          projectWorld(
            baseline.current.world,
            performance.now() - baseline.current.at,
          ),
        );
    }, 100);
    return () => clearInterval(timer);
  }, [error]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 6000);
    return () => clearTimeout(timer);
  }, [toast]);
  const act = useCallback(
    async (action: Action) => {
      if (!session || !baseline.current || locked.current || error) return;
      locked.current = true;
      setBusy(true);
      setToast("");
      const generation = epoch.current;
      const previous = baseline.current.world;
      // Manual launch gets immediate feedback; money/bonuses remain server-authoritative.
      if (action.kind === "launch") {
        const preview = projectWorld(
          previous,
          performance.now() - baseline.current.at,
        );
        const product = preview.products.find((p) => p.id === action.id);
        if (product) product.timeleft = product.vitesse;
        accept(preview);
      }
      try {
        const user = session.user;
        switch (action.kind) {
          case "buy":
            await request(session.origin, BuyDocument, {
              user,
              id: action.id,
              quantite: action.quantity,
            });
            break;
          case "launch":
            await request(session.origin, LaunchDocument, {
              user,
              id: action.id,
            });
            break;
          case "hire":
            await request(session.origin, HireDocument, {
              user,
              name: action.name,
            });
            break;
          case "cash":
            await request(session.origin, CashDocument, {
              user,
              name: action.name,
            });
            break;
          case "angel":
            await request(session.origin, AngelDocument, {
              user,
              name: action.name,
            });
            break;
          case "reset":
            await request(session.origin, ResetDocument, { user });
            break;
        }
        const result = await request(session.origin, GetWorldDocument, {
          user,
        });
        if (generation !== epoch.current) return;
        if (!result.getWorld)
          throw new Error("Monde introuvable après action.");
        const next = result.getWorld;
        accept(next);
        setError("");
        const oldUnlocks = new Set(
          [
            ...previous.allunlocks,
            ...previous.products.flatMap((p) => p.paliers),
          ]
            .filter((p) => p.unlocked)
            .map((p) => p.name),
        );
        const unlocked = [
          ...next.allunlocks,
          ...next.products.flatMap((p) => p.paliers),
        ].filter((p) => p.unlocked && !oldUnlocks.has(p.name));
        if (unlocked.length)
          setToast(
            "Palier atteint : " + unlocked.map((p) => p.name).join(" · "),
          );
        else if (action.kind !== "launch")
          setToast(
            action.kind === "buy"
              ? "Renforts recrutés."
              : action.kind === "reset"
                ? "Une nouvelle ère commence."
                : action.name + " — activé.",
          );
      } catch (e) {
        if (generation !== epoch.current) return;
        setError(
          message(e) +
            " Actualisez pour vérifier l’état sauvegardé avant de réessayer.",
        );
        // A lost response does not mean the mutation failed: never retry automatically.
      } finally {
        if (generation === epoch.current) {
          locked.current = false;
          setBusy(false);
        }
      }
    },
    [session, accept, error],
  );
  return { world, session, busy, error, toast, connect, refresh, act };
}
