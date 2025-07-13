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
import { toast } from "react-hot-toast";
import { ColumnVisibility } from "@/types/carTypes";

export interface UsersCarsTableHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  columnVisibility: ColumnVisibility;
  setColumnVisibility: React.Dispatch<React.SetStateAction<ColumnVisibility>>;
  refreshData?: () => Promise<void>;
  selectedCars: string[];
  onDelete: () => void;
}

export const UsersCarsTableHeader: React.FC<UsersCarsTableHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  columnVisibility,
  setColumnVisibility,
  refreshData,
  selectedCars,
  onDelete,
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
        toast.success("Cars refreshed successfully");
      }
    } catch {
      toast.error("Failed to refresh cars");
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
                placeholder="Search cars..."
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
                <Search className="mr-2 h-4 w-4" />
                Search cars...
              </Button>
              <div className="flex items-center gap-2 ml-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="h-9 w-9 p-0"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Column Visibility</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {Object.entries(columnVisibility).map(([key, value]) => (
                      <DropdownMenuCheckboxItem
                        key={key}
                        checked={value}
                        onCheckedChange={(checked) =>
                          setColumnVisibility((prev) => ({
                            ...prev,
                            [key]: checked,
                          }))
                        }
                      >
                        {key
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search cars..."
                className="w-[300px] pl-8 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedCars.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={onDelete}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              >
                Delete ({selectedCars.length})
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-green-200 text-green-700"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-purple-200 text-purple-700"
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Column Visibility</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries(columnVisibility).map(([key, value]) => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={value}
                    onCheckedChange={(checked) =>
                      setColumnVisibility((prev) => ({
                        ...prev,
                        [key]: checked,
                      }))
                    }
                  >
                    {key
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      )}
    </div>
  );
};
