import React from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Edit, Trash, ArrowUpDown, MapPin, Settings } from "lucide-react";
import {
  WorkshopServicesTableProps,
  WorkshopService,
} from "@/types/workshopServiceTypes";

export const WorkshopServicesTable: React.FC<WorkshopServicesTableProps> = ({
  loading,
  paginatedWorkshopServices,
  columnVisibility,
  sortConfig,
  handleSort,
  selectedWorkshopServices,
  handleSelectAll,
  handleSelectWorkshopService,
  handleEdit,
  handleView,
  searchQuery,
  workshopServices,
  onDelete,
}) => {
  const formatPercentage = (percentage: number | null | undefined) => {
    if (percentage === null || percentage === undefined || isNaN(percentage)) {
      return "0.0%";
    }
    return `${percentage.toFixed(1)}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
  };

  const handleDeleteSingle = (service: any) => {
    onDelete(service.id);
  };

  const SortableHeader = ({
    column,
    children,
  }: {
    column: keyof WorkshopService | string;
    children: React.ReactNode;
  }) => (
    <Button
      variant="ghost"
      className="h-auto p-0 font-medium hover:bg-transparent"
      onClick={() => handleSort(column as keyof WorkshopService)}
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  const LoadingSkeleton = () => (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
    </TableRow>
  );

  const NoDataRow = () => (
    <TableRow>
      <TableCell colSpan={7} className="text-center py-8">
        <div className="flex flex-col items-center gap-2">
          <Settings className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">
            {searchQuery
              ? "No workshop services found matching your search"
              : "No workshop services found"}
          </p>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={
                  paginatedWorkshopServices.length > 0 &&
                  paginatedWorkshopServices.every((service) =>
                    selectedWorkshopServices.includes(service.id)
                  )
                }
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            {columnVisibility.workshop_name && (
              <TableHead>
                <SortableHeader column="workshop_name">Workshop</SortableHeader>
              </TableHead>
            )}
            {columnVisibility.service_name && (
              <TableHead>
                <SortableHeader column="service_name">Service</SortableHeader>
              </TableHead>
            )}
            {columnVisibility.percentage && (
              <TableHead>
                <SortableHeader column="percentage">Percentage</SortableHeader>
              </TableHead>
            )}
            {columnVisibility.created_at && (
              <TableHead>
                <SortableHeader column="created_at">Created</SortableHeader>
              </TableHead>
            )}
            {columnVisibility.updated_at && (
              <TableHead>
                <SortableHeader column="updated_at">Updated</SortableHeader>
              </TableHead>
            )}
            <TableHead className="w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <LoadingSkeleton key={`loading-skeleton-${index}`} />
            ))
          ) : paginatedWorkshopServices.length === 0 ? (
            <NoDataRow />
          ) : (
            paginatedWorkshopServices.map((service) => (
              <TableRow
                key={`service-${service.id || service.workshop_id}-${
                  service.service_type_id
                }`}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedWorkshopServices.includes(service.id)}
                    onCheckedChange={() =>
                      handleSelectWorkshopService(service.id)
                    }
                  />
                </TableCell>
                {columnVisibility.workshop_name && (
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {service.workshop?.name || "Unknown Workshop"}
                      </span>
                      {service.workshop?.address && (
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {service.workshop.address}
                        </span>
                      )}
                    </div>
                  </TableCell>
                )}
                {columnVisibility.service_name && (
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {service.service_type?.name || "Unknown Service"}
                      </span>
                      {service.service_type?.description && (
                        <span className="text-sm text-muted-foreground">
                          {service.service_type.description}
                        </span>
                      )}
                      {service.service_type?.service_category && (
                        <Badge variant="outline" className="mt-1 w-fit">
                          {service.service_type.service_category}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                )}
                {columnVisibility.percentage && (
                  <TableCell>
                    <span className="font-medium text-lg">
                      {formatPercentage(service.percentage)}
                    </span>
                  </TableCell>
                )}
                {columnVisibility.created_at && (
                  <TableCell>{formatDate(service.created_at)}</TableCell>
                )}
                {columnVisibility.updated_at && (
                  <TableCell>{formatDate(service.updated_at)}</TableCell>
                )}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(service)}
                      className="h-8 px-2"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(service)}
                      className="h-8 px-2"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSingle(service)}
                      className="h-8 px-2 text-destructive hover:text-destructive"
                    >
                      <Trash className="h-4 w-4" />
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
