import { ReferenceTransaction } from "./ReferenceTransaction";
import { TransactionStatus } from "./TransactionStatus";

export class DetailTransaction{
  uuid: string = "";
  montantLiquidation: number = 0;
  montantToBePay: number = 0;
  numeroBl:number =  0;
  referenceBl: string = "";
  uuidUtilisateur: string = ""
  avisDouane: any;
  avisGuceg: any;
  avisDeclarant: any;
  montantTransaction: number = 0;
  nombreDeclaration: number = 0;
  codeEntreprise: string = "";
  office: string = "";
  dateTransaction: any
  reference: string = "";
  numeroQuittance:string = "";
  transactionStatusDtos:TransactionStatus[] = [];
  referenceTransactionDtos:ReferenceTransaction[] = [];
  selected: boolean = false
}
