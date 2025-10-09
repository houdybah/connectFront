import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'SYGDRD',
    icon: 'ri-money-dollar-circle-line',
    subItems: [
      {
        id: 2,
        label: 'Tableau de Bord',
        icon: 'ri-dashboard-2-line',
        subItems: [
          {
            id: 3,
            label: 'Acceuil',
            link: '/sygdrd/dashboard/acceuil',
            parentId: 2
          },
          {
            id: 4,
            label: 'Statistiques',
            link: '/sygdrd/dashboard/statistiques',
            parentId: 2
          },
          {
            id: 5,
            label: 'Rapport et etats',
            link: '/sygdrd/dashboard/etat',
            parentId: 2
          }
        ]
      },
      {
        id: 6,
        label: 'Analyse et prevision',
        icon: 'ri-file-list-3-line',
        subItems: [
          {
            id: 7,
            label: 'Lois de Finance',
            link: '/sygdrd/analyse-synthese/loisFinance',
            parentId: 6
          },
          {
            id: 8,
            label: 'Gestion des Quotas',
            link: '/sygdrd/analyse-synthese/quota',
            parentId: 6
          },
          {
            id: 9,
            label: 'Analyse et prevision',
            link: '/sygdrd/analyse-synthese/analyseEtPrevision',
            parentId: 6
          }
        ]
      },
      {
        id: 10,
        label: 'Comptabilité',
        icon: 'ri-file-add-line',
        subItems: [
          {
            id: 11,
            label: 'Emissions et Recouvrements',
            link: '/sygdrd/comptabilite/emissionsEtRecouvrements',
            parentId: 10
          },
          {
            id: 12,
            label: 'Restes a Recouvrer',
            link: '/sygdrd/comptabilite/resteARecouvrer',
            parentId: 10
          },
          {
            id: 13,
            label: 'Controle et gestion des paiements',
            link: '/sygdrd/comptabilite/controleGestionPaiments',
            parentId: 10
          }
        ]
      },
      {
        id: 14,
        label: 'Configuration',
        icon: 'ri-database-2-line',
        subItems: [
          {
            id: 15,
            label: 'Tables de References',
            link: '/sygdrd/configuration/references',
            parentId: 14
          },
          {
            id: 16,
            label: 'Parametres',
            link: '/sygdrd/configuration/parametres',
            parentId: 14
          }
        ]
      },
      {
        id: 17,
        label: 'Gestion Utilisateur',
        icon: 'ri-user-settings-line',
        subItems: [
          {
            id: 18,
            label: 'Menu Utilisateur',
            link: '/sygdrd/gestion-utilisateur/menuUser',
            parentId: 17
          }
        ]
      }
    ]
  },
  
  {
    id: 1501,
    label: 'SYSREV',
    icon: 'ri-truck-line',
    subItems: [
      {
        id: 1502,
        label: 'Tableau de Bord',
        link: '/sysrev/schedule-parc/tableaudebord',
        parentId: 1501
      },
      {
        id: 1503,
        label: 'Gestion SDT',
        parentId: 1501,
        subItems: [
          {
            id: 1504,
            label: 'Dashboard SDT',
            link: '/sysrev/schedule-parc/sdt/Dashboard',
            parentId: 1503
          },
          {
            id: 1505,
            label: 'Notifications',
            link: '/sysrev/schedule-parc/sdt/notifications',
            parentId: 1503
          },
          {
            id: 1506,
            label: 'Mes Lignes',
            link: '/sysrev/schedule-parc/sdt/mes-lignes',
            parentId: 1503
          },
          {
            id: 1507,
            label: 'Camions SDT',
            link: '/sysrev/schedule-parc/sdt/Camions',
            parentId: 1503
          },
          {
            id: 1508,
            label: 'Chauffeurs SDT',
            link: '/sysrev/schedule-parc/sdt/Chauffeurs',
            parentId: 1503
          }
        ]
      },
      {
        id: 1510,
        label: 'Gestion Camions',
        parentId: 1501,
        subItems: [
          {
            id: 1511,
            label: 'Liste Camions',
            link: '/sysrev/schedule-parc/camions',
            parentId: 1510
          },
          {
            id: 1512,
            label: 'Nouveau Camion',
            link: '/sysrev/schedule-parc/camions/nouveau',
            parentId: 1510
          }
        ]
      },
      {
        id: 1515,
        label: 'Gestion Chauffeurs',
        parentId: 1501,
        subItems: [
          {
            id: 1516,
            label: 'Liste Chauffeurs',
            link: '/sysrev/schedule-parc/chauffeurs',
            parentId: 1515
          },
          {
            id: 1517,
            label: 'Nouveau Chauffeur',
            link: '/sysrev/schedule-parc/chauffeurs/nouveau',
            parentId: 1515
          }
        ]
      },
      {
        id: 1520,
        label: 'Affectations',
        parentId: 1501,
        subItems: [
          {
            id: 1521,
            label: 'Liste Affectations',
            link: '/sysrev/schedule-parc/affectations',
            parentId: 1520
          },
          {
            id: 1522,
            label: 'Nouvelle Affectation',
            link: '/sysrev/schedule-parc/affectations/nouveau',
            parentId: 1520
          }
        ]
      },
      {
        id: 1525,
        label: 'Programmes & Lignes',
        parentId: 1501,
        subItems: [
          {
            id: 1526,
            label: 'Demandes CKT',
            link: '/sysrev/schedule-parc/demandes-ckt',
            parentId: 1525
          },
          {
            id: 1527,
            label: 'Gestion Lignes',
            link: '/sysrev/schedule-parc/sdt/Lignes',
            parentId: 1525
          },
          {
            id: 1528,
            label: 'Liste Programmes',
            link: '/sysrev/schedule-parc/liste-programmes',
            parentId: 1525
          }
        ]
      },
      {
        id: 1530,
        label: 'Rendez-vous',
        parentId: 1501,
        subItems: [
          {
            id: 1531,
            label: 'Liste Rendez-vous',
            link: '/sysrev/schedule-parc/rendez-vous',
            parentId: 1530
          },
          {
            id: 1532,
            label: 'Rendez-vous Sortie',
            link: '/sysrev/schedule-parc/rendez-vous/sortie',
            parentId: 1530
          },
          {
            id: 1533,
            label: 'Rendez-vous Global',
            link: '/sysrev/schedule-parc/rendez-vous/globale',
            parentId: 1530
          }
        ]
      },
      {
        id: 1540,
        label: 'Déclarations',
        parentId: 1501,
        subItems: [
          {
            id: 1541,
            label: 'Segment Général',
            link: '/sysrev/schedule-parc/segment-general',
            parentId: 1540
          },
          {
            id: 1542,
            label: 'Nouvelle Déclaration',
            link: '/sysrev/schedule-parc/segment-general-form',
            parentId: 1540
          },
          {
            id: 1543,
            label: 'Appurement',
            link: '/sysrev/schedule-parc/appurement',
            parentId: 1540
          },
          {
            id: 1544,
            label: 'Scanner QR Code',
            link: '/sysrev/schedule-parc/scanner',
            parentId: 1540
          }
        ]
      },
      {
        id: 1550,
        label: 'Paiement Douane',
        parentId: 1501,
        subItems: [
          {
            id: 1551,
            label: 'Déclaration Paiement',
            link: '/sysrev/douane-payment/declaration',
            parentId: 1550
          },
          {
            id: 1552,
            label: 'Liste Déclarations',
            link: '/sysrev/douane-payment/liste-declaration',
            parentId: 1550
          }
        ]
      },
      {
        id: 1560,
        label: 'Statistiques',
        parentId: 1501,
        subItems: [
          {
            id: 1561,
            label: 'Statistiques Générales',
            link: '/sysrev/schedule-parc/stats',
            parentId: 1560
          },
          {
            id: 1562,
            label: 'Statistiques Douane',
            link: '/sysrev/schedule-parc/statistiques',
            parentId: 1560
          },
          {
            id: 1563,
            label: 'Destinations Conteneurs',
            link: '/sysrev/schedule-parc/destination',
            parentId: 1560
          }
        ]
      },
      {
        id: 1570,
        label: 'Utilisateurs',
        link: '/sysrev/schedule-parc/utilisateur',
        parentId: 1501
      },
      {
        id: 1580,
        label: 'Changer Mot de Passe',
        link: '/sysrev/schedule-parc/change-password',
        parentId: 1501
      }
    ]
  },
  {
    id: 22,
    label: 'SYGMAK',
    icon: 'ri-oil-line',
    subItems: [
      {
        id: 23,
        label: 'Situation Décade',
        icon: 'ri-file-add-line',
        link: '/sygmak/stat-marketeur/situation-decadaire',
        parentId: 22
      },
      {
        id: 24,
        label: 'Situation Déclaration',
        icon: 'ri-file-list-3-line',
        link: '/sygmak/stat-marketeur/menu-declaration',
        parentId: 22
      },
      {
        id: 25,
        label: 'Quittance',
        icon: 'ri-file-list-3-line',
        link: '/sygmak/stat-marketeur/situation-quitance',
        parentId: 22
      },
      {
        id: 26,
        label: 'Signature',
        icon: 'ri-edit-line',
        link: '/sygmak/stat-marketeur/signature',
        parentId: 22
      },
      {
        id: 27,
        label: 'Gestion Utilisateurs',
        icon: 'ri-user-line',
        link: '/sygmak/gestion-utilisateur',
        parentId: 22
      },
      {
        id: 28,
        label: 'Gestion Abonnements',
        icon: 'ri-database-2-line',
        link: '/sygmak/gestion-abonnement',
        parentId: 22
      }
    ]
  },
  {
    id: 19,
    label: 'DOUANEAPP',
    icon: 'ri-settings-3-line',
    subItems: [
      {
        id: 20,
        label: 'Liste des Modules',
        link: '/modules/list',
        parentId: 19
      },
      {
        id: 21,
        label: 'Nouveau Module',
        link: '/modules/create',
        parentId: 19
      }
    ]
  }
];
