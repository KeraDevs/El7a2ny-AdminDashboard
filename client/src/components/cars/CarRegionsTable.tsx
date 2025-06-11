import React from "react";
import {
  CarRegion,
  CarRegionColumnVisibility,
  SortConfig,
} from "@/types/carTypes";
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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
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
  columnVisibility: CarRegionColumnVisibility;
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
  columnVisibility,
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
              {columnVisibility.name && <TableHead>Name</TableHead>}
              {columnVisibility.description && (
                <TableHead>Description</TableHead>
              )}
              {columnVisibility.country && <TableHead>Country</TableHead>}
              {columnVisibility.continent && <TableHead>Continent</TableHead>}
              {columnVisibility.is_active && <TableHead>Status</TableHead>}
              {columnVisibility.created_at && <TableHead>Created</TableHead>}
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                </TableCell>
                {columnVisibility.name && (
                  <TableCell>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                )}
                {columnVisibility.description && (
                  <TableCell>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                )}
                {columnVisibility.country && (
                  <TableCell>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                )}
                {columnVisibility.continent && (
                  <TableCell>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                )}
                {columnVisibility.is_active && (
                  <TableCell>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                )}
                {columnVisibility.created_at && (
                  <TableCell>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                )}
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
    <div className="border rounded-lg">
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
            {columnVisibility.name && (
              <SortableHeader column="name">Name</SortableHeader>
            )}
            {columnVisibility.description && (
              <SortableHeader column="description">Description</SortableHeader>
            )}
            {columnVisibility.country && (
              <SortableHeader column="country">Country</SortableHeader>
            )}
            {columnVisibility.continent && (
              <SortableHeader column="continent">Continent</SortableHeader>
            )}
            {columnVisibility.is_active && (
              <SortableHeader column="is_active">Status</SortableHeader>
            )}
            {columnVisibility.created_at && (
              <SortableHeader column="created_at">Created</SortableHeader>
            )}
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {regions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={
                  Object.values(columnVisibility).filter(Boolean).length + 2
                }
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

                  {columnVisibility.name && (
                    <TableCell className="font-medium">{region.name}</TableCell>
                  )}

                  {columnVisibility.description && (
                    <TableCell
                      className="max-w-xs truncate"
                      title={region.description || ""}
                    >
                      {region.description || "No description"}
                    </TableCell>
                  )}

                  {columnVisibility.country && (
                    <TableCell>{region.country || "Not specified"}</TableCell>
                  )}

                  {columnVisibility.continent && (
                    <TableCell>{region.continent || "Not specified"}</TableCell>
                  )}

                  {columnVisibility.is_active && (
                    <TableCell>
                      <Badge
                        variant={region.is_active ? "default" : "secondary"}
                      >
                        {region.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  )}

                  {columnVisibility.created_at && (
                    <TableCell className="text-muted-foreground">
                      {format(new Date(region.created_at), "MMM dd, yyyy")}
                    </TableCell>
                  )}

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(region)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(region)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDeleteSingle(region.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
