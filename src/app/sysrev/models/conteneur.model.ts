import { DetailAffectationConteneur } from "./DetailAffectationConteneur";

export interface Conteneur {
    id: string;
    reference: string;
    contenu: string;
    poids: number;
    destination?: string;
    selected?: boolean;
  }
  
  export interface Chauffeur {
    nom: string;
    telephone: string;
    numeroPermis: string;
    destination:string ;
    conteneurs: DetailAffectationConteneur[];
  }
  
  export interface AffectationRecu {
    reference: string;
    date: Date;
    chauffeur: Chauffeur;
    totalConteneurs: number;
  }
