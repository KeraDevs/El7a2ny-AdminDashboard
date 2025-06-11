import React from "react";
import { CarRegion, SortConfig } from "@/types/carTypes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Eye, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface CarRegionsTableProps {
  regions: CarRegion[];
  selectedRegions: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectRegion: (regionId: string) => void;
  onEdit: (region: CarRegion) => void;
  onView: (region: CarRegion) => void;
  onDelete: () => void;
  onDeleteSingle: (regionId: string) => void;
  onSort: (column: keyof CarRegion) => void;
  sortConfig: SortConfig;
  loading: boolean;
}

export const CarRegionsTable: React.FC<CarRegionsTableProps> = ({
  regions,
  selectedRegions,
  onSelectAll,
  onSelectRegion,
  onEdit,
  onView,
  onDelete,
  onDeleteSingle,
  onSort,
  sortConfig,
  loading,
}) => {
  const allSelected =
    regions.length > 0 &&
    regions.every((region) => selectedRegions.includes(region.id));
  const someSelected = selectedRegions.length > 0 && !allSelected;

  const SortableHeader = ({
    column,
    children,
  }: {
    column: keyof CarRegion;
    children: React.ReactNode;
  }) => (
    <TableHead
      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      onClick={() => onSort(column)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortConfig.key === column &&
          (sortConfig.direction === "asc" ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          ))}
      </div>
    </TableHead>
  );

  if (loading) {
    return (
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox disabled />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-32 sm:w-48">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onSelectAll}
                aria-label={
                  someSelected
                    ? "Partially selected"
                    : allSelected
                    ? "Deselect all"
                    : "Select all"
                }
              />
            </TableHead>
            <SortableHeader column="name">Name</SortableHeader>
            <SortableHeader column="created_at">Created</SortableHeader>
            <TableHead className="w-32 sm:w-48">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {regions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center py-8 text-muted-foreground"
              >
                No car regions found
              </TableCell>
            </TableRow>
          ) : (
            regions.map((region) => {
              const isSelected = selectedRegions.includes(region.id);

              return (
                <TableRow
                  key={region.id}
                  className={isSelected ? "bg-muted/50" : ""}
                >
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onSelectRegion(region.id)}
                    />
                  </TableCell>

                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{region.name}</span>
                      {/* Show related brands count on mobile */}
                      {region.brand_regions &&
                        region.brand_regions.length > 0 && (
                          <span className="text-xs text-muted-foreground sm:hidden">
                            {region.brand_regions.length} brand(s)
                          </span>
                        )}
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    <div className="flex flex-col">
                      <span>
                        {format(new Date(region.created_at), "MMM dd, yyyy")}
                      </span>
                      {/* Show brands on larger screens */}
                      {region.brand_regions &&
                        region.brand_regions.length > 0 && (
                          <span className="text-xs text-muted-foreground hidden sm:block">
                            {region.brand_regions.length} brand(s) associated
                          </span>
                        )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(region)}
                        className="h-8 w-8 p-0"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(region)}
                        className="h-8 w-8 p-0"
                        title="Edit region"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteSingle(region.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="Delete region"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
