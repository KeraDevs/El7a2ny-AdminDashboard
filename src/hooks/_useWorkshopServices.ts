import { useState, useCallback } from "react";
import {
  WorkshopService,
  CreateWorkshopServiceData,
  UpdateWorkshopServiceData,
  BatchCreateWorkshopServiceData,
  WorkshopServicesResponse,
  WorkshopServicesPagination,
  WorkshopServicesStats,
} from "@/types/workshopServiceTypes";
import { Workshop } from "@/types/workshopTypes";
import { ServiceType } from "@/types/serviceTypes";
import { useAuth } from "@/contexts/AuthContext";
import { API_KEY, API_BASE_URL } from "@/utils/config";
import toast from "react-hot-toast";

export interface UseWorkshopServicesReturn {
  workshopServices: WorkshopService[];
  selectedWorkshopServices: string[];
  loading: boolean;
  error: string | null;
  pagination: WorkshopServicesPagination;
  stats: WorkshopServicesStats;
  editingWorkshopService: WorkshopService | null;
  openWorkshopServiceDialog: boolean;
  fetchWorkshopServices: (
    page?: number,
    limit?: number,
    searchQuery?: string,
    workshopId?: string
  ) => Promise<void>;
  fetchWorkshopServiceById: (
    workshopId: string,
    serviceTypeId: string
  ) => Promise<WorkshopService | null>;
  fetchServicesByWorkshop: (workshopId: string) => Promise<void>;
  fetchServicesByServiceType: (serviceTypeId: string) => Promise<void>;
  fetchWorkshopsByService: (serviceTypeId: string) => Promise<void>;
  handleAddWorkshopService: (
    serviceData: CreateWorkshopServiceData
  ) => Promise<void>;
  handleBatchCreateServices: (
    batchData: BatchCreateWorkshopServiceData
  ) => Promise<void>;
  handleEditWorkshopService: (
    workshopId: string,
    serviceTypeId: string,
    serviceData: UpdateWorkshopServiceData
  ) => Promise<void>;
  handleDeleteWorkshopService: (
    workshopId: string,
    serviceTypeId: string
  ) => Promise<void>;
  handleDeleteWorkshopServices: (serviceIds: string[]) => Promise<void>;
  handleSelectAll: (checked: boolean) => void;
  handleSelectWorkshopService: (serviceId: string) => void;
  setEditingWorkshopService: React.Dispatch<
    React.SetStateAction<WorkshopService | null>
  >;
  setOpenWorkshopServiceDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  refreshData: () => Promise<void>;
}

export const useWorkshopServices = (): UseWorkshopServicesReturn => {
  const { currentUser } = useAuth();
  const [workshopServices, setWorkshopServices] = useState<WorkshopService[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedWorkshopServices, setSelectedWorkshopServices] = useState<
    string[]
  >([]);
  const [editingWorkshopService, setEditingWorkshopService] =
    useState<WorkshopService | null>(null);
  const [openWorkshopServiceDialog, setOpenWorkshopServiceDialog] =
    useState(false);
  const [pagination, setPagination] = useState<WorkshopServicesPagination>({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
  });
  const [stats, setStats] = useState<WorkshopServicesStats>({
    totalServices: 0,
    averagePercentage: 0,
    workshopsWithServices: 0,
  });

  /**
   * Fetch workshop services by fetching workshops first, then their services
   * Enhanced to ensure workshop and service type data is populated
   */
  const fetchWorkshopServices = useCallback(
    async (page = 1, limit = 10, searchQuery = "", workshopId = "") => {
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

        // First, fetch all workshops
        let allWorkshops: Workshop[] = [];
        let hasMore = true;
        let offset = 0;
        const pageSize = 50;

        console.log("Fetching workshops first...");

        // Fetch all workshops in batches
        while (hasMore) {
          const response = await fetch(
            `${API_BASE_URL}/workshops?skip=${offset}&take=${pageSize}`,
            {
              headers: {
                "x-api-key": API_KEY,
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

          if (!response.ok) {
            if (response.status === 404) {
              console.log("No workshops found");
              break;
            }
            throw new Error(
              `Failed to fetch workshops: ${response.status} ${response.statusText}`
            );
          }

          const result = await response.json();
          const batchWorkshops = result.workshops || [];
          allWorkshops = [...allWorkshops, ...batchWorkshops];
          hasMore = result.hasMore;
          offset += pageSize;
        }

        console.log(`Found ${allWorkshops.length} workshops`);

        // Now fetch services for each workshop
        const allServices: WorkshopService[] = [];
        const workshopsWithServices = new Set<string>();

        // Also fetch service types to ensure we have the complete data
        const serviceTypesMap = new Map();
        try {
          console.log("Fetching service types...");
          // Try multiple possible endpoints for service types
          let serviceTypesResponse;

          // First try the most likely endpoint
          try {
            serviceTypesResponse = await fetch(
              `${API_BASE_URL}/service-types`,
              {
                headers: {
                  "x-api-key": API_KEY,
                  Authorization: `Bearer ${authToken}`,
                },
              }
            );
          } catch {
            console.warn(
              "Primary service-types endpoint failed, trying alternative..."
            );

            // Try alternative endpoint
            serviceTypesResponse = await fetch(`${API_BASE_URL}/services`, {
              headers: {
                "x-api-key": API_KEY,
                Authorization: `Bearer ${authToken}`,
              },
            });
          }

          if (serviceTypesResponse && serviceTypesResponse.ok) {
            const serviceTypesData = await serviceTypesResponse.json();
            const serviceTypes = Array.isArray(serviceTypesData)
              ? serviceTypesData
              : serviceTypesData.serviceTypes ||
                serviceTypesData.services ||
                [];

            serviceTypes.forEach((st: ServiceType) => {
              serviceTypesMap.set(st.id, st);
            });
            console.log(`Loaded ${serviceTypes.length} service types from API`);
          } else {
            console.warn("Failed to fetch service types from API");
          }
        } catch (err) {
          console.warn("Failed to fetch service types:", err);
        }

        for (const workshop of allWorkshops) {
          try {
            // If searching for a specific workshop, skip others
            if (workshopId && workshop.id !== workshopId) {
              continue;
            }

            console.log(`Fetching services for workshop: ${workshop.name}`);

            const servicesResponse = await fetch(
              `${API_BASE_URL}/workshops/services/get/${workshop.id}`,
              {
                headers: {
                  "x-api-key": API_KEY,
                  Authorization: `Bearer ${authToken}`,
                },
              }
            );

            if (servicesResponse.ok) {
              const servicesData = await servicesResponse.json();
              const services = Array.isArray(servicesData)
                ? servicesData
                : servicesData.services || [];

              // Add workshop info to each service and ensure all data is present
              const servicesWithWorkshop = services.map(
                (service: Record<string, unknown>, index: number) => {
                  // Handle different API response structures
                  const serviceAny = service as Record<string, unknown>;
                  const workshopData =
                    serviceAny.workshops || service.workshop || workshop;
                  const serviceTypeData =
                    serviceAny.service_types ||
                    service.service_type ||
                    serviceTypesMap.get(service.service_type_id);

                  // Get service type name - prioritize service_type name, then category as fallback
                  const serviceTypeName =
                    serviceTypeData?.name ||
                    serviceTypeData?.service_category ||
                    "Unknown Service";

                  const normalizedServiceType = {
                    id: service.service_type_id || serviceTypeData?.id || "",
                    name: serviceTypeName,
                    description:
                      serviceTypeData?.description ||
                      serviceTypeData?.description_ar ||
                      "",
                    service_category: serviceTypeData?.service_category || "",
                  };

                  const normalizedWorkshop = {
                    id: (workshopData as Workshop)?.id || workshop.id,
                    name: (workshopData as Workshop)?.name || workshop.name,
                    address:
                      (workshopData as Workshop)?.address || workshop.address,
                  };

                  // Ensure each service has a unique ID
                  const serviceId =
                    service.id ||
                    `ws-${normalizedWorkshop.id}-st-${service.service_type_id}` ||
                    `service-${normalizedWorkshop.id}-${index}`;

                  return {
                    ...service,
                    id: serviceId, // Ensure unique ID
                    percentage: service.percentage ?? 0, // Default to 0 if null
                    workshop: normalizedWorkshop,
                    service_type: normalizedServiceType,
                    workshop_id: normalizedWorkshop.id, // Ensure workshop_id is set
                    service_type_id: service.service_type_id, // Ensure service_type_id is set
                  };
                }
              );

              allServices.push(...servicesWithWorkshop);
              if (services.length > 0) {
                workshopsWithServices.add(workshop.id);
              }
              console.log(
                `Found ${services.length} services for ${workshop.name}`
              );
            } else if (servicesResponse.status === 404) {
              console.log(`No services found for workshop: ${workshop.name}`);
              // This is expected for workshops without services
            } else {
              console.warn(
                `Failed to fetch services for workshop ${workshop.name}: ${servicesResponse.status}`
              );
            }
          } catch (serviceError) {
            console.warn(
              `Error fetching services for workshop ${workshop.name}:`,
              serviceError
            );
            // Continue with other workshops
          }
        }

        console.log(`Total services found: ${allServices.length}`);

        // Apply search filter if provided
        let filteredServices = allServices;
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          filteredServices = allServices.filter(
            (service) =>
              service.workshop?.name?.toLowerCase().includes(query) ||
              service.service_type?.name?.toLowerCase().includes(query)
          );
        }

        // Apply pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedServices = filteredServices.slice(startIndex, endIndex);

        // Update state
        if (page === 1) {
          setWorkshopServices(paginatedServices);
        } else {
          setWorkshopServices((prev) => [...prev, ...paginatedServices]);
        }

        setPagination({
          page,
          limit,
          total: filteredServices.length,
          hasMore: endIndex < filteredServices.length,
        });

        // Calculate stats
        const validPercentages = filteredServices
          .map((s) => s.percentage)
          .filter(
            (p) => p !== null && p !== undefined && !isNaN(p)
          ) as number[];

        const totalPercentage = validPercentages.reduce((sum, p) => sum + p, 0);

        setStats({
          totalServices: filteredServices.length,
          averagePercentage:
            validPercentages.length > 0
              ? totalPercentage / validPercentages.length
              : 0,
          workshopsWithServices: workshopsWithServices.size,
        });
      } catch (err) {
        console.error("Error fetching workshop services:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to fetch workshop services";
        setError(errorMessage);

        // Set empty data for graceful handling
        setWorkshopServices([]);
        setPagination({
          page: 1,
          limit: 10,
          total: 0,
          hasMore: false,
        });
        setStats({
          totalServices: 0,
          averagePercentage: 0,
          workshopsWithServices: 0,
        });

        toast.error("Failed to fetch workshop services");
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  /**
   * Fetch a specific workshop service by workshop ID and service type ID
   */
  const fetchWorkshopServiceById = useCallback(
    async (
      workshopId: string,
      serviceTypeId: string
    ): Promise<WorkshopService | null> => {
      if (!currentUser) {
        setError("Authentication required");
        return null;
      }

      try {
        const authToken = await currentUser.getIdToken();
        if (!API_KEY) {
          throw new Error("API key is missing");
        }

        const response = await fetch(
          `${API_BASE_URL}/workshops/services/${workshopId}/${serviceTypeId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
              "x-api-key": API_KEY,
            },
          }
        );

        if (!response.ok) {
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            if (errorData.message) {
              errorMessage = errorData.message;
            }
          } catch {
            // If JSON parsing fails, use the status text
            errorMessage = `HTTP error! status: ${response.status} - ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        const service: WorkshopService = await response.json();
        return service;
      } catch (err) {
        console.error("Error fetching workshop service:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch workshop service"
        );
        return null;
      }
    },
    [currentUser]
  );

  /**
   * Fetch services by workshop ID using the correct endpoint
   */
  const fetchServicesByWorkshop = useCallback(
    async (workshopId: string) => {
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

        const response = await fetch(
          `${API_BASE_URL}/workshops/services/get/${workshopId}`,
          {
            headers: {
              "x-api-key": API_KEY,
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            // No services found for this workshop
            setWorkshopServices([]);
            setPagination({
              page: 1,
              limit: 10,
              total: 0,
              hasMore: false,
            });
            setStats({
              totalServices: 0,
              averagePercentage: 0,
              workshopsWithServices: 0,
            });
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const services = Array.isArray(data) ? data : data.services || [];

        // Ensure percentage is never null and service_type exists, handle API response structure
        const normalizedServices = services.map(
          (service: Record<string, unknown>, index: number) => {
            // Handle different API response structures
            const serviceAny = service as Record<string, unknown>;
            const workshopData = serviceAny.workshops || service.workshop;
            const serviceTypeData =
              serviceAny.service_types || service.service_type;

            // Get service type name - prioritize service_type name, then category as fallback
            const serviceTypeName =
              (serviceTypeData as ServiceType)?.name ||
              (serviceTypeData as ServiceType)?.service_category ||
              "Unknown Service";

            const normalizedServiceType = {
              id:
                service.service_type_id ||
                (serviceTypeData as ServiceType)?.id ||
                "",
              name: serviceTypeName,
              description:
                (serviceTypeData as ServiceType)?.description ||
                (serviceTypeData as ServiceType)?.description_ar ||
                "",
              service_category:
                (serviceTypeData as ServiceType)?.service_category || "",
            };

            const normalizedWorkshop = workshopData
              ? {
                  id: (workshopData as Workshop).id,
                  name: (workshopData as Workshop).name,
                  address: (workshopData as Workshop).address,
                }
              : undefined;

            // Generate unique ID if not provided
            const serviceId =
              service.id ||
              `ws-${(workshopData as Workshop)?.id || "unknown"}-st-${
                service.service_type_id
              }` ||
              `service-${index}`;

            return {
              ...service,
              id: serviceId,
              percentage: service.percentage ?? 0,
              service_type: normalizedServiceType,
              workshop: normalizedWorkshop,
              workshop_id:
                (workshopData as Workshop)?.id || service.workshop_id,
              service_type_id: service.service_type_id,
            };
          }
        );

        setWorkshopServices(normalizedServices);
        setPagination({
          page: 1,
          limit: normalizedServices.length,
          total: normalizedServices.length,
          hasMore: false,
        });

        const validPercentages = normalizedServices
          .map((s: WorkshopService) => s.percentage)
          .filter(
            (p: number | null | undefined): p is number =>
              p !== null && p !== undefined && !isNaN(p)
          );

        const totalPercentage = validPercentages.reduce(
          (sum: number, p: number) => sum + p,
          0
        );

        setStats({
          totalServices: normalizedServices.length,
          averagePercentage:
            validPercentages.length > 0
              ? totalPercentage / validPercentages.length
              : 0,
          workshopsWithServices: normalizedServices.length > 0 ? 1 : 0,
        });
      } catch (err) {
        console.error("Error fetching services by workshop:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch services"
        );

        // Set empty data
        setWorkshopServices([]);
        setPagination({
          page: 1,
          limit: 10,
          total: 0,
          hasMore: false,
        });
        setStats({
          totalServices: 0,
          averagePercentage: 0,
          workshopsWithServices: 0,
        });
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  /**
   * Fetch services by service type ID
   */
  const fetchServicesByServiceType = useCallback(
    async (serviceTypeId: string) => {
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

        const response = await fetch(
          `${API_BASE_URL}/workshops/services/service/type/${serviceTypeId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
              "x-api-key": API_KEY,
            },
          }
        );

        if (!response.ok) {
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            if (errorData.message) {
              errorMessage = errorData.message;
            }
          } catch {
            // If JSON parsing fails, use the status text
            errorMessage = `HTTP error! status: ${response.status} - ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        const data: WorkshopServicesResponse = await response.json();
        setWorkshopServices(data.services || []);
      } catch (err) {
        console.error("Error fetching services by type:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch services"
        );
        toast.error("Failed to fetch services");
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  /**
   * Fetch workshops by service type ID
   */
  const fetchWorkshopsByService = useCallback(
    async (serviceTypeId: string) => {
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

        const response = await fetch(
          `${API_BASE_URL}/workshops/services/workshops/byService/${serviceTypeId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
              "x-api-key": API_KEY,
            },
          }
        );

        if (!response.ok) {
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            if (errorData.message) {
              errorMessage = errorData.message;
            }
          } catch {
            // If JSON parsing fails, use the status text
            errorMessage = `HTTP error! status: ${response.status} - ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        // This endpoint returns workshops, not services, so we might need to handle it differently
        console.log("Workshops providing service:", data);
      } catch (err) {
        console.error("Error fetching workshops by service:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch workshops"
        );
        toast.error("Failed to fetch workshops");
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  /**
   * Add a new workshop service
   */
  const handleAddWorkshopService = useCallback(
    async (serviceData: CreateWorkshopServiceData) => {
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

        const response = await fetch(
          `${API_BASE_URL}/workshops/services/create/${serviceData.workshop_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
              "x-api-key": API_KEY,
            },
            body: JSON.stringify({
              service_type_id: serviceData.service_type_id,
              percentage: serviceData.percentage,
            }),
          }
        );

        if (!response.ok) {
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            if (errorData.message) {
              errorMessage = errorData.message;

              // Handle specific constraint violations
              if (
                errorData.message.includes("Unique constraint failed") ||
                errorData.message.includes("workshop_id") ||
                errorData.message.includes("service_type_id")
              ) {
                errorMessage =
                  "This service already exists for the selected workshop. Please choose a different service type.";
              }
            }
          } catch {
            // If JSON parsing fails, use the status text
            errorMessage = `HTTP error! status: ${response.status} - ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        const newService: WorkshopService = await response.json();
        setWorkshopServices((prev) => [newService, ...prev]);
        toast.success("Workshop service added successfully");
      } catch (err) {
        console.error("Error adding workshop service:", err);
        setError(
          err instanceof Error ? err.message : "Failed to add workshop service"
        );
        toast.error("Failed to add workshop service");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  const handleBatchCreateServices = useCallback(
    async (batchData: BatchCreateWorkshopServiceData) => {
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

        const response = await fetch(
          `${API_BASE_URL}/workshops/services/batch/${batchData.workshop_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
              "x-api-key": API_KEY,
            },
            body: JSON.stringify({
              services: batchData.services.map((service) => ({
                service_type_id: service.service_type_id,
                percentage: service.percentage,
              })),
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            `Batch Create API Error: ${response.status} - ${errorText}`
          );

          // Handle specific error cases
          if (response.status === 404) {
            throw new Error(
              "Workshop not found. Please select a valid workshop."
            );
          } else if (response.status === 400) {
            throw new Error("Invalid service data. Please check your inputs.");
          } else if (response.status === 409) {
            throw new Error(
              "One or more services already exist for this workshop."
            );
          }

          throw new Error(
            `API Error: ${response.status} - ${response.statusText}`
          );
        }

        const result = await response.json();
        // Handle the response properly - it might be an array or an object with services array
        const newServices: WorkshopService[] = Array.isArray(result)
          ? result
          : result.services || [];

        if (newServices.length > 0) {
          setWorkshopServices((prev) => [...newServices, ...prev]);
          toast.success(
            `${newServices.length} workshop services added successfully`
          );
        } else {
          toast.success("Workshop services added successfully");
        }
      } catch (err) {
        console.error("Error batch creating workshop services:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to batch create workshop services";
        setError(errorMessage);
        // Don't show toast here as it's handled in the component
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  /**
   * Edit a workshop service
   */
  const handleEditWorkshopService = useCallback(
    async (
      workshopId: string,
      serviceTypeId: string,
      serviceData: UpdateWorkshopServiceData
    ) => {
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

        console.log("Updating workshop service:", {
          workshopId,
          serviceTypeId,
          serviceData,
        });

        const response = await fetch(
          `${API_BASE_URL}/workshops/services/${workshopId}/${serviceTypeId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
              "x-api-key": API_KEY,
            },
            body: JSON.stringify(serviceData),
          }
        );

        console.log("Update response status:", response.status);

        if (!response.ok) {
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            console.error("Update error data:", errorData);
            if (errorData.message) {
              errorMessage = errorData.message;
            }
          } catch {
            // If JSON parsing fails, use the status text
            errorMessage = `HTTP error! status: ${response.status} - ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        const updatedService: WorkshopService = await response.json();
        console.log("Updated service received:", updatedService);

        // Update the service in the list while preserving all existing data
        setWorkshopServices((prev) =>
          prev.map((service) => {
            if (
              service.workshop_id === workshopId &&
              service.service_type_id === serviceTypeId
            ) {
              const updated = {
                ...service, // Preserve existing data (workshop, service_type, etc.)
                ...updatedService, // Apply the updates
                service_type: service.service_type, // Ensure service_type is preserved
                workshop: service.workshop, // Ensure workshop is preserved
                percentage:
                  updatedService.percentage ??
                  serviceData.percentage ??
                  service.percentage, // Ensure percentage is updated
              };
              console.log("Updated service in state:", updated);
              return updated;
            }
            return service;
          })
        );
        toast.success("Workshop service updated successfully");
      } catch (err) {
        console.error("Error updating workshop service:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to update workshop service"
        );
        toast.error("Failed to update workshop service");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  /**
   * Delete a workshop service
   */
  const handleDeleteWorkshopService = useCallback(
    async (workshopId: string, serviceTypeId: string) => {
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

        const response = await fetch(
          `${API_BASE_URL}/workshops/services/${workshopId}/${serviceTypeId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
              "x-api-key": API_KEY,
            },
          }
        );

        if (!response.ok) {
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            if (errorData.message) {
              errorMessage = errorData.message;
            }
          } catch {
            // If JSON parsing fails, use the status text
            errorMessage = `HTTP error! status: ${response.status} - ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        setWorkshopServices((prev) =>
          prev.filter(
            (service) =>
              !(
                service.workshop_id === workshopId &&
                service.service_type_id === serviceTypeId
              )
          )
        );
        toast.success("Workshop service deleted successfully");
      } catch (err) {
        console.error("Error deleting workshop service:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to delete workshop service"
        );
        toast.error("Failed to delete workshop service");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  /**
   * Delete multiple workshop services
   */
  const handleDeleteWorkshopServices = useCallback(
    async (serviceIds: string[]) => {
      if (!currentUser) {
        setError("Authentication required");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (!API_KEY) {
          throw new Error("API key is missing");
        }

        // Since we don't have a batch delete endpoint, delete services one by one
        for (const serviceId of serviceIds) {
          const service = workshopServices.find((s) => s.id === serviceId);
          if (service) {
            await handleDeleteWorkshopService(
              service.workshop_id,
              service.service_type_id
            );
          }
        }

        toast.success(
          `${serviceIds.length} workshop services deleted successfully`
        );
      } catch (err) {
        console.error("Error deleting workshop services:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to delete workshop services"
        );
        toast.error("Failed to delete workshop services");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentUser, workshopServices, handleDeleteWorkshopService]
  );

  /**
   * Handle select all workshop services
   */
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedWorkshopServices(
          workshopServices.map((service) => service.id)
        );
      } else {
        setSelectedWorkshopServices([]);
      }
    },
    [workshopServices]
  );

  /**
   * Handle select individual workshop service
   */
  const handleSelectWorkshopService = useCallback((serviceId: string) => {
    setSelectedWorkshopServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  }, []);

  /**
   * Refresh data
   */
  const refreshData = useCallback(async () => {
    await fetchWorkshopServices(1, pagination.limit);
  }, [fetchWorkshopServices, pagination.limit]);

  return {
    workshopServices,
    selectedWorkshopServices,
    loading,
    error,
    pagination,
    stats,
    editingWorkshopService,
    openWorkshopServiceDialog,
    fetchWorkshopServices,
    fetchWorkshopServiceById,
    fetchServicesByWorkshop,
    fetchServicesByServiceType,
    fetchWorkshopsByService,
    handleAddWorkshopService,
    handleBatchCreateServices,
    handleEditWorkshopService,
    handleDeleteWorkshopService,
    handleDeleteWorkshopServices,
    handleSelectAll,
    handleSelectWorkshopService,
    setEditingWorkshopService,
    setOpenWorkshopServiceDialog,
    setError,
    refreshData,
  };
};
