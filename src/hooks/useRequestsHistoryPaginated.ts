import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  ServiceRequest,
  RequestsStats,
  RequestsFilters,
  mapApiRequestToFrontend,
} from "@/types/requestTypes";
import { getAllRequestsPaginated, updateRequest } from "@/utils/requestsApi";
import toast from "react-hot-toast";

interface PaginatedRequestsResponse {
  requests: ServiceRequest[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export const useRequestsHistoryPaginated = () => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

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

  // Calculate stats from current requests (simplified version)
  const stats: RequestsStats = {
    total: total,
    new: requests.filter((r) => r.status === "New").length,
    pending: requests.filter((r) => r.status === "Pending").length,
    inProgress: requests.filter((r) => r.status === "In Progress").length,
    completed: requests.filter((r) => r.status === "Completed").length,
    cancelled: requests.filter((r) => r.status === "Cancelled").length,
  };

  // Fetch paginated requests
  const fetchRequests = useCallback(
    async (page: number = currentPage, limit: number = pageSize) => {
      if (!currentUser) {
        setError("Authentication required");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const authToken = await currentUser.getIdToken();

        // Build filter parameters
        const filterParams: any = {};

        if (filters.status !== "all") {
          filterParams.status = filters.status;
        }
        if (filters.priority !== "all") {
          filterParams.priority = filters.priority;
        }
        if (filters.serviceCategory !== "all") {
          filterParams.service_type_id = filters.serviceCategory;
        }
        if (filters.workshopId !== "all") {
          filterParams.workshop_id = filters.workshopId;
        }
        if (filters.dateFrom) {
          filterParams.from = filters.dateFrom;
        }
        if (filters.dateTo) {
          filterParams.to = filters.dateTo;
        }
        if (filters.search) {
          filterParams.search = filters.search;
        }

        const response = await getAllRequestsPaginated(
          authToken,
          page,
          limit,
          filterParams
        );

        const mappedRequests = response.requests.map(mapApiRequestToFrontend);

        setRequests(mappedRequests);
        setTotal(response.total);
        setCurrentPage(page);
        setPageSize(limit);
        setTotalPages(Math.ceil(response.total / limit));

        toast.success(
          `Loaded ${mappedRequests.length} of ${response.total} requests`
        );
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
    [currentUser, filters, currentPage, pageSize]
  );

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      fetchRequests(page, pageSize);
    },
    [fetchRequests, pageSize]
  );

  // Handle page size change
  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      setPageSize(newPageSize);
      setCurrentPage(1); // Reset to first page
      fetchRequests(1, newPageSize);
    },
    [fetchRequests]
  );

  // Handle filter changes
  const updateFilters = useCallback((newFilters: Partial<RequestsFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

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
        const apiData: any = {};
        if (updateData.workshop_id)
          apiData.workshop_id = updateData.workshop_id;
        if (updateData.notes !== undefined) apiData.notes = updateData.notes;
        if (updateData.price) apiData.price = updateData.price.toString();
        if (updateData.scheduled_at)
          apiData.scheduled_at = updateData.scheduled_at.toISOString();

        const updatedRequest = await updateRequest(
          requestId,
          apiData,
          authToken
        );
        const mappedRequest = mapApiRequestToFrontend(updatedRequest);

        // Update local state
        setRequests((prev) =>
          prev.map((req) => (req.id === requestId ? mappedRequest : req))
        );

        toast.success("Request updated successfully");

        // Refresh the requests to get the latest data
        await fetchRequests(currentPage, pageSize);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update request";
        toast.error(errorMessage);
        console.error("Error updating request:", err);
        throw err;
      }
    },
    [currentUser, fetchRequests, currentPage, pageSize]
  );

  // Refresh current data
  const refresh = useCallback(() => {
    fetchRequests(currentPage, pageSize);
  }, [fetchRequests, currentPage, pageSize]);

  // Initial fetch and when filters change
  useEffect(() => {
    if (currentUser) {
      fetchRequests(1, pageSize);
    }
  }, [currentUser, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    // Data
    requests,
    loading,
    error,
    total,
    currentPage,
    pageSize,
    totalPages,
    stats,
    filters,

    // Actions
    fetchRequests,
    handlePageChange,
    handlePageSizeChange,
    updateFilters,
    refresh,
    updateRequestDetails,
    setError,
  };
};
