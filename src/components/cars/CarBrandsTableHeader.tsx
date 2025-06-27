import React from "react";
import { Search, Plus, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CarBrandsTableHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCount: number;
  onDelete: () => void;
  onAdd: () => void;
  onRefresh: () => void;
}

export const CarBrandsTableHeader: React.FC<CarBrandsTableHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCount,
  onDelete,
  onAdd,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg border">
      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 flex-1">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>{" "}
      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Selected Items Actions */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-2 mr-2">
            <span className="text-sm text-muted-foreground">
              {selectedCount} selected
            </span>
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        )}
        {/* Export Button */}
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
        <Button variant="default" size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-1" />
          Add Brand
        </Button>{" "}
      </div>
    </div>
  );
};
