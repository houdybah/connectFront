import { Profile } from './Profile';

export interface UserProfile {
    uuid?: string;
    uuidUtilisateur?: string;
    emailUtilisateur?: string;
    nomUtilisateur?: string;
    prenomUtilisateur?: string;
    uuidProfile: string;
    nomProfile?: string;
    descriptionProfile?: string;
    uuidApplication?: string;
    codeApplication?: string;
    nomApplication?: string;
    colorApplication?: string;
    iconApplication?: string;
    hasAccess: boolean;
    enabled: boolean;
    nonExpired: boolean;
    nonLocked: boolean;
    profileDto?: Profile;
    dateCreated?: Date;
    lastUpdated?: Date;
}

