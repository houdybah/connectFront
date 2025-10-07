# Script pour fixer tous les imports dans sysrev avec calcul automatique des profondeurs

$sysrevPath = "src\app\sysrev"
$basePath = (Get-Location).Path + "\$sysrevPath"

Write-Host "Correction de tous les imports dans sysrev..."

Get-ChildItem -Path $sysrevPath -Recurse -Filter "*.ts" | Where-Object { 
    $_.FullName -notlike "*node_modules*" 
} | ForEach-Object {
    $file = $_
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    # Calculer la profondeur relative depuis le dossier sysrev
    $relativePath = $file.DirectoryName.Replace($basePath, "").TrimStart('\')
    if ($relativePath -eq "") {
        $depth = 0
    } else {
        $depth = ($relativePath.Split('\') | Where-Object { $_ -ne "" }).Count
    }
    
    # Construire les chemins relatifs corrects
    if ($depth -eq 0) {
        $modelsPath = "./models/"
        $servicesPath = "./services/"
        $envPath = "../../environments/"
    } else {
        $up = "../" * $depth
        $modelsPath = $up + "models/"
        $servicesPath = $up + "services/"
        $envPath = "../" * ($depth + 2) + "environments/"
    }
    
    # Patterns à remplacer
    $patterns = @(
        @{ 
            Pattern = "from ['\`"](\.\./)+models/"
            Replacement = "from '$modelsPath"
        },
        @{ 
            Pattern = "from ['\`"](\.\./)+services/"
            Replacement = "from '$servicesPath"
        },
        @{ 
            Pattern = "from ['\`"]src/environments/"
            Replacement = "from '$envPath"
        },
        @{ 
            Pattern = "from ['\`"]\.\./\.\./\.\./\.\./models/"
            Replacement = "from '$modelsPath"
        },
        @{ 
            Pattern = "from ['\`"]\.\./\.\./\.\./\.\./services/"
            Replacement = "from '$servicesPath"
        }
    )
    
    foreach ($p in $patterns) {
        if ($content -match $p.Pattern) {
            $content = $content -replace $p.Pattern, $p.Replacement
            $modified = $true
        }
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content
        $shortPath = $file.FullName.Replace($basePath, "sysrev")
        Write-Host "OK $shortPath (depth=$depth)"
    }
}

Write-Host "Tous les imports corriges!"

