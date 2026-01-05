import { Privilege } from './Privilege';

export class Profile {
    uuid: string = '';
    nom: string = '';
    description: string = '';
    uuidApplication: string = '';
    codeApplication: string = '';
    nomApplication: string = '';
    privilegesAttributed: Privilege[] = []; // Corrigé: avec 2 't' pour correspondre au backend
    dateCreated?: Date;
    lastUpdated?: Date;
}

