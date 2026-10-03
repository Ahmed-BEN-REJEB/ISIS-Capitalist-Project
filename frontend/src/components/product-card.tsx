"use client";
import { asset } from "../lib/api";
import {
  cost,
  duration,
  gain,
  maxBuy,
  number,
  type BuyMode,
  type Product,
  type World,
} from "../lib/engine";
import type { Action } from "../lib/use-game";
export function ProductCard({
  product: p,
  world,
  origin,
  mode,
  disabled,
  act,
}: {
  product: Product;
  world: World;
  origin: string;
  mode: BuyMode;
  disabled: boolean;
  act: (action: Action) => void;
}) {
  const quantity = mode === "Max" ? maxBuy(p, world.money) : mode;
  const price = cost(p, quantity);
  const running = p.timeleft > 0;
  const progress = running
    ? Math.max(0, Math.min(100, (1 - p.timeleft / p.vitesse) * 100))
    : 0;
  const next = p.paliers.find((palier) => !palier.unlocked);
  return (
    <article
      className={"product-card " + (p.quantite ? "" : "unowned")}
      data-testid={"product-" + p.id}
    >
      <button
        className="portrait-button"
        disabled={disabled || !p.quantite || running || p.managerUnlocked}
        onClick={() => act({ kind: "launch", id: p.id })}
        aria-label={"Lancer la production : " + p.name}
        title={
          p.managerUnlocked
            ? "Production automatique"
            : running
              ? "Production en cours"
              : "Cliquez pour produire"
        }
      >
        <img
          src={asset(origin, p.logo)}
          alt={p.name}
          width="112"
          height="112"
        />
        <span className="quantity">× {number(p.quantite)}</span>
        {!running && p.quantite > 0 && !p.managerUnlocked && (
          <span className="play-hint">▶</span>
        )}
      </button>
      <div className="product-content">
        <div className="product-heading">
          <h3>{p.name}</h3>
          <span className={"status " + (p.managerUnlocked ? "automatic" : "")}>
            {p.managerUnlocked ? "AUTO" : p.quantite ? "MANUEL" : "À RECRUTER"}
          </span>
        </div>
        <div
          className="production"
          role="progressbar"
          aria-label={"Production de " + p.name}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        >
          <div className="production-fill" style={{ width: progress + "%" }} />
          <span>
            + {number(gain(world, p))} <small>or / cycle</small>
          </span>
        </div>
        <div className="purchase-row">
          <button
            className="buy-button"
            disabled={
              disabled ||
              quantity < 1 ||
              !Number.isFinite(price) ||
              world.money < price
            }
            onClick={() => act({ kind: "buy", id: p.id, quantity })}
          >
            <span>Recruter ×{quantity}</span>
            <strong>{number(price)} or</strong>
          </button>
          <time className="timer">
            {duration(running ? p.timeleft : p.vitesse)}
            <small>{running ? "restant" : "par cycle"}</small>
          </time>
        </div>
        <div className="milestone">
          <span>
            {next
              ? "Prochain palier · " + next.seuil + " unités"
              : "Tous les paliers atteints"}
          </span>
          <span>
            {next ? Math.min(p.quantite, next.seuil) + "/" + next.seuil : "✓"}
          </span>
        </div>
      </div>
    </article>
  );
}
