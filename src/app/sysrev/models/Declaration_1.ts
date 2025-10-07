import { BonBolorer } from "./BonBolorer";
import { BonCompagnie } from "./BonCompagnie";
import { BonSortie_1 } from "./BonSortie_1";
import { Declarant } from "./Declarant";

export class Declaration_1{
  uuid: string = "";
  refDeclarant: string = "";
  annee: string = "";
  quitance: string = "";
  numbl: string = "";
  office: string = "";
  codeOffice:string = "";
  montant:number = 0;
  dateLiquidation:any;
  dateQuittance:any;
  bonSortieSydoniaDto = new BonSortie_1();
  declarant = new Declarant()
  bonCompagnieDto = new BonCompagnie();
  bonSortieBolorerDto = new BonBolorer();
}
