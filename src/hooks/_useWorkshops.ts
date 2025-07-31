import { useState, useCallback } from "react";
import { Workshop, PhoneNumber } from "@/types/workshopTypes";
import { useAuth } from "@/contexts/AuthContext";
import { mapApiWorkshopToFrontend } from "@/utils/workshopsApi";
import { API_KEY, API_BASE_URL } from "@/utils/config";
import { ApiResponse } from "@/types/apiTypes";
import { UseWorkshopsReturn } from "@/types/hookTypes";
import toast from "react-hot-toast";

// Define the API data structure for type safety
interface ApiWorkshopData {
  name?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  status?: string;
  phone_numbers?: {
    deleteMany?: Record<string, unknown>;
    createMany?: {
      data: Array<{
        phone_number: string;
        type: string;
        is_primary: boolean;
        id?: string; // Include id field as required by API
      }>;
    };
  };
  operating_hours?: {
    deleteMany?: Record<string, unknown>;
    createMany?: {
      data: Array<{
        day: string;
        open_time: string;
        close_time: string;
        is_closed: boolean;
      }>;
    };
  };
  [key: string]: unknown;
}

export const useWorkshops = (): UseWorkshopsReturn => {
  const { currentUser, userData } = useAuth();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedWorkshops, setSelectedWorkshops] = useState<string[]>([]);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [openWorkshopDialog, setOpenWorkshopDialog] = useState(false);

  // Fetching All Workshops with proper pagination
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

      let allWorkshops: Workshop[] = [];
      let hasMore = true;
      let offset = 0;
      const pageSize = 50;

      // Fetch all workshops in batches
      while (hasMore) {
        const response = await fetch(
          `${API_BASE_URL}/workshops?skip=${offset}&take=${pageSize}`,
          {
            headers: {
              "x-api-key": API_KEY,
              Authorization: `Bearer ${authToken}`,
            } as HeadersInit,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch workshops: ${response.status} ${response.statusText}`
          );
        }

        const result: ApiResponse = await response.json();
        const batchWorkshops = (result.workshops || []).map(
          mapApiWorkshopToFrontend
        );

        console.log(`Fetched ${batchWorkshops.length} workshops in this batch`);

        allWorkshops = [...allWorkshops, ...batchWorkshops];
        hasMore = result.hasMore;
        offset += pageSize;

        // Safety check to prevent infinite loops
        if (batchWorkshops.length === 0) {
          console.log("No more workshops returned, stopping pagination");
          break;
        }

        // If we got less than the page size, we've reached the end
        if (batchWorkshops.length < pageSize) {
          console.log("Received less than page size, assuming end reached");
          hasMore = false;
        }
      }

      console.log(`Total workshops fetched: ${allWorkshops.length}`);
      setWorkshops(allWorkshops);
    } catch (fetchError) {
      toast.error("Error fetching workshops!");
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to fetch workshops"
      );
      setWorkshops([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Generate a unique ID for phone numbers
  const generatePhoneId = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  // Format workshop data for API submission
  const formatWorkshopForApi = (workshopData: Partial<Workshop>) => {
    // Set owner_id to current user if not specified
    const ownerId = workshopData.ownerId || userData?.id;

    if (!ownerId) {
      throw new Error("Owner ID is required for workshop creation");
    }

    // Format phone numbers with required ID field - exactly matching Swagger structure
    const phoneNumbers =
      workshopData.phoneNumbers && workshopData.phoneNumbers.length > 0
        ? {
            createMany: {
              data: workshopData.phoneNumbers.map((phone: PhoneNumber) => ({
                phone_number: phone.phone_number,
                type: phone.type.toUpperCase(), // Ensure uppercase for enum
                is_primary: phone.is_primary,
                id: generatePhoneId(), // Generate unique ID as required by API
              })),
            },
          }
        : {
            createMany: {
              data: [], // Ensure structure exists even if empty
            },
          };

    // Format operating hours with required structure - exactly matching Swagger
    const operatingHours = {
      createMany: {
        data: [
          {
            day: "MONDAY",
            open_time: "1970-01-01T09:00:00",
            close_time: "1970-01-01T17:00:00",
            is_closed: false,
          },
          {
            day: "TUESDAY",
            open_time: "1970-01-01T09:00:00",
            close_time: "1970-01-01T17:00:00",
            is_closed: false,
          },
        ],
      },
    };

    const latitude =
      workshopData.latitude !== undefined && workshopData.latitude !== null
        ? Number(Number(workshopData.latitude).toFixed(8))
        : 35.3457823; // Default latitude from your example

    const longitude =
      workshopData.longitude !== undefined && workshopData.longitude !== null
        ? Number(Number(workshopData.longitude).toFixed(8))
        : -120.42458676; // Default longitude from your example

    // Build the final API request payload - exactly matching Swagger structure
    return {
      name: workshopData.name || "",
      address: workshopData.address || "",
      status: (workshopData.status || "Open").toUpperCase(), // Match Swagger case
      phone_numbers: phoneNumbers,
      operating_hours: operatingHours,
      latitude: latitude,
      longitude: longitude,
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
        } catch {
          // If JSON parsing fails, use status text
          errorMessage = `Failed to add workshop: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      await fetchWorkshops();
      toast.success("Workshop added successfully");
    } catch (addError) {
      toast.error(
        addError instanceof Error ? addError.message : "Failed to add workshop"
      );
      setError(
        addError instanceof Error ? addError.message : "Failed to add workshop"
      );
      throw addError;
    } finally {
      setLoading(false);
    }
  };

  // Edit Workshop (excluding status changes)
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

      // Format API data for PATCH request
      const apiData: ApiWorkshopData = {};

      // Only include fields that should be updated
      if (workshopData.name !== undefined) {
        apiData.name = workshopData.name;
      }

      if (workshopData.address !== undefined) {
        apiData.address = workshopData.address;
      }

      if (workshopData.status !== undefined) {
        apiData.status = workshopData.status.toUpperCase();
      }

      if (workshopData.latitude !== undefined) {
        apiData.latitude = workshopData.latitude
          ? Number(Number(workshopData.latitude).toFixed(8))
          : null;
      }

      if (workshopData.longitude !== undefined) {
        apiData.longitude = workshopData.longitude
          ? Number(Number(workshopData.longitude).toFixed(8))
          : null;
      }

      // Handle phone numbers if they've been modified
      if (workshopData.phoneNumbers) {
        apiData.phone_numbers = {
          deleteMany: {},
          createMany: {
            data: workshopData.phoneNumbers.map((phone) => ({
              phone_number: phone.phone_number,
              type: phone.type.toUpperCase(),
              is_primary: phone.is_primary,
              id: generatePhoneId(),
            })),
          },
        };
      }

      // Remove undefined fields
      Object.keys(apiData).forEach((key) => {
        if (apiData[key] === undefined) {
          delete apiData[key];
        }
      });

      // Only make PATCH request if there are fields to update
      if (Object.keys(apiData).length > 0) {
        console.log("Sending edit data:", JSON.stringify(apiData, null, 2));

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
            console.error("Edit error details:", errorResponse);
          } catch {
            errorMessage = `Failed to update workshop: ${response.status} ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }
      }

      // Refresh workshops list
      await fetchWorkshops();
      toast.success("Workshop updated successfully");
    } catch (editError) {
      console.error("Edit workshop error:", editError);
      toast.error(
        editError instanceof Error
          ? editError.message
          : "Failed to edit workshop"
      );
      setError(
        editError instanceof Error
          ? editError.message
          : "Failed to edit workshop"
      );
      throw editError;
    } finally {
      setLoading(false);
    }
  };

  // Update Workshop Status using dedicated endpoints
  const handleUpdateWorkshopStatus = async (
    workshopId: string,
    newStatus: "active" | "deactivated" | "pending"
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

      let endpoint = "";
      const method = "POST";

      switch (newStatus.toLowerCase()) {
        case "active":
          endpoint = `${API_BASE_URL}/workshops/${workshopId}/activate`;
          break;
        case "deactivated":
          endpoint = `${API_BASE_URL}/workshops/${workshopId}/deactivate`;
          break;
        case "pending":
          endpoint = `${API_BASE_URL}/workshops/${workshopId}/pend`;
          break;
        default:
          throw new Error(`Invalid status: ${newStatus}`);
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${authToken}`,
        } as HeadersInit,
      });

      if (!response.ok) {
        let errorMessage;
        try {
          const errorResponse = await response.json();
          errorMessage =
            errorResponse.message ||
            `Failed to update workshop status (${response.status})`;
        } catch {
          errorMessage = `Failed to update workshop status: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Refresh workshops list
      await fetchWorkshops();
      toast.success(`Workshop status updated to ${newStatus}`);
    } catch (statusError) {
      console.error("Update workshop status error:", statusError);
      toast.error(
        statusError instanceof Error
          ? statusError.message
          : "Failed to update workshop status"
      );
      setError(
        statusError instanceof Error
          ? statusError.message
          : "Failed to update workshop status"
      );
      throw statusError;
    } finally {
      setLoading(false);
    }
  };

  // Update Workshop Operating Status (Open/Busy/Closed)
  const handleUpdateWorkshopOperatingStatus = async (
    workshopId: string,
    newStatus: "open" | "busy" | "closed"
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

      const response = await fetch(
        `${API_BASE_URL}/workshops/${workshopId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
            Authorization: `Bearer ${authToken}`,
          } as HeadersInit,
          body: JSON.stringify({ status: newStatus.toUpperCase() }),
        }
      );

      if (!response.ok) {
        let errorMessage;
        try {
          const errorResponse = await response.json();
          errorMessage =
            errorResponse.message ||
            `Failed to update operating status (${response.status})`;
        } catch {
          errorMessage = `Failed to update operating status: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Refresh workshops list
      await fetchWorkshops();
      toast.success(`Workshop operating status updated to ${newStatus}`);
    } catch (statusError) {
      console.error("Update operating status error:", statusError);
      toast.error(
        statusError instanceof Error
          ? statusError.message
          : "Failed to update operating status"
      );
      setError(
        statusError instanceof Error
          ? statusError.message
          : "Failed to update operating status"
      );
      throw statusError;
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
    } catch (deleteError) {
      toast.error(
        "Error deactivating workshops: " +
          (deleteError instanceof Error ? deleteError.message : "Unknown error")
      );
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to deactivate workshops"
      );
      throw deleteError;
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
    handleUpdateWorkshopStatus,
    handleUpdateWorkshopOperatingStatus,
    handleDeleteWorkshops,
    handleSelectAll,
    handleSelectWorkshop,
    setEditingWorkshop,
    setOpenWorkshopDialog,
    setError,
  };
};
