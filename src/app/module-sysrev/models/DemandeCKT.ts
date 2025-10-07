import { Ligne } from './Ligne';
export interface DemandeCKT {
  uuid?: string;
  numero: string;
  horaire: string;
  date: string; // Format ISO: 'YYYY-MM-DD' (LocalDate)
  heure: string; // Format: 'HH:mm:ss' (LocalTime)
  capacite: number;
  
  // Relations (optionnelles, pour affichage)
  lignes?: Ligne[];
  
  dateCreation?: Date;
  derniereModification?: Date;
}
