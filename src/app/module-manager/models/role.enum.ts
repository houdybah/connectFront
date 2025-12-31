/**
 * Énumération des rôles utilisateurs dans le système DouaneConnect
 * 
 * SUPER_USER : Administrateur avec accès complet au système
 * USER_APP   : Utilisateur standard avec accès aux applications autorisées
 */
export enum Role {
  SUPER_USER = 'SUPER_USER',  // Administrateur système avec tous les droits
  USER_APP = 'USER_APP'         // Utilisateur applicatif standard
}

/**
 * Labels affichables pour les rôles
 */
export const RoleLabels: Record<Role, string> = {
  [Role.SUPER_USER]: 'Super Utilisateur',
  [Role.USER_APP]: 'Utilisateur Application'
};

/**
 * Descriptions des rôles
 */
export const RoleDescriptions: Record<Role, string> = {
  [Role.SUPER_USER]: 'Accès complet au système avec tous les droits d\'administration',
  [Role.USER_APP]: 'Accès limité aux applications autorisées'
};

/**
 * Liste des rôles disponibles (pour les dropdowns)
 */
export const RoleOptions = [
  { value: Role.SUPER_USER, label: RoleLabels[Role.SUPER_USER], description: RoleDescriptions[Role.SUPER_USER] },
  { value: Role.USER_APP, label: RoleLabels[Role.USER_APP], description: RoleDescriptions[Role.USER_APP] }
];

