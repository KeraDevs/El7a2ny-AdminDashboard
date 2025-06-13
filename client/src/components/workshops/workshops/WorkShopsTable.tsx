import React from "react";
import { PhoneNumber } from "@/types/workshopTypes";
import {
  ChevronsUpDown,
  Edit,
  Eye,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Trash2,
  Wrench,
  Activity,
  Building,
  CheckCircle,
  XCircle,
  AlertCircle,
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
import { WorkshopsTableProps } from "@/types/workshopTypes";

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
            <Activity className="mr-1 h-3 w-3" /> Busy
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

  // Get active status badge styling
  const getActiveStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-300"
          >
            Active
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-800 border-amber-300"
          >
            Pending
          </Badge>
        );
      case "deactivated":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 border-red-300"
          >
            Deactivated
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-800 border-gray-300"
          >
            {status}
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
                  <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                  {sortConfig.key === "name" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}
            {columnVisibility.email && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center gap-1">
                  Email
                  <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                  {sortConfig.key === "email" && (
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
                  <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
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
                  <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                </div>
              </TableHead>
            )}
            {columnVisibility.status && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-1">
                  Status
                  <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                  {sortConfig.key === "status" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}
            {columnVisibility.ratings && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("ratings")}
              >
                <div className="flex items-center gap-1">
                  Ratings
                  <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
                  {sortConfig.key === "ratings" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            )}
            {columnVisibility.services && <TableHead>Services</TableHead>}
            {columnVisibility.createdDate && (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center gap-1">
                  Created Date
                  <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />
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
                        <Building className="h-4 w-4" />
                      </div>
                      {workshop.name}
                    </div>
                  </TableCell>
                )}
                {columnVisibility.email && (
                  <TableCell>
                    <a
                      href={`mailto:${workshop.email}`}
                      className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline w-fit"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      {workshop.email}
                    </a>
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
                      <Phone className="h-3.5 w-3.5" />
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md text-xs font-mono">
                        {getPrimaryPhone(workshop.phoneNumbers)}
                      </code>
                    </a>
                  </TableCell>
                )}
                {columnVisibility.status && (
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {getStatusBadge(workshop.status)}
                      <div className="mt-1">
                        {getActiveStatusBadge(workshop.active_status)}
                      </div>
                    </div>
                  </TableCell>
                )}
                {columnVisibility.ratings && (
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        <span className="font-semibold">
                          {workshop.ratings || 0}
                        </span>
                        <span className="text-yellow-500 ml-1">★</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        ({workshop.totalReviews || 0} reviews)
                      </span>
                    </div>
                  </TableCell>
                )}
                {columnVisibility.services && (
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {workshop.services && workshop.services.length > 0 ? (
                        workshop.services.slice(0, 2).map((service, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs bg-gray-100 text-gray-800 border-gray-300"
                          >
                            <Wrench className="h-3 w-3 mr-1" />
                            {service}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          No services
                        </span>
                      )}
                      {workshop.services && workshop.services.length > 2 && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-gray-100 text-gray-800 border-gray-300"
                        >
                          +{workshop.services.length - 2} more
                        </Badge>
                      )}
                    </div>
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
