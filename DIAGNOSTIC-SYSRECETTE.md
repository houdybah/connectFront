# Diagnostic SYSRECETTE - Page d'erreur affichée

## Problème

L'application SYSRECETTE est accessible sur `http://localhost:49706/` mais la page d'erreur s'affiche lors du chargement dans DouaneConnect.

## Cause probable

Le module exposé par SYSRECETTE ne correspond pas à ce que nous attendons. Les possibilités :

1. **Le nom du module exposé est différent** (pas `./Module`)
2. **Le nom de l'export est différent** (pas `RemoteAppModule`)
3. **SYSRECETTE n'utilise pas Module Federation** ou n'expose aucun module
4. **Problème de configuration webpack** côté SYSRECETTE

## Solution appliquée

Le code a été modifié pour :
- Ajouter des logs détaillés dans la console du navigateur
- Essayer plusieurs noms de modules possibles (`RemoteAppModule`, `AppModule`, `default`)
- Afficher des détails sur l'erreur

## Étapes de diagnostic

### 1. Vérifier que SYSRECETTE utilise Module Federation

Dans l'application SYSRECETTE, vérifier qu'il y a un fichier `webpack.config.js` avec :

```javascript
const { withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'sysrecette',
  filename: 'remoteEntry.js',
  
  exposes: {
    './Module': './src/app/app.module.ts',  // ou le chemin vers votre module
  },
  
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
```

### 2. Vérifier le remoteEntry.js

Ouvrir dans le navigateur : `http://localhost:49706/remoteEntry.js`

Le fichier doit exister et contenir du code JavaScript. Si vous obtenez une erreur 404, Module Federation n'est pas configuré.

### 3. Consulter la console du navigateur

Après avoir appliqué les modifications :

1. Ouvrir la console du navigateur (F12)
2. Aller sur l'application DouaneConnect
3. Sélectionner SYSRECETTE
4. Regarder les messages dans la console :
   - Si vous voyez "Module SYSRECETTE chargé avec succès:", le module se charge
   - Si vous voyez "Erreur lors du chargement du module distant SYSRECETTE:", lire le message d'erreur

### 4. Vérifier angular.json de SYSRECETTE

Le fichier `angular.json` de SYSRECETTE doit utiliser :

```json
{
  "build": {
    "builder": "ngx-build-plus:browser",
    "options": {
      "extraWebpackConfig": "webpack.config.js",
      ...
    }
  },
  "serve": {
    "builder": "ngx-build-plus:dev-server",
    ...
  }
}
```

## Solutions selon le problème identifié

### Si SYSRECETTE n'utilise pas Module Federation

**Option 1 : Configurer Module Federation dans SYSRECETTE**

Dans SYSRECETTE :

```bash
# Installer les dépendances
npm install @angular-architects/module-federation --save --legacy-peer-deps
npm install ngx-build-plus --save-dev --legacy-peer-deps

# Créer webpack.config.js (voir exemple ci-dessus)
# Modifier angular.json (voir exemple ci-dessus)
# Modifier src/main.ts pour utiliser bootstrap.ts
```

**Option 2 : Utiliser un iframe (solution temporaire)**

Modifier `module-sysrecette-routing.module.ts` pour afficher SYSRECETTE dans un iframe :

```typescript
// Créer un composant wrapper qui affiche SYSRECETTE dans un iframe
```

### Si le nom du module exposé est différent

Dans la console, vous verrez quel module est exposé. Modifier alors :

```typescript
// Dans module-sysrecette-routing.module.ts
exposedModule: './NomDuModuleExpose'  // Remplacer par le bon nom
```

### Si le nom de l'export est différent

Le code actuel essaie déjà plusieurs noms :
```typescript
return m.RemoteAppModule || m.AppModule || m.default || m;
```

Si un autre nom est utilisé, l'ajouter à cette liste.

## Test après modification

1. **Redémarrer l'application DouaneConnect**
   ```powershell
   .\restart-app.ps1
   ```

2. **Ouvrir la console du navigateur** (F12)

3. **Sélectionner SYSRECETTE** et observer les logs

4. **Copier les messages d'erreur** s'il y en a et les analyser

## Vérification rapide

Pour vérifier rapidement si Module Federation est configuré dans SYSRECETTE :

```bash
# Dans le dossier de SYSRECETTE
# Vérifier que ces fichiers existent
ls webpack.config.js
ls src/bootstrap.ts

# Vérifier le contenu de package.json
grep "module-federation" package.json
grep "ngx-build-plus" package.json
```

## Contact et support

Si le problème persiste après ces vérifications, fournir :
1. Les messages de la console du navigateur
2. Le contenu du fichier `webpack.config.js` de SYSRECETTE (s'il existe)
3. Le contenu de `angular.json` de SYSRECETTE (section "build")

