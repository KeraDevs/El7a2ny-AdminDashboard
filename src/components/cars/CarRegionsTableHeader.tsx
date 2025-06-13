import React from "react";
import { Search, Download, Trash2, RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CarRegionsTableHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCount: number;
  onDelete: () => void;
  onRefresh: () => void;
  onAddRegion: () => void;
  onExport?: () => void;
  loading: boolean;
}

export const CarRegionsTableHeader: React.FC<CarRegionsTableHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCount,
  onDelete,
  onRefresh,
  onAddRegion,
  onExport,
  loading,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg border">
      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 flex-1">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search regions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Selected Items Actions */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {selectedCount} selected
            </span>
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        )}
        {/* Refresh Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""} sm:mr-1`}
          />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
        {/* Export Button */}
        {onExport && (
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        )}
        {/* Add Region Button */}
        <Button size="sm" onClick={onAddRegion}>
          <Plus className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Add Region</span>
        </Button>
      </div>
    </div>
  );
};
