import React from "react";
import {
  CarBrand,
  CarBrandColumnVisibility,
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

interface CarBrandsTableProps {
  brands: CarBrand[];
  selectedBrands: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectBrand: (brandId: string) => void;
  onEdit: (brand: CarBrand) => void;
  onView: (brand: CarBrand) => void;
  onDelete: () => void;
  onDeleteSingle: (brandId: string) => void;
  columnVisibility: CarBrandColumnVisibility;
  onSort: (column: keyof CarBrand) => void;
  sortConfig: SortConfig;
  loading: boolean;
}

export const CarBrandsTable: React.FC<CarBrandsTableProps> = ({
  brands,
  selectedBrands,
  onSelectAll,
  onSelectBrand,
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
    brands.length > 0 &&
    brands.every((brand) => selectedBrands.includes(brand.id));
  const someSelected = selectedBrands.length > 0 && !allSelected;

  const SortableHeader = ({
    column,
    children,
  }: {
    column: keyof CarBrand;
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
              {columnVisibility.regionsCount && <TableHead>Regions</TableHead>}
              {columnVisibility.regions && <TableHead>Region List</TableHead>}
              {columnVisibility.createdAt && <TableHead>Created</TableHead>}
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
                {columnVisibility.regionsCount && (
                  <TableCell>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                )}
                {columnVisibility.regions && (
                  <TableCell>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                )}
                {columnVisibility.createdAt && (
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
            {columnVisibility.regionsCount && <TableHead>Regions</TableHead>}
            {columnVisibility.regions && <TableHead>Region List</TableHead>}
            {columnVisibility.createdAt && (
              <SortableHeader column="created_at">Created</SortableHeader>
            )}
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={
                  Object.values(columnVisibility).filter(Boolean).length + 2
                }
                className="text-center py-8 text-muted-foreground"
              >
                No car brands found
              </TableCell>
            </TableRow>
          ) : (
            brands.map((brand) => {
              const isSelected = selectedBrands.includes(brand.id);
              const regionsCount = brand.brand_regions?.length || 0;
              const regionNames =
                brand.brand_regions?.map((br) => br.region.name).join(", ") ||
                "None";

              return (
                <TableRow
                  key={brand.id}
                  className={isSelected ? "bg-muted/50" : ""}
                >
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onSelectBrand(brand.id)}
                    />
                  </TableCell>

                  {columnVisibility.name && (
                    <TableCell className="font-medium">{brand.name}</TableCell>
                  )}

                  {columnVisibility.regionsCount && (
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {regionsCount}
                        {regionsCount === 1 ? "region" : "regions"}
                      </span>
                    </TableCell>
                  )}

                  {columnVisibility.regions && (
                    <TableCell
                      className="max-w-xs truncate"
                      title={regionNames}
                    >
                      {regionNames}
                    </TableCell>
                  )}

                  {columnVisibility.createdAt && (
                    <TableCell className="text-muted-foreground">
                      {format(new Date(brand.created_at), "MMM dd, yyyy")}
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
                        <DropdownMenuItem onClick={() => onView(brand)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(brand)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDeleteSingle(brand.id)}
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
