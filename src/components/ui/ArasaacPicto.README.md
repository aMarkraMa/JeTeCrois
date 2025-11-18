# ArasaacPicto Component

Composant React réutilisable pour afficher des pictogrammes ARASAAC en utilisant l'API ARASAAC.

## Installation

Le composant est déjà inclus dans le projet. Importez-le simplement :

```typescript
import { ArasaacPicto } from './components/ui/ArasaacPicto';
```

## Utilisation de base

```tsx
<ArasaacPicto id={20401} />
```

## Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `id` | `number` | **Requis** | ID du pictogramme ARASAAC |
| `size` | `string` | `"25%"` | Taille en pourcentage ou pixels (ex: "50%", "100px") |
| `backgroundColor` | `string` | `"none"` | Couleur de fond (ex: "white", "#e3f2fd", "none") |
| `strikethrough` | `boolean` | `false` | Afficher une barre de négation |
| `hairColor` | `string` | `"black"` | Couleur des cheveux (ex: "#f4d03f", "#8B4513") |
| `skinColor` | `string` | `"#cf9d7c"` | Couleur de peau (ex: "#8d5524", "#f1c27d") |
| `plural` | `boolean` | `false` | Afficher la version plurielle |
| `color` | `boolean` | `true` | Afficher en couleur (false = noir et blanc) |
| `alt` | `string` | `"ARASAAC pictogram"` | Texte alternatif pour l'accessibilité |
| `className` | `string` | `""` | Classes CSS additionnelles |
| `onClick` | `() => void` | `undefined` | Fonction appelée au clic |

## Exemples

### Exemple simple
```tsx
<ArasaacPicto id={20401} />
```

### Taille personnalisée
```tsx
<ArasaacPicto id={20401} size="100px" />
<ArasaacPicto id={20401} size="50%" />
```

### Avec fond coloré
```tsx
<ArasaacPicto 
  id={20401} 
  size="100px" 
  backgroundColor="yellow" 
/>
```

### Avec barre de négation
```tsx
<ArasaacPicto 
  id={20401} 
  size="100px" 
  strikethrough={true} 
/>
```

### Personnalisation des couleurs de cheveux et de peau
```tsx
<ArasaacPicto 
  id={2950} 
  size="100px" 
  hairColor="#f4d03f"
  skinColor="#8d5524"
/>
```

### Version plurielle
```tsx
<ArasaacPicto 
  id={2950} 
  size="100px" 
  plural={true} 
/>
```

### Noir et blanc
```tsx
<ArasaacPicto 
  id={20401} 
  size="100px" 
  color={false} 
/>
```

### Pictogramme cliquable
```tsx
<ArasaacPicto 
  id={20401} 
  size="100px" 
  onClick={() => console.log('Clicked!')}
  className="clickable"
/>
```

### Exemple complet
```tsx
<ArasaacPicto 
  id={2950}
  size="150px"
  backgroundColor="#e8f5e9"
  hairColor="#f4d03f"
  skinColor="#8d5524"
  alt="Personne avec couleurs personnalisées"
  className="my-custom-class"
  onClick={() => handlePictoClick()}
/>
```

## IDs de pictogrammes courants

Voici quelques IDs de pictogrammes ARASAAC fréquemment utilisés :

- `2950` - Personne
- `20401` - Je te crois / Croire
- `4331` - Heureux
- `4332` - Triste
- `2415` - Aide
- `5110` - École
- `2391` - Ami
- `4330` - En colère
- `4333` - Peur
- `11885` - Harcèlement

Pour trouver plus de pictogrammes, visitez : https://arasaac.org/pictograms/search

## API ARASAAC

Ce composant utilise l'API ARASAAC v1 :
```
https://api.arasaac.org/v1/pictograms/{id}
```

Documentation complète : https://arasaac.org/developers/api

## Styles CSS

Le composant inclut des styles de base dans `ArasaacPicto.css` :
- Transition au survol
- Effet de clic pour les pictogrammes cliquables
- Classe `.clickable` pour les pictogrammes interactifs

Vous pouvez ajouter vos propres styles via la prop `className`.

## Accessibilité

- Utilisez toujours la prop `alt` pour décrire le pictogramme
- Les pictogrammes sont chargés en mode `lazy` pour de meilleures performances
- Le composant supporte les interactions au clavier via `onClick`

## Notes techniques

- Les pictogrammes sont chargés depuis l'API ARASAAC en temps réel
- Le chargement est optimisé avec `loading="lazy"`
- Les paramètres d'URL sont construits dynamiquement selon les props
- Le composant est entièrement typé avec TypeScript

## Licence

ARASAAC est sous licence Creative Commons (BY-NC-SA).
Plus d'informations : https://arasaac.org/terms-of-use

