# Script PowerShell pour redémarrer l'application

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Redémarrage de l'application DouaneConnect" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "package.json")) {
    Write-Host "Erreur: package.json introuvable. Êtes-vous dans le bon répertoire?" -ForegroundColor Red
    exit 1
}

Write-Host "1. Arrêt des processus Angular en cours..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*node_modules*"} | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "2. Nettoyage du cache..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "3. Vérification de la configuration..." -ForegroundColor Yellow
if (-not (Test-Path "webpack.config.js")) {
    Write-Host "   Erreur: webpack.config.js manquant!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "src\bootstrap.ts")) {
    Write-Host "   Erreur: bootstrap.ts manquant!" -ForegroundColor Red
    exit 1
}

Write-Host "   Configuration OK!" -ForegroundColor Green

Write-Host ""
Write-Host "4. Démarrage du serveur de développement..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "L'application sera disponible sur:" -ForegroundColor Green
Write-Host "http://localhost:4200" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

npm start

