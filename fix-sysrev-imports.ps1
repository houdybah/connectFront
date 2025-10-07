# Script pour corriger tous les imports dans sysrev

$sysrevPath = "src\app\sysrev"

Get-ChildItem -Path $sysrevPath -Recurse -Filter "*.ts" | Where-Object { $_.FullName -notlike "*node_modules*" } | ForEach-Object {
    $file = $_
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    # Calculer la profondeur relative depuis sysrev/
    $relativePath = $file.DirectoryName.Replace((Get-Location).Path + "\$sysrevPath", "")
    $depth = ($relativePath.Split('\') | Where-Object { $_ -ne "" }).Count
    
    # Pour les fichiers dans sysrev directement, depth = 0
    # Pour les fichiers dans sysrev/schedule-parc, depth = 1
    # Pour les fichiers dans sysrev/schedule-parc/pages/camions, depth = 3
    
    # Calculer le bon nombre de ../
    if ($depth -eq 0) {
        $modelsPath = "./models/"
        $servicesPath = "./services/"
    } else {
        $modelsPath = ("../" * $depth) + "models/"
        $servicesPath = ("../" * $depth) + "services/"
    }
    
    # Remplacer les imports de modèles
    if ($content -match "from ['\`"](\.\./)+models/") {
        # Si déjà en relatif, corriger le nombre de ../
        $content = $content -replace "from ['\`"](\.\./)+models/", "from '$modelsPath"
        $modified = $true
    }
    
    if ($content -match "from ['\`"](\.\./)+services/") {
        # Si déjà en relatif, corriger le nombre de ../
        $content = $content -replace "from ['\`"](\.\./)+services/", "from '$servicesPath"
        $modified = $true
    }
    
    # Remplacer src/environments
    if ($content -match "from ['\`"]src/environments/") {
        $envDepth = $depth + 1  # +1 car on doit aussi sortir de sysrev puis app
        $envPath = ("../" * ($envDepth + 2)) + "environments/"
        $content = $content -replace "from ['\`"]src/environments/", "from '$envPath"
        $modified = $true
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content
        Write-Host "Fixed: $($file.FullName.Replace((Get-Location).Path, '.'))"
    }
}

Write-Host "`nTerminé!"

