import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { BiSlider, BiRefresh } from "react-icons/bi";
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
import { WorkshopColumnVisibility, Workshop } from "@/types/workshopTypes";
import { AddWorkshopDialog } from "./AddworkshopsDialog";
import { toast } from "react-hot-toast";

interface WorkshopsTableHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  columnVisibility: WorkshopColumnVisibility;
  setColumnVisibility: React.Dispatch<
    React.SetStateAction<WorkshopColumnVisibility>
  >;
  onAddWorkshop: (workshopData: Partial<Workshop>) => Promise<void>;
  refreshData?: () => Promise<void>; // Optional prop to refresh data
}

export const WorkshopsTableHeader: React.FC<WorkshopsTableHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  columnVisibility,
  setColumnVisibility,
  onAddWorkshop,
  refreshData,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check if the screen is mobile sized
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIsMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIsMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Handle refresh, using passed function or fallback
  const handleRefresh = async () => {
    if (isRefreshing) return;

    try {
      setIsRefreshing(true);

      if (refreshData) {
        // Use the provided refresh function if available
        await refreshData();
        toast.success("Workshops refreshed successfully");
      } else {
        // Fallback to manual refresh
        const workshopsListElement = document.querySelector(
          "[data-workshops-container]"
        );
        if (workshopsListElement) {
          // Trigger a custom event that the parent component can listen for
          const refreshEvent = new CustomEvent("refresh-workshops-data");
          workshopsListElement.dispatchEvent(refreshEvent);
          toast.success("Workshops refreshed successfully");
        } else {
          console.warn("Workshops container not found for refresh");
          toast.success("Refresh triggered");
        }
      }
    } catch {
      toast.error("Failed to refresh workshops");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-muted dark:bg-background p-3 md:p-4 rounded-md gap-3">
      {/* Search bar - conditionally expanded on mobile */}
      {isMobile ? (
        <>
          {showSearch ? (
            <div className="relative w-full">
              <IoSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search workshops..."
                className="w-full pl-8 pr-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-7 w-7 p-0"
                onClick={() => setShowSearch(false)}
              >
                ×
              </Button>
            </div>
          ) : (
            <div className="flex w-full items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setShowSearch(true)}
              >
                <IoSearch className="h-4 w-4 mr-2" />
                Search
              </Button>
              <div className="flex gap-2">
                <AddWorkshopDialog onAddWorkshop={onAddWorkshop} />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <BiSlider className="h-4 w-4" />
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
                  <BiRefresh
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
            <IoSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search workshops..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <AddWorkshopDialog onAddWorkshop={onAddWorkshop} />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <BiSlider className="h-3.5 w-3.5" />
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
            >
              <BiRefresh
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
