import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbDatepickerModule, NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbToastModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FeatherModule } from 'angular-feather';
import { allIcons, Table } from 'angular-feather/icons';
import { CountUpModule } from 'ngx-countup';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { SimplebarAngularModule } from 'simplebar-angular';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BonSortieComponent } from './bon-sortie/bon-sortie.component';
import { ScheduleParcRoutingModule } from './schedule-parc-routing';
import { InfoDeclarationComponent } from './info-declaration/info-declaration.component';
import { InfoBonSortieComponent } from './info-bon-sortie/info-bon-sortie.component';
import { BonCompagnieComponent } from './bon-compagnie/bon-compagnie.component';
import { BonBolorerComponent } from './bon-bolorer/bon-bolorer.component';
import { IndexBonComponent } from './segment-generale/declaration/index-bon/index-bon.component';
import { PdfDownloadComponent } from './segment-generale/declaration/pdf-download/pdf-download.component';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxPrintModule } from 'ngx-print';
import { QrcodeScannerComponent } from './segment-generale/declaration/qrcode-scanner/qrcode-scanner.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { DetailContainerDeclarationComponent } from './segment-generale/declaration/detail-container-declaration/detail-container-declaration.component';
import { DetailContainerAppureComponent } from './segment-generale/declaration/detail-container-appure/detail-container-appure.component';
import { UtilisateurListComponent } from './utilisateur/utilisateur-list/utilisateur-list.component';
import { UtilisateurFormComponent } from './utilisateur/utilisateur-form/utilisateur-form.component';
import { StatistiqueComponent } from './statistique/statistique.component';
import { StatistiqueDouaneComponent } from './statistique-douane/statistique-douane.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { ListeAffectationsComponent } from './pages/affectations/liste-affectations/liste-affectations.component';
import { FormAffectationComponent } from './pages/affectations/form-affectation/form-affectation.component';
import { ConfigHorairesComponent } from './pages/configuration/config-horaires/config-horaires.component';
import{ListeDemandesCktComponent} from './pages/demandes-ckt/liste-demandes-ckt/liste-demandes-ckt.component';
import{FormDemandeCktComponent} from './pages/demandes-ckt/form-demande-ckt/form-demande-ckt.component';
import { TableaudebordComponent } from "./pages/tableaudebord/tableaudebord.component";
import{ListeRendezVousComponent} from './pages/rendez-vous/liste-rendez-vous/liste-rendez-vous.component';
import { NotificationsSdtComponent } from './pages/sdt/notifications-sdt/notifications-sdt.component';
import { MesLignesComponent } from './pages/sdt/mes-lignes/mes-lignes.component';
import {DeclarationFormComponent} from "./segment-generale/declaration/declaration-form/declaration-form.component";
import {DeclarationListComponent} from "./segment-generale/declaration/declaration-list/declaration-list.component";
import {ConteneurComponent} from "./segment-generale/declaration/conteneur/conteneur.component";
import {
    AffectationConteneurComponent
} from "./segment-generale/declaration/affectation-conteneur/affectation-conteneur.component";
import {ResultModalComponent} from "./segment-generale/declaration/result-modal/result-modal.component";
import {IndexQrCodeComponent} from "./segment-generale/declaration/index-qr-code/index-qr-code.component";
import {
    QrcodeScannerTwoComponent
} from "./segment-generale/declaration/qrcode-scanner-two/qrcode-scanner-two.component";
import {ResultatScannerComponent} from "./segment-generale/declaration/resultat-scanner/resultat-scanner.component";
import {ListeAppurementComponent} from "./segment-generale/declaration/liste-appurement/liste-appurement.component";
import {DestinationsConteneursComponent} from "./pages/dashboards/destinations-conteneurs.component";
import {ListeCamionsComponent} from "./pages/camions/liste-camions/liste-camions.component";
import {ListeChauffeursComponent} from "./pages/chauffeurs/liste-chauffeurs/liste-chauffeurs.component";
import {FormChauffeurComponent} from "./pages/chauffeurs/form-chauffeur/form-chauffeur.component";
import {FormCamionComponent} from "./pages/camions/form-camion/form-camion.component";
import {ListeProgrammesComponent} from "./pages/programmes/liste-programmes/liste-programmes.component";
import {FormProgrammeComponent} from "./pages/programmes/form-programme/form-programme.component";
import {GestionLignesComponent} from "./pages/programmes/gestion-lignes/gestion-lignes.component";
import {CompositionLigneComponent} from "./pages/programmes/composition-ligne/composition-ligne.component";
import {FormLigneComponent} from "./pages/programmes/lignes/form-ligne/form-ligne.component";
import {ValidationProgrammeComponent} from "./pages/rendez-vous/validation-programme/validation-programme.component";
import {DashboardSdtComponent} from "./pages/sdt/dashboard-sdt/dashboard-sdt.component";
import {AssignerCamionComponent} from "./pages/sdt/assigner-camion/assigner-camion.component";
import {CamionsSdtComponent} from "./pages/sdt/camions-sdt/camions-sdt.component";
import {ChauffeursSdtComponent} from "./pages/sdt/chauffeurs-sdt/chauffeurs-sdt.component";
import {RecuAffectationComponent} from "./segment-generale/declaration/recu-affectation/recu-affectation.component";
import {
    ModificationChauffeurComponent
} from "./segment-generale/declaration/modification-chauffeur/modification-chauffeur.component";
@NgModule({
  declarations: [
    BonSortieComponent,
    InfoDeclarationComponent,
    InfoBonSortieComponent,
    BonCompagnieComponent,
    BonBolorerComponent,
    DeclarationFormComponent,
    DeclarationListComponent,
    IndexBonComponent,
    ConteneurComponent,
    PdfDownloadComponent,
    AffectationConteneurComponent,
    RecuAffectationComponent,
    QrcodeScannerComponent,
    ResultModalComponent,
    IndexQrCodeComponent,
    QrcodeScannerTwoComponent,
    ResultatScannerComponent,
    ListeAppurementComponent,
    DetailContainerDeclarationComponent,
    DetailContainerAppureComponent,
    UtilisateurListComponent,
    UtilisateurFormComponent,
    StatistiqueComponent,
    ModificationChauffeurComponent,
    ChangePasswordComponent,
    DestinationsConteneursComponent,
    StatistiqueDouaneComponent,
    ListeCamionsComponent,
    ListeChauffeursComponent,
    FormChauffeurComponent,
    FormCamionComponent,
    ListeAffectationsComponent,
    FormAffectationComponent,
    ListeProgrammesComponent,
    ConfigHorairesComponent,
    FormProgrammeComponent,
    GestionLignesComponent,
    CompositionLigneComponent,
    ListeDemandesCktComponent,
    FormDemandeCktComponent,
    TableaudebordComponent,
    FormLigneComponent,
    ListeRendezVousComponent,
    ValidationProgrammeComponent,
    DashboardSdtComponent,
    AssignerCamionComponent,
    NotificationsSdtComponent,
    CamionsSdtComponent,
    ChauffeursSdtComponent,
    MesLignesComponent
  ],
  imports: [
        CommonModule,
        NgbToastModule,
        FeatherModule.pick(allIcons),
        CountUpModule,
        LeafletModule,
        NgbDropdownModule,
        NgbNavModule,
        SimplebarAngularModule,
        NgApexchartsModule,
        SlickCarouselModule,
        FlatpickrModule.forRoot(),
        SharedModule,
        NgbPaginationModule,
        NgbTypeaheadModule,
        FormsModule,
        ReactiveFormsModule,
        NgbTooltipModule,
        ScheduleParcRoutingModule,
        NgbDatepickerModule,
        QRCodeModule,
        NgxPrintModule,
        ZXingScannerModule,
        NgbModule
  ]
})
export class ScheduleParcModule {
  
}
