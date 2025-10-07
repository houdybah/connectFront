import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleSysrevRoutingModule } from './module-sysrev-routing.module';
import {InfoBonSortieComponent} from "./schedule-parc/info-bon-sortie/info-bon-sortie.component";
import {BonSortieComponent} from "./schedule-parc/bon-sortie/bon-sortie.component";
import {
  CompositionLigneComponent
} from "./schedule-parc/pages/programmes/composition-ligne/composition-ligne.component";
import { ListeProgrammesComponent } from './schedule-parc/pages/programmes/liste-programmes/liste-programmes.component';
import {InfoDeclarationComponent} from "./schedule-parc/info-declaration/info-declaration.component";
import {BonCompagnieComponent} from "./schedule-parc/bon-compagnie/bon-compagnie.component";
import {BonBolorerComponent} from "./schedule-parc/bon-bolorer/bon-bolorer.component";
import {
    DeclarationFormComponent
} from "./schedule-parc/segment-generale/declaration/declaration-form/declaration-form.component";
import {
    DeclarationListComponent
} from "./schedule-parc/segment-generale/declaration/declaration-list/declaration-list.component";
import {IndexBonComponent} from "./schedule-parc/segment-generale/declaration/index-bon/index-bon.component";
import {PdfDownloadComponent} from "./schedule-parc/segment-generale/declaration/pdf-download/pdf-download.component";
import {
    AffectationConteneurComponent
} from "./schedule-parc/segment-generale/declaration/affectation-conteneur/affectation-conteneur.component";
import {ConteneurComponent} from "./schedule-parc/segment-generale/declaration/conteneur/conteneur.component";
import {
    RecuAffectationComponent
} from "./schedule-parc/segment-generale/declaration/recu-affectation/recu-affectation.component";
import {
    QrcodeScannerComponent
} from "./schedule-parc/segment-generale/declaration/qrcode-scanner/qrcode-scanner.component";
import {ResultModalComponent} from "./schedule-parc/segment-generale/declaration/result-modal/result-modal.component";
import {IndexQrCodeComponent} from "./schedule-parc/segment-generale/declaration/index-qr-code/index-qr-code.component";
import {
    QrcodeScannerTwoComponent
} from "./schedule-parc/segment-generale/declaration/qrcode-scanner-two/qrcode-scanner-two.component";
import {
    ResultatScannerComponent
} from "./schedule-parc/segment-generale/declaration/resultat-scanner/resultat-scanner.component";
import {
    ListeAppurementComponent
} from "./schedule-parc/segment-generale/declaration/liste-appurement/liste-appurement.component";
import {
    DetailContainerDeclarationComponent
} from "./schedule-parc/segment-generale/declaration/detail-container-declaration/detail-container-declaration.component";
import {
    DetailContainerAppureComponent
} from "./schedule-parc/segment-generale/declaration/detail-container-appure/detail-container-appure.component";
import {UtilisateurListComponent} from "./schedule-parc/utilisateur/utilisateur-list/utilisateur-list.component";
import {UtilisateurFormComponent} from "./schedule-parc/utilisateur/utilisateur-form/utilisateur-form.component";
import {
    ModificationChauffeurComponent
} from "./schedule-parc/segment-generale/declaration/modification-chauffeur/modification-chauffeur.component";
import {ChangePasswordComponent} from "./schedule-parc/pages/change-password/change-password.component";
import {StatistiqueComponent} from "./schedule-parc/statistique/statistique.component";
import {DestinationsConteneursComponent} from "./schedule-parc/pages/dashboards/destinations-conteneurs.component";
import {StatistiqueDouaneComponent} from "./schedule-parc/statistique-douane/statistique-douane.component";
import {ListeCamionsComponent} from "./schedule-parc/pages/camions/liste-camions/liste-camions.component";
import {ListeChauffeursComponent} from "./schedule-parc/pages/chauffeurs/liste-chauffeurs/liste-chauffeurs.component";
import {FormChauffeurComponent} from "./schedule-parc/pages/chauffeurs/form-chauffeur/form-chauffeur.component";
import {FormCamionComponent} from "./schedule-parc/pages/camions/form-camion/form-camion.component";
import {
    ListeAffectationsComponent
} from "./schedule-parc/pages/affectations/liste-affectations/liste-affectations.component";
import {FormAffectationComponent} from "./schedule-parc/pages/affectations/form-affectation/form-affectation.component";
import {ConfigHorairesComponent} from "./schedule-parc/pages/configuration/config-horaires/config-horaires.component";
import {FormProgrammeComponent} from "./schedule-parc/pages/programmes/form-programme/form-programme.component";
import {GestionLignesComponent} from "./schedule-parc/pages/programmes/gestion-lignes/gestion-lignes.component";
import {
    ListeDemandesCktComponent
} from "./schedule-parc/pages/demandes-ckt/liste-demandes-ckt/liste-demandes-ckt.component";
import {FormDemandeCktComponent} from "./schedule-parc/pages/demandes-ckt/form-demande-ckt/form-demande-ckt.component";
import {TableaudebordComponent} from "./schedule-parc/pages/tableaudebord/tableaudebord.component";
import {FormLigneComponent} from "./schedule-parc/pages/programmes/lignes/form-ligne/form-ligne.component";
import {
    ListeRendezVousComponent
} from "./schedule-parc/pages/rendez-vous/liste-rendez-vous/liste-rendez-vous.component";
import {
    ValidationProgrammeComponent
} from "./schedule-parc/pages/rendez-vous/validation-programme/validation-programme.component";
import {DashboardSdtComponent} from "./schedule-parc/pages/sdt/dashboard-sdt/dashboard-sdt.component";
import {AssignerCamionComponent} from "./schedule-parc/pages/sdt/assigner-camion/assigner-camion.component";
import {NotificationsSdtComponent} from "./schedule-parc/pages/sdt/notifications-sdt/notifications-sdt.component";
import {CamionsSdtComponent} from "./schedule-parc/pages/sdt/camions-sdt/camions-sdt.component";
import {ChauffeursSdtComponent} from "./schedule-parc/pages/sdt/chauffeurs-sdt/chauffeurs-sdt.component";
import {MesLignesComponent} from "./schedule-parc/pages/sdt/mes-lignes/mes-lignes.component";

@NgModule({
  declarations: [


  ],
  imports: [
    CommonModule,
    ModuleSysrevRoutingModule
  ]
})
export class ModuleSysrevModule { }



