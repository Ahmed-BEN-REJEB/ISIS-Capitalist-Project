import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";
import { GameService } from "../game.service";
import { BigvaluePipe } from "../pipes/bigvalue-pipe";
import { SecondPipe } from "../pipes/second-pipe";
import {
  cost,
  gain,
  maxBuy,
  type BuyMode,
  type Product,
} from "../../lib/engine";
import { asset } from "../../lib/api";

@Component({
  selector: "app-produit",
  imports: [BigvaluePipe, SecondPipe],
  templateUrl: "./produit.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: "display: contents" },
})
export class Produit {
  readonly gameService = inject(GameService);
  readonly prod = input.required<Product>();
  readonly qtmulti = input.required<BuyMode>();
  readonly maxCanBuy = computed(() =>
    maxBuy(this.prod(), this.gameService.world()?.money ?? 0),
  );
  readonly numberToBuy = computed(() =>
    this.qtmulti() === "Max" ? this.maxCanBuy() : (this.qtmulti() as number),
  );
  readonly price = computed(() => cost(this.prod(), this.numberToBuy()));
  readonly running = computed(() => this.prod().timeleft > 0);
  readonly progress = computed(() =>
    this.running()
      ? Math.max(
          0,
          Math.min(100, (1 - this.prod().timeleft / this.prod().vitesse) * 100),
        )
      : 0,
  );
  readonly income = computed(() => {
    const world = this.gameService.world();
    return world ? gain(world, this.prod()) : 0;
  });
  readonly next = computed(() => this.prod().paliers.find((p) => !p.unlocked));
  readonly canBuy = computed(
    () =>
      !this.gameService.disabled() &&
      this.numberToBuy() > 0 &&
      Number.isFinite(this.price()) &&
      (this.gameService.world()?.money ?? 0) >= this.price(),
  );
  readonly asset = asset;
  readonly round = Math.round;
  readonly min = Math.min;
  startFabrication() {
    void this.gameService.startProduction(this.prod());
  }
  buy() {
    void this.gameService.buyProduct(this.numberToBuy(), this.prod());
  }
}
