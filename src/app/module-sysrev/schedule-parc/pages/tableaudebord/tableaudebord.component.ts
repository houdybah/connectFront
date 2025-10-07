import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import {CamionService} from "../../../services/camion.service";
import {AffectationService} from "../../../services/affectation.service";
import {DemandeCKTService} from "../../../services/demande-ckt.service";
import {ChauffeurService} from "../../../services/chauffeur.service";
import {EnumTypeConteneur} from "../../../models/Camion";
import {EnumStatusCamionChauffeur, EnumStatusEtat} from "../../../models/CamionChauffeur";

interface DashboardStats {
  camions: {
    total: number;
    tc20: number;
    tc40: number;
  };
  chauffeurs: {
    total: number;
    disponibles: number;
  };
  affectations: {
    total: number;
    actives: number;
    enMission: number;
  };
  demandesCKT: {
    aujourdhui: number;
    total: number;
    capaciteTotale: number;
  };
}

interface ActivityLog {
  type: 'info' | 'success' | 'warning' | 'danger';
  icon: string;
  message: string;
  time: string;
}

@Component({
  selector: 'app-tableaudebord',
  templateUrl: './tableaudebord.component.html',
  styleUrls: ['./tableaudebord.component.scss']
})
export class TableaudebordComponent implements OnInit, OnDestroy {
  loading = false;
  stats: DashboardStats = {
    camions: { total: 0, tc20: 0, tc40: 0 },
    chauffeurs: { total: 0, disponibles: 0 },
    affectations: { total: 0, actives: 0, enMission: 0 },
    demandesCKT: { aujourdhui: 0, total: 0, capaciteTotale: 0 }
  };

  activitesRecentes: ActivityLog[] = [];
  
  private subscriptions: Subscription[] = [];

  constructor(
    private CamionService: CamionService,
    private ChauffeurService: ChauffeurService,
    private AffectationService: AffectationService,
    private DemandeCKTService: DemandeCKTService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.generateRecentActivities();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadDashboardData(): void {
    this.loading = true;
    
    const today = new Date().toISOString().split('T')[0];
    
    this.subscriptions.push(
      forkJoin({
        camions: this.CamionService.getAllCamions(),
        chauffeurs: this.ChauffeurService.getAllChauffeurs(),
        affectations: this.AffectationService.getAllAffectations(),
        demandesCKT: this.DemandeCKTService.getDemandeCKTByDate(today)
      }).subscribe({
        next: (data) => {
          // Stats Camions (pas de propriété statut)
          this.stats.camions.total = data.camions.length;
          this.stats.camions.tc20 = data.camions.filter(
            c => c.typeConteneur === EnumTypeConteneur.VINGT_PIEDS
          ).length;
          this.stats.camions.tc40 = data.camions.filter(
            c => c.typeConteneur === EnumTypeConteneur.QUARANTE_PIEDS
          ).length;

          // Stats Chauffeurs (pas de propriété statut)
          this.stats.chauffeurs.total = data.chauffeurs.length;
          // Disponibles = chauffeurs non affectés en mission
          const chauffeursEnMission = data.affectations
            .filter(a => a.statusEtat === EnumStatusEtat.EN_MISSION)
            .map(a => a.chauffeurUuid);
          this.stats.chauffeurs.disponibles = data.chauffeurs.filter(
            c => !chauffeursEnMission.includes(c.uuid!)
          ).length;

          // Stats Affectations
          this.stats.affectations.total = data.affectations.length;
          this.stats.affectations.actives = data.affectations.filter(
            a => a.status === EnumStatusCamionChauffeur.ACTIF
          ).length;
          this.stats.affectations.enMission = data.affectations.filter(
            a => a.statusEtat === EnumStatusEtat.EN_MISSION
          ).length;

          // Stats Demandes CKT
          this.stats.demandesCKT.aujourdhui = data.demandesCKT.length;
          this.stats.demandesCKT.total = data.demandesCKT.length;
          this.stats.demandesCKT.capaciteTotale = data.demandesCKT.reduce(
            (sum, d) => sum + d.capacite, 0
          );

          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur chargement dashboard:', error);
          this.loading = false;
        }
      })
    );
  }

  generateRecentActivities(): void {
    this.activitesRecentes = [
      {
        type: 'success',
        icon: 'fa-truck',
        message: 'Nouveau Camion AA-456-GN enregistré',
        time: 'Il y a 5 minutes'
      },
      {
        type: 'info',
        icon: 'fa-user-plus',
        message: 'Chauffeur Mamadou DIALLO affecté au Camion BB-123-GN',
        time: 'Il y a 15 minutes'
      },
      {
        type: 'success',
        icon: 'fa-calendar-check',
        message: 'Demande CKT CKT-20251002-M créée',
        time: 'Il y a 30 minutes'
      },
      {
        type: 'warning',
        icon: 'fa-exclamation-triangle',
        message: 'Affectation mise en maintenance',
        time: 'Il y a 1 heure'
      },
      {
        type: 'info',
        icon: 'fa-truck-loading',
        message: '5 lignes composées pour le Programme',
        time: 'Il y a 2 heures'
      }
    ];
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }

  getActivityIcon(type: string): string {
    switch(type) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'danger': return 'text-danger';
      default: return 'text-info';
    }
  }
}






