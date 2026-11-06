# SNUG

Prenez une photo d'un espace, dessinez et mesurez les zones, dites ce qu'il faut ranger, et recevez trois meubles sur mesure :
vue 3D, rendu dans la photo, personnalisation (matières, pieds, poignées), liste de courses avec liens,
et notice de montage détaillée.

L'appli est **100 % indépendante** : aucune IA, aucun serveur, aucune clé API. Tout est calculé sur le téléphone,
instantanément, par un moteur de règles (`engine.js`). Elle fonctionne même hors connexion une fois installée.

« SNUG » est un nom de code : le nom public reste à choisir (des marques « Snug » existent déjà en classes 9, 20 et 42).

## Contenu

| Fichier | Rôle |
| --- | --- |
| `index.html`, `styles.css`, `app.js` | L'application (une page, sans étape de compilation) |
| `engine.js` | Le moteur de conception : objets à ranger par projet, caissons du commerce, règles de remplissage, 3 variantes |
| `manifest.webmanifest`, `sw.js`, `icons/` | Installation sur l'écran d'accueil du téléphone et fonctionnement hors connexion |

## Projets pris en charge

Meuble TV, dressing, bibliothèque, sous escalier (avec pente à gauche ou à droite), bureau, autre projet.
Pour chacun, l'utilisateur choisit les objets à loger (penderie, tiroirs, box, vinyles, aspirateur…) ; le moteur
découpe les zones en colonnes, place chaque objet dans une case à sa taille, comble l'espace restant et produit :

- **Économique** : caissons du commerce les moins chers (IKEA BESTÅ, PAX, BILLY, PLATSA, EKET, METOD, Castorama GoodHome, Leroy Merlin Delinia), peu de façades ;
- **Équilibrée** : le système de caissons le plus adapté au projet, plateau et façades plus soignés ;
- **Optimale** : panneaux découpés aux cotes exactes (selon le mode de fabrication choisi), plus de rangements fermés.

Les dimensions des caissons et tous les prix sont des **estimations** : les liens ouvrent la recherche du produit chez l'enseigne.

## Mise en ligne gratuite sur Vercel

1. Créez un compte gratuit sur vercel.com avec votre compte GitHub.
2. « Add New… → Project », choisissez le dépôt `snug`, puis « Deploy ». Aucun réglage, aucune variable d'environnement.
3. Partagez le lien obtenu (du type `snug-xxx.vercel.app`) à vos testeurs.

Autre option gratuite : GitHub Pages (Settings → Pages → branche `main`, dossier racine).

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
