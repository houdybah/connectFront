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
    // Charger l'application sélectionnée depuis sessionStorage au démarrage
    const savedApp = sessionStorage.getItem('selectedApp');
    if (savedApp) {
      this.selectedApp = savedApp;
      this.filterMenuByApp(savedApp);
    }

    // S'abonner à l'application sélectionnée pour les changements futurs
    this.menuVisibilityService.selectedApp$.subscribe(app => {
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
    if (!app) {
      this.menuItems = [];
      return;
    }

    // Filtrer le menu en fonction de l'application
    if (app === 'sysrev') {
      // Transformer les sous-menus en éléments de menu principaux
      this.menuItems = this.flattenSysrevMenu();
    } else if (app === 'sygmak') {
      // Transformer les sous-menus en éléments de menu principaux
      this.menuItems = this.flattenSygmakMenu();
    } else if (app === 'sygdrd') {
      // Transformer les sous-menus en éléments de menu principaux
      this.menuItems = this.flattenSygdrdMenu();
    } else if (app === 'douaneconnect') {
      // Filtrer pour afficher uniquement les menus DouaneConnect
      this.menuItems = this.allMenuItems.filter(item => 
        item.app === 'douaneconnect'
      );
    } else {
      this.menuItems = [];
    }
  }

  flattenSysrevMenu(): MenuItem[] {
    const sysrevMainMenu = this.allMenuItems.find(item => item.id === 1501);
    
    if (!sysrevMainMenu || !sysrevMainMenu.subItems) {
      return [];
    }

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

    return [titleItem, ...flatMenu];
  }

  flattenSygmakMenu(): MenuItem[] {
    const sygmakMainMenu = this.allMenuItems.find(item => item.id === 1700);
    
    if (!sygmakMainMenu || !sygmakMainMenu.subItems) {
      return [];
    }

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

    return [titleItem, ...flatMenu];
  }

  flattenSygdrdMenu(): MenuItem[] {
    const sygdrdMainMenu = this.allMenuItems.find(item => item.id === 100);
    
    if (!sygdrdMainMenu || !sygdrdMainMenu.subItems) {
      return [];
    }

    // Ajouter un titre pour l'application
    const titleItem: MenuItem = {
      id: 9997,
      label: 'SYGDRD - Gestion des Droits et Redevances',
      isTitle: true
    };

    // Transformer les sous-menus en éléments de menu principaux
    const flatMenu: MenuItem[] = sygdrdMainMenu.subItems.map((subItem: MenuItem) => ({
      ...subItem,
      parentId: undefined, // Enlever le parentId pour en faire un élément principal
      isCollapsed: subItem.subItems ? true : undefined
    }));

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
