import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
const api = "http://localhost:3100/graphql";
const runtimeErrors = new WeakMap<Page, string[]>();
test.beforeEach(({ page }) => {
  const errors: string[] = [];
  runtimeErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
});
test.afterEach(({ page }) => {
  expect(runtimeErrors.get(page)).toEqual([]);
});
async function query(query: string) {
  const response = await fetch(api, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  return response.json();
}
async function select(page: Page, user: string, firstId = 1) {
  await page.addInitScript((user) => {
    if (!localStorage.getItem("kingdom-session"))
      localStorage.setItem(
        "kingdom-session",
        JSON.stringify({ user, origin: "http://localhost:3100" }),
      );
  }, user);
  await page.goto("/");
  await expect(page.getByTestId("product-" + firstId)).toBeVisible();
}
async function seed(user: string) {
  await query('{getWorld(user:"' + user + '"){name}}');
  const file = path.resolve("../tmp/e2e-worlds", user + "-world.json");
  const world = JSON.parse(await fs.readFile(file, "utf8"));
  world.money = 1e9;
  world.score = 1e15;
  await fs.writeFile(file, JSON.stringify(world));
}
test("production, achats, managers, persistance et isolation de deux joueurs", async ({
  page,
}) => {
  const user = "play-" + Date.now();
  await select(page, user);
  const warrior = page.getByTestId("product-1");
  await warrior.getByRole("button", { name: "Lancer la production" }).click();
  await expect(page.getByTestId("money")).toHaveText("101 or");
  await warrior.getByRole("button", { name: /Recruter/ }).click();
  await expect(warrior.locator(".quantity")).toHaveText("× 2");
  await page.reload();
  await expect(warrior.locator(".quantity")).toHaveText("× 2");
  await page.getByRole("button", { name: user }).click();
  await page.getByLabel("Identifiant du joueur").fill(user + "-second");
  await page.getByRole("button", { name: "Entrer dans ce royaume" }).click();
  await expect(warrior.locator(".quantity")).toHaveText("× 1");
  await expect(page.getByTestId("money")).toHaveText("100 or");
  await page.getByRole("button", { name: /Managers/ }).click();
  await page
    .getByRole("button", { name: "Engager 100 or", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Commandant Marcus", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Fermer" }).click();
  await expect(warrior.locator(".status")).toHaveText("AUTO");
  const savedMoney = await query(
    '{getWorld(user:"' + user + '-second"){money}}',
  );
  await page.waitForTimeout(1200);
  await page.reload();
  await expect(warrior.locator(".status")).toHaveText("AUTO");
  const resumedMoney = await query(
    '{getWorld(user:"' + user + '-second"){money}}',
  );
  expect(resumedMoney.data.getWorld.money).toBeGreaterThan(
    savedMoney.data.getWorld.money,
  );
  const response = await query(
    '{getWorld(user:"' + user + '"){products{id quantite managerUnlocked}}}',
  );
  expect(response.data.getWorld.products[0].quantite).toBe(2);
  expect(response.data.getWorld.products[0].managerUnlocked).toBe(false);
});
test("bonus individuels et collectifs, achats Max, anges et renaissance", async ({
  page,
}) => {
  const user = "advanced-" + Date.now();
  await seed(user);
  await select(page, user);
  const multiplier = page.getByRole("button", { name: "Quantité d’achat" });
  await multiplier.click();
  await multiplier.click(); // x100
  for (let id = 1; id <= 6; id++) {
    const card = page.getByTestId("product-" + id);
    // Later units are too expensive at x100; switch to x10 and buy three times below.
    if (id === 3) break;
    await card.getByRole("button", { name: /Recruter/ }).click();
    await expect(card.locator(".quantity")).toHaveText(
      id === 1 ? "× 101" : "× 100",
    );
  }
  await multiplier.click(); // Max
  await expect(multiplier).toContainText("Max");
  await multiplier.click();
  await multiplier.click(); // x10
  for (let id = 3; id <= 6; id++) {
    const card = page.getByTestId("product-" + id);
    for (let n = 1; n <= 3; n++) {
      await card.getByRole("button", { name: /Recruter/ }).click();
      await expect(card.locator(".quantity")).toHaveText("× " + n * 10);
    }
  }
  await page.getByRole("button", { name: /Unlocks/ }).click();
  await page.getByLabel("Afficher tous les paliers").check();
  await expect(
    page
      .getByRole("heading", { name: "Armée organisée", exact: true })
      .locator(".."),
  ).toContainText("Acquis");
  await page.getByRole("button", { name: "Fermer" }).click();
  await page.getByRole("button", { name: /Upgrades/ }).click();
  await page
    .getByRole("button", { name: "Acquérir 1 000 or", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Forge du guerrier" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Fermer" }).click();
  await page.getByRole("button", { name: /Investors/ }).click();
  await page.getByRole("button", { name: /Reset du monde/ }).click();
  await page.getByRole("button", { name: "Annuler", exact: true }).click();
  await page.getByRole("button", { name: /Reset du monde/ }).click();
  await page.getByRole("button", { name: "Confirmer le reset" }).click();
  await expect(page.locator(".angel-stats").first()).toContainText("150");
  await page.getByRole("button", { name: "Fermer" }).click();
  await expect(page.getByTestId("product-1").locator(".quantity")).toHaveText(
    "× 1",
  );
  await page.getByRole("button", { name: /Upgrades/ }).click();
  await page.getByRole("button", { name: /Bénédictions/ }).click();
  await page
    .getByRole("button", { name: "Acquérir 10 anges", exact: true })
    .click();
  await expect(page.locator(".modal-balance")).toContainText("140");
  await page.reload();
  await expect(page.locator(".resource-button")).toContainText("140");
});
test("responsive, images, clavier et erreurs réseau", async ({ page }) => {
  await select(page, "visual-" + Date.now());
  await expect(page.locator("img")).not.toHaveCount(0);
  await expect
    .poll(() =>
      page
        .locator("img")
        .evaluateAll((imgs) =>
          imgs.every(
            (img) =>
              (img as HTMLImageElement).complete &&
              (img as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
  await page.screenshot({
    path: "../artifacts/kingdom-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: /Managers/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.screenshot({
    path: "../artifacts/kingdom-managers.png",
    fullPage: true,
  });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "../artifacts/kingdom-mobile.png",
    fullPage: true,
  });
  await page.route("**/graphql", (route) => route.abort());
  await page.getByRole("button", { name: "Actualiser le monde" }).click();
  await expect(page.locator(".error-banner")).toBeVisible();
  await expect(
    page.getByTestId("product-1").getByRole("button", { name: /Recruter/ }),
  ).toBeDisabled();
  await page.unroute("**/graphql");
  await page.getByRole("button", { name: "Réessayer" }).click();
  await expect(page.locator(".error-banner")).toHaveCount(0);
});

test("une réponse de l’ancien joueur ne remplace jamais le nouveau monde", async ({
  page,
}) => {
  const user = "race-" + Date.now();
  await select(page, user);
  await page.route("**/graphql", async (route) => {
    const payload = route.request().postDataJSON();
    const response = await route.fetch();
    if (payload.variables.user === user)
      await new Promise((resolve) => setTimeout(resolve, 1800));
    await route.fulfill({ response });
  });
  await page.getByRole("button", { name: "Actualiser le monde" }).click();
  await page.getByRole("button", { name: user, exact: false }).click();
  await page.getByLabel("Identifiant du joueur").fill(user + "-new");
  await page.getByRole("button", { name: "Entrer dans ce royaume" }).click();
  await expect(page.getByTestId("product-1")).toBeVisible();
  await page
    .getByTestId("product-1")
    .getByRole("button", { name: /Recruter/ })
    .click();
  await expect(page.getByTestId("product-1").locator(".quantity")).toHaveText(
    "× 2",
  );
  await page.waitForTimeout(2000);
  await expect(page.getByTestId("product-1").locator(".quantity")).toHaveText(
    "× 2",
  );
  await expect(page.locator(".account-button")).toContainText(user + "-new");
});

test("achat Max réel et fonctionnement avec des identifiants de produits non consécutifs", async ({
  page,
}) => {
  const user = "custom-" + Date.now();
  await seed(user);
  const file = path.resolve("../tmp/e2e-worlds", user + "-world.json");
  const world = JSON.parse(await fs.readFile(file, "utf8"));
  world.products[0].id = 42;
  world.products[0].paliers.forEach(
    (p: { idcible: number }) => (p.idcible = 42),
  );
  world.managers[0].idcible = 42;
  await fs.writeFile(file, JSON.stringify(world));
  await select(page, user, 42);
  const multiplier = page.getByRole("button", { name: "Quantité d’achat" });
  await multiplier.click();
  await multiplier.click();
  await multiplier.click();
  const button = page
    .getByTestId("product-42")
    .getByRole("button", { name: /Recruter/ });
  const count = Number((await button.innerText()).match(/×(\d+)/)![1]);
  expect(count).toBeGreaterThan(100);
  await button.click();
  await expect(page.getByTestId("product-42").locator(".quantity")).toHaveText(
    "× " + (count + 1),
  );
  await expect(button).toContainText("×0");
});

test("une réponse de mutation perdue ne provoque pas un achat en double", async ({
  page,
}) => {
  await select(page, "lost-" + Date.now());
  let purchases = 0;
  await page.route("**/graphql", async (route) => {
    if (route.request().postDataJSON().query.includes("mutation Buy")) {
      purchases++;
      await route.fetch(); // Server commits, but the client never receives the response.
      await route.abort();
    } else await route.continue();
  });
  await page
    .getByTestId("product-1")
    .getByRole("button", { name: /Recruter/ })
    .click();
  await expect(page.locator(".error-banner")).toBeVisible();
  await page.getByRole("button", { name: "Réessayer" }).click();
  await expect(page.getByTestId("product-1").locator(".quantity")).toHaveText(
    "× 2",
  );
  expect(purchases).toBe(1);
});
test("reset sans nouvel ange : annulation puis confirmation, sauvegarde et interface simplifiée", async ({
  page,
}) => {
  const user = "zero-reset-" + Date.now();
  await select(page, user);
  await page
    .getByTestId("product-1")
    .getByRole("button", { name: /Recruter/ })
    .click();
  await expect(page.getByTestId("product-1").locator(".quantity")).toHaveText(
    "× 2",
  );
  await page.getByRole("button", { name: "Investors", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Investors" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Reset du monde" }),
  ).toBeEnabled();
  await page.screenshot({ path: "../artifacts/investors-light.png" });
  await page.getByRole("button", { name: "Reset du monde" }).click();
  await expect(page.locator(".reset-confirm")).toContainText("0 anges");
  await page.getByRole("button", { name: "Annuler", exact: true }).click();
  await page.getByRole("button", { name: "Fermer", exact: true }).click();
  await expect(page.getByTestId("product-1").locator(".quantity")).toHaveText(
    "× 2",
  );
  await page.getByRole("button", { name: "Investors", exact: true }).click();
  await page.getByRole("button", { name: "Reset du monde" }).click();
  await page.getByRole("button", { name: "Confirmer le reset" }).click();
  await expect(page.getByTestId("product-1").locator(".quantity")).toHaveText(
    "× 1",
  );
  await page.reload();
  await expect(page.getByTestId("money")).toHaveText("100 or");
  const labels = await page.locator(".sidebar .nav-item").allTextContents();
  expect(
    labels.map((label) =>
      label
        .trim()
        .replace(/[0-9]+$/, "")
        .trim(),
    ),
  ).toEqual(["Royaume", "Unlocks", "Upgrades", "Managers", "Investors"]);
  await expect(page.locator("body")).not.toContainText(
    "Chaque grande conquête",
  );
});
test("montants lisibles et regroupement des upgrades", async ({ page }) => {
  const user = "readable-" + Date.now();
  await seed(user);
  await select(page, user);
  await expect(page.getByTestId("money")).toContainText("milliard");
  await page.getByRole("button", { name: /Upgrades/ }).click();
  await expect(page.getByRole("button", { name: /Arsenal/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.getByRole("button", { name: /Bénédictions/ }).click();
  await expect(
    page.getByRole("heading", { name: "Ferveur des anges" }),
  ).toBeVisible();
  await page.screenshot({ path: "../artifacts/upgrades-light.png" });
});
