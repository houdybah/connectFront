import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'SYGDRD',
    icon: 'ri-building-line',
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
    id: 19,
    label: 'Modules',
    icon: 'ri-module-line',
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
