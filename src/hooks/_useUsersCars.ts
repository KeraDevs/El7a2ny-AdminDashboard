"use client";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE_URL, API_KEY } from "@/utils/config";
import { useCallback, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { CarWithDetails } from "@/types/carTypes";

export const useUsersCars = () => {
  const { currentUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [usersCars, setUsersCars] = useState<CarWithDetails[]>([]);
  const [hasInitialLoad, setHasInitialLoad] = useState<boolean>(false);

  // Fetching users cars
  const fetchUserCars = useCallback(
    async (forceRefresh = false) => {
      if (!currentUser) {
        setError("User not authenticated");
        return [];
      }

      // Prevent infinite loop - only fetch if not already loaded or force refresh
      if (hasInitialLoad && !forceRefresh) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const authToken = await currentUser.getIdToken();
        if (!API_KEY) {
          throw new Error("API_KEY is missing");
        }

        // Fixed URL construction - removed the leading slash before API_BASE_URL
        const response = await fetch(`${API_BASE_URL}/vehicles/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
            Authorization: `Bearer ${authToken}`,
          } as HeadersInit,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch Vehicles: ${response.status} ${response.statusText}`
          );
        }

        const result = await response.json();
        console.log("Fetched cars data:", result); // Debug log

        // Update state with fetched data
        const vehicles = result.vehicles || result || [];
        setUsersCars(vehicles);
        setHasInitialLoad(true);

        // Show success message only if we have cars
        if (vehicles.length > 0) {
          toast.success(`Loaded ${vehicles.length} user cars`);
        }

        return vehicles;
      } catch (error) {
        console.error("Error fetching user cars:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        toast.error(`Error fetching user cars: ${errorMessage}`);
        setError(errorMessage);
        setUsersCars([]);
        setHasInitialLoad(true); // Set to true even on error to prevent infinite loop
        return [];
      } finally {
        setLoading(false);
      }
    },
    [currentUser, hasInitialLoad]
  );

  // Add new Car for users
  const addUserCar = useCallback(
    async (carData: Partial<CarWithDetails>) => {
      if (!currentUser) {
        setError("User not authenticated");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const authToken = await currentUser.getIdToken();
        if (!API_KEY) {
          throw new Error("API_KEY is missing");
        }

        // Fixed URL construction - removed the leading slash before API_BASE_URL
        const response = await fetch(`${API_BASE_URL}/vehicles`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
            Authorization: `Bearer ${authToken}`,
          } as HeadersInit,
          body: JSON.stringify(carData),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to add Vehicle: ${response.status} ${response.statusText}`
          );
        }

        const result = await response.json();
        console.log("Added car:", result); // Debug log

        // Update state with new car
        setUsersCars((prev) => [...prev, result]);
        toast.success("Car added successfully!");

        // Force refresh to get updated data
        await fetchUserCars(true);

        return result;
      } catch (error) {
        console.error("Error adding user car:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        toast.error(`Error adding user car: ${errorMessage}`);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [currentUser, fetchUserCars]
  );

  // Update Car for users
  const updateUserCar = useCallback(
    async (carId: string, carData: Partial<CarWithDetails>) => {
      if (!currentUser) {
        setError("User not authenticated");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const authToken = await currentUser.getIdToken();
        if (!API_KEY) {
          throw new Error("API_KEY is missing");
        }

        // Prepare the update payload according to the API schema (exclude region_id and created_at)
        const updatePayload = {
          brand_id: carData.brand_id,
          model: carData.model,
          year: carData.year,
          license_plate: carData.license_plate,
          vin_number: carData.vin_number,
          turbo: carData.turbo,
          exotic: carData.exotic,
          owner_id: carData.owner_id,
          updated_at: new Date().toISOString(),
        };

        const response = await fetch(`${API_BASE_URL}/vehicles/${carId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
            Authorization: `Bearer ${authToken}`,
          } as HeadersInit,
          body: JSON.stringify(updatePayload),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to update Vehicle: ${response.status} ${response.statusText}`
          );
        }

        const result = await response.json();
        console.log("Updated car:", result); // Debug log

        // Update state with updated car
        setUsersCars((prev) =>
          prev.map((car) => (car.id === carId ? { ...car, ...result } : car))
        );
        toast.success("Car updated successfully!");

        // Force refresh to get updated data
        await fetchUserCars(true);

        return result;
      } catch (error) {
        console.error("Error updating user car:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        toast.error(`Error updating user car: ${errorMessage}`);
        setError(errorMessage);
        throw error; // Re-throw to handle in component
      } finally {
        setLoading(false);
      }
    },
    [currentUser, fetchUserCars]
  );

  // Auto-fetch cars when user is authenticated (only once)
  useEffect(() => {
    if (currentUser && !hasInitialLoad) {
      fetchUserCars();
    }
  }, [currentUser, hasInitialLoad, fetchUserCars]);

  // Reset state when user changes
  useEffect(() => {
    if (!currentUser) {
      setUsersCars([]);
      setHasInitialLoad(false);
      setError(null);
    }
  }, [currentUser]);

  return {
    usersCars,
    loading,
    error,
    fetchUserCars,
    addUserCar,
    updateUserCar,
    setUsersCars,
    hasInitialLoad, // Export this so components can check if initial load is complete
    isEmpty: hasInitialLoad && usersCars.length === 0 && !error, // Helper to check if truly empty
  };
};
