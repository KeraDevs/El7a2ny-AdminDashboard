"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SearchPalette from "./SearchPalette";
import { useSidebar } from "@/contexts/SidebarContext";
import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  Sun,
  Moon,
  UserCircle,
  LogOut,
  PanelRight,
} from "lucide-react";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { toggleSidebar } = useSidebar();
  const { userData, logOut } = useAuth();
  const router = useRouter();

  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    const routeMap: { [key: string]: string } = {
      "/dashboard": "Dashboard",
      "/users": "Users List",
      "/users/:id": "User Profile",
      "/users/cars": "Cars",
      "/users/labels": "Labels",
      "/workshops/list": "Workshops List",
      "/workshops/:id": "Workshop Profile",
      "/workshops/cars": "Workshop Cars",
      "/workshops/labels": "Workshop Labels",
      "/history": "History",
      "/marketplace": "Marketplace",
      "/requests": "Requests",
      "/wallets": "Wallets",
      "/chats": "Chats",
      "/revenue": "Revenue",
      "/analytics": "Analytics",
      "/vouchers": "Vouchers",
      "/profile": "Profile Settings",
    };

    if (path.startsWith("/users/") && path.split("/").length === 3) {
      return "User Profile";
    }
    if (path.startsWith("/workshops/") && path.split("/").length === 3) {
      return "Workshop Profile";
    }

    return routeMap[path] || "Dashboard";
  };

  const handleLogout = async () => {
    try {
      await logOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const userInitial = userData?.first_name?.charAt(0) || "A";
  const userEmail = userData?.email || "admin@example.com";
  const full_name =
    `${userData?.first_name + " " + userData?.last_name}` || "Super Admin";
  const userName = full_name;

  return (
    <>
      <div className="sticky top-0 z-10 flex flex-col">
        <nav className="flex h-14 items-center justify-between border-b bg-background px-4 lg:h-[60px]">
          {/* Left side */}
          <div className="flex items-center gap-2 px-4">
            <button
              onClick={toggleSidebar}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
            >
              <PanelRight className="h-4 w-4" />
            </button>
            <div className="h-4 w-[1px] shrink-0 bg-border" />
            <div className="text-sm font-medium">{getPageTitle(pathname)}</div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="relative inline-flex items-center justify-between rounded-md border border-input bg-background px-4 py-2 text-sm text-muted-foreground shadow-sm hover:bg-accent hover:text-accent-foreground md:w-64 lg:w-80 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span className="hidden md:inline">
                  Type a command or search...
                </span>
              </div>
              <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>

            {/* Notification Icon */}
            <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer">
              <Bell className="h-4 w-4" />
              <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-600" />
            </button>

            {/* Theme toggle */}
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* User avatar with dropdown */}
            <div className="relative">
              <button
                className="inline-flex h-8 w-8 items-center justify-center rounded-full"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
                  <span className="flex h-full w-full items-center justify-center rounded-full bg-muted cursor-pointer">
                    {userInitial}
                  </span>
                </span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md border bg-background py-1 shadow-lg">
                  <div className="px-4 py-2 text-sm">
                    <div className="font-medium">{userName}</div>
                    <div className="text-muted-foreground text-xs">
                      {userEmail}
                    </div>
                  </div>
                  <div className="border-t border-border my-1"></div>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <UserCircle className="h-4 w-4" />
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-accent text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>

      <SearchPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Navbar;
