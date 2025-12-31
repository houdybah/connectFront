# Solution alternative pour SYSRECETTE (Iframe)

## Contexte

Si SYSRECETTE n'utilise pas Module Federation, vous pouvez utiliser une solution alternative qui affiche l'application dans un **iframe**. Cette solution fonctionne immédiatement sans nécessiter de configuration Module Federation côté SYSRECETTE.

## Option 1 : Module Federation (Recommandé - Nécessite configuration)

**Avantages :**
- ✅ Intégration native
- ✅ Partage des dépendances
- ✅ Meilleure performance
- ✅ Navigation fluide

**Inconvénients :**
- ❌ Nécessite configuration de SYSRECETTE
- ❌ Plus complexe

**État actuel :** Configuration appliquée, mais affiche une erreur car SYSRECETTE ne semble pas configuré pour Module Federation.

## Option 2 : Iframe (Solution alternative - Fonctionne immédiatement)

**Avantages :**
- ✅ Fonctionne sans configuration côté SYSRECETTE
- ✅ Isolation complète des applications
- ✅ Déploiement indépendant
- ✅ Simple à mettre en place

**Inconvénients :**
- ❌ Pas de partage de dépendances
- ❌ Communication inter-applications limitée
- ❌ Deux copies des bibliothèques en mémoire

## Comment activer la solution Iframe

### Méthode 1 : Modification manuelle

Modifier le fichier `src/app/module-sysrecette/module-sysrecette-routing.module.ts` :

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SysrecetteIframeComponent } from './sysrecette-iframe/sysrecette-iframe.component';

const routes: Routes = [
  {
    path: '',
    component: SysrecetteIframeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuleSysrecetteRoutingModule { }
```

Modifier le fichier `src/app/module-sysrecette/module-sysrecette.module.ts` :

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleSysrecetteRoutingModule } from './module-sysrecette-routing.module';
import { SysrecetteIframeComponent } from './sysrecette-iframe/sysrecette-iframe.component';

@NgModule({
  declarations: [
    SysrecetteIframeComponent
  ],
  imports: [
    CommonModule,
    ModuleSysrecetteRoutingModule
  ]
})
export class ModuleSysrecetteModule { }
```

### Méthode 2 : Script PowerShell automatique

Créer et exécuter `switch-to-iframe.ps1` :

```powershell
Write-Host "Basculement vers la solution Iframe pour SYSRECETTE..." -ForegroundColor Cyan

# Sauvegarder l'ancienne configuration
Copy-Item "src/app/module-sysrecette/module-sysrecette-routing.module.ts" `
          "src/app/module-sysrecette/module-sysrecette-routing.module.ts.backup"

# Appliquer la nouvelle configuration
# (Code de remplacement des fichiers)

Write-Host "✅ Configuration Iframe activée!" -ForegroundColor Green
Write-Host "Redémarrez l'application avec: npm start" -ForegroundColor Yellow
```

## Vérification que l'application fonctionne

Après avoir activé la solution Iframe :

1. **Redémarrer l'application**
   ```bash
   npm start
   ```

2. **Accéder à DouaneConnect**
   - Aller sur `http://localhost:4200`
   - Se connecter
   - Sélectionner SYSRECETTE

3. **Résultat attendu**
   - Un spinner de chargement apparaît
   - Après 1-2 secondes, SYSRECETTE s'affiche dans un iframe
   - L'application SYSRECETTE fonctionne normalement dans l'iframe

## Diagnostic console

Avec la solution Iframe, vous verrez dans la console du navigateur :

```
[DouaneConnect] Chargement de SYSRECETTE en mode iframe
[DouaneConnect] URL: http://localhost:49706/
```

Au lieu des erreurs Module Federation.

## Quand utiliser quelle solution ?

### Utilisez Module Federation si :
- ✅ SYSRECETTE peut être modifié pour utiliser Module Federation
- ✅ Vous voulez une intégration native
- ✅ Vous avez le temps de configurer SYSRECETTE
- ✅ Les applications partagent beaucoup de dépendances

### Utilisez Iframe si :
- ✅ SYSRECETTE ne peut pas être modifié
- ✅ Vous avez besoin d'une solution immédiate
- ✅ Les applications sont indépendantes
- ✅ Isolation complète est importante

## Migration future vers Module Federation

Si vous utilisez actuellement la solution Iframe et souhaitez migrer vers Module Federation plus tard :

1. **Configurer SYSRECETTE** avec Module Federation (voir `SYSRECETTE-INTEGRATION.md`)
2. **Tester** que SYSRECETTE expose correctement son module
3. **Restaurer** la configuration Module Federation dans DouaneConnect
4. **Redémarrer** et tester

La migration peut se faire sans impact sur les utilisateurs en dehors d'un redémarrage.

## Support et dépannage

**Problème : L'iframe affiche "Impossible de charger"**

Solution :
- Vérifier que SYSRECETTE est démarrée sur le port 49706
- Tester l'accès direct : `http://localhost:49706/`
- Vérifier les logs du serveur SYSRECETTE

**Problème : L'iframe est blanche**

Solution :
- Ouvrir la console du navigateur (F12)
- Vérifier s'il y a des erreurs CORS
- Si erreurs CORS, configurer SYSRECETTE pour autoriser l'iframe

**Problème : Impossible de communiquer entre les applications**

Solution :
- Utiliser `postMessage` pour la communication entre iframe et host
- Implémenter un système d'événements personnalisé

## Conclusion

La solution Iframe est une **alternative viable et immédiate** qui fonctionne sans configuration complexe. Elle est idéale pour :
- Démonstrations rapides
- Applications legacy qui ne peuvent pas être modifiées
- Environnements de développement

Pour la production, Module Federation reste recommandé si possible.

