# Passage backend vers frontend

Ce document fige le contrat utile au démarrage du frontend. Le backend reste la source de vérité :
le client charge le monde avec `getWorld`, applique immédiatement les actions dans son interface,
puis appelle les mutations correspondantes pour synchroniser et persister la partie.

## Accès local

- API et GraphiQL : `http://localhost:3000/graphql`
- Icônes : `http://localhost:3000/icones/<fichier>`
- Exemple : `http://localhost:3000/icones/war-world.svg`

Les propriétés `logo` renvoyées par GraphQL sont relatives, par exemple
`icones/guerrier.webp`. Le frontend doit construire l'URL avec une fonction qui normalise le
slash entre l'origine du serveur et ce chemin.

## Monde War Toy Kingdom

| ID | Produit | Coût initial | Croissance | Revenu | Production | Manager | Coût manager |
|---:|---|---:|---:|---:|---:|---|---:|
| 1 | Guerrier | 4 | 7 % | 1 | 0,5 s | Commandant Marcus | 100 |
| 2 | Archer | 60 | 10 % | 18 | 1,5 s | Capitaine Elric | 1 500 |
| 3 | Chevalier | 500 | 12 % | 120 | 3 s | Seigneur Kael | 12 000 |
| 4 | Monture blindée | 5 000 | 13 % | 950 | 6 s | Major Drax | 90 000 |
| 5 | Machine de siège | 50 000 | 14 % | 7 000 | 10 s | Général Vorn | 700 000 |
| 6 | Forteresse mobile | 500 000 | 15 % | 45 000 | 20 s | Maréchal Arkon | 5 000 000 |

Chaque produit possède trois paliers : quantité 20 (`vitesse ×2`), quantité 50 (`gain ×2`) et
quantité 100 (`gain ×3`). Les paliers globaux se déclenchent lorsque tous les produits atteignent
25 (`gain ×2`), 50 (`vitesse ×2`) puis 100 (`gain ×3`). Le monde expose également 11 cash
upgrades et 3 angel upgrades directement dans la réponse GraphQL.

## Contrat GraphQL

Le frontend utilise :

- `getWorld(user)` pour charger et resynchroniser tout l'état ;
- `acheterQtProduit(user, id, quantite)` pour les achats ;
- `lancerProductionProduit(user, id)` pour une production manuelle ;
- `engagerManager(user, name)` ;
- `acheterCashUpgrade(user, name)` ;
- `acheterAngelUpgrade(user, name)` ;
- `resetWorld(user)` pour réclamer les anges et recommencer le monde.

`lastupdate` est un `Float` dans ce backend : un timestamp JavaScript en millisecondes dépasse la
plage du scalaire GraphQL `Int`. Il reste un `number` côté TypeScript et ne nécessite donc pas de
traitement particulier dans le frontend.

## Inventaire graphique initial (remplacé)

| Usage | Chemin actuel | État avant direction artistique |
|---|---|---|
| Monde | `icones/war-world.svg` | placeholder |
| Guerrier | `icones/guerrier.webp` | illustration raster existante |
| Archer | `icones/archer.svg` | placeholder |
| Chevalier | `icones/chevalier.svg` | placeholder |
| Monture blindée | `icones/monture.svg` | placeholder |
| Machine de siège | `icones/siege.svg` | placeholder |
| Forteresse mobile | `icones/forteresse.svg` | placeholder |
| Managers | `icones/manager.svg` | placeholder partagé |
| Upgrades | `icones/upgrade.svg` | placeholder partagé |
| Angel upgrades | `icones/angel.svg` | placeholder partagé |
| All unlocks | `icones/all.svg` | placeholder partagé |

Les noms et chemins sont désormais couverts par des tests. Les versions finales peuvent donc
remplacer les fichiers à chemin identique sans modifier le schéma, le monde ou les composants
frontend. La prochaine phase graphique devra définir une direction artistique médiévale cohérente,
une silhouette lisible à petite taille, des fonds et bordures homogènes, puis exporter chaque actif
dans un format et des dimensions uniformes.

## État après intégration frontend

Les placeholders ci-dessus ont été remplacés par les illustrations finales médiévales.
Les anciennes URL sont préservées ; les SVG embarquent un WebP 512 × 512.
Les managers utilisent maintenant `marcus.webp`, `elric.webp`, `kael.webp`, `drax.webp`,
`vorn.webp` et `arkon.webp`. Les cash upgrades individuels utilisent le logo du produit ciblé.
`manager.svg` reste disponible comme alias de compatibilité.

Le panorama `icones/kingdom-background.webp` est exporté en 1600 × 900.
Les six anciens rasters non référencés ont été retirés ; leurs versions précédentes restent dans Git.
La migration cosmétique des anciennes sauvegardes conserve leur progression.

Le frontend Next.js est dans `../../frontend`, sur le port 3001 par défaut.
Voir la bible visuelle et la matrice de validation dans le dossier `../../docs`.
