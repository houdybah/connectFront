import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { MENU } from './menu';
import { MenuItem } from './menu.model';
import { environment } from 'src/environments/environment';
import { MenuVisibilityService } from '../../core/services/menu-visibility.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  menu: any;
  toggle: any = true;
  menuItems: MenuItem[] = [];
  allMenuItems: MenuItem[] = MENU;
  selectedApp: string | null = null;
  @ViewChild('sideMenu') sideMenu!: ElementRef;
  @Output() mobileMenuButtonClicked = new EventEmitter();

  constructor(
    private router: Router, 
    public translate: TranslateService,
    private menuVisibilityService: MenuVisibilityService
  ) {
    translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    console.log('🎬 SidebarComponent initialisé');
    
    // S'abonner à l'application sélectionnée
    this.menuVisibilityService.selectedApp$.subscribe(app => {
      console.log('🔄 Application sélectionnée changée:', app);
      this.selectedApp = app;
      this.filterMenuByApp(app);
      
      // Réinitialiser le menu actif après le filtrage
      setTimeout(() => {
        this.initActiveMenu();
      }, 100);
    });
    
    this.router.events.subscribe((event) => {
      if (document.documentElement.getAttribute('data-layout') != "twocolumn") {
        if (event instanceof NavigationEnd) {
          this.initActiveMenu();
        }
      }
    });
  }

  filterMenuByApp(app: string | null): void {
    console.log('🔍 Filtrage du menu pour l\'app:', app);
    
    if (!app) {
      console.log('⚠️ Pas d\'application sélectionnée, menu vide');
      this.menuItems = [];
      return;
    }

    // Filtrer le menu en fonction de l'application
    if (app === 'sysrev') {
      console.log('📋 Filtrage menu SYSREV');
      // Transformer les sous-menus en éléments de menu principaux
      this.menuItems = this.flattenSysrevMenu();
      console.log('✅ Menu SYSREV chargé:', this.menuItems.length, 'éléments');
    } else if (app === 'sygmak') {
      console.log('📋 Filtrage menu SYGMAK');
      // Transformer les sous-menus en éléments de menu principaux
      this.menuItems = this.flattenSygmakMenu();
      console.log('✅ Menu SYGMAK chargé:', this.menuItems.length, 'éléments');
    } else if (app === 'douaneconnect') {
      console.log('📋 Filtrage menu DouaneConnect');
      // Filtrer pour afficher uniquement les menus généraux (id < 1500)
      this.menuItems = this.allMenuItems.filter(item => 
        !item.id || item.id < 1500
      );
      console.log('✅ Menu DouaneConnect chargé:', this.menuItems.length, 'éléments');
    } else if (app === 'sygdrd') {
      console.log('📋 Filtrage menu SYGDRD');
      // Pour l'instant, pas de menu spécifique SYGDRD, afficher les menus généraux
      this.menuItems = this.allMenuItems.filter(item => 
        !item.id || item.id < 1500
      );
      console.log('✅ Menu SYGDRD chargé:', this.menuItems.length, 'éléments');
    } else {
      console.log('⚠️ Application inconnue:', app);
      this.menuItems = [];
    }
  }

  flattenSysrevMenu(): MenuItem[] {
    console.log('🔧 Transformation du menu SYSREV...');
    const sysrevMainMenu = this.allMenuItems.find(item => item.id === 1501);
    
    if (!sysrevMainMenu) {
      console.log('❌ Menu SYSREV principal (id: 1501) non trouvé!');
      return [];
    }
    
    if (!sysrevMainMenu.subItems) {
      console.log('❌ Pas de sous-menus dans le menu SYSREV!');
      return [];
    }

    console.log('✅ Menu SYSREV trouvé avec', sysrevMainMenu.subItems.length, 'sous-menus');

    // Ajouter un titre pour l'application
    const titleItem: MenuItem = {
      id: 9999,
      label: 'SYSREV - Système de Révision',
      isTitle: true
    };

    // Transformer les sous-menus en éléments de menu principaux
    const flatMenu: MenuItem[] = sysrevMainMenu.subItems.map((subItem: MenuItem) => ({
      ...subItem,
      parentId: undefined, // Enlever le parentId pour en faire un élément principal
      isCollapsed: subItem.subItems ? true : undefined
    }));

    console.log('✅ Menu SYSREV transformé:', flatMenu.length, 'éléments');
    return [titleItem, ...flatMenu];
  }

  flattenSygmakMenu(): MenuItem[] {
    console.log('🔧 Transformation du menu SYGMAK...');
    const sygmakMainMenu = this.allMenuItems.find(item => item.id === 1700);
    
    if (!sygmakMainMenu) {
      console.log('❌ Menu SYGMAK principal (id: 1700) non trouvé!');
      return [];
    }
    
    if (!sygmakMainMenu.subItems) {
      console.log('❌ Pas de sous-menus dans le menu SYGMAK!');
      return [];
    }

    console.log('✅ Menu SYGMAK trouvé avec', sygmakMainMenu.subItems.length, 'sous-menus');

    // Ajouter un titre pour l'application
    const titleItem: MenuItem = {
      id: 9998,
      label: 'SYGMAK - Gestion Magasins',
      isTitle: true
    };

    // Transformer les sous-menus en éléments de menu principaux
    const flatMenu: MenuItem[] = sygmakMainMenu.subItems.map((subItem: MenuItem) => ({
      ...subItem,
      parentId: undefined, // Enlever le parentId pour en faire un élément principal
      isCollapsed: subItem.subItems ? true : undefined
    }));

    console.log('✅ Menu SYGMAK transformé:', flatMenu.length, 'éléments');
    return [titleItem, ...flatMenu];
  }

  /***
   * Activate droup down set
   */
  ngAfterViewInit() {
    setTimeout(() => {
      this.initActiveMenu();
    }, 0);
  }

  removeActivation(items: any) {
    items.forEach((item: any) => {
      item.classList.remove("active");
    });
  }

  toggleItem(item: any) {
    this.menuItems.forEach((menuItem: any) => {

      if (menuItem == item) {
        menuItem.isCollapsed = !menuItem.isCollapsed
      } else {
        menuItem.isCollapsed = true
      }
      if (menuItem.subItems) {
        menuItem.subItems.forEach((subItem: any) => {

          if (subItem == item) {
            menuItem.isCollapsed = !menuItem.isCollapsed
            subItem.isCollapsed = !subItem.isCollapsed
          } else {
            subItem.isCollapsed = true
          }
          if (subItem.subItems) {
            subItem.subItems.forEach((childitem: any) => {

              if (childitem == item) {
                childitem.isCollapsed = !childitem.isCollapsed
                subItem.isCollapsed = !subItem.isCollapsed
                menuItem.isCollapsed = !menuItem.isCollapsed
              } else {
                childitem.isCollapsed = true
              }
              if (childitem.subItems) {
                childitem.subItems.forEach((childrenitem: any) => {

                  if (childrenitem == item) {
                    childrenitem.isCollapsed = false
                    childitem.isCollapsed = false
                    subItem.isCollapsed = false
                    menuItem.isCollapsed = false
                  } else {
                    childrenitem.isCollapsed = true
                  }
                })
              }
            })
          }
        })
      }
    });
  }

  activateParentDropdown(item: any) {
    item.classList.add("active");
    let parentCollapseDiv = item.closest(".collapse.menu-dropdown");

    if (parentCollapseDiv) {
      parentCollapseDiv.parentElement.children[0].classList.add("active");
      if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
        if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling)
          parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.classList.add("active");
        if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.closest(".collapse")) {
          parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.closest(".collapse").previousElementSibling.classList.add("active");
        }
      }
      return false;
    }
    return false;
  }

  updateActive(event: any) {
    const ul = document.getElementById("navbar-nav");
    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      this.removeActivation(items);
    }
    this.activateParentDropdown(event.target);
  }

  initActiveMenu() {
    let pathName = window.location.pathname;
    // Check if the application is running in production
    if (environment.production) {
      // Modify pathName for production build
      pathName = pathName.replace('/velzon/angular/master', '');
    }

    const active = this.findMenuItem(pathName, this.menuItems)
    this.toggleItem(active)
    const ul = document.getElementById("navbar-nav");
    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      let activeItems = items.filter((x: any) => x.classList.contains("active"));
      this.removeActivation(activeItems);

      let matchingMenuItem = items.find((x: any) => {
        if (environment.production) {
          let path = x.pathname
          path = path.replace('/velzon/angular/master', '');
          return path === pathName;
        } else {
          return x.pathname === pathName;
        }

      });
      if (matchingMenuItem) {
        this.activateParentDropdown(matchingMenuItem);
      }
    }
  }

  private findMenuItem(pathname: string, menuItems: any[]): any {
    for (const menuItem of menuItems) {
      if (menuItem.link && menuItem.link === pathname) {
        return menuItem;
      }

      if (menuItem.subItems) {
        const foundItem = this.findMenuItem(pathname, menuItem.subItems);
        if (foundItem) {
          return foundItem;
        }
      }
    }

    return null;
  }
  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    var sidebarsize = document.documentElement.getAttribute("data-sidebar-size");
    if (sidebarsize == 'sm-hover-active') {
      document.documentElement.setAttribute("data-sidebar-size", 'sm-hover');

    } else {
      document.documentElement.setAttribute("data-sidebar-size", 'sm-hover-active')
    }
  }

  /**
   * SidebarHide modal
   * @param content modal content
   */
  SidebarHide() {
    document.body.classList.remove('vertical-sidebar-enable');
  }
}
