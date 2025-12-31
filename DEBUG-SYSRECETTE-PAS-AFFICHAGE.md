# 🔍 DEBUG : SYSRECETTE ne s'affiche pas

## ⚠️ Problème

SYSRECETTE ne s'affiche toujours pas malgré la configuration iframe.

## 🎯 Informations importantes

- SYSRECETTE s'appelle **"SyG-DRD"** dans son package.json
- Même nom que le module local SYGDRD → Peut causer des conflits !
- L'application tourne sur **http://localhost:49706/**

## 🔬 Tests de diagnostic

### Test 1 : Vérifier l'accès direct à SYSRECETTE

```bash
# Ouvrir dans le navigateur
http://localhost:49706/
```

**✅ Si ça marche** → SYSRECETTE fonctionne  
**❌ Si erreur** → SYSRECETTE n'est pas démarrée

### Test 2 : Test iframe simple (hors Angular)

Ouvrir le fichier `test-sysrecette-debug.html` dans votre navigateur :

```
file:///C:/Developpement/douaneConnect/front/douaneConnectFrontFederation/test-sysrecette-debug.html
```

**✅ Si l'iframe s'affiche** → Le problème est dans Angular  
**❌ Si l'iframe ne s'affiche pas** → Problème CORS ou SYSRECETTE

### Test 3 : Vérifier les logs de la console

Après avoir redémarré l'application et cliqué sur SYSRECETTE :

1. Ouvrir la console du navigateur (F12)
2. Chercher les messages `[SYSRECETTE IFRAME]`

**Messages attendus :**
```
[SYSRECETTE IFRAME] Constructor appelé
[SYSRECETTE IFRAME] URL configurée: http://localhost:49706/
[SYSRECETTE IFRAME] ngOnInit appelé
[SYSRECETTE IFRAME] Composant initialisé, iframe devrait se charger...
[SYSRECETTE IFRAME] onIframeLoad - Iframe chargée avec succès!
```

### Test 4 : Vérifier le routing

Dans la console, vérifier l'URL après avoir cliqué sur SYSRECETTE :

```
http://localhost:4200/sysrecette
```

**✅ Si l'URL est correcte** → Le routing fonctionne  
**❌ Si l'URL est différente** → Problème de routing

## 🐛 Problèmes courants et solutions

### Problème 1 : "Rien ne s'affiche du tout"

**Cause possible :** Le composant ne se charge pas

**Solution :**
```powershell
# Vérifier les erreurs de compilation
ng build --configuration development

# Si erreurs, les corriger puis redémarrer
npm start
```

### Problème 2 : "Page blanche sans message"

**Cause possible :** Conflit de noms (SyG-DRD vs SYGDRD)

**Solution :** Changer le port de SYSRECETTE

```powershell
# Dans le projet SYSRECETTE, modifier le port dans package.json
# Puis relancer sur un port différent, par exemple 49707

# Mettre à jour l'URL dans DouaneConnect
# Fichier: src/app/module-sysrecette/sysrecette-iframe/sysrecette-iframe.component.ts
# Ligne 17: Changer 49706 par 49707
```

### Problème 3 : "Erreur CORS dans la console"

**Messages d'erreur CORS :**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution :** Configurer SYSRECETTE pour autoriser l'iframe

Dans SYSRECETTE, créer/modifier `src/proxy.conf.json` :
```json
{
  "/": {
    "target": "http://localhost:49706",
    "secure": false,
    "changeOrigin": true,
    "headers": {
      "X-Frame-Options": "ALLOWALL"
    }
  }
}
```

### Problème 4 : "Le composant ne se charge jamais"

**Vérifier que le module est bien importé**

Fichier `src/app/app-routing.module.ts` doit contenir :
```typescript
{ 
  path: 'sysrecette', 
  component: LayoutComponent, 
  loadChildren: () => import('./module-sysrecette/module-sysrecette-routing.module')
    .then(m => m.ModuleSysrecetteRoutingModule), 
  canActivate: [AuthGuard] 
}
```

## 🚀 Actions immédiates

### Étape 1 : Redémarrer avec les logs de debug

```powershell
# Arrêter le serveur actuel (Ctrl+C)
npm start
```

### Étape 2 : Tester et observer

1. Aller sur `http://localhost:4200`
2. Se connecter
3. Cliquer sur SYSRECETTE
4. **Observer :**
   - La petite box DEBUG en haut à droite
   - Les logs dans la console (F12)
   - L'URL dans la barre d'adresse

### Étape 3 : Copier les informations

**Informations à collecter :**

1. **URL dans la barre d'adresse :** _____________________
2. **Contenu de la box DEBUG :**
   - Loading: _____
   - Error: _____
3. **Logs dans la console :** (copier tous les messages [SYSRECETTE IFRAME])
4. **Erreurs dans la console :** (copier toutes les erreurs en rouge)

## 📊 Checklist de vérification

- [ ] SYSRECETTE est accessible sur http://localhost:49706/
- [ ] L'URL change bien en /sysrecette après avoir cliqué
- [ ] La box DEBUG apparaît en haut à droite
- [ ] Des logs [SYSRECETTE IFRAME] apparaissent dans la console
- [ ] Pas d'erreurs rouges dans la console
- [ ] Le composant s'initialise (Constructor appelé)

## 🔄 Solution alternative : Changer le nom

Si le conflit SyG-DRD / SYGDRD pose problème, renommer SYSRECETTE :

### Dans le projet SYSRECETTE

```json
// package.json
{
  "name": "SyG-RECETTE",  // Au lieu de "SyG-DRD"
  ...
}
```

Puis redémarrer SYSRECETTE.

## 💡 Solution de contournement immédiate

En attendant de résoudre le problème, utiliser l'URL directe :

Dans `application-tabs.component.ts`, modifier :

```typescript
{
  id: 'sysrecette',
  name: 'SYSRECETTE',
  description: 'Système de Gestion des Recettes',
  icon: 'ri-money-dollar-circle-line',
  color: '#10b981',
  route: 'http://localhost:49706/'  // URL externe
}
```

Puis dans `selectApplication()`:
```typescript
selectApplication(app: Application): void {
  if (app.route.startsWith('http')) {
    // Ouvrir dans un nouvel onglet
    window.open(app.route, '_blank');
  } else {
    // Navigation normale
    this.menuVisibilityService.setSelectedApp(app.id);
    setTimeout(() => {
      this.router.navigate([app.route]);
    }, 100);
  }
}
```

## 📞 Prochaine étape

**Redémarrez l'application et envoyez-moi :**

1. Ce que vous voyez dans la box DEBUG
2. Les logs de la console
3. Les éventuelles erreurs

Avec ces informations, je pourrai identifier précisément le problème !

