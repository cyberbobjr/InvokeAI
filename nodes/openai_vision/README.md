# OpenAI Vision & Prompt Enhancement Nodes

Ce dossier contient deux custom nodes qui utilisent l'API OpenAI :

1. **OpenAI Vision** : Analyse d'images avec GPT-4 Vision
2. **OpenAI Prompt Expansion** : Amélioration et expansion de prompts

## Installation

1. Copiez le dossier `openai_vision` dans le répertoire `nodes/` de votre installation InvokeAI
2. Redémarrez l'application InvokeAI

## Configuration

Pour utiliser ces nodes, vous devez avoir une clé API OpenAI. Vous pouvez :

1. Définir la variable d'environnement `OPENAI_API_KEY` avec votre clé
2. Ou la configurer dans le fichier de configuration InvokeAI

## Architecture de modèle

Les deux nodes supportent deux types d'architecture de modèle :

- **tag_based** : Pour les modèles SD1.5 - génère des prompts sous forme de tags séparés par des virgules
- **sentence_based** : Pour les modèles modernes - génère des prompts sous forme de phrases détaillées en anglais

## 1. OpenAI Analyze Image

### Utilisation

Le node `OpenAI Analyze Image` (type: `claude_analyze_image`) accepte les paramètres suivants :

- **image** : L'image à analyser (requis)
- **model_architecture** : 
  - `sentence_based` : Retourne des phrases descriptives en anglais (par défaut)
  - `tag_based` : Retourne des tags séparés par des virgules pour SD1.5
- **prompt** : Le prompt pour demander à GPT-4 Vision d'analyser l'image
- **openai_api_key** : Clé API OpenAI (optionnel si définie dans la config)
- **model** : Modèle OpenAI à utiliser (gpt-4o, gpt-4o-mini, ou gpt-4-turbo) - par défaut : gpt-4o-mini
- **max_tokens** : Nombre maximum de tokens dans la réponse (par défaut : 1000, max : 4000)

### Sortie
- **StringOutput** : 
  - Si `sentence_based` : Description détaillée en phrases anglaises
  - Si `tag_based` : Tags séparés par des virgules pour SD1.5

## 2. OpenAI Expand Prompt

### Utilisation

Le node `OpenAI Expand Prompt` (type: `claude_expand_prompt`) accepte les paramètres suivants :

- **prompt** : Le prompt à étendre et améliorer (requis)
- **model_architecture** : 
  - `tag_based` : Génère des tags séparés par des virgules pour SD1.5 (par défaut)
  - `sentence_based` : Génère des phrases descriptives détaillées en anglais
- **model** : Modèle OpenAI à utiliser (par défaut : gpt-4o-mini)
- **max_tokens** : Nombre maximum de tokens dans la réponse (par défaut : 500, max : 2000)

### Sortie
- **StringOutput** : 
  - Si `tag_based` : Tags détaillés séparés par des virgules
  - Si `sentence_based` : Prompt étendu sous forme de phrases

### Exemples

#### Mode tag_based (SD1.5)
- **Entrée** : "superman in a tavern"
- **Sortie** : "superman, superhero, tavern, medieval interior, wooden tables, stone walls, dim lighting, fantasy art, detailed character, blue and red costume, cape, heroic pose, atmospheric lighting, high quality, 8k"

#### Mode sentence_based (Modèles modernes)
- **Entrée** : "superman in a tavern"  
- **Sortie** : "A powerful Superman sitting in a dimly lit medieval tavern, warm golden lighting from hanging lanterns casting dramatic shadows across his iconic blue and red costume, wooden beams overhead, stone walls, other patrons in period clothing looking in awe, detailed textures on wooden tables and metal tankards, cinematic composition, high detail, photorealistic style"

## Modèles disponibles

- **gpt-4o** : Le modèle le plus avancé et rapide d'OpenAI
- **gpt-4o-mini** : Version allégée et économique (par défaut)
- **gpt-4-turbo** : Version turbo du modèle GPT-4

## Gestion des erreurs

Les nodes gèrent les erreurs suivantes :
- Clé API manquante ou invalide
- Erreurs de réseau
- Erreurs de parsing de la réponse API
- Autres erreurs inattendues

En cas d'erreur, les nodes retourneront un message d'erreur descriptif au lieu de faire planter l'exécution.
