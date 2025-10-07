interface ConteneurDetail {
    uuid: string;
    numeroConteneur: string;
    refBonsortie: string;
    poidNet: number;
    typecolis: string;
    naturecolis: string;
    refmanifeste: string;
    status: boolean;
    mark_1: string;
    mark_2: string;
    titreTransport: string;
  }
  
  interface ConteneurSorti {
    uuid: string;
    reference: string;
    nomcompletDriver: string;
    phoneDriver: string;
    permitDriver: string;
    destination: string;
    commune: string;
    immarticulation: string;
    status: boolean;
    numero: string;
    referenceBolorer: string;
    referenceCompagnie: string;
    quittance: string;
    referenceDeclaration: string;
    compagnie: string;
    detailAffectationConteneurDtos: ConteneurDetail[];
  }
  
  interface DashboardData {
    roleUtilisateur: string;
    codeDeclarantFiltre: string;
    dateDebut: string;
    dateFin: string;
    totalConteneursSortisAujourdhui: number;
    totalConteneursSortisSemaine: number;
    totalConteneursSortisMois: number;
    totalConteneursSortisTotal: number;
    totalConteneursEnAttente: number;
    listeConteneursSortis: {
      page: {
        size: number;
        totalElements: number;
        totalPages: number;
        pageNumber: number;
      };
      data: ConteneurSorti[];
    };
    titreTableauDeBord: string;
    messageContextuel: string;
    filtered: boolean;
  }
