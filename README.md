# War Toy Kingdom

Jeu incrémental médiéval ISIS Capitalist : backend Node.js/NestJS/GraphQL et frontend Angular 22.
Node.js **22.22.3 ou plus récent compatible Angular 22**. Deux applications, deux installations npm.

## Jouer en local

Terminal 1, depuis la racine :

```powershell
cd backend
npm ci
npm run start:dev
```

Terminal 2, depuis la racine :

```powershell
cd frontend
npm ci
npm run dev
```

Ouvrir **http://localhost:3001**. API : **http://localhost:3000/graphql**.
Les images sont servies par le backend sous **/icones/**.

Un identifiant est créé au premier lancement et conservé dans le navigateur. Le bouton du
joueur, en haut à droite, permet de changer de monde et d'adresse backend. Retrouver le même
identifiant permet de reprendre la même sauvegarde. Aucune monnaie n'est conservée dans
localStorage : les données de jeu viennent du serveur.

**Limite académique importante :** il ne s'agit pas d'une authentification. Quiconque connaît
un identifiant peut ouvrir ce monde. Ne pas exposer ce prototype comme un service multijoueur
public sans authentification, contrôle d'accès, protection des requêtes et stockage adapté.

## Configuration

- Backend : `PORT` (3000 par défaut), `WORLDS_DIR` (par défaut `backend/userworlds`).
- Frontend : http://localhost:3000 par défaut, défini dans `frontend/src/lib/api.ts`.
- Le choix du serveur depuis l'interface est mémorisé avec le joueur.
- Production locale : `npm run build` puis `npm run start:prod` dans backend ;
  `npm run build` dans frontend puis servir `frontend/dist/kingdom/browser` avec un serveur HTTP.
  `npm start` lance le serveur de développement Angular ; `npm run dev` est son alias.

Les fichiers JSON des joueurs sont ignorés par Git. Les tests navigateur utilisent exclusivement
`tmp/e2e-worlds`, `tmp/e2e-alternate-worlds` et les ports 3100/3101/3102 ;
ils ne remplacent pas vos parties.

## Vérifier

Dans backend :

```powershell
npm run build
npm run lint
npm test
npm run test:e2e
```

Dans frontend :

```powershell
npm run codegen
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm audit
```

Compiler le backend avant les tests navigateur. Playwright démarre et arrête ses propres
serveurs. Les captures sont dans `artifacts/` et les traces d'échec dans
`frontend/test-results/`, tous deux ignorés par Git.

## Architecture et documents

- `frontend/src/app/graphql/queries.graphql` : opérations et fragments GraphQL.
  `npm run codegen` génère `operations.ts` avec Apollo Orbit à partir du schéma backend,
  sans serveur actif ni copie divergente du schéma.
- `frontend/src/app/graphql/graphql.provider.ts` : injection Apollo Orbit et transport HTTP.
- `frontend/src/app/game.service.ts` : signaux du monde et de la session, mutations,
  projection du score toutes les 100 ms, resynchronisation et protection contre
  les réponses tardives d'un autre joueur.
- `frontend/src/lib/engine.ts` : prix géométriques, Max, projection temporelle, anges, formats.
- `frontend/src/app/app.ts` et `app.html` : tableau de bord, fenêtres, badges calculés,
  formulaire à signaux et multiplicateur d'achat.
- `frontend/src/app/produit/` : composant produit avec entrées `input()`, prix et progression calculés.
- `frontend/src/app/pipes/` : pipes `bigvalue` et `second`.
- `frontend/src/app/modal/` : dialogue accessible, navigation clavier et restitution du focus.
- `frontend/src/styles.css` : identité visuelle et mises en page desktop/mobile.
- [Contrat backend / frontend](backend/docs/frontend-handoff.md)

Le frontend suit le TP Angular : composants standalone, injection de GameService,
`signal`, `computed`, `linkedSignal`, `input`, blocs `@if`/`@for`, formulaires à signaux,
pipes et requêtes/mutations Apollo Orbit. Les dialogues, badges et messages éphémères
utilisent le style médiéval de l'application.

Le backend fait foi pour les achats et les bonus. Le client projette les gains et le temps
restant à partir du dernier état serveur, puis se resynchronise après chaque action et
toutes les cinq secondes. Les managers et upgrades acquis restent consultables ; les
unlocks ont un filtre pour afficher tous les paliers. Les montants utilisent les millions
et milliards. Les identifiants de produit n'ont pas besoin d'être consécutifs.
