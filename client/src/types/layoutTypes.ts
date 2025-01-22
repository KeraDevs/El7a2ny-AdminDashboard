export interface NavItem {
  text: string;
  icon: React.ReactNode | null;
}

export interface SidebarProps {
  drawerWidth: number;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isNonMobile: boolean;
}

export interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}
