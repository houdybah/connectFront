# Intégration de SYSRECETTE via Module Federation

## Vue d'ensemble

SYSRECETTE a été intégré comme application distante (remote) utilisant Webpack Module Federation. Cette intégration permet de charger dynamiquement l'application SYSRECETTE hébergée localement.

## Configuration

### 1. Configuration Webpack (`webpack.config.js`)

```javascript
const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  remotes: {
    "sydactov": "http://41.77.184.36:8070/remoteEntry.js",
    "sysrecette": "http://localhost:49706/remoteEntry.js",
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
```

### 2. Structure des modules créés

```
src/app/module-sysrecette/
├── module-sysrecette.module.ts
├── module-sysrecette-routing.module.ts
└── sysrecette-error/
    ├── sysrecette-error.module.ts
    ├── sysrecette-error.component.ts
    ├── sysrecette-error.component.html
    └── sysrecette-error.component.scss
```

## Routing

La route SYSRECETTE a été ajoutée dans `app-routing.module.ts` :

```typescript
{ 
  path: 'sysrecette', 
  component: LayoutComponent, 
  loadChildren: () => import('./module-sysrecette/module-sysrecette-routing.module')
    .then(m => m.ModuleSysrecetteRoutingModule), 
  canActivate: [AuthGuard] 
}
```

## Interface utilisateur

### 1. Application Tabs (`application-tabs.component.ts`)

SYSRECETTE a été ajouté à la liste des applications disponibles :

```typescript
{
  id: 'sysrecette',
  name: 'SYSRECETTE',
  description: 'Système de Gestion des Recettes',
  icon: 'ri-money-dollar-circle-line',
  color: '#10b981',
  route: '/sysrecette'
}
```

### 2. Permissions utilisateur

- **houdy@gmail.com** : Accès à toutes les applications (SYGDRD, SYSREV, SYGMAK, SYDACTOV, SYSRECETTE)
- **issa@gmail.com** : Accès à SYSREV, SYGMAK, SYDACTOV et SYSRECETTE
- **Autres utilisateurs** : Accès à SYGMAK, SYDACTOV et SYSRECETTE

### 3. Menus

Des menus ont été créés pour SYSRECETTE dans :
- `src/app/layouts/horizontal-topbar/menu.ts` (menu horizontal)
- `src/app/layouts/sidebar/menu.ts` (sidebar)

Menu items :
- Accueil (`/sysrecette`)
- Gestion Recettes (`/sysrecette/recettes`)
- Statistiques (`/sysrecette/statistiques`)
- Rapports (`/sysrecette/rapports`)

## Gestion des erreurs

Un module d'erreur (`SysrecetteErrorModule`) a été créé pour gérer les cas où l'application distante ne peut pas être chargée. Il offre :
- Un message d'erreur clair
- Un bouton "Réessayer" pour recharger la page
- Un bouton "Retour aux applications" pour revenir à la sélection des modules
- L'affichage de l'URL distante

## Configuration requise côté Remote (SYSRECETTE)

L'application distante SYSRECETTE doit :

1. **Être accessible sur le port 49706**
   - URL : `http://localhost:49706/`
   - Fichier `remoteEntry.js` accessible

2. **Exposer un module via Module Federation**
   - Module exposé nommé `./Module`
   - Export d'un `RemoteAppModule`

3. **Configuration webpack.config.js du remote**
   ```javascript
   module.exports = withModuleFederationPlugin({
     name: 'sysrecette',
     filename: 'remoteEntry.js',
     exposes: {
       './Module': './src/app/remote-app/remote-app.module.ts',
     },
     shared: {
       ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
     },
   });
   ```

4. **Configuration CORS**
   - Autoriser les requêtes depuis l'application host
   - Headers CORS appropriés

## Démarrage

### 1. Démarrer l'application SYSRECETTE (Remote)
```bash
# Dans le dossier de l'application SYSRECETTE
npm start -- --port 49706
```

### 2. Démarrer l'application Host (DouaneConnect)
```bash
# Dans le dossier de l'application principale
npm start
```

L'application sera accessible sur `http://localhost:4200`

## Apparence de SYSRECETTE

- **Icône** : `ri-money-dollar-circle-line` (cercle avec symbole dollar)
- **Couleur** : Vert (`#10b981`)
- **Description** : "Système de Gestion des Recettes"

## Dépannage

### L'application distante ne se charge pas

1. **Vérifier que SYSRECETTE est démarrée** sur le port 49706
   ```bash
   # Tester l'accès
   curl http://localhost:49706/remoteEntry.js
   ```

2. **Vérifier la console du navigateur** pour les erreurs
   - Erreurs de chargement du module
   - Erreurs CORS
   - Erreurs de versions partagées

3. **Vérifier que les deux applications utilisent des versions compatibles**
   - Angular 18
   - Module Federation compatible

### Erreur de port déjà utilisé

Si le port 49706 est déjà utilisé, vous devez :
1. Modifier le port dans `webpack.config.js` (ligne de remoteEntry)
2. Modifier le port dans `module-sysrecette-routing.module.ts`
3. Modifier le port dans `sysrecette-error.component.html`
4. Redémarrer les applications

## Applications distantes configurées

Le projet DouaneConnect supporte maintenant **2 applications distantes** :

1. **SYDACTOV** - `http://41.77.184.36:8070/`
2. **SYSRECETTE** - `http://localhost:49706/`

## Notes importantes

- L'application host et l'application remote doivent utiliser des versions compatibles d'Angular et des dépendances partagées
- Les modules partagés sont configurés avec `singleton: true` pour éviter les duplications
- L'application remote doit être accessible depuis le navigateur du client
- Si SYSRECETTE n'est pas démarrée, l'écran d'erreur s'affichera automatiquement

