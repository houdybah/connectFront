# Script pour renommer toutes les classes et services de sysrev

$sysrevPath = "src\app\sysrev"

# Mapping des anciens noms vers les nouveaux noms de modèles
$modelMapping = @{
    'AffectationConteneur' = 'SysrevAffectationConteneur'
    'AffectationSearchParams' = 'SysrevAffectationSearchParams'
    'AffectationStats' = 'SysrevAffectationStats'
    'BonBolorer' = 'SysrevBonBolorer'
    'BonCompagnie' = 'SysrevBonCompagnie'
    'BonSortie' = 'SysrevBonSortie'
    'Camion' = 'SysrevCamion'
    'CamionChauffeur' = 'SysrevCamionChauffeur'
    'Chauffeur' = 'SysrevChauffeur'
    'Company' = 'SysrevCompany'
    'CompositionLigne' = 'SysrevCompositionLigne'
    'Container' = 'SysrevContainer'
    'Dash' = 'SysrevDash'
    'Declarant' = 'SysrevDeclarant'
    'Declaration' = 'SysrevDeclaration'
    'DemandeCKT' = 'SysrevDemandeCKT'
    'DetailAffectationConteneur' = 'SysrevDetailAffectationConteneur'
    'DetailBonSortie' = 'SysrevDetailBonSortie'
    'DetailTransaction' = 'SysrevDetailTransaction'
    'Ligne' = 'SysrevLigne'
    'Page' = 'SysrevPage'
    'PageResponse' = 'SysrevPageResponse'
    'Programme' = 'SysrevProgramme'
    'ReferenceTransaction' = 'SysrevReferenceTransaction'
    'ResponseDto' = 'SysrevResponseDto'
    'Transaction' = 'SysrevTransaction'
    'TransactionStatus' = 'SysrevTransactionStatus'
}

# Mapping des services
$serviceMapping = @{
    'ConteneurService' = 'SysrevConteneurService'
    'DetailConteneurAffectationService' = 'SysrevDetailConteneurAffectationService'
    'StatistiquesDouaneService' = 'SysrevStatistiquesDouaneService'
    'DeclarationService' = 'SysrevDeclarationService'
    'CamionService' = 'SysrevCamionService'
    'ChauffeurService' = 'SysrevChauffeurService'
    'AffectationService' = 'SysrevAffectationService'
    'ProgrammeService' = 'SysrevProgrammeService'
    'LigneService' = 'SysrevLigneService'
    'CompositionService' = 'SysrevCompositionService'
    'DemandeCKTService' = 'SysrevDemandeCKTService'
    'SDTService' = 'SysrevSDTService'
    'ScheduleService' = 'SysrevScheduleService'
    'TransactionService' = 'SysrevTransactionService'
}

Write-Host "Mise à jour des noms de classes dans les modèles..."
Get-ChildItem -Path $sysrevPath\models -Filter "Sysrev*.ts" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    foreach ($old in $modelMapping.Keys) {
        $new = $modelMapping[$old]
        $content = $content -replace "\bclass $old\b", "class $new"
        $content = $content -replace "\binterface $old\b", "interface $new"
        $content = $content -replace "\benum $old\b", "enum $new"
        $content = $content -replace "from `"\./$old`"", "from `"./$new`""
    }
    Set-Content -Path $_.FullName -Value $content
    Write-Host "Updated model: $($_.Name)"
}

Write-Host "`nMise à jour des noms de classes dans les services..."
Get-ChildItem -Path $sysrevPath\services -Filter "sysrev-*.ts" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    
    # Mettre à jour les noms de services
    foreach ($old in $serviceMapping.Keys) {
        $new = $serviceMapping[$old]
        $content = $content -replace "\bclass $old\b", "class $new"
        $content = $content -replace "\bexport class $old\b", "export class $new"
    }
    
    # Mettre à jour les imports de modèles
    foreach ($old in $modelMapping.Keys) {
        $new = $modelMapping[$old]
        $content = $content -replace "\b$old\b", "$new"
    }
    
    Set-Content -Path $_.FullName -Value $content
    Write-Host "Updated service: $($_.Name)"
}

Write-Host "`nMise à jour terminée!"

