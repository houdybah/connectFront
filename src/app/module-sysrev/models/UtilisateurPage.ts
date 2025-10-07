import { Utilisateur } from "./Utilisateur"

export interface UtilisateurPage{
    page: {
        size: 0,
        totalElements: 0,
        totalPages: 0,
        pageNumber: 0,
    },
    data:Utilisateur[],

}
