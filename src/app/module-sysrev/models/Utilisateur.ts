import { Declarant } from "./Declarant";

export class Utilisateur{
    uuid: string ="";
    username: string ="";
    prenom:string="";
    nom:string = "";
    telephone: string ="";
    email: string ="";
    password: string ="";
    codeDeclarant: string ="";
    codeEntreprise:string = "";
    declarant: string ="";
    adresse: string ="";
    roles:string[] = [];
    nonExpired: boolean = false;
    nonLocked: boolean = false;
    enabled: boolean = false;
    photoUrl:string ="";
    declarantDto:Declarant = new Declarant();
}
