import React from "react";
import {
  ChevronsUpDown,
  Edit,
  Eye,
  Loader2,
  Trash2,
  FileText,
  Settings,
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

const getCategoryColor = (category: string) => {
  switch (category?.toLowerCase()) {
    case "maintenance":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "repair":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "tuning":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case "emergency":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    case "check_car_services":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

const getCategoryIcon = (category: string) => {
  switch (category?.toLowerCase()) {
    case "maintenance":
    case "repair":
    case "tuning":
      return <Settings className="h-3.5 w-3.5 mr-1" />;
    case "emergency":
      return <Settings className="h-3.5 w-3.5 mr-1" />;
    case "check_car_services":
      return <FileText className="h-3.5 w-3.5 mr-1" />;
    default:
      return <Settings className="h-3.5 w-3.5 mr-1" />;
  }
};

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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">
            Loading service types...
          </p>
        </div>
      </div>
    );
  }

  if (paginatedServiceTypes.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-sm font-semibold text-muted-foreground">
            No service types found
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchQuery
              ? `No service types match "${searchQuery}"`
              : "No service types available"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={
                  paginatedServiceTypes.length > 0 &&
                  selectedServiceTypes.length === paginatedServiceTypes.length
                }
                onCheckedChange={handleSelectAll}
                aria-label="Select all service types"
              />
            </TableHead>
            {columnVisibility.name && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Name
                  <ChevronUpDown className="h-3 w-3 text-muted-foreground" />
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
                  <ChevronUpDown className="h-3 w-3 text-muted-foreground" />
                  {sortConfig.key === "description" && (
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
                  <ChevronUpDown className="h-3 w-3 text-muted-foreground" />
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
                  Created
                  <ChevronUpDown className="h-3 w-3 text-muted-foreground" />
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
                  Updated
                  <ChevronUpDown className="h-3 w-3 text-muted-foreground" />
                  {sortConfig.key === "updated_at" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedServiceTypes.map((serviceType) => (
            <TableRow key={serviceType.id} className="hover:bg-muted/50">
              <TableCell>
                <Checkbox
                  checked={selectedServiceTypes.includes(serviceType.id)}
                  onCheckedChange={() =>
                    handleSelectServiceType(serviceType.id)
                  }
                  aria-label={`Select ${serviceType.name}`}
                />
              </TableCell>
              {columnVisibility.name && (
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{serviceType.name}</span>
                    {serviceType.name_ar && (
                      <span className="text-sm text-muted-foreground">
                        {serviceType.name_ar}
                      </span>
                    )}
                  </div>
                </TableCell>
              )}
              {columnVisibility.description && (
                <TableCell className="max-w-[300px]">
                  <div className="flex flex-col">
                    <span className="truncate">{serviceType.description}</span>
                    {serviceType.description_ar && (
                      <span className="text-sm text-muted-foreground truncate">
                        {serviceType.description_ar}
                      </span>
                    )}
                  </div>
                </TableCell>
              )}
              {columnVisibility.service_category && (
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={getCategoryColor(serviceType.service_category)}
                  >
                    {getCategoryIcon(serviceType.service_category)}
                    {serviceType.service_category.replace(/_/g, " ")}
                  </Badge>
                </TableCell>
              )}
              {columnVisibility.created_at && (
                <TableCell>{formatDate(serviceType.created_at)}</TableCell>
              )}
              {columnVisibility.updated_at && (
                <TableCell>{formatDate(serviceType.updated_at)}</TableCell>
              )}
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleView(serviceType)}
                    className="h-8 w-8"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View service type</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(serviceType)}
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit service type</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(serviceType.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete service type</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
