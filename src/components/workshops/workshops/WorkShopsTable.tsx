import React, { useState } from "react";
import {
  Edit,
  Eye,
  Loader2,
  MapPin,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building2,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PhoneNumber,
  Workshop,
  WorkshopsTableProps,
} from "@/types/workshopTypes";

// Active Status Dropdown Component
const ActiveStatusDropdown = ({
  workshop,
  onStatusChange,
  loading,
}: {
  workshop: Workshop;
  onStatusChange: (
    workshopId: string,
    status: "active" | "deactivated" | "pending"
  ) => Promise<void>;
  loading: boolean;
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === workshop.active_status) return;

    setIsUpdating(true);
    try {
      await onStatusChange(
        workshop.id,
        newStatus as "active" | "deactivated" | "pending"
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50 border-green-200";
      case "deactivated":
        return "text-red-600 bg-red-50 border-red-200";
      case "pending":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <Select
      value={workshop.active_status}
      onValueChange={handleStatusChange}
      disabled={loading || isUpdating}
    >
      <SelectTrigger
        className={`w-32 h-8 text-xs font-medium ${getStatusColor(
          workshop.active_status
        )}`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending" className="text-orange-600">
          Pending
        </SelectItem>
        <SelectItem value="active" className="text-green-600">
          Active
        </SelectItem>
        <SelectItem value="deactivated" className="text-red-600">
          Deactivated
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export const WorkshopsTable: React.FC<WorkshopsTableProps> = ({
  loading,
  paginatedWorkshops,
  columnVisibility,
  sortConfig,
  handleSort,
  selectedWorkshops,
  handleSelectAll,
  handleSelectWorkshop,
  handleEdit,
  handleView,
  searchQuery,
  workshops,
  onDelete,
  onStatusChange,
}) => {
  const visibleColumnCount =
    Object.values(columnVisibility).filter(Boolean).length + 2;

  // Get the primary phone number from workshop
  const getPrimaryPhone = (phoneNumbers: PhoneNumber[] | undefined): string => {
    if (!phoneNumbers || phoneNumbers.length === 0) return "Not available";
    const primary = phoneNumbers.find((p) => p.is_primary);
    return primary ? primary.phone_number : phoneNumbers[0].phone_number;
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-300"
          >
            <CheckCircle className="mr-1 h-3 w-3" /> Open
          </Badge>
        );
      case "busy":
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-800 border-amber-300"
          >
            <CheckCircle className="mr-1 h-3 w-3" /> Busy
          </Badge>
        );
      case "closed":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 border-red-300"
          >
            <XCircle className="mr-1 h-3 w-3" /> Closed
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-800 border-gray-300"
          >
            <AlertCircle className="mr-1 h-3 w-3" /> {status}
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
                  selectedWorkshops.length > 0 &&
                  selectedWorkshops.length === workshops.length
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
                  Workshop Name
                  {sortConfig.key === "name" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}
            {columnVisibility.address && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("address")}
              >
                <div className="flex items-center gap-1">
                  Address
                  {sortConfig.key === "address" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}
            {columnVisibility.phone && (
              <TableHead className="cursor-pointer">
                <div className="flex items-center gap-1">
                  Phone
                  <Filter className="h-3 w-3 text-muted-foreground" />
                </div>
              </TableHead>
            )}
            {columnVisibility.operatingStatus && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-1">
                  Operating Status
                  {sortConfig.key === "status" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}
            {columnVisibility.activeStatus && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("active_status")}
              >
                <div className="flex items-center gap-1">
                  Active Status
                  {sortConfig.key === "active_status" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}
            {columnVisibility.createdDate && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center gap-1">
                  Created Date
                  {sortConfig.key === "createdAt" && (
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
                  Loading workshops...
                </div>
              </TableCell>
            </TableRow>
          ) : paginatedWorkshops.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={visibleColumnCount}
                className="h-24 text-center"
              >
                <div className="text-muted-foreground">
                  {searchQuery
                    ? "No workshops match your search"
                    : "No workshops found"}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            paginatedWorkshops.map((workshop) => (
              <TableRow
                key={workshop.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <TableCell>
                  <Checkbox
                    checked={selectedWorkshops.includes(workshop.id)}
                    onCheckedChange={() => handleSelectWorkshop(workshop.id)}
                  />
                </TableCell>
                {columnVisibility.name && (
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Building2 className="h-4 w-4" />
                      </div>
                      {workshop.name}
                    </div>
                  </TableCell>
                )}
                {columnVisibility.address && (
                  <TableCell>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 w-fit">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="truncate max-w-[200px]">
                        {workshop.address}
                      </span>
                    </div>
                  </TableCell>
                )}
                {columnVisibility.phone && (
                  <TableCell>
                    <a
                      href={`tel:${getPrimaryPhone(workshop.phoneNumbers)}`}
                      className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:underline w-fit"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md text-xs font-mono">
                        {getPrimaryPhone(workshop.phoneNumbers)}
                      </code>
                    </a>
                  </TableCell>
                )}
                {columnVisibility.operatingStatus && (
                  <TableCell>{getStatusBadge(workshop.status)}</TableCell>
                )}
                {columnVisibility.activeStatus && (
                  <TableCell>
                    <ActiveStatusDropdown
                      workshop={workshop}
                      onStatusChange={onStatusChange}
                      loading={loading}
                    />
                  </TableCell>
                )}
                {columnVisibility.createdDate && (
                  <TableCell>
                    {new Date(workshop.createdAt).toLocaleDateString()}
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(workshop)}
                      className="hover:bg-blue-100 hover:text-blue-800"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(workshop)}
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

      {selectedWorkshops.length > 0 && (
        <div className="flex items-center justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            {selectedWorkshops.length} workshops selected
          </div>
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
      )}
    </div>
  );
};
