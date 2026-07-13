import { UserProfile } from "./UserProfile";
import { Role } from "./role.enum";
import {Attribut} from "./Attribut";

export class Utilisateur {
    uuid:string = "";
    email:string = "";
    telephone:string = "";
    nom:string = "";
    prenom:string = "";
    service:string = "";
    fonction:string = "";
    role:Role | null = null;
    active:boolean = true;
    password:string = "";
    enabled:boolean = true;
    userProfileDtos:UserProfile[] = [];
    userAttributDtos:Attribut[] = [];
}