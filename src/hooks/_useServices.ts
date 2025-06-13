import { useState, useCallback } from "react";
import {
  ServiceType,
  CreateServiceTypeData,
  UpdateServiceTypeData,
  SetPercentageData,
} from "@/types/serviceTypes";
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
    serviceTypeData: CreateServiceTypeData
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

  /**
   * Fetch all service types from the API
   */
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

      // Get all service types
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
        // Format: { serviceTypes: Array(10), total: 36, hasMore: true }
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
   * Set percentage for a service type
   */
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

        const percentageData: SetPercentageData = {
          percentage: percentage,
        };

        // Update service type percentage
        const response = await fetch(
          `${API_BASE_URL}/service-types/${id}/percentage`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY,
              Authorization: `Bearer ${authToken}`,
            } as HeadersInit,
            body: JSON.stringify(percentageData),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to set percentage, status: ${response.status}`
          );
        }

        // Update the service types array with the updated percentage
        setServiceTypes((prevServiceTypes) =>
          prevServiceTypes.map((serviceType) => {
            if (serviceType.id === id) {
              const updatedServiceType = { ...serviceType };

              // Create or update service_types_percentage
              if (updatedServiceType.service_types_percentage) {
                updatedServiceType.service_types_percentage = {
                  ...updatedServiceType.service_types_percentage,
                  percentage: percentage.toString(),
                };
              } else {
                updatedServiceType.service_types_percentage = {
                  id: "", // Will be replaced by real ID
                  service_type_id: id,
                  percentage: percentage.toString(),
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                };
              }

              return updatedServiceType;
            }
            return serviceType;
          })
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

  /**
   * Delete service types
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
        console.log("Deleting service types:", serviceTypeIds);
        setLoading(true);
        const authToken = await currentUser.getIdToken();

        if (!API_KEY) {
          throw new Error("API key is missing");
        }

        // Delete each service type
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
