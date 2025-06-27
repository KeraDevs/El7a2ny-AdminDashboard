"use client";

import { useState, useEffect } from "react";
import RequestsHeader from "@/components/requests/RequestHeader";
import RequestsStats from "@/components/requests/RequestsStats";
import RequestsFilters from "@/components/requests/RequestsFilter";
import RequestsTable from "@/components/requests/requestsTable";
import AssignWorkshopDialog from "@/components/requests/AssignWorkshopDialog";
import RequestDetailsDialog from "@/components/requests/RequestDetailsDialog";
import { FloatingDownloadButton } from "@/components/ui/FloatingDownloadButton";

// Types
export interface ServiceRequest {
  id: string;
  customerName: string;
  vehicle: string;
  service: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  date: string;
  workshop: string;
  urgency: "high" | "normal" | "low";
  workshopId?: string;
}

export interface Workshop {
  id: string;
  name: string;
  location: string;
  rating: number;
}

const mockRequests: ServiceRequest[] = [
  {
    id: "REQ-1234",
    customerName: "Ahmed Hassan",
    vehicle: "BMW X5 2022",
    service: "Oil Change",
    status: "pending",
    date: "2025-05-01",
    workshop: "Cairo Auto Center",
    urgency: "normal",
    workshopId: "w1",
  },
  {
    id: "REQ-1235",
    customerName: "Fatima Ali",
    vehicle: "Mercedes C200 2021",
    service: "Brake Replacement",
    status: "in-progress",
    date: "2025-05-01",
    workshop: "Elite Motors",
    urgency: "high",
    workshopId: "w2",
  },
  {
    id: "REQ-1236",
    customerName: "Mohamed Ibrahim",
    vehicle: "Toyota Corolla 2023",
    service: "Annual Inspection",
    status: "completed",
    date: "2025-04-30",
    workshop: "AutoFix Workshop",
    urgency: "normal",
    workshopId: "w3",
  },
  {
    id: "REQ-1237",
    customerName: "Sara Mahmoud",
    vehicle: "Honda Civic 2024",
    service: "Tire Rotation",
    status: "pending",
    date: "2025-05-02",
    workshop: "Cairo Auto Center",
    urgency: "low",
    workshopId: "w1",
  },
  {
    id: "REQ-1238",
    customerName: "Khaled Ahmed",
    vehicle: "Hyundai Tucson 2022",
    service: "Engine Diagnostics",
    status: "cancelled",
    date: "2025-04-29",
    workshop: "Elite Motors",
    urgency: "high",
    workshopId: "w2",
  },
];

// Sample workshops data
const mockWorkshops: Workshop[] = [
  { id: "w1", name: "Cairo Auto Center", location: "Cairo", rating: 4.8 },
  { id: "w2", name: "Elite Motors", location: "Alexandria", rating: 4.5 },
  { id: "w3", name: "AutoFix Workshop", location: "Giza", rating: 4.2 },
  { id: "w4", name: "Premium Auto Care", location: "Cairo", rating: 4.9 },
  {
    id: "w5",
    name: "Express Mechanics",
    location: "Sharm El Sheikh",
    rating: 4.0,
  },
];

const RequestsPage = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>(mockRequests);
  const [workshops] = useState<Workshop[]>(mockWorkshops);
  const [filteredRequests, setFilteredRequests] =
    useState<ServiceRequest[]>(requests);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Dialog states
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  // Filter requests based on status and search term
  useEffect(() => {
    const filtered = requests.filter((request) => {
      // Filter by status
      if (statusFilter !== "all" && request.status !== statusFilter)
        return false;

      // Search functionality
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          request.customerName.toLowerCase().includes(searchLower) ||
          request.vehicle.toLowerCase().includes(searchLower) ||
          request.service.toLowerCase().includes(searchLower) ||
          request.id.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });

    setFilteredRequests(filtered);
  }, [requests, statusFilter, searchTerm]);

  // Calculate statistics
  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    inProgress: requests.filter((r) => r.status === "in-progress").length,
    completed: requests.filter((r) => r.status === "completed").length,
  };

  // View request details
  const handleViewRequest = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
  };

  // Edit request
  const handleEditRequest = (request: ServiceRequest) => {
    setSelectedRequest(request);
    // Implement edit functionality
    console.log("Edit request:", request);
  };

  // Assign workshop
  const handleAssignWorkshop = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setIsAssignOpen(true);
  };

  // Save workshop assignment
  const saveWorkshopAssignment = (requestId: string, workshopId: string) => {
    const updatedRequests = requests.map((req) =>
      req.id === requestId
        ? {
            ...req,
            workshopId,
            workshop:
              workshops.find((w) => w.id === workshopId)?.name || req.workshop,
          }
        : req
    );

    setRequests(updatedRequests);
    setIsAssignOpen(false);
  };

  return (
    <div className="space-y-6">
      <RequestsHeader />

      <RequestsStats stats={stats} />

      <RequestsFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <RequestsTable
        requests={filteredRequests}
        totalRequests={requests.length}
        onView={handleViewRequest}
        onEdit={handleEditRequest}
        onAssign={handleAssignWorkshop}
      />

      {selectedRequest && (
        <>
          <RequestDetailsDialog
            request={selectedRequest}
            isOpen={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
          />

          <AssignWorkshopDialog
            request={selectedRequest}
            workshops={workshops}
            isOpen={isAssignOpen}
            onClose={() => setIsAssignOpen(false)}
            onSave={saveWorkshopAssignment}
          />
        </>
      )}

      {/* Floating Download Button */}
      <FloatingDownloadButton
        data={filteredRequests.map((request) => ({
          id: request.id,
          customerName: request.customerName,
          vehicle: request.vehicle,
          service: request.service,
          status: request.status,
          date: request.date,
          workshop: request.workshop,
          urgency: request.urgency,
        }))}
        filename={`service-requests`}
        pageName="Service Requests Management"
        headers={[
          { label: "Request ID", key: "id" },
          { label: "Customer Name", key: "customerName" },
          { label: "Vehicle", key: "vehicle" },
          { label: "Service", key: "service" },
          { label: "Status", key: "status" },
          { label: "Date", key: "date" },
          { label: "Workshop", key: "workshop" },
          { label: "Urgency", key: "urgency" },
        ]}
      />
    </div>
  );
};

export default RequestsPage;
