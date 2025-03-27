"use client";
import { UserAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import SearchPalette from "./SearchPalette";
import { useSidebar } from "@/contexts/SidebarContext";
import { sidebarSections } from "./Sidebar";
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  UserCircle,
  LogOut,
  PanelRight,
} from "lucide-react";

// const useBreadcrumbs = () => {
//   const pathname = usePathname();

//   const getBreadcrumbs = () => {
//     const breadcrumbs = [{ name: "Dashboard", href: "/" }];

//     if (pathname === "/") {
//       return breadcrumbs;
//     }

//     for (const section of sidebarSections) {
//       if (section.href && pathname === section.href) {
//         breadcrumbs.push({ name: section.name, href: section.href });
//         break;
//       }

//       if (section.subsections) {
//         const matchingSubsection = section.subsections.find(
//           (subsection) => pathname === subsection.href
//         );

//         if (matchingSubsection) {
//           breadcrumbs.push(
//             { name: section.name, href: section.subsections[0].href },
//             { name: matchingSubsection.name, href: matchingSubsection.href }
//           );
//           break;
//         }
//       }
//     }

//     return breadcrumbs;
//   };

//   return getBreadcrumbs();
// };

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { toggleSidebar } = useSidebar();
  // const breadcrumbs = useBreadcrumbs();
  const { user, googleSignIn, logOut } = UserAuth();
  const [loading, setLoading] = useState(true);

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

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
            {/* <nav aria-label="breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5">
                {breadcrumbs.map((breadcrumb, index) => (
                  <li key={breadcrumb.href} className="flex items-center">
                    {index > 0 && <span className="mx-2">/</span>}
                    {index === breadcrumbs.length - 1 ? (
                      <span className="font-normal text-foreground">
                        {breadcrumb.name}
                      </span>
                    ) : (
                      <Link
                        className="transition-colors hover:text-foreground"
                        href={breadcrumb.href}
                      >
                        {breadcrumb.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav> */}
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
                    M
                  </span>
                </span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md border bg-background py-1 shadow-lg">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent"
                  >
                    <UserCircle className="h-4 w-4" />
                    View Profile
                  </Link>
                  <Link
                    href="/logout"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Link>
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
