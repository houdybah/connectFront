import { Ligne } from "./Ligne";
export interface CompositionLigne {
  uuid?: string;
  ligneUuid: string;
  camionChauffeurUuid: string;
  zoneStation?: string;
  
  // Nouveaux attributs
  numeroConteneur?: string;
  validite?: string; // Format ISO: YYYY-MM-DD
  contact?: string;
  disponibilite?: string;
  position?: string;
  
  // Relations (optionnelles, pour affichage)
  ligne?: {
    uuid: string;
    numero: string;
  };
  
  camionChauffeur?: {
    uuid: string;
    camion?: {
      numero: string;
      immatriculation: string;
    };
    chauffeur?: {
      nom: string;
      prenom: string;
      phone: string;
    };
  };
  
  dateCreation?: Date;
  derniereModification?: Date;
}
