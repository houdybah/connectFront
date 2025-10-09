import { Injectable } from '@angular/core';
import { Quittance } from '../models/quittance';

/**
 * Service utilitaire pour manipuler les objets Quittance
 */
@Injectable({
  providedIn: 'root'
})
export class QuittanceHelperService {

  /**
   * Normalise un objet Quittance en s'assurant que toutes les propriétés sont synchronisées
   */
  normalizeQuittance(quittance: Quittance): Quittance {
    if (!quittance) {
      return new Quittance();
    }
    
    // Si ce n'est pas déjà une instance de Quittance, en créer une
    if (!(quittance instanceof Quittance)) {
      quittance = new Quittance(quittance);
    }
    
    // Synchroniser les propriétés
    quittance.syncProperties();
    
    return quittance;
  }

  /**
   * Normalise un tableau de quittances
   */
  normalizeQuittances(quittances: Quittance[]): Quittance[] {
    if (!Array.isArray(quittances)) {
      return [];
    }
    
    return quittances.map(q => this.normalizeQuittance(q));
  }

  /**
   * Extrait les paramètres API sécurisés depuis une quittance
   */
  extractApiParams(quittance: Quittance): { bureau: string, annee: number, code: string, serie: string, numero: string } | null {
    try {
      const normalized = this.normalizeQuittance(quittance);
      const params = normalized.getApiParams();
      
      // Valider que tous les paramètres sont présents
      if (!params.bureau || !params.annee || !params.code || !params.serie || !params.numero) {
        console.warn('Paramètres API incomplets:', params);
        return null;
      }
      
      return params;
    } catch (error) {
      console.error('Erreur lors de l\'extraction des paramètres API:', error);
      return null;
    }
  }

  /**
   * Valide une quittance et retourne les erreurs
   */
  validateQuittance(quittance: Quittance): { isValid: boolean, errors: string[] } {
    try {
      const normalized = this.normalizeQuittance(quittance);
      const isValid = normalized.isValid();
      const errors = normalized.getValidationErrors();
      
      return { isValid, errors };
    } catch (error) {
      return { 
        isValid: false, 
        errors: [`Erreur de validation: ${error instanceof Error ? error.message : error}`]
      };
    }
  }

  /**
   * Compare deux quittances pour voir si elles représentent la même entité
   */
  areEqual(quittance1: Quittance, quittance2: Quittance): boolean {
    try {
      const normalized1 = this.normalizeQuittance(quittance1);
      const normalized2 = this.normalizeQuittance(quittance2);
      
      return normalized1.getUniqueKey() === normalized2.getUniqueKey();
    } catch (error) {
      console.error('Erreur lors de la comparaison de quittances:', error);
      return false;
    }
  }

  /**
   * Filtre un tableau de quittances selon des critères
   */
  filterQuittances(
    quittances: Quittance[], 
    criteria: { 
      bureau?: string, 
      annee?: number | string, 
      code?: string, 
      serie?: string, 
      numero?: string 
    }
  ): Quittance[] {
    return this.normalizeQuittances(quittances).filter(quittance => {
      const params = quittance.getApiParams();
      
      if (criteria.bureau && !params.bureau.toLowerCase().includes(criteria.bureau.toLowerCase())) {
        return false;
      }
      
      if (criteria.annee && params.annee !== Number(criteria.annee)) {
        return false;
      }
      
      if (criteria.code && !params.code.toLowerCase().includes(criteria.code.toLowerCase())) {
        return false;
      }
      
      if (criteria.serie && !params.serie.toLowerCase().includes(criteria.serie.toLowerCase())) {
        return false;
      }
      
      if (criteria.numero && !params.numero.toLowerCase().includes(criteria.numero.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Groupe les quittances par bureau
   */
  groupByBureau(quittances: Quittance[]): { [bureau: string]: Quittance[] } {
    const groups: { [bureau: string]: Quittance[] } = {};
    
    this.normalizeQuittances(quittances).forEach(quittance => {
      const bureau = quittance.getApiParams().bureau;
      if (!groups[bureau]) {
        groups[bureau] = [];
      }
      groups[bureau].push(quittance);
    });
    
    return groups;
  }

  /**
   * Groupe les quittances par année
   */
  groupByAnnee(quittances: Quittance[]): { [annee: number]: Quittance[] } {
    const groups: { [annee: number]: Quittance[] } = {};
    
    this.normalizeQuittances(quittances).forEach(quittance => {
      const annee = quittance.getApiParams().annee;
      if (!groups[annee]) {
        groups[annee] = [];
      }
      groups[annee].push(quittance);
    });
    
    return groups;
  }

  /**
   * Trie les quittances par date de réception (plus récent en premier)
   */
  sortByDate(quittances: Quittance[], ascending: boolean = false): Quittance[] {
    return this.normalizeQuittances(quittances).sort((a, b) => {
      const dateA = new Date(a.ide_rcp_dat || a.ideRcpDat || 0).getTime();
      const dateB = new Date(b.ide_rcp_dat || b.ideRcpDat || 0).getTime();
      
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  /**
   * Trie les quittances par montant
   */
  sortByAmount(quittances: Quittance[], ascending: boolean = false): Quittance[] {
    return this.normalizeQuittances(quittances).sort((a, b) => {
      const amountA = parseFloat(a.totalFinAmtTbp || a.totalTaxAmt || "0");
      const amountB = parseFloat(b.totalFinAmtTbp || b.totalTaxAmt || "0");
      
      return ascending ? amountA - amountB : amountB - amountA;
    });
  }

  /**
   * Calcule le montant total d'un tableau de quittances
   */
  calculateTotalAmount(quittances: Quittance[]): number {
    return this.normalizeQuittances(quittances).reduce((total, quittance) => {
      const amount = parseFloat(quittance.totalFinAmtTbp || quittance.totalTaxAmt || "0");
      return total + (isNaN(amount) ? 0 : amount);
    }, 0);
  }

  /**
   * Formate un montant total pour affichage
   */
  formatTotalAmount(quittances: Quittance[]): string {
    const total = this.calculateTotalAmount(quittances);
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    }).format(total);
  }

  /**
   * Génère un rapport de statistiques sur un tableau de quittances
   */
  generateStats(quittances: Quittance[]): {
    total: number,
    count: number,
    byBureau: { [bureau: string]: { count: number, total: number } },
    byAnnee: { [annee: number]: { count: number, total: number } },
    averageAmount: number
  } {
    const normalized = this.normalizeQuittances(quittances);
    const total = this.calculateTotalAmount(normalized);
    const count = normalized.length;
    
    const byBureau: { [bureau: string]: { count: number, total: number } } = {};
    const byAnnee: { [annee: number]: { count: number, total: number } } = {};
    
    normalized.forEach(quittance => {
      const params = quittance.getApiParams();
      const amount = parseFloat(quittance.totalFinAmtTbp || quittance.totalTaxAmt || "0") || 0;
      
      // Stats par bureau
      if (!byBureau[params.bureau]) {
        byBureau[params.bureau] = { count: 0, total: 0 };
      }
      byBureau[params.bureau].count++;
      byBureau[params.bureau].total += amount;
      
      // Stats par année
      if (!byAnnee[params.annee]) {
        byAnnee[params.annee] = { count: 0, total: 0 };
      }
      byAnnee[params.annee].count++;
      byAnnee[params.annee].total += amount;
    });
    
    return {
      total,
      count,
      byBureau,
      byAnnee,
      averageAmount: count > 0 ? total / count : 0
    };
  }

  /**
   * Exporte les quittances au format CSV
   */
  exportToCsv(quittances: Quittance[]): string {
    const normalized = this.normalizeQuittances(quittances);
    
    if (normalized.length === 0) {
      return '';
    }
    
    // En-têtes CSV
    const headers = [
      'Bureau',
      'Année',
      'Code',
      'Série',
      'Numéro',
      'Entreprise',
      'Montant',
      'Date Réception',
      'Mode Paiement',
      'Banque',
      'Référence'
    ];
    
    // Données
    const rows = normalized.map(quittance => {
      const params = quittance.getApiParams();
      return [
        params.bureau,
        params.annee.toString(),
        params.code,
        params.serie,
        params.numero,
        quittance.cmpConCod || '',
        quittance.totalFinAmtTbp || quittance.totalTaxAmt || '0',
        quittance.getFormattedDate(),
        quittance.modePayement || '',
        quittance.bnk || '',
        quittance.ref || ''
      ];
    });
    
    // Joindre en CSV
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    return csvContent;
  }

  /**
   * Crée et télécharge un fichier CSV
   */
  downloadCsv(quittances: Quittance[], filename?: string): void {
    const csvContent = this.exportToCsv(quittances);
    
    if (!csvContent) {
      console.warn('Aucune donnée à exporter');
      return;
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename || `quittances_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Nettoyer l'URL
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }
}