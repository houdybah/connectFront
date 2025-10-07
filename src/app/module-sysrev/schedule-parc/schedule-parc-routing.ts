import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { UtilisateurListComponent } from "./utilisateur/utilisateur-list/utilisateur-list.component";
import { StatistiqueComponent } from "./statistique/statistique.component";
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { StatistiqueDouaneComponent } from './statistique-douane/statistique-douane.component';
import { ListeAffectationsComponent } from './pages/affectations/liste-affectations/liste-affectations.component';
import { FormAffectationComponent } from './pages/affectations/form-affectation/form-affectation.component';
import { ListeDemandesCktComponent } from './pages/demandes-ckt/liste-demandes-ckt/liste-demandes-ckt.component';
import { FormDemandeCktComponent } from './pages/demandes-ckt/form-demande-ckt/form-demande-ckt.component';
import { TableaudebordComponent } from "./pages/tableaudebord/tableaudebord.component";
import { ListeRendezVousComponent } from "./pages/rendez-vous/liste-rendez-vous/liste-rendez-vous.component";
import { NotificationsSdtComponent } from "./pages/sdt/notifications-sdt/notifications-sdt.component";
import { MesLignesComponent } from "./pages/sdt/mes-lignes/mes-lignes.component";
import {
    AffectationConteneurComponent
} from "./segment-generale/declaration/affectation-conteneur/affectation-conteneur.component";
import {ListeAppurementComponent} from "./segment-generale/declaration/liste-appurement/liste-appurement.component";
import {ResultatScannerComponent} from "./segment-generale/declaration/resultat-scanner/resultat-scanner.component";
import { QrcodeScannerTwoComponent } from "./segment-generale/declaration/qrcode-scanner-two/qrcode-scanner-two.component";
import {DeclarationListComponent} from "./segment-generale/declaration/declaration-list/declaration-list.component";
import {DeclarationFormComponent} from "./segment-generale/declaration/declaration-form/declaration-form.component";
import {DestinationsConteneursComponent} from "./pages/dashboards/destinations-conteneurs.component";
import {DashboardSdtComponent} from "./pages/sdt/dashboard-sdt/dashboard-sdt.component";
import {AssignerCamionComponent} from "./pages/sdt/assigner-camion/assigner-camion.component";
import {GestionLignesComponent} from "./pages/programmes/gestion-lignes/gestion-lignes.component";
import {FormLigneComponent} from "./pages/programmes/lignes/form-ligne/form-ligne.component";
import {CompositionLigneComponent} from "./pages/programmes/composition-ligne/composition-ligne.component";
import {CamionsSdtComponent} from "./pages/sdt/camions-sdt/camions-sdt.component";
import {FormCamionComponent} from "./pages/camions/form-camion/form-camion.component";
import {ChauffeursSdtComponent} from "./pages/sdt/chauffeurs-sdt/chauffeurs-sdt.component";
import {FormChauffeurComponent} from "./pages/chauffeurs/form-chauffeur/form-chauffeur.component";
import {ValidationProgrammeComponent} from "./pages/rendez-vous/validation-programme/validation-programme.component";
import {ListeCamionsComponent} from "./pages/camions/liste-camions/liste-camions.component";
import {ListeChauffeursComponent} from "./pages/chauffeurs/liste-chauffeurs/liste-chauffeurs.component";
import {ListeProgrammesComponent} from "./pages/programmes/liste-programmes/liste-programmes.component";
const routes: Routes = [
  {
    path: "appurement/:reference",
    component: AffectationConteneurComponent
  },
  {
    path: "appurement",
    component: ListeAppurementComponent
  },
  {
    path: "resultat/:reference",
    component: ResultatScannerComponent
  },
 {
    path: 'change-password',
    component: ChangePasswordComponent
  },


  {
    path: "scanner",
    component: QrcodeScannerTwoComponent
  },
  
  {
    path: "segment-general-form",
    component: DeclarationFormComponent
  },
  {
    path: "segment-general",
    component: DeclarationListComponent
  },
  {
    path: "utilisateur",
    component: UtilisateurListComponent
  },
  {
    path: "stats",
    component: StatistiqueComponent
  },
  {
      path: "destination",
      component: DestinationsConteneursComponent
    },
    {
      path: "statistiques",
      component: StatistiqueDouaneComponent
    },
    { path: '', redirectTo: '/tableaudebord', pathMatch: 'full' },
  { path: 'tableaudebord', component: TableaudebordComponent },
  
  // ============================================
  // ✅ ROUTES SDT
  // ============================================
  { path: 'sdt/Dashboard', component: DashboardSdtComponent },
  // Alias vers la liste des affectations depuis le tableau de bord SDT
  { path: 'sdt/Dashboard/affectations', component: ListeAffectationsComponent },
  { path: 'sdt/Dashboard/affectations/liste', component: ListeAffectationsComponent },
  { path: 'sdt/notifications', component: NotificationsSdtComponent },
  { 
    path: 'sdt/assigner-Camion/:uuid', component: AssignerCamionComponent
  },
  
  // Routes SDT - Gestion Lignes
  { path: 'sdt/Lignes', component: GestionLignesComponent },
  { path: 'sdt/Lignes/liste', component: GestionLignesComponent },
  { path: 'sdt/Lignes/nouvelle', component: FormLigneComponent },
  { path: 'sdt/Lignes/composition/:uuid', component: CompositionLigneComponent },
  { path: 'sdt/mes-lignes', component: MesLignesComponent },
  
  // Routes SDT - Gestion Programmes
  { path: 'sdt/Programmes', component: ListeDemandesCktComponent },
  { path: 'sdt/Programmes/gestion-lignes', component: GestionLignesComponent },
  { path: 'sdt/demandes-ckt', component: ListeDemandesCktComponent },
  { path: 'sdt/demandes-ckt/nouvelle', component: FormDemandeCktComponent },
  
  // Routes SDT - Gestion Camions
  { path: 'sdt/Camions', component: CamionsSdtComponent },
  { path: 'sdt/Camions/liste', component: CamionsSdtComponent },
  { path: 'sdt/Camions/nouveau', component: FormCamionComponent },
  { path: 'sdt/Camions/statistiques', component: DashboardSdtComponent }, // TODO: Créer composant stats camions
  
  // Routes SDT - Gestion Chauffeurs
  { path: 'sdt/Chauffeurs', component: ChauffeursSdtComponent },
  { path: 'sdt/Chauffeurs/liste', component: ChauffeursSdtComponent },
  { path: 'sdt/Chauffeurs/nouveau', component: FormChauffeurComponent },
  { path: 'sdt/Chauffeurs/statistiques', component: DashboardSdtComponent }, // TODO: Créer composant stats chauffeurs
  
  // Routes SDT - Affectations
  { path: 'sdt/affectations', component: ListeAffectationsComponent },
  { path: 'sdt/affectations/liste', component: ListeAffectationsComponent },
  { path: 'sdt/affectations/nouvelle', component: FormAffectationComponent },
  
  // ============================================
  // ✅ NOUVELLES ROUTES RENDEZ-VOUS
  // ============================================
  { path: 'rendez-vous', component: ListeRendezVousComponent },
  { path: 'rendez-vous/sortie', component: ListeRendezVousComponent },
  { path: 'rendez-vous/globale', component: ListeRendezVousComponent },
  { path: 'rendez-vous/validation-Programme/:numero', component: ValidationProgrammeComponent },
  // ============================================
  // ROUTES CAMIONS
  // ============================================
  { path: 'camions', component: ListeCamionsComponent },
  { path: 'camions/nouveau', component: FormCamionComponent },
  { path: 'camions/edit/:uuid', component: FormCamionComponent },
  
  // ============================================
  // ROUTES CHAUFFEURS
  // ============================================
  { path: 'chauffeurs', component: ListeChauffeursComponent },
  { path: 'chauffeurs/nouveau', component: FormChauffeurComponent },
  { path: 'chauffeurs/edit/:uuid', component: FormChauffeurComponent },
  
  // ============================================
  // ROUTES AFFECTATIONS
  // ============================================
  { path: 'affectations', component: ListeAffectationsComponent },
  { path: 'affectations/nouveau', component: FormAffectationComponent },
  { path: 'affectations/edit/:uuid', component: FormAffectationComponent },
  
  // ============================================
  // ROUTES DEMANDES CKT (remplace Programmes)
  // ============================================
  { path: 'demandes-ckt', component: ListeDemandesCktComponent },
  { path: 'demandes-ckt/nouveau', component: FormDemandeCktComponent },
  { path: 'demandes-ckt/edit/:uuid', component: FormDemandeCktComponent },
  { path: 'demandes-ckt/Lignes/:uuid', component: GestionLignesComponent },
  
  // ============================================
  // ROUTES LIGNES ET COMPOSITION
  // ============================================
  { path: 'lignes/composer/:uuid', component: CompositionLigneComponent },

  // Lignes - AJOUTEZ CES ROUTES
  { path: 'lignes/create', component: FormLigneComponent },  // ← Ajoutez cette Ligne
  { path: 'lignes/modifier/:uuid', component: FormLigneComponent },
  
  // ============================================
  // ROUTES AFFECTATIONS
  // ============================================
  { path: 'affectations', component: ListeAffectationsComponent },
  { path: 'affectations/nouveau', component: FormAffectationComponent },
  { path: 'affectations/edit/:uuid', component: FormAffectationComponent },
   {
        path: 'liste-programmes',
        component: ListeProgrammesComponent
      },
     
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleParcRoutingModule { }


