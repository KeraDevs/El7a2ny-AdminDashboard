import { useState, useCallback } from "react";
import { CarBrand } from "@/types/carTypes";
import { useAuth } from "@/contexts/AuthContext";
import { API_KEY, API_BASE_URL } from "@/utils/config";
import toast from "react-hot-toast";

export interface UseCarBrandsReturn {
  brands: CarBrand[];
  selectedBrands: string[];
  loading: boolean;
  error: string | null;
  fetchBrands: () => Promise<void>;
  handleEditBrand: (brandData: Partial<CarBrand>) => Promise<void>;
  handleDeleteBrands: () => Promise<void>;
  handleDeleteSingle: (brandId: string) => Promise<void>;
  handleSelectAll: (checked: boolean) => void;
  handleSelectBrand: (brandId: string) => void;
  handleAddBrand: (brandData: Partial<CarBrand>) => Promise<void>;
  setError: (error: string | null) => void;
  setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>;
}

export const useCarBrands = (): UseCarBrandsReturn => {
  const { currentUser } = useAuth();
  const [brands, setBrands] = useState<CarBrand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const fetchBrands = useCallback(async () => {
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

      const response = await fetch(`${API_BASE_URL}/car/brands`, {
        headers: {
          "x-api-key": API_KEY,
          Authorization: `Bearer ${authToken}`,
        } as HeadersInit,
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch brands: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("=== FETCH BRANDS DEBUG ===");
      console.log("API Response:", result);
      console.log("Is Array:", Array.isArray(result));
      console.log("Brands count:", Array.isArray(result) ? result.length : 0);
      if (Array.isArray(result) && result.length > 0) {
        console.log("First brand sample:", result[0]);
        console.log(
          "Brand IDs:",
          result.map((b) => `${b.id} (${typeof b.id})`)
        );
      }
      console.log("===========================");

      // Assuming the API returns an array of brands directly
      setBrands(Array.isArray(result) ? result : []);
    } catch (error) {
      toast.error("Error fetching car brands!");
      setError(
        error instanceof Error ? error.message : "Failed to fetch brands"
      );
      setBrands([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);
  // Add a new car brand
  const handleAddBrand = async (
    brandData: Partial<CarBrand>
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

      const requestBody = {
        name: brandData.name,
        region_ids: brandData.regionIds || [],
      };

      const url = `${API_BASE_URL}/car/brands`;
      console.log("Add Brand Request:", {
        url,
        method: "POST",
        body: requestBody,
        apiBaseUrl: API_BASE_URL,
        hasApiKey: !!API_KEY,
      });

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${authToken}`,
        } as HeadersInit,
        body: JSON.stringify(requestBody),
      });

      console.log("Add Brand Response:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Add Brand Error Response:", errorText);
        throw new Error(
          `Failed to add brand, status: ${response.status}. Response: ${errorText}`
        );
      }

      const newBrand = await response.json();
      console.log("Add Brand Success:", newBrand);

      setBrands((prev) => [...prev, newBrand]);
      toast.success("Car brand added successfully");
    } catch (error) {
      console.error("Add Brand Error:", error);
      toast.error("Error adding car brand");
      setError(error instanceof Error ? error.message : "Failed to add brand");
      throw error;
    } finally {
      setLoading(false);
    }
  };
  // Edit a car brand
  const handleEditBrand = async (
    brandData: Partial<CarBrand>
  ): Promise<void> => {
    if (!brandData.id) {
      throw new Error("Brand ID is required for editing");
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

      const requestBody = {
        id: brandData.id,
        name: brandData.name,
        regionIds: brandData.regionIds || [],
      };

      const url = `${API_BASE_URL}/car/brands/${brandData.id}`;

      console.log("=== EDIT BRAND DEBUG START ===");
      console.log("Brand ID:", brandData.id);
      console.log("Brand ID type:", typeof brandData.id);
      console.log("API_BASE_URL:", API_BASE_URL);
      console.log("Complete URL:", url);
      console.log("Request body:", JSON.stringify(requestBody, null, 2));
      console.log("API Key present:", !!API_KEY);
      console.log("Auth token present:", !!authToken);

      // Test if the brand exists with a GET request first
      console.log("Testing brand existence with GET request...");
      const testResponse = await fetch(url, {
        method: "GET",
        headers: {
          "x-api-key": API_KEY,
          Authorization: `Bearer ${authToken}`,
        } as HeadersInit,
      });
      console.log("GET test response status:", testResponse.status);
      if (!testResponse.ok) {
        console.log("GET test failed - brand may not exist");
        const testError = await testResponse.text();
        console.log("GET test error:", testError);
      } else {
        const testData = await testResponse.json();
        console.log("GET test success - brand exists:", testData);
      }
      console.log("=== END DEBUG INFO ===");
      const response = await fetch(url, {
        method: "PATCH", // Changed from PUT to PATCH
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${authToken}`,
        } as HeadersInit,
        body: JSON.stringify(requestBody),
      });

      console.log("=== RESPONSE DEBUG ===");
      console.log("Response status:", response.status);
      console.log("Response statusText:", response.statusText);
      console.log("Response ok:", response.ok);
      console.log("Response URL:", response.url);
      console.log("Response headers:", {
        "content-type": response.headers.get("content-type"),
        "content-length": response.headers.get("content-length"),
        server: response.headers.get("server"),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Edit Brand Error Response:", errorText);

        // If it's a 404, the brand might have been deleted, refresh the brands list
        if (response.status === 404) {
          console.log("Brand not found (404), refreshing brands list...");
          fetchBrands(); // Refresh the brands list
          throw new Error(
            `Brand not found. The brand may have been deleted. Please refresh and try again.`
          );
        }

        throw new Error(
          `Failed to edit brand, status: ${response.status}. Response: ${errorText}`
        );
      }

      const updatedBrand = await response.json();
      console.log("Edit Brand Success:", updatedBrand);

      setBrands((prev) =>
        prev.map((brand) =>
          brand.id === brandData.id ? { ...brand, ...updatedBrand } : brand
        )
      );
      toast.success("Car brand updated successfully");
    } catch (error) {
      toast.error("Error editing car brand");
      setError(error instanceof Error ? error.message : "Failed to edit brand");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete car brands
  const handleDeleteBrands = async (): Promise<void> => {
    if (!currentUser) {
      throw new Error("Authentication required");
    }

    if (selectedBrands.length === 0) {
      throw new Error("No brands selected for deletion");
    }

    try {
      setLoading(true);
      const authToken = await currentUser.getIdToken();

      if (!API_KEY) {
        throw new Error("API key is missing");
      }

      const deletePromises = selectedBrands.map(async (brandId) => {
        const response = await fetch(`${API_BASE_URL}/car/brands/${brandId}`, {
          method: "DELETE",
          headers: {
            "x-api-key": API_KEY,
            Authorization: `Bearer ${authToken}`,
          } as HeadersInit,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to delete brand ${brandId}: ${response.status}`
          );
        }
      });

      await Promise.all(deletePromises);

      // Update the local state to remove deleted brands
      setBrands((prev) =>
        prev.filter((brand) => !selectedBrands.includes(brand.id))
      );

      // Clear selection after successful deletion
      setSelectedBrands([]);

      toast.success(`Successfully deleted ${selectedBrands.length} brand(s)`);
    } catch (error) {
      toast.error(
        "Error deleting brands: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
      setError(
        error instanceof Error ? error.message : "Failed to delete brands"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete single car brand
  const handleDeleteSingle = async (brandId: string): Promise<void> => {
    if (!currentUser) {
      throw new Error("Authentication required");
    }

    try {
      setLoading(true);
      const authToken = await currentUser.getIdToken();

      if (!API_KEY) {
        throw new Error("API key is missing");
      }

      const response = await fetch(`${API_BASE_URL}/car/brands/${brandId}`, {
        method: "DELETE",
        headers: {
          "x-api-key": API_KEY,
          Authorization: `Bearer ${authToken}`,
        } as HeadersInit,
      });

      if (!response.ok) {
        throw new Error(`Failed to delete brand: ${response.status}`);
      }

      // Update the local state to remove deleted brand
      setBrands((prev) => prev.filter((brand) => brand.id !== brandId));

      // Remove from selected brands if it was selected
      setSelectedBrands((prev) => prev.filter((id) => id !== brandId));

      toast.success("Brand deleted successfully");
    } catch (error) {
      toast.error(
        "Error deleting brand: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
      setError(
        error instanceof Error ? error.message : "Failed to delete brand"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedBrands(checked ? brands.map((brand) => brand.id) : []);
  };

  const handleSelectBrand = (brandId: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };
  return {
    brands,
    selectedBrands,
    loading,
    error,
    fetchBrands,
    handleEditBrand,
    handleDeleteBrands,
    handleDeleteSingle,
    handleSelectAll,
    handleSelectBrand,
    handleAddBrand,
    setError,
    setSelectedBrands,
  };
};
