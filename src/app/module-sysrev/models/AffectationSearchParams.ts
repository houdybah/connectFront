// Interface pour les filtres de recherche
export interface AffectationSearchParams {
  keyword?: string;
  status?: 'ACTIF' | 'INACTIF';
  statusEtat?: 'DISPONIBLE' | 'EN_MISSION' | 'EN_REPOS' | 'MAINTENANCE';
  position?: 'PARC' | 'TERMINAL' | 'EN_ROUTE' | 'GARAGE';
  page?: number;
  size?: number;
}
