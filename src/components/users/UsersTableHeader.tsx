import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddUserDialog } from "@/components/users/AddUserDialog";
import { toast } from "react-hot-toast";
import { UsersTableHeaderProps } from "@/types/userTypes";

export const UsersTableHeader: React.FC<UsersTableHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  columnVisibility,
  setColumnVisibility,
  onAddUser,
  refreshData,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();

    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleRefresh = async () => {
    if (isRefreshing) return;

    try {
      setIsRefreshing(true);

      if (refreshData) {
        await refreshData();
        toast.success("Users refreshed successfully");
      } else {
        const usersListElement = document.querySelector(
          "[data-users-container]"
        );
        if (usersListElement) {
          const refreshEvent = new CustomEvent("refresh-users-data");
          usersListElement.dispatchEvent(refreshEvent);
          toast.success("Users refreshed successfully");
        } else {
          console.warn("Users container not found for refresh");
          toast.success("Refresh triggered");
        }
      }
    } catch {
      toast.error("Failed to refresh users");
    } finally {
      setIsRefreshing(false);
    }
  };
  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b border-border/50">
      {/* Search bar - conditionally expanded on mobile */}
      {isMobile ? (
        <>
          {showSearch ? (
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="w-full pl-8 pr-8 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-7 w-7 p-0 hover:bg-red-100 hover:text-red-600"
                onClick={() => setShowSearch(false)}
              >
                ×
              </Button>
            </div>
          ) : (
            <div className="flex w-full items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-blue-200 text-blue-700"
                onClick={() => setShowSearch(true)}
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <div className="flex gap-2">
                <AddUserDialog onAddUser={onAddUser} />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* Column checkboxes */}
                    {Object.entries(columnVisibility).map(([key, value]) => (
                      <DropdownMenuCheckboxItem
                        key={key}
                        checked={!!value}
                        onCheckedChange={(checked) =>
                          setColumnVisibility((prev) => ({
                            ...prev,
                            [key]: checked,
                          }))
                        }
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        // Desktop layout
        <>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="w-full pl-8 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-400 focus:ring-blue-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <AddUserDialog onAddUser={onAddUser} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-1 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-purple-200 text-purple-700"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>Columns</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries(columnVisibility).map(([key, value]) => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={!!value}
                    onCheckedChange={(checked) =>
                      setColumnVisibility((prev) => ({
                        ...prev,
                        [key]: checked,
                      }))
                    }
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-green-200 text-green-700 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
