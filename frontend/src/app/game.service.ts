import {
  DestroyRef,
  Injectable,
  computed,
  inject,
  linkedSignal,
  signal,
} from "@angular/core";
import { Apollo } from "@apollo-orbit/angular";
import {
  ANGEL_MUTATION,
  BUY_MUTATION,
  CASH_MUTATION,
  GET_WORLD_QUERY,
  HIRE_MUTATION,
  LAUNCH_MUTATION,
  RESET_MUTATION,
} from "./graphql/operations";
import { defaultOrigin, normalizeOrigin } from "../lib/api";
import {
  projectWorld,
  type Product,
  type Reward,
  type World,
} from "../lib/engine";

export type Action =
  | { kind: "buy"; id: number; quantity: number }
  | { kind: "launch"; id: number }
  | { kind: "hire" | "cash" | "angel"; name: string }
  | { kind: "reset" };
type Session = { user: string; origin: string };
const message = (error: unknown) =>
  error instanceof Error ? error.message : "Une erreur est survenue.";

@Injectable({ providedIn: "root" })
export class GameService {
  private readonly apollo = inject(Apollo);
  private readonly destroyRef = inject(DestroyRef);
  readonly session = signal<Session | null>(null);
  readonly user = computed(() => this.session()?.user ?? "");
  readonly server = computed(() => this.session()?.origin ?? defaultOrigin);
  private readonly baseline = signal<{ world: World; at: number } | null>(null);
  readonly world = linkedSignal(() => this.baseline()?.world ?? null);
  readonly busy = signal(false);
  readonly error = signal("");
  readonly snackmessage = signal("");
  readonly disabled = computed(() => this.busy() || !!this.error());

  // Lazy execution serializes reads and writes. Captured variables/context and the
  // generation counter prevent a late response from crossing player/server sessions.
  readonly worldQuery = this.apollo.signal.query({
    query: GET_WORLD_QUERY,
    lazy: true,
    fetchPolicy: "no-cache",
    errorPolicy: "none",
    refetchOn: false,
  });
  readonly acheterProduitsMutation = this.apollo.signal.mutation(BUY_MUTATION);
  readonly lancerProductionMutation =
    this.apollo.signal.mutation(LAUNCH_MUTATION);
  readonly engagerManagerMutation = this.apollo.signal.mutation(HIRE_MUTATION);
  readonly acheterCashMutation = this.apollo.signal.mutation(CASH_MUTATION);
  readonly acheterAngelMutation = this.apollo.signal.mutation(ANGEL_MUTATION);
  readonly resetMutation = this.apollo.signal.mutation(RESET_MUTATION);
  private epoch = 0;
  private locked = false;
  private toastTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    const stored = this.restoreSession();
    this.connect(stored.user, stored.origin);
    const sync = setInterval(() => {
      if (!document.hidden) void this.refreshWorld();
    }, 5000);
    const clock = setInterval(() => this.calcScore(), 100);
    const visible = () => {
      if (!document.hidden) void this.refreshWorld();
    };
    document.addEventListener("visibilitychange", visible);
    window.addEventListener("online", visible);
    this.destroyRef.onDestroy(() => {
      this.epoch++;
      this.worldQuery.terminate();
      clearInterval(sync);
      clearInterval(clock);
      clearTimeout(this.toastTimer);
      document.removeEventListener("visibilitychange", visible);
      window.removeEventListener("online", visible);
    });
  }

  private restoreSession(): Session {
    let saved: Partial<Session> = {};
    try {
      const value: unknown = JSON.parse(
        localStorage.getItem("kingdom-session") || "{}",
      );
      if (value && typeof value === "object") saved = value as Partial<Session>;
    } catch {
      /* Ignore corrupt preferences. */
    }
    return {
      user:
        typeof saved.user === "string"
          ? saved.user
          : "Capitaine" + Math.floor(Math.random() * 100000),
      origin: typeof saved.origin === "string" ? saved.origin : defaultOrigin,
    };
  }

  connect(user: string, origin: string): boolean {
    try {
      user = user.trim();
      if (!/^[\p{L}\p{N}._-]+$/u.test(user))
        throw new Error(
          "Utilisez uniquement lettres, chiffres, points, tirets ou underscores.",
        );
      origin = normalizeOrigin(origin);
      this.epoch++;
      this.worldQuery.terminate();
      this.locked = false;
      this.baseline.set(null);
      this.world.set(null);
      this.error.set("");
      this.notify("");
      this.busy.set(false);
      this.session.set({ user, origin });
      try {
        localStorage.setItem(
          "kingdom-session",
          JSON.stringify({ user, origin }),
        );
      } catch {
        /* Storage may be unavailable in private browsing. */
      }
      void this.refreshWorld();
      return true;
    } catch (error) {
      this.error.set(message(error));
      return false;
    }
  }

  private context(session: Session) {
    return {
      uri: session.origin + "/graphql",
      fetchOptions: { signal: AbortSignal.timeout(15000) },
    };
  }

  private accept(world: World) {
    this.baseline.set({ world, at: performance.now() });
  }

  calcScore() {
    const baseline = this.baseline();
    if (baseline && !this.error())
      this.world.set(
        projectWorld(baseline.world, performance.now() - baseline.at),
      );
  }

  async refreshWorld() {
    const session = this.session();
    if (!session || this.locked) return;
    const generation = this.epoch;
    this.locked = true;
    this.busy.set(true);
    try {
      const result = await this.worldQuery.execute({
        variables: { user: session.user },
        context: this.context(session),
      });
      if (generation !== this.epoch) return;
      if (!result.data?.getWorld) throw new Error("Monde introuvable.");
      this.accept(result.data.getWorld);
      this.error.set("");
    } catch (error) {
      if (generation === this.epoch) this.error.set(message(error));
    } finally {
      if (generation === this.epoch) {
        this.locked = false;
        this.busy.set(false);
      }
    }
  }

  buyProduct(quantity: number, product: Product) {
    return this.act({ kind: "buy", id: product.id, quantity });
  }
  startProduction(product: Product) {
    return this.act({ kind: "launch", id: product.id });
  }
  hireManager(reward: Reward) {
    return this.act({ kind: "hire", name: reward.name });
  }
  buyCashUpgrade(reward: Reward) {
    return this.act({ kind: "cash", name: reward.name });
  }
  buyAngelUpgrade(reward: Reward) {
    return this.act({ kind: "angel", name: reward.name });
  }
  resetWorld() {
    return this.act({ kind: "reset" });
  }

  private notify(text: string) {
    clearTimeout(this.toastTimer);
    this.snackmessage.set(text);
    if (text)
      this.toastTimer = setTimeout(() => this.snackmessage.set(""), 6000);
  }

  async act(action: Action) {
    const session = this.session(),
      baseline = this.baseline();
    if (!session || !baseline || this.locked || this.error()) return;
    const preview = projectWorld(
      baseline.world,
      performance.now() - baseline.at,
    );
    if (action.kind === "launch") {
      const product = preview.products.find((p) => p.id === action.id);
      if (
        !product ||
        !product.quantite ||
        product.managerUnlocked ||
        product.timeleft > 0
      )
        return;
      product.timeleft = product.vitesse;
      this.accept(preview);
    }
    this.locked = true;
    this.busy.set(true);
    this.notify("");
    const generation = this.epoch;
    const previous = baseline.world;
    const variables = { user: session.user };
    const context = this.context(session);
    try {
      switch (action.kind) {
        case "buy":
          await this.acheterProduitsMutation.mutate({
            variables: {
              ...variables,
              id: action.id,
              quantite: action.quantity,
            },
            context,
          });
          break;
        case "launch":
          await this.lancerProductionMutation.mutate({
            variables: { ...variables, id: action.id },
            context,
          });
          break;
        case "hire":
          await this.engagerManagerMutation.mutate({
            variables: { ...variables, name: action.name },
            context,
          });
          break;
        case "cash":
          await this.acheterCashMutation.mutate({
            variables: { ...variables, name: action.name },
            context,
          });
          break;
        case "angel":
          await this.acheterAngelMutation.mutate({
            variables: { ...variables, name: action.name },
            context,
          });
          break;
        case "reset":
          await this.resetMutation.mutate({ variables, context });
          break;
      }
      // A player may switch while the mutation is pending.
      if (generation !== this.epoch) return;
      const result = await this.worldQuery.execute({
        variables,
        context: this.context(session),
      });
      if (generation !== this.epoch) return;
      if (!result.data?.getWorld)
        throw new Error("Monde introuvable après action.");
      const next = result.data.getWorld;
      this.accept(next);
      this.error.set("");
      const oldUnlocks = new Set(
        [...previous.allunlocks, ...previous.products.flatMap((p) => p.paliers)]
          .filter((p) => p.unlocked)
          .map((p) => p.name),
      );
      const unlocked = [
        ...next.allunlocks,
        ...next.products.flatMap((p) => p.paliers),
      ].filter((p) => p.unlocked && !oldUnlocks.has(p.name));
      if (unlocked.length)
        this.notify(
          "Palier atteint : " + unlocked.map((p) => p.name).join(" · "),
        );
      else if (action.kind !== "launch")
        this.notify(
          action.kind === "buy"
            ? "Renforts recrutés."
            : action.kind === "reset"
              ? "Une nouvelle ère commence."
              : action.name + " — activé.",
        );
    } catch (error) {
      if (generation !== this.epoch) return;
      this.error.set(
        message(error) +
          " Actualisez pour vérifier l’état sauvegardé avant de réessayer.",
      );
      // A lost response can follow a committed mutation: never retry automatically.
    } finally {
      if (generation === this.epoch) {
        this.locked = false;
        this.busy.set(false);
      }
    }
  }
}
