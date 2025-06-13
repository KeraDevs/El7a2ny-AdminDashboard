// src/hooks/_useRequests.ts
import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { API_KEY, API_BASE_URL } from "@/utils/config";
import toast from "react-hot-toast";

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

export interface RequestsStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}

export interface UseRequestsReturn {
  requests: ServiceRequest[];
  selectedRequests: string[];
  workshops: Workshop[];
  stats: RequestsStats;
  loading: boolean;
  error: string | null;
  editingRequest: ServiceRequest | null;
  openRequestDialog: boolean;
  fetchRequests: () => Promise<void>;
  fetchRequestById: (id: string) => Promise<ServiceRequest | null>;
  fetchWorkshopRequests: (workshopId: string) => Promise<void>;
  fetchWorkshops: () => Promise<void>;
  handleEditRequest: (requestData: Partial<ServiceRequest>) => Promise<void>;
  handleDeleteRequests: () => Promise<void>;
  handleSelectAll: (checked: boolean) => void;
  handleSelectRequest: (requestId: string) => void;
  setEditingRequest: React.Dispatch<
    React.SetStateAction<ServiceRequest | null>
  >;
  setOpenRequestDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedRequests: React.Dispatch<React.SetStateAction<string[]>>;
  updateRequestStatus: (
    id: string,
    status: ServiceRequest["status"]
  ) => Promise<void>;
  assignWorkshop: (requestId: string, workshopId: string) => Promise<void>;
  createRequest: (
    request: Omit<ServiceRequest, "id" | "date">
  ) => Promise<void>;
}

export const useRequests = (): UseRequestsReturn => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [editingRequest, setEditingRequest] = useState<ServiceRequest | null>(
    null
  );
  const [openRequestDialog, setOpenRequestDialog] = useState(false);

  // Calculate stats based on current requests
  const stats: RequestsStats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    inProgress: requests.filter((r) => r.status === "in-progress").length,
    completed: requests.filter((r) => r.status === "completed").length,
    cancelled: requests.filter((r) => r.status === "cancelled").length,
  };

  // Fetch all service requests
  const fetchRequests = useCallback(async () => {
    if (!currentUser) {
      setError("Authentication required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const authToken = await currentUser.getIdToken();
      if (!API_KEY) {
        throw new Error("API key is missing");
      }

      // Initial fetch to get the first batch
      const response = await fetch(
        `${API_BASE_URL}/services/requests/my-requests`,
        {
          headers: {
            "x-api-key": API_KEY,
            Authorization: `Bearer ${authToken}`,
          } as HeadersInit,
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch requests: ${response.status} ${response.statusText}`
        );
      }

      const initialResult = await response.json();
      let allRequests = initialResult.requests || [];

      // Handle pagination if your API supports it
      // This is a simplified example, adjust based on your API's pagination structure
      let hasMore = initialResult.hasMore;
      let offset = 50; // First skip will be 50

      while (hasMore) {
        const nextPageResponse = await fetch(
          `${API_BASE_URL}/services/requests/my-requests?skip=${offset}&take=50`,
          {
            headers: {
              "x-api-key": API_KEY,
              Authorization: `Bearer ${authToken}`,
            } as HeadersInit,
          }
        );

        if (!nextPageResponse.ok) {
          throw new Error(
            `Failed to fetch requests page: ${nextPageResponse.status}`
          );
        }

        const nextPageResult = await nextPageResponse.json();
        const nextPageRequests = nextPageResult.requests || [];

        allRequests = [...allRequests, ...nextPageRequests];
        hasMore = nextPageResult.hasMore;
        offset += 50;

        if (nextPageRequests.length === 0) {
          break;
        }
      }

      setRequests(allRequests);
    } catch (error) {
      toast.error("Error fetching service requests!");
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch service requests"
      );
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Fetch service request by ID
  const fetchRequestById = useCallback(
    async (id: string): Promise<ServiceRequest | null> => {
      if (!currentUser) {
        setError("Authentication required");
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const authToken = await currentUser.getIdToken();
        if (!API_KEY) {
          throw new Error("API key is missing");
        }

        const response = await fetch(
          `${API_BASE_URL}/services/requests/${id}`,
          {
            headers: {
              "x-api-key": API_KEY,
              Authorization: `Bearer ${authToken}`,
            } as HeadersInit,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch request: ${response.status} ${response.statusText}`
          );
        }

        const result = await response.json();
        return result;
      } catch (error) {
        toast.error("Error fetching service request!");
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch service request"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  // Fetch all service requests for a workshop
  const fetchWorkshopRequests = useCallback(
    async (workshopId: string) => {
      if (!currentUser) {
        setError("Authentication required");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const authToken = await currentUser.getIdToken();
        if (!API_KEY) {
          throw new Error("API key is missing");
        }

        const response = await fetch(
          `${API_BASE_URL}/services/requests/workshop/${workshopId}`,
          {
            headers: {
              "x-api-key": API_KEY,
              Authorization: `Bearer ${authToken}`,
            } as HeadersInit,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch workshop requests: ${response.status} ${response.statusText}`
          );
        }

        const result = await response.json();
        setRequests(result.requests || []);
      } catch (error) {
        toast.error("Error fetching workshop requests!");
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch workshop requests"
        );
        setRequests([]);
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  // Fetch all workshops
  const fetchWorkshops = useCallback(async () => {
    if (!currentUser) {
      setError("Authentication required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const authToken = await currentUser.getIdToken();
      if (!API_KEY) {
        throw new Error("API key is missing");
      }

      const response = await fetch(`${API_BASE_URL}/workshops`, {
        headers: {
          "x-api-key": API_KEY,
          Authorization: `Bearer ${authToken}`,
        } as HeadersInit,
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch workshops: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      setWorkshops(result.workshops || []);
    } catch (error) {
      toast.error("Error fetching workshops!");
      setError(
        error instanceof Error ? error.message : "Failed to fetch workshops"
      );
      setWorkshops([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Create a new request
  const createRequest = useCallback(
    async (requestData: Omit<ServiceRequest, "id" | "date">): Promise<void> => {
      if (!currentUser) {
        throw new Error("Authentication required");
      }

      setLoading(true);
      setError(null);

      try {
        const authToken = await currentUser.getIdToken();
        if (!API_KEY) {
          throw new Error("API key is missing");
        }

        const response = await fetch(`${API_BASE_URL}/services/requests`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
            Authorization: `Bearer ${authToken}`,
          } as HeadersInit,
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to create request, status: ${response.status}`
          );
        }

        const result = await response.json();

        // Add the new request to the state
        setRequests((prevRequests) => [...prevRequests, result]);
        toast.success("Service request created successfully");
      } catch (error) {
        toast.error("Error creating service request");
        setError(
          error instanceof Error
            ? error.message
            : "Failed to create service request"
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  // Edit request
  const handleEditRequest = useCallback(
    async (requestData: Partial<ServiceRequest>): Promise<void> => {
      if (!requestData.id) {
        throw new Error("Request ID is required for editing");
      }

      if (!currentUser) {
        throw new Error("Authentication required");
      }

      try {
        setLoading(true);
        const authToken = await currentUser.getIdToken();

        if (!API_KEY) {
          throw new Error("API key is missing");
        }

        const response = await fetch(
          `${API_BASE_URL}/services/requests/${requestData.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY,
              Authorization: `Bearer ${authToken}`,
            } as HeadersInit,
            body: JSON.stringify(requestData),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to edit request, status: ${response.status}`);
        }

        // Update the requests array with the updated request
        setRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === requestData.id
              ? { ...request, ...requestData }
              : request
          )
        );

        toast.success("Service request updated successfully");
      } catch (error) {
        toast.error("Error updating service request");
        setError(
          error instanceof Error
            ? error.message
            : "Failed to update service request"
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  // Update request status
  const updateRequestStatus = useCallback(
    async (id: string, status: ServiceRequest["status"]): Promise<void> => {
      if (!currentUser) {
        throw new Error("Authentication required");
      }

      try {
        setLoading(true);
        const authToken = await currentUser.getIdToken();

        if (!API_KEY) {
          throw new Error("API key is missing");
        }

        const response = await fetch(
          `${API_BASE_URL}/services/requests/${id}/status`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY,
              Authorization: `Bearer ${authToken}`,
            } as HeadersInit,
            body: JSON.stringify({ status }),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to update request status, status: ${response.status}`
          );
        }

        // Update the requests array with the updated status
        setRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === id ? { ...request, status } : request
          )
        );

        toast.success(`Status updated to ${status}`);
      } catch (error) {
        toast.error("Error updating request status");
        setError(
          error instanceof Error
            ? error.message
            : "Failed to update request status"
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  // Assign workshop to request
  const assignWorkshop = useCallback(
    async (requestId: string, workshopId: string): Promise<void> => {
      if (!currentUser) {
        throw new Error("Authentication required");
      }

      try {
        setLoading(true);
        const authToken = await currentUser.getIdToken();

        if (!API_KEY) {
          throw new Error("API key is missing");
        }

        // Get the workshop name from our state
        const workshop = workshops.find((w) => w.id === workshopId);
        if (!workshop) {
          throw new Error("Workshop not found");
        }

        // Update the request with the workshop information
        const response = await fetch(
          `${API_BASE_URL}/services/requests/${requestId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY,
              Authorization: `Bearer ${authToken}`,
            } as HeadersInit,
            body: JSON.stringify({
              workshopId,
              workshop: workshop.name,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to assign workshop, status: ${response.status}`
          );
        }

        // Update the requests array with the updated workshop
        setRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === requestId
              ? { ...request, workshopId, workshop: workshop.name }
              : request
          )
        );

        toast.success(`Workshop ${workshop.name} assigned successfully`);
      } catch (error) {
        toast.error("Error assigning workshop");
        setError(
          error instanceof Error ? error.message : "Failed to assign workshop"
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentUser, workshops]
  );

  // Delete requests
  const handleDeleteRequests = useCallback(async (): Promise<void> => {
    if (!currentUser) {
      throw new Error("Authentication required");
    }

    if (selectedRequests.length === 0) {
      throw new Error("No requests selected for deletion");
    }

    try {
      setLoading(true);
      const authToken = await currentUser.getIdToken();

      if (!API_KEY) {
        throw new Error("API key is missing");
      }

      const deletePromises = selectedRequests.map(async (requestId) => {
        // Use the specified API endpoint
        const response = await fetch(
          `${API_BASE_URL}/services/requests/${requestId}`,
          {
            method: "DELETE",
            headers: {
              "x-api-key": API_KEY,
              Authorization: `Bearer ${authToken}`,
            } as HeadersInit,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to delete request ${requestId}: ${response.status}`
          );
        }
      });

      await Promise.all(deletePromises);

      // Update the local state to remove deleted requests
      setRequests((prevRequests) =>
        prevRequests.filter((request) => !selectedRequests.includes(request.id))
      );

      // Clear selection after successful deletion
      setSelectedRequests([]);

      toast.success(
        `Successfully deleted ${selectedRequests.length} request(s)`
      );
    } catch (error) {
      toast.error(
        "Error deleting requests: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
      setError(
        error instanceof Error ? error.message : "Failed to delete requests"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  }, [currentUser, selectedRequests]);

  // Handle select all requests
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedRequests(checked ? requests.map((request) => request.id) : []);
    },
    [requests]
  );

  // Handle select individual request
  const handleSelectRequest = useCallback((requestId: string) => {
    setSelectedRequests((prev) =>
      prev.includes(requestId)
        ? prev.filter((id) => id !== requestId)
        : [...prev, requestId]
    );
  }, []);

  return {
    requests,
    selectedRequests,
    workshops,
    stats,
    loading,
    error,
    editingRequest,
    openRequestDialog,
    fetchRequests,
    fetchRequestById,
    fetchWorkshopRequests,
    fetchWorkshops,
    createRequest,
    handleEditRequest,
    handleDeleteRequests,
    handleSelectAll,
    handleSelectRequest,
    setEditingRequest,
    setOpenRequestDialog,
    setError,
    setSelectedRequests,
    updateRequestStatus,
    assignWorkshop,
  };
};
