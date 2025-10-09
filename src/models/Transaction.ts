import { TransactionStatus } from "./TransactionStatus";

export class Transaction{
  uuid: string ="";
  date: string ="";
  dateEncaissement: string ="";
  office: string ="";
  reference: string ="";
  montant: number = 0;
  enumTypePaiement: any;
  avisDouane: any;
  avisGuceg: any;
  avisDeclarant: any;
  codeDeclarant: string ="";
  codeEntreprise: string ="";
  referenceBl: string ="";
  numeroBl: any;
  uuidUtilisateur: string ="";
  transactionStatusDtos:TransactionStatus[] = [];
}
