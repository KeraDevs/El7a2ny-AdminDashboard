import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  ServiceRequest,
  RequestsStats,
  RequestsFilters,
  mapApiRequestToFrontend,
} from "@/types/requestTypes";
import {
  getAllRequests,
  getMyRequests,
  getRequestById,
  updateRequest,
  updateRequestStatus,
} from "@/utils/requestsApi";
import toast from "react-hot-toast";

interface RequestSearchParams {
  status?: string;
  priority?: string;
  serviceCategory?: string;
  workshopId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

interface RequestApiParams {
  limit: number;
  offset: number;
  status?: string;
  priority?: string;
  service_type_id?: string;
  workshop_id?: string;
  from?: string;
  to?: string;
  search?: string;
}

interface UpdateRequestData {
  workshop_id?: string;
  notes?: string;
  price?: string;
  scheduled_at?: string;
}

export const useRequestsHistory = () => {
  const { currentUser, userData } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  // Filters
  const [filters, setFilters] = useState<RequestsFilters>({
    status: "all",
    priority: "all",
    serviceCategory: "all",
    workshopId: "all",
    dateFrom: "",
    dateTo: "",
    search: "",
  });

  // Calculate stats from current requests
  const stats: RequestsStats = {
    total: requests.length,
    new: requests.filter((r) => r.status === "New").length,
    pending: requests.filter((r) => r.status === "Pending").length,
    inProgress: requests.filter((r) => r.status === "In Progress").length,
    completed: requests.filter((r) => r.status === "Completed").length,
    cancelled: requests.filter((r) => r.status === "Cancelled").length,
  };

  // Fetch all requests (for superadmin)
  const fetchAllRequests = useCallback(
    async (searchParams?: RequestSearchParams) => {
      if (!currentUser) {
        setError("Authentication required");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const authToken = await currentUser.getIdToken();

        // Build API parameters
        const apiParams: RequestApiParams = {
          limit: 100, // Get more records
          offset: 0,
        };

        if (searchParams?.status && searchParams.status !== "all") {
          apiParams.status = searchParams.status;
        }
        if (searchParams?.priority && searchParams.priority !== "all") {
          apiParams.priority = searchParams.priority;
        }
        if (
          searchParams?.serviceCategory &&
          searchParams.serviceCategory !== "all"
        ) {
          apiParams.service_type_id = searchParams.serviceCategory;
        }
        if (searchParams?.workshopId && searchParams.workshopId !== "all") {
          apiParams.workshop_id = searchParams.workshopId;
        }
        if (searchParams?.dateFrom) {
          apiParams.from = searchParams.dateFrom;
        }
        if (searchParams?.dateTo) {
          apiParams.to = searchParams.dateTo;
        }
        if (searchParams?.search) {
          apiParams.search = searchParams.search;
        }

        const response = await getAllRequests(authToken, apiParams);

        const mappedRequests = response.requests.map(mapApiRequestToFrontend);

        setRequests(mappedRequests);
        setTotal(response.total);

        toast.success(`Loaded ${mappedRequests.length} requests`);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch requests";
        setError(errorMessage);
        toast.error(errorMessage);
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  // Fetch user's own requests
  const fetchMyRequests = useCallback(async () => {
    if (!currentUser) {
      setError("Authentication required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const authToken = await currentUser.getIdToken();
      const response = await getMyRequests(authToken);

      const mappedRequests = response.requests.map(mapApiRequestToFrontend);

      setRequests(mappedRequests);
      setTotal(response.total);

      toast.success(`Loaded ${mappedRequests.length} of your requests`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch your requests";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching my requests:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Update request status
  const updateStatus = useCallback(
    async (requestId: string, newStatus: ServiceRequest["status"]) => {
      if (!currentUser) return;

      try {
        const authToken = await currentUser.getIdToken();
        await updateRequestStatus(requestId, newStatus, authToken);

        // Update local state
        setRequests((prev) =>
          prev.map((req) =>
            req.id === requestId ? { ...req, status: newStatus } : req
          )
        );

        toast.success(`Request status updated to ${newStatus}`);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update status";
        toast.error(errorMessage);
        console.error("Error updating status:", err);
      }
    },
    [currentUser]
  );

  // Update request details
  const updateRequestDetails = useCallback(
    async (
      requestId: string,
      updateData: Partial<{
        workshop_id: string;
        notes: string;
        price: number;
        scheduled_at: Date;
      }>
    ) => {
      if (!currentUser) {
        toast.error("Authentication required");
        return;
      }

      try {
        const authToken = await currentUser.getIdToken();

        // Convert data for API
        const apiData: UpdateRequestData = {};
        if (updateData.workshop_id)
          apiData.workshop_id = updateData.workshop_id;
        if (updateData.notes !== undefined) apiData.notes = updateData.notes;
        if (updateData.price) apiData.price = updateData.price.toString();
        if (updateData.scheduled_at)
          apiData.scheduled_at = updateData.scheduled_at.toISOString();

        console.log("Sending API request with data:", apiData);

        const updatedRequest = await updateRequest(
          requestId,
          apiData,
          authToken
        );
        console.log("API response:", updatedRequest);

        const mappedRequest = mapApiRequestToFrontend(updatedRequest);

        // Update local state
        setRequests((prev) =>
          prev.map((req) => (req.id === requestId ? mappedRequest : req))
        );

        toast.success("Request updated successfully");

        // Refresh the requests to get the latest data
        await fetchAllRequests();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update request";
        toast.error(errorMessage);
        console.error("Error updating request:", err);
        throw err; // Re-throw so the calling function can handle it
      }
    },
    [currentUser, fetchAllRequests]
  );

  // Get request by ID
  const getRequest = useCallback(
    async (requestId: string): Promise<ServiceRequest | null> => {
      if (!currentUser) return null;

      try {
        const authToken = await currentUser.getIdToken();
        const apiRequest = await getRequestById(requestId, authToken);
        return mapApiRequestToFrontend(apiRequest);
      } catch (err) {
        console.error("Error fetching request by ID:", err);
        return null;
      }
    },
    [currentUser]
  );

  // Apply filters to requests
  const filteredRequests = requests.filter((request) => {
    // Status filter
    if (filters.status !== "all" && request.status !== filters.status) {
      return false;
    }

    // Priority filter
    if (filters.priority !== "all" && request.priority !== filters.priority) {
      return false;
    }

    // Service category filter
    if (
      filters.serviceCategory !== "all" &&
      request.serviceCategory !== filters.serviceCategory
    ) {
      return false;
    }

    // Workshop filter
    if (
      filters.workshopId !== "all" &&
      request.workshopId !== filters.workshopId
    ) {
      return false;
    }

    // Date range filter
    if (filters.dateFrom && request.requestedAt < new Date(filters.dateFrom)) {
      return false;
    }
    if (filters.dateTo && request.requestedAt > new Date(filters.dateTo)) {
      return false;
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        request.customerName.toLowerCase().includes(searchTerm) ||
        request.serviceName.toLowerCase().includes(searchTerm) ||
        request.vehicleModel.toLowerCase().includes(searchTerm) ||
        request.workshopName.toLowerCase().includes(searchTerm) ||
        request.vehicleLicensePlate.toLowerCase().includes(searchTerm) ||
        request.id.toLowerCase().includes(searchTerm)
      );
    }

    return true;
  });

  // Initial fetch based on user role
  useEffect(() => {
    if (currentUser) {
      // For superadmin, fetch all requests. For others, fetch their own requests.
      if (userData?.type === "superadmin") {
        fetchAllRequests();
      } else {
        fetchMyRequests();
      }
    }
  }, [currentUser, userData, fetchAllRequests, fetchMyRequests]);

  // Re-fetch when filters change (only for superadmin with access to filtered endpoints)
  useEffect(() => {
    if (currentUser && userData?.type === "superadmin") {
      fetchAllRequests(filters);
    }
  }, [filters, fetchAllRequests, currentUser, userData]);

  return {
    requests: filteredRequests,
    allRequests: requests, // Unfiltered for stats
    loading,
    error,
    total,
    stats,
    filters,
    setFilters,
    fetchAllRequests,
    fetchMyRequests,
    updateStatus,
    updateRequestDetails,
    getRequest,
    setError,
  };
};
