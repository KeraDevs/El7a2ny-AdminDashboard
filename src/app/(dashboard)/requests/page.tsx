"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  IconRefresh,
  IconSearch,
  IconEye,
  IconEdit,
  IconFilter,
  IconDownload,
  IconClipboardList,
  IconClock,
  IconCircleCheck,
  IconCircleX,
  IconAlertCircle,
  IconUser,
  IconCar,
  IconBuilding,
  IconCurrency,
} from "@tabler/icons-react";
import { useRequestsHistoryPaginated } from "@/hooks/useRequestsHistoryPaginated";
import { useWorkshops } from "@/hooks/_useWorkshops";
import { DataPagination } from "@/components/ui/DataPagination";
import {
  ServiceRequest,
  getStatusColor,
  getPriorityColor,
} from "@/types/requestTypes";
import { format } from "date-fns";
import toast from "react-hot-toast";

// Define the type for update data
interface RequestUpdateData {
  workshop_id?: string;
  notes?: string;
  price?: number;
  scheduled_at?: Date;
}

const RequestsHistoryPage = () => {
  const {
    requests,
    loading,
    total,
    currentPage,
    pageSize,
    totalPages,
    stats,
    filters,
    handlePageChange,
    handlePageSizeChange,
    updateFilters,
    refresh,
    updateRequestDetails,
  } = useRequestsHistoryPaginated();

  const {
    workshops,
    loading: workshopsLoading,
    fetchWorkshops,
  } = useWorkshops();

  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<ServiceRequest | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    workshop_id: "",
    notes: "",
    price: "",
    scheduled_at: "",
  });

  const handleRefresh = () => {
    refresh();
    fetchWorkshops(); // Also refresh workshops
  };

  // Load workshops on component mount
  useEffect(() => {
    fetchWorkshops();
  }, [fetchWorkshops]);

  const handleViewRequest = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
  };

  const handleEditRequest = (request: ServiceRequest) => {
    setEditingRequest(request);
    setEditForm({
      workshop_id: request.workshopId || "",
      notes: request.notes || "",
      price: request.price?.toString() || "",
      scheduled_at: request.scheduledAt
        ? format(request.scheduledAt, "yyyy-MM-dd'T'HH:mm")
        : "",
    });
    setIsEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingRequest || isSaving) return;

    // Validate that a workshop is selected
    if (!editForm.workshop_id) {
      alert("Please select a workshop before saving.");
      return;
    }

    setIsSaving(true);
    try {
      const updateData: RequestUpdateData = {};

      // Always include workshop_id if it's selected
      if (editForm.workshop_id) {
        updateData.workshop_id = editForm.workshop_id;
      }
      if (
        editForm.notes !== undefined &&
        editForm.notes !== editingRequest.notes
      ) {
        updateData.notes = editForm.notes;
      }
      if (
        editForm.price &&
        parseFloat(editForm.price) !== editingRequest.price
      ) {
        updateData.price = parseFloat(editForm.price);
      }
      if (editForm.scheduled_at) {
        updateData.scheduled_at = new Date(editForm.scheduled_at);
      }

      console.log("Updating request with data:", updateData);
      await updateRequestDetails(editingRequest.id, updateData);
      setIsEditOpen(false);
      setEditingRequest(null);
    } catch {
      toast.error("Failed to update request");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = () => {
    const csvData = requests.map((request) => ({
      "Request ID": request.id,
      Customer: request.customerName,
      Service: request.serviceName,
      Vehicle: `${request.vehicleModel} (${request.vehicleYear})`,
      "License Plate": request.vehicleLicensePlate,
      Workshop: request.workshopName,
      Status: request.status,
      Priority: request.priority || "N/A",
      Price: request.price ? `${request.price} EGP` : "N/A",
      "Requested Date": format(request.requestedAt, "yyyy-MM-dd HH:mm"),
      "Scheduled Date": request.scheduledAt
        ? format(request.scheduledAt, "yyyy-MM-dd HH:mm")
        : "N/A",
      Notes: request.notes || "N/A",
    }));

    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) =>
        headers
          .map((header) => `"${row[header as keyof typeof row]}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `requests-history-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Service Requests History
          </h1>
          <p className="text-muted-foreground">
            Manage and track all service requests across the platform
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            disabled={loading || requests.length === 0}
          >
            <IconDownload className="mr-2 h-4 w-4" />
            Export CSV
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <IconRefresh
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <IconClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New</CardTitle>
            <IconAlertCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <IconClock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <IconClock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.inProgress}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <IconCircleCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.completed}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <IconCircleX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.cancelled}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-4 p-4 bg-muted rounded-lg"
      >
        <div className="flex items-center gap-2">
          <IconSearch className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="w-64"
          />
        </div>

        <Select
          value={filters.status}
          onValueChange={(value) => updateFilters({ status: value })}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.priority}
          onValueChange={(value) => updateFilters({ priority: value })}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="date"
          placeholder="From Date"
          value={filters.dateFrom}
          onChange={(e) => updateFilters({ dateFrom: e.target.value })}
          className="w-40"
        />

        <Input
          type="date"
          placeholder="To Date"
          value={filters.dateTo}
          onChange={(e) => updateFilters({ dateTo: e.target.value })}
          className="w-40"
        />

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            updateFilters({
              status: "all",
              priority: "all",
              serviceCategory: "all",
              workshopId: "all",
              dateFrom: "",
              dateTo: "",
              search: "",
            })
          }
        >
          <IconFilter className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </motion.div>

      {/* Requests Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Service Requests ({requests.length})</CardTitle>
            <CardDescription>
              {loading
                ? "Loading requests..."
                : `Showing ${requests.length} of ${total} requests`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Loading requests...</span>
              </div>
            )}

            {!loading && requests.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <IconClipboardList className="mx-auto h-12 w-12 mb-4" />
                <p>No requests found</p>
              </div>
            )}

            {!loading && requests.length > 0 && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Workshop</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-mono text-xs">
                          {request.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {request.customerName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {request.customerEmail}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.serviceName}</p>
                            <Badge variant="outline" className="text-xs">
                              {request.serviceCategory}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {request.vehicleModel}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {request.vehicleYear} •
                              {request.vehicleLicensePlate}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {request.workshopName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {request.workshopAddress}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {request.priority ? (
                            <Badge
                              className={getPriorityColor(request.priority)}
                            >
                              {request.priority}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {request.price ? (
                            <span className="font-medium">
                              {request.price.toLocaleString()} EGP
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <p>{format(request.requestedAt, "MMM dd, yyyy")}</p>
                            <p className="text-muted-foreground">
                              {format(request.requestedAt, "HH:mm")}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewRequest(request)}
                            >
                              <IconEye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditRequest(request)}
                            >
                              <IconEdit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {total > 0 && (
              <div className="border-t">
                <DataPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={total}
                  itemsPerPage={pageSize}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handlePageSizeChange}
                  itemType="requests"
                  loading={loading}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Request Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              Detailed information about the service request
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Request Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <IconClipboardList className="h-4 w-4" />
                    Request Information
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>ID:</strong> {selectedRequest.id}
                    </p>
                    <p>
                      <strong>Status:</strong>
                      <Badge
                        className={`ml-2 ${getStatusColor(
                          selectedRequest.status
                        )}`}
                      >
                        {selectedRequest.status}
                      </Badge>
                    </p>
                    <p>
                      <strong>Priority:</strong>
                      {selectedRequest.priority ? (
                        <Badge
                          className={`ml-2 ${getPriorityColor(
                            selectedRequest.priority
                          )}`}
                        >
                          {selectedRequest.priority}
                        </Badge>
                      ) : (
                        " Not set"
                      )}
                    </p>
                    <p>
                      <strong>Requested:</strong>
                      {format(selectedRequest.requestedAt, "PPpp")}
                    </p>
                    {selectedRequest.scheduledAt && (
                      <p>
                        <strong>Scheduled:</strong>{" "}
                        {format(selectedRequest.scheduledAt, "PPpp")}
                      </p>
                    )}
                    {selectedRequest.completedAt && (
                      <p>
                        <strong>Completed:</strong>{" "}
                        {format(selectedRequest.completedAt, "PPpp")}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <IconCurrency className="h-4 w-4" />
                    Service & Pricing
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Service:</strong> {selectedRequest.serviceName}
                    </p>
                    <p>
                      <strong>Category:</strong>{" "}
                      {selectedRequest.serviceCategory}
                    </p>
                    <p>
                      <strong>Description:</strong>{" "}
                      {selectedRequest.serviceDescription}
                    </p>
                    <p>
                      <strong>Price:</strong>{" "}
                      {selectedRequest.price
                        ? `${selectedRequest.price.toLocaleString()} EGP`
                        : "Not set"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <IconUser className="h-4 w-4" />
                  Customer Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p>
                      <strong>Name:</strong> {selectedRequest.customerName}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedRequest.customerEmail}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Phone:</strong> {selectedRequest.customerPhone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vehicle Info */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <IconCar className="h-4 w-4" />
                  Vehicle Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p>
                      <strong>Model:</strong> {selectedRequest.vehicleModel}
                    </p>
                    <p>
                      <strong>Year:</strong> {selectedRequest.vehicleYear}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>License Plate:</strong>{" "}
                      {selectedRequest.vehicleLicensePlate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Workshop Info */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <IconBuilding className="h-4 w-4" />
                  Workshop Information
                </h4>
                <div className="text-sm">
                  <p>
                    <strong>Name:</strong> {selectedRequest.workshopName}
                  </p>
                  <p>
                    <strong>Address:</strong> {selectedRequest.workshopAddress}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {selectedRequest.notes && (
                <div>
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-sm bg-muted p-3 rounded-md">
                    {selectedRequest.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Request Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Request</DialogTitle>
            <DialogDescription>Update request details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label htmlFor="workshop-select" className="text-sm font-medium">
                Assign Workshop *
              </label>
              <Select
                value={editForm.workshop_id}
                onValueChange={(value) =>
                  setEditForm((prev) => ({ ...prev, workshop_id: value }))
                }
              >
                <SelectTrigger id="workshop-select">
                  <SelectValue placeholder="Select workshop" />
                </SelectTrigger>
                <SelectContent>
                  {workshopsLoading ? (
                    <SelectItem value="" disabled>
                      Loading workshops...
                    </SelectItem>
                  ) : workshops.length === 0 ? (
                    <SelectItem value="" disabled>
                      No workshops available
                    </SelectItem>
                  ) : (
                    workshops.map((workshop) => (
                      <SelectItem key={workshop.id} value={workshop.id}>
                        {workshop.name} - {workshop.address}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {!editForm.workshop_id && (
                <p className="text-xs text-muted-foreground mt-1">
                  Please select a workshop to assign this request
                </p>
              )}
            </div>

            <div>
              <label htmlFor="price-input" className="text-sm font-medium">
                Price (EGP)
              </label>
              <Input
                id="price-input"
                type="number"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, price: e.target.value }))
                }
                placeholder="Enter price"
              />
            </div>

            <div>
              <label htmlFor="scheduled-date" className="text-sm font-medium">
                Scheduled Date & Time
              </label>
              <Input
                id="scheduled-date"
                type="datetime-local"
                value={editForm.scheduled_at}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    scheduled_at: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label htmlFor="notes-textarea" className="text-sm font-medium">
                Notes
              </label>
              <Textarea
                id="notes-textarea"
                value={editForm.notes}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Add notes..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestsHistoryPage;
