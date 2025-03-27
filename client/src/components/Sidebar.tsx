// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/contexts/SidebarContext";
import {
  ChevronDown,
  Layout,
  Boxes,
  FileText,
  Settings,
  PlayCircle,
  History,
  Star,
  Wrench,
  Cpu,
  Rocket,
  BookOpen,
  Users,
  Building2,
  CreditCard,
  Gauge,
  LogOut,
  UserCircle,
  LayoutDashboard,
} from "lucide-react";

interface SidebarSection {
  name: string;
  icon: React.ReactNode;
  href?: string;
  subsections?: { name: string; href: string }[];
}

export const sidebarSections: SidebarSection[] = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    href: "/",
  },
  {
    name: "Users Management",
    icon: <Users className="h-4 w-4" />,
    subsections: [
      { name: "Users List", href: "/users" },
      { name: "User Profile", href: "/users/:id" },
      { name: "Cars", href: "/users/cars" },
      { name: "Labels", href: "/users/labels" },
    ],
  },
  {
    name: "Workshops Management",
    icon: <Boxes className="h-4 w-4" />,
    subsections: [
      { name: "Workshops List", href: "/workshops/list" },
      { name: "Workshop Profile", href: "/workshops/:id" },
      { name: "Cars", href: "/workshops/cars" },
      { name: "Labels", href: "/workshops/labels" },
    ],
  },
  {
    name: "History",
    icon: <Boxes className="h-4 w-4" />,
    href: "/history",
  },
  {
    name: "Marketplace",
    icon: <Boxes className="h-4 w-4" />,
    href: "/marketplace",
  },
  {
    name: "Requests",
    icon: <Boxes className="h-4 w-4" />,
    href: "/requests",
  },
  {
    name: "Wallets",
    icon: <Boxes className="h-4 w-4" />,
    href: "/wallets",
  },
  {
    name: "Chats",
    icon: <Boxes className="h-4 w-4" />,
    href: "/chats",
  },
  {
    name: "Revenue",
    icon: <Boxes className="h-4 w-4" />,
    href: "/revenue",
  },
  {
    name: "Analytics",
    icon: <Boxes className="h-4 w-4" />,
    href: "/analytics",
  },
  {
    name: "Vouchers",
    icon: <Boxes className="h-4 w-4" />,
    href: "/vouchers",
  },
];

const SidebarItem = ({
  section,
  isActive,
}: {
  section: SidebarSection;
  isActive: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubsections = section.subsections && section.subsections.length > 0;

  if (hasSubsections) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent cursor-pointer"
        >
          <div className="flex items-center gap-3">
            {section.icon}
            <span>{section.name}</span>
          </div>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isOpen && (
          <div className="ml-9 mt-1 space-y-1">
            {section.subsections?.map((subsection) => (
              <Link
                key={subsection.href}
                href={subsection.href}
                className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                {subsection.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={section.href || "#"}
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent ${
        isActive ? "bg-accent" : ""
      }`}
    >
      {section.icon}
      <span>{section.name}</span>
    </Link>
  );
};

const UserDropdown = ({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div className="relative">
    <button
      onClick={onToggle}
      className="flex w-full items-center gap-3 p-4 hover:bg-accent transition-colors cursor-pointer"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
        AD
      </div>
      <div className="flex-1 text-left">
        <p className="text-sm font-medium text-foreground">Admin</p>
        <p className="text-xs text-muted-foreground">admin@el7a2ny.com</p>
      </div>
      <ChevronDown
        className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </button>

    {isOpen && (
      <div className="absolute bottom-full left-0 w-full bg-background border border-border shadow-lg">
        <Link
          href="/account"
          className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent"
        >
          <UserCircle className="h-4 w-4" />
          Account
        </Link>
        <Link
          href="/logout"
          className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Link>
      </div>
    )}
  </div>
);

const Sidebar = () => {
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isSidebarOpen } = useSidebar();

  return (
    <div
      className={`${
        isSidebarOpen ? "w-64" : "w-0"
      } flex h-screen flex-col border-r border-border bg-background transition-all duration-300 overflow-auto`}
    >
      <div
        className={`${
          isSidebarOpen ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300 flex flex-col h-full`}
      >
        {/* Company Info */}
        <div className="flex items-center gap-2 p-4 border-b border-border">
          <div className="h-8 w-8 rounded-md bg-black text-white flex items-center justify-center">
            El
          </div>
          <div>
            <h1 className="font-semibold text-foreground">El7a2ny</h1>
            <p className="text-xs text-muted-foreground">Admin Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {sidebarSections.map((section) => (
            <SidebarItem
              key={section.name}
              section={section}
              isActive={
                section.href
                  ? pathname === section.href
                  : pathname.startsWith(section.subsections?.[0]?.href || "")
              }
            />
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-border">
          <UserDropdown
            isOpen={isUserMenuOpen}
            onToggle={() => setIsUserMenuOpen(!isUserMenuOpen)}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
