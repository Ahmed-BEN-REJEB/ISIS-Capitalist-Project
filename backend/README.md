# ISIS Capitalist - backend

Backend académique NestJS 12 + GraphQL (schema-first) pour un jeu incrémental sur le thème
`War Toy Kingdom`.

## Fonctionnalités

- monde complet : 6 produits, 6 managers, 18 paliers produit, 3 paliers globaux,
  11 cash upgrades et 3 angel upgrades ;
- API GraphQL avec la query `getWorld` et les 6 mutations demandées ;
- production manuelle et automatisée avec calcul du temps écoulé ;
- achats à coût géométrique, déblocage des bonus et calcul des revenus ;
- calcul des anges conforme au sujet : `floor(150 * sqrt(score / 10^15)) - totalangels` ;
- persistance JSON isolée par joueur dans `userworlds/` ;
- images servies depuis `public/icones/` et CORS activé ;
- tests unitaires et test d'intégration HTTP/GraphQL.

`lastupdate` est exposé comme un `Float` GraphQL. Un timestamp JavaScript en millisecondes
dépasse la limite signée 32 bits du scalaire GraphQL `Int`, tandis qu'un `Float` conserve la
compatibilité avec les nombres JavaScript du frontend.

## Prérequis et lancement

```bash
npm install
npm run start:dev
```

Le serveur écoute sur `http://localhost:3000`. L'interface GraphQL est disponible sous
`http://localhost:3000/graphql` et les images sous `http://localhost:3000/icones/...`.

## Vérifications

```bash
npm run lint
npm test
npm run test:e2e
npm run build
```

## Exemples GraphQL

```graphql
query GetWorld($user: String!) {
  getWorld(user: $user) {
    name
    money
    score
    totalangels
    activeangels
    angelbonus
    lastupdate
    products {
      id
      name
      cout
      revenu
      vitesse
      quantite
      timeleft
      managerUnlocked
    }
  }
}
```

Variables :

```json
{ "user": "Captain42" }
```

```graphql
mutation Acheter($user: String!, $id: Int!, $quantite: Int!) {
  acheterQtProduit(user: $user, id: $id, quantite: $quantite) {
    id
    cout
    quantite
  }
}
```

Les autres mutations du schéma sont :

- `lancerProductionProduit(user, id)` ;
- `engagerManager(user, name)` ;
- `acheterCashUpgrade(user, name)` ;
- `acheterAngelUpgrade(user, name)` ;
- `resetWorld(user)`.

Les noms de joueur acceptent les lettres Unicode, les chiffres, `.`, `_` et `-`. Cette validation
empêche qu'un nom utilisateur puisse écrire en dehors du dossier `userworlds`.
