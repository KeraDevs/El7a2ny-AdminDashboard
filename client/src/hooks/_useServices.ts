import { useState, useCallback } from "react";
import { ServiceType } from "@/types/serviceTypes";
import { useAuth } from "@/contexts/AuthContext";
import { API_KEY, API_BASE_URL } from "@/utils/config";
import toast from "react-hot-toast";

export interface UseServiceTypesReturn {
  serviceTypes: ServiceType[];
  selectedServiceTypes: string[];
  loading: boolean;
  error: string | null;
  editingServiceType: ServiceType | null;
  openServiceTypeDialog: boolean;
  fetchServiceTypes: () => Promise<void>;
  fetchServiceTypeById: (id: string) => Promise<ServiceType | null>;
  fetchServiceTypesByCategory: (category: string) => Promise<void>;
  handleAddServiceType: (
    serviceTypeData: Partial<ServiceType>
  ) => Promise<void>;
  handleEditServiceType: (
    serviceTypeData: Partial<ServiceType>
  ) => Promise<void>;
  handleDeleteServiceTypes: (serviceTypeIds: string[]) => Promise<void>;
  handleSelectAll: (checked: boolean) => void;
  handleSelectServiceType: (serviceTypeId: string) => void;
  setEditingServiceType: React.Dispatch<
    React.SetStateAction<ServiceType | null>
  >;
  setOpenServiceTypeDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  handleSetPercentage: (id: string, percentage: number) => Promise<void>;
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

  // Fetch all service types
  const fetchServiceTypes = useCallback(async () => {
    if (!currentUser) {
      setError("Authentication required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching service types...");
      const authToken = await currentUser.getIdToken();
      if (!API_KEY) {
        throw new Error("API key is missing");
      }

      // Using the correct endpoint from Swagger: GET /services/types
      const response = await fetch(`${API_BASE_URL}/services/types`, {
        headers: {
          "x-api-key": API_KEY,
          Authorization: `Bearer ${authToken}`,
        } as HeadersInit,
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch service types: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("Fetched service types:", result);

      // Handle the specific response format from the API
      if (result.serviceTypes && Array.isArray(result.serviceTypes)) {
        // Format detected in console: { serviceTypes: Array(10), total: 36, hasMore: true }
        console.log(
          `Found ${result.serviceTypes.length} service types out of total: ${result.total}`
        );
        setServiceTypes(result.serviceTypes);
      } else if (result.types && Array.isArray(result.types)) {
        // Alternative format with "types" property
        setServiceTypes(result.types);
      } else if (Array.isArray(result)) {
        // Direct array response
        setServiceTypes(result);
      } else {
        console.warn("Unexpected response format:", result);
        setServiceTypes([]);
      }
    } catch (error) {
      console.error("Error fetching service types:", error);
      toast.error("Error fetching service types!");
      setError(
        error instanceof Error ? error.message : "Failed to fetch service types"
      );
      setServiceTypes([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Fetch service type by ID
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

        // Using the correct endpoint from Swagger: GET /services/types/{id}
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
        return result.type || result; // Handle both response formats
      } catch (error) {
        console.error("Error fetching service type:", error);
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

  // Fetch service types by category
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

        // Using the correct endpoint from Swagger: GET /services/types/category/{category}
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
        setServiceTypes(result.types || []);
      } catch (error) {
        console.error("Error fetching service types by category:", error);
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

  // Add service type
  const handleAddServiceType = useCallback(
    async (serviceTypeData: Partial<ServiceType>): Promise<void> => {
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

        // Using the correct endpoint from Swagger: POST /services/types
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
          } catch (e) {
            errorMessage = `Failed to add service type: ${response.status} - ${responseText}`;
          }
          throw new Error(errorMessage);
        }

        // Refresh the service types list
        await fetchServiceTypes();
        toast.success("Service type added successfully");
      } catch (error) {
        console.error("Error adding service type:", error);
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

  // Edit service type
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

        // Using the correct endpoint from Swagger: PATCH /services/types/{id}
        const response = await fetch(
          `${API_BASE_URL}/services/types/${serviceTypeData.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY,
              Authorization: `Bearer ${authToken}`,
            } as HeadersInit,
            body: JSON.stringify(serviceTypeData),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to edit service type, status: ${response.status}`
          );
        }

        // Update the service types array with the updated service type
        setServiceTypes((prevServiceTypes) =>
          prevServiceTypes.map((serviceType) =>
            serviceType.id === serviceTypeData.id
              ? { ...serviceType, ...serviceTypeData }
              : serviceType
          )
        );

        toast.success("Service type updated successfully");
      } catch (error) {
        console.error("Error editing service type:", error);
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

  // Set percentage for service type
  const handleSetPercentage = useCallback(
    async (id: string, percentage: number): Promise<void> => {
      if (!currentUser) {
        throw new Error("Authentication required");
      }

      try {
        console.log("Setting percentage for service type:", id, percentage);
        setLoading(true);
        const authToken = await currentUser.getIdToken();

        if (!API_KEY) {
          throw new Error("API key is missing");
        }

        // Using the correct endpoint from Swagger: PATCH /service-types/{id}/percentage
        const response = await fetch(
          `${API_BASE_URL}/service-types/${id}/percentage`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY,
              Authorization: `Bearer ${authToken}`,
            } as HeadersInit,
            body: JSON.stringify({ percentage }),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to set percentage, status: ${response.status}`
          );
        }

        // Update the service types array with the updated percentage
        setServiceTypes((prevServiceTypes) =>
          prevServiceTypes.map((serviceType) =>
            serviceType.id === id
              ? { ...serviceType, percentageModifier: percentage }
              : serviceType
          )
        );

        toast.success("Percentage updated successfully");
      } catch (error) {
        console.error("Error setting percentage:", error);
        toast.error("Error setting percentage");
        setError(
          error instanceof Error ? error.message : "Failed to set percentage"
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  // Delete service types
  const handleDeleteServiceTypes = useCallback(
    async (serviceTypeIds: string[]): Promise<void> => {
      if (!currentUser) {
        throw new Error("Authentication required");
      }

      if (serviceTypeIds.length === 0) {
        throw new Error("No service types selected for deletion");
      }

      try {
        console.log("Deleting service types:", serviceTypeIds);
        setLoading(true);
        const authToken = await currentUser.getIdToken();

        if (!API_KEY) {
          throw new Error("API key is missing");
        }

        // Using the correct endpoint from Swagger: DELETE /services/types/{id}
        const deletePromises = serviceTypeIds.map(async (serviceTypeId) => {
          const response = await fetch(
            `${API_BASE_URL}/services/types/${serviceTypeId}`,
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
              `Failed to delete service type ${serviceTypeId}: ${response.status}`
            );
          }
        });

        await Promise.all(deletePromises);

        // Update the local state to remove deleted service types
        setServiceTypes((prevServiceTypes) =>
          prevServiceTypes.filter(
            (serviceType) => !serviceTypeIds.includes(serviceType.id)
          )
        );

        // Clear selection after successful deletion
        setSelectedServiceTypes((prev) =>
          prev.filter((id) => !serviceTypeIds.includes(id))
        );

        toast.success(
          `Successfully deleted ${serviceTypeIds.length} service type(s)`
        );
      } catch (error) {
        console.error("Error deleting service types:", error);
        toast.error(
          "Error deleting service types: " +
            (error instanceof Error ? error.message : "Unknown error")
        );
        setError(
          error instanceof Error
            ? error.message
            : "Failed to delete service types"
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  // Handle select all service types
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedServiceTypes(
        checked ? serviceTypes.map((serviceType) => serviceType.id) : []
      );
    },
    [serviceTypes]
  );

  // Handle select individual service type
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
    editingServiceType,
    openServiceTypeDialog,
    fetchServiceTypes,
    fetchServiceTypeById,
    fetchServiceTypesByCategory,
    handleAddServiceType,
    handleEditServiceType,
    handleDeleteServiceTypes,
    handleSelectAll,
    handleSelectServiceType,
    setEditingServiceType,
    setOpenServiceTypeDialog,
    setError,
    handleSetPercentage,
  };
};
