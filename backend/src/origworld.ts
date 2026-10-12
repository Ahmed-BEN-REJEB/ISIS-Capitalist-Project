import { Palier, Product, RatioType, World } from './graphql.js';

type ProductDefinition = Pick<
  Product,
  'id' | 'name' | 'logo' | 'cout' | 'croissance' | 'revenu' | 'vitesse'
>;

const palier = (
  name: string,
  logo: string,
  seuil: number,
  idcible: number,
  ratio: number,
  typeratio: RatioType,
): Palier => ({
  name,
  logo,
  seuil,
  idcible,
  ratio,
  typeratio,
  unlocked: false,
});

const productDefinitions: ProductDefinition[] = [
  {
    id: 1,
    name: 'Guerrier',
    logo: 'icones/guerrier.webp',
    cout: 4,
    croissance: 1.07,
    revenu: 1,
    vitesse: 500,
  },
  {
    id: 2,
    name: 'Archer',
    logo: 'icones/archer.svg',
    cout: 60,
    croissance: 1.1,
    revenu: 18,
    vitesse: 1_500,
  },
  {
    id: 3,
    name: 'Chevalier',
    logo: 'icones/chevalier.svg',
    cout: 500,
    croissance: 1.12,
    revenu: 120,
    vitesse: 3_000,
  },
  {
    id: 4,
    name: 'Monture blindée',
    logo: 'icones/monture.svg',
    cout: 5_000,
    croissance: 1.13,
    revenu: 950,
    vitesse: 6_000,
  },
  {
    id: 5,
    name: 'Machine de siège',
    logo: 'icones/siege.svg',
    cout: 50_000,
    croissance: 1.14,
    revenu: 7_000,
    vitesse: 10_000,
  },
  {
    id: 6,
    name: 'Forteresse mobile',
    logo: 'icones/forteresse.svg',
    cout: 500_000,
    croissance: 1.15,
    revenu: 45_000,
    vitesse: 20_000,
  },
];

const products: Product[] = productDefinitions.map((definition) => ({
  ...definition,
  quantite: definition.id === 1 ? 1 : 0,
  timeleft: 0,
  managerUnlocked: false,
  paliers: [
    palier(
      `${definition.name} : cadence renforcée`,
      definition.logo,
      20,
      definition.id,
      2,
      RatioType.vitesse,
    ),
    palier(
      `${definition.name} : équipement vétéran`,
      definition.logo,
      50,
      definition.id,
      2,
      RatioType.gain,
    ),
    palier(
      `${definition.name} : unité d'élite`,
      definition.logo,
      100,
      definition.id,
      3,
      RatioType.gain,
    ),
  ],
}));

export const origworld: World = {
  name: 'War Toy Kingdom',
  logo: 'icones/war-world.svg',
  money: 100,
  score: 0,
  totalangels: 0,
  activeangels: 0,
  angelbonus: 2,
  lastupdate: 0,
  products,
  allunlocks: [
    palier('Armée organisée', 'icones/all.svg', 25, 0, 2, RatioType.gain),
    palier(
      'Doctrine coordonnée',
      'icones/all.svg',
      50,
      0,
      2,
      RatioType.vitesse,
    ),
    palier('Puissance totale', 'icones/all.svg', 100, 0, 3, RatioType.gain),
  ],
  upgrades: [
    palier(
      'Forge du guerrier',
      'icones/upgrade.svg',
      1_000,
      1,
      3,
      RatioType.gain,
    ),
    palier(
      'Cordes renforcées',
      'icones/upgrade.svg',
      3_500,
      2,
      2,
      RatioType.vitesse,
    ),
    palier(
      'Arsenal des archers',
      'icones/upgrade.svg',
      8_000,
      2,
      3,
      RatioType.gain,
    ),
    palier('Armure royale', 'icones/upgrade.svg', 20_000, 3, 3, RatioType.gain),
    palier(
      'Écuries de campagne',
      'icones/upgrade.svg',
      45_000,
      3,
      2,
      RatioType.vitesse,
    ),
    palier(
      'Moteur de guerre',
      'icones/upgrade.svg',
      90_000,
      4,
      2,
      RatioType.vitesse,
    ),
    palier(
      'Blindage composite',
      'icones/upgrade.svg',
      150_000,
      4,
      3,
      RatioType.gain,
    ),
    palier(
      'Atelier de siège',
      'icones/upgrade.svg',
      350_000,
      5,
      3,
      RatioType.gain,
    ),
    palier(
      'Système de rechargement',
      'icones/upgrade.svg',
      650_000,
      5,
      2,
      RatioType.vitesse,
    ),
    palier(
      'Commandement suprême',
      'icones/upgrade.svg',
      1_500_000,
      0,
      2,
      RatioType.gain,
    ),
    palier(
      'Propulsion de citadelle',
      'icones/upgrade.svg',
      2_500_000,
      6,
      2,
      RatioType.vitesse,
    ),
  ],
  angelupgrades: [
    palier(
      'Bénédiction du champ de bataille',
      'icones/angel.svg',
      10,
      0,
      3,
      RatioType.gain,
    ),
    palier('Marche céleste', 'icones/angel.svg', 25, 0, 2, RatioType.vitesse),
    palier('Ferveur des anges', 'icones/angel.svg', 50, -1, 2, RatioType.ange),
  ],
  managers: [
    palier(
      'Commandant Marcus',
      'icones/manager.svg',
      100,
      1,
      0,
      RatioType.gain,
    ),
    palier(
      'Capitaine Elric',
      'icones/manager.svg',
      1_500,
      2,
      0,
      RatioType.gain,
    ),
    palier('Seigneur Kael', 'icones/manager.svg', 12_000, 3, 0, RatioType.gain),
    palier('Major Drax', 'icones/manager.svg', 90_000, 4, 0, RatioType.gain),
    palier('Général Vorn', 'icones/manager.svg', 700_000, 5, 0, RatioType.gain),
    palier(
      'Maréchal Arkon',
      'icones/manager.svg',
      5_000_000,
      6,
      0,
      RatioType.gain,
    ),
  ],
};

// Preserve legacy asset URLs while making each targeted reward identifiable.
for (const upgrade of origworld.upgrades) {
  if (upgrade.idcible > 0) {
    upgrade.logo = products.find(
      (product) => product.id === upgrade.idcible,
    )!.logo;
  }
}
const portraits = ['marcus', 'elric', 'kael', 'drax', 'vorn', 'arkon'];
origworld.managers.forEach((manager, index) => {
  manager.logo = `icones/${portraits[index]}.webp`;
});
