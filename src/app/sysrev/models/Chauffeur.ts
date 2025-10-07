// Enum pour le sexe
export enum EnumSexe {
  M = 'M',
  F = 'F'
}

// Enum pour la catégorie de permis
export enum EnumCategoriePermis {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E'
}

// Enum pour le statut du chauffeur
export enum EnumStatutChauffeur {
  ACTIF = 'ACTIF',
  INACTIF = 'INACTIF',
  SUSPENDU = 'SUSPENDU',
  EN_MISSION = 'EN_MISSION'
}

export interface Chauffeur {
  uuid?: string;
  nom: string;
  prenom: string;
  permis: string;
  phone: string;
  adresse: string;
  email: string;
  sexe: EnumSexe;
  categoriePermis: EnumCategoriePermis;
  dateObtentionPermis: string; // Format ISO: 'YYYY-MM-DD'
  dateExpirationPermis: string; // Format ISO: 'YYYY-MM-DD'
  statut: EnumStatutChauffeur;
  
  // Relations (optionnelles, pour affichage)
  camionChauffeurs?: any[];
  
  dateCreation?: Date;
  derniereModification?: Date;
}

// Labels pour l'affichage
export const SexeLabels = {
  [EnumSexe.M]: 'Masculin',
  [EnumSexe.F]: 'Féminin'
};

export const CategoriePermisLabels = {
  [EnumCategoriePermis.A]: 'Permis A (Moto)',
  [EnumCategoriePermis.B]: 'Permis B (Voiture)',
  [EnumCategoriePermis.C]: 'Permis C (Camion)',
  [EnumCategoriePermis.D]: 'Permis D (Bus)',
  [EnumCategoriePermis.E]: 'Permis E (Remorque)'
};

export const StatutChauffeurLabels = {
  [EnumStatutChauffeur.ACTIF]: 'Actif',
  [EnumStatutChauffeur.INACTIF]: 'Inactif',
  [EnumStatutChauffeur.SUSPENDU]: 'Suspendu',
  [EnumStatutChauffeur.EN_MISSION]: 'En Mission'
};

// Interface pour les statistiques
export interface ChauffeurStats {
  total: number;
  disponibles: number;
  enMission: number;
}
