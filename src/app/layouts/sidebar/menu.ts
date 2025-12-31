import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'DOUANECONNECT',
    isTitle: true,
    app: 'douaneconnect'
  },
  {
    id: 2,
    label: 'Tableau de Bord',
    icon: 'ri-dashboard-line',
    link: '/modules/admin/dashboard',
    app: 'douaneconnect'
  },
  {
    id: 3,
    label: 'Applications',
    icon: 'ri-apps-2-line',
    link: '/modules/admin/application-list',
    app: 'douaneconnect'
  },
  {
    id: 4,
    label: 'Utilisateurs',
    icon: 'ri-user-line',
    link: '/modules/admin/utilisateur-list',
    app: 'douaneconnect'
  },
  {
    id: 5,
    label: 'Audit',
    icon: 'ri-shield-check-line',
    app: 'douaneconnect',
    isCollapsed: true,
    subItems: [
      {
        id: 6,
        label: 'Journaux d\'Audit',
        icon: 'ri-file-list-3-line',
        link: '/modules/admin/audit-logs',
        parentId: 5
      },
      {
        id: 7,
        label: 'Historique Connexions',
        icon: 'ri-history-line',
        link: '/modules/admin/login-history',
        parentId: 5
      }
    ]
  },
  {
    id: 4,
    label: 'MENUITEMS.MENU.TEXT',
    isTitle: true
  },
  {
    id: 5,
    label: 'MENUITEMS.DASHBOARD.TEXT',
    icon: 'ri-dashboard-2-line',
    isCollapsed: true,
    subItems: [
      {
        id: 6,
        label: 'MENUITEMS.DASHBOARD.LIST.ANALYTICS',
        link: '/',
        parentId: 5
      },
      {
        id: 4,
        label: 'MENUITEMS.DASHBOARD.LIST.CRM',
        link: '/',
        parentId: 2
      },
      {
        id: 5,
        label: 'MENUITEMS.DASHBOARD.LIST.ECOMMERCE',
        link: '/',
        parentId: 2
      },
      {
        id: 6,
        label: 'MENUITEMS.DASHBOARD.LIST.CRYPTO',
        link: '/',
        parentId: 2
      },
      {
        id: 7,
        label: 'MENUITEMS.DASHBOARD.LIST.PROJECTS',
        link: '/',
        parentId: 2
      },
      {
        id: 7,
        label: 'MENUITEMS.DASHBOARD.LIST.NFT',
        link: '/',
        parentId: 2,
      },
      {
        id: 8,
        label: 'MENUITEMS.DASHBOARD.LIST.JOB',
        link: '/',
        parentId: 2,
      }
    ]
  },
  {
    id: 8,
    label: 'MENUITEMS.APPS.TEXT',
    icon: 'ri-apps-2-line',
    isCollapsed: true,
    subItems: [

      {
        id: 9,
        label: 'MENUITEMS.APPS.LIST.CALENDAR',
        isCollapsed: true,
        parentId: 8,
        subItems: [
          {
            id: 9,
            label: 'MENUITEMS.APPS.LIST.MAINCALENDAR',
            link: '/',
          },
          {
            id: 9,
            label: 'MENUITEMS.APPS.LIST.MONTHGRID',
            link: '/',
          }
        ]
      },

      {
        id: 10,
        label: 'MENUITEMS.APPS.LIST.CHAT',
        link: '/',
        parentId: 8
      },
      {
        id: 11,
        label: 'MENUITEMS.APPS.LIST.EMAIL',
        parentId: 8,
        subItems: [
          {
            id: 13,
            label: 'MENUITEMS.APPS.LIST.MAILBOX',
            link: '/',
            parentId: 11
          },
          {
            id: 14,
            label: 'MENUITEMS.APPS.LIST.MAILTEMPLATES',
            parentId: 11,
            subItems: [
              {
                id: 13,
                label: 'MENUITEMS.APPS.LIST.BASICACTION',
                link: '/',
                parentId: 14
              },
              {
                id: 13,
                label: 'MENUITEMS.APPS.LIST.ECOMMERCEACTION',
                link: '/',
                parentId: 14
              },
            ]
          }
        ]
      },
      {
        id: 12,
        label: 'MENUITEMS.APPS.LIST.ECOMMERCE',
        parentId: 8,
        isCollapsed: true,
        subItems: [
          {
            id: 13,
            label: 'MENUITEMS.APPS.LIST.PRODUCTS',
            link: '/',
            parentId: 12
          },
          {
            id: 14,
            label: 'MENUITEMS.APPS.LIST.PRODUCTDETAILS',
            link: '/',
            parentId: 12
          },
          {
            id: 15,
            label: 'MENUITEMS.APPS.LIST.CREATEPRODUCT',
            link: '/',
            parentId: 12
          },
          {
            id: 16,
            label: 'MENUITEMS.APPS.LIST.ORDERS',
            link: '/',
            parentId: 12
          },
          {
            id: 17,
            label: 'MENUITEMS.APPS.LIST.ORDERDETAILS',
            link: '/',
            parentId: 12
          },
          {
            id: 18,
            label: 'MENUITEMS.APPS.LIST.CUSTOMERS',
            link: '/',
            parentId: 12
          },
          {
            id: 19,
            label: 'MENUITEMS.APPS.LIST.SHOPPINGCART',
            link: '/',
            parentId: 12
          },
          {
            id: 20,
            label: 'MENUITEMS.APPS.LIST.CHECKOUT',
            link: '/',
            parentId: 12
          },
          {
            id: 21,
            label: 'MENUITEMS.APPS.LIST.SELLERS',
            link: '/',
            parentId: 12
          },
          {
            id: 22,
            label: 'MENUITEMS.APPS.LIST.SELLERDETAILS',
            link: '/',
            parentId: 12
          }
        ]
      },
      {
        id: 23,
        label: 'MENUITEMS.APPS.LIST.PROJECTS',
        parentId: 8,
        isCollapsed: true,
        subItems: [
          {
            id: 24,
            label: 'MENUITEMS.APPS.LIST.LIST',
            link: '/',
            parentId: 23
          },
          {
            id: 25,
            label: 'MENUITEMS.APPS.LIST.OVERVIEW',
            link: '/',
            parentId: 23
          },
          {
            id: 26,
            label: 'MENUITEMS.APPS.LIST.CREATEPROJECT',
            link: '/',
            parentId: 23
          }
        ]
      },
      {
        id: 27,
        label: 'MENUITEMS.APPS.LIST.TASK',
        parentId: 8,
        isCollapsed: true,
        subItems: [
          {
            id: 28,
            label: 'MENUITEMS.APPS.LIST.KANBANBOARD',
            link: '/',
            parentId: 27
          },
          {
            id: 29,
            label: 'MENUITEMS.APPS.LIST.LISTVIEW',
            link: '/',
            parentId: 27
          },
          {
            id: 30,
            label: 'MENUITEMS.APPS.LIST.TASKDETAILS',
            link: '/',
            parentId: 27
          }
        ]
      },
      {
        id: 31,
        label: 'MENUITEMS.APPS.LIST.CRM',
        parentId: 8,
        isCollapsed: true,
        subItems: [
          {
            id: 32,
            label: 'MENUITEMS.APPS.LIST.CONTACTS',
            link: '/',
            parentId: 31
          },
          {
            id: 33,
            label: 'MENUITEMS.APPS.LIST.COMPANIES',
            link: '/',
            parentId: 31
          },
          {
            id: 34,
            label: 'MENUITEMS.APPS.LIST.DEALS',
            link: '/',
            parentId: 31
          },
          {
            id: 35,
            label: 'MENUITEMS.APPS.LIST.LEADS',
            link: '/',
            parentId: 31
          }
        ]
      },
      {
        id: 36,
        label: 'MENUITEMS.APPS.LIST.CRYPTO',
        parentId: 8,
        isCollapsed: true,
        subItems: [
          {
            id: 37,
            label: 'MENUITEMS.APPS.LIST.TRANSACTIONS',
            link: '/',
            parentId: 36
          },
          {
            id: 38,
            label: 'MENUITEMS.APPS.LIST.BUY&SELL',
            link: '/',
            parentId: 36
          },
          {
            id: 38,
            label: 'MENUITEMS.APPS.LIST.ORDERS',
            link: '/',
            parentId: 36
          },
          {
            id: 39,
            label: 'MENUITEMS.APPS.LIST.MYWALLET',
            link: '/',
            parentId: 36
          },
          {
            id: 40,
            label: 'MENUITEMS.APPS.LIST.ICOLIST',
            link: '/',
            parentId: 36
          },
          {
            id: 41,
            label: 'MENUITEMS.APPS.LIST.KYCAPPLICATION',
            link: '/',
            parentId: 36
          }
        ]
      },
      {
        id: 42,
        label: 'MENUITEMS.APPS.LIST.INVOICES',
        parentId: 8,
        isCollapsed: true,
        subItems: [
          {
            id: 43,
            label: 'MENUITEMS.APPS.LIST.LISTVIEW',
            link: '/',
            parentId: 42
          },
          {
            id: 44,
            label: 'MENUITEMS.APPS.LIST.DETAILS',
            link: '/',
            parentId: 42
          },
          {
            id: 45,
            label: 'MENUITEMS.APPS.LIST.CREATEINVOICE',
            link: '/',
            parentId: 42
          }
        ]
      },
      {
        id: 46,
        label: 'MENUITEMS.APPS.LIST.SUPPORTTICKETS',
        parentId: 8,
        isCollapsed: true,
        subItems: [
          {
            id: 47,
            label: 'MENUITEMS.APPS.LIST.LISTVIEW',
            link: '/',
            parentId: 46
          },
          {
            id: 48,
            label: 'MENUITEMS.APPS.LIST.TICKETDETAILS',
            link: '/',
            parentId: 46
          }
        ]
      },
      {
        id: 46,
        label: 'MENUITEMS.APPS.LIST.NFTMARKETPLACE',
        parentId: 8,
        isCollapsed: true,
        subItems: [
          {
            id: 47,
            label: 'MENUITEMS.APPS.LIST.MARKETPLACE',
            link: '/',
            parentId: 46
          },
          {
            id: 48,
            label: 'MENUITEMS.APPS.LIST.EXPLORENOW',
            link: '/',
            parentId: 46
          },
          {
            id: 48,
            label: 'MENUITEMS.APPS.LIST.LIVEAUCTION',
            link: '/',
            parentId: 46
          },
          {
            id: 48,
            label: 'MENUITEMS.APPS.LIST.ITEMDETAILS',
            link: '/',
            parentId: 46
          },
          {
            id: 48,
            label: 'MENUITEMS.APPS.LIST.COLLECTIONS',
            link: '/',
            parentId: 46
          },
          {
            id: 48,
            label: 'MENUITEMS.APPS.LIST.CREATORS',
            link: '/',
            parentId: 46
          },
          {
            id: 48,
            label: 'MENUITEMS.APPS.LIST.RANKING',
            link: '/',
            parentId: 46
          },
          {
            id: 48,
            label: 'MENUITEMS.APPS.LIST.WALLETCONNECT',
            link: '/',
            parentId: 46
          },
          {
            id: 48,
            label: 'MENUITEMS.APPS.LIST.CREATENFT',
            link: '/',
            parentId: 46
          },
        ]
      },
      {
        id: 49,
        label: 'MENUITEMS.APPS.LIST.FILEMANAGER',
        link: '/',
        parentId: 8,
      },
      {
        id: 50,
        label: 'MENUITEMS.APPS.LIST.TODO',
        link: '/',
        parentId: 8,
      },
      {
        id: 51,
        label: 'MENUITEMS.APPS.LIST.JOBS',
        parentId: 8,
        isCollapsed: true,
        subItems: [
          {
            id: 52,
            label: 'MENUITEMS.APPS.LIST.STATISTICS',
            link: '/',
            parentId: 51
          },
          {
            id: 53,
            label: 'MENUITEMS.APPS.LIST.JOBLISTS',
            subItems: [
              {
                id: 54,
                label: 'MENUITEMS.APPS.LIST.LIST',
                link: '/',
                parentId: 53
              },
              {
                id: 55,
                label: 'MENUITEMS.APPS.LIST.GRID',
                link: '/',
                parentId: 53
              },
              {
                id: 56,
                label: 'MENUITEMS.APPS.LIST.OVERVIEW',
                link: '/',
                parentId: 53
              }
            ]
          },
          {
            id: 57,
            label: 'MENUITEMS.APPS.LIST.CANDIDATELISTS',
            isCollapsed: true,
            subItems: [
              {
                id: 58,
                label: 'MENUITEMS.APPS.LIST.LISTVIEW',
                link: '/',
                parentId: 57
              },
              {
                id: 59,
                label: 'MENUITEMS.APPS.LIST.GRIDVIEW',
                link: '/',
                parentId: 57
              }
            ]
          },
          {
            id: 60,
            label: 'MENUITEMS.APPS.LIST.APPLICATION',
            link: '/',
            parentId: 51
          },
          {
            id: 61,
            label: 'MENUITEMS.APPS.LIST.NEWJOB',
            link: '/',
            parentId: 51
          },
          {
            id: 62,
            label: 'MENUITEMS.APPS.LIST.COMPANIESLIST',
            link: '/',
            parentId: 51
          },
          {
            id: 63,
            label: 'MENUITEMS.APPS.LIST.JOBCATEGORIES',
            link: '/',
            parentId: 51
          },
        ]
      },
      {
        id: 64,
        label: 'MENUITEMS.APPS.LIST.APIKEY',
        link: '/',
        parentId: 8,
      },
    ]
  },
  {
    id: 54,
    label: 'MENUITEMS.PAGES.TEXT',
    isTitle: true
  },
  {
    id: 55,
    label: 'MENUITEMS.AUTHENTICATION.TEXT',
    icon: 'ri-account-circle-line',
    isCollapsed: true,
    subItems: [
      {
        id: 56,
        label: 'MENUITEMS.AUTHENTICATION.LIST.SIGNIN',
        parentId: 49,
        subItems: [
          {
            id: 57,
            label: 'MENUITEMS.AUTHENTICATION.LIST.BASIC',
            link: '/',
            parentId: 56
          },
          {
            id: 58,
            label: 'MENUITEMS.AUTHENTICATION.LIST.COVER',
            link: '/',
            parentId: 56
          },
        ]
      },
      {
        id: 59,
        label: 'MENUITEMS.AUTHENTICATION.LIST.SIGNUP',
        parentId: 49,
        isCollapsed: true,
        subItems: [
          {
            id: 60,
            label: 'MENUITEMS.AUTHENTICATION.LIST.BASIC',
            link: '/',
            parentId: 59
          },
          {
            id: 61,
            label: 'MENUITEMS.AUTHENTICATION.LIST.COVER',
            link: '/',
            parentId: 59
          },
        ]
      },
      {
        id: 62,
        label: 'MENUITEMS.AUTHENTICATION.LIST.PASSWORDRESET',
        parentId: 49,
        isCollapsed: true,
        subItems: [
          {
            id: 63,
            label: 'MENUITEMS.AUTHENTICATION.LIST.BASIC',
            link: '/',
            parentId: 62
          },
          {
            id: 64,
            label: 'MENUITEMS.AUTHENTICATION.LIST.COVER',
            link: '/',
            parentId: 62
          },
        ]
      },
      {
        id: 62,
        label: 'MENUITEMS.AUTHENTICATION.LIST.PASSWORDCREATE',
        parentId: 49,
        isCollapsed: true,
        subItems: [
          {
            id: 63,
            label: 'MENUITEMS.AUTHENTICATION.LIST.BASIC',
            link: '/',
            parentId: 62
          },
          {
            id: 64,
            label: 'MENUITEMS.AUTHENTICATION.LIST.COVER',
            link: '/',
            parentId: 62
          },
        ]
      },
      {
        id: 65,
        label: 'MENUITEMS.AUTHENTICATION.LIST.LOCKSCREEN',
        parentId: 49,
        isCollapsed: true,
        subItems: [
          {
            id: 66,
            label: 'MENUITEMS.AUTHENTICATION.LIST.BASIC',
            link: '/',
            parentId: 65
          },
          {
            id: 67,
            label: 'MENUITEMS.AUTHENTICATION.LIST.COVER',
            link: '/',
            parentId: 65
          },
        ]
      },
      {
        id: 68,
        label: 'MENUITEMS.AUTHENTICATION.LIST.LOGOUT',
        parentId: 49,
        isCollapsed: true,
        subItems: [
          {
            id: 69,
            label: 'MENUITEMS.AUTHENTICATION.LIST.BASIC',
            link: '/',
            parentId: 68
          },
          {
            id: 70,
            label: 'MENUITEMS.AUTHENTICATION.LIST.COVER',
            link: '/',
            parentId: 68
          },
        ]
      },
      {
        id: 71,
        label: 'MENUITEMS.AUTHENTICATION.LIST.SUCCESSMESSAGE',
        parentId: 49,
        isCollapsed: true,
        subItems: [
          {
            id: 72,
            label: 'MENUITEMS.AUTHENTICATION.LIST.BASIC',
            link: '/',
            parentId: 71
          },
          {
            id: 73,
            label: 'MENUITEMS.AUTHENTICATION.LIST.COVER',
            link: '/',
            parentId: 71
          },
        ]
      },
      {
        id: 74,
        label: 'MENUITEMS.AUTHENTICATION.LIST.TWOSTEPVERIFICATION',
        parentId: 49,
        isCollapsed: true,
        subItems: [
          {
            id: 75,
            label: 'MENUITEMS.AUTHENTICATION.LIST.BASIC',
            link: '/',
            parentId: 74
          },
          {
            id: 76,
            label: 'MENUITEMS.AUTHENTICATION.LIST.COVER',
            link: '/',
            parentId: 74
          },
        ]
      },
      {
        id: 77,
        label: 'MENUITEMS.AUTHENTICATION.LIST.ERRORS',
        parentId: 49,
        isCollapsed: true,
        subItems: [
          {
            id: 78,
            label: 'MENUITEMS.AUTHENTICATION.LIST.404BASIC',
            link: '/',
            parentId: 77
          },
          {
            id: 79,
            label: 'MENUITEMS.AUTHENTICATION.LIST.404COVER',
            link: '/',
            parentId: 77
          },
          {
            id: 80,
            label: 'MENUITEMS.AUTHENTICATION.LIST.404ALT',
            link: '/',
            parentId: 77
          },
          {
            id: 81,
            label: 'MENUITEMS.AUTHENTICATION.LIST.500',
            link: '/',
            parentId: 77
          },
          {
            id: 81,
            label: 'MENUITEMS.AUTHENTICATION.LIST.OFFLINE',
            link: '/',
            parentId: 77
          },
        ]
      },
    ]
  },
  {
    id: 82,
    label: 'MENUITEMS.PAGES.TEXT',
    icon: 'ri-pages-line',
    isCollapsed: true,
    subItems: [
      {
        id: 83,
        label: 'MENUITEMS.PAGES.LIST.STARTER',
        link: '/',
        parentId: 82
      },
      {
        id: 84,
        label: 'MENUITEMS.PAGES.LIST.PROFILE',
        parentId: 82,
        subItems: [
          {
            id: 85,
            label: 'MENUITEMS.PAGES.LIST.SIMPLEPAGE',
            link: '/',
            parentId: 84
          },
          {
            id: 86,
            label: 'MENUITEMS.PAGES.LIST.SETTINGS',
            link: '/',
            parentId: 84
          },
        ]
      },
      {
        id: 87,
        label: 'MENUITEMS.PAGES.LIST.TEAM',
        link: '/',
        parentId: 82
      },
      {
        id: 88,
        label: 'MENUITEMS.PAGES.LIST.TIMELINE',
        link: '/',
        parentId: 82
      },
      {
        id: 89,
        label: 'MENUITEMS.PAGES.LIST.FAQS',
        link: '/',
        parentId: 82
      },
      {
        id: 90,
        label: 'MENUITEMS.PAGES.LIST.PRICING',
        link: '/',
        parentId: 82
      },
      {
        id: 91,
        label: 'MENUITEMS.PAGES.LIST.GALLERY',
        link: '/',
        parentId: 82
      },
      {
        id: 92,
        label: 'MENUITEMS.PAGES.LIST.MAINTENANCE',
        link: '/',
        parentId: 82
      },
      {
        id: 93,
        label: 'MENUITEMS.PAGES.LIST.COMINGSOON',
        link: '/',
        parentId: 82
      },
      {
        id: 94,
        label: 'MENUITEMS.PAGES.LIST.SITEMAP',
        link: '/',
        parentId: 82
      },
      {
        id: 95,
        label: 'MENUITEMS.PAGES.LIST.SEARCHRESULTS',
        link: '/',
        parentId: 82
      },
      {
        id: 96,
        label: 'MENUITEMS.PAGES.LIST.PRIVACYPOLICY',
        link: '/',
        parentId: 82
      },
      {
        id: 97,
        label: 'MENUITEMS.PAGES.LIST.TERMS&CONDITIONS',
        link: '/',
        parentId: 82
      }
    ]
  },
  {
    id: 131,
    label: 'MENUITEMS.LANDING.TEXT',
    icon: 'ri-rocket-line',
    isCollapsed: true,
    subItems: [
      {
        id: 85,
        label: 'MENUITEMS.LANDING.LIST.ONEPAGE',
        link: '/',
        parentId: 84
      },
      {
        id: 86,
        label: 'MENUITEMS.LANDING.LIST.NFTLANDING',
        link: '/',
        parentId: 84,
      },
      {
        id: 87,
        label: 'MENUITEMS.LANDING.LIST.JOB',
        link: '/',
        parentId: 84,
      },
    ]
  },
  {
    id: 96,
    label: 'MENUITEMS.COMPONENTS.TEXT',
    isTitle: true
  },
  {
    id: 97,
    label: 'MENUITEMS.BASEUI.TEXT',
    icon: 'ri-pencil-ruler-2-line',
    isCollapsed: true,
    subItems: [
      {
        id: 98,
        label: 'MENUITEMS.BASEUI.LIST.ALERTS',
        link: '/',
        parentId: 97
      },
      {
        id: 99,
        label: 'MENUITEMS.BASEUI.LIST.BADGES',
        link: '/',
        parentId: 97
      },
      {
        id: 100,
        label: 'MENUITEMS.BASEUI.LIST.BUTTONS',
        link: '/',
        parentId: 97
      },
      {
        id: 101,
        label: 'MENUITEMS.BASEUI.LIST.COLORS',
        link: '/',
        parentId: 97
      },
      {
        id: 102,
        label: 'MENUITEMS.BASEUI.LIST.CARDS',
        link: '/',
        parentId: 97
      },
      {
        id: 103,
        label: 'MENUITEMS.BASEUI.LIST.CAROUSEL',
        link: '/',
        parentId: 97
      },
      {
        id: 104,
        label: 'MENUITEMS.BASEUI.LIST.DROPDOWNS',
        link: '/',
        parentId: 97
      },
      {
        id: 105,
        label: 'MENUITEMS.BASEUI.LIST.GRID',
        link: '/',
        parentId: 97
      },
      {
        id: 106,
        label: 'MENUITEMS.BASEUI.LIST.IMAGES',
        link: '/',
        parentId: 97
      },
      {
        id: 107,
        label: 'MENUITEMS.BASEUI.LIST.TABS',
        link: '/',
        parentId: 97
      },
      {
        id: 108,
        label: 'MENUITEMS.BASEUI.LIST.ACCORDION&COLLAPSE',
        link: '/',
        parentId: 97
      },
      {
        id: 109,
        label: 'MENUITEMS.BASEUI.LIST.MODALS',
        link: '/',
        parentId: 97
      },
      {
        id: 111,
        label: 'MENUITEMS.BASEUI.LIST.PLACEHOLDERS',
        link: '/',
        parentId: 97
      },
      {
        id: 112,
        label: 'MENUITEMS.BASEUI.LIST.PROGRESS',
        link: '/',
        parentId: 97
      },
      {
        id: 113,
        label: 'MENUITEMS.BASEUI.LIST.NOTIFICATIONS',
        link: '/',
        parentId: 97
      },
      {
        id: 114,
        label: 'MENUITEMS.BASEUI.LIST.MEDIAOBJECT',
        link: '/',
        parentId: 97
      },
      {
        id: 115,
        label: 'MENUITEMS.BASEUI.LIST.EMBEDVIDEO',
        link: '/',
        parentId: 97
      },
      {
        id: 116,
        label: 'MENUITEMS.BASEUI.LIST.TYPOGRAPHY',
        link: '/',
        parentId: 97
      },
      {
        id: 117,
        label: 'MENUITEMS.BASEUI.LIST.LISTS',
        link: '/',
        parentId: 97
      },
      {
        id: 117,
        label: 'MENUITEMS.BASEUI.LIST.LINKS',
        link: '/',
        badge: {
          variant: 'bg-success',
          text: 'MENUITEMS.DASHBOARD.BADGE',
        },
        parentId: 97
      },
      {
        id: 118,
        label: 'MENUITEMS.BASEUI.LIST.GENERAL',
        link: '/',
        parentId: 97
      },

      {
        id: 119,
        label: 'MENUITEMS.BASEUI.LIST.RIBBONS',
        link: '/',
        parentId: 97
      },
      {
        id: 120,
        label: 'MENUITEMS.BASEUI.LIST.UTILITIES',
        link: '/',
        parentId: 97
      }
    ]
  },
  {
    id: 121,
    label: 'MENUITEMS.ADVANCEUI.TEXT',
    icon: 'ri-stack-line',
    isCollapsed: true,
    subItems: [
      {
        id: 122,
        label: 'MENUITEMS.ADVANCEUI.LIST.SWEETALERTS',
        link: '/',
        parentId: 121
      },
      {
        id: 124,
        label: 'MENUITEMS.ADVANCEUI.LIST.SCROLLBAR',
        link: '/',
        parentId: 121
      },
      {
        id: 126,
        label: 'MENUITEMS.ADVANCEUI.LIST.TOUR',
        link: '/',
        parentId: 121
      },
      {
        id: 127,
        label: 'MENUITEMS.ADVANCEUI.LIST.SWIPERSLIDER',
        link: '/',
        parentId: 121
      },
      {
        id: 128,
        label: 'MENUITEMS.ADVANCEUI.LIST.RATTINGS',
        link: '/',
        parentId: 121
      },
      {
        id: 129,
        label: 'MENUITEMS.ADVANCEUI.LIST.HIGHLIGHT',
        link: '/',
        parentId: 121
      },
      {
        id: 130,
        label: 'MENUITEMS.ADVANCEUI.LIST.SCROLLSPY',
        link: '/',
        parentId: 121
      }
    ]
  },
  {
    id: 131,
    label: 'MENUITEMS.WIDGETS.TEXT',
    icon: 'ri-honour-line',
    link: '/s'
  },
  {
    id: 132,
    label: 'MENUITEMS.FORMS.TEXT',
    icon: 'ri-file-list-3-line',
    isCollapsed: true,
    subItems: [
      {
        id: 133,
        label: 'MENUITEMS.FORMS.LIST.BASICELEMENTS',
        link: '/',
        parentId: 132
      },
      {
        id: 134,
        label: 'MENUITEMS.FORMS.LIST.FORMSELECT',
        link: '/',
        parentId: 132
      },
      {
        id: 135,
        label: 'MENUITEMS.FORMS.LIST.CHECKBOXS&RADIOS',
        link: '/',
        parentId: 132
      },
      {
        id: 136,
        label: 'MENUITEMS.FORMS.LIST.PICKERS',
        link: '/',
        parentId: 132
      },
      {
        id: 137,
        label: 'MENUITEMS.FORMS.LIST.INPUTMASKS',
        link: '/',
        parentId: 132
      },
      {
        id: 138,
        label: 'MENUITEMS.FORMS.LIST.ADVANCED',
        link: '/',
        parentId: 132
      },
      {
        id: 139,
        label: 'MENUITEMS.FORMS.LIST.RANGESLIDER',
        link: '/',
        parentId: 132
      },
      {
        id: 140,
        label: 'MENUITEMS.FORMS.LIST.VALIDATION',
        link: '/',
        parentId: 132
      },
      {
        id: 141,
        label: 'MENUITEMS.FORMS.LIST.WIZARD',
        link: '/',
        parentId: 132
      },
      {
        id: 142,
        label: 'MENUITEMS.FORMS.LIST.EDITORS',
        link: '/',
        parentId: 132
      },
      {
        id: 143,
        label: 'MENUITEMS.FORMS.LIST.FILEUPLOADS',
        link: '/',
        parentId: 132
      },
      {
        id: 144,
        label: 'MENUITEMS.FORMS.LIST.FORMLAYOUTS',
        link: '/',
        parentId: 132
      }
    ]
  },
  {
    id: 145,
    label: 'MENUITEMS.TABLES.TEXT',
    icon: 'ri-layout-grid-line',
    isCollapsed: true,
    subItems: [
      {
        id: 146,
        label: 'MENUITEMS.TABLES.LIST.BASICTABLES',
        link: '/',
        parentId: 145
      },
      {
        id: 147,
        label: 'MENUITEMS.TABLES.LIST.GRIDJS',
        link: '/',
        parentId: 145
      },
      {
        id: 148,
        label: 'MENUITEMS.TABLES.LIST.LISTJS',
        link: '/',
        parentId: 145
      }
    ]
  },
  {
    id: 149,
    label: 'MENUITEMS.CHARTS.TEXT',
    icon: 'ri-pie-chart-line',
    isCollapsed: true,
    subItems: [
      {
        id: 150,
        label: 'MENUITEMS.CHARTS.LIST.APEXCHARTS',
        parentId: 149,
        subItems: [
          {
            id: 151,
            label: 'MENUITEMS.CHARTS.LIST.LINE',
            link: '/',
            parentId: 150
          },
          {
            id: 152,
            label: 'MENUITEMS.CHARTS.LIST.AREA',
            link: '/',
            parentId: 150
          },
          {
            id: 153,
            label: 'MENUITEMS.CHARTS.LIST.COLUMN',
            link: '/',
            parentId: 150
          },
          {
            id: 154,
            label: 'MENUITEMS.CHARTS.LIST.BAR',
            link: '/',
            parentId: 150
          },
          {
            id: 155,
            label: 'MENUITEMS.CHARTS.LIST.MIXED',
            link: '/',
            parentId: 150
          },
          {
            id: 156,
            label: 'MENUITEMS.CHARTS.LIST.TIMELINE',
            link: '/',
            parentId: 150
          },
          {
            id: 157,
            label: 'MENUITEMS.CHARTS.LIST.RANGEAREA',
            link: '/',
            badge: {
              variant: 'bg-success',
              text: 'MENUITEMS.DASHBOARD.BADGE',
            },
            parentId: 150
          },
          {
            id: 15,
            label: 'MENUITEMS.CHARTS.LIST.FUNNEL',
            link: '/',
            badge: {
              variant: 'bg-success',
              text: 'MENUITEMS.DASHBOARD.BADGE',
            },
            parentId: 150
          },
          {
            id: 158,
            label: 'MENUITEMS.CHARTS.LIST.CANDLSTICK',
            link: '/',
            parentId: 150
          },
          {
            id: 159,
            label: 'MENUITEMS.CHARTS.LIST.BOXPLOT',
            link: '/',
            parentId: 150
          },
          {
            id: 160,
            label: 'MENUITEMS.CHARTS.LIST.BUBBLE',
            link: '/',
            parentId: 150
          },
          {
            id: 161,
            label: 'MENUITEMS.CHARTS.LIST.SCATTER',
            link: '/',
            parentId: 150
          },
          {
            id: 162,
            label: 'MENUITEMS.CHARTS.LIST.HEATMAP',
            link: '/',
            parentId: 150
          },
          {
            id: 163,
            label: 'MENUITEMS.CHARTS.LIST.TREEMAP',
            link: '/',
            parentId: 150
          },
          {
            id: 164,
            label: 'MENUITEMS.CHARTS.LIST.PIE',
            link: '/',
            parentId: 150
          },
          {
            id: 165,
            label: 'MENUITEMS.CHARTS.LIST.RADIALBAR',
            link: '/',
            parentId: 150
          },
          {
            id: 166,
            label: 'MENUITEMS.CHARTS.LIST.RADAR',
            link: '/',
            parentId: 150
          },
          {
            id: 167,
            label: 'MENUITEMS.CHARTS.LIST.POLARAREA',
            link: '/',
            parentId: 150
          },
        ]
      },
      {
        id: 168,
        label: 'MENUITEMS.CHARTS.LIST.CHARTJS',
        link: '/',
        parentId: 149
      },
      {
        id: 169,
        label: 'MENUITEMS.CHARTS.LIST.ECHARTS',
        link: '/',
        parentId: 149
      }
    ]
  },
  {
    id: 170,
    label: 'MENUITEMS.ICONS.TEXT',
    icon: 'ri-compasses-2-line',
    isCollapsed: true,
    subItems: [
      {
        id: 171,
        label: 'MENUITEMS.ICONS.LIST.REMIX',
        link: '/',
        parentId: 170
      },
      {
        id: 172,
        label: 'MENUITEMS.ICONS.LIST.BOXICONS',
        link: '/',
        parentId: 170
      },
      {
        id: 173,
        label: 'MENUITEMS.ICONS.LIST.MATERIALDESIGN',
        link: '/',
        parentId: 170
      },
      {
        id: 174,
        label: 'MENUITEMS.ICONS.LIST.LINEAWESOME',
        link: '/',
        parentId: 170
      },
      {
        id: 175,
        label: 'MENUITEMS.ICONS.LIST.FEATHER',
        link: '/',
        parentId: 170
      },
      {
        id: 176,
        label: 'MENUITEMS.ICONS.LIST.CRYPTOSVG',
        link: '/',
        parentId: 170,
      },
    ]
  },
  {
    id: 175,
    label: 'MENUITEMS.MAPS.TEXT',
    icon: 'ri-map-pin-line',
    isCollapsed: true,
    subItems: [
      {
        id: 176,
        label: 'MENUITEMS.MAPS.LIST.GOOGLE',
        link: '/',
        parentId: 175
      },
      {
        id: 178,
        label: 'MENUITEMS.MAPS.LIST.LEAFLET',
        link: '/',
        parentId: 175
      }
    ]
  },
  {
    id: 179,
    label: 'MENUITEMS.MULTILEVEL.TEXT',
    icon: 'ri-share-line',
    isCollapsed: true,
    subItems: [
      {
        id: 180,
        label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.1',
        parentId: 179
      },
      {
        id: 181,
        label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.2',
        subItems: [
          {
            id: 182,
            label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.LEVEL2.1',
            parentId: 181,
          },
          {
            id: 183,
            label: 'MENUITEMS.MULTILEVEL.LIST.LEVEL1.LEVEL2.2',
            parentId: 181,
          }
        ]
      },
    ]
  },
  {
    id: 90,
    label: 'SYGDRD',
    isTitle: true,
    app: 'sygdrd'
  },
  {
    id: 100,
    label: 'SYGDRD',
    icon: 'ri-file-list-3-line',
    app: 'sygdrd',
    isCollapsed: true,
    subItems: [
      {
        id: 101,
        label: 'Tableau de Bord',
        icon: 'ri-dashboard-2-line',
        parentId: 100,
        isCollapsed: true,
        subItems: [
          {
            id: 102,
            label: 'Acceuil',
            link: '/sygdrd/dashboard/acceuil',
            parentId: 101
          },
          {
            id: 103,
            label: 'Statistiques',
            link: '/sygdrd/dashboard/statistiques',
            parentId: 101
          },
          {
            id: 104,
            label: 'Rapport et etats',
            link: '/sygdrd/dashboard/etat',
            parentId: 101
          }
        ]
      },
      {
        id: 105,
        label: 'Analyse et prevision',
        icon: 'ri-file-list-3-line',
        parentId: 100,
        isCollapsed: true,
        subItems: [
          {
            id: 106,
            label: 'Lois de Finance',
            link: '/sygdrd/analyse-synthese/loisFinance',
            parentId: 105
          },
          {
            id: 107,
            label: 'Gestion des Quotas',
            link: '/sygdrd/analyse-synthese/quota',
            parentId: 105
          },
          {
            id: 108,
            label: 'Analyse et prevision',
            link: '/sygdrd/analyse-synthese/analyseEtPrevision',
            parentId: 105
          }
        ]
      },
      {
        id: 109,
        label: 'Comptabilité',
        icon: 'ri-file-add-line',
        parentId: 100,
        isCollapsed: true,
        subItems: [
          {
            id: 110,
            label: 'Emissions et Recouvrements',
            link: '/sygdrd/comptabilite/emissionsEtRecouvrements',
            parentId: 109
          },
          {
            id: 111,
            label: 'Restes a Recouvrer',
            link: '/sygdrd/comptabilite/resteARecouvrer',
            parentId: 109
          },
          {
            id: 112,
            label: 'Controle et gestion des paiements',
            link: '/sygdrd/comptabilite/controleGestionPaiments',
            parentId: 109
          }
        ]
      },
      {
        id: 113,
        label: 'Configuration',
        icon: 'ri-database-2-line',
        parentId: 100,
        isCollapsed: true,
        subItems: [
          {
            id: 114,
            label: 'Tables de References',
            link: '/sygdrd/configuration/references',
            parentId: 113
          },
          {
            id: 115,
            label: 'Parametres',
            link: '/sygdrd/configuration/parametres',
            parentId: 113
          }
        ]
      },
      {
        id: 116,
        label: 'Gestion Utilisateur',
        icon: 'ri-user-settings-line',
        parentId: 100,
        isCollapsed: true,
        subItems: [
          {
            id: 117,
            label: 'Menu Utilisateur',
            link: '/sygdrd/gestion-utilisateur/menuUser',
            parentId: 116
          }
        ]
      }
    ]
  },
  {
    id: 1500,
    label: 'SYSREV',
    isTitle: true,
    app: 'sysrev'
  },
  {
    id: 1501,
    label: 'SYSREV',
    icon: 'ri-truck-line',
    app: 'sysrev',
    isCollapsed: true,
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
        isCollapsed: true,
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
        isCollapsed: true,
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
        isCollapsed: true,
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
        isCollapsed: true,
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
        isCollapsed: true,
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
        isCollapsed: true,
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
        isCollapsed: true,
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
        isCollapsed: true,
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
        isCollapsed: true,
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
    id: 1699,
    label: 'SYGMAK',
    isTitle: true,
    app: 'sygmak'
  },
  // SYGMAK Menu
  {
    id: 1700,
    label: 'SYGMAK',
    icon: 'ri-oil-line',
    app: 'sygmak',
    isCollapsed: true,
    subItems: [
      {
        id: 1701,
        label: 'Situation Décade',
        icon: 'ri-file-add-line',
        link: '/sygmak/stat-marketeur/situation-decadaire',
        parentId: 1700
      },
      {
        id: 1702,
        label: 'Situation Déclaration',
        icon: 'ri-file-list-3-line',
        link: '/sygmak/stat-marketeur/menu-declaration',
        parentId: 1700
      },
      {
        id: 1703,
        label: 'Quittance',
        icon: 'ri-file-list-3-line',
        link: '/sygmak/stat-marketeur/situation-quitance',
        parentId: 1700
      },
      {
        id: 1704,
        label: 'Signature',
        icon: 'ri-edit-line',
        link: '/sygmak/stat-marketeur/signature',
        parentId: 1700
      },
      {
        id: 1710,
        label: 'Gestion Utilisateurs',
        icon: 'ri-user-line',
        link: '/sygmak/gestion-utilisateur',
        parentId: 1700
      },
      {
        id: 1720,
        label: 'Gestion Abonnements',
        icon: 'ri-database-2-line',
        link: '/sygmak/gestion-abonnement',
        parentId: 1700
      }
    ]
  },
  {
    id: 1899,
    label: 'SYDACTOV',
    isTitle: true,
    app: 'sydactov'
  },
  // SYDACTOV Menu
  {
    id: 1900,
    label: 'SYDACTOV',
    icon: 'ri-calendar-check-line',
    app: 'sydactov',
    isCollapsed: true,
    subItems: [
      {
        id: 1901,
        label: 'Accueil',
        icon: 'ri-home-5-line',
        link: '/sydactov',
        parentId: 1900
      },
      {
        id: 1902,
        label: 'Déclarations',
        icon: 'ri-file-list-3-line',
        link: '/sydactov/declarations',
        parentId: 1900
      },
      {
        id: 1903,
        label: 'Activités',
        icon: 'ri-calendar-event-line',
        link: '/sydactov/activites',
        parentId: 1900
      },
      {
        id: 1904,
        label: 'Visites',
        icon: 'ri-calendar-check-line',
        link: '/sydactov/visites',
        parentId: 1900
      }
    ]
  },
  {
    id: 1999,
    label: 'SYSRECETTE',
    isTitle: true,
    app: 'sysrecette'
  },
  // SYSRECETTE Menu
  {
    id: 2000,
    label: 'SYSRECETTE',
    icon: 'ri-money-dollar-circle-line',
    app: 'sysrecette',
    isCollapsed: true,
    subItems: [
      {
        id: 2001,
        label: 'Accueil',
        icon: 'ri-home-5-line',
        link: '/sysrecette',
        parentId: 2000
      },
      {
        id: 2002,
        label: 'Gestion Recettes',
        icon: 'ri-money-dollar-circle-line',
        link: '/sysrecette/recettes',
        parentId: 2000
      },
      {
        id: 2003,
        label: 'Statistiques',
        icon: 'ri-bar-chart-line',
        link: '/sysrecette/statistiques',
        parentId: 2000
      },
      {
        id: 2004,
        label: 'Rapports',
        icon: 'ri-file-chart-line',
        link: '/sysrecette/rapports',
        parentId: 2000
      }
    ]
  }

];
