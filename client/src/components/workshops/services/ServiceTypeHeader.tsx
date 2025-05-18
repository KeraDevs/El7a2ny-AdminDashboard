import React, { useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  PlusCircle,
  Trash2,
  PercentIcon,
} from "lucide-react";
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
import { ServiceTypeColumnVisibility } from "@/types/serviceTypes";
import { AddServiceTypeDialog } from "./AddServiceTypeDialog";
import { toast } from "react-hot-toast";

interface ServiceTypesTableHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  columnVisibility: ServiceTypeColumnVisibility;
  setColumnVisibility: React.Dispatch<
    React.SetStateAction<ServiceTypeColumnVisibility>
  >;
  onAddServiceType: (serviceTypeData: any) => Promise<void>;
  refreshData?: () => Promise<void>;
  selectedServiceTypes: string[];
  onSetPercentage: () => void;
  onDelete: () => void;
}

export const ServiceTypesTableHeader: React.FC<
  ServiceTypesTableHeaderProps
> = ({
  searchQuery,
  setSearchQuery,
  columnVisibility,
  setColumnVisibility,
  onAddServiceType,
  refreshData,
  selectedServiceTypes,
  onSetPercentage,
  onDelete,
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
        await refreshData();
        toast.success("Service types refreshed successfully");
      } else {
        toast.success("Refresh triggered");
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh service types");
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
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search service types..."
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
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <div className="flex gap-2">
                <AddServiceTypeDialog
                  onAddServiceType={onAddServiceType}
                  isOpen={false}
                  setIsOpen={function (
                    value: React.SetStateAction<boolean>
                  ): void {
                    throw new Error("Function not implemented.");
                  }}
                />

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
              placeholder="Search service types..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <AddServiceTypeDialog
              onAddServiceType={onAddServiceType}
              isOpen={false}
              setIsOpen={function (value: React.SetStateAction<boolean>): void {
                throw new Error("Function not implemented.");
              }}
            />

            {selectedServiceTypes.length > 0 && (
              <>
                <Button
                  variant="outline"
                  onClick={onSetPercentage}
                  className="gap-1"
                >
                  <PercentIcon className="h-3.5 w-3.5" />
                  <span>Set Percentage</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={onDelete}
                  className="gap-1 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete ({selectedServiceTypes.length})</span>
                </Button>
              </>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
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
