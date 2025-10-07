// Enum pour le type de conteneur
export enum EnumTypeConteneur {
  VINGT_PIEDS = 'VINGT_PIEDS',
  QUARANTE_PIEDS = 'QUARANTE_PIEDS'
}

export interface Camion {
  uuid?: string;
  numero: string;
  immatriculation: string;
  model: string;  // Notez: "model" pas "modele" pour correspondre au backend
  marque: string;
  typeConteneur: EnumTypeConteneur;
  capacite: number;
  
  // Relations (optionnelles, pour affichage)
  camionChauffeurs?: any[];
  
  dateCreation?: Date;
  derniereModification?: Date;
}

// Helper pour l'affichage
export const TypeConteneurLabels = {
  [EnumTypeConteneur.VINGT_PIEDS]: '20 pieds',
  [EnumTypeConteneur.QUARANTE_PIEDS]: '40 pieds'
};
