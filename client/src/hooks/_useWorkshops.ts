import { useState, useCallback } from "react";
import { Workshop } from "@/types/workshopTypes";
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
  const { currentUser } = useAuth();
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

      const apiData = mapFrontendToApiWorkshop(workshopData);

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
        throw new Error(`Failed to add workshop, status: ${response.status}`);
      }

      const result = await response.json();
      const newWorkshop = mapApiWorkshopToFrontend(result.workshop);

      setWorkshops((prevWorkshops) => [...prevWorkshops, newWorkshop]);
      toast.success("Workshop added successfully");
    } catch (error) {
      toast.error("Error adding workshop");
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

      const apiData = mapFrontendToApiWorkshop(workshopData);

      const response = await fetch(
        `${API_BASE_URL}/workshops/${workshopData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
            Authorization: `Bearer ${authToken}`,
          } as HeadersInit,
          body: JSON.stringify(apiData),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to edit workshop, status: ${response.status}`);
      }

      setWorkshops((prevWorkshops) =>
        prevWorkshops.map((workshop) =>
          workshop.id === workshopData.id
            ? {
                ...workshop,
                ...workshopData,
              }
            : workshop
        )
      );
    } catch (error) {
      toast.error("Error editing workshop");
      setError(
        error instanceof Error ? error.message : "Failed to edit workshop"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete Workshops
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

      const deletePromises = selectedWorkshops.map(async (workshopId) => {
        const response = await fetch(
          `${API_BASE_URL}/workshops/${workshopId}`,
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
            `Failed to delete workshop ${workshopId}: ${response.status}`
          );
        }
      });

      await Promise.all(deletePromises);

      // Update the local state to remove deleted workshops
      setWorkshops((prevWorkshops) =>
        prevWorkshops.filter(
          (workshop) => !selectedWorkshops.includes(workshop.id)
        )
      );

      // Clear selection after successful deletion
      setSelectedWorkshops([]);

      toast.success(
        `Successfully deleted ${selectedWorkshops.length} workshop(s)`
      );
    } catch (error) {
      toast.error(
        "Error deleting workshops: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
      setError(
        error instanceof Error ? error.message : "Failed to delete workshops"
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
