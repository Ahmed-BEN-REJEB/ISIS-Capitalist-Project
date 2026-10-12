import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { form, FormField, pattern, required } from "@angular/forms/signals";
import { GameService } from "./game.service";
import { Produit } from "./produit/produit";
import { Modal } from "./modal/modal";
import { BigvaluePipe } from "./pipes/bigvalue-pipe";
import { asset } from "../lib/api";
import {
  angelsGained,
  effect,
  gain,
  target,
  type BuyMode,
  type Reward,
} from "../lib/engine";

type Panel =
  "managers" | "upgrades" | "unlocks" | "investors" | "settings" | "help";
type UpgradeKind = "upgrades" | "angelupgrades";
const titles: Record<Panel, string> = {
  managers: "Managers",
  upgrades: "Upgrades",
  unlocks: "Unlocks",
  investors: "Investors",
  settings: "Votre royaume",
  help: "L’art de régner",
};

@Component({
  selector: "app-root",
  imports: [Produit, Modal, BigvaluePipe, FormField],
  templateUrl: "./app.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly gameService = inject(GameService);
  readonly world = this.gameService.world;
  readonly qtmulti = signal<BuyMode>(1);
  readonly panel = signal<Panel | null>(null);
  readonly upgradeKind = signal<UpgradeKind>("upgrades");
  readonly confirmReset = signal(false);
  readonly allUnlocks = signal(false);
  readonly loginModel = signal({ user: "", origin: "" });
  readonly loginForm = form(this.loginModel, (schema) => {
    required(schema.user);
    pattern(schema.user, /^[\p{L}\p{N}._-]+$/u);
    required(schema.origin);
  });
  readonly asset = asset;
  readonly target = target;
  readonly effect = effect;
  readonly angelsGained = angelsGained;
  readonly min = Math.min;
  readonly title = computed(() => {
    const panel = this.panel();
    return panel ? titles[panel] : "";
  });
  readonly autoIncome = computed(() => {
    const world = this.world();
    return (
      world?.products
        .filter((p) => p.managerUnlocked)
        .reduce((sum, p) => sum + (gain(world, p) * 1000) / p.vitesse, 0) ?? 0
    );
  });
  readonly badgeManagers = computed(() => {
    const w = this.world();
    return w ? this.available(w.managers, w.money) : 0;
  });
  readonly badgeCash = computed(() => {
    const w = this.world();
    return w ? this.available(w.upgrades, w.money) : 0;
  });
  readonly badgeAngels = computed(() => {
    const w = this.world();
    return w ? this.available(w.angelupgrades, w.activeangels) : 0;
  });
  readonly menu = computed(() => [
    { panel: "unlocks" as const, label: "Unlocks", count: 0 },
    {
      panel: "upgrades" as const,
      label: "Upgrades",
      count: this.badgeCash() + this.badgeAngels(),
    },
    {
      panel: "managers" as const,
      label: "Managers",
      count: this.badgeManagers(),
    },
    { panel: "investors" as const, label: "Investors", count: 0 },
  ]);
  readonly heroBackground = computed(
    () =>
      'linear-gradient(90deg,rgba(55,32,19,.87),rgba(55,32,19,.12)),url("' +
      asset(this.gameService.server(), "icones/kingdom-background.webp") +
      '")',
  );
  readonly kind = computed(() =>
    this.panel() === "managers" ? "managers" : this.upgradeKind(),
  );
  readonly currency = computed(
    () =>
      (this.kind() === "angelupgrades"
        ? this.world()?.activeangels
        : this.world()?.money) ?? 0,
  );
  readonly rewards = computed(() => this.world()?.[this.kind()] ?? []);
  readonly acquired = computed(
    () => this.rewards().filter((p) => p.unlocked).length,
  );
  readonly unlockGroups = computed(() => {
    const world = this.world();
    if (!world) return [];
    return [
      ...world.products.map((p) => ({
        name: p.name,
        quantity: p.quantite,
        items: p.paliers,
      })),
      {
        name: "Toute votre armée",
        quantity: world.products.length
          ? Math.min(...world.products.map((p) => p.quantite))
          : 0,
        items: world.allunlocks,
      },
    ].map((group) => ({
      ...group,
      visible: this.allUnlocks()
        ? group.items
        : group.items.filter((p) => !p.unlocked).slice(0, 1),
      complete: group.items.every((p) => p.unlocked),
    }));
  });

  available(items: Reward[], currency: number) {
    return items.filter((p) => !p.unlocked && p.seuil <= currency).length;
  }
  open(panel: Panel) {
    if (panel === "settings")
      this.loginModel.set({
        user: this.gameService.user(),
        origin: this.gameService.server(),
      });
    this.panel.set(panel);
  }
  close() {
    this.panel.set(null);
    this.confirmReset.set(false);
    this.allUnlocks.set(false);
  }
  cycleQuantity() {
    this.qtmulti.update((mode) =>
      mode === 1 ? 10 : mode === 10 ? 100 : mode === 100 ? "Max" : 1,
    );
  }
  commitName(event: Event) {
    event.preventDefault();
    if (this.loginForm().invalid()) return;
    const login = this.loginModel();
    if (this.gameService.connect(login.user, login.origin)) this.close();
  }
  buyReward(reward: Reward) {
    if (reward.unlocked || this.currency() < reward.seuil) return;
    if (this.kind() === "managers") void this.gameService.hireManager(reward);
    else if (this.kind() === "upgrades")
      void this.gameService.buyCashUpgrade(reward);
    else void this.gameService.buyAngelUpgrade(reward);
  }
  reset() {
    void this.gameService.resetWorld();
    this.confirmReset.set(false);
  }
}
