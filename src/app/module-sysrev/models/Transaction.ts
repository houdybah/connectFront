import { DetailTransaction } from "./DetailTransaction";

export class Transaction{
    uuid:string = "";
    codeDeclarant:string = "";
    montantTransaction:number=0;
    nombreDeclaration:number = 0;
    codeEntreprise:string="";
    office:string = "";
    dateTransaction:string="";
    isConforme:boolean = false;
    detailTransactionDtos:DetailTransaction[] = [];
  
}
