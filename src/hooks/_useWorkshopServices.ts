import { useState, useCallback } from "react";
import {
  WorkshopService,
  CreateWorkshopServiceData,
  UpdateWorkshopServiceData,
  BatchCreateWorkshopServiceData,
  WorkshopServicesResponse,
  WorkshopServicesPagination,
  WorkshopServicesStats,
} from "@/types/workshopServiceTypes";
import { useAuth } from "@/contexts/AuthContext";
import { API_KEY, API_BASE_URL } from "@/utils/config";
import toast from "react-hot-toast";

export interface UseWorkshopServicesReturn {
  workshopServices: WorkshopService[];
  selectedWorkshopServices: string[];
  loading: boolean;
  error: string | null;
  pagination: WorkshopServicesPagination;
  stats: WorkshopServicesStats;
  editingWorkshopService: WorkshopService | null;
  openWorkshopServiceDialog: boolean;
  fetchWorkshopServices: (
    page?: number,
    limit?: number,
    searchQuery?: string,
    workshopId?: string
  ) => Promise<void>;
  fetchWorkshopServiceById: (
    workshopId: string,
    serviceTypeId: string
  ) => Promise<WorkshopService | null>;
  fetchServicesByWorkshop: (workshopId: string) => Promise<void>;
  fetchServicesByServiceType: (serviceTypeId: string) => Promise<void>;
  fetchWorkshopsByService: (serviceTypeId: string) => Promise<void>;
  handleAddWorkshopService: (
    serviceData: CreateWorkshopServiceData
  ) => Promise<void>;
  handleBatchCreateServices: (
    batchData: BatchCreateWorkshopServiceData
  ) => Promise<void>;
  handleEditWorkshopService: (
    workshopId: string,
    serviceTypeId: string,
    serviceData: UpdateWorkshopServiceData
  ) => Promise<void>;
  handleDeleteWorkshopService: (
    workshopId: string,
    serviceTypeId: string
  ) => Promise<void>;
  handleDeleteWorkshopServices: (serviceIds: string[]) => Promise<void>;
  handleSelectAll: (checked: boolean) => void;
  handleSelectWorkshopService: (serviceId: string) => void;
  setEditingWorkshopService: React.Dispatch<
    React.SetStateAction<WorkshopService | null>
  >;
  setOpenWorkshopServiceDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  refreshData: () => Promise<void>;
}

export const useWorkshopServices = (): UseWorkshopServicesReturn => {
  const { currentUser } = useAuth();
  const [workshopServices, setWorkshopServices] = useState<WorkshopService[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedWorkshopServices, setSelectedWorkshopServices] = useState<
    string[]
  >([]);
  const [editingWorkshopService, setEditingWorkshopService] =
    useState<WorkshopService | null>(null);
  const [openWorkshopServiceDialog, setOpenWorkshopServiceDialog] =
    useState(false);
  const [pagination, setPagination] = useState<WorkshopServicesPagination>({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
  });
  const [stats, setStats] = useState<WorkshopServicesStats>({
    totalServices: 0,
    averagePercentage: 0,
    workshopsWithServices: 0,
  });

  /**
   * Fetch workshop services with pagination and filtering
   */
  const fetchWorkshopServices = useCallback(
    async (page = 1, limit = 10, searchQuery = "", workshopId = "") => {
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

        const offset = (page - 1) * limit;
        const params = new URLSearchParams({
          limit: limit.toString(),
          offset: offset.toString(),
        });

        if (searchQuery.trim()) {
          params.append("search", searchQuery.trim());
        }

        if (workshopId) {
          params.append("workshop_id", workshopId);
        }

        // Always use the same endpoint, filter by workshop_id via query param
        const endpoint = `${API_BASE_URL}/workshops/services`;

        const response = await fetch(`${endpoint}?${params}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
            "x-api-key": API_KEY,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API Error: ${response.status} - ${errorText}`);

          // Handle 404 errors gracefully (no workshop services found or no workshops in DB)
          if (response.status === 404) {
            // If there is no workshop in the database, treat as empty result, not an error
            setWorkshopServices([]);
            setPagination({
              page,
              limit,
              total: 0,
              hasMore: false,
            });
            setStats({
              totalServices: 0,
              averagePercentage: 0,
              workshopsWithServices: 0,
            });
            // Do not set error or show toast
            return;
          }

          throw new Error(
            `API Error: ${response.status} - ${response.statusText}`
          );
        }

        const data: WorkshopServicesResponse = await response.json();

        // Handle empty or invalid response
        if (!data) {
          console.warn("Empty response from API");
          setWorkshopServices([]);
          setPagination({
            page,
            limit,
            total: 0,
            hasMore: false,
          });
          setStats({
            totalServices: 0,
            averagePercentage: 0,
            workshopsWithServices: 0,
          });
          return;
        }

        if (page === 1) {
          setWorkshopServices(data.services || []);
        } else {
          setWorkshopServices((prev) => [...prev, ...(data.services || [])]);
        }

        setPagination({
          page,
          limit,
          total: data.pagination?.total || data.services?.length || 0,
          hasMore: data.pagination?.hasMore || false,
        });

        // Calculate stats
        const services = data.services || [];
        const totalPercentage = services.reduce(
          (sum, s) => sum + s.percentage,
          0
        );
        const uniqueWorkshops = new Set(services.map((s) => s.workshop_id))
          .size;

        setStats({
          totalServices: services.length,
          averagePercentage:
            services.length > 0 ? totalPercentage / services.length : 0,
          workshopsWithServices: uniqueWorkshops,
        });
      } catch (err) {
        console.error("Error fetching workshop services:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to fetch workshop services";
        setError(errorMessage);

        // Set empty data for graceful handling
        setWorkshopServices([]);
        setPagination({
          page: 1,
          limit: 10,
          total: 0,
          hasMore: false,
        });
        setStats({
          totalServices: 0,
          averagePercentage: 0,
          workshopsWithServices: 0,
        });

        // Only show toast for non-404 errors (404 means no services exist yet)
        if (
          !errorMessage.includes("404") &&
          !errorMessage.includes("API Error: 404")
        ) {
          toast.error("Failed to fetch workshop services");
        }
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  /**
   * Fetch a specific workshop service by workshop ID and service type ID
   */
  const fetchWorkshopServiceById = useCallback(
    async (
      workshopId: string,
      serviceTypeId: string
    ): Promise<WorkshopService | null> => {
      if (!currentUser) {
        setError("Authentication required");
        return null;
      }

      try {
        const authToken = await currentUser.getIdToken();
        if (!API_KEY) {
          throw new Error("API key is missing");
        }

        const response = await fetch(
          `${API_BASE_URL}/workshops/services/${workshopId}/${serviceTypeId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
              "x-api-key": API_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const service: WorkshopService = await response.json();
        return service;
      } catch (err) {
        console.error("Error fetching workshop service:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch workshop service"
        );
        return null;
      }
    },
    [currentUser]
  );

  /**
   * Fetch services by workshop ID
   */
  const fetchServicesByWorkshop = useCallback(
    async (workshopId: string) => {
      await fetchWorkshopServices(1, 100, "", workshopId);
    },
    [fetchWorkshopServices]
  );

  /**
   * Fetch services by service type ID
   */
  const fetchServicesByServiceType = useCallback(
    async (serviceTypeId: string) => {
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
          `${API_BASE_URL}/workshops/services/service/type/${serviceTypeId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
              "x-api-key": API_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: WorkshopServicesResponse = await response.json();
        setWorkshopServices(data.services || []);
      } catch (err) {
        console.error("Error fetching services by type:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch services"
        );
        toast.error("Failed to fetch services");
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  /**
   * Fetch workshops by service type ID
   */
  const fetchWorkshopsByService = useCallback(
    async (serviceTypeId: string) => {
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
          `${API_BASE_URL}/workshops/services/workshops/byService/${serviceTypeId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
              "x-api-key": API_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // This endpoint returns workshops, not services, so we might need to handle it differently
        console.log("Workshops providing service:", data);
      } catch (err) {
        console.error("Error fetching workshops by service:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch workshops"
        );
        toast.error("Failed to fetch workshops");
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  /**
   * Add a new workshop service
   */
  const handleAddWorkshopService = useCallback(
    async (serviceData: CreateWorkshopServiceData) => {
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
          `${API_BASE_URL}/workshops/services/create/${serviceData.workshop_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
              "x-api-key": API_KEY,
            },
            body: JSON.stringify(serviceData),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newService: WorkshopService = await response.json();
        setWorkshopServices((prev) => [newService, ...prev]);
        toast.success("Workshop service added successfully");
      } catch (err) {
        console.error("Error adding workshop service:", err);
        setError(
          err instanceof Error ? err.message : "Failed to add workshop service"
        );
        toast.error("Failed to add workshop service");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  /**
   * Batch create workshop services
   */
  const handleBatchCreateServices = useCallback(
    async (batchData: BatchCreateWorkshopServiceData) => {
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
          `${API_BASE_URL}/workshops/services/batch/${batchData.workshop_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
              "x-api-key": API_KEY,
            },
            body: JSON.stringify({ services: batchData.services }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            `Batch Create API Error: ${response.status} - ${errorText}`
          );

          // Handle specific error cases
          if (response.status === 404) {
            throw new Error(
              "Workshop not found. Please select a valid workshop."
            );
          } else if (response.status === 400) {
            throw new Error("Invalid service data. Please check your inputs.");
          } else if (response.status === 409) {
            throw new Error(
              "One or more services already exist for this workshop."
            );
          }

          throw new Error(
            `API Error: ${response.status} - ${response.statusText}`
          );
        }

        const newServices: WorkshopService[] = await response.json();
        setWorkshopServices((prev) => [...newServices, ...prev]);
        toast.success(
          `${newServices.length} workshop services added successfully`
        );
      } catch (err) {
        console.error("Error batch creating workshop services:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to batch create workshop services";
        setError(errorMessage);
        // Don't show toast here as it's handled in the component
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  /**
   * Edit a workshop service
   */
  const handleEditWorkshopService = useCallback(
    async (
      workshopId: string,
      serviceTypeId: string,
      serviceData: UpdateWorkshopServiceData
    ) => {
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
          `${API_BASE_URL}/workshops/services/${workshopId}/${serviceTypeId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
              "x-api-key": API_KEY,
            },
            body: JSON.stringify(serviceData),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updatedService: WorkshopService = await response.json();
        setWorkshopServices((prev) =>
          prev.map((service) =>
            service.workshop_id === workshopId &&
            service.service_type_id === serviceTypeId
              ? updatedService
              : service
          )
        );
        toast.success("Workshop service updated successfully");
      } catch (err) {
        console.error("Error updating workshop service:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to update workshop service"
        );
        toast.error("Failed to update workshop service");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  /**
   * Delete a workshop service
   */
  const handleDeleteWorkshopService = useCallback(
    async (workshopId: string, serviceTypeId: string) => {
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
          `${API_BASE_URL}/workshops/services/${workshopId}/${serviceTypeId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
              "x-api-key": API_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setWorkshopServices((prev) =>
          prev.filter(
            (service) =>
              !(
                service.workshop_id === workshopId &&
                service.service_type_id === serviceTypeId
              )
          )
        );
        toast.success("Workshop service deleted successfully");
      } catch (err) {
        console.error("Error deleting workshop service:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to delete workshop service"
        );
        toast.error("Failed to delete workshop service");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  /**
   * Delete multiple workshop services
   */
  const handleDeleteWorkshopServices = useCallback(
    async (serviceIds: string[]) => {
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

        // Since we don't have a batch delete endpoint, delete services one by one
        for (const serviceId of serviceIds) {
          const service = workshopServices.find((s) => s.id === serviceId);
          if (service) {
            await handleDeleteWorkshopService(
              service.workshop_id,
              service.service_type_id
            );
          }
        }

        toast.success(
          `${serviceIds.length} workshop services deleted successfully`
        );
      } catch (err) {
        console.error("Error deleting workshop services:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to delete workshop services"
        );
        toast.error("Failed to delete workshop services");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentUser, workshopServices, handleDeleteWorkshopService]
  );

  /**
   * Handle select all workshop services
   */
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedWorkshopServices(
          workshopServices.map((service) => service.id)
        );
      } else {
        setSelectedWorkshopServices([]);
      }
    },
    [workshopServices]
  );

  /**
   * Handle select individual workshop service
   */
  const handleSelectWorkshopService = useCallback((serviceId: string) => {
    setSelectedWorkshopServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  }, []);

  /**
   * Refresh data
   */
  const refreshData = useCallback(async () => {
    await fetchWorkshopServices(1, pagination.limit);
  }, [fetchWorkshopServices, pagination.limit]);

  return {
    workshopServices,
    selectedWorkshopServices,
    loading,
    error,
    pagination,
    stats,
    editingWorkshopService,
    openWorkshopServiceDialog,
    fetchWorkshopServices,
    fetchWorkshopServiceById,
    fetchServicesByWorkshop,
    fetchServicesByServiceType,
    fetchWorkshopsByService,
    handleAddWorkshopService,
    handleBatchCreateServices,
    handleEditWorkshopService,
    handleDeleteWorkshopService,
    handleDeleteWorkshopServices,
    handleSelectAll,
    handleSelectWorkshopService,
    setEditingWorkshopService,
    setOpenWorkshopServiceDialog,
    setError,
    refreshData,
  };
};
