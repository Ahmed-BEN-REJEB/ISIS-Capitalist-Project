import { describe, expect, it } from "vitest";
import {
  angelsGained,
  cost,
  duration,
  gain,
  maxBuy,
  number,
  projectWorld,
  type World,
} from "./engine";
const world = (): World => ({
  name: "Test",
  logo: "",
  money: 100,
  score: 0,
  totalangels: 0,
  activeangels: 0,
  angelbonus: 2,
  lastupdate: 0,
  managers: [],
  upgrades: [],
  angelupgrades: [],
  allunlocks: [],
  products: [
    {
      id: 42,
      name: "Guerrier",
      logo: "",
      cout: 4,
      croissance: 1.07,
      revenu: 2,
      vitesse: 500,
      quantite: 3,
      timeleft: 500,
      managerUnlocked: false,
      paliers: [],
    },
  ],
});
describe("projection locale du contrat backend", () => {
  it("ne crédite le manuel qu’une fois, sans modifier le snapshot", () => {
    const source = world(),
      result = projectWorld(source, 5500);
    expect(result.money).toBe(106);
    expect(result.score).toBe(6);
    expect(result.products[0].timeleft).toBe(0);
    expect(source.money).toBe(100);
  });
  it("calcule tous les cycles automatiques et leur reste", () => {
    const source = world();
    source.products[0].managerUnlocked = true;
    const result = projectWorld(source, 1750);
    expect(result.money).toBe(118);
    expect(result.products[0].timeleft).toBe(250);
  });
  it("redémarre exactement à une frontière de cycle", () => {
    const source = world();
    source.products[0].managerUnlocked = true;
    expect(projectWorld(source, 1000).products[0].timeleft).toBe(500);
  });
  it("ne produit pas avec zéro unité et ne remonte pas le temps", () => {
    const source = world();
    source.products[0].quantite = 0;
    expect(projectWorld(source, 10000).money).toBe(100);
    expect(projectWorld(world(), -1000).products[0].timeleft).toBe(500);
  });
  it("applique les anges actifs et non les anges dépensés", () => {
    const source = world();
    source.activeangels = 10;
    source.totalangels = 50;
    expect(gain(source, source.products[0])).toBeCloseTo(7.2);
  });
  it("achète à partir du prochain prix et corrige le max aux frontières", () => {
    const p = world().products[0];
    for (let n = 1; n < 200; n++) {
      expect(maxBuy(p, cost(p, n))).toBe(n);
      expect(maxBuy(p, cost(p, n) * 0.999999)).toBe(n - 1);
    }
    expect(cost(p, 1)).toBeCloseTo(4);
    expect(maxBuy(p, 3)).toBe(0);
  });
  it("supporte un monde à coût constant", () => {
    const p = world().products[0];
    p.croissance = 1;
    expect(cost(p, 10)).toBe(40);
    expect(maxBuy(p, 99)).toBe(24);
  });
  it("calcule les nouveaux anges en soustrayant tous les anges déjà obtenus", () => {
    const w = world();
    w.score = 1e15;
    w.totalangels = 50;
    expect(angelsGained(w)).toBe(100);
    w.score = 0;
    expect(angelsGained(w)).toBe(0);
  });
  it("formate les valeurs et la durée à la dixième", () => {
    expect(number(45000)).toContain("45");
    expect(number(1000000)).toBe("1 million");
    expect(number(776000000)).toBe("776 millions");
    expect(number(1500000000)).toBe("1,5 milliard");
    expect(number(2500000000)).toBe("2,5 milliards");
    expect(number(1e12)).toBe("1 billion");
    expect(duration(3661500)).toBe("01:01:01.5");
    expect(duration(-10)).toBe("00:00:00.0");
  });
});
