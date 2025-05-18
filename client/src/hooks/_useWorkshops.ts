import { useState, useCallback, useEffect } from "react";
import { Workshop, PhoneNumber } from "@/types/workshopTypes";
import { useAuth } from "@/contexts/AuthContext";
import {
  mapApiWorkshopToFrontend,
  mapFrontendToApiWorkshop,
} from "@/utils/workshopsApi";
import { API_KEY, API_BASE_URL } from "@/utils/config";
import { ApiResponse } from "@/types/apiTypes";
import { UseWorkshopsReturn } from "@/types/hookTypes";
import toast from "react-hot-toast";

export const useWorkshops = (): UseWorkshopsReturn => {
  const { currentUser, userData } = useAuth();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedWorkshops, setSelectedWorkshops] = useState<string[]>([]);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [openWorkshopDialog, setOpenWorkshopDialog] = useState(false);

  // Fetching All Workshops
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

      // Initial fetch to get the first batch
      const response = await fetch(`${API_BASE_URL}/workshops?take=50`, {
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

      const initialResult: ApiResponse = await response.json();
      let allWorkshops = (initialResult.workshops || []).map(
        mapApiWorkshopToFrontend
      );

      // Keep fetching until hasMore is false
      let hasMore = initialResult.hasMore;
      let offset = 50; // First skip will be 50

      while (hasMore) {
        const nextPageResponse = await fetch(
          `${API_BASE_URL}/workshops?skip=${offset}&take=50`,
          {
            headers: {
              "x-api-key": API_KEY,
              Authorization: `Bearer ${authToken}`,
            } as HeadersInit,
          }
        );

        if (!nextPageResponse.ok) {
          throw new Error(
            `Failed to fetch workshops page: ${nextPageResponse.status}`
          );
        }

        const nextPageResult: ApiResponse = await nextPageResponse.json();
        const nextPageWorkshops = (nextPageResult.workshops || []).map(
          mapApiWorkshopToFrontend
        );

        allWorkshops = [...allWorkshops, ...nextPageWorkshops];
        hasMore = nextPageResult.hasMore;
        offset += 50;

        if (nextPageWorkshops.length === 0) {
          break;
        }
      }

      setWorkshops(allWorkshops);
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

  // Format workshop data for API submission
  const formatWorkshopForApi = (workshopData: Partial<Workshop>) => {
    // Set owner_id to current user if not specified
    const ownerId = workshopData.ownerId || userData?.id;

    if (!ownerId) {
      throw new Error("Owner ID is required for workshop creation");
    }

    // Format phone numbers
    const phoneNumbers =
      workshopData.phoneNumbers && workshopData.phoneNumbers.length > 0
        ? {
            createMany: {
              data: workshopData.phoneNumbers.map((phone: PhoneNumber) => ({
                phone_number: phone.phone_number,
                type: phone.type,
                is_primary: phone.is_primary,
              })),
            },
          }
        : undefined;

    // Format labels (if any)
    const labels =
      workshopData.labels && workshopData.labels.length > 0
        ? {
            create: workshopData.labels.map((label: string) => ({
              label: {
                create: {
                  name: label,
                },
              },
            })),
          }
        : undefined;

    // Format operating hours (default is empty)
    const operatingHours = {
      createMany: {
        data: [],
      },
    };

    const latitude =
      workshopData.latitude !== undefined && workshopData.latitude !== null
        ? Number(workshopData.latitude)
        : null;

    const longitude =
      workshopData.longitude !== undefined && workshopData.longitude !== null
        ? Number(workshopData.longitude)
        : null;
    // Build the final API request payload
    return {
      name: workshopData.name || "",
      owner_id: ownerId,
      email: workshopData.email || "",
      address: workshopData.address || "",
      latitude: latitude,
      longitude: longitude,
      status: (workshopData.status || "open").toUpperCase(),
      active_status: (workshopData.active_status || "pending").toUpperCase(),
      phone_numbers: phoneNumbers,
      operating_hours: operatingHours,
      labels: labels,
      services: workshopData.services || [],
    };
  };

  // Add Workshop
  const handleAddWorkShop = async (
    workshopData: Partial<Workshop>
  ): Promise<void> => {
    if (!currentUser) {
      throw new Error("Authentication required");
    }

    try {
      setLoading(true);
      const authToken = await currentUser.getIdToken();

      if (!API_KEY) {
        throw new Error("API key is missing");
      }

      // Format data for API
      const apiData = formatWorkshopForApi(workshopData);

      console.log("Sending workshop data:", JSON.stringify(apiData, null, 2));

      const response = await fetch(`${API_BASE_URL}/workshops`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${authToken}`,
        } as HeadersInit,
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        let errorMessage;
        try {
          const errorResponse = await response.json();
          errorMessage =
            errorResponse.message ||
            `Failed to add workshop (${response.status})`;
        } catch (jsonError) {
          errorMessage = `Failed to add workshop: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      await fetchWorkshops();
      toast.success("Workshop added successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add workshop"
      );
      setError(
        error instanceof Error ? error.message : "Failed to add workshop"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Edit Workshop
  const handleEditWorkshop = async (
    workshopData: Partial<Workshop>
  ): Promise<void> => {
    if (!workshopData.id) {
      throw new Error("Workshop ID is required for editing");
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

      // Format API data
      // For PATCH requests, we only include fields that have changed
      const apiData = {
        name: workshopData.name,
        email: workshopData.email,
        address: workshopData.address,
        latitude: workshopData.latitude,
        longitude: workshopData.longitude,
        status: workshopData.status?.toUpperCase(),
        active_status: workshopData.active_status?.toUpperCase(),
        // Only include phone_numbers if they've been modified
        ...(workshopData.phoneNumbers
          ? {
              phone_numbers: {
                deleteMany: {},
                createMany: {
                  data: workshopData.phoneNumbers.map((phone) => ({
                    phone_number: phone.phone_number,
                    type: phone.type,
                    is_primary: phone.is_primary,
                  })),
                },
              },
            }
          : {}),
        // Only include labels if they've been modified
        ...(workshopData.labels
          ? {
              labels: {
                deleteMany: {},
                create: workshopData.labels.map((label) => ({
                  label: {
                    create: {
                      name: label,
                    },
                  },
                })),
              },
            }
          : {}),
        // Only include services if they've been modified
        ...(workshopData.services ? { services: workshopData.services } : {}),
      };

      // Remove undefined fields
      Object.keys(apiData).forEach(
        (key) =>
          (apiData as any)[key] === undefined && delete (apiData as any)[key]
      );

      const response = await fetch(
        `${API_BASE_URL}/workshops/${workshopData.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
            Authorization: `Bearer ${authToken}`,
          } as HeadersInit,
          body: JSON.stringify(apiData),
        }
      );

      if (!response.ok) {
        let errorMessage;
        try {
          const errorResponse = await response.json();
          errorMessage =
            errorResponse.message ||
            `Failed to update workshop (${response.status})`;
        } catch (jsonError) {
          errorMessage = `Failed to update workshop: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Refresh workshops list
      await fetchWorkshops();
      toast.success("Workshop updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to edit workshop"
      );
      setError(
        error instanceof Error ? error.message : "Failed to edit workshop"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete Workshops (actually deactivate)
  const handleDeleteWorkshops = async (): Promise<void> => {
    if (!currentUser) {
      throw new Error("Authentication required");
    }

    if (selectedWorkshops.length === 0) {
      throw new Error("No workshops selected for deletion");
    }

    try {
      setLoading(true);
      const authToken = await currentUser.getIdToken();

      if (!API_KEY) {
        throw new Error("API key is missing");
      }

      // Use deactivate endpoint instead of delete
      const deletePromises = selectedWorkshops.map(async (workshopId) => {
        const response = await fetch(
          `${API_BASE_URL}/workshops/${workshopId}/deactivate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY,
              Authorization: `Bearer ${authToken}`,
            } as HeadersInit,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to deactivate workshop ${workshopId}: ${response.status}`
          );
        }
      });

      await Promise.all(deletePromises);

      // Refresh workshops list
      await fetchWorkshops();
      setSelectedWorkshops([]);

      toast.success(
        `Successfully deactivated ${selectedWorkshops.length} workshop(s)`
      );
    } catch (error) {
      toast.error(
        "Error deactivating workshops: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
      setError(
        error instanceof Error
          ? error.message
          : "Failed to deactivate workshops"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedWorkshops(
      checked ? workshops.map((workshop) => workshop.id) : []
    );
  };

  const handleSelectWorkshop = (workshopId: string) => {
    setSelectedWorkshops((prev) =>
      prev.includes(workshopId)
        ? prev.filter((id) => id !== workshopId)
        : [...prev, workshopId]
    );
  };

  return {
    workshops,
    selectedWorkshops,
    loading,
    error,
    editingWorkshop,
    openWorkshopDialog,
    fetchWorkshops,
    handleAddWorkShop,
    handleEditWorkshop,
    handleDeleteWorkshops,
    handleSelectAll,
    handleSelectWorkshop,
    setEditingWorkshop,
    setOpenWorkshopDialog,
    setError,
  };
};
