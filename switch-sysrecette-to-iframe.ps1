# Script PowerShell pour basculer SYSRECETTE vers la solution Iframe

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Basculement SYSRECETTE vers Iframe" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$routingFile = "src/app/module-sysrecette/module-sysrecette-routing.module.ts"
$moduleFile = "src/app/module-sysrecette/module-sysrecette.module.ts"

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erreur: package.json introuvable." -ForegroundColor Red
    Write-Host "   Veuillez exécuter ce script depuis la racine du projet." -ForegroundColor Yellow
    exit 1
}

Write-Host "1. Sauvegarde de la configuration actuelle..." -ForegroundColor Yellow

# Sauvegarder les fichiers actuels
if (Test-Path $routingFile) {
    Copy-Item $routingFile "$routingFile.federation-backup" -Force
    Write-Host "   OK Sauvegarde de module-sysrecette-routing.module.ts" -ForegroundColor Green
}

if (Test-Path $moduleFile) {
    Copy-Item $moduleFile "$moduleFile.federation-backup" -Force
    Write-Host "   OK Sauvegarde de module-sysrecette.module.ts" -ForegroundColor Green
}

Write-Host ""
Write-Host "2. Application de la configuration Iframe..." -ForegroundColor Yellow

# Contenu du fichier de routing avec iframe
$routingContent = @"
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
"@

# Contenu du fichier module avec iframe
$moduleContent = @"
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
"@

# Écrire les nouveaux fichiers
Set-Content -Path $routingFile -Value $routingContent -Encoding UTF8
Write-Host "   OK Configuration routing mise a jour" -ForegroundColor Green

Set-Content -Path $moduleFile -Value $moduleContent -Encoding UTF8
Write-Host "   OK Configuration module mise a jour" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Configuration Iframe activee!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines étapes:" -ForegroundColor Cyan
Write-Host "1. Verifier que SYSRECETTE est demarree sur http://localhost:49706/" -ForegroundColor White
Write-Host "2. Redemarrer l'application avec: npm start" -ForegroundColor White
Write-Host "3. Tester l'acces a SYSRECETTE" -ForegroundColor White
Write-Host ""
Write-Host "Info: Les fichiers originaux ont ete sauvegardes avec l'extension .federation-backup" -ForegroundColor Yellow
Write-Host "   Pour revenir a Module Federation, executez: .\restore-federation.ps1" -ForegroundColor Yellow
Write-Host ""

