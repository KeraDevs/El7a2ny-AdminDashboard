// Request status type
export type RequestStatus =
  | "New"
  | "Pending"
  | "In Progress"
  | "Completed"
  | "Cancelled";

// Request priority type
export type RequestPriority = "Low" | "Medium" | "High" | "Urgent";

// Review interface
export interface Review {
  id: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

// Emergency service interface
export interface EmergencyService {
  id: string;
  type: string;
  description?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiServiceRequest {
  id: string;
  user_id: string;
  vehicle_id: string;
  workshop_id: string;
  service_type_id: string;
  status: "New" | "Pending" | "In Progress" | "Completed" | "Cancelled";
  priority: "low" | "medium" | "high" | null;
  notes: string | null;
  price: string | null;
  requested_at: string;
  scheduled_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  service_types: {
    id: string;
    service_category: string;
    name: string;
    name_ar: string;
    description: string;
    description_ar: string;
    created_at: string;
    updated_at: string;
  };
  users: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  vehicles: {
    id: string;
    model: string;
    year: number;
    license_plate: string;
  };
  workshops: {
    id: string;
    name: string;
    address: string;
    profile_pic: string | null;
  };
  reviews: Review | null;
  emergency_services: EmergencyService | null;
}

export interface ApiRequestsResponse {
  requests: ApiServiceRequest[];
  total: number;
}

// Frontend Service Request Interface
export interface ServiceRequest {
  id: string;
  userId: string;
  vehicleId: string;
  workshopId: string;
  serviceTypeId: string;
  status: "New" | "Pending" | "In Progress" | "Completed" | "Cancelled";
  priority: "low" | "medium" | "high" | null;
  notes: string | null;
  price: number | null;
  requestedAt: Date;
  scheduledAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // Related data
  serviceName: string;
  serviceNameAr: string;
  serviceDescription: string;
  serviceCategory: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleLicensePlate: string;
  workshopName: string;
  workshopAddress: string;
  workshopProfilePic: string | null;
}

export interface RequestsStats {
  total: number;
  new: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}

export interface RequestsFilters {
  status: string;
  priority: string;
  serviceCategory: string;
  workshopId: string;
  dateFrom: string;
  dateTo: string;
  search: string;
}

// Helper function to map API response to frontend interface
export const mapApiRequestToFrontend = (
  apiRequest: ApiServiceRequest
): ServiceRequest => ({
  id: apiRequest.id,
  userId: apiRequest.user_id,
  vehicleId: apiRequest.vehicle_id,
  workshopId: apiRequest.workshop_id,
  serviceTypeId: apiRequest.service_type_id,
  status: apiRequest.status,
  priority: apiRequest.priority,
  notes: apiRequest.notes,
  price: apiRequest.price ? parseFloat(apiRequest.price) : null,
  requestedAt: new Date(apiRequest.requested_at),
  scheduledAt: apiRequest.scheduled_at
    ? new Date(apiRequest.scheduled_at)
    : null,
  completedAt: apiRequest.completed_at
    ? new Date(apiRequest.completed_at)
    : null,
  createdAt: new Date(apiRequest.created_at),
  updatedAt: new Date(apiRequest.updated_at),

  // Related data with null checks
  serviceName: apiRequest.service_types?.name || "",
  serviceNameAr: apiRequest.service_types?.name_ar || "",
  serviceDescription: apiRequest.service_types?.description || "",
  serviceCategory: apiRequest.service_types?.service_category || "",
  customerName: apiRequest.users
    ? `${apiRequest.users.first_name || ""} ${
        apiRequest.users.last_name || ""
      }`.trim()
    : "",
  customerEmail: apiRequest.users?.email || "",
  customerPhone: apiRequest.users?.phone || "",
  vehicleModel: apiRequest.vehicles?.model || "",
  vehicleYear: apiRequest.vehicles?.year || 0,
  vehicleLicensePlate: apiRequest.vehicles?.license_plate || "",
  workshopName: apiRequest.workshops?.name || "",
  workshopAddress: apiRequest.workshops?.address || "",
  workshopProfilePic: apiRequest.workshops?.profile_pic || null,
});

export interface RequestDetailsDialogProps {
  request: ServiceRequest;
  isOpen: boolean;
  onClose: () => void;
}

export interface RequestsTableProps {
  requests: ServiceRequest[];
  totalRequests: number;
  onView: (request: ServiceRequest) => void;
  onEdit: (request: ServiceRequest) => void;
  onAssign: (request: ServiceRequest) => void;
}

// Status color mapping
export const getStatusColor = (status: ServiceRequest["status"]): string => {
  switch (status) {
    case "New":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "In Progress":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    case "Completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "Cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

// Priority color mapping
export const getPriorityColor = (
  priority: ServiceRequest["priority"]
): string => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};
