import { Component, OnInit } from '@angular/core';
import { StatistiquesDouaneService, StatistiqueRapportDTO, StatistiqueConteneurDTO } from '../../../services/StatistiquesDouane.service';
import { environment } from '../../../../environments/environment';

interface BureauConfig {
  code: string;
  nom: string;
  tc20: number;
  tc40: number;
}

@Component({
  selector: 'app-statistique-douane',
  templateUrl: './statistique-douane.component.html',
  styleUrls: ['./statistique-douane.component.css']
})
export class StatistiqueDouaneComponent implements OnInit {
  
  bureauxConfig: BureauConfig[] = [];
  dateDebut: string = '';
  dateFin: string = '';
  serviceDate: string = '';
  isLoading: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' | 'info' = 'info';
  totalTC40: number = 0;
  totalTC20: number = 0;
  totalConteneursSortis: number = 0;

  constructor(private statistiquesDouaneService: StatistiquesDouaneService) {}

  ngOnInit(): void {
    // Mettre automatiquement la date d'aujourd'hui
    const today = new Date().toISOString().split('T')[0];
    this.dateDebut = today;
    this.dateFin = today;
    
    // Charger automatiquement le rapport du jour
    setTimeout(() => {
      this.chargerRapportJournalier();
    }, 500);
  }

  chargerStatistiquesAujourdhui(): void {
    console.log('=== DEBUT chargerStatistiquesAujourdhui ===');
    
    this.isLoading = true;
    this.reinitialiserTableau();

    // Mettre la date d'aujourd'hui
    const today = new Date().toISOString().split('T')[0];
    this.dateDebut = today;
    this.dateFin = today;

    this.statistiquesDouaneService.getStatistiquesAujourdhui()
      .subscribe({
        next: (data: StatistiqueConteneurDTO[]) => {
          console.log('✅ Données aujourd\'hui reçues:', data);
          console.log('📊 Nombre d\'éléments:', data.length);
          
          // Convertir les données au format attendu
          const dataConverted: StatistiqueRapportDTO[] = data.map(item => ({
            codeOffice: item.codeOffice,
            office: item.office,
            dateStr: item.dateStr,
            conteneurs20Pieds: item.conteneurs20Pieds,
            conteneurs40Pieds: item.conteneurs40Pieds,
            totalConteneurs: item.totalConteneurs
          }));
          
          this.traiterRapport(dataConverted);
          this.mettreAJourDateService(new Date());
          this.afficherMessage('Statistiques d\'aujourd\'hui chargées avec succès', 'success');
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('❌ Erreur aujourd\'hui:', error);
          this.afficherMessage('Erreur lors du chargement: ' + error.message, 'error');
          this.reinitialiserTableau();
          this.isLoading = false;
        }
      });
  }

  chargerRapportJournalier(): void {
    console.log('=== DEBUT chargerRapportJournalier ===');
    console.log('📅 Date sélectionnée:', this.dateDebut);
    console.log('🌐 Environment URL:', environment.defaultauth);
    
    if (!this.dateDebut) {
      console.log('❌ Aucune date sélectionnée');
      this.afficherMessage('Veuillez sélectionner une date', 'error');
      return;
    }

    this.isLoading = true;
    this.reinitialiserTableau();

    this.statistiquesDouaneService.getRapportJournalier(this.dateDebut)
      .subscribe({
        next: (data: StatistiqueRapportDTO[]) => {
          console.log('✅ Données reçues:', data);
          console.log('📊 Nombre d\'éléments:', data.length);
          this.traiterRapport(data);
          this.mettreAJourDateService(new Date(this.dateDebut));
          this.afficherMessage('Rapport journalier chargé avec succès', 'success');
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('❌ Erreur complète:', error);
          console.error('📜 Message d\'erreur:', error.message);
          console.error('🔢 Status:', error.status);
          console.error('📝 Error text:', error.error);
          this.afficherMessage('Erreur lors du chargement: ' + error.message, 'error');
          this.reinitialiserTableau();
          this.isLoading = false;
        }
      });
  }

  chargerStatistiquesPeriode(): void {
    console.log('=== DEBUT chargerStatistiquesPeriode ===');
    console.log('📅 Période avant appel:', { debut: this.dateDebut, fin: this.dateFin });
    
    if (!this.dateDebut || !this.dateFin) {
      console.log('❌ Dates manquantes');
      this.afficherMessage('Veuillez sélectionner les dates', 'error');
      return;
    }

    this.isLoading = true;
    this.reinitialiserTableau();

    this.statistiquesDouaneService.getStatistiquesPeriode(this.dateDebut, this.dateFin)
      .subscribe({
        next: (data: StatistiqueRapportDTO[]) => {
          console.log('✅ Données période reçues:', data);
          console.log('📊 Nombre d\'éléments:', data.length);
          console.log('🔧 Avant traitement - serviceDate actuel:', this.serviceDate);
          console.log('🔧 Dates pour mise à jour:', { debut: this.dateDebut, fin: this.dateFin });
          
          this.traiterRapport(data);
          
          // FORCER la mise à jour de la date
          this.mettreAJourDateServicePeriode(this.dateDebut, this.dateFin);
          
          console.log('🔧 Après mise à jour - serviceDate:', this.serviceDate);
          
          this.afficherMessage('Statistiques période chargées avec succès', 'success');
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('❌ Erreur période:', error);
          this.afficherMessage('Erreur lors du chargement: ' + error.message, 'error');
          this.reinitialiserTableau();
          this.isLoading = false;
        }
      });
  }

  private mettreAJourDateService(date: Date): void {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    this.serviceDate = date.toLocaleDateString('fr-FR', options);
  }

  private mettreAJourDateServicePeriode(dateDebut: string, dateFin: string): void {
    console.log('🔧 Mise à jour date service période:', { dateDebut, dateFin });
    
    const dateDebutObj = new Date(dateDebut + 'T12:00:00');
    const dateFinObj = new Date(dateFin + 'T12:00:00');
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    const dateDebutStr = dateDebutObj.toLocaleDateString('fr-FR', options);
    const dateFinStr = dateFinObj.toLocaleDateString('fr-FR', options);
    
    console.log('📅 Dates formatées:', { dateDebutStr, dateFinStr });
    
    if (dateDebut === dateFin) {
      const optionsAvecJour: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      this.serviceDate = dateDebutObj.toLocaleDateString('fr-FR', optionsAvecJour);
      console.log('📅 Service date (jour unique):', this.serviceDate);
    } else {
      this.serviceDate = `du ${dateDebutStr} au ${dateFinStr}`;
      console.log('📅 Service date (période):', this.serviceDate);
    }
  }

  private afficherMessage(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => { 
      this.message = ''; 
    }, 5000);
  }

  private traiterRapport(data: StatistiqueRapportDTO[]): void {
    console.log('🔍 === DEBUT traiterRapport ===');
    console.log('📊 Données brutes reçues:', data);
    console.log('📈 Nombre d\'éléments:', data?.length || 0);

    if (!data || data.length === 0) {
      console.log('⚠️ Aucune donnée à traiter');
      this.afficherMessage('Aucune donnée trouvée pour cette période', 'info');
      return;
    }

    this.bureauxConfig = [];
    this.totalTC40 = 0;
    this.totalTC20 = 0;
    this.totalConteneursSortis = 0;

    data.forEach((item, index) => {
      console.log(`📋 Élément ${index + 1}:`, item);
      
      if (this.estUnBureauValide(item)) {
        const bureau: BureauConfig = {
          code: item.codeOffice || `CODE_${index}`,
          nom: item.office || item.bureau || 'Bureau inconnu',
          tc20: item.conteneurs20Pieds || item.tc20 || 0,
          tc40: item.conteneurs40Pieds || item.tc40 || 0
        };
        
        console.log(`✅ Bureau ajouté:`, bureau);
        this.bureauxConfig.push(bureau);
        
        this.totalTC20 += bureau.tc20;
        this.totalTC40 += bureau.tc40;
        this.totalConteneursSortis += (bureau.tc20 + bureau.tc40);
      } else {
        console.log(`❌ Bureau ignoré (non valide):`, item);
      }
    });

    console.log('📊 Configuration finale des bureaux:', this.bureauxConfig);
    console.log('🔢 Totaux:', {
      tc20: this.totalTC20,
      tc40: this.totalTC40,
      total: this.totalConteneursSortis
    });
    console.log('🔍 === FIN traiterRapport ===');
  }

  private estUnBureauValide(item: any): boolean {
    if (!item) return false;
    
    const nom = (item.office || item.bureau || '').toLowerCase();
    const isValid = !nom.includes('total') && 
                   !nom.includes('resume') && 
                   !nom.includes('totaux') && 
                   nom.trim() !== '';
    
    console.log(`🔍 Validation bureau "${nom}":`, isValid);
    return isValid;
  }

  private reinitialiserTableau(): void {
    this.bureauxConfig = [];
    this.totalTC40 = 0;
    this.totalTC20 = 0;
    this.totalConteneursSortis = 0;
  }

  

  previsualiserImpression(): void {
    if (this.bureauxConfig.length === 0) {
      this.afficherMessage('Aucune donnée à prévisualiser.', 'error');
      return;
    }
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const printContent = this.genererContenuImpression();
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
    }
  }

  private genererContenuImpression(): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Statistique Journalière de Sortie des Conteneurs</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            background: white;
            color: black;
          }
          .header { 
            display: flex; 
            justify-content: space-between; 
            border-bottom: 2px solid black; 
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .title { 
            text-align: center; 
            margin: 20px 0;
            text-decoration: underline;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0;
          }
          th, td { 
            border: 1px solid black; 
            padding: 5px; 
            text-align: center; 
            font-size: 11px;
          }
          th { background-color: #f0f0f0; }
          .bureau-total-row { background-color: #f5f5f5; }
          .bureau-total-cell { 
            background-color: #e8f4f8; 
            font-weight: bold; 
            color: #2c5aa0; 
          }
          .totals { 
            margin-top: 30px; 
            max-width: 400px;
          }
          @media print {
            @page { 
              size: A4 landscape; 
              margin: 1cm; 
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <strong>MINISTÈRE DU BUDGET</strong><br>
            <strong>DIRECTION GÉNÉRALE DES DOUANES</strong><br>
            <strong>PARC CONTENEUR</strong>
          </div>
          <div>
            <strong>RÉPUBLIQUE DE GUINÉE</strong><br>
            Travail - Justice - Solidarité
          </div>
        </div>
        
        <div class="title">
          <h2>STATISTIQUE JOURNALIÈRE DE SORTIE DES CONTENEURS</h2>
        </div>
        
        <p>Service ${this.serviceDate}</p>
        
        <table>
          <thead>
            <tr>
              <th rowspan="2">Bureaux</th>
              ${this.bureauxConfig.map(bureau => 
                `<th colspan="2">${bureau.nom}</th>`
              ).join('')}
            </tr>
            <tr>
              ${this.bureauxConfig.map(() => 
                '<th>TC40</th><th>TC20</th>'
              ).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Conteneurs</td>
              ${this.bureauxConfig.map(bureau => 
                `<td>${bureau.tc40}</td><td>${bureau.tc20}</td>`
              ).join('')}
            </tr>
            <tr class="bureau-total-row">
              <td>Total par bureau</td>
              ${this.bureauxConfig.map(bureau => 
                `<td colspan="2" class="bureau-total-cell">${bureau.tc40 + bureau.tc20}</td>`
              ).join('')}
            </tr>
          </tbody>
        </table>
        
        <table class="totals">
          <tr>
            <td><strong>Total conteneur 40'</strong></td>
            <td><strong>${this.totalTC40}</strong></td>
          </tr>
          <tr>
            <td><strong>Total conteneur 20'</strong></td>
            <td><strong>${this.totalTC20}</strong></td>
          </tr>
          <tr>
            <td><strong>Total des conteneurs sortis</strong></td>
            <td><strong>${this.totalConteneursSortis}</strong></td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }

  
}








