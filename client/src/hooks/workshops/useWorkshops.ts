import { useState, useEffect } from "react";
import { VITE_API_RAIL_WAY, API_KEY } from "../../config/config";
import { UseWorkshopsReturn } from "../../types/hookTypes";
import { ApiResponse, ApiWorkshopsList } from "../../types/apiTypes";
import { Workshop } from "../../types/workshopTypes";
import {
  mapApiWorkshopToFrontend,
  mapFrontendToApiWorkshop,
} from "../../utils/workshops/workshopsApi";
import { useAuth } from "src/contexts/AuthContext";

export const useWorkshops = (): UseWorkshopsReturn => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [selectedWorkshops, setSelectedWorkshops] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [openWorkshopDialog, setOpenWorkshopDialog] = useState<boolean>(false);

  //Auth
  const getAuth = useAuth();
  const token = getAuth.currentUser?.getIdToken();

  const fetchWorkshops = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${VITE_API_RAIL_WAY}/workshops`, {
        headers: {
          "x-api-key": API_KEY,
          Authorization: `Bearer ${await token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Unauthorized, HTTP error! status: ${response.status} kindly login to access this data`
        );
      }

      const result: ApiResponse = await response.json();
      const mappedWorkshops = (result.workshops || []).map(
        mapApiWorkshopToFrontend
      );
      setWorkshops(mappedWorkshops);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch workshops"
      );
      setWorkshops([]);
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

  const handleAddWorkShop = async (workshopData: Partial<Workshop>) => {
    try {
      setLoading(true);
      setError(null);
      console.log("Before transformation:", workshopData);

      const apiData = mapFrontendToApiWorkshop(workshopData);
      console.log("After transformation:", apiData);

      const currentToken = await token;
      console.log("Request payload:", JSON.stringify(apiData));

      const response = await fetch(`${VITE_API_RAIL_WAY}/workshops`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify(apiData),
      });

      const responseData = await response.json();
      console.log("API Response:", responseData);
      if (!response.ok) {
        throw new Error(
          responseData.message || `Failed to add workshop (${response.status})`
        );
      }

      await fetchWorkshops();
      setOpenWorkshopDialog(false);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to add workshop"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditWorkshop = async (workshopData: Partial<Workshop>) => {
    if (!editingWorkshop?.id) {
      setError("No workshop selected for editing");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const apiData = mapFrontendToApiWorkshop({
        ...editingWorkshop,
        ...workshopData,
      });
      const currentToken = await token;

      const response = await fetch(
        `${VITE_API_RAIL_WAY}/workshops/${editingWorkshop.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
            Authorization: `Bearer ${currentToken}`,
          },
          body: JSON.stringify(apiData),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message ||
            `Failed to update workshop (${response.status})`
        );
      }

      await fetchWorkshops();
      setEditingWorkshop(null);
      setOpenWorkshopDialog(false);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update workshop"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkshops = async () => {
    if (selectedWorkshops.length === 0) {
      setError("No workshops selected for deactivation");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const currentToken = await token;

      for (const workshopId of selectedWorkshops) {
        const response = await fetch(
          `${VITE_API_RAIL_WAY}/workshops/${workshopId}/deactivate`,
          {
            method: "POST",
            headers: {
              "x-api-key": API_KEY,
              Authorization: `Bearer ${currentToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to deactivate workshop ${workshopId} (${response.status})`
          );
        }
      }

      await fetchWorkshops();
      setSelectedWorkshops([]);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to deactivate workshops"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  return {
    workshops,
    selectedWorkshops,
    loading,
    error,
    editingWorkshop,
    openWorkshopDialog,
    fetchWorkshops,
    handleSelectAll,
    handleSelectWorkshop,
    handleAddWorkShop,
    handleEditWorkshop,
    handleDeleteWorkshops,
    setEditingWorkshop,
    setOpenWorkshopDialog,
    setError,
  };
};
