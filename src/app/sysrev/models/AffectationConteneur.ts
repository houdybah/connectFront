import { DetailAffectationConteneur } from "./DetailAffectationConteneur";

export class AffectationConteneur{
  uuid: string = "";
  reference: string = "";
  nomcompletDriver: string = "";
  phoneDriver: string = "";
  permitDriver:string = "";
  destination: string = "";
  commune: string = "";
  immarticulation: string = "";
  status: boolean = false;
  numero: string = "";
  utilisateurUuid: string = "";
  declarationUuid: string = "";
  referenceBolorer: string = "";
  referenceCompagnie: string = "";
  quittance: string = "";
  referenceDeclaration: string = "";
  qrCodeGenerate:string ="";
  compagnie:string = "";
  camionChauffeurUuid: string = "";
  detailAffectationConteneurDtos:DetailAffectationConteneur[]=[];
  isSelectedProgramme:any;
  
  // ✅ PROPRIÉTÉ AJOUTÉE
  dateSortie?: Date | string;
}
