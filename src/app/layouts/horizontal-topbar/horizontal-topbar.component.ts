import { Component, OnInit, AfterViewInit, OnDestroy, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

// Menu Pachage
// import MetisMenu from 'metismenujs';

import { MENU } from './menu';
import { MenuItem } from './menu.model';
import { MenuVisibilityService } from '../../core/services/menu-visibility.service';

@Component({
  selector: 'app-horizontal-topbar',
  templateUrl: './horizontal-topbar.component.html',
  styleUrls: ['./horizontal-topbar.component.scss']
})
export class HorizontalTopbarComponent implements OnInit, AfterViewInit, OnDestroy {

  menu: any;
  menuItems: MenuItem[] = [];
  allMenuItems: MenuItem[] = MENU;
  selectedApp: string | null = null;
  @ViewChild('sideMenu') sideMenu!: ElementRef;
  @ViewChild('menuScrollContainer') menuScrollContainer!: ElementRef;
  @Output() mobileMenuButtonClicked = new EventEmitter();
  
  canScrollLeft: boolean = false;
  canScrollRight: boolean = false;
  
  private scrollListener: (() => void) | null = null;
  private resizeListener: (() => void) | null = null;

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
        this.checkScrollButtons();
      }, 100);
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
      parentId: undefined,
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
      parentId: undefined,
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
      parentId: undefined,
      isCollapsed: subItem.subItems ? true : undefined
    }));

    return [titleItem, ...flatMenu];
  }

  /***
   * Activate droup down set
   */
  ngAfterViewInit() {
    this.initActiveMenu();
    
    // Vérifier l'état de défilement initial
    setTimeout(() => {
      this.checkScrollButtons();
    }, 100);
    
    // Écouter les événements de défilement
    if (this.menuScrollContainer) {
      this.scrollListener = () => {
        this.checkScrollButtons();
      };
      this.menuScrollContainer.nativeElement.addEventListener('scroll', this.scrollListener);
    }
    
    // Écouter le redimensionnement de la fenêtre
    this.resizeListener = () => {
      this.checkScrollButtons();
    };
    window.addEventListener('resize', this.resizeListener);
  }
  
  ngOnDestroy(): void {
    // Nettoyer les event listeners
    if (this.scrollListener && this.menuScrollContainer) {
      this.menuScrollContainer.nativeElement.removeEventListener('scroll', this.scrollListener);
    }
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }
  
  /**
   * Vérifier si les boutons de défilement doivent être affichés
   */
  checkScrollButtons(): void {
    if (!this.menuScrollContainer) return;
    
    const container = this.menuScrollContainer.nativeElement;
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    
    this.canScrollLeft = scrollLeft > 0;
    this.canScrollRight = scrollLeft < (scrollWidth - clientWidth - 5);
  }
  
  /**
   * Faire défiler le menu
   */
  scrollMenu(direction: 'left' | 'right'): void {
    if (!this.menuScrollContainer) return;
    
    const container = this.menuScrollContainer.nativeElement;
    const scrollAmount = 200; // Distance de défilement en pixels
    
    if (direction === 'left') {
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    } else {
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  removeActivation(items: any) {   
    items.forEach((item: any) => {
      if (item.classList.contains("menu-link")) {
        if (!item.classList.contains("active")) {
          item.setAttribute("aria-expanded", false);
        }
        (item.nextElementSibling) ? item.nextElementSibling.classList.remove("show") : null;
      }
      if (item.classList.contains("nav-link")) {
        if (item.nextElementSibling) {
          item.nextElementSibling.classList.remove("show");
        }
        item.setAttribute("aria-expanded", false);
      }
      item.classList.remove("active");
    });
  }

  // remove active items of two-column-menu
  activateParentDropdown(item: any) { // navbar-nav menu add active
    item.classList.add("active");
    let parentCollapseDiv = item.closest(".collapse.menu-dropdown");
    if (parentCollapseDiv) {      
      // to set aria expand true remaining
      parentCollapseDiv.classList.add("show");
      parentCollapseDiv.parentElement.children[0].classList.add("active");
      parentCollapseDiv.parentElement.children[0].setAttribute("aria-expanded", "true");
      if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
        parentCollapseDiv.parentElement.closest(".collapse").classList.add("show");
        if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling)
        parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.classList.add("active");
        parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.setAttribute("aria-expanded", "true");
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
    const pathName = window.location.pathname;
    const ul = document.getElementById("navbar-nav");
    
    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      let activeItems = items.filter((x: any) => x.classList.contains("active")); 
      this.removeActivation(activeItems);
      let matchingMenuItem = items.find((x: any) => {
        return x.pathname === pathName;
      });
      if (matchingMenuItem) {
        this.activateParentDropdown(matchingMenuItem);
      }
    }
  }

  toggleSubItem(event: any) {
    if(event.target && event.target.nextElementSibling)
      event.target.nextElementSibling.classList.toggle("show");
  };

  toggleItem(event: any) {
    let isCurrentMenuId = event.target.closest('a.nav-link');    
    
    let isMenu = isCurrentMenuId.nextElementSibling as any;
    let dropDowns = Array.from(document.querySelectorAll('#navbar-nav .show'));
    dropDowns.forEach((node: any) => {
      node.classList.remove('show');
    });

    (isMenu) ? isMenu.classList.add('show') : null;

    const ul = document.getElementById("navbar-nav");
    if(ul){
      const iconItems = Array.from(ul.getElementsByTagName("a"));
      let activeIconItems = iconItems.filter((x: any) => x.classList.contains("active"));
      activeIconItems.forEach((item: any) => {
        item.setAttribute('aria-expanded', "false")
        item.classList.remove("active");
      });
    } 
    if (isCurrentMenuId) {
      this.activateParentDropdown(isCurrentMenuId);
    }
  }


  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }

  /**
   * remove active and mm-active class
   */
  _removeAllClass(className: any) {
    const els = document.getElementsByClassName(className);
    while (els[0]) {
      els[0].classList.remove(className);
    }
  }

}
