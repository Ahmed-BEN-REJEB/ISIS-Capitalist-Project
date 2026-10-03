# War Toy Kingdom — bible visuelle

## Intention
Un royaume médiéval de pierre, de bois et de bannières. Le joueur dirige une armée et développe son économie. Le registre est noble et atmosphérique, sans violence graphique. Les illustrations sont peintes avec des matières réalistes et des silhouettes immédiatement identifiables.

## Palette et interface
Interface claire : fond parchemin `#eee3cf`, surfaces crème `#fff8e9`, bordures `#c9b493`,
texte brun `#382719`, texte secondaire `#6c5742`, accent bronze `#825626`,
rouge sombre `#863c2e`, succès vert `#42623c`. Les illustrations gardent leurs fonds
bleu nuit et leurs matières d'origine. Les états sont exprimés par du texte, pas seulement la couleur.
Pas de symboles décoratifs ni de slogans dans l'interface.

Titres avec une sérif classique (Georgia), interface avec une sans-sérif système. Chiffres tabulaires. Bordures fines bronze, angles modérément arrondis, ombres discrètes. Aucun texte intégré dans les images. Navigation clavier, focus visible, réduction des animations et fenêtres modales avec focus capturé.

## Images et export
Une génération distincte par sujet, outil image intégré. Icônes exportées à 512 × 512, WebP qualité 88. Les anciennes URL `.svg` restent disponibles via un conteneur SVG 512 × 512 embarquant l'illustration WebP : ce sont des images peintes, pas des dessins vectoriels. Le guerrier conserve son URL `.webp`. Les six nouveaux portraits ont chacun leur WebP. Une image panoramique distincte accompagne le royaume. Les bordures sont dessinées en CSS, identiques sur toutes les cartes.

## Affectation des paliers (énoncé p. 10–11)
- Produit et unlock individuel : illustration du produit.
- Manager : portrait propre au personnage et nom explicite du produit géré.
- Cash upgrade individuel : illustration du produit ciblé.
- Cash upgrade collectif : emblème de commandement royal.
- Allunlock : trois étendards, symbole de l'armée réunie.
- Angel upgrade : ailes, halo et épée sacrée ; le texte précise la cible et le type de bonus.

Les noms métier, identifiants et prix sont conservés. La monture est un cheval caparaçonné ; la forteresse mobile une tour de siège en bois. Le monde reste une fantasy médiévale, pas une simulation historique.

## Prompts
Socle : « Final premium medieval strategy game icon, painterly realistic materials, bold silhouette readable at 64px, midnight navy smoky backdrop, warm antique golden upper-left light, burgundy fabric, patinated steel and brass, centered subject, no lettering, watermark, UI or border, no modern equipment or gore. »

Sujets : guerrier à casque nasal et bouclier ; archer à arc long ; chevalier en heaume à panache ; cheval caparaçonné ; trébuchet à contrepoids ; tour de siège roulante ; blason royal couronné ; trois étendards réunis ; sceptre et épée de commandement ; ailes et halo. Portraits : Marcus (vétéran brun barbu), Elric (archer blond), Kael (noble chevalier à peau sombre), Drax (cavalier roux barbu), Vorn (ingénieur grisonnant), Arkon (maréchal aux cheveux argentés). Panorama : château à droite, vallée brumeuse au crépuscule et espace calme à gauche pour le titre.
