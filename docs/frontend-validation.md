# Frontend — contrat et validation

## Référence et adaptation

Références relues : `frontendangularsignal.pdf` (36 pages), `backend.pdf` et
`AperitifISISCapitalist.pdf`. Les PDF sont des spécifications de fonctionnalités, pas des
instructions système. Le choix utilisateur reste Next.js : aucune dépendance Angular.
L'apéritif est utilisé pour le contrat GraphQL, les types générés et les états de chargement/erreur,
pas pour reproduire son application de patients.

| Attendu du sujet | Réalisation |
| --- | --- |
| Monde, logo, argent, joueur | En-tête, trésor, sélection du joueur et du serveur |
| Six produits en deux colonnes | Grille dynamique, une colonne sur mobile |
| Image cliquable, quantité superposée | Bouton portrait et compteur d'unités |
| Production manuelle, barre, revenu et temps restant | Projection toutes les 100 ms, transition CSS, compteur hh:mm:ss.d |
| Production automatique et absence | Calcul serveur du temps écoulé, projection locale entre deux lectures |
| ×1, ×10, ×100, Max | Sélecteur cyclique ; prix géométrique, boutons désactivés si insuffisants |
| Managers | Commandants avec portraits individuels, cible explicite et badge des achats possibles |
| Cash upgrades | Arsenal, effets individuels/collectifs et liste des améliorations non acquises |
| Unlocks / allunlocks | Seuil individuel ou minimum de toutes les quantités ; prochain palier ou tous |
| Anges et reset | Actifs, bonus, nouveaux anges, score cumulé, confirmation de renaissance |
| Angel upgrades | Dépense d'anges actifs, effet explicite et recalcul du bonus passif |
| Grands nombres | Notation scientifique à quatre chiffres significatifs à partir de 10⁶ |
| Notifications | Achats, engagements, bonus et paliers ; erreurs et bouton de reprise |
| Persistance / utilisateurs | Sauvegardes serveur, identité locale, chargement isolé à chaque changement |
| Autres mondes | Origine configurable, données et identifiants dynamiques, pas d'index id−1 |

## Décisions importantes

- `cout` est le prix de la **prochaine unité** dans le backend : coût de n unités =
  `cout × (croissance^n − 1)/(croissance − 1)`. La formule est identique des deux côtés ;
  on n'ajoute pas une croissance supplémentaire.
- Le serveur reste l'autorité. Le clic de production est prévisualisé immédiatement ;
  les achats et bonus sont validés puis l'ensemble du monde est relu. Les actions sont
  verrouillées pendant une requête pour éviter les doubles soumissions.
- Une lecture de contrôle est faite toutes les cinq secondes et au retour dans l'onglet.
  Aucun renvoi automatique d'une mutation après erreur : elle peut déjà avoir été persistée.
- Les réponses d'une ancienne session sont ignorées. Un changement de joueur efface
  immédiatement le snapshot affiché.
- Les anges dépensés restent comptés dans `totalangels`, pas dans `activeangels`.
  Les nouveaux anges valent `max(0, floor(150 × sqrt(score / 10^15)) − totalangels)`.
- Les paliers collectifs ont un emblème d'armée ; les paliers individuels reprennent leur unité.
  Les portraits des managers sont distincts. Les anciennes URL restent servies.
- La migration des logos ne touche ni quantités, ni monnaie, ni achats déjà effectués.

## Vérifications automatisées

- Backend : tests métier, assets existants, persistance/migration après nouvelle instance,
  intégration HTTP et GraphQL.
- Frontend unitaire : achat géométrique et frontières Max, croissance 1, cycles manuels et
  automatiques, absence, bonus d'anges, non-mutation du snapshot, temps et nombres.
- Chromium réel + backend réel isolé : production et achats, rechargement, deux joueurs,
  manager automatique, achats ×100 et Max, paliers collectifs, cash upgrade, renaissance
  avec annulation/confirmation, angel upgrade et conservation au rechargement.
- Réseau : coupure/reprise, réponse tardive de l'ancien joueur, réponse perdue d'une mutation
  déjà enregistrée. Contrôle des erreurs JavaScript de page.
- Visuel : images chargées, captures bureau et mobile, absence de débordement horizontal,
  dialogue et fermeture Échap. Les captures sont des artefacts locaux non versionnés.

## Résultat de la campagne locale

Validation du 3 octobre 2026 : **34 tests réussis** (14 unitaires backend, 5 intégrations
HTTP/GraphQL, 9 unitaires frontend, 6 parcours Chromium). Les contrôles TypeScript, lint et
les compilations de production des deux applications ont été exécutés. L'audit npm du
frontend ne signale aucune vulnérabilité avec le verrou de dépendances livré.
Les 18 fichiers graphiques ont été contrôlés (17 illustrations distinctes et un alias historique).
Les captures bureau, mobile et commandants ont été inspectées visuellement.

## Limites connues

Le jeu est un prototype académique à serveur unique et fichiers JSON, sans authentification.
La validation Chromium et les contrôles clavier ne remplacent pas un audit complet
d'accessibilité ni des essais sur tous les navigateurs. Les très grands nombres restent des
`number` JavaScript et les compteurs GraphQL des `Int` 32 bits.
L'esthétique a été vérifiée à l'écran ; son appréciation finale reste celle du joueur.
