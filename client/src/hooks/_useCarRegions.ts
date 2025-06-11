import { useState, useCallback } from "react";
import { CarRegion, CarRegionsResponse } from "@/types/carTypes";
import { useAuth } from "@/contexts/AuthContext";
import { API_KEY, API_BASE_URL } from "@/utils/config";
import toast from "react-hot-toast";

export interface UseCarRegionsReturn {
  regions: CarRegion[];
  selectedRegions: string[];
  loading: boolean;
  error: string | null;
  fetchRegions: () => Promise<void>;
  handleEditRegion: (regionData: Partial<CarRegion>) => Promise<void>;
  handleDeleteRegions: () => Promise<void>;
  handleSelectAll: (checked: boolean) => void;
  handleSelectRegion: (regionId: string) => void;
  handleAddRegion: (regionData: Partial<CarRegion>) => Promise<void>;
  setError: (error: string | null) => void;
  setSelectedRegions: React.Dispatch<React.SetStateAction<string[]>>;
}

export const useCarRegions = (): UseCarRegionsReturn => {
  const { currentUser } = useAuth();
  const [regions, setRegions] = useState<CarRegion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  // Fetch all car regions
  const fetchRegions = useCallback(async () => {
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

      const response = await fetch(`${API_BASE_URL}/car/regions`, {
        headers: {
          "x-api-key": API_KEY,
          Authorization: `Bearer ${authToken}`,
        } as HeadersInit,
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch regions: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      // Assuming the API returns an array of regions directly
      setRegions(Array.isArray(result) ? result : []);
    } catch (error) {
      toast.error("Error fetching car regions!");
      setError(
        error instanceof Error ? error.message : "Failed to fetch regions"
      );
      setRegions([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Add a new car region
  const handleAddRegion = async (
    regionData: Partial<CarRegion>
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

      const response = await fetch(`${API_BASE_URL}/car/regions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${authToken}`,
        } as HeadersInit,
        body: JSON.stringify({
          name: regionData.name,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add region, status: ${response.status}`);
      }

      const newRegion = await response.json();
      setRegions((prev) => [...prev, newRegion]);
      toast.success("Car region added successfully");
    } catch (error) {
      toast.error("Error adding car region");
      setError(error instanceof Error ? error.message : "Failed to add region");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Edit a car region
  const handleEditRegion = async (
    regionData: Partial<CarRegion>
  ): Promise<void> => {
    if (!regionData.id) {
      throw new Error("Region ID is required for editing");
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
        `${API_BASE_URL}/car/regions/${regionData.id}`,
        {
          method: "PATCH", // Changed from PUT to PATCH
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
            Authorization: `Bearer ${authToken}`,
          } as HeadersInit,
          body: JSON.stringify({
            id: regionData.id,
            name: regionData.name,
            created_at: regionData.created_at,
            updated_at: new Date().toISOString(), // Update timestamp
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to edit region, status: ${response.status}`);
      }

      setRegions((prev) =>
        prev.map((region) =>
          region.id === regionData.id ? { ...region, ...regionData } : region
        )
      );
      toast.success("Car region updated successfully");
    } catch (error) {
      toast.error("Error editing car region");
      setError(
        error instanceof Error ? error.message : "Failed to edit region"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete car regions
  const handleDeleteRegions = async (): Promise<void> => {
    if (!currentUser) {
      throw new Error("Authentication required");
    }

    if (selectedRegions.length === 0) {
      throw new Error("No regions selected for deletion");
    }

    try {
      setLoading(true);
      const authToken = await currentUser.getIdToken();

      if (!API_KEY) {
        throw new Error("API key is missing");
      }

      const deletePromises = selectedRegions.map(async (regionId) => {
        const response = await fetch(
          `${API_BASE_URL}/car/regions/${regionId}`,
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
            `Failed to delete region ${regionId}: ${response.status}`
          );
        }
      });

      await Promise.all(deletePromises);

      // Update the local state to remove deleted regions
      setRegions((prev) =>
        prev.filter((region) => !selectedRegions.includes(region.id))
      );

      // Clear selection after successful deletion
      setSelectedRegions([]);

      toast.success(`Successfully deleted ${selectedRegions.length} region(s)`);
    } catch (error) {
      toast.error(
        "Error deleting regions: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
      setError(
        error instanceof Error ? error.message : "Failed to delete regions"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedRegions(checked ? regions.map((region) => region.id) : []);
  };

  const handleSelectRegion = (regionId: string) => {
    setSelectedRegions((prev) =>
      prev.includes(regionId)
        ? prev.filter((id) => id !== regionId)
        : [...prev, regionId]
    );
  };

  return {
    regions,
    selectedRegions,
    loading,
    error,
    fetchRegions,
    handleEditRegion,
    handleDeleteRegions,
    handleSelectAll,
    handleSelectRegion,
    handleAddRegion,
    setError,
    setSelectedRegions,
  };
};
