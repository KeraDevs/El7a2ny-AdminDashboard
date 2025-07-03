import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SearchPaletteProps } from "@/types/navigation";
import { sidebarSections } from "@/components/Sidebar/Sidebar";

interface Route {
  name: string;
  href: string;
  category?: string;
  icon?: React.ReactNode;
}

const SearchPalette = ({ isOpen, onClose }: SearchPaletteProps) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  // Extract all routes from sidebar sections
  const allRoutes = useMemo(() => {
    const routes: Route[] = [];

    sidebarSections.forEach((section) => {
      if (section.href) {
        // Main section with direct href
        routes.push({
          name: section.name,
          href: section.href,
          icon: section.icon,
        });
      }

      if (section.subsections) {
        // Add subsections
        section.subsections.forEach((subsection) => {
          routes.push({
            name: subsection.name,
            href: subsection.href,
            category: section.name,
            icon: section.icon,
          });
        });
      }
    });

    return routes;
  }, []);

  // Filter routes based on search query
  const filteredRoutes = useMemo(() => {
    if (!query.trim()) {
      return allRoutes;
    }

    const lowerQuery = query.toLowerCase();

    return allRoutes.filter((route) => {
      // Search by route name
      const nameMatch = route.name.toLowerCase().includes(lowerQuery);

      // Search by href (e.g., typing "u" shows /users routes)
      const hrefMatch = route.href.toLowerCase().includes(lowerQuery);

      // Search by first letter of route path segments
      const pathSegments = route.href.split("/").filter(Boolean);
      const firstLetterMatch = pathSegments.some((segment) =>
        segment.toLowerCase().startsWith(lowerQuery)
      );

      // Search by category
      const categoryMatch = route.category?.toLowerCase().includes(lowerQuery);

      return nameMatch || hrefMatch || firstLetterMatch || categoryMatch;
    });
  }, [query, allRoutes]);

  // Reset selected index when filtered results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredRoutes]);

  // Handle navigation
  const handleNavigation = useCallback(
    (href: string) => {
      router.push(href);
      onClose();
      setQuery(""); // Reset search query
    },
    [router, onClose]
  );

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredRoutes.length - 1 ? prev + 1 : 0
          );
          break;

        case "ArrowUp":
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredRoutes.length - 1
          );
          break;

        case "Enter":
          event.preventDefault();
          if (filteredRoutes[selectedIndex]) {
            handleNavigation(filteredRoutes[selectedIndex].href);
          }
          break;

        case "Escape":
          event.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredRoutes, selectedIndex, onClose, handleNavigation]);

  // Global shortcut to open/close search
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          onClose(); // This should actually be an "onOpen" prop, but using onClose as per original
        }
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isOpen, onClose]);

  const handleRouteClick = (route: Route) => {
    handleNavigation(route.href);
  };

  // Get display text for route with highlighting
  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;

    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={index} className="bg-blue-200 dark:bg-blue-800 text-current">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="p-4">
          {/* Search input */}
          <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex w-full items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
                placeholder="Search pages... (try 'u' for users, 'd' for dashboard)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m18 6-12 12" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Navigation section */}
          <div className="mt-4 max-h-80 overflow-y-auto">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
              {query
                ? `SEARCH RESULTS (${filteredRoutes.length})`
                : "NAVIGATION"}
            </div>

            <div className="space-y-1">
              {filteredRoutes.length > 0 ? (
                filteredRoutes.map((route, index) => (
                  <div
                    key={route.href}
                    onClick={() => handleRouteClick(route)}
                    className={`flex items-center justify-between rounded-md px-3 py-2.5 cursor-pointer transition-colors ${
                      index === selectedIndex
                        ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {route.icon && (
                        <div className="text-gray-500 dark:text-gray-400 flex-shrink-0">
                          {route.icon}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {getHighlightedText(route.name, query)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {getHighlightedText(route.href, query)}
                        </div>
                        {route.category && (
                          <div className="text-xs text-blue-600 dark:text-blue-400 truncate">
                            {getHighlightedText(route.category, query)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {index === selectedIndex && (
                        <kbd className="flex h-5 items-center gap-1 rounded border bg-gray-100 dark:bg-gray-800 px-1.5 font-mono text-[10px] font-medium">
                          ↵
                        </kbd>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <svg
                    className="mx-auto h-8 w-8 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-sm">
                    No pages found for &ldquo;{query}&rdquo;
                  </p>
                  <p className="text-xs mt-1">
                    Try searching for page names or shortcuts
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer with shortcuts */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <kbd className="flex h-4 items-center gap-1 rounded border bg-gray-100 dark:bg-gray-800 px-1 font-mono text-[10px]">
                    ↑↓
                  </kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="flex h-4 items-center gap-1 rounded border bg-gray-100 dark:bg-gray-800 px-1 font-mono text-[10px]">
                    ↵
                  </kbd>
                  <span>Select</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="flex h-4 items-center gap-1 rounded border bg-gray-100 dark:bg-gray-800 px-1 font-mono text-[10px]">
                  ESC
                </kbd>
                <span>Close</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPalette;
