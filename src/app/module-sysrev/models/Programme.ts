import { Ligne } from './Ligne';
export interface Programme {
  uuid?: string;
  numero: string;
  date: Date;
  horaire: 'MATIN' | 'APRES_MIDI';
  heureDebut: string;
  heureFin: string;
  capaciteTotale: number;
  occupation: number;
  statut: 'OUVERT' | 'COMPLET' | 'FERME';
  observations?: string;
  dateCreation?: Date;
  derniereModification?: Date;
  
  // Relation avec les lignes
  lignes?: Ligne[];
}
