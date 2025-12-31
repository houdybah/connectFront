// Modèles alignés avec le backend DashboardStatsDto
export interface DashboardStats {
  applicationStats: ApplicationStatsSummary;
  utilisateurStats: UtilisateurStatsSummary;
  loginStats: LoginStatsSummary;
  topApplications: TopApplication[];
  topUtilisateurs: TopUtilisateur[];
  recentLogins: RecentLogin[];
}

export interface ApplicationStatsSummary {
  total: number;
  actives: number;
  inactives: number;
}

export interface UtilisateurStatsSummary {
  total: number;
  actifs: number;
  inactifs: number;
}

export interface LoginStatsSummary {
  aujourdhui: number;
  cetteSemaine: number;
  ceMois: number;
  total: number;
}

export interface TopApplication {
  code: string;
  nom: string;
  icon?: string;
  color?: string;
  nombreConnexions: number;
}

export interface TopUtilisateur {
  email: string;
  nom: string;
  prenom: string;
  nombreConnexions: number;
  derniereConnexion: string;
}

export interface RecentLogin {
  email: string;
  nom: string;
  prenom: string;
  application: string;
  dateConnexion: string;
  ipAddress?: string;
  success: boolean;
}

// Anciens modèles conservés pour compatibilité
export interface ApplicationStats {
  applicationName: string;
  applicationCode: string;
  totalUsers: number;
  activeUsers: number;
  totalConnections: number;
  lastConnection?: Date;
}

export interface UserStats {
  userName: string;
  userEmail: string;
  totalConnections: number;
  lastConnection?: Date;
  activeApplications: number;
}

export interface ConnectionLog {
  uuid: string;
  userUuid: string;
  userName: string;
  userEmail: string;
  applicationUuid: string;
  applicationName: string;
  connectionDate: Date;
  ipAddress?: string;
  userAgent?: string;
}

