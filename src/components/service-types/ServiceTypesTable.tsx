import React from "react";
import { ServiceType, ServiceTypesTableProps } from "@/types/serviceTypes";
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

export const ServiceTypesTable: React.FC<ServiceTypesTableProps> = ({
  loading,
  serviceTypes,
  selectedServiceTypes,
  handleSelectAll,
  handleSelectServiceType,
  handleEdit,
  handleView,
  onDelete,
  sortConfig,
  handleSort,
}) => {
  const allSelected =
    serviceTypes.length > 0 &&
    serviceTypes.every((serviceType) =>
      selectedServiceTypes.includes(serviceType.id)
    );
  const someSelected = selectedServiceTypes.length > 0 && !allSelected;

  const SortableHeader = ({
    column,
    children,
  }: {
    column: keyof ServiceType;
    children: React.ReactNode;
  }) => (
    <TableHead
      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      onClick={() => handleSort(column)}
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
              <TableHead>Name Ar</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Description Ar</TableHead>
              <TableHead>Created At</TableHead>
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
                <TableCell>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
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
                onCheckedChange={handleSelectAll}
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
            <SortableHeader column="name_ar">Name Ar</SortableHeader>
            <SortableHeader column="service_category">Category</SortableHeader>
            <SortableHeader column="description">Description</SortableHeader>
            <SortableHeader column="description_ar">
              Description Ar
            </SortableHeader>
            <SortableHeader column="created_at">Created At</SortableHeader>
            <TableHead className="w-32 sm:w-48">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {serviceTypes.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-8 text-muted-foreground"
              >
                No service types found
              </TableCell>
            </TableRow>
          ) : (
            serviceTypes.map((serviceType) => {
              const isSelected = selectedServiceTypes.includes(serviceType.id);

              return (
                <TableRow
                  key={serviceType.id}
                  className={isSelected ? "bg-muted/50" : ""}
                >
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() =>
                        handleSelectServiceType(serviceType.id)
                      }
                    />
                  </TableCell>

                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{serviceType.name}</span>
                      {/* Show category on mobile */}
                      <span className="text-xs text-muted-foreground sm:hidden">
                        {serviceType.service_category}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    <div className="flex flex-col">
                      <span>{serviceType.name_ar || "N/A"}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground hidden sm:table-cell">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {serviceType.service_category}
                    </span>
                  </TableCell>

                  <TableCell className="max-w-xs hidden md:table-cell">
                    <div className="truncate text-muted-foreground">
                      {serviceType.description || "No description"}
                    </div>
                  </TableCell>

                  <TableCell className="max-w-xs hidden lg:table-cell">
                    <div className="truncate text-muted-foreground">
                      {serviceType.description_ar || "N/A"}
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    <div className="flex flex-col">
                      <span>
                        {format(
                          new Date(serviceType.created_at),
                          "MMM dd, yyyy"
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(serviceType.created_at), "HH:mm")}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(serviceType)}
                        className="h-8 w-8 p-0"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(serviceType)}
                        className="h-8 w-8 p-0"
                        title="Edit service type"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(serviceType.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="Delete service type"
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
