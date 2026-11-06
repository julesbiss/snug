# SNUG

Prenez une photo d'un espace, dessinez et mesurez les zones, et recevez trois meubles sur mesure :
vue 3D, rendu dans la photo, personnalisation (matières, pieds, poignées), liste de courses avec liens,
et notice de montage détaillée.

« SNUG » est un nom de code : le nom public reste à choisir (des marques « Snug » existent déjà en classes 9, 20 et 42).

## Contenu

| Fichier | Rôle |
| --- | --- |
| `index.html`, `styles.css`, `app.js` | L'application (une page, sans étape de compilation) |
| `api/generate.js` | Fonction serveur qui appelle Claude ; la clé API reste sur le serveur |
| `manifest.webmanifest`, `sw.js`, `icons/` | Installation sur l'écran d'accueil du téléphone |

## Mise en ligne sur Vercel

1. Créez un compte sur vercel.com avec votre compte GitHub.
2. « Add New… → Project », choisissez le dépôt `snug`, puis « Deploy ». Aucun réglage de build n'est nécessaire.
3. Dans « Settings → Environment Variables », ajoutez :
   - `ANTHROPIC_API_KEY` : votre clé, créée sur console.anthropic.com (avec un plafond de dépenses).
   - `ACCESS_CODE` : un code de test à donner aux testeurs (recommandé tant que l'appli est privée).
   - `ANTHROPIC_MODEL` (facultatif) : le modèle Claude utilisé, `claude-sonnet-5-5` par défaut.
4. « Deployments → Redeploy » pour prendre en compte les variables.

Sans clé API, l'appli fonctionne quand même et affiche un exemple de résultat.

## Installer sur un téléphone

- iPhone : ouvrir le lien dans Safari → Partager → « Sur l'écran d'accueil ».
- Android : ouvrir le lien dans Chrome → menu → « Installer l'application ».

## Tester en local

```bash
npx vercel dev
```

## Prochaines étapes

- Comptes utilisateurs et projets sauvegardés en ligne (aujourd'hui : dans le navigateur).
- Partage d'un projet par lien (avec un monteur, un proche).
- Catalogue produits réel des enseignes et liens directs vers les fiches.
- Version native iPhone et Android avec réalité augmentée.
