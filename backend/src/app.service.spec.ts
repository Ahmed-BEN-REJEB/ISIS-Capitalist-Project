import { beforeEach, describe, expect, it } from 'vitest';
import { existsSync, mkdtempSync, unlinkSync, rmdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { AppService } from './app.service.js';
import { RatioType, World } from './graphql.js';
import { origworld } from './origworld.js';

describe('AppService', () => {
  let service: AppService;
  let world: World;

  beforeEach(() => {
    service = new AppService();
    world = service.cloneWorld(origworld);
  });

  it('defines the complete academic world', () => {
    expect(world.products).toHaveLength(6);
    expect(world.products.every((product) => product.paliers.length >= 3)).toBe(
      true,
    );
    expect(world.allunlocks.length).toBeGreaterThanOrEqual(3);
    expect(world.upgrades.length).toBeGreaterThanOrEqual(10);
    expect(world.angelupgrades.length).toBeGreaterThan(0);
    expect(world.managers).toHaveLength(6);
  });

  it('migrates legacy illustrations without changing saved progression after a service restart', () => {
    const directory = mkdtempSync(join(tmpdir(), 'kingdom-art-test-'));
    const previous = process.env.WORLDS_DIR;
    process.env.WORLDS_DIR = directory;
    try {
      const writer = new AppService();
      const saved = writer.cloneWorld(origworld);
      saved.money = 12345;
      saved.products[0].quantite = 42;
      saved.managers[0].unlocked = true;
      saved.managers[0].logo = 'icones/manager.svg';
      saved.upgrades[0].logo = 'icones/upgrade.svg';
      writer.saveWorld('migration', saved);
      const reader = new AppService();
      const restored = reader.readUserWorld('migration');
      expect(restored.money).toBe(12345);
      expect(restored.products[0].quantite).toBe(42);
      expect(restored.managers[0].unlocked).toBe(true);
      expect(restored.managers[0].logo).toBe('icones/marcus.webp');
      expect(restored.upgrades[0].logo).toBe(restored.products[0].logo);
    } finally {
      if (previous === undefined) delete process.env.WORLDS_DIR;
      else process.env.WORLDS_DIR = previous;
      unlinkSync(join(directory, 'migration-world.json'));
      rmdirSync(directory);
    }
  });

  it('references an existing static asset for every visual element', () => {
    const logos = [
      world.logo,
      ...world.products.flatMap((product) => [
        product.logo,
        ...product.paliers.map((candidate) => candidate.logo),
      ]),
      ...world.allunlocks.map((candidate) => candidate.logo),
      ...world.upgrades.map((candidate) => candidate.logo),
      ...world.angelupgrades.map((candidate) => candidate.logo),
      ...world.managers.map((candidate) => candidate.logo),
    ];

    for (const logo of new Set(logos)) {
      expect(logo).toMatch(/^icones\/[\w.-]+$/);
      expect(existsSync(join(process.cwd(), 'public', logo)), logo).toBe(true);
    }
  });

  it('calculates a geometric purchase price and updates the next unit price', () => {
    world.money = 1_000;
    const product = world.products[0];
    const initialPrice = product.cout;
    const expectedCost =
      initialPrice * (1 + product.croissance + product.croissance ** 2);

    service.buyProduct(world, product.id, 3);

    expect(world.money).toBeCloseTo(1_000 - expectedCost);
    expect(product.quantite).toBe(4);
    expect(product.cout).toBeCloseTo(initialPrice * product.croissance ** 3);
  });

  it('rejects invalid quantities and unaffordable purchases', () => {
    expect(() => service.buyProduct(world, 1, 0)).toThrow(
      'entier strictement positif',
    );
    expect(() => service.buyProduct(world, 6, 1)).toThrow('Fonds insuffisants');
  });

  it('completes one manual production and stops it', () => {
    const product = world.products[0];
    world.lastupdate = 1_000;
    product.timeleft = 500;

    service.updateWorld(world, 1_500);

    expect(world.money).toBe(101);
    expect(world.score).toBe(1);
    expect(product.timeleft).toBe(0);
  });

  it('completes every elapsed managed production cycle', () => {
    const product = world.products[0];
    world.lastupdate = 1_000;
    product.managerUnlocked = true;
    product.timeleft = 250;

    service.updateWorld(world, 2_500);

    expect(world.money).toBe(103);
    expect(world.score).toBe(3);
    expect(product.timeleft).toBe(250);
  });

  it('unlocks product and global thresholds exactly once', () => {
    world.money = 1e12;
    const first = world.products[0];
    first.quantite = 19;
    first.timeleft = 400;
    service.buyProduct(world, first.id, 1);
    expect(first.paliers[0].unlocked).toBe(true);
    expect(first.vitesse).toBe(250);
    expect(first.timeleft).toBe(200);

    for (const product of world.products) product.quantite = 25;
    const revenueBefore = first.revenu;
    service.checkUnlocks(world, first);
    service.checkUnlocks(world, first);
    expect(world.allunlocks[0].unlocked).toBe(true);
    expect(first.revenu).toBe(revenueBefore * world.allunlocks[0].ratio);
  });

  it('hires a manager and starts automatic production', () => {
    world.money = 1_000;
    const manager = service.hireManager(world, 'Commandant Marcus');

    expect(manager.unlocked).toBe(true);
    expect(world.products[0].managerUnlocked).toBe(true);
    expect(world.products[0].timeleft).toBe(world.products[0].vitesse);
    expect(world.money).toBe(900);
  });

  it('applies cash and angel upgrades according to their ratio type', () => {
    world.money = 10_000;
    service.buyCashUpgrade(world, 'Forge du guerrier');
    expect(world.products[0].revenu).toBe(3);

    world.activeangels = 100;
    const angelUpgrade = world.angelupgrades.find(
      (upgrade) => upgrade.typeratio === RatioType.ange,
    );
    expect(angelUpgrade).toBeDefined();
    service.buyAngelUpgrade(world, angelUpgrade!.name);
    expect(world.activeangels).toBe(50);
    expect(world.angelbonus).toBe(4);
  });

  it('uses the angel formula from the project specification', () => {
    world.score = 1e15;
    world.totalangels = 20;
    expect(service.calculateAngelsGained(world)).toBe(130);
  });

  it('resets progress while preserving score and claimed angels', () => {
    world.score = 1e15;
    world.totalangels = 20;
    world.activeangels = 12;
    world.money = 999_999;

    const reset = service.resetWorld(world, 42);

    expect(reset.money).toBe(origworld.money);
    expect(reset.score).toBe(1e15);
    expect(reset.totalangels).toBe(150);
    expect(reset.activeangels).toBe(142);
    expect(reset.lastupdate).toBe(42);
  });

  it('prevents user names from escaping the persistence directory', () => {
    expect(() => service.readUserWorld('../outside')).toThrow(
      'nom utilisateur',
    );
  });
});
