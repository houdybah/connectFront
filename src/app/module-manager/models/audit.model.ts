// Modèles pour l'audit - alignés avec le backend

export interface AuditLog {
  uuid: string;
  entityName: string;
  entityId?: string;
  actionType: ActionType;
  userEmail?: string;
  userName?: string;
  actionDate: string;
  ipAddress?: string;
  userAgent?: string;
  oldValue?: string;
  newValue?: string;
  description?: string;
  sessionId?: string;
  dateCreated: string;
  lastUpdated: string;
}

export enum ActionType {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  ACCESS_GRANTED = 'ACCESS_GRANTED',
  ACCESS_DENIED = 'ACCESS_DENIED',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  CONFIG_CHANGE = 'CONFIG_CHANGE'
}

export interface LoginHistory {
  uuid: string;
  email: string;
  codeApplication?: string;
  nomApplication?: string;
  loginDate: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  failureReason?: string;
  sessionId?: string;
  dateCreated: string;
  lastUpdated: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface LoginStats {
  successfulLogins: number;
  failedLogins: number;
}

// Type pour les filtres de recherche
export interface AuditSearchFilter {
  email?: string;
  entityName?: string;
  actionType?: ActionType;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  size?: number;
}

export interface LoginHistorySearchFilter {
  email?: string;
  codeApp?: string;
  successOnly?: boolean;
  failedOnly?: boolean;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  size?: number;
}

