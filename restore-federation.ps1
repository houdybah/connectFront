# Script PowerShell pour restaurer la configuration Module Federation de SYSRECETTE

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Restauration Module Federation SYSRECETTE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$routingFile = "src/app/module-sysrecette/module-sysrecette-routing.module.ts"
$moduleFile = "src/app/module-sysrecette/module-sysrecette.module.ts"
$routingBackup = "$routingFile.federation-backup"
$moduleBackup = "$moduleFile.federation-backup"

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erreur: package.json introuvable." -ForegroundColor Red
    Write-Host "   Veuillez exécuter ce script depuis la racine du projet." -ForegroundColor Yellow
    exit 1
}

Write-Host "1. Vérification des sauvegardes..." -ForegroundColor Yellow

$hasBackups = $true

if (-not (Test-Path $routingBackup)) {
    Write-Host "   ❌ Sauvegarde de routing introuvable" -ForegroundColor Red
    $hasBackups = $false
}

if (-not (Test-Path $moduleBackup)) {
    Write-Host "   ❌ Sauvegarde de module introuvable" -ForegroundColor Red
    $hasBackups = $false
}

if (-not $hasBackups) {
    Write-Host ""
    Write-Host "❌ Impossible de restaurer: fichiers de sauvegarde manquants" -ForegroundColor Red
    Write-Host "   Les fichiers originaux n'ont peut-être pas été sauvegardés." -ForegroundColor Yellow
    exit 1
}

Write-Host "   ✓ Sauvegardes trouvées" -ForegroundColor Green
Write-Host ""
Write-Host "2. Restauration de la configuration Module Federation..." -ForegroundColor Yellow

# Restaurer les fichiers
Copy-Item $routingBackup $routingFile -Force
Write-Host "   ✓ Routing restauré" -ForegroundColor Green

Copy-Item $moduleBackup $moduleFile -Force
Write-Host "   ✓ Module restauré" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ Configuration Module Federation restaurée!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines étapes:" -ForegroundColor Cyan
Write-Host "1. Vérifier que SYSRECETTE expose un module via Module Federation" -ForegroundColor White
Write-Host "2. Redémarrer l'application avec: npm start" -ForegroundColor White
Write-Host "3. Consulter la console du navigateur pour les logs" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation: DIAGNOSTIC-SYSRECETTE.md" -ForegroundColor Yellow
Write-Host ""

