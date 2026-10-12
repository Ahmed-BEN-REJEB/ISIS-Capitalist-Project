import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { Palier, Product, RatioType, World } from './graphql.js';
import { origworld } from './origworld.js';

@Injectable()
export class AppService {
  private readonly worldsDir =
    process.env.WORLDS_DIR || path.join(process.cwd(), 'userworlds');

  constructor() {
    fs.mkdirSync(this.worldsDir, { recursive: true });
  }

  getHello(): string {
    return 'Hello World!';
  }

  cloneWorld(world: World): World {
    return structuredClone(world);
  }

  readUserWorld(user: string): World {
    const filePath = this.userWorldPath(user);
    if (!fs.existsSync(filePath)) {
      return this.cloneWorld(origworld);
    }
    const world: unknown = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const saved = this.assertWorld(world);
    // Cosmetic migration only: never reset a player's progression.
    for (const group of ['managers', 'upgrades'] as const) {
      for (const item of saved[group]) {
        const current = origworld[group].find(
          (entry) => entry.name === item.name,
        );
        if (
          current &&
          ['icones/manager.svg', 'icones/upgrade.svg'].includes(item.logo)
        ) {
          item.logo = current.logo;
        }
      }
    }
    return saved;
  }

  saveWorld(user: string, world: World): void {
    fs.writeFileSync(
      this.userWorldPath(user),
      JSON.stringify(world, null, 2),
      'utf8',
    );
  }

  updateWorld(world: World, now = Date.now()): World {
    if (!world.lastupdate || world.lastupdate <= 0) {
      world.lastupdate = now;
      return world;
    }

    const elapsed = Math.max(0, now - world.lastupdate);
    if (elapsed === 0) return world;

    for (const product of world.products) {
      if (product.quantite <= 0) {
        product.timeleft = 0;
      } else if (product.managerUnlocked) {
        this.updateManagedProduct(world, product, elapsed);
      } else {
        this.updateManualProduct(world, product, elapsed);
      }
    }
    world.lastupdate = now;
    return world;
  }

  getProductionGain(world: World, product: Product): number {
    return (
      product.quantite *
      product.revenu *
      (1 + (world.activeangels * world.angelbonus) / 100)
    );
  }

  calculatePurchaseCost(product: Product, quantity: number): number {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error(
        'La quantité à acheter doit être un entier strictement positif.',
      );
    }
    if (product.croissance === 1) return product.cout * quantity;
    return (
      (product.cout * (Math.pow(product.croissance, quantity) - 1)) /
      (product.croissance - 1)
    );
  }

  buyProduct(world: World, id: number, quantity: number): Product {
    const product = this.getProduct(world, id);
    const totalCost = this.calculatePurchaseCost(product, quantity);
    this.assertAffordable(world.money, totalCost, 'cet achat');
    world.money -= totalCost;
    product.quantite += quantity;
    product.cout *= Math.pow(product.croissance, quantity);
    this.checkUnlocks(world, product);
    return product;
  }

  launchProduction(world: World, id: number): Product {
    const product = this.getProduct(world, id);
    if (product.quantite <= 0) {
      throw new Error(
        `Vous ne possédez aucun exemplaire de '${product.name}'.`,
      );
    }
    if (product.timeleft <= 0) {
      product.timeleft = product.vitesse;
    } else if (!product.managerUnlocked) {
      throw new Error(`La production de '${product.name}' est déjà en cours.`);
    }
    return product;
  }

  hireManager(world: World, name: string): Palier {
    const manager = this.findByName(world.managers, name, 'manager');
    if (manager.unlocked) return manager;
    this.assertAffordable(
      world.money,
      manager.seuil,
      `engager '${manager.name}'`,
    );
    const product = this.getProduct(world, manager.idcible);
    world.money -= manager.seuil;
    manager.unlocked = true;
    product.managerUnlocked = true;
    if (product.quantite > 0 && product.timeleft <= 0)
      product.timeleft = product.vitesse;
    return manager;
  }

  buyCashUpgrade(world: World, name: string): Palier {
    const upgrade = this.findByName(world.upgrades, name, 'upgrade');
    if (upgrade.unlocked) return upgrade;
    this.assertAffordable(
      world.money,
      upgrade.seuil,
      `acheter '${upgrade.name}'`,
    );
    world.money -= upgrade.seuil;
    upgrade.unlocked = true;
    this.applyBonus(world, upgrade);
    return upgrade;
  }

  buyAngelUpgrade(world: World, name: string): Palier {
    const upgrade = this.findByName(world.angelupgrades, name, 'angel upgrade');
    if (upgrade.unlocked) return upgrade;
    if (world.activeangels < upgrade.seuil) {
      throw new Error(
        `Anges insuffisants pour acheter '${upgrade.name}' : coût ${upgrade.seuil}.`,
      );
    }
    world.activeangels -= Math.trunc(upgrade.seuil);
    upgrade.unlocked = true;
    this.applyBonus(world, upgrade);
    return upgrade;
  }

  checkUnlocks(world: World, purchasedProduct: Product): void {
    this.unlockReachedPaliers(
      world,
      purchasedProduct.paliers,
      (candidate) => purchasedProduct.quantite >= candidate.seuil,
    );
    this.unlockReachedPaliers(world, world.allunlocks, (candidate) =>
      world.products.every((product) => product.quantite >= candidate.seuil),
    );
  }

  applyBonus(world: World, palier: Palier): void {
    if (palier.ratio <= 0)
      throw new Error(`Ratio invalide pour le bonus '${palier.name}'.`);
    if (palier.typeratio === RatioType.ange) {
      world.angelbonus += palier.ratio;
      return;
    }

    const targets =
      palier.idcible === 0
        ? world.products
        : world.products.filter((product) => product.id === palier.idcible);
    if (targets.length === 0) {
      throw new Error(
        `Cible ${palier.idcible} introuvable pour le bonus '${palier.name}'.`,
      );
    }
    for (const product of targets) {
      if (palier.typeratio === RatioType.gain) {
        product.revenu *= palier.ratio;
      } else {
        product.vitesse = Math.max(
          1,
          Math.floor(product.vitesse / palier.ratio),
        );
        if (product.timeleft > 0) {
          product.timeleft = Math.max(
            1,
            Math.ceil(product.timeleft / palier.ratio),
          );
        }
      }
    }
  }

  calculateAngelsGained(world: World): number {
    const fromScore = Math.floor(
      150 * Math.sqrt(Math.max(0, world.score) / 1e15),
    );
    return Math.max(0, fromScore - world.totalangels);
  }

  resetWorld(world: World, now = Date.now()): World {
    const gained = this.calculateAngelsGained(world);
    const reset = this.cloneWorld(origworld);
    reset.score = world.score;
    reset.totalangels = world.totalangels + gained;
    reset.activeangels = world.activeangels + gained;
    reset.lastupdate = now;
    return reset;
  }

  private updateManualProduct(
    world: World,
    product: Product,
    elapsed: number,
  ): void {
    if (product.timeleft <= 0) return;
    if (elapsed >= product.timeleft) {
      this.addProductionGain(world, product, 1);
      product.timeleft = 0;
    } else {
      product.timeleft -= elapsed;
    }
  }

  private updateManagedProduct(
    world: World,
    product: Product,
    elapsed: number,
  ): void {
    const duration = Math.max(1, product.vitesse);
    const firstRemaining = product.timeleft > 0 ? product.timeleft : duration;
    if (elapsed < firstRemaining) {
      product.timeleft = firstRemaining - elapsed;
      return;
    }
    const afterFirst = elapsed - firstRemaining;
    const cycles = 1 + Math.floor(afterFirst / duration);
    const remainder = afterFirst % duration;
    this.addProductionGain(world, product, cycles);
    product.timeleft = remainder === 0 ? duration : duration - remainder;
  }

  private addProductionGain(
    world: World,
    product: Product,
    cycles: number,
  ): void {
    const gain = this.getProductionGain(world, product) * cycles;
    world.money += gain;
    world.score += gain;
  }

  private unlockReachedPaliers(
    world: World,
    paliers: Palier[],
    reached: (candidate: Palier) => boolean,
  ): void {
    for (const candidate of paliers) {
      if (!candidate.unlocked && reached(candidate)) {
        candidate.unlocked = true;
        this.applyBonus(world, candidate);
      }
    }
  }

  private getProduct(world: World, id: number): Product {
    const product = world.products.find((candidate) => candidate.id === id);
    if (!product) throw new Error(`Le produit avec l'id ${id} n'existe pas`);
    return product;
  }

  private findByName(items: Palier[], name: string, kind: string): Palier {
    const item = items.find((candidate) => candidate.name === name);
    if (!item) throw new Error(`Le ${kind} '${name}' n'existe pas`);
    return item;
  }

  private assertAffordable(
    available: number,
    cost: number,
    action: string,
  ): void {
    if (available + Number.EPSILON < cost) {
      throw new Error(
        `Fonds insuffisants pour ${action} : coût ${cost.toFixed(2)}, disponible ${available.toFixed(2)}.`,
      );
    }
  }

  private userWorldPath(user: string): string {
    const trimmed = user.trim();
    if (!/^[\p{L}\p{N}._-]+$/u.test(trimmed)) {
      throw new Error(
        'Le nom utilisateur doit contenir uniquement des lettres, chiffres, points, tirets ou underscores.',
      );
    }
    return path.join(this.worldsDir, `${trimmed}-world.json`);
  }

  private assertWorld(value: unknown): World {
    if (
      typeof value !== 'object' ||
      value === null ||
      !Array.isArray((value as Partial<World>).products)
    ) {
      throw new Error('Le fichier du monde utilisateur est invalide.');
    }
    return value as World;
  }
}
