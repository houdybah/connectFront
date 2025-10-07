// Enums pour les statuts
export enum EnumStatusCamionChauffeur {
  ACTIF = 'ACTIF',
  INACTIF = 'INACTIF',
  SUSPENDU = 'SUSPENDU'
}

export enum EnumStatusEtat {
  DISPONIBLE = 'DISPONIBLE',
  EN_MISSION = 'EN_MISSION',
  HORS_SERVICE = 'HORS_SERVICE',
  OCCUPE = 'OCCUPE', 
  EN_REPARATION = 'EN_REPARATION', 
 
}

export interface CamionChauffeur {
  uuid?: string;
  camionUuid: string;
  chauffeurUuid: string;
  status: EnumStatusCamionChauffeur;
  statusEtat: EnumStatusEtat;
  position?: string;
  
  // Relations (optionnelles, pour affichage)
  camion?: {
    uuid: string;
    numero: string;
    immatriculation: string;
    marque: string;
    model: string;
    typeConteneur: string;
    capacite: number;
  };
  
  chauffeur?: {
    uuid: string;
    nom: string;
    prenom: string;
    permis: string;
    phone: string;
    email: string;
  };
  
  conteneurAffectations?: any[];
  compositionLignes?: any[];
  
  dateCreation?: Date;
  derniereModification?: Date;
}

// Labels pour l'affichage
export const StatusCamionChauffeurLabels = {
  [EnumStatusCamionChauffeur.ACTIF]: 'Actif',
  [EnumStatusCamionChauffeur.INACTIF]: 'Inactif',
  [EnumStatusCamionChauffeur.SUSPENDU]: 'Suspendu'
};

export const StatusEtatLabels = {
  [EnumStatusEtat.DISPONIBLE]: 'Disponible',
  [EnumStatusEtat.EN_MISSION]: 'En Mission',
  [EnumStatusEtat.OCCUPE]: 'Occupe',
  [EnumStatusEtat.HORS_SERVICE]: 'Hors Service',
  [EnumStatusEtat.EN_REPARATION]: 'En Reparation'

};
