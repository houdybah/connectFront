import { Role } from './role.enum';

export interface User {
  uuid: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  service?: string;
  fonction?: string;
  role?: Role;
  active?: boolean;
  enabled: boolean;
  nonLocked: boolean;
  nonExpired: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserApplicationAccess {
  uuid: string;
  userUuid: string;
  applicationUuid: string;
  hasAccess: boolean;
  enabled: boolean;
  grantedAt?: Date;
  revokedAt?: Date;
}

