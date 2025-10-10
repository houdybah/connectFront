export interface MenuItem {
  id?: number;
  label?: any;
  icon?: string;
  isCollapsed?: any;
  link?: string;
  subItems?: any;
  isTitle?: boolean;
  badge?: any;
  parentId?: number;
  isLayout?: boolean;
  app?: string; // Application à laquelle appartient le menu (douaneconnect, sygdrd, sysrev, sygmak)
}