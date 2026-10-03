import type { KingdomFragment, RewardFragment } from "./generated";
export type World = KingdomFragment;
export type Product = World["products"][number];
export type Reward = RewardFragment;
export type BuyMode = 1 | 10 | 100 | "Max";

export function cost(product: Product, quantity: number): number {
  if (quantity <= 0) return 0;
  return product.croissance === 1
    ? product.cout * quantity
    : (product.cout * (Math.pow(product.croissance, quantity) - 1)) /
        (product.croissance - 1);
}
export function maxBuy(product: Product, money: number): number {
  if (money < product.cout || product.cout <= 0 || !Number.isFinite(money))
    return 0;
  const cap = Math.max(0, 2147483647 - product.quantite);
  let n = Math.min(
    cap,
    Math.floor(
      product.croissance === 1
        ? money / product.cout
        : Math.log1p((money * (product.croissance - 1)) / product.cout) /
            Math.log(product.croissance),
    ),
  );
  // Correct floating-point rounding at exact geometric-series boundaries.
  while (n > 0 && cost(product, n) > money) n--;
  while (n < cap && cost(product, n + 1) <= money) n++;
  return n;
}
export const gain = (w: World, p: Product) =>
  p.quantite * p.revenu * (1 + (w.activeangels * w.angelbonus) / 100);
export const angelsGained = (w: World) =>
  Math.max(
    0,
    Math.floor(150 * Math.sqrt(Math.max(0, w.score) / 1e15)) - w.totalangels,
  );
export function projectWorld(source: World, elapsed: number): World {
  const world = structuredClone(source);
  elapsed = Math.max(0, elapsed);
  for (const p of world.products) {
    if (p.quantite <= 0) {
      p.timeleft = 0;
      continue;
    }
    const duration = Math.max(1, p.vitesse);
    const first =
      p.timeleft > 0 ? p.timeleft : p.managerUnlocked ? duration : 0;
    if (!first) continue;
    if (elapsed < first) {
      p.timeleft = first - elapsed;
      continue;
    }
    const cycles = p.managerUnlocked
      ? 1 + Math.floor((elapsed - first) / duration)
      : 1;
    const earned = gain(world, p) * cycles;
    world.money += earned;
    world.score += earned;
    p.timeleft = p.managerUnlocked
      ? duration - ((elapsed - first) % duration)
      : 0;
  }
  return world;
}
export function number(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const units = [
    { scale: 1e18, name: "trillion" },
    { scale: 1e15, name: "billiard" },
    { scale: 1e12, name: "billion" },
    { scale: 1e9, name: "milliard" },
    { scale: 1e6, name: "million" },
  ];
  const unit = units.find(({ scale }) => Math.abs(value) >= scale);
  if (!unit) return value.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
  const amount = value / unit.scale;
  return (
    amount.toLocaleString("fr-FR", { maximumFractionDigits: 2 }) +
    " " +
    unit.name +
    (Math.abs(amount) >= 2 ? "s" : "")
  );
}
export function duration(ms: number): string {
  const tenths = Math.max(0, Math.ceil(ms / 100));
  const seconds = Math.floor(tenths / 10);
  return (
    [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
      .map((v) => String(v).padStart(2, "0"))
      .join(":") +
    "." +
    (tenths % 10)
  );
}
export function target(w: World, p: Reward): string {
  return p.idcible === -1
    ? "Chaque ange actif"
    : p.idcible === 0
      ? "Toute votre armée"
      : w.products.find((product) => product.id === p.idcible)?.name || "Unité";
}
export function effect(p: Reward): string {
  return p.typeratio === "ange"
    ? "+" + p.ratio + " points de bonus par ange"
    : p.typeratio === "vitesse"
      ? "Vitesse ×" + p.ratio
      : "Revenus ×" + p.ratio;
}
