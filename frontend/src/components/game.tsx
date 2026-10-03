"use client";
import { useState } from "react";
import { asset, defaultOrigin } from "../lib/api";
import {
  angelsGained,
  effect,
  gain,
  number,
  target,
  type BuyMode,
  type Reward,
  type World,
} from "../lib/engine";
import { useGame } from "../lib/use-game";
import { ProductCard } from "./product-card";
import { Modal } from "./modal";
type Panel =
  | "managers"
  | "upgrades"
  | "angelupgrades"
  | "unlocks"
  | "investors"
  | "settings"
  | "help"
  | null;
const titles = {
  managers: "Commandants",
  upgrades: "Arsenal",
  angelupgrades: "Bénédictions",
  unlocks: "Paliers de gloire",
  investors: "Héritage des anges",
  settings: "Votre royaume",
  help: "L’art de régner",
};
function RewardImage({ origin, reward }: { origin: string; reward: Reward }) {
  return (
    <img
      className="reward-image"
      src={asset(origin, reward.logo)}
      alt=""
      width={72}
      height={72}
      loading="lazy"
    />
  );
}
function Unlocks({ world, origin }: { world: World; origin: string }) {
  const [all, setAll] = useState(false);
  const groups = [
    ...world.products.map((p) => ({
      name: p.name,
      quantity: p.quantite,
      items: p.paliers,
    })),
    {
      name: "Toute votre armée",
      quantity: Math.min(...world.products.map((p) => p.quantite)),
      items: world.allunlocks,
    },
  ];
  return (
    <>
      <p className="muted">
        Ces bonus sont gratuits et automatiques. Les paliers collectifs exigent
        le seuil sur chaque unité.
      </p>
      <label className="check">
        <input
          type="checkbox"
          checked={all}
          onChange={(e) => setAll(e.target.checked)}
        />{" "}
        Afficher tous les paliers
      </label>
      {groups.map((group) => (
        <section key={group.name} className="unlock-group">
          <h3>{group.name}</h3>
          {(all
            ? group.items
            : group.items.filter((p) => !p.unlocked).slice(0, 1)
          ).map((p) => (
            <div className="reward" key={p.name}>
              <RewardImage origin={origin} reward={p} />
              <div className="reward-info">
                <h4>{p.name}</h4>
                <p>
                  {effect(p)} · {target(world, p)}
                </p>
                <progress
                  max={p.seuil}
                  value={Math.min(p.seuil, group.quantity)}
                />
                <small>
                  {p.unlocked
                    ? "✓ Acquis"
                    : number(group.quantity) +
                      " / " +
                      number(p.seuil) +
                      " unités"}
                </small>
              </div>
            </div>
          ))}
          {!all && group.items.every((p) => p.unlocked) && (
            <p className="success">Tous les paliers sont acquis.</p>
          )}
        </section>
      ))}
    </>
  );
}
export function Game() {
  const game = useGame();
  const { world, session, busy, error } = game;
  const [mode, setMode] = useState<BuyMode>(1);
  const [panel, setPanel] = useState<Panel>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const origin = session?.origin || defaultOrigin;
  const disabled = busy || !!error;
  const available = (items: Reward[], money: number) =>
    items.filter((p) => !p.unlocked && p.seuil <= money).length;
  const close = () => {
    setPanel(null);
    setConfirmReset(false);
  };
  const menu: {
    panel: Exclude<Panel, null>;
    symbol: string;
    label: string;
    subtitle: string;
    count?: number;
  }[] = [
    {
      panel: "managers",
      symbol: "⚑",
      label: "Commandants",
      subtitle: "Managers · production auto",
      count: world ? available(world.managers, world.money) : 0,
    },
    {
      panel: "upgrades",
      symbol: "⚒",
      label: "Arsenal",
      subtitle: "Cash upgrades",
      count: world ? available(world.upgrades, world.money) : 0,
    },
    {
      panel: "unlocks",
      symbol: "♜",
      label: "Paliers de gloire",
      subtitle: "Unlocks · exploits de l’armée",
    },
    {
      panel: "investors",
      symbol: "✧",
      label: "Héritage",
      subtitle: "Investisseurs angéliques",
    },
    {
      panel: "angelupgrades",
      symbol: "✦",
      label: "Bénédictions",
      subtitle: "Angel upgrades",
      count: world ? available(world.angelupgrades, world.activeangels) : 0,
    },
  ];
  const autoIncome =
    world?.products
      .filter((p) => p.managerUnlocked)
      .reduce((sum, p) => sum + (gain(world, p) * 1000) / p.vitesse, 0) || 0;
  return (
    <div className="app-shell">
      <a href="#army" className="skip-link">
        Aller aux unités
      </a>
      <aside className="sidebar">
        <div className="brand">
          <img
            src={asset(origin, world?.logo || "icones/war-world.svg")}
            width={70}
            height={70}
            alt=""
          />
          <div>
            <span>WAR TOY</span>
            <strong>KINGDOM</strong>
          </div>
        </div>
        <div className="sidebar-divider" />
        <p className="nav-label">VOTRE DOMAINE</p>
        <button className="nav-item selected" onClick={close}>
          <span className="nav-symbol">♜</span>
          <span>
            Le royaume<small>Votre armée en campagne</small>
          </span>
          <span className="nav-arrow">›</span>
        </button>
        {menu.map((item) => (
          <button
            key={item.panel}
            className="nav-item"
            disabled={!world}
            onClick={() => setPanel(item.panel)}
          >
            <span className="nav-symbol">{item.symbol}</span>
            <span>
              {item.label}
              <small>{item.subtitle}</small>
            </span>
            {!!item.count && <span className="badge">{item.count}</span>}
          </button>
        ))}
        <div className="sidebar-bottom">
          <div className="legacy-note">
            <span>✧</span>
            <p>
              Les royaumes passent.
              <br />
              <strong>Votre légende demeure.</strong>
            </p>
          </div>
          <button className="text-button" onClick={() => setPanel("help")}>
            Guide du souverain ↗
          </button>
          <small>ISIS CAPITALIST · ÉDITION MÉDIÉVALE</small>
        </div>
      </aside>
      <main>
        <header className="topbar">
          <div>
            <span className="eyebrow">VOTRE CAMPAGNE</span>
            <p>{world?.name || "War Toy Kingdom"}</p>
          </div>
          <div className="top-actions">
            <span className={"connection " + (error ? "offline" : "")}>
              {error
                ? "À resynchroniser"
                : world
                  ? "Sauvegarde serveur"
                  : "Connexion…"}
            </span>
            <button
              className="account-button"
              onClick={() => setPanel("settings")}
            >
              <span className="avatar">
                {session?.user.slice(0, 1).toUpperCase() || "♔"}
              </span>
              {session?.user || "Votre royaume"}
              <span>⌄</span>
            </button>
            <button
              className="icon-button"
              onClick={() => void game.refresh()}
              disabled={busy}
              aria-label="Actualiser le monde"
              title="Actualiser"
            >
              ↻
            </button>
          </div>
        </header>
        <section
          className="hero"
          style={{
            backgroundImage:
              'linear-gradient(90deg,rgba(8,15,24,.94),rgba(8,15,24,.25)),url("' +
              asset(origin, "icones/kingdom-background.webp") +
              '")',
          }}
        >
          <span className="eyebrow">FORGEZ VOTRE LÉGENDE</span>
          <h1>
            Un royaume.
            <br />
            <em>Votre destinée.</em>
          </h1>
          <p>
            Rassemblez vos forces. Élevez votre armée.
            <br />
            Écrivez un règne dont on se souviendra.
          </p>
          <span className="hero-seal">✦ &nbsp; L’ÂGE DES CONQUÊTES</span>
        </section>
        {error && (
          <div className="error-banner" role="alert">
            <div>
              <strong>La liaison avec le royaume est interrompue.</strong>
              <p>{error}</p>
            </div>
            <button onClick={() => void game.refresh()}>Réessayer</button>
          </div>
        )}
        {!world ? (
          <section className="loading-state" role="status">
            <span className="loading-crest">♜</span>
            <h2>
              {error ? "Le royaume vous attend" : "Ouverture des portes…"}
            </h2>
            <p>Votre progression est conservée sur le serveur.</p>
            <button onClick={() => setPanel("settings")}>
              Configurer la connexion
            </button>
          </section>
        ) : (
          <>
            <section className="treasury" aria-label="Ressources du royaume">
              <div className="main-resource">
                <span className="coin">◈</span>
                <div>
                  <span className="eyebrow">TRÉSOR DU ROYAUME</span>
                  <strong data-testid="money">
                    {number(world.money)} <small>or</small>
                  </strong>
                </div>
              </div>
              <div className="resource">
                <span>Revenus automatiques</span>
                <strong>
                  {number(autoIncome)} <small>or / s</small>
                </strong>
              </div>
              <button
                className="resource resource-button"
                onClick={() => setPanel("investors")}
              >
                <span>Anges actifs</span>
                <strong>
                  ✧ {number(world.activeangels)}{" "}
                  <small>
                    +{number(world.activeangels * world.angelbonus)} %
                  </small>
                </strong>
              </button>
            </section>
            <section id="army" className="army-section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">L’ARMÉE DU ROYAUME</span>
                  <h2>Vos forces en campagne</h2>
                </div>
                <button
                  className="multiplier"
                  aria-label="Quantité d’achat"
                  onClick={() =>
                    setMode(
                      mode === 1
                        ? 10
                        : mode === 10
                          ? 100
                          : mode === 100
                            ? "Max"
                            : 1,
                    )
                  }
                >
                  Recrutement{" "}
                  <strong>{mode === "Max" ? "Max" : "×" + mode}</strong>
                  <span>⇄</span>
                </button>
              </div>
              <p className="army-tip">
                Cliquez sur une unité pour lancer sa production. Un commandant
                la rend automatique, même en votre absence.
              </p>
              <div className="product-grid">
                {world.products.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    world={world}
                    origin={origin}
                    mode={mode}
                    disabled={disabled}
                    act={game.act}
                  />
                ))}
              </div>
            </section>
            <footer className="game-footer">
              <span>
                ✦ Chaque grande conquête commence par un premier guerrier.
              </span>
              <span>
                Progression propre à <strong>{session?.user}</strong>
              </span>
            </footer>
          </>
        )}
      </main>
      <div className="toast-region" aria-live="polite" aria-atomic="true">
        {game.toast && <div className="toast">✓ {game.toast}</div>}
      </div>
      {panel && (
        <Modal title={titles[panel]} onClose={close}>
          {panel === "settings" ? (
            <form
              className="settings-form"
              onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                game.connect(
                  String(data.get("user")),
                  String(data.get("origin")),
                );
                close();
              }}
            >
              <p>
                Chaque identifiant possède son propre monde. Réutilisez le même
                pour retrouver votre partie.
              </p>
              <label>
                Identifiant du joueur
                <input
                  name="user"
                  defaultValue={session?.user}
                  required
                  pattern="[\p{L}\p{N}._\-]+"
                  autoComplete="username"
                />
              </label>
              <label>
                Adresse du backend
                <input
                  name="origin"
                  type="url"
                  defaultValue={origin}
                  required
                />
              </label>
              <p className="muted">
                Projet académique : l’identifiant n’est pas un mot de passe. Une
                autre personne connaissant ce nom peut accéder au même monde.
              </p>
              <button className="primary-button" type="submit">
                Entrer dans ce royaume
              </button>
            </form>
          ) : panel === "help" ? (
            <div className="guide">
              <p>
                <strong>1. Produisez.</strong> Cliquez sur le portrait d’une
                unité possédée. L’or arrive à la fin du cycle.
              </p>
              <p>
                <strong>2. Recrutez.</strong> Passez de ×1 à ×10, ×100 ou Max.
                Le prix augmente avec chaque unité.
              </p>
              <p>
                <strong>3. Déléguez.</strong> Vos commandants produisent
                automatiquement, y compris hors connexion.
              </p>
              <p>
                <strong>4. Progressez.</strong> L’arsenal et les paliers
                augmentent vos revenus ou votre vitesse. Un emblème collectif
                concerne toute l’armée.
              </p>
              <p>
                <strong>5. Transmettez.</strong> Réclamez des anges pour
                recommencer plus fort. Les bénédictions coûtent des anges actifs
                : leur bonus passif diminue lorsque vous les dépensez.
              </p>
              <p className="muted">
                Les montants à partir d’un million sont affichés en notation
                scientifique : 1.000e+6 = 1 000 000. Les achats sont vérifiés et
                sauvegardés par le backend.
              </p>
            </div>
          ) : (
            world && (
              <>
                {panel === "unlocks" && (
                  <Unlocks world={world} origin={origin} />
                )}
                {(
                  ["managers", "upgrades", "angelupgrades"] as Panel[]
                ).includes(panel) &&
                  (() => {
                    const kind = panel as
                      "managers" | "upgrades" | "angelupgrades";
                    const currency =
                      kind === "angelupgrades"
                        ? world.activeangels
                        : world.money;
                    const items = world[kind].filter((p) => !p.unlocked);
                    return (
                      <>
                        <p className="modal-description">
                          {kind === "managers"
                            ? "Confiez vos unités à un commandant : elles produiront sans interruption."
                            : kind === "upgrades"
                              ? "Équipez votre armée. Chaque amélioration est permanente jusqu’à la prochaine renaissance."
                              : "Sacrifiez des anges actifs pour obtenir des bonus. Leur bonus passif sera recalculé."}
                        </p>
                        <div className="modal-balance">
                          Disponible : {number(currency)}{" "}
                          {kind === "angelupgrades" ? "anges" : "or"}
                        </div>
                        {!items.length && (
                          <p className="empty-state">
                            Tout est acquis. Votre royaume est prêt.
                          </p>
                        )}
                        {items.map((p) => (
                          <div className="reward" key={p.name}>
                            <RewardImage origin={origin} reward={p} />
                            <div className="reward-info">
                              <h3>{p.name}</h3>
                              <p>{target(world, p)}</p>
                              <small>
                                {kind === "managers"
                                  ? "Production automatique"
                                  : effect(p)}
                              </small>
                            </div>
                            <button
                              disabled={disabled || currency < p.seuil}
                              onClick={() =>
                                void game.act({
                                  kind:
                                    kind === "managers"
                                      ? "hire"
                                      : kind === "upgrades"
                                        ? "cash"
                                        : "angel",
                                  name: p.name,
                                })
                              }
                            >
                              <span>
                                {kind === "managers" ? "Engager" : "Acquérir"}
                              </span>
                              <strong>
                                {number(p.seuil)}{" "}
                                {kind === "angelupgrades" ? "anges" : "or"}
                              </strong>
                            </button>
                          </div>
                        ))}
                      </>
                    );
                  })()}
                {panel === "investors" && (
                  <div className="investors">
                    <img
                      src={asset(origin, "icones/angel.svg")}
                      alt="Emblème des anges"
                      width={150}
                      height={150}
                    />
                    <p className="eyebrow">UNE FIN. UN NOUVEAU COMMENCEMENT.</p>
                    <h3>Votre héritage traverse les âges.</h3>
                    <div className="angel-stats">
                      <div>
                        <strong>{number(world.activeangels)}</strong>
                        <span>anges actifs</span>
                      </div>
                      <div>
                        <strong>{world.angelbonus} %</strong>
                        <span>par ange actif</span>
                      </div>
                      <div>
                        <strong>+{number(angelsGained(world))}</strong>
                        <span>anges à réclamer</span>
                      </div>
                    </div>
                    <p>
                      Score cumulé : {number(world.score)} · Anges obtenus au
                      total : {number(world.totalangels)}.
                    </p>
                    <p className="muted">
                      Recommencer réinitialise l’or, les unités, les commandants
                      et les améliorations. Votre score et vos anges restants
                      sont conservés.
                    </p>
                    {confirmReset ? (
                      <div className="reset-confirm">
                        <strong>
                          Abandonner ce règne et réclamer les anges ?
                        </strong>
                        <div>
                          <button onClick={() => setConfirmReset(false)}>
                            Annuler
                          </button>
                          <button
                            className="danger-button"
                            disabled={disabled}
                            onClick={() => {
                              void game.act({ kind: "reset" });
                              setConfirmReset(false);
                            }}
                          >
                            Confirmer la renaissance
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="primary-button"
                        disabled={disabled || angelsGained(world) <= 0}
                        onClick={() => setConfirmReset(true)}
                      >
                        Réclamer {number(angelsGained(world))} anges et
                        recommencer
                      </button>
                    )}
                    {angelsGained(world) === 0 && (
                      <small>
                        Continuez à produire pour constituer votre prochain
                        héritage.
                      </small>
                    )}
                  </div>
                )}
              </>
            )
          )}
        </Modal>
      )}
    </div>
  );
}
