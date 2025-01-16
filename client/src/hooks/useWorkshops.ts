import { useState, useEffect } from "react";
import { API_BASE_URL, API_KEY, token } from "../config/config";
import { ApiResponse, Workshop, UseWorkshopsReturn } from "../types/types";

import {
  mapApiWorkshopToFrontend,
  mapFrontendToApiWorkshop,
} from "../utils/workshopsApi";

export const useWorkshops = (): UseWorkshopsReturn => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [selectedWorkshops, setSelectedWorkshops] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [openWorkshopDialog, setOpenWorkshopDialog] = useState<boolean>(false);

  const fetchWorkshops = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/workshops?limit=10&offset=0&is_active=true`,
        {
          headers: {
            "x-api-key": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

      const apiData = mapFrontendToApiWorkshop(workshopData);

      const response = await fetch(`${API_BASE_URL}/workshops`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(apiData),
      });

      const responseData = await response.json();

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

      const response = await fetch(
        `${API_BASE_URL}/workshops/${editingWorkshop.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
            Authorization: `Bearer ${token}`,
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
      setError("No workshops selected for deletion");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      for (const workshopId of selectedWorkshops) {
        const response = await fetch(
          `${API_BASE_URL}/workshops/${workshopId}`,
          {
            method: "DELETE",
            headers: {
              "x-api-key": API_KEY,
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to delete workshop ${workshopId} (${response.status})`
          );
        }
      }

      await fetchWorkshops();
      setSelectedWorkshops([]);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete workshops"
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
