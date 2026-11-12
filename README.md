# SNUG

Prenez une photo d'un espace, dessinez et mesurez les zones, dites ce qu'il faut ranger, et recevez trois meubles sur mesure :
vue 3D, rendu dans la photo, personnalisation (matières, pieds, poignées), liste de courses avec liens,
et notice de montage détaillée.

La conception est faite sur le téléphone, instantanément, par un moteur de règles (`engine.js`) : aucune IA n'est nécessaire,
et l'appli fonctionne même hors connexion une fois installée.

En option, une **aide IA gratuite** (Google Gemini, offre gratuite) lit la photo — type de meuble, objets présents, zone à mesurer,
obstacles — et comprend une demande écrite avec ses mots. Elle prépare seulement ce que le moteur calcule : cotes, prix et notice
restent calculés par les règles. Sans clé, ces fonctions sont simplement masquées.

« SNUG » est un nom de code : le nom public reste à choisir (des marques « Snug » existent déjà en classes 9, 20 et 42).

## Contenu

| Fichier | Rôle |
| --- | --- |
| `index.html`, `styles.css`, `app.js` | L'application (une page, sans étape de compilation) |
| `engine.js` | Le moteur de conception : objets à ranger par projet, caissons du commerce, règles de remplissage, 3 variantes |
| `api/assist.mjs` | Aide IA facultative : appelle Gemini avec la clé gardée sur le serveur |
| `api/render.mjs` | Rendu réaliste facultatif : FLUX.2 klein sur Cloudflare Workers AI (quota gratuit quotidien) |
| `manifest.webmanifest`, `sw.js`, `icons/` | Installation sur l'écran d'accueil du téléphone et fonctionnement hors connexion |

## Projets pris en charge

Meuble TV, dressing, bibliothèque, sous escalier (avec pente à gauche ou à droite), bureau, autre projet.
Pour chacun, l'utilisateur choisit les objets à loger (penderie, tiroirs, box, vinyles, aspirateur…) ; le moteur
découpe les zones en colonnes, place chaque objet dans une case à sa taille, comble l'espace restant et produit :

- **Économique** : caissons du commerce les moins chers (IKEA BESTÅ, PAX, BILLY, PLATSA, EKET, METOD, Castorama GoodHome, Leroy Merlin Delinia), peu de façades ;
- **Équilibrée** : le système de caissons le plus adapté au projet, plateau et façades plus soignés ;
- **Optimale** : panneaux découpés aux cotes exactes (selon le mode de fabrication choisi), plus de rangements fermés.

Les dimensions des caissons et tous les prix sont des **estimations** : chaque lien ouvre la fiche du produit quand elle est trouvée (`api/products.mjs`), sinon la recherche déjà remplie sur le site de l'enseigne.

## Tracé en perspective

À l'étape « Cotes », l'utilisateur trace l'emplacement du meuble sur le mur, puis ajuste les 4 coins (une loupe aide à viser) et tire la poignée de profondeur.
À partir de la forme de ce rectangle, l'appli retrouve la focale et la position de l'appareil photo : une seule mesure saisie donne les deux autres,
et le meuble est ensuite rendu dans la photo avec la même perspective. Les cotes calculées restent des estimations à vérifier au mètre.

## Mise en ligne gratuite sur Vercel

1. Créez un compte gratuit sur vercel.com avec votre compte GitHub.
2. « Add New… → Project », choisissez le dépôt `snug`, puis « Deploy ». Aucun réglage, aucune variable d'environnement.
3. Partagez le lien obtenu (du type `snug-xxx.vercel.app`) à vos testeurs.

Autre option gratuite : GitHub Pages (Settings → Pages → branche `main`, dossier racine), sans l'aide IA.

### Activer l'aide IA (gratuit)

1. Sur aistudio.google.com, connectez-vous avec un compte Google et créez une clé API (« Get API key »). Aucune carte bancaire.
2. Sur Vercel : Settings → Environment Variables → `GEMINI_API_KEY` = la clé. Facultatif : `GEMINI_MODEL` (par défaut `gemini-3.8-flash`).
3. Deployments → Redeploy.

Offre gratuite : quota limité par jour, et Google peut utiliser les contenus envoyés (photos, textes) pour améliorer ses produits.
L'appli le signale à l'utilisateur avant l'analyse d'une photo.

### Activer le rendu réaliste (gratuit)

Bouton « Réaliste » dans la vue « Chez moi » : une IA de retouche efface l'ancien meuble et intègre le nouveau dans la photo.
Sans clés Cloudflare, l'appli essaie la clé Gemini déjà configurée ; l'offre gratuite de Google ne comprend pas toujours la
retouche d'image, auquel cas l'appli le dit et renvoie ici. Quota gratuit Cloudflare : 10 000 « neurons » par jour, environ 60 rendus.

1. Créez un compte gratuit sur [dash.cloudflare.com](https://dash.cloudflare.com) (aucune carte bancaire).
2. Dans le menu de gauche, ouvrez **AI** → **Workers AI**, puis le bouton **Use REST API**.
3. Copiez l'**Account ID** affiché sur cette page.
4. Sur la même page, **Create a Workers AI API Token** → **Create API Token** → **Copy API Token**.
   (En jeton personnalisé : permissions **Workers AI - Read** et **Workers AI - Edit**.)
5. Sur Vercel, projet `snug` → **Settings** → **Environment Variables** → **Add New**, deux fois :
   `CF_ACCOUNT_ID` = l'Account ID, puis `CF_API_TOKEN` = le jeton, les deux en type **Secret**, pour tous les environnements.
6. Onglet **Deployments** → menu « … » du dernier déploiement → **Redeploy**.
7. Vérification : ouvrez `https://<votre-app>.vercel.app/api/render` dans un navigateur.
   La réponse doit indiquer `"service":"cloudflare"` et les deux clés à `true`.

## Installer sur un téléphone

- iPhone : ouvrir le lien dans Safari → Partager → « Sur l'écran d'accueil ».
- Android : ouvrir le lien dans Chrome → menu → « Installer l'application ».

## Tester en local

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Prochaines étapes

- Comptes utilisateurs et projets sauvegardés en ligne (aujourd'hui : dans le navigateur).
- Partage d'un projet par lien (avec un monteur, un proche).
- Catalogue produits réel des enseignes (prix et références à jour, liens directs vers les fiches).
- Version native iPhone et Android avec réalité augmentée.
