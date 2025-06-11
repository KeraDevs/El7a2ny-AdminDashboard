import React, { useState } from "react";
import {
  Search,
  Download,
  Trash2,
  RefreshCw,
  Plus,
  Filter,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CarRegionColumnVisibility } from "@/types/carTypes";

interface CarRegionsTableHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: "all" | "active" | "inactive";
  setStatusFilter: (filter: "all" | "active" | "inactive") => void;
  continentFilter: string;
  setContinentFilter: (filter: string) => void;
  columnVisibility: CarRegionColumnVisibility;
  setColumnVisibility: (visibility: CarRegionColumnVisibility) => void;
  selectedCount: number;
  onDelete: () => void;
  onRefresh: () => void;
  loading: boolean;
}

export const CarRegionsTableHeader: React.FC<CarRegionsTableHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  continentFilter,
  setContinentFilter,
  columnVisibility,
  setColumnVisibility,
  selectedCount,
  onDelete,
  onRefresh,
  loading,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg border">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-1">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search regions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {/* Continent Filter */}
        <Input
          placeholder="Filter by continent..."
          value={continentFilter}
          onChange={(e) => setContinentFilter(e.target.value)}
          className="w-[180px]"
        />

        {/* Column Visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              checked={columnVisibility.name}
              onCheckedChange={(checked) =>
                setColumnVisibility({ ...columnVisibility, name: checked })
              }
            >
              Name
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.description}
              onCheckedChange={(checked) =>
                setColumnVisibility({
                  ...columnVisibility,
                  description: checked,
                })
              }
            >
              Description
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.country}
              onCheckedChange={(checked) =>
                setColumnVisibility({ ...columnVisibility, country: checked })
              }
            >
              Country
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.continent}
              onCheckedChange={(checked) =>
                setColumnVisibility({ ...columnVisibility, continent: checked })
              }
            >
              Continent
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.is_active}
              onCheckedChange={(checked) =>
                setColumnVisibility({ ...columnVisibility, is_active: checked })
              }
            >
              Status
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.created_at}
              onCheckedChange={(checked) =>
                setColumnVisibility({
                  ...columnVisibility,
                  created_at: checked,
                })
              }
            >
              Created At
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
    </div>
  );
};
