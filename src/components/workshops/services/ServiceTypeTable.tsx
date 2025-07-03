import React from "react";
import { Edit, Eye, Loader2, Trash2, Settings } from "lucide-react";
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
}) => {
  const visibleColumnCount =
    Object.values(columnVisibility).filter(Boolean).length + 2;

  // Get category badge
  const getCategoryBadge = (category: string) => {
    switch (category?.toLowerCase()) {
      case "maintenance":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 border-blue-300"
          >
            Maintenance
          </Badge>
        );
      case "tuning":
        return (
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-800 border-purple-300"
          >
            Tuning
          </Badge>
        );
      case "emergency":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 border-red-300"
          >
            Emergency
          </Badge>
        );
      case "check_car_services":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-300"
          >
            Check Car Services
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
                  Name (EN)
                  {sortConfig.key === "name" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}
            {columnVisibility.name_ar && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("name_ar")}
              >
                <div className="flex items-center gap-1">
                  Name (AR)
                  {sortConfig.key === "name_ar" && (
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
                  Description (EN)
                  {sortConfig.key === "description" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}
            {columnVisibility.description_ar && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("description_ar")}
              >
                <div className="flex items-center gap-1">
                  Description (AR)
                  {sortConfig.key === "description_ar" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}
            {columnVisibility.service_category && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("service_category")}
              >
                <div className="flex items-center gap-1">
                  Category
                  {sortConfig.key === "service_category" && (
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
                  {sortConfig.key === "created_at" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}
            {columnVisibility.updated_at && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("updated_at")}
              >
                <div className="flex items-center gap-1">
                  Updated Date
                  {sortConfig.key === "updated_at" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}
            <TableHead className="text-center">Actions</TableHead>
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
                        <Settings className="h-4 w-4" />
                      </div>
                      <div className="max-w-[200px]">
                        <div className="truncate" title={serviceType.name}>
                          {serviceType.name}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                )}
                {columnVisibility.name_ar && (
                  <TableCell className="font-medium">
                    <div className="max-w-[200px]">
                      <div
                        className="truncate text-right"
                        title={serviceType.name_ar}
                        dir="rtl"
                      >
                        {serviceType.name_ar || "غير متوفر"}
                      </div>
                    </div>
                  </TableCell>
                )}
                {columnVisibility.description && (
                  <TableCell>
                    <div className="max-w-[250px]">
                      <div className="truncate" title={serviceType.description}>
                        {serviceType.description || "No description"}
                      </div>
                    </div>
                  </TableCell>
                )}
                {columnVisibility.description_ar && (
                  <TableCell>
                    <div className="max-w-[250px]">
                      <div
                        className="truncate text-right"
                        title={serviceType.description_ar}
                        dir="rtl"
                      >
                        {serviceType.description_ar || "لا يوجد وصف"}
                      </div>
                    </div>
                  </TableCell>
                )}
                {columnVisibility.service_category && (
                  <TableCell>
                    {getCategoryBadge(serviceType.service_category)}
                  </TableCell>
                )}
                {columnVisibility.created_at && (
                  <TableCell>
                    {serviceType.created_at
                      ? new Date(serviceType.created_at).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                )}
                {columnVisibility.updated_at && (
                  <TableCell>
                    {serviceType.updated_at
                      ? new Date(serviceType.updated_at).toLocaleDateString()
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
              variant="destructive"
              size="sm"
              onClick={() => onDelete(selectedServiceTypes[0])}
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
