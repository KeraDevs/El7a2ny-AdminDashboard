import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UsersCarsTableProps, defaultColumnVisibility } from "@/types/carTypes";
import { LuChevronsUpDown, LuEye } from "react-icons/lu";
import { Loader2 } from "lucide-react";
import { CarWithDetails } from "@/types/carTypes";

const UsersCarsTable: React.FC<UsersCarsTableProps> = ({
  selectedCars = [],
  onSelectCar,
  handleSelectAll,
  columnVisibility,
  handleView,
  handleSort,
  searchQuery,
  loading,
  paginatedCars = [],
  sortConfig,
}) => {
  const safeColumnVisibility = columnVisibility || defaultColumnVisibility;

  const handleSortClick = (key: keyof CarWithDetails | "owner" | "brand") => {
    handleSort(key);
  };

  const visibleColumnCount =
    Object.values(safeColumnVisibility).filter(Boolean).length + 2;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={
                  selectedCars.length > 0 &&
                  selectedCars.length === paginatedCars.length
                }
                onCheckedChange={handleSelectAll}
              />
            </TableHead>

            {safeColumnVisibility.owner_name && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSortClick("owner")}
              >
                <div className="flex items-center gap-1">
                  Owner Name
                  <LuChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                  {sortConfig?.key === "owner" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}

            {safeColumnVisibility.owner_email && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSortClick("owner")}
              >
                <div className="flex items-center gap-1">
                  Email
                  <LuChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                  {sortConfig?.key === "owner" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}

            {safeColumnVisibility.brand_name && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSortClick("brand")}
              >
                <div className="flex items-center gap-1">
                  Brand
                  <LuChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                  {sortConfig?.key === "brand" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}

            {safeColumnVisibility.model && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSortClick("model")}
              >
                <div className="flex items-center gap-1">
                  Model
                  <LuChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                  {sortConfig?.key === "model" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}

            {safeColumnVisibility.year && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSortClick("year")}
              >
                <div className="flex items-center gap-1">
                  Year
                  <LuChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                  {sortConfig?.key === "year" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}

            {safeColumnVisibility.license_plate && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSortClick("license_plate")}
              >
                <div className="flex items-center gap-1">
                  License Plate
                  <LuChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                  {sortConfig?.key === "license_plate" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}

            {safeColumnVisibility.vin_number && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSortClick("vin_number")}
              >
                <div className="flex items-center gap-1">
                  VIN Number
                  <LuChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                  {sortConfig?.key === "vin_number" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}

            {safeColumnVisibility.turbo && <TableHead>Turbo</TableHead>}

            {safeColumnVisibility.exotic && <TableHead>Exotic</TableHead>}

            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={visibleColumnCount}
                className="h-24 text-center"
              >
                <div className="flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading cars...
                </div>
              </TableCell>
            </TableRow>
          ) : paginatedCars.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={visibleColumnCount}
                className="h-24 text-center"
              >
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <p className="text-sm">No cars found</p>
                  {searchQuery && (
                    <p className="text-xs mt-1">
                      Try adjusting your search criteria
                    </p>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            paginatedCars.map((car: CarWithDetails) => (
              <TableRow key={car.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedCars.includes(car.id)}
                    onCheckedChange={() => onSelectCar(car.id)}
                  />
                </TableCell>

                {safeColumnVisibility.owner_name && (
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {car.owner?.first_name} {car.owner?.last_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {car.owner?.phone}
                      </span>
                    </div>
                  </TableCell>
                )}

                {safeColumnVisibility.owner_email && (
                  <TableCell>
                    <span className="text-sm">{car.owner?.email}</span>
                  </TableCell>
                )}

                {safeColumnVisibility.brand_name && (
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {car.brand?.name}
                    </Badge>
                  </TableCell>
                )}

                {safeColumnVisibility.model && (
                  <TableCell>
                    <span className="font-medium">{car.model}</span>
                  </TableCell>
                )}

                {safeColumnVisibility.year && (
                  <TableCell>
                    <span className="text-sm">{car.year}</span>
                  </TableCell>
                )}

                {safeColumnVisibility.license_plate && (
                  <TableCell>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {car.license_plate}
                    </Badge>
                  </TableCell>
                )}

                {safeColumnVisibility.vin_number && (
                  <TableCell>
                    <span className="font-mono text-xs text-muted-foreground">
                      {car.vin_number}
                    </span>
                  </TableCell>
                )}

                {safeColumnVisibility.turbo && (
                  <TableCell>
                    <Badge
                      variant={car.turbo ? "default" : "secondary"}
                      className={car.turbo ? "bg-green-100 text-green-800" : ""}
                    >
                      {car.turbo ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                )}

                {safeColumnVisibility.exotic && (
                  <TableCell>
                    <Badge
                      variant={car.exotic ? "default" : "secondary"}
                      className={
                        car.exotic ? "bg-purple-100 text-purple-800" : ""
                      }
                    >
                      {car.exotic ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                )}

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(car)}
                      className="h-8 w-8 p-0"
                    >
                      <LuEye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export { UsersCarsTable };
export default UsersCarsTable;
