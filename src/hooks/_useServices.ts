import { useState, useCallback } from "react";
import {
  ServiceType,
  CreateServiceTypeData,
  UpdateServiceTypeData,
  ServiceTypesResponse,
  ServiceTypesPagination,
} from "@/types/serviceTypes";
import { useAuth } from "@/contexts/AuthContext";
import { API_KEY, API_BASE_URL } from "@/utils/config";
import toast from "react-hot-toast";

export interface UseServiceTypesReturn {
  serviceTypes: ServiceType[];
  selectedServiceTypes: string[];
  loading: boolean;
  error: string | null;
  pagination: ServiceTypesPagination;
  editingServiceType: ServiceType | null;
  openServiceTypeDialog: boolean;
  fetchServiceTypes: (
    page?: number,
    limit?: number,
    searchQuery?: string
  ) => Promise<void>;
  fetchServiceTypeById: (id: string) => Promise<ServiceType | null>;
  fetchServiceTypesByCategory: (category: string) => Promise<void>;
  handleAddServiceType: (
    serviceTypeData: CreateServiceTypeData
  ) => Promise<void>;
  handleEditServiceType: (
    serviceTypeData: Partial<ServiceType>
  ) => Promise<void>;
  handleDeleteServiceTypes: (serviceTypeIds: string[]) => Promise<void>;
  checkServiceTypesCanBeDeleted: (serviceTypeIds: string[]) => Promise<{
    canDelete: string[];
    cannotDelete: Array<{ id: string; name: string; reason: string }>;
  }>;
  handleSelectAll: (checked: boolean) => void;
  handleSelectServiceType: (serviceTypeId: string) => void;
  setEditingServiceType: React.Dispatch<
    React.SetStateAction<ServiceType | null>
  >;
  setOpenServiceTypeDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useServiceTypes = (): UseServiceTypesReturn => {
  const { currentUser } = useAuth();
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>(
    []
  );
  const [editingServiceType, setEditingServiceType] =
    useState<ServiceType | null>(null);
  const [openServiceTypeDialog, setOpenServiceTypeDialog] = useState(false);
  const [pagination, setPagination] = useState<ServiceTypesPagination>({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
  });

  /**
   * Fetch all service types from the API with pagination
   */
  const fetchServiceTypes = useCallback(
    async (page = 1, limit = 10, searchQuery = "") => {
      if (!currentUser) {
        setError("Authentication required");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log(
          `Fetching service types page ${page} with limit ${limit} and search "${searchQuery}"...`
        );
        const authToken = await currentUser.getIdToken();
        if (!API_KEY) {
          throw new Error("API key is missing");
        }

        const offset = (page - 1) * limit;
        const params = new URLSearchParams({
          limit: limit.toString(),
          offset: offset.toString(),
        });

        // Add search query if provided
        if (searchQuery.trim()) {
          params.append("search", searchQuery.trim());
        }

        // Get service types with pagination
        const response = await fetch(
          `${API_BASE_URL}/services/types?${params}`,
          {
            headers: {
              "x-api-key": API_KEY,
              Authorization: `Bearer ${authToken}`,
            } as HeadersInit,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch service types: ${response.status} ${response.statusText}`
          );
        }

        const result: ServiceTypesResponse = await response.json();
        console.log("Fetched service types:", result);

        if (result.serviceTypes && Array.isArray(result.serviceTypes)) {
          console.log(
            `Found ${result.serviceTypes.length} service types out of total: ${result.total}`
          );

          // Always replace the service types for proper pagination (not infinite scroll)
          setServiceTypes(result.serviceTypes);

          setPagination({
            page,
            limit,
            total: result.total,
            hasMore: result.hasMore,
          });
        } else {
          console.warn("Unexpected response format:", result);
          setServiceTypes([]);
          setPagination({ page: 1, limit, total: 0, hasMore: false });
        }
      } catch (error) {
        console.error("Error fetching service types:", error);
        toast.error("Error fetching service types!");
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch service types"
        );
        setServiceTypes([]);
        setPagination({ page: 1, limit, total: 0, hasMore: false });
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  /**
   * Fetch a service type by ID
   */
  const fetchServiceTypeById = useCallback(
    async (id: string): Promise<ServiceType | null> => {
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

        // Get specific service type
        const response = await fetch(`${API_BASE_URL}/services/types/${id}`, {
          headers: {
            "x-api-key": API_KEY,
            Authorization: `Bearer ${authToken}`,
          } as HeadersInit,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch service type: ${response.status} ${response.statusText}`
          );
        }

        const result = await response.json();
        // The API might return the service type directly or nested in a property
        return result.type || result || null;
      } catch (error) {
        toast.error("Error fetching service type!");
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch service type"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  /**
   * Fetch service types by category
   */
  const fetchServiceTypesByCategory = useCallback(
    async (category: string) => {
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

        // Get service types by category
        const response = await fetch(
          `${API_BASE_URL}/services/types/category/${category}`,
          {
            headers: {
              "x-api-key": API_KEY,
              Authorization: `Bearer ${authToken}`,
            } as HeadersInit,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch service types by category: ${response.status} ${response.statusText}`
          );
        }

        const result = await response.json();
        // The API might return serviceTypes or types property
        if (result.serviceTypes && Array.isArray(result.serviceTypes)) {
          setServiceTypes(result.serviceTypes);
        } else if (result.types && Array.isArray(result.types)) {
          setServiceTypes(result.types);
        } else if (Array.isArray(result)) {
          setServiceTypes(result);
        } else {
          console.warn("Unexpected response format:", result);
          setServiceTypes([]);
        }
      } catch (error) {
        toast.error("Error fetching service types by category!");
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch service types by category"
        );
        setServiceTypes([]);
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  /**
   * Add a new service type
   */
  const handleAddServiceType = useCallback(
    async (serviceTypeData: CreateServiceTypeData): Promise<void> => {
      if (!currentUser) {
        throw new Error("Authentication required");
      }

      try {
        console.log("Adding service type:", serviceTypeData);
        setLoading(true);
        const authToken = await currentUser.getIdToken();

        if (!API_KEY) {
          throw new Error("API key is missing");
        }

        // Create service type
        const response = await fetch(`${API_BASE_URL}/services/types`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
            Authorization: `Bearer ${authToken}`,
          } as HeadersInit,
          body: JSON.stringify(serviceTypeData),
        });

        const responseText = await response.text();
        console.log("Add service type API response:", responseText);

        if (!response.ok) {
          let errorMessage;
          try {
            const errorData = JSON.parse(responseText);
            errorMessage =
              errorData.message ||
              `Failed to add service type: ${response.status}`;
          } catch {
            errorMessage = `Failed to add service type: ${response.status} - ${responseText}`;
          }
          throw new Error(errorMessage);
        }

        // Refresh the service types list
        await fetchServiceTypes();
        toast.success("Service type added successfully");
      } catch (error) {
        toast.error("Error adding service type");
        setError(
          error instanceof Error ? error.message : "Failed to add service type"
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentUser, fetchServiceTypes]
  );

  /**
   * Edit a service type
   */
  const handleEditServiceType = useCallback(
    async (serviceTypeData: Partial<ServiceType>): Promise<void> => {
      if (!serviceTypeData.id) {
        throw new Error("Service Type ID is required for editing");
      }

      if (!currentUser) {
        throw new Error("Authentication required");
      }

      try {
        console.log("Editing service type:", serviceTypeData);
        setLoading(true);
        const authToken = await currentUser.getIdToken();

        if (!API_KEY) {
          throw new Error("API key is missing");
        }

        // Create update data object with only the fields that can be updated
        const updateData: UpdateServiceTypeData = {
          name: serviceTypeData.name,
          name_ar: serviceTypeData.name_ar,
          description: serviceTypeData.description,
          description_ar: serviceTypeData.description_ar,
          service_category: serviceTypeData.service_category,
        };

        // Clean undefined values from the update data
        Object.keys(updateData).forEach((key) => {
          if (updateData[key as keyof UpdateServiceTypeData] === undefined) {
            delete updateData[key as keyof UpdateServiceTypeData];
          }
        });

        console.log("Sending update data to API:", updateData);
        console.log("Original service type data:", serviceTypeData);

        // Update service type
        const response = await fetch(
          `${API_BASE_URL}/services/types/${serviceTypeData.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY,
              Authorization: `Bearer ${authToken}`,
            } as HeadersInit,
            body: JSON.stringify(updateData),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error Response:", errorText);
          throw new Error(
            `Failed to edit service type, status: ${response.status}, message: ${errorText}`
          );
        }

        const responseData = await response.json();
        console.log("API Update Response:", responseData);

        // Update the service types array with the updated service type
        setServiceTypes((prevServiceTypes) =>
          prevServiceTypes.map((serviceType) =>
            serviceType.id === serviceTypeData.id
              ? { ...serviceType, ...updateData }
              : serviceType
          )
        );

        toast.success("Service type updated successfully");
      } catch (error) {
        toast.error("Error editing service type");
        setError(
          error instanceof Error ? error.message : "Failed to edit service type"
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  /**
   * Delete service types (only those that can be deleted)
   */
  const handleDeleteServiceTypes = useCallback(
    async (serviceTypeIds: string[]): Promise<void> => {
      if (!currentUser) {
        throw new Error("Authentication required");
      }

      if (serviceTypeIds.length === 0) {
        throw new Error("No service types selected for deletion");
      }

      try {
        console.log(
          "Starting deletion process for service types:",
          serviceTypeIds
        );
        setLoading(true);
        const authToken = await currentUser.getIdToken();

        if (!API_KEY) {
          throw new Error("API key is missing");
        }

        // Track deletion results
        const deletedIds: string[] = [];
        const failedIds: Array<{ id: string; name: string; reason: string }> =
          [];

        for (const serviceTypeId of serviceTypeIds) {
          const serviceType = serviceTypes.find(
            (st) => st.id === serviceTypeId
          );
          const serviceName = serviceType?.name || serviceTypeId;

          try {
            console.log(
              `Deleting service type: ${serviceTypeId} (${serviceName})`
            );

            const response = await fetch(
              `${API_BASE_URL}/services/types/${serviceTypeId}`,
              {
                method: "DELETE",
                headers: {
                  "x-api-key": API_KEY,
                  Authorization: `Bearer ${authToken}`,
                  "Content-Type": "application/json",
                } as HeadersInit,
              }
            );

            if (response.ok) {
              console.log(
                `✅ Successfully deleted service type: ${serviceTypeId} (${serviceName})`
              );
              deletedIds.push(serviceTypeId);
            } else {
              const errorText = await response.text();
              console.error(
                `❌ Failed to delete ${serviceTypeId} (${serviceName}):`,
                errorText
              );

              // Determine the reason for failure
              let reason = "Unknown error";
              if (
                response.status === 409 ||
                errorText.includes("Foreign key") ||
                errorText.includes("constraint")
              ) {
                reason = "Service type is currently being used by workshops";
              } else if (response.status === 404) {
                reason = "Service type not found";
              } else {
                reason = `Server error: ${response.status}`;
              }

              failedIds.push({ id: serviceTypeId, name: serviceName, reason });
            }
          } catch (error) {
            console.error(
              `❌ Exception deleting ${serviceTypeId} (${serviceName}):`,
              error
            );
            failedIds.push({
              id: serviceTypeId,
              name: serviceName,
              reason: "Network or server error",
            });
          }
        }

        // Update local state for successfully deleted items
        if (deletedIds.length > 0) {
          setServiceTypes((prevServiceTypes) =>
            prevServiceTypes.filter(
              (serviceType) => !deletedIds.includes(serviceType.id)
            )
          );

          // Clear selection for deleted items
          setSelectedServiceTypes((prev) =>
            prev.filter((id) => !deletedIds.includes(id))
          );
        }

        // Handle results and provide appropriate feedback
        if (deletedIds.length > 0 && failedIds.length === 0) {
          // All deletions successful - don't show toast here, let the dialog handle it
          return;
        } else if (deletedIds.length > 0 && failedIds.length > 0) {
          // Partial success - some deleted, some failed
          const inUseCount = failedIds.filter((f) =>
            f.reason.includes("being used")
          ).length;

          if (inUseCount === failedIds.length) {
            // All failures were due to being in use
            throw new Error(
              `${deletedIds.length} service type(s) deleted successfully, but ${inUseCount} could not be deleted as they are currently being used by workshops`
            );
          } else {
            // Mixed failure reasons
            throw new Error(
              `${deletedIds.length} service type(s) deleted successfully, but ${failedIds.length} failed due to various errors`
            );
          }
        } else if (deletedIds.length === 0 && failedIds.length > 0) {
          // All deletions failed
          const inUseCount = failedIds.filter((f) =>
            f.reason.includes("being used")
          ).length;
          if (inUseCount === failedIds.length) {
            throw new Error(
              "Cannot delete: All selected service types are currently being used by workshops"
            );
          } else {
            throw new Error(
              "Failed to delete service types due to server errors"
            );
          }
        }
      } catch (error) {
        console.error("Error in delete process:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentUser, serviceTypes]
  );

  /**
   * Check if service types can be deleted by testing for usage in workshops
   */
  const checkServiceTypesCanBeDeleted = useCallback(
    async (
      serviceTypeIds: string[]
    ): Promise<{
      canDelete: string[];
      cannotDelete: Array<{ id: string; name: string; reason: string }>;
    }> => {
      if (!currentUser) {
        throw new Error("Authentication required");
      }

      if (serviceTypeIds.length === 0) {
        return { canDelete: [], cannotDelete: [] };
      }

      try {
        const authToken = await currentUser.getIdToken();
        if (!API_KEY) {
          throw new Error("API key is missing");
        }

        const canDelete: string[] = [];
        const cannotDelete: Array<{
          id: string;
          name: string;
          reason: string;
        }> = [];

        console.log("🔍 Checking which service types can be deleted...");

        // Check each service type by making a test call to see if it's in use
        for (const serviceTypeId of serviceTypeIds) {
          const serviceType = serviceTypes.find(
            (st) => st.id === serviceTypeId
          );
          const serviceName = serviceType?.name || serviceTypeId;

          try {
            // Check if workshops are using this service type
            console.log(
              `🔍 Checking usage for service type: ${serviceName} (${serviceTypeId})`
            );

            const checkResponse = await fetch(
              `${API_BASE_URL}/workshops?serviceTypeId=${serviceTypeId}&limit=1`,
              {
                method: "GET",
                headers: {
                  "x-api-key": API_KEY,
                  Authorization: `Bearer ${authToken}`,
                } as HeadersInit,
              }
            );

            if (checkResponse.ok) {
              const data = await checkResponse.json();
              const workshopsCount = data.workshops?.length || 0;

              if (workshopsCount > 0) {
                console.log(
                  `❌ Service type ${serviceName} is in use by ${workshopsCount} workshop(s)`
                );
                cannotDelete.push({
                  id: serviceTypeId,
                  name: serviceName,
                  reason: "Service type is currently being used by workshops",
                });
              } else {
                console.log(`✅ Service type ${serviceName} is safe to delete`);
                canDelete.push(serviceTypeId);
              }
            } else {
              console.warn(
                `⚠️ Could not check usage for ${serviceName}, assuming safe to delete`
              );
              canDelete.push(serviceTypeId);
            }
          } catch (error) {
            console.warn(`⚠️ Error checking ${serviceName}:`, error);
            // If check fails, assume it can be deleted (fallback)
            canDelete.push(serviceTypeId);
          }
        }

        console.log("🔍 Check results:", {
          canDelete: canDelete.length,
          cannotDelete: cannotDelete.length,
        });
        return { canDelete, cannotDelete };
      } catch (error) {
        console.error("Error checking service types for deletion:", error);
        // Fallback: assume all can be deleted if check fails
        return {
          canDelete: serviceTypeIds,
          cannotDelete: [],
        };
      }
    },
    [currentUser, serviceTypes]
  );

  /**
   * Select all service types
   */
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedServiceTypes(
        checked ? serviceTypes.map((serviceType) => serviceType.id) : []
      );
    },
    [serviceTypes]
  );

  /**
   * Select or deselect a service type
   */
  const handleSelectServiceType = useCallback((serviceTypeId: string) => {
    setSelectedServiceTypes((prev) =>
      prev.includes(serviceTypeId)
        ? prev.filter((id) => id !== serviceTypeId)
        : [...prev, serviceTypeId]
    );
  }, []);

  return {
    serviceTypes,
    selectedServiceTypes,
    loading,
    error,
    pagination,
    editingServiceType,
    openServiceTypeDialog,
    fetchServiceTypes,
    fetchServiceTypeById,
    fetchServiceTypesByCategory,
    handleAddServiceType,
    handleEditServiceType,
    handleDeleteServiceTypes,
    checkServiceTypesCanBeDeleted,
    handleSelectAll,
    handleSelectServiceType,
    setEditingServiceType,
    setOpenServiceTypeDialog,
    setError,
  };
};
