"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import Image from "next/image";
import {
  Users,
  Boxes,
  ClipboardList,
  Wallet,
  LogOut,
  UserCircle,
  Car,
  ChartPie,
  Landmark,
  History,
} from "lucide-react";
import { FaChevronDown } from "react-icons/fa";

import { TbLayoutDashboardFilled } from "react-icons/tb";

import { SidebarSection } from "@/types/navigation";

export const sidebarSections: SidebarSection[] = [
  {
    name: "Dashboard",
    icon: <TbLayoutDashboardFilled className="h-4 w-4" />,
    href: "/dashboard",
  },
  {
    name: "Users",
    icon: <Users className="h-4 w-4" />,
    subsections: [
      { name: "Users List", href: "/users" },
      { name: "Cars", href: "/users/cars" },
    ],
  },
  {
    name: "Workshops",
    icon: <Boxes className="h-4 w-4" />,
    subsections: [
      { name: "Workshops List", href: "/workshops" },
      { name: "Services", href: "/workshops/services" },
    ],
  },
  {
    name: "Service Types",
    icon: <ClipboardList className="h-4 w-4" />,
    href: "/service-types",
  },
  {
    name: "Requests",
    icon: <History className="h-4 w-4" />,
    href: "/requests",
  },

  {
    name: "Wallets",
    icon: <Wallet className="h-4 w-4" />,
    subsections: [
      { name: "Users", href: "/wallets/users" },
      { name: "Workshops", href: "/wallets/workshops" },
    ],
  },
  {
    name: "Cars",
    icon: <Car className="h-4 w-4" />,
    subsections: [
      { name: "Car Brands", href: "/cars/brands" },
      { name: "Car Regions", href: "/cars/regions" },
    ],
  },
  {
    name: "Revenue",
    icon: <Landmark className="h-4 w-4" />,
    href: "/revenue",
  },
  {
    name: "Analytics",
    icon: <ChartPie className="h-4 w-4" />,
    href: "/analytics",
  },
];

const SidebarItem = ({
  section,
  isActive,
}: {
  section: SidebarSection;
  isActive: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(isActive);
  const hasSubsections = section.subsections && section.subsections.length > 0;

  if (hasSubsections) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer"
        >
          <div className="flex items-center gap-3">
            {section.icon}
            <span>{section.name}</span>
          </div>
          <FaChevronDown
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
                className="block rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
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
}) => {
  const { userData, logOut } = useAuth();

  const userInitial = userData?.first_name?.charAt(0) || "A";
  const full_name =
    userData?.first_name && userData?.last_name
      ? `${userData.first_name} ${userData.last_name}`
      : "Admin";

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 p-5 hover:bg-sidebar-accent transition-colors cursor-pointer"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white font-medium">
          {userInitial}
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-sidebar-foreground">
            {full_name}
          </p>
        </div>
        <TbLayoutDashboardFilled
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 w-full bg-sidebar border border-sidebar-border shadow-lg">
          <Link
            href="/profile"
            className="flex items-center gap-2 px-4 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <UserCircle className="h-4 w-4" />
            Profile Settings
          </Link>
          <button
            onClick={logOut}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent text-left"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

const Sidebar = () => {
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  // Get the sidebar state from context
  const { isOpen } = useSidebar();

  // Apply conditional classes based on isOpen state
  const sidebarClasses = isOpen
    ? "flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 overflow-auto w-64"
    : "hidden md:flex md:w-0 h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 overflow-hidden";

  return (
    <div className={sidebarClasses}>
      <div className="flex items-center gap-2 p-4 border-b border-sidebar-border">
        <div className="h-8 w-8 rounded-md overflow-hidden flex items-center justify-center">
          <Image
            src="/images/logo.png"
            alt="El7a2ny Logo"
            width={32}
            height={32}
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="font-semibold text-sidebar-foreground">El7a2ny</h1>
          <p className="text-xs text-sidebar-foreground/70">Admin Dashboard</p>
        </div>
      </div>

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

      <div className="border-t border-sidebar-border">
        <UserDropdown
          isOpen={isUserMenuOpen}
          onToggle={() => setIsUserMenuOpen(!isUserMenuOpen)}
        />
      </div>
    </div>
  );
};

export default Sidebar;
