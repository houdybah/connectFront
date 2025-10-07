import { CompositionLigne } from './CompositionLigne';
// Enum pour le statut de la ligne
export enum EnumStatusLigne {
  EN_ATTENTE= 'EN_ATTENTE', 
  EN_COURS = 'EN_COURS',
  TERMINE = 'TERMINE',
  ANNULE = 'ANNULE'
}

export interface Ligne {
  uuid?: string;
  numero: string;
  status: EnumStatusLigne;
  date: string; // Format ISO: 'YYYY-MM-DD'
  heure: string; // Format: 'HH:mm'
  capacite: number;
  demandeCKTUuid: string;
  horaire: string;
 
  // Relations (optionnelles, pour affichage)
  demandeCKT?: {
    uuid: string;
    numero: string;
    horaire: string;
  };
  
  compositionLignes?: CompositionLigne[];
  
  dateCreation?: Date;
  derniereModification?: Date;
}


