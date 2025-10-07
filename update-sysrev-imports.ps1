# Script pour mettre à jour tous les imports dans les composants sysrev

$sysrevPath = "src\app\sysrev"

# Mapping des fichiers de modèles
$modelFileMapping = @{
    '/AffectationConteneur' = '/SysrevAffectationConteneur'
    '/AffectationSearchParams' = '/SysrevAffectationSearchParams'
    '/AffectationStats' = '/SysrevAffectationStats'
    '/BonBolorer' = '/SysrevBonBolorer'
    '/BonCompagnie' = '/SysrevBonCompagnie'
    '/BonSortie' = '/SysrevBonSortie'
    '/Camion' = '/SysrevCamion'
    '/CamionChauffeur' = '/SysrevCamionChauffeur'
    '/Chauffeur' = '/SysrevChauffeur'
    '/Company' = '/SysrevCompany'
    '/CompositionLigne' = '/SysrevCompositionLigne'
    '/Container' = '/SysrevContainer'
    '/Dash' = '/SysrevDash'
    '/Declarant' = '/SysrevDeclarant'
    '/Declaration' = '/SysrevDeclaration'
    '/DemandeCKT' = '/SysrevDemandeCKT'
    '/DetailAffectationConteneur' = '/SysrevDetailAffectationConteneur'
    '/DetailBonSortie' = '/SysrevDetailBonSortie'
    '/DetailTransaction' = '/SysrevDetailTransaction'
    '/Ligne' = '/SysrevLigne'
    '/PageResponse' = '/SysrevPageResponse'
    '/Programme' = '/SysrevProgramme'
    '/ReferenceTransaction' = '/SysrevReferenceTransaction'
    '/ResponseDto' = '/SysrevResponseDto'
    '/TransactionStatus' = '/SysrevTransactionStatus'
    '/user' = '/Sysrevuser'
}

# Mapping des noms de services dans les imports
$serviceFileMapping = @{
    '/conteneur.service' = '/sysrev-conteneur.service'
    '/detail-conteneur-affectation.service' = '/sysrev-detail-conteneur-affectation.service'
    '/StatistiquesDouane.service' = '/sysrev-StatistiquesDouane.service'
    '/declaration.service' = '/sysrev-declaration.service'
    '/camion.service' = '/sysrev-camion.service'
    '/chauffeur.service' = '/sysrev-chauffeur.service'
    '/affectation.service' = '/sysrev-affectation.service'
    '/programme.service' = '/sysrev-programme.service'
    '/ligne.service' = '/sysrev-ligne.service'
    '/composition.service' = '/sysrev-composition.service'
    '/demande-ckt.service' = '/sysrev-demande-ckt.service'
    '/sdt.service' = '/sysrev-sdt.service'
    '/schedule.service' = '/sysrev-schedule.service'
    '/transaction.service' = '/sysrev-transaction.service'
    '/container.service' = '/sysrev-container.service'
}

# Mapping des noms de classes
$classMapping = @{
    '\bAffectationConteneur\b' = 'SysrevAffectationConteneur'
    '\bAffectationSearchParams\b' = 'SysrevAffectationSearchParams'
    '\bAffectationStats\b' = 'SysrevAffectationStats'
    '\bBonBolorer\b' = 'SysrevBonBolorer'
    '\bBonCompagnie\b' = 'SysrevBonCompagnie'
    '\bBonSortie\b(?!Component)' = 'SysrevBonSortie'
    '\bCamion\b' = 'SysrevCamion'
    '\bCamionChauffeur\b' = 'SysrevCamionChauffeur'
    '\bChauffeur\b' = 'SysrevChauffeur'
    '\bCompany\b' = 'SysrevCompany'
    '\bCompositionLigne\b' = 'SysrevCompositionLigne'
    '\bContainer\b' = 'SysrevContainer'
    '\bDash\b' = 'SysrevDash'
    '\bDeclarant\b' = 'SysrevDeclarant'
    '\bDeclaration\b(?!Form|List|Component)' = 'SysrevDeclaration'
    '\bDemandeCKT\b' = 'SysrevDemandeCKT'
    '\bDetailAffectationConteneur\b' = 'SysrevDetailAffectationConteneur'
    '\bDetailBonSortie\b' = 'SysrevDetailBonSortie'
    '\bDetailTransaction\b' = 'SysrevDetailTransaction'
    '\bLigne\b' = 'SysrevLigne'
    '\bPageResponse\b' = 'SysrevPageResponse'
    '\bProgramme\b' = 'SysrevProgramme'
    '\bReferenceTransaction\b' = 'SysrevReferenceTransaction'
    '\bResponseDto\b' = 'SysrevResponseDto'
    '\bTransactionStatus\b' = 'SysrevTransactionStatus'
    '\bConteneurService\b' = 'SysrevConteneurService'
    '\bDetailConteneurAffectationService\b' = 'SysrevDetailConteneurAffectationService'
    '\bStatistiquesDouaneService\b' = 'SysrevStatistiquesDouaneService'
    '\bDeclarationService\b' = 'SysrevDeclarationService'
    '\bCamionService\b' = 'SysrevCamionService'
    '\bChauffeurService\b' = 'SysrevChauffeurService'
    '\bAffectationService\b' = 'SysrevAffectationService'
    '\bProgrammeService\b' = 'SysrevProgrammeService'
    '\bLigneService\b' = 'SysrevLigneService'
    '\bCompositionService\b' = 'SysrevCompositionService'
    '\bDemandeCKTService\b' = 'SysrevDemandeCKTService'
    '\bSDTService\b' = 'SysrevSDTService'
    '\bScheduleService\b' = 'SysrevScheduleService'
    '\bTransactionService\b' = 'SysrevTransactionService'
}

Write-Host "Mise à jour des imports dans tous les fichiers TypeScript de sysrev..."
Get-ChildItem -Path $sysrevPath -Filter "*.ts" -Recurse | Where-Object { $_.FullName -notlike "*node_modules*" } | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $modified = $false
    
    # Mettre à jour les imports de fichiers
    foreach ($old in $modelFileMapping.Keys) {
        if ($content -match [regex]::Escape($old)) {
            $content = $content -replace [regex]::Escape($old), $modelFileMapping[$old]
            $modified = $true
        }
    }
    
    foreach ($old in $serviceFileMapping.Keys) {
        if ($content -match [regex]::Escape($old)) {
            $content = $content -replace [regex]::Escape($old), $serviceFileMapping[$old]
            $modified = $true
        }
    }
    
    # Mettre à jour les noms de classes/interfaces
    foreach ($pattern in $classMapping.Keys) {
        if ($content -match $pattern) {
            $content = $content -replace $pattern, $classMapping[$pattern]
            $modified = $true
        }
    }
    
    if ($modified) {
        Set-Content -Path $_.FullName -Value $content
        Write-Host "Updated: $($_.FullName.Replace((Get-Location).Path, ''))"
    }
}

Write-Host "`nMise à jour des imports terminée!"

