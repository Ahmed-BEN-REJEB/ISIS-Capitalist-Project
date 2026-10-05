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
  | "unlocks"
  | "investors"
  | "settings"
  | "help"
  | null;
const titles = {
  managers: "Managers",
  upgrades: "Upgrades",
  unlocks: "Unlocks",
  investors: "Investors",
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
                    ? "Acquis"
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
  const [upgradeKind, setUpgradeKind] = useState<"upgrades" | "angelupgrades">(
    "upgrades",
  );
  const [confirmReset, setConfirmReset] = useState(false);
  const origin = session?.origin || defaultOrigin;
  const disabled = busy || !!error;
  const available = (items: Reward[], money: number) =>
    items.filter((p) => !p.unlocked && p.seuil <= money).length;
  const close = () => {
    setPanel(null);
    setConfirmReset(false);
  };
  const menu: { panel: Exclude<Panel, null>; label: string; count?: number }[] =
    [
      { panel: "unlocks", label: "Unlocks" },
      {
        panel: "upgrades",
        label: "Upgrades",
        count: world
          ? available(world.upgrades, world.money) +
            available(world.angelupgrades, world.activeangels)
          : 0,
      },
      {
        panel: "managers",
        label: "Managers",
        count: world ? available(world.managers, world.money) : 0,
      },
      { panel: "investors", label: "Investors" },
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
          Royaume
        </button>
        {menu.map((item) => (
          <button
            key={item.panel}
            className="nav-item"
            disabled={!world}
            onClick={() => setPanel(item.panel)}
          >
            <span>{item.label}</span>
            {!!item.count && <span className="badge">{item.count}</span>}
          </button>
        ))}
        <div className="sidebar-bottom">
          <button className="text-button" onClick={() => setPanel("help")}>
            Règles du jeu
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
                {session?.user.slice(0, 1).toUpperCase() || "J"}
              </span>
              {session?.user || "Votre royaume"}
            </button>
            <button
              className="icon-button"
              onClick={() => void game.refresh()}
              disabled={busy}
              aria-label="Actualiser le monde"
              title="Actualiser"
            >
              Actualiser
            </button>
          </div>
        </header>
        <section
          className="hero"
          style={{
            backgroundImage:
              'linear-gradient(90deg,rgba(55,32,19,.87),rgba(55,32,19,.12)),url("' +
              asset(origin, "icones/kingdom-background.webp") +
              '")',
          }}
        >
          <h1>{world?.name || "War Toy Kingdom"}</h1>
          <p>Développez votre armée et les revenus de votre royaume.</p>
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
                  {number(world.activeangels)}{" "}
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
                Progression propre à <strong>{session?.user}</strong>
              </span>
            </footer>
          </>
        )}
      </main>
      <div className="toast-region" aria-live="polite" aria-atomic="true">
        {game.toast && <div className="toast">{game.toast}</div>}
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
            </div>
          ) : (
            world && (
              <>
                {panel === "unlocks" && (
                  <Unlocks world={world} origin={origin} />
                )}
                {(panel === "managers" || panel === "upgrades") &&
                  (() => {
                    const kind =
                      panel === "managers" ? "managers" : upgradeKind;
                    const currency =
                      kind === "angelupgrades"
                        ? world.activeangels
                        : world.money;
                    const items = world[kind];
                    const acquired = items.filter((p) => p.unlocked).length;
                    return (
                      <>
                        {panel === "upgrades" && (
                          <div
                            className="upgrade-tabs"
                            role="group"
                            aria-label="Type d’amélioration"
                          >
                            <button
                              aria-pressed={upgradeKind === "upgrades"}
                              onClick={() => setUpgradeKind("upgrades")}
                            >
                              Arsenal
                              {world && (
                                <span className="tab-count">
                                  {available(world.upgrades, world.money)}
                                </span>
                              )}
                            </button>
                            <button
                              aria-pressed={upgradeKind === "angelupgrades"}
                              onClick={() => setUpgradeKind("angelupgrades")}
                            >
                              Bénédictions
                              {world && (
                                <span className="tab-count">
                                  {available(
                                    world.angelupgrades,
                                    world.activeangels,
                                  )}
                                </span>
                              )}
                            </button>
                          </div>
                        )}
                        <p className="modal-description">
                          {kind === "managers"
                            ? "Confiez vos unités à un commandant : elles produiront sans interruption."
                            : kind === "upgrades"
                              ? "Équipez votre armée. Chaque amélioration est permanente jusqu’à la prochaine renaissance."
                              : "Ces améliorations coûtent des anges actifs."}
                        </p>
                        <div className="modal-balance">
                          Disponible : {number(currency)}{" "}
                          {kind === "angelupgrades" ? "anges" : "or"}
                          <span className="collection-progress">
                            {acquired} acquis sur {items.length}
                          </span>
                        </div>
                        {items.map((p) => (
                          <div
                            className={
                              "reward " + (p.unlocked ? "reward-acquired" : "")
                            }
                            key={p.name}
                          >
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
                            {p.unlocked ? (
                              <span className="reward-state">
                                {kind === "managers" ? "Engagé" : "Acquis"}
                              </span>
                            ) : (
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
                            )}
                          </div>
                        ))}
                      </>
                    );
                  })()}
                {panel === "investors" && (
                  <div className="investors">
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
                          Réinitialiser le monde et récupérer{" "}
                          {number(angelsGained(world))} anges ?
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
                            Confirmer le reset
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="primary-button"
                        disabled={disabled}
                        onClick={() => setConfirmReset(true)}
                      >
                        Reset du monde
                      </button>
                    )}
                    {angelsGained(world) === 0 && (
                      <p className="reset-warning">
                        Ce reset ne rapporte aucun nouvel ange.
                      </p>
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
