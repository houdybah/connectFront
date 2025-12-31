# Intégration de SYDACTOV via Module Federation

## Vue d'ensemble

SYDACTOV a été intégré comme application distante (remote) utilisant Webpack Module Federation. Cette intégration permet de charger dynamiquement l'application SYDACTOV hébergée à distance.

## Configuration

### 1. Dépendances installées
- `@angular-architects/module-federation` version 18.0.0

### 2. Configuration Webpack (`webpack.config.js`)

```javascript
const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  remotes: {
    "sydactov": "http://41.77.184.36:8070/remoteEntry.js",
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
```

### 3. Configuration Angular (`angular.json`)

Les builders ont été mis à jour pour utiliser Module Federation :
- Builder de build : `@angular-architects/module-federation:build`
- Builder de serve : `@angular-architects/module-federation:dev-server`

### 4. Structure des modules créés

```
src/app/module-sydactov/
├── module-sydactov.module.ts
├── module-sydactov-routing.module.ts
└── sydactov-error/
    ├── sydactov-error.module.ts
    ├── sydactov-error.component.ts
    ├── sydactov-error.component.html
    └── sydactov-error.component.scss
```

## Routing

La route SYDACTOV a été ajoutée dans `app-routing.module.ts` :

```typescript
{ 
  path: 'sydactov', 
  component: LayoutComponent, 
  loadChildren: () => import('./module-sydactov/module-sydactov-routing.module')
    .then(m => m.ModuleSydactovRoutingModule), 
  canActivate: [AuthGuard] 
}
```

## Interface utilisateur

### 1. Application Tabs (`application-tabs.component.ts`)

SYDACTOV a été ajouté à la liste des applications disponibles :

```typescript
{
  id: 'sydactov',
  name: 'SYDACTOV',
  description: 'Système de Déclaration Activité et Organisation Visite',
  icon: 'ri-calendar-check-line',
  color: '#8b5cf6',
  route: '/sydactov'
}
```

### 2. Permissions utilisateur

- **houdy@gmail.com** : Accès à toutes les applications (SYGDRD, SYSREV, SYGMAK, SYDACTOV)
- **issa@gmail.com** : Accès à SYSREV, SYGMAK et SYDACTOV
- **Autres utilisateurs** : Accès à SYGMAK et SYDACTOV

### 3. Menus

Des menus ont été créés pour SYDACTOV dans :
- `src/app/layouts/horizontal-topbar/menu.ts` (menu horizontal)
- `src/app/layouts/sidebar/menu.ts` (sidebar)

Menu items :
- Accueil (`/sydactov`)
- Déclarations (`/sydactov/declarations`)
- Activités (`/sydactov/activites`)
- Visites (`/sydactov/visites`)

## Gestion des erreurs

Un module d'erreur (`SydactovErrorModule`) a été créé pour gérer les cas où l'application distante ne peut pas être chargée. Il offre :
- Un message d'erreur clair
- Un bouton "Réessayer" pour recharger la page
- Un bouton "Retour aux applications" pour revenir à la sélection des modules
- L'affichage de l'URL distante

## Applications distantes configurées

Le projet DouaneConnect supporte maintenant **2 applications distantes** :

1. **SYDACTOV** - `http://41.77.184.36:8070/`
2. **SYSRECETTE** - `http://localhost:49706/`

## Configuration requise côté Remote (SYDACTOV)

L'application distante SYDACTOV doit :

1. **Exposer un module via Module Federation**
   - Fichier `remoteEntry.js` accessible à `http://41.77.184.36:8070/`
   - Module exposé nommé `./Module`
   - Export d'un `RemoteAppModule`

2. **Configuration CORS**
   - Autoriser les requêtes depuis l'application host
   - Headers CORS appropriés

3. **Configuration webpack.config.js du remote**
   ```javascript
   module.exports = withModuleFederationPlugin({
     name: 'sydactov',
     filename: 'remoteEntry.js',
     exposes: {
       './Module': './src/app/remote-app/remote-app.module.ts',
     },
     shared: {
       ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
     },
   });
   ```

## Démarrage

Pour démarrer l'application avec Module Federation :

```bash
npm start
```

L'application sera accessible sur `http://localhost:4200`

## Dépannage

### L'application distante ne se charge pas

1. Vérifier que l'URL `http://41.77.184.36:8070/remoteEntry.js` est accessible
2. Vérifier la console du navigateur pour les erreurs CORS
3. Vérifier que l'application distante est bien démarrée
4. Vérifier la configuration du remote dans `webpack.config.js`

### Erreurs de versions partagées

Si des erreurs de versions apparaissent, ajuster la configuration `shared` dans `webpack.config.js` :

```javascript
shared: {
  ...shareAll({ 
    singleton: true, 
    strictVersion: false,  // Mettre à false si nécessaire
    requiredVersion: 'auto' 
  }),
}
```

## Notes importantes

- L'application host et l'application remote doivent utiliser des versions compatibles d'Angular et des dépendances partagées
- Les modules partagés sont configurés avec `singleton: true` pour éviter les duplications
- L'application remote doit être accessible depuis le navigateur du client (pas seulement du serveur)

