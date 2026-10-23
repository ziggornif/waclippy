# Waclippy

Un assistant façon Clippy, avec un trombone violet inspiré de Waluigi et du visuel fourni. SVG animé, bulle rétro et boutons personnalisables. Aucun appel réseau, aucune dépendance à l’exécution, aucun framework requis.

## Lancer la démo

Avec **Node 24 LTS**, indiqué dans `.node-version` (avec fnm : `fnm use`) :

```sh
npm install
npm run dev
```

Ouvrir **http://127.0.0.1:4173** : la page de présentation permet d’essayer les sept réactions, d’écrire des phrases et de changer de côté.

## GitHub Pages

La page de présentation est le site publié. Le workflow `.github/workflows/pages.yml` génère et déploie `dist/` à chaque push sur `main`. Les ressources utilisent des chemins relatifs compatibles avec **https://ziggornif.github.io/waclippy/**.

Pour la première publication, sélectionner **GitHub Actions** dans **Settings → Pages → Build and deployment → Source** du dépôt. Lancer ensuite le workflow **Deploy presentation to GitHub Pages**, ou pousser un commit sur `main`.

```sh
npm run build
npm run preview
```

Ces commandes permettent de vérifier localement le site généré. L’image de référence reste locale, ignorée par Git et absente du site publié.

## Installer le module dans un autre projet

Le paquet n’est pas encore publié sur npm. Depuis ce dépôt :

```sh
npm pack
```

Puis, dans le projet qui l’utilisera :

```sh
npm install /chemin/vers/waclippy/waclippy-0.1.0.tgz
```

```js
import { createWaclippy } from 'waclippy';

const wa = createWaclippy({
  position: 'bottom-right',
  message: 'On dirait que vous essayez de gagner… Besoin d’aide ?',
  buttons: [
    {
      label: 'Oui !',
      onClick: assistant => assistant
        .say('Première étape : ne pas finir dernier.')
        .animate('think'),
    },
    { label: 'Wah !', onClick: assistant => assistant.animate('celebrate') },
  ],
});

// À appeler lorsque le composant ou la page est démonté.
// wa.destroy();
```

Le module s’importe sans DOM, mais `createWaclippy()` doit être appelé dans le navigateur, une fois le `body` disponible. Dans React, créer l’instance dans un `useEffect` et retourner `() => wa.destroy()`. Dans Vue, utiliser `onMounted` et `onBeforeUnmount`.

## API

| Méthode | Effet |
| --- | --- |
| `say(texte, boutons?)` | Remplace le dialogue et affiche l’assistant. |
| `animate(nom)` | `idle`, `wave`, `think`, `celebrate`, `point`, `fold`, `surprised` ou `sleep`. Retour automatique au repos. |
| `show()` / `hide()` | Affiche ou masque l’ensemble. |
| `setPosition(côté)` | `bottom-right` ou `bottom-left`. |
| `destroy()` | Retire le widget et annule son minuteur. Peut être appelée plusieurs fois. |
| `element` | Élément hôte pour personnalisation et événements. |

Les méthodes de modification retournent l’instance pour permettre l’enchaînement. Options initiales : `message`, `buttons`, `position` et `visible` (par défaut `true`). Types TypeScript inclus.

Les réactions combinent une déformation réelle du fil et des calques indépendants : salut avec l’extrémité du trombone et clin d’œil (`wave`), bout du fil sous le menton et sourcil levé (`think`), sauts élastiques avec casquette et étincelles (`celebrate`), fil tendu vers le haut à droite et regard dirigé (`point`), repli du corps (`fold`), yeux écarquillés et casquette qui décolle (`surprised`), repli avec paupières fermées et « Zzz » (`sleep`). `point` est une pose expressive, sans ciblage automatique d’un élément de la page. Une nouvelle réaction interrompt la précédente ; `idle`, `hide()` et `destroy()` arrêtent la déformation. La réduction des animations désactive aussi les déformations du fil.

Un bouton possède `label` et éventuellement `onClick(assistant)`. Les callbacks peuvent être asynchrones : les boutons du dialogue sont désactivés pendant l’action. En cas d’erreur, l’hôte émet `waclippy:error` avec l’erreur dans `event.detail` ; les boutons sont ensuite réactivés.

```js
wa.element.addEventListener('waclippy:error', event => {
  console.error(event.detail);
  wa.say('Oups, réessayons.');
});
wa.element.style.setProperty('--waclippy-z-index', '9999');
```

Les styles sont isolés dans un Shadow DOM. Les messages sont insérés comme texte, jamais comme HTML. Le personnage permet de rouvrir la bulle ; Échap la ferme. Les animations respectent `prefers-reduced-motion`. Plusieurs instances sont possibles, mais prévoir des côtés différents pour éviter leur superposition.

## Vérifications

```sh
npm run check
npm run test:unit
npx playwright install chromium
npm test
```

Les tests navigateur couvrent les dialogues, le clavier, les callbacks asynchrones, l’isolation CSS, les erreurs, la destruction, l’affichage mobile, les réactions et le chargement du site sous le chemin GitHub Pages.

## Périmètre du prototype

Le personnage est une interprétation vectorielle du visuel, pas un détourage ni une reproduction de son rendu 3D. Les dialogues sont scénarisés : aucune IA ni backend n’est nécessaire. Le module cible les pages HTML classiques des navigateurs modernes ; les politiques CSP strictes peuvent nécessiter une adaptation des styles intégrés. La publication npm reste à faire.
