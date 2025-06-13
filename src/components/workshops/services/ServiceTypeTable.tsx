import React from "react";
import {
  ChevronsUpDown,
  Edit,
  Eye,
  Loader2,
  Trash2,
  PercentIcon,
  Clock,
  DollarSign,
  CheckCircle,
  Wrench,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ServiceTypesTableProps } from "@/types/serviceTypes";

export const ServiceTypesTable: React.FC<ServiceTypesTableProps> = ({
  loading,
  paginatedServiceTypes,
  columnVisibility,
  sortConfig,
  handleSort,
  selectedServiceTypes,
  handleSelectAll,
  handleSelectServiceType,
  handleEdit,
  handleView,
  searchQuery,
  serviceTypes,
  onDelete,
  onSetPercentage,
}) => {
  const visibleColumnCount =
    Object.values(columnVisibility).filter(Boolean).length + 2;

  // Get category badge - updated to match API response format
  const getCategoryBadge = (category: string) => {
    // API returns service_category field rather than category
    switch (category?.toLowerCase()) {
      case "maintenance":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 border-blue-300"
          >
            <Wrench className="h-3.5 w-3.5 mr-1" /> Maintenance
          </Badge>
        );
      case "repair":
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-800 border-amber-300"
          >
            <Wrench className="h-3.5 w-3.5 mr-1" /> Repair
          </Badge>
        );
      case "tuning":
        return (
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-800 border-purple-300"
          >
            <Wrench className="h-3.5 w-3.5 mr-1" /> Tuning
          </Badge>
        );
      case "emergency":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 border-red-300"
          >
            <FileText className="h-3.5 w-3.5 mr-1" /> Emergency
          </Badge>
        );
      case "check_car_services":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-300"
          >
            <FileText className="h-3.5 w-3.5 mr-1" /> Check Car Services
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-800 border-gray-300"
          >
            {category || "Unknown"}
          </Badge>
        );
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-gray-50 dark:bg-gray-800">
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={
                  selectedServiceTypes.length > 0 &&
                  selectedServiceTypes.length === serviceTypes.length
                }
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            {columnVisibility.name && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Name
                  <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                  {sortConfig.key === "name" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}
            {columnVisibility.description && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("description")}
              >
                <div className="flex items-center gap-1">
                  Description
                  <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                  {sortConfig.key === "description" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}
            {columnVisibility.basePrice && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("basePrice")}
              >
                <div className="flex items-center gap-1">
                  Base Price
                  <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                  {sortConfig.key === "basePrice" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}
            {columnVisibility.category && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center gap-1">
                  Category
                  <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                  {sortConfig.key === "category" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}
            {columnVisibility.estimatedDuration && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("estimatedDuration")}
              >
                <div className="flex items-center gap-1">
                  Duration
                  <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                  {sortConfig.key === "estimatedDuration" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}
            {columnVisibility.isActive && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("isActive")}
              >
                <div className="flex items-center gap-1">
                  Status
                  <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                  {sortConfig.key === "isActive" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}
            {columnVisibility.created_at && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("created_at")}
              >
                <div className="flex items-center gap-1">
                  Created Date
                  <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                  {sortConfig.key === "created_at" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}
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
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Loading service types...
                </div>
              </TableCell>
            </TableRow>
          ) : paginatedServiceTypes.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={visibleColumnCount}
                className="h-24 text-center"
              >
                <div className="text-muted-foreground">
                  {searchQuery
                    ? "No service types match your search"
                    : "No service types found"}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            paginatedServiceTypes.map((serviceType) => (
              <TableRow
                key={serviceType.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <TableCell>
                  <Checkbox
                    checked={selectedServiceTypes.includes(serviceType.id)}
                    onCheckedChange={() =>
                      handleSelectServiceType(serviceType.id)
                    }
                  />
                </TableCell>
                {columnVisibility.name && (
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Wrench className="h-4 w-4" />
                      </div>
                      {serviceType.name}
                      {serviceType.service_types_percentage?.percentage && (
                        <Badge variant="secondary" className="ml-2">
                          <PercentIcon className="h-3 w-3 mr-1" />
                          {serviceType.service_types_percentage.percentage}%
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                )}
                {columnVisibility.description && (
                  <TableCell>
                    <div
                      className="max-w-[250px] truncate"
                      title={serviceType.description}
                    >
                      {serviceType.description || "No description"}
                    </div>
                  </TableCell>
                )}
                {columnVisibility.basePrice && (
                  <TableCell>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <DollarSign className="h-3.5 w-3.5" />
                      <span className="font-mono">
                        {/* API doesn't provide basePrice, using placeholder for now */}
                        {serviceType.service_types_percentage?.percentage ||
                          "N/A"}
                        %
                      </span>
                    </div>
                  </TableCell>
                )}
                {columnVisibility.category && (
                  <TableCell>
                    {getCategoryBadge(serviceType.service_category)}
                  </TableCell>
                )}
                {columnVisibility.estimatedDuration && (
                  <TableCell>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Clock className="h-3.5 w-3.5" />
                      <span>
                        {/* API doesn't provide duration, using placeholder */}
                        N/A
                      </span>
                    </div>
                  </TableCell>
                )}
                {columnVisibility.isActive && (
                  <TableCell>
                    {/* API doesn't provide active status, assuming all are active */}
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 border-green-300"
                    >
                      <CheckCircle className="h-3.5 w-3.5 mr-1" /> Active
                    </Badge>
                  </TableCell>
                )}
                {columnVisibility.created_at && (
                  <TableCell>
                    {serviceType.created_at
                      ? new Date(serviceType.created_at).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(serviceType)}
                      className="hover:bg-blue-100 hover:text-blue-800"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(serviceType)}
                      className="hover:bg-green-100 hover:text-green-800"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {selectedServiceTypes.length > 0 && (
        <div className="flex items-center justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            {selectedServiceTypes.length} service type(s) selected
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onSetPercentage}
              className="transition-all hover:bg-blue-500 hover:text-white"
              disabled={loading}
            >
              <PercentIcon className="mr-2 h-4 w-4" />
              Set Percentage
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              disabled={loading}
              className="transition-all hover:bg-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
