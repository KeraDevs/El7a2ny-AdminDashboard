export interface SidebarSection {
  name: string;
  icon: React.ReactNode;
  href?: string;
  subsections?: { name: string; href: string }[];
}

export interface Breadcrumb {
  name: string;
  href: string;
}

export interface SidebarContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
}

export interface SearchPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}
