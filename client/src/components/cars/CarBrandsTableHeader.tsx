import React, { useState } from "react";
import { Search, Download, Trash2, RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddCarBrandDialog } from "./AddCarBrandDialog";

interface CarBrandsTableHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCount: number;
  onDelete: () => void;
  onRefresh: () => void;
  onAddBrand: (brandData: any) => Promise<void>;
  loading: boolean;
}

export const CarBrandsTableHeader: React.FC<CarBrandsTableHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCount,
  onDelete,
  onRefresh,
  onAddBrand,
  loading,
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleAddSuccess = () => {
    setShowAddDialog(false);
    onRefresh();
  };

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
      </div>

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

        {/* Add Brand Button */}
        <Button
          variant="default"
          size="sm"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Brand
        </Button>

        {/* Refresh Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>

        {/* Export Button */}
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-1" />
          Export
        </Button>
      </div>

      {/* Add Brand Dialog */}
      <AddCarBrandDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSuccess={handleAddSuccess}
        onAdd={onAddBrand}
      />
    </div>
  );
};
