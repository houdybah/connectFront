import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'Tableau de Bord',
    icon: 'ri-dashboard-2-line',
    subItems: [
      {
        id: 2,
        label: 'Acceuil',
        link: '/tabsBord/acceuil',
        parentId: 1
      },
      {
        id: 3,
        label: 'Statistiques',
        link: '/tabsBord/statistiques',
        parentId: 1
      },
      {
        id: 4,
        label: 'Rapport et etats',
        link: '/tabsBord/etat',
        parentId: 1
      }
    ]
  },
  {
    id: 5,
    label: 'Analyse et prevision',
    icon: 'ri-file-list-3-line',
    subItems: [
      {
        id: 6,
        label: 'Lois de Finance',
        link: '/analyseSynthese/loisFinance',
        parentId: 5
      },
      {
        id: 7,
        label: 'Gestion des Quotas',
        link: '/analyseSynthese/quota',
        parentId: 5
      },
      {
        id: 8,
        label: 'Analyse et prevision',
        link: '/analyseSynthese/analyseEtPrevision',
        parentId: 5
      }
    ]
  },
  {
    id: 9,
    label: 'Comptabilité',
    icon: 'ri-file-add-line',
    subItems: [
      {
        id: 10,
        label: 'Emissions et Recouvrements',
        link: '/comptabilite/emissionsEtRecouvrements',
        parentId: 9
      },
      {
        id: 11,
        label: 'Restes a Recouvrer',
        link: '/comptabilite/resteARecouvrer',
        parentId: 9
      },
      {
        id: 12,
        label: 'Controle et gestion des paiements',
        link: '/comptabilite/controleGestionPaiments',
        parentId: 9
      }
    ]
  },
  {
    id: 13,
    label: 'Configuration',
    icon: 'ri-database-2-line',
    subItems: [
      {
        id: 14,
        label: 'Tables de References',
        link: '/configuration/references',
        parentId: 13
      },
      {
        id: 15,
        label: 'Parametres',
        link: '/configuration/parametres',
        parentId: 13
      }
    ]
  }
];
