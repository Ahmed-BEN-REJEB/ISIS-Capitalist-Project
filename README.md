# War Toy Kingdom

Jeu incrémental médiéval ISIS Capitalist : backend NestJS/GraphQL et frontend Next.js/React.
Node.js **22.22 ou plus récent** recommandé. Deux applications, deux installations npm.

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
Les images sont servies par le backend sous **/icones/**, pas par Next.js.

Un identifiant est créé au premier lancement et conservé dans le navigateur. Le bouton du
joueur, en haut à droite, permet de changer de monde et d'adresse backend. Retrouver le même
identifiant permet de reprendre la même sauvegarde. Aucune monnaie n'est conservée dans
localStorage : les données de jeu viennent du serveur.

**Limite académique importante :** il ne s'agit pas d'une authentification. Quiconque connaît
un identifiant peut ouvrir ce monde. Ne pas exposer ce prototype comme un service multijoueur
public sans authentification, contrôle d'accès, protection des requêtes et stockage adapté.

## Configuration

- Backend : `PORT` (3000 par défaut), `WORLDS_DIR` (par défaut `backend/userworlds`).
- Frontend : `NEXT_PUBLIC_BACKEND_URL` (http://localhost:3000 par défaut).
  Exemple dans `frontend/.env.example` ; une valeur de build nécessite une nouvelle compilation.
- Le choix du serveur depuis l'interface est mémorisé avec le joueur.
- Production locale : `npm run build` puis `npm run start:prod` dans backend ;
  `npm run build` puis `npm start` dans frontend.

Les fichiers JSON des joueurs sont ignorés par Git. Les tests navigateur utilisent exclusivement
`tmp/e2e-worlds` et les ports 3100/3101 ; ils ne remplacent pas vos parties.

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

- `frontend/src/lib/operations.graphql` : opérations, fragments et types générés depuis
  le schéma backend ; `npm run codegen` régénère `generated.ts` sans serveur actif.
- `frontend/src/lib/use-game.ts` : session, mutations, resynchronisation et protection contre
  les réponses tardives d'un autre joueur.
- `frontend/src/lib/engine.ts` : prix géométriques, Max, projection temporelle, anges, formats.
- `frontend/src/components/` : tableau de bord, carte produit et dialogue accessible.
- [Direction artistique](docs/art-direction.md)
- [Couverture fonctionnelle et validation](docs/frontend-validation.md)
- [Contrat backend / frontend](backend/docs/frontend-handoff.md)

Le sujet pédagogique emploie Angular ; les comportements demandés sont transposés en
**Next.js**, conformément au choix technologique du projet. Les signaux deviennent des
états/hooks React, les services un client GraphQL typé, les pipes des fonctions pures.
